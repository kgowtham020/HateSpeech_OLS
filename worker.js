
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";

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

    // --- API Route: Handle Prediction Requests (Existing) ---
    if (url.pathname === '/api/predict' && request.method === 'POST') {
      try {
        const apiKey = env.API_KEY;
        if (!apiKey) throw new Error("API_KEY missing");

        let body;
        try { body = await request.json(); } catch(e) { throw new Error("Invalid JSON"); }
        const { text, audio } = body;

        const ai = new GoogleGenAI({ apiKey });
        
        let contents;
        if (audio) {
            const mimeType = audio.mimeType || "audio/webm";
            contents = {
              parts: [
                { inlineData: { mimeType: mimeType, data: audio.data } },
                { text: `You are an expert Hate Speech Detection system.
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
                    - Do not repeat the same text repeatedly. Avoid looping content.
                    
                    Return JSON with 'label', 'confidence' (0.0-1.0), 'explanation', and 'transcription'.` }
              ]
            };
        } else {
            contents = {
              parts: [
                { text: `Act as a refined Machine Learning classifier trained on the Davidson Hate Speech Dataset.
                    Classify the text into: Hate Speech, Offensive Language, or Normal Speech.
                    Text: "${text}"` }
              ]
            };
        }
        
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-preview",
          contents: contents,
          config: {
            responseMimeType: "application/json",
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
            ],
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, enum: ['Hate Speech', 'Offensive Language', 'Normal Speech'] },
                confidence: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                transcription: { type: Type.STRING }
              },
              required: ["label", "confidence", "explanation"],
            },
          },
        });

        let cleanText = (response.text || "{}").trim();
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.substring(7);
        }
        if (cleanText.endsWith('```')) {
            cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        
        return new Response(cleanText.trim(), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message || String(error) }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // --- API Route: Handle File Analysis (New) ---
    if (url.pathname === '/api/analyze-file' && request.method === 'POST') {
      try {
        const apiKey = env.API_KEY;
        if (!apiKey) throw new Error("API_KEY missing");

        const body = await request.json();
        const { audio } = body;
        if (!audio) throw new Error("Audio data required");

        const ai = new GoogleGenAI({ apiKey });

        // Step 1: Transcribe and Analyze
        const analysisResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-preview",
          contents: {
            parts: [
              { inlineData: { mimeType: audio.mimeType, data: audio.data } },
              { text: `Analyze this audio file. 
                       1. Transcribe it accurately.
                       2. Summarize the content in one sentence.
                       3. Determine the intent of the speaker.
                       4. Extract 3 key points.
                       
                       IMPORTANT:
                       - If the audio is silent or unintelligible, state that no speech was detected.
                       - Do not repeat the same text repeatedly. Avoid looping content.` }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                transcription: { type: Type.STRING },
                summary: { type: Type.STRING },
                intent: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["transcription", "summary", "intent", "keyPoints"]
            }
          }
        });

        let analysisData;
        try {
          let cleanText = (analysisResponse.text || "{}").trim();
          if (cleanText.startsWith('```json')) {
              cleanText = cleanText.substring(7);
          }
          if (cleanText.endsWith('```')) {
              cleanText = cleanText.substring(0, cleanText.length - 3);
          }
          analysisData = JSON.parse(cleanText.trim());
        } catch (e) {
          console.error("JSON Parse Error:", analysisResponse.text);
          throw new Error("Failed to parse model response as JSON");
        }

        // Step 2: Generate Embeddings (if transcription exists)
        // Removed to speed up the analysis response
        let embeddingValues = [];

        // Combine Data
        const finalResult = {
          ...analysisData,
          embedding: embeddingValues // Return empty array to keep UI compatible
        };

        return new Response(JSON.stringify(finalResult), {
           headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message || String(error) }), {
           status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
