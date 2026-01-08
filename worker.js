import { GoogleGenAI, Type } from "@google/genai";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- API Route: Handle Prediction Requests ---
    if (url.pathname === '/api/predict' && request.method === 'POST') {
      try {
        // 1. Securely access the API Key from Cloudflare Worker Environment Variables
        const apiKey = env.API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ 
            error: 'Server Error: API Key is not configured in Cloudflare Worker settings.' 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 2. Parse User Input
        const { text } = await request.json();

        // 3. Call Gemini API
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `
            Act as a refined Machine Learning classifier trained on the Davidson Hate Speech Dataset.
            Your task is to classify the provided text into one of three categories:
            1. Hate Speech (Racist, sexist, or directed hate towards a protected group)
            2. Offensive Language (Vulgar, rude, or inappropriate, but not hate speech)
            3. Normal Speech (Neutral, positive, or benign)

            Analyze the text accurately. Provide a confidence score (0.0 to 1.0) and a brief academic explanation of why it fits that class.

            Text to analyze: "${text}"
          `,
          config: {
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                label: {
                  type: Type.STRING,
                  enum: [
                    'Hate Speech',
                    'Offensive Language',
                    'Normal Speech'
                  ],
                },
                confidence: {
                  type: Type.NUMBER,
                  description: "Confidence score between 0 and 1",
                },
                explanation: {
                  type: Type.STRING,
                  description: "A brief sentence explaining the classification logic.",
                },
              },
              required: ["label", "confidence", "explanation"],
            },
          },
        });

        // 4. Return the result
        // Using response.text property as per SDK guidelines (not a function)
        const resultJSON = response.text; 
        
        return new Response(resultJSON, {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error("Worker Error:", error);
        return new Response(JSON.stringify({ error: "Failed to process request. " + error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // --- Static Asset Serving ---
    // Explicitly serve index.html for root path
    if (url.pathname === '/') {
       const response = await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
       if (response.status === 200) return response;
    }

    // Attempt to fetch the requested asset
    let response = await env.ASSETS.fetch(request);

    // SPA Fallback: If 404 and not a file (no extension), serve index.html
    if (response.status === 404 && !url.pathname.includes('.')) {
      response = await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
    }

    return response;
  },
};
