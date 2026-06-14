import { useState } from "react";
import { IrisPredictionRequest, fetchIrisPrediction, fetchGemini } from "../api";
import { ArrowRight, Sparkles, ServerCog } from "lucide-react";

export function BackendPredictor() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handlePredict = async () => {
    setIsLoading(true);
    setMessage(null);
    setPrediction(null);
    setConfidence(null);

    const payload: IrisPredictionRequest = {
      sepalLength: 5.1,
      sepalWidth: 3.5,
      petalLength: 1.4,
      petalWidth: 0.2,
    };

    try {
      const result = await fetchIrisPrediction(payload);
      setPrediction(result.species);
      setConfidence(result.confidence);
      setMessage("Prediction fetched from backend API.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGemini = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await fetchGemini("Explain how Iris classification works for sepal/petal features.");
      setMessage(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-5 space-y-4">
      <div className="flex items-center gap-2 text-slate-800">
        <ServerCog className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="text-sm font-bold">Backend API Integration</h3>
          <p className="text-[11px] text-slate-500">Uses `/api/predict` and `/api/gemini` through the Express dev server.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-semibold text-[11px] transition"
        >
          {isLoading ? "Requesting..." : "Run Iris Backend Predict"}
        </button>
        <button
          onClick={handleGemini}
          disabled={isLoading}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-[11px] transition"
        >
          {isLoading ? "Contacting Gemini..." : "Call Gemini via Backend"}
        </button>
      </div>

      <div className="rounded border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700 font-mono min-h-[92px]">
        {message ? <pre className="whitespace-pre-wrap break-words">{message}</pre> : <span className="text-slate-500">Response output will appear here.</span>}
      </div>

      {prediction && confidence !== null ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-3 text-[12px] text-emerald-900">
          <p className="font-semibold">Backend prediction:</p>
          <p>{prediction}</p>
          <p>Confidence: {(confidence * 100).toFixed(1)}%</p>
        </div>
      ) : null}

      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
        <ArrowRight className="w-3 h-3" />
        <span>Ensure `GEMINI_API_KEY` is set in `.env.local` for Gemini API calls.</span>
      </div>
    </div>
  );
}
