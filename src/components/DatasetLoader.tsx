import { useState } from "react";
import { IrisRecord } from "../data/irisData";
import { Table, Search, AlertCircle, Database, CheckCircle2 } from "lucide-react";

interface DatasetLoaderProps {
  records: IrisRecord[];
}

export function DatasetLoader({ records }: DatasetLoaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"rows" | "stats">("rows");
  const [rowLimit, setRowLimit] = useState(10);

  // Filter records
  const filteredRecords = records.filter((r) =>
    r.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toString() === searchTerm
  );

  const features = [
    { key: "sepalLength", name: "Sepal Length (cm)" },
    { key: "sepalWidth", name: "Sepal Width (cm)" },
    { key: "petalLength", name: "Petal Length (cm)" },
    { key: "petalWidth", name: "Petal Width (cm)" },
  ];

  const calculateStats = (key: keyof IrisRecord) => {
    const values = records.map((r) => r[key] as number);
    const count = values.length;
    const sum = values.reduce((acc, v) => acc + v, 0);
    const mean = sum / count;

    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    const q25 = sorted[Math.floor(count * 0.25)];
    const q75 = sorted[Math.floor(count * 0.75)];

    const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
    const std = Math.sqrt(variance);

    return {
      mean: mean.toFixed(4),
      std: std.toFixed(4),
      min: min.toFixed(1),
      q25: q25.toFixed(1),
      median: sorted[Math.floor(count / 2)].toFixed(1),
      q75: q75.toFixed(1),
      max: max.toFixed(1),
    };
  };

  return (
    <div id="dataset-loader-view" className="space-y-4">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Dataset Shape card */}
        <section className="bg-white rounded-lg border border-slate-200 p-3.5 flex justify-between items-center shadow-2xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dataset Shape</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-slate-800">
              150 <span className="text-slate-400 text-xs font-sans">x</span> 5
            </p>
          </div>
          <div className="w-9 h-9 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
        </section>

        {/* Missing Values card */}
        <section className="bg-white rounded-lg border border-slate-200 p-3.5 flex justify-between items-center shadow-2xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Missing Values</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-emerald-600">0.0%</p>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </section>

        {/* Total Features card */}
        <section className="bg-white rounded-lg border border-slate-200 p-3.5 flex justify-between items-center shadow-2xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Features Count (X)</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-slate-800">4 Columns</p>
          </div>
          <div className="w-9 h-9 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </section>

        {/* Target Classes card */}
        <section className="bg-white rounded-lg border border-slate-200 p-3.5 flex justify-between items-center shadow-2xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Classes (y)</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-indigo-600">3 Species</p>
          </div>
          <div className="w-9 h-9 rounded bg-rose-50 text-rose-600 flex items-center justify-center">
            <Table className="w-5 h-5" />
          </div>
        </section>

      </div>

      {/* Dataset Exploration Console */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter / View Header */}
        <div className="border-b border-secondary border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
          <div className="flex space-x-1 bg-slate-100 p-0.5 rounded">
            <button
              id="tab-view-rows"
              onClick={() => setActiveTab("rows")}
              className={`px-3 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                activeTab === "rows"
                  ? "bg-white text-slate-800 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              First Rows View
            </button>
            <button
              id="tab-view-stats"
              onClick={() => setActiveTab("stats")}
              className={`px-3 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                activeTab === "stats"
                  ? "bg-white text-slate-800 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Summary Statistics
            </button>
          </div>

          {activeTab === "rows" && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  id="search-species-input"
                  type="text"
                  placeholder="Filter species..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-44 transition-all"
                />
              </div>
              <select
                id="row-limit-select"
                value={rowLimit}
                onChange={(e) => setRowLimit(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded text-[11px] px-2 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={5}>Show 5 rows</option>
                <option value={10}>Show 10 rows</option>
                <option value={20}>Show 20 rows</option>
                <option value={150}>Show All (150)</option>
              </select>
            </div>
          )}
        </div>

        {/* Table Content */}
        {activeTab === "rows" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2 text-indigo-600 bg-indigo-50/20 font-semibold border-l border-slate-100">Sepal Length (cm)</th>
                  <th className="px-4 py-2 text-indigo-600 bg-indigo-50/20 font-semibold">Sepal Width (cm)</th>
                  <th className="px-4 py-2 text-indigo-600 bg-indigo-50/20 font-semibold">Petal Length (cm)</th>
                  <th className="px-4 py-2 text-indigo-600 bg-indigo-50/20 font-semibold">Petal Width (cm)</th>
                  <th className="px-4 py-2 text-rose-600 bg-rose-50/20 font-bold border-l border-slate-100">Target Species</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700 font-mono">
                {filteredRecords.slice(0, rowLimit).map((record, index) => (
                  <tr
                    key={record.id}
                    className={`hover:bg-slate-50/50 transition-colors ${
                      index < 5 ? "bg-amber-50/10" : ""
                    }`}
                  >
                    <td className="px-4 py-1.5 text-slate-400 font-bold">{record.id}</td>
                    <td className="px-4 py-1.5 bg-indigo-50/5 border-l border-slate-100 font-semibold text-slate-800">{record.sepalLength.toFixed(1)}</td>
                    <td className="px-4 py-1.5 bg-indigo-50/5 text-slate-700">{record.sepalWidth.toFixed(1)}</td>
                    <td className="px-4 py-1.5 bg-indigo-50/5 text-slate-700">{record.petalLength.toFixed(1)}</td>
                    <td className="px-4 py-1.5 bg-indigo-50/5 text-slate-750">{record.petalWidth.toFixed(1)}</td>
                    <td className="px-4 py-1.5 border-l border-slate-100">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded font-sans text-[9px] font-black tracking-wider uppercase ${
                          record.species === "Iris-setosa"
                            ? "bg-emerald-500 text-white shadow-2xs"
                            : record.species === "Iris-versicolor"
                            ? "bg-indigo-600 text-white shadow-2xs"
                            : "bg-purple-600 text-white shadow-2xs"
                        }`}
                      >
                        {record.species.replace("Iris-", "")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                No matching species species found.
              </div>
            )}
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-[10px] text-slate-400 font-mono flex justify-between font-bold">
              <span>Showing {Math.min(filteredRecords.length, rowLimit)} of {filteredRecords.length} entries</span>
              {rowLimit === 10 && records.length > 10 && <span className="text-amber-600 font-sans">Highlighting row index split samples*</span>}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <th className="px-4 py-2">Statistical Metric</th>
                  {features.map((f) => (
                    <th key={f.key} className="px-4 py-2 text-slate-700">
                      {f.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-600 font-mono">
                <tr className="hover:bg-slate-50/40">
                  <td className="px-4 py-2 font-sans font-bold text-slate-500 uppercase tracking-wider text-[10px]">Sample Size</td>
                  <td className="px-4 py-2 font-bold">{records.length.toFixed(1)}</td>
                  <td className="px-4 py-2 font-bold">{records.length.toFixed(1)}</td>
                  <td className="px-4 py-2 font-bold">{records.length.toFixed(1)}</td>
                  <td className="px-4 py-2 font-bold">{records.length.toFixed(1)}</td>
                </tr>
                {(() => {
                  const statsList = features.map((f) => calculateStats(f.key as keyof IrisRecord));
                  const metrics: { key: keyof typeof statsList[0]; label: string; bold?: boolean }[] = [
                    { key: "mean", label: "Arithmetic Mean" },
                    { key: "std", label: "Std Deviation (σ)" },
                    { key: "min", label: "Minimum value (Min)" },
                    { key: "q25", label: "25th Percentile (Q1)" },
                    { key: "median", label: "50th Percentile (Median)", bold: true },
                    { key: "q75", label: "75th Percentile (Q3)" },
                    { key: "max", label: "Maximum value (Max)" },
                  ];

                  return metrics.map((m) => (
                    <tr key={m.key} className={`hover:bg-slate-50/50 ${m.bold ? "bg-indigo-50/30 font-bold" : ""}`}>
                      <td className="px-4 py-2 font-sans font-medium text-slate-800">{m.label}</td>
                      <td className="px-4 py-2 text-indigo-700 font-semibold">{statsList[0][m.key]}</td>
                      <td className="px-4 py-2 text-indigo-700 font-semibold">{statsList[1][m.key]}</td>
                      <td className="px-4 py-2 text-indigo-700 font-semibold">{statsList[2][m.key]}</td>
                      <td className="px-4 py-2 text-indigo-700 font-semibold">{statsList[3][m.key]}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Class Balance Audit card */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-2xs">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-800 font-sans">Class Cleanliness & Distribution Completeness</h4>
          <p className="text-[11px] text-slate-500">
            The database hosts 150 instances, meticulously separated into 3 varieties (50 targets each). No null parameters detected.
          </p>
        </div>
        <div className="flex space-x-1.5 shrink-0 self-end sm:self-auto">
          <span className="bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
            Nulls: 0.00%
          </span>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
            Balanced: Yes (1:1:1)
          </span>
        </div>
      </div>
    </div>
  );
}
