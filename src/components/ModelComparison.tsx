import { Award, Star, CheckCircle, Info } from "lucide-react";
import { FEATURE_NAMES } from "../ml/algorithms";

interface ModelComparisonProps {
  trainResults: any;
}

export function ModelComparison({ trainResults }: ModelComparisonProps) {
  if (!trainResults) return null;

  // Compile list of accuracies
  const modelsList = Object.keys(trainResults.models).map((key) => {
    const m = trainResults.models[key];
    return {
      key,
      name: m.name,
      accuracy: m.metrics.accuracy,
    };
  });

  // Sort by accuracy descending to find the champion
  const sortedModels = [...modelsList].sort((a, b) => b.accuracy - a.accuracy);
  const bestModel = sortedModels[0];

  // Random Forest importances
  const rfImportances = trainResults.models.rf.model.featureImportances;

  return (
    <div id="model-comparison-view" className="space-y-4">
      
      {/* Champion Model Indicator (Matches sidebar background #1e293b) */}
      <section className="bg-[#1e293b] text-white p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center">
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded uppercase tracking-wider flex items-center gap-1 shadow-2xs">
              <Award className="w-3 h-3 fill-current" /> Champion Model
            </span>
          </div>
          <h2 id="champion-model-name" className="text-sm font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
            {bestModel.name}
          </h2>
          <p className="text-[11px] text-slate-350 max-w-xl font-sans">
            Leading performance benchmark achieves optimal margin separation on the cross-validation partition.
          </p>
        </div>
        <div className="text-right bg-slate-900/60 px-4 py-2 border border-slate-700 rounded-sm font-mono self-end md:self-auto min-w-[140px] shadow-inner">
          <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Accuracy Score</span>
          <span id="champion-model-accuracy" className="text-xl font-bold text-emerald-400">
            {(bestModel.accuracy * 100).toFixed(2)}%
          </span>
        </div>
      </section>

      {/* Grid Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Model Accuracy Comparisons Chart Card */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm mr-1.5 inline-block"></span>
              Architectural Model Benchmark Accuracy
            </h3>
            <p className="text-[10px] text-slate-400">
              Comparative validation accuracy scores of all 5 classifiers.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {modelsList.map((model) => {
              const rectWidth = `${model.accuracy * 100}%`;
              const isBest = model.key === bestModel.key;

              return (
                <div key={model.key} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-700 flex items-center gap-1">
                      {isBest && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                      {model.name}
                    </span>
                    <span className="text-indigo-600 font-mono">{(model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                      style={{ width: rectWidth }}
                      className={`h-full rounded-full transition-all ${
                        isBest ? "bg-indigo-600 shadow-2xs" : "bg-indigo-400"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Importance Distribution Chart Card */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm mr-1.5 inline-block"></span>
              feature significance distribution (gini)
            </h3>
            <p className="text-[10px] text-slate-400">
              Taxonomic significance derived using Random Forest Impurity gains.
            </p>
          </div>

          <div className="space-y-2.5 pt-1 flex-1 flex flex-col justify-center">
            {FEATURE_NAMES.map((name, idx) => {
              const val = rfImportances[idx];
              const rectWidth = `${val * 100}%`;

              return (
                <div key={name} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-tight text-slate-500">
                    <span>{name}</span>
                    <span className="text-emerald-600 font-bold">{(val * 100).toFixed(1)}% weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      style={{ width: rectWidth }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-2.5 border border-slate-200 rounded text-[10px] text-slate-500 flex items-start gap-1.5 mt-2">
            <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-sans leading-relaxed">
              **Entropy confirmation:** The algorithm delegates over **80%** of weight boundaries to **Petal metrics**, verifying that petal attributes cleanly partition class labels.
            </p>
          </div>
        </div>

      </div>

      {/* Structured Comparison Metrics Summary Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center">
          <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm mr-1.5 inline-block"></span>
          Algorithm Performance benchmark scorecard
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-2 px-3 font-sans font-bold text-slate-700">Algorithm Class</th>
                <th className="py-2 px-3 text-center">Accuracy Score</th>
                <th className="py-2 px-3 text-center">Precision</th>
                <th className="py-2 px-3 text-center">Recall Score</th>
                <th className="py-2 px-3 text-center">F1 Support</th>
                <th className="py-2 px-3 text-center font-sans font-bold text-slate-700">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
              {sortedModels.map((model, rankIdx) => {
                const modelData = trainResults.models[model.key];
                return (
                  <tr key={model.key} className={`hover:bg-slate-50/50 ${rankIdx === 0 ? "bg-emerald-50/30 font-medium" : ""}`}>
                    <td className="py-2 px-3 font-sans font-bold text-slate-800 flex items-center gap-1.5">
                      {rankIdx === 0 ? (
                        <span className="px-1 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-black">BEST</span>
                      ) : (
                        <span className="px-1 py-0.5 border border-slate-200 text-slate-400 rounded text-[8px]">STABLE</span>
                      )}
                      {model.name}
                    </td>
                    <td className="py-2 px-3 text-center text-indigo-600 font-bold font-mono">{(modelData.metrics.accuracy).toFixed(4)}</td>
                    <td className="py-2 px-3 text-center font-mono">{(modelData.metrics.overall.precision).toFixed(4)}</td>
                    <td className="py-2 px-3 text-center font-mono">{(modelData.metrics.overall.recall).toFixed(4)}</td>
                    <td className="py-2 px-3 text-center font-mono">{(modelData.metrics.overall.f1).toFixed(4)}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-sans ${
                        rankIdx === 0 ? "bg-amber-100 text-amber-850" : "bg-slate-100 text-slate-600"
                      }`}>
                        #{rankIdx + 1}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
