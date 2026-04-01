
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { PredictionResult, ClassLabel, FileAnalysisResult } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
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
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
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

    const result = JSON.parse(response.text || "{}");
    
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
        const ai = getAI();

        // Step 1: Transcribe and Analyze
        const analysisResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: {
            parts: [
              { inlineData: { mimeType: file.type || 'audio/mpeg', data: base64Data } },
              { text: `Analyze this audio file. 
                       1. Transcribe it accurately.
                       2. Summarize the content in one sentence.
                       3. Determine the intent of the speaker.
                       4. Extract 3 key points.` }
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

        const analysisData = JSON.parse(analysisResponse.text || "{}");

        // Step 2: Generate Embeddings (if transcription exists)
        let embeddingValues: number[] = [];
        if (analysisData.transcription && analysisData.transcription.trim().length > 0) {
           const embedResponse = await ai.models.embedContent({
             model: "gemini-embedding-2-preview",
             contents: [analysisData.transcription]
           });
           embeddingValues = embedResponse.embeddings?.[0]?.values || [];
        }

        // Combine Data
        const finalResult = {
          ...analysisData,
          embedding: embeddingValues.slice(0, 50) // Return subset for demo visualization to save bandwidth/ui space
        };

        resolve(finalResult as FileAnalysisResult);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
