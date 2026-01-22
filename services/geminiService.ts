import { PredictionResult, ClassLabel } from "../types";

export const analyzeText = async (
  text?: string, 
  audio?: { data: string, mimeType: string }
): Promise<PredictionResult> => {
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send text, audio, or both
      body: JSON.stringify({ text, audio }),
    });

    // Handle non-OK responses (4xx, 5xx)
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server Error ${response.status}`);
      } else {
        // If the server returns HTML (e.g. Cloudflare error page) or text, read it
        const errorText = await response.text();
        const shortError = errorText.slice(0, 100); 
        throw new Error(`Server Error (${response.status}): ${shortError}...`);
      }
    }

    const result = await response.json();
    
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
    // Re-throw the exact error so Demo.tsx displays it
    throw error;
  }
};