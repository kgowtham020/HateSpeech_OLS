import { GoogleGenAI, Type } from "@google/genai";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Standard CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle Preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // --- API Route: Handle Prediction Requests ---
    if (url.pathname === '/api/predict' && request.method === 'POST') {
      try {
        // 1. Securely access the API Key
        const apiKey = env.API_KEY;
        if (!apiKey) {
          console.error("API_KEY is missing in environment variables.");
          return new Response(JSON.stringify({ 
            error: 'Configuration Error: API_KEY is missing in Cloudflare settings.' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 2. Parse User Input
        let text;
        try {
          const body = await request.json();
          text = body.text;
        } catch (e) {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
             status: 400,
             headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        if (!text || typeof text !== 'string' || !text.trim()) {
          return new Response(JSON.stringify({ error: "Input text is required and cannot be empty." }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 3. Call Gemini API
        const ai = new GoogleGenAI({ apiKey });
        
        // Handle short/nonsense inputs by adjusting prompt slightly
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `
            Act as a refined Machine Learning classifier trained on the Davidson Hate Speech Dataset.
            Your task is to classify the provided text into one of three categories:
            1. Hate Speech (Racist, sexist, or directed hate towards a protected group)
            2. Offensive Language (Vulgar, rude, or inappropriate, but not hate speech)
            3. Normal Speech (Neutral, positive, or benign)
            
            If the text is nonsense, too short, or meaningless (like "kc", "asdf"), classify it as "Normal Speech" with low confidence.

            Analyze the text accurately. Provide a confidence score (0.0 to 1.0) and a brief academic explanation.
            
            Text to analyze: "${text}"
          `,
          config: {
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            safetySettings: [
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ],
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
        const resultJSON = response.text;
        
        if (!resultJSON) {
           throw new Error("Model returned empty response (possibly blocked or filtered).");
        }
        
        return new Response(resultJSON, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error("Worker Execution Error:", error);
        // Return the exact error message to the client for debugging
        return new Response(JSON.stringify({ 
          error: `Worker Error: ${error.message || error.toString()}` 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // --- Static Asset Serving ---
    try {
      if (url.pathname === '/') {
        const response = await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
        if (response.status === 200) return response;
      }

      let response = await env.ASSETS.fetch(request);

      if (response.status === 404 && !url.pathname.includes('.')) {
        response = await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
      }

      return response;
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  },
};