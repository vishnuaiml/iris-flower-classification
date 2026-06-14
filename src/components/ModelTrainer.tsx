import { useState } from "react";
import { IrisRecord } from "../data/irisData";
import {
  executeMlpipeline,
  SPECIES_NAMES,
} from "../ml/algorithms";
import { Play, ShieldAlert, Cpu, Layers, RefreshCw } from "lucide-react";

interface ModelTrainerProps {
  records: IrisRecord[];
  onTrainCompleted: (results: any) => void;
  trainResults: any | null;
}

export function ModelTrainer({
  records,
  onTrainCompleted,
  trainResults,
}: ModelTrainerProps) {
  const [training, setTraining] = useState(false);
  const [activeModelKey, setActiveModelKey] = useState<"lr" | "dt" | "rf" | "knn" | "svm">( "rf" );

  const handleTrainModels = () => {
    setTraining(true);
    setTimeout(() => {
      try {
        const pipelineResult = executeMlpipeline(records);
        onTrainCompleted(pipelineResult);
      } catch (err) {
        console.error("Training Pipeline failed:", err);
      } finally {
        setTraining(false);
      }
    }, 600);
  };

  const getActiveModelData = () => {
    if (!trainResults) return null;
    return trainResults.models[activeModelKey];
  };

  const activeModelData = getActiveModelData();

  // Color mapper for cells inside high-density dark confusion matrix matching Design HTML
  const getCellBg = (val: number) => {
    if (val === 0) return "bg-slate-800 text-slate-500";
    if (val <= 2) return "bg-indigo-500/50 text-indigo-200 font-bold";
    return "bg-indigo-600 text-white font-black";
  };

  return (
    <div id="ml-pipeline" className="space-y-4">
      {/* Configuration Control Panel Header matches Workbench style */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm mr-1.5 inline-block"></span>
            Seeded ML Classification Studio
          </h3>
          <p className="text-[11px] text-slate-400">
            Split partition matches standard scikit-learn split: **80% training** / **20% testing** test sets. Fits 5 active models live.
          </p>
        </div>

        <button
          id="btn-train-pipeline"
          onClick={handleTrainModels}
          disabled={training}
          className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs border ${
            training
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent hover:shadow-md active:scale-95"
          }`}
        >
          {training ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Training Classifiers...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{trainResults ? "RE-OPTIMIZE PIPELINE" : "TRAIN LIVE MODELS"}</span>
            </>
          )}
        </button>
      </div>

      {training && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <RefreshCw className="h-6 w-6 border-indigo-600 animate-spin text-indigo-600" />
          <p className="text-[11px] text-slate-500 font-mono font-bold animate-pulse">Fitting mathematical boundaries & evaluating weights...</p>
        </div>
      )}

      {trainResults && !training && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Models Selector Stack Side rail (Col span 3) */}
          <div className="lg:col-span-3 space-y-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 font-sans">
              Select ML Model:
            </h4>
            
            {(["rf", "svm", "knn", "lr", "dt"] as const).map((key) => {
              const modelObj = trainResults.models[key];
              const isActive = activeModelKey === key;
              const accuracyPercent = (modelObj.metrics.accuracy * 100).toFixed(1);

              return (
                <button
                  key={key}
                  id={`btn-select-model-${key}`}
                  onClick={() => setActiveModelKey(key)}
                  className={`w-full text-left p-2 px-3 rounded-lg border transition-all flex justify-between items-center cursor-pointer ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white shadow-2xs"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className={`text-[11px] font-bold block leading-none ${isActive ? "text-white" : "text-slate-800"}`}>
                      {modelObj.name}
                    </span>
                    <span className="text-[9px] block font-mono text-slate-400 leading-none">
                      {key === "lr" ? "Softmax" : key === "dt" ? "Decision Boundary" : key === "rf" ? "Ensemble Bagging" : key === "knn" ? "K-Neighbors" : "Support Vector"}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-extrabold ${
                      isActive ? "bg-indigo-600 text-indigo-100" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {accuracyPercent}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Model Metrics Display area (Col span 9) */}
          <div className="lg:col-span-9 space-y-4">
            {activeModelData && (
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-4">
                
                {/* Heading Area with split status */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 id="active-model-title" className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center">
                      <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[9px] font-bold uppercase mr-1.5">
                        Active Model
                      </span>
                      {activeModelData.name} Evaluation
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Deterministically segmented validation subset indices (N=30 records)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">Test Accuracy</span>
                    <h2 id="active-model-accuracy" className="text-xl font-bold text-indigo-600 font-mono tracking-tight">
                      {(activeModelData.metrics.accuracy * 100).toFixed(2)}%
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* Left Column: Classification Report Table (Span 7) */}
                  <div className="md:col-span-7 space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-5050 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      Classification Indices Report
                    </h4>
                    
                    <div className="overflow-x-auto border border-slate-100 rounded">
                      <table className="w-full text-left font-mono">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="px-2.5 py-1.5 font-sans font-bold text-slate-700">Variety class</th>
                            <th className="px-2.5 py-1.5 text-right">Precision</th>
                            <th className="px-2.5 py-1.5 text-right">Recall</th>
                            <th className="px-2.5 py-1.5 text-right font-sans font-bold text-slate-700">F1-Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[10px] text-slate-600">
                          {SPECIES_NAMES.map((name) => {
                            const rRep = activeModelData.metrics.report[name];
                            return (
                              <tr key={name} className="hover:bg-slate-50/50">
                                <td className="px-2.5 py-1.5 font-sans font-extrabold text-slate-700 text-[10px]">
                                  {name.replace("Iris-", "")}
                                </td>
                                <td className="px-2.5 py-1.5 text-right font-medium">{(rRep.precision * 100).toFixed(1)}%</td>
                                <td className="px-2.5 py-1.5 text-right font-medium">{(rRep.recall * 100).toFixed(1)}%</td>
                                <td className="px-2.5 py-1.5 text-right font-bold text-slate-800">{(rRep.f1 * 100).toFixed(1)}%</td>
                              </tr>
                            );
                          })}
                          <tr className="border-t border-slate-200 bg-slate-50 font-bold text-slate-800">
                            <td className="px-2.5 py-1.5 font-sans text-[10px] font-black">Macro average</td>
                            <td className="px-2.5 py-1.5 text-right">{(activeModelData.metrics.overall.precision * 100).toFixed(1)}%</td>
                            <td className="px-2.5 py-1.5 text-right">{(activeModelData.metrics.overall.recall * 100).toFixed(1)}%</td>
                            <td className="px-2.5 py-1.5 text-right text-indigo-600 font-black">{(activeModelData.metrics.overall.f1 * 100).toFixed(1)}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Sleek Confusion Matrix Heatmap matching Layout (Span 5) */}
                  <div className="md:col-span-5 bg-slate-900 rounded-lg p-3.5 text-white flex flex-col justify-between border border-slate-950 shadow-inner">
                    <h4 className="text-[10px] font-bold text-slate-100 uppercase tracking-wide flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      Validation Confusion Matrix Heatmap
                    </h4>

                    {/* Heatmap Grid exactly styled as requested */}
                    <div className="flex flex-col items-center justify-center py-2 shrink-0">
                      <div className="grid grid-cols-3 gap-1 w-full max-w-[190px] h-24 font-mono font-bold text-xs">
                        {activeModelData.metrics.confusionMatrix.map((rowArr: number[], rowIdx: number) => {
                          return rowArr.map((cellVal: number, colIdx: number) => (
                            <div
                              key={`${rowIdx}-${colIdx}`}
                              className={`rounded-sm flex items-center justify-center text-[11px] font-black tracking-tight ${getCellBg(cellVal)} transition-all relative group shadow-2xs`}
                            >
                              <span>{cellVal}</span>
                              {/* micro hover popup */}
                              <span className="absolute bottom-full mb-1 bg-slate-950 text-white text-[8px] font-sans px-1.5 py-0.5 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap font-bold">
                                true={rowIdx} pred={colIdx}
                              </span>
                            </div>
                          ));
                        })}
                      </div>

                      {/* Small visual guide details */}
                      <div className="flex justify-between w-full max-w-[190px] mt-2 select-none text-[8px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-sm"></span> Perfect
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-sm"></span> Noise
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-800 rounded-sm"></span> Zero
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Audit helper panel */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-[10px] text-slate-500">
                  <span className="font-bold text-amber-700 flex items-center gap-1 font-sans">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Interpretation guideline:
                  </span>
                  <p className="mt-0.5 font-sans leading-relaxed">
                    Diagonal cells indicate correct Class target categorizations. Setosa is 100% cleanly separated by all algorithms due to strong petal margin clusters, while mini overlaps appear in Versicolor / Virginica ranges.
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {!trainResults && (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center space-y-3 max-w-lg mx-auto shadow-2xs">
          <Layers className="w-9 h-9 text-indigo-500 mx-auto stroke-1" />
          <h4 className="text-xs font-bold text-slate-800 uppercase">ML Pipeline Fit Pending</h4>
          <p className="text-[11px] text-slate-500">
            Trigger pipeline optimization to train K-Nearest Neighbors, Random Forest, Decision Trees, Support Vector Machine, and Logistic Regression models.
          </p>
        </div>
      )}
    </div>
  );
}
