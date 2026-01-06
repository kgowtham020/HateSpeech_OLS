import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult, ClassLabel } from "../types";

export const analyzeText = async (text: string): Promise<PredictionResult> => {
  // Access the API key injected by Vite
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY is not defined");
    throw new Error("API Key is missing. Please configure the API_KEY environment variable in your deployment settings.");
  }

  try {
    // Initialize the client lazily to avoid top-level crashes
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
        // Optimize for speed by setting thinking budget to 0
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: {
              type: Type.STRING,
              enum: [
                ClassLabel.HATE_SPEECH,
                ClassLabel.OFFENSIVE_LANGUAGE,
                ClassLabel.NORMAL,
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

    const result = JSON.parse(response.text || "{}");
    
    // Fallback if parsing fails or returns empty
    if (!result.label) {
      return {
        label: ClassLabel.NORMAL,
        confidence: 0.0,
        explanation: "Could not classify text. Please try again.",
      };
    }

    return result as PredictionResult;

  } catch (error) {
    console.error("Error analyzing text:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
        throw error;
    }
    throw new Error("Model inference failed. Please check your API connection.");
  }
};