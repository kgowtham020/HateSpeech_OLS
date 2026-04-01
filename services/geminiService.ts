
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { PredictionResult, ClassLabel, FileAnalysisResult } from "../types";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeText = async (
  text?: string, 
  audio?: { data: string, mimeType: string }
): Promise<PredictionResult> => {
  try {
    // Try calling the backend proxy first (works in production via Cloudflare Worker)
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, audio })
      });

      if (response.ok) {
        const result = await response.json();
        if (!result.label) {
          return {
            label: ClassLabel.NORMAL,
            confidence: 0.0,
            explanation: "Could not classify input. The model returned a valid response but missing label.",
          };
        }
        return result as PredictionResult;
      } else {
        // If it's a 404 on localhost, we let it fall through to the fallback.
        // Otherwise, we throw the error.
        if (response.status === 404 && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
           // Let it fall through to fallback
        } else {
           const errData = await response.json().catch(() => ({}));
           throw new Error(errData.error || `Backend returned ${response.status}`);
        }
      }
    } catch (fetchError: any) {
      // If fetch fails completely (e.g. network error) or it's not a 404, we might want to throw.
      // But if it's a 404 or Failed to fetch, we catch and fallback.
      if (fetchError.message && !fetchError.message.includes('404') && !fetchError.message.includes('Failed to fetch')) {
        throw fetchError;
      }
      // Let it fall through to fallback
    }

    // Fallback: Direct API call for local development (Vite)
    const ai = getAI();
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

    let result;
    try {
      let cleanText = (response.text || "{}").trim();
      if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
      }
      if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      result = JSON.parse(cleanText.trim());
    } catch (e) {
      console.error("JSON Parse Error:", response.text);
      result = {};
    }
    
    if (!result.label) {
      return {
        label: ClassLabel.NORMAL,
        confidence: 0.0,
        explanation: "Could not classify input. The model returned a valid response but missing label.",
      };
    }

    return result as PredictionResult;

  } catch (error: any) {
    console.error("Error analyzing input:", error);
    throw error;
  }
};

export const analyzeAudioFile = async (file: File): Promise<FileAnalysisResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const mimeType = file.type || 'audio/mpeg';

        // Try calling the backend proxy first (works in production via Cloudflare Worker)
        try {
          const response = await fetch('/api/analyze-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: { data: base64Data, mimeType } })
          });

          if (response.ok) {
            const result = await response.json();
            return resolve(result as FileAnalysisResult);
          } else {
            if (response.status === 404 || response.status === 502) {
               // Let it fall through to fallback
            } else {
               const errData = await response.json().catch(() => ({}));
               throw new Error(errData.error || `Backend returned ${response.status}`);
            }
          }
        } catch (fetchError: any) {
          if (fetchError.message && !fetchError.message.includes('404') && !fetchError.message.includes('Failed to fetch')) {
            throw fetchError;
          }
          // Let it fall through to fallback
        }

        // Fallback: Direct API call for local development (Vite)
        const ai = getAI();

        // Step 1: Transcribe and Analyze
        const analysisResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-preview",
          contents: {
            parts: [
              { inlineData: { mimeType, data: base64Data } },
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
          analysisData = {};
        }

        // Step 2: Generate Embeddings (if transcription exists)
        // Removed to speed up the analysis response
        let embeddingValues: number[] = [];

        // Combine Data
        const finalResult = {
          ...analysisData,
          embedding: embeddingValues // Return empty array to keep UI compatible
        };

        resolve(finalResult as FileAnalysisResult);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
