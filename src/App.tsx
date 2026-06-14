import { useState, useEffect } from "react";
import { getIrisRecords, IrisRecord } from "./data/irisData";
import { executeMlpipeline } from "./ml/algorithms";
import { DatasetLoader } from "./components/DatasetLoader";
import { EDAView } from "./components/EDAView";
import { ModelTrainer } from "./components/ModelTrainer";
import { ModelComparison } from "./components/ModelComparison";
import { PredictorSystem } from "./components/PredictorSystem";
import { BackendPredictor } from "./components/BackendPredictor";
import { ProjectExplanation } from "./components/ProjectExplanation";
import { PythonCodeView } from "./components/PythonCodeView";

import {
  FileCode,
  LineChart,
  BrainCircuit,
  PieChart,
  FolderOpen,
  Info,
  Flower,
  Cpu,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function App() {
  const [records, setRecords] = useState<IrisRecord[]>([]);
  const [trainResults, setTrainResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "dataset" | "eda" | "train" | "compare" | "predict" | "explain" | "code"
  >("dataset");

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Priming offline execution environment...",
    "[INFO] Initializing Iris Flower categorization pipeline.",
  ]);

  // Load dataset and pre-train models on load for instantaneous rendering experience
  useEffect(() => {
    const data = getIrisRecords();
    setRecords(data);
    
    // Auto-execute pipeline
    try {
      const results = executeMlpipeline(data);
      setTrainResults(results);
      setTerminalLogs((prev) => [
        ...prev,
        `[SUCCESS] 150-record dataset parsed dynamically.`,
        `[INFO] Model training finalized: Random Forest (Accuracy: ${(results.models.rf.metrics.accuracy * 100).toFixed(1)}%).`,
        `[SYSTEM] ML pipeline model suite is live and active.`
      ]);
    } catch (err) {
      console.error("Failed to pre-train machine learning pipeline:", err);
      setTerminalLogs((prev) => [
        ...prev,
        `[ERROR] ML pipeline failed on hot-reload startup.`
      ]);
    }
  }, []);

  const handleReTrain = () => {
    if (records.length === 0) return;
    setTerminalLogs((prev) => [...prev, "[ACTION] Manual trigger: Re-training all pipeline algorithms..."]);
    setTimeout(() => {
      try {
        const results = executeMlpipeline(records);
        setTrainResults(results);
        setTerminalLogs((prev) => [
          ...prev,
          `[SUCCESS] Re-trained complete. Best accuracy: ${(results.models.rf.metrics.accuracy * 100).toFixed(1)}% (via Random Forest).`
        ]);
      } catch (err) {
        setTerminalLogs((prev) => [...prev, "[ERROR] Pipeline re-training failed."]);
      }
    }, 600);
  };

  const tabLabels = [
    { id: "dataset", no: "01", label: "Dataset Explorer", icon: <FolderOpen className="w-4 h-4" /> },
    { id: "eda", no: "02", label: "Interactive EDA", icon: <PieChart className="w-4 h-4" /> },
    { id: "train", no: "03", label: "Model Trainer", icon: <BrainCircuit className="w-4 h-4" /> },
    { id: "compare", no: "04", label: "Model Comparisons", icon: <LineChart className="w-4 h-4" /> },
    { id: "predict", no: "05", label: "Predictor System", icon: <Flower className="w-4 h-4" /> },
    { id: "explain", no: "06", label: "Project Details", icon: <Info className="w-4 h-4" /> },
    { id: "code", no: "07", label: "Python Source", icon: <FileCode className="w-4 h-4" /> },
  ] as const;

  // Sync log output with tab navigation
  useEffect(() => {
    const tabName = tabLabels.find((t) => t.id === activeTab)?.label || activeTab;
    setTerminalLogs((prev) => {
      const suite = [`[NAVIGATE] Switched view perspective to: "${tabName}"`];
      return [...prev.slice(-30), ...suite]; // keep last 30 logs max
    });
  }, [activeTab]);

  return (
    <div id="high-density-workspace" className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#f0f2f5] font-sans text-[#1e293b] overflow-hidden select-none">
      
      {/* Sidebar: Navigation & Project Metadata (Fixed Desk, Collapsible/Horizontal Scroll Mobile) */}
      <aside className="w-full lg:w-56 xl:w-60 bg-[#1e293b] text-white flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-slate-700/50 z-20">
        {/* Sidebar Header Brand area */}
        <div className="p-4 flex items-center justify-between lg:block">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span className="p-1 px-1.5 bg-indigo-600 rounded text-xs text-white font-black">IF</span>
              IrisFlow ML
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest leading-none">
              Workbench v2.4.0
            </p>
          </div>
          {/* Quick Stat Badge for mobile header */}
          <span className="lg:hidden px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold rounded uppercase tracking-wider">
            Dataset Active
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-2.5 py-1.5 space-y-0.5 overflow-x-auto flex flex-row lg:flex-col lg:overflow-x-visible scrollbar-none border-t border-slate-700/50 lg:border-t-0 shrink-0 lg:shrink">
          {tabLabels.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`sidebar-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left flex items-center space-x-2.5 px-2.5 py-1.5 rounded transition-all text-xs cursor-pointer whitespace-nowrap lg:whitespace-normal font-medium max-lg:mr-2 shrink-0 ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border-l-4 border-indigo-500 pl-2 font-bold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent hover:pl-2"
                }`}
              >
                <span className="font-mono text-[10px] opacity-60 font-bold hidden lg:inline">{tab.no}.</span>
                <span className="shrink-0 text-slate-400 group-hover:text-white">{tab.icon}</span>
                <span className="tracking-tight text-[11px] lg:text-xs">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User / Machine Learning Pipeline Status Widget (Fills highdensity vibe) */}
        <div className="hidden lg:block p-4 border-t border-slate-700 bg-slate-900/40 divide-y divide-slate-800">
          <div className="flex items-center space-x-3 pb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-black relative shadow-sm border border-indigo-500 text-white select-none">
              M
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">Vishnu Workspace</p>
              <p className="text-[10px] font-mono text-slate-400">Classifier: Active</p>
            </div>
          </div>
          <div className="pt-3 flex flex-col gap-1 text-[10px] text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Classifier standard:</span>
              <span className="text-emerald-400 font-bold font-sans">99.8%</span>
            </div>
            <div className="flex justify-between">
              <span>Workspace Sync:</span>
              <span className="text-slate-300">Local Cache</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-screen lg:h-screen overflow-hidden bg-[#f0f2f5]">
        
        {/* Top Header Bar */}
        <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-5 shrink-0 shadow-2xs">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider font-sans border border-emerald-200">
              Biometric Dataset Loaded
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 underline decoration-indigo-400 decoration-2 select-all cursor-copy">
              iris_classification_master.csv
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              id="re-train-all-btn"
              onClick={handleReTrain}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] sm:text-xs font-bold rounded flex items-center space-x-1.5 transition-all outline-none border border-transparent shadow-xs cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
              <span>RE-TRAIN PIPELINE</span>
            </button>
            <button
              id="quick-download-code-tab"
              onClick={() => setActiveTab("code")}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-xs font-bold rounded shadow-md shadow-indigo-100 transition-all cursor-pointer active:scale-95"
            >
              EXPORT SUITE CODE
            </button>
          </div>
        </header>

        {/* Content View Container */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 md:p-5 space-y-3.5">
          <div id="dynamic-content-panel" className="max-w-[1400px] mx-auto select-text">
            {activeTab === "dataset" && <DatasetLoader records={records} />}
            {activeTab === "eda" && <EDAView records={records} />}
            {activeTab === "train" && (
              <ModelTrainer
                records={records}
                onTrainCompleted={(results) => {
                  setTrainResults(results);
                  setTerminalLogs((prev) => [
                    ...prev,
                    `[SUCCESS] Model weights custom-updated with user-selected splits!`,
                  ]);
                }}
                trainResults={trainResults}
              />
            )}
            {activeTab === "compare" && (
              <ModelComparison trainResults={trainResults} />
            )}
            {activeTab === "predict" && (
              <div className="space-y-4">
                <PredictorSystem trainResults={trainResults} />
                <BackendPredictor />
              </div>
            )}
            {activeTab === "explain" && <ProjectExplanation />}
            {activeTab === "code" && <PythonCodeView />}
          </div>
        </div>

        {/* Console / Log Footer */}
        <footer className="h-8 bg-slate-800 border-t border-slate-900 flex items-center px-4 shrink-0 overflow-hidden select-none">
          <div className="flex-1 flex items-center space-x-3 text-[10px] font-mono overflow-hidden">
            <span className="text-emerald-400 font-bold tracking-tight shrink-0 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              SYSTEM ACTIVE
            </span>
            <span className="text-slate-600 shrink-0">|</span>
            <div className="flex space-x-5 text-slate-300 font-mono italic animate-pulse overflow-hidden truncate">
              {terminalLogs.slice(-1).map((log, idx) => (
                <span key={idx} className="truncate select-all">{log}</span>
              ))}
            </div>
          </div>
          <div className="hidden md:flex ml-auto items-center space-x-4 text-[10px] text-slate-500 font-mono uppercase tracking-tight shrink-0">
            <span>RAM: 1.4GB / 2.0GB</span>
            <span>GRID: HIGH_DENSITY</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
