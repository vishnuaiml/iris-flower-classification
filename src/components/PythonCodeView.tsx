import { useState } from "react";
import { Copy, Check, FileText, Code, GraduationCap } from "lucide-react";
import { rawPythonCode, readmeContent, resumeProjectDescription } from "../ml/pythonScript";

export function PythonCodeView() {
  const [activeSubTab, setActiveSubTab] = useState<"python" | "readme" | "resume">("python");
  const [copied, setCopied] = useState(false);

  const getCurrentText = () => {
    if (activeSubTab === "python") return rawPythonCode;
    if (activeSubTab === "readme") return readmeContent;
    return resumeProjectDescription;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="code-exports-workspace" className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden flex flex-col h-[380px] sm:h-[420px] lg:h-[480px]">
      
      {/* Tab Selectors header */}
      <div className="border-b border-slate-200 px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 bg-slate-50">
        <div className="flex space-x-1 bg-slate-200/65 p-0.5 rounded w-fit">
          <button
            id="subtab-python-code"
            onClick={() => setActiveSubTab("python")}
            className={`px-3 py-1 text-[10px] font-bold rounded-sm transition-all flex items-center gap-1 cursor-pointer ${
              activeSubTab === "python"
                ? "bg-white text-indigo-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code className="w-3 h-3" />
            iris_classification.py
          </button>
          <button
            id="subtab-readme-md"
            onClick={() => setActiveSubTab("readme")}
            className={`px-3 py-1 text-[10px] font-bold rounded-sm transition-all flex items-center gap-1 cursor-pointer ${
              activeSubTab === "readme"
                ? "bg-white text-indigo-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3 h-3" />
            README.md
          </button>
          <button
            id="subtab-resume-ready"
            onClick={() => setActiveSubTab("resume")}
            className={`px-3 py-1 text-[10px] font-bold rounded-sm transition-all flex items-center gap-1 cursor-pointer ${
              activeSubTab === "resume"
                ? "bg-white text-indigo-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            Resume Description
          </button>
        </div>

        {/* Copy Trigger */}
        <button
          id="btn-copy-code-workspace"
          onClick={handleCopy}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded flex items-center space-x-1 transition-all cursor-pointer self-end sm:self-auto active:scale-95 border border-indigo-700"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>COPY CONTENT</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text viewer space */}
      <div className="flex-1 overflow-auto p-4 bg-slate-950 text-slate-100 font-mono text-[11px] leading-relaxed select-text shadow-inner">
        <pre className="whitespace-pre overflow-x-auto select-all">
          {getCurrentText()}
        </pre>
      </div>

      {/* Footer hint */}
      <div className="bg-slate-900 border-t border-slate-950 px-4 py-1.5 text-[9px] text-slate-400 font-mono flex justify-between shrink-0 font-bold select-none">
        <span>Language: {activeSubTab === "python" ? "PYTHON CODE" : activeSubTab === "readme" ? "MARKDOWN DOCUMENT" : "PLAIN TEXT"}</span>
        <span className="text-indigo-400">Production Ready Suite Export</span>
      </div>
    </div>
  );
}
