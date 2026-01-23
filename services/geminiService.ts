
import { PredictionResult, ClassLabel, FileAnalysisResult } from "../types";

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

export const analyzeAudioFile = async (file: File): Promise<FileAnalysisResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/analyze-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audio: {
              data: base64Data,
              mimeType: file.type || 'audio/mp3'
            }
          })
        });

        if (!response.ok) {
           const errorText = await response.text();
           throw new Error(`Analysis failed: ${errorText}`);
        }

        const data = await response.json();
        resolve(data as FileAnalysisResult);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
