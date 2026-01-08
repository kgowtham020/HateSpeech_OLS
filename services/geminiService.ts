import { PredictionResult, ClassLabel } from "../types";

export const analyzeText = async (text: string): Promise<PredictionResult> => {
  try {
    // Call the backend API hosted on the Cloudflare Worker
    // We use a relative path '/api/predict' so it works automatically on the deployed domain
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const result = await response.json();
    
    // Validate result structure
    if (!result.label) {
      return {
        label: ClassLabel.NORMAL,
        confidence: 0.0,
        explanation: "Could not classify text. The model returned an empty response.",
      };
    }

    return result as PredictionResult;

  } catch (error) {
    console.error("Error analyzing text:", error);
    throw new Error("Model inference failed. Please try again later.");
  }
};