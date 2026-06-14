import { useState, useEffect } from "react";
import { Sparkles, Sliders, CheckCircle } from "lucide-react";
import { SPECIES_NAMES } from "../ml/algorithms";

interface PredictorSystemProps {
  trainResults: any;
}

export function PredictorSystem({ trainResults }: PredictorSystemProps) {
  const [selectedModelKey, setSelectedModelKey] = useState<"lr" | "dt" | "rf" | "knn" | "svm">("rf");
  
  // Predictor feature values
  const [sepalLength, setSepalLength] = useState<number>(5.1);
  const [sepalWidth, setSepalWidth] = useState<number>(3.5);
  const [petalLength, setPetalLength] = useState<number>(1.4);
  const [petalWidth, setPetalWidth] = useState<number>(0.2);

  const [prediction, setPrediction] = useState<string>("Iris-setosa");
  const [probabilities, setProbabilities] = useState<number[] | null>(null);

  // Sync inputs dynamically
  useEffect(() => {
    if (!trainResults) return;

    const pipelineModel = trainResults.models[selectedModelKey].model;
    const featuresVector = [sepalLength, sepalWidth, petalLength, petalWidth];

    // Predict species index
    let predictedIdx = 0;
    let computedProbs: number[] | null = null;

    if (selectedModelKey === "lr") {
      computedProbs = pipelineModel.predictProbs(featuresVector);
      predictedIdx = computedProbs.indexOf(Math.max(...computedProbs));
    } else if (selectedModelKey === "rf") {
      computedProbs = pipelineModel.predictRowProbs(featuresVector);
      predictedIdx = computedProbs.indexOf(Math.max(...computedProbs));
    } else {
      predictedIdx = pipelineModel.predictRow(featuresVector);
    }

    setPrediction(SPECIES_NAMES[predictedIdx]);
    setProbabilities(computedProbs);
  }, [sepalLength, sepalWidth, petalLength, petalWidth, selectedModelKey, trainResults]);

  const handleLoadSample = (sLen: number, sWid: number, pLen: number, pWid: number) => {
    setSepalLength(sLen);
    setSepalWidth(sWid);
    setPetalLength(pLen);
    setPetalWidth(pWid);
  };

  const handleTextChange = (valStr: string, min: number, max: number, setter: (v: number) => void) => {
    const val = parseFloat(valStr);
    if (!isNaN(val)) {
      // Clamp values safely
      const clamped = Math.max(min, Math.min(max, val));
      setter(clamped);
    }
  };

  // Botanical Illustration vectors computed using responsive high density SVG blocks
  const renderBotanicalIllustration = (species: string) => {
    if (species === "Iris-setosa") {
      return (
        <svg viewBox="0 0 100 120" className="w-28 h-28 mx-auto drop-shadow-sm select-none animate-bounce-slow">
          <path d="M 50 120 C 50 90, 48 70, 48 40" stroke="#10b981" strokeWidth="2.5" fill="none" />
          <path d="M 48 100 C 30 85, 25 70, 20 50" stroke="#10b981" strokeWidth="2.0" fill="none" />
          <path d="M 50 90 C 65 75, 70 65, 75 45" stroke="#10b981" strokeWidth="2.0" fill="none" />
          <circle cx="48" cy="40" r="10" fill="#14b8a6" fillOpacity="0.8" />
          <path d="M 48 40 C 30 20, 25 15, 20 10 C 25 35, 35 40, 48 40" fill="#0d9488" fillOpacity="0.9" />
          <path d="M 48 40 C 66 20, 71 15, 76 10 C 71 35, 61 40, 48 40" fill="#0d9488" fillOpacity="0.9" />
          <circle cx="48" cy="40" r="3" fill="#facc15" />
        </svg>
      );
    } else if (species === "Iris-versicolor") {
      return (
        <svg viewBox="0 0 100 120" className="w-28 h-28 mx-auto drop-shadow-sm select-none animate-bounce-slow">
          <path d="M 50 120 C 50 85, 47 60, 47 35" stroke="#0ea5e9" strokeWidth="3" fill="none" />
          <path d="M 47 95 C 25 80, 20 65, 12 40" stroke="#0ea5e9" strokeWidth="2" fill="none" />
          <path d="M 50 85 C 70 70, 75 55, 85 30" stroke="#0ea5e9" strokeWidth="2" fill="none" />
          <ellipse cx="47" cy="35" rx="14" ry="12" fill="#0284c7" fillOpacity="0.8" />
          <path d="M 47 35 C 20 20, 10 10, 5 2 C 15 30, 30 35, 47 35" fill="#0369a1" fillOpacity="0.9" />
          <path d="M 47 35 C 74 20, 84 10, 89 2 C 79 30, 64 35, 47 35" fill="#0369a1" fillOpacity="0.9" />
          <ellipse cx="47" cy="35" rx="4" ry="4" fill="#f59e0b" />
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 100 120" className="w-28 h-28 mx-auto drop-shadow-sm select-none animate-bounce-slow">
          <path d="M 50 120 C 50 80, 46 50, 46 30" stroke="#8b5cf6" strokeWidth="3.5" fill="none" />
          <path d="M 46 90 C 20 75, 10 55, 5 30" stroke="#8b5cf6" strokeWidth="2.5" fill="none" />
          <path d="M 50 80 C 75 65, 85 45, 95 20" stroke="#8b5cf6" strokeWidth="2.5" fill="none" />
          <ellipse cx="46" cy="30" rx="16" ry="14" fill="#6d28d9" fillOpacity="0.85" />
          <path d="M 46 30 C 15 15, 2 -2, -5 -10 C 5 25, 22 30, 46 30" fill="#5b21b6" fillOpacity="0.95" />
          <path d="M 46 30 C 77 15, 90 -2, 97 -10 C 87 25, 70 30, 46 30" fill="#5b21b6" fillOpacity="0.95" />
          <ellipse cx="46" cy="30" rx="5" ry="5" fill="#fbbf24" />
        </svg>
      );
    }
  };

  return (
    <div id="dynamic-prediction-system" className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* Column 1: Feature adjustment sliders + textboxes (Col span 8) */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Active Biometric Input Controls</h3>
            <p className="text-[10px] text-slate-400">Fine-tune sepal & petal values using sliders or numeric text boxes.</p>
          </div>
        </div>

        {/* Input Parameters controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Sepal Length */}
          <div id="slider-sepal-length" className="space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-200/50">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-tight font-bold">Sepal Length (X1)</span>
              <input
                type="number"
                min="4.0"
                max="8.0"
                step="0.1"
                value={sepalLength}
                onChange={(e) => handleTextChange(e.target.value, 4.0, 8.0, setSepalLength)}
                className="w-14 bg-white border border-slate-200 rounded px-1 text-right text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              />
            </div>
            <input
              type="range"
              min="4.0"
              max="8.0"
              step="0.1"
              value={sepalLength}
              onChange={(e) => setSepalLength(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-mono">
              <span>Min: 4.0</span>
              <span>Max: 8.0</span>
            </div>
          </div>

          {/* Sepal Width */}
          <div id="slider-sepal-width" className="space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-200/50">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-tight font-bold">Sepal Width (X2)</span>
              <input
                type="number"
                min="2.0"
                max="4.5"
                step="0.1"
                value={sepalWidth}
                onChange={(e) => handleTextChange(e.target.value, 2.0, 4.5, setSepalWidth)}
                className="w-14 bg-white border border-slate-200 rounded px-1 text-right text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              />
            </div>
            <input
              type="range"
              min="2.0"
              max="4.5"
              step="0.1"
              value={sepalWidth}
              onChange={(e) => setSepalWidth(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-mono">
              <span>Min: 2.0</span>
              <span>Max: 4.5</span>
            </div>
          </div>

          {/* Petal Length */}
          <div id="slider-petal-length" className="space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-200/50">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-tight font-bold">Petal Length (X3)</span>
              <input
                type="number"
                min="1.0"
                max="7.0"
                step="0.1"
                value={petalLength}
                onChange={(e) => handleTextChange(e.target.value, 1.0, 7.0, setPetalLength)}
                className="w-14 bg-white border border-slate-200 rounded px-1 text-right text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              />
            </div>
            <input
              type="range"
              min="1.0"
              max="7.0"
              step="0.1"
              value={petalLength}
              onChange={(e) => setPetalLength(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-mono">
              <span>Min: 1.0</span>
              <span>Max: 7.0</span>
            </div>
          </div>

          {/* Petal Width */}
          <div id="slider-petal-width" className="space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-200/50">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-tight font-bold">Petal Width (X4)</span>
              <input
                type="number"
                min="0.1"
                max="2.5"
                step="0.1"
                value={petalWidth}
                onChange={(e) => handleTextChange(e.target.value, 0.1, 2.5, setPetalWidth)}
                className="w-14 bg-white border border-slate-200 rounded px-1 text-right text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              />
            </div>
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.1"
              value={petalWidth}
              onChange={(e) => setPetalWidth(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-mono">
              <span>Min: 0.1</span>
              <span>Max: 2.5</span>
            </div>
          </div>
        </div>

        {/* Selected Classifier Choice & Quick Presets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-440 uppercase tracking-widest font-sans">Active Sandbox Inference Model</label>
            <select
              id="predictor-model-select"
              value={selectedModelKey}
              onChange={(e) => setSelectedModelKey(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="rf">Random Forest Ensemble (Bagging)</option>
              <option value="lr">Logistic Regression (Softmax Probabilities)</option>
              <option value="dt">Decision Tree Classifier</option>
              <option value="knn">K-Nearest Neighbors (Euclidean Distance)</option>
              <option value="svm">Support Vector Machine (Hyperplane Separation)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-440 uppercase tracking-widest font-sans">Botanical Presets</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                id="btn-preset-setosa"
                onClick={() => handleLoadSample(5.1, 3.5, 1.4, 0.2)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded py-1.5 text-[9px] font-black uppercase transition-all cursor-pointer leading-tight text-center"
              >
                Setosa Profile
              </button>
              <button
                id="btn-preset-versicolor"
                onClick={() => handleLoadSample(6.1, 2.8, 4.0, 1.3)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded py-1.5 text-[9px] font-black uppercase transition-all cursor-pointer leading-tight text-center"
              >
                Versicolor
              </button>
              <button
                id="btn-preset-virginica"
                onClick={() => handleLoadSample(6.7, 3.3, 5.7, 2.1)}
                className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded py-1.5 text-[9px] font-black uppercase transition-all cursor-pointer leading-tight text-center"
              >
                Virginica
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Result presentation (Col span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-col justify-between space-y-4">
        
        {/* Card Header */}
        <div className="text-center space-y-0.5">
          <span className="inline-flex items-center space-x-1 font-mono text-[9px] font-extrabold tracking-widest text-[#4f46e5] uppercase bg-indigo-50 border border-indigo-150 py-0.5 px-2 rounded">
            <Sparkles className="w-2.5 h-2.5" /> Live Inference Engine
          </span>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Predicted Output</h3>
        </div>

        {/* Botanical Illustration vector */}
        <div id="botanical-illustration" className="flex items-center justify-center p-2 rounded bg-slate-50 border border-slate-100 relative">
          {renderBotanicalIllustration(prediction)}
          <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400 font-bold select-none">[Simulation Vector]</span>
        </div>

        {/* Outcome banner exactly matching Design HTML */}
        <div className="mt-auto space-y-2.5">
          
          <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-100 rounded">
            <div>
              <p className="text-[9px] uppercase font-bold text-indigo-500 font-sans tracking-wide">Predicted Class</p>
              <p id="predicted-species-text" className="text-xs font-extrabold text-indigo-900 font-mono italic">
                {prediction}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase font-bold text-indigo-500 font-sans tracking-wide">Confidence Info</p>
              <p className="text-xs font-bold text-indigo-900 font-mono">
                {probabilities ? `${(Math.max(...probabilities) * 100).toFixed(2)}%` : "100.00% (Gini)"}
              </p>
            </div>
          </div>

          {/* Probabilities detail view */}
          {probabilities ? (
            <div className="space-y-1 bg-slate-50 border border-slate-100 p-2 rounded">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Softmax Probability distributions:</span>
              <div className="space-y-1 text-[9px] font-mono">
                {SPECIES_NAMES.map((name, idx) => {
                  const prob = probabilities![idx] || 0;
                  const pctVal = `${(prob * 100).toFixed(1)}%`;
                  
                  return (
                    <div key={name} className="flex items-center space-x-1.5">
                      <span className="w-12 truncate font-bold text-slate-500 text-[8px] uppercase">{name.split("-")[1]}</span>
                      <div className="flex-1 bg-white h-2 rounded overflow-hidden border border-slate-200">
                        <div
                          style={{ width: `${prob * 100}%` }}
                          className={`h-full ${
                            name === prediction
                              ? "bg-indigo-600"
                              : "bg-slate-300"
                          }`}
                        />
                      </div>
                      <span className="w-8 text-right font-black text-slate-700">{pctVal}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 p-2 rounded text-center flex items-center justify-center gap-1 shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[9px] text-slate-500 font-medium uppercase font-mono font-bold tracking-tight">Categorical Split Matched Successfully!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
