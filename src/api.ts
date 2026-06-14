export interface IrisPredictionRequest {
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
}

export interface IrisPredictionResponse {
  species: string;
  confidence: number;
  source: "backend" | "client";
}

export async function fetchIrisPrediction(payload: IrisPredictionRequest): Promise<IrisPredictionResponse> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || `Prediction request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchGemini(prompt: string) {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || `Gemini request failed with status ${response.status}`);
  }

  return response.json();
}
