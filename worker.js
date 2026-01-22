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
        let body;
        try {
          body = await request.json();
        } catch (e) {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
             status: 400,
             headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { text, audio } = body;

        if (!text && !audio) {
          return new Response(JSON.stringify({ error: "Input text or audio is required." }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 3. Call Gemini API
        const ai = new GoogleGenAI({ apiKey });
        
        let contents = [];
        
        if (audio) {
            // Multimodal Request (Audio + Instructions)
            // Ensure mimeType is valid. If frontend sent empty string, fallback to a safe default but log it.
            const mimeType = audio.mimeType || "audio/webm";
            
            contents = [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: audio.data
                    }
                },
                {
                    text: `You are an expert Hate Speech Detection system.
                    
                    TASK:
                    1. Listen to the audio provided.
                    2. Transcribe the speech exactly as spoken into the 'transcription' field.
                    3. Analyze the sentiment, tone, and vocabulary.
                    4. Classify it into exactly one of these three categories:
                       - "Hate Speech" (Direct attacks, slurs, threats based on protected characteristics)
                       - "Offensive Language" (Vulgar, rude, insults, profanity, but NOT hate speech)
                       - "Normal Speech" (Neutral, benign, or positive)

                    IMPORTANT:
                    - If the audio is silent or unintelligible, return "Normal Speech" and explain that no speech was detected.
                    - If the audio is short/cut off but contains a slur, classify based on available context.
                    
                    Return JSON with 'label', 'confidence' (0.0-1.0), 'explanation', and 'transcription'.`
                }
            ];
        } else {
            // Text Request
            contents = [
                {
                    text: `Act as a refined Machine Learning classifier trained on the Davidson Hate Speech Dataset.
                    Your task is to classify the provided text into one of three categories:
                    1. Hate Speech (Racist, sexist, or directed hate towards a protected group)
                    2. Offensive Language (Vulgar, rude, or inappropriate, but not hate speech)
                    3. Normal Speech (Neutral, positive, or benign)
                    
                    If the text is nonsense, too short, or meaningless (like "kc", "asdf"), classify it as "Normal Speech" with low confidence.

                    Analyze the text accurately. Provide a confidence score (0.0 to 1.0) and a brief academic explanation.
                    
                    Text to analyze: "${text}"`
                }
            ];
        }
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview", // Supports multimodal
          contents: contents,
          config: {
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            // We use BLOCK_NONE to ensure the model actually processes the offensive content for classification
            // rather than refusing to answer.
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
                transcription: {
                  type: Type.STRING,
                  description: "The text extracted from the audio (if audio provided), or the input text.",
                }
              },
              required: ["label", "confidence", "explanation"],
            },
          },
        });

        const resultJSON = response.text;
        
        if (!resultJSON) {
           throw new Error("Model returned empty response.");
        }
        
        return new Response(resultJSON, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error("Worker Execution Error:", error);
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