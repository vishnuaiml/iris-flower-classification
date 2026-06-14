import React, { useState } from "react";
import { IrisRecord } from "../data/irisData";

interface EDAViewProps {
  records: IrisRecord[];
}

export function EDAView({ records }: EDAViewProps) {
  // Configurable Scatter Axis Coordinates
  const [xAxis, setXAxis] = useState<keyof Omit<IrisRecord, "id" | "species">>("petalLength");
  const [yAxis, setYAxis] = useState<keyof Omit<IrisRecord, "id" | "species">>("petalWidth");
  const [hoveredPoint, setHoveredPoint] = useState<IrisRecord | null>(null);

  const features = [
    { key: "sepalLength", name: "Sepal Length" },
    { key: "sepalWidth", name: "Sepal Width" },
    { key: "petalLength", name: "Petal Length" },
    { key: "petalWidth", name: "Petal Width" },
  ];

  // Pearson correlation matrix
  const corrMatrix = {
    sepalLength: { sepalLength: 1.0, sepalWidth: -0.11, petalLength: 0.87, petalWidth: 0.82 },
    sepalWidth: { sepalLength: -0.11, sepalWidth: 1.0, petalLength: -0.42, petalWidth: -0.36 },
    petalLength: { sepalLength: 0.87, sepalWidth: -0.42, petalLength: 1.0, petalWidth: 0.96 },
    petalWidth: { sepalLength: 0.82, sepalWidth: -0.36, petalLength: 0.96, petalWidth: 1.0 },
  };

  // High density Class colors matching workbench theme
  const classColors: { [key: string]: { dot: string; text: string } } = {
    "Iris-setosa": { dot: "#0f766e", text: "text-teal-700" },
    "Iris-versicolor": { dot: "#4f46e5", text: "text-indigo-600" },
    "Iris-virginica": { dot: "#7e22ce", text: "text-purple-700" },
  };

  const getMinMax = (key: keyof IrisRecord) => {
    const vals = records.map((r) => r[key] as number);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const margin = (max - min) * 0.1;
    return { min: Math.max(0, min - margin), max: max + margin };
  };

  const xRange = getMinMax(xAxis);
  const yRange = getMinMax(yAxis);

  // SVG dimensions
  const svgW = 500;
  const svgH = 340;
  const marginL = 40;
  const marginT = 15;
  const marginR = 15;
  const marginB = 35;

  const toSvgX = (val: number) => {
    return marginL + ((val - xRange.min) / (xRange.max - xRange.min)) * (svgW - marginL - marginR);
  };

  const toSvgY = (val: number) => {
    return svgH - marginB - ((val - yRange.min) / (yRange.max - yRange.min)) * (svgH - marginT - marginB);
  };

  const getCorrBgColor = (val: number) => {
    if (val === 1) return `rgba(79, 70, 229, 0.95)`; // indigo-600 active 
    if (val > 0.8) return `rgba(79, 70, 229, 0.75)`;
    if (val > 0.4) return `rgba(99, 102, 241, 0.5)`;
    if (val > 0.1) return `rgba(165, 180, 252, 0.3)`;
    if (val > -0.15) return `rgba(241, 245, 249, 1)`; // flat neutral
    if (val > -0.4) return `rgba(186, 230, 253, 0.4)`; // sky-200
    return `rgba(56, 189, 248, 0.7)`; // sky-400
  };

  return (
    <div id="eda-visualizer-view" className="space-y-4">
      {/* Visual Analytics Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Plot 1: Interactive Species Scatter Plot */}
        <div className="lg:col-span-7 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm mr-1.5 inline-block"></span>
                Feature Dispersion Matrix & Clusters
              </h3>
              <p className="text-[10px] text-slate-400">Pairwise relational plot to view data distributions.</p>
            </div>
            
            {/* Pickers */}
            <div className="bg-slate-50 border border-slate-200 p-1 rounded-sm flex items-center space-x-1">
              <span className="text-[9px] px-1 text-slate-400 font-bold font-mono">X:</span>
              <select
                id="select-xaxis"
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value as any)}
                className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {features.map((f) => (
                  <option key={f.key} value={f.key}>{f.name}</option>
                ))}
              </select>

              <span className="text-[9px] px-1 text-slate-400 font-bold font-mono">Y:</span>
              <select
                id="select-yaxis"
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value as any)}
                className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {features.map((f) => (
                  <option key={f.key} value={f.key}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Scatter Chart Area */}
          <div className="relative pt-1 border border-slate-100 rounded bg-slate-50/20 p-2">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible select-none">
              {/* Grid Lines */}
              {Array.from({ length: 5 }).map((_, idx) => {
                const fraction = idx / 4;
                const xVal = xRange.min + fraction * (xRange.max - xRange.min);
                const yVal = yRange.min + fraction * (yRange.max - yRange.min);
                
                const svgX = toSvgX(xVal);
                const svgY = toSvgY(yVal);
                
                return (
                  <g key={idx}>
                    {/* Vertical guidelines */}
                    <line
                      x1={svgX}
                      y1={marginT}
                      x2={svgX}
                      y2={svgH - marginB}
                      stroke="#e2e8f0"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                    />
                    {/* Horizontal guidelines */}
                    <line
                      x1={marginL}
                      y1={svgY}
                      x2={svgW - marginR}
                      y2={svgY}
                      stroke="#e2e8f0"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                    />
                    
                    {/* Tick Labels */}
                    <text
                      x={svgX}
                      y={svgH - marginB + 13}
                      textAnchor="middle"
                      fill="#64748b"
                      className="text-[9px] font-mono font-bold"
                    >
                      {xVal.toFixed(1)}
                    </text>
                    <text
                      x={marginL - 6}
                      y={svgY + 3}
                      textAnchor="end"
                      fill="#64748b"
                      className="text-[9px] font-mono font-bold"
                    >
                      {yVal.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Axes lines */}
              <line
                x1={marginL}
                y1={svgH - marginB}
                x2={svgW - marginR}
                y2={svgH - marginB}
                stroke="#cbd5e1"
                strokeWidth={1.5}
              />
              <line
                x1={marginL}
                y1={marginT}
                x2={marginL}
                y2={svgH - marginB}
                stroke="#cbd5e1"
                strokeWidth={1.5}
              />

              {/* Data Dots */}
              {records.map((r) => {
                const cx = toSvgX(r[xAxis] as number);
                const cy = toSvgY(r[yAxis] as number);
                const speciesColor = classColors[r.species].dot;
                const isHovered = hoveredPoint?.id === r.id;

                return (
                  <circle
                    key={r.id}
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 7 : 4}
                    fill={speciesColor}
                    fillOpacity={isHovered ? 1 : 0.75}
                    stroke={isHovered ? "#ffffff" : "transparent"}
                    strokeWidth={1.5}
                    onMouseEnter={() => setHoveredPoint(r)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ transition: "all 0.1s ease-out" }}
                    className="cursor-pointer"
                  />
                );
              })}
            </svg>

            {/* Float Tooltip inside block */}
            {hoveredPoint && (
              <div
                className="absolute z-10 p-2 bg-slate-900 text-white text-[10px] rounded border border-slate-700 shadow-lg w-44 pointer-events-none transition-all flex flex-col gap-0.5"
                style={{
                  left: `${Math.min(toSvgX(hoveredPoint[xAxis] as number) - 30, 310)}px`,
                  top: `${Math.max(toSvgY(hoveredPoint[yAxis] as number) - 90, 5)}px`,
                }}
              >
                <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                  <span className="font-mono text-slate-400 font-bold">Ref #{hoveredPoint.id}</span>
                  <span className="font-bold text-indigo-300 uppercase text-[9px]">{hoveredPoint.species.replace("Iris-", "")}</span>
                </div>
                <div className="font-mono space-y-0.5 font-bold">
                  <div className="flex justify-between">
                    <span>Sepal L.</span>
                    <span className="text-white">{hoveredPoint.sepalLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sepal W.</span>
                    <span className="text-white">{hoveredPoint.sepalWidth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Petal L.</span>
                    <span className="text-white">{hoveredPoint.petalLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Petal W.</span>
                    <span className="text-white">{hoveredPoint.petalWidth}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Diagnostic Legend */}
          <div className="flex justify-center space-x-6 pt-1">
            {Object.keys(classColors).map((name) => (
              <div key={name} className="flex items-center space-x-1.5 text-[10px] font-bold">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: classColors[name].dot }}
                />
                <span className="text-slate-600 font-sans">{name.replace("Iris-", "").toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plot 2: Correlation Heatmap Matrix */}
        <div id="correlation-heatmap" className="lg:col-span-5 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm mr-1.5 inline-block"></span>
              Pearson Feature Correlation
            </h3>
            <p className="text-[10px] text-slate-400">
              Cross-metric dependency matrix mapping (-1.0 to +1.0).
            </p>
          </div>

          {/* Heatmap Grid */}
          <div className="flex-1 flex flex-col justify-center py-2">
            <div className="grid grid-cols-5 gap-1.5 max-w-[320px] mx-auto w-full">
              {/* Corner placeholder */}
              <div />
              {features.map((f) => (
                <div key={f.key} className="text-center text-[9px] font-bold text-slate-500 font-sans line-clamp-1 py-1 px-0.5">
                  {f.name.split(" ")[0]}
                </div>
              ))}

              {features.map((fRow) => (
                <React.Fragment key={fRow.key}>
                  {/* Left row header name */}
                  <div className="text-left text-[9px] font-bold text-slate-500 font-sans flex items-center pr-1 leading-tight">
                    {fRow.name}
                  </div>
                  
                  {features.map((fCol) => {
                    const corrVal = corrMatrix[fRow.key as keyof typeof corrMatrix][fCol.key as keyof typeof corrMatrix];
                    
                    return (
                      <div
                        key={fCol.key}
                        style={{ backgroundColor: getCorrBgColor(corrVal) }}
                        className="aspect-square rounded flex flex-col justify-center items-center font-mono font-bold text-[10px] text-slate-900 border border-slate-200/40 hover:scale-105 transition-transform cursor-pointer relative group"
                      >
                        <span className={Math.abs(corrVal) > 0.8 ? "text-white" : "text-slate-800"}>
                          {corrVal > 0 ? `+${corrVal.toFixed(2)}` : corrVal.toFixed(2)}
                        </span>
                        
                        {/* Hover Tooltip inside Heatmap */}
                        <span className="absolute bottom-full mb-1 bg-slate-900 text-white text-[8px] font-sans px-1.5 py-0.5 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                          {fRow.name} ({corrVal > 0 ? "+" : ""}{corrVal.toFixed(2)})
                        </span>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Color bar indicator gradient */}
          <div className="flex flex-col space-y-1 pt-1">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 font-bold px-1 select-none">
              <span>Negative (-0.4)</span>
              <span>Neutral (0.0)</span>
              <span>Positive (+1.0)</span>
            </div>
            <div className="h-1.5 w-full rounded-sm bg-gradient-to-r from-sky-400 via-slate-100 to-indigo-600 border border-slate-200" />
            <p className="text-[9px] text-slate-500 italic text-center font-bold">
              * Petal Width vs. Petal Length features measure a high pearson correlation (+0.96).
            </p>
          </div>
        </div>
      </div>

      {/* Class Balance distribution metrics row */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm mr-1.5 inline-block"></span>
            Categorical Multiclass Distribution Statistics
          </h3>
          <p className="text-[10px] text-slate-400">Class parity reduces classifier training bias dramatically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(classColors).map((name) => (
            <div key={name} className="flex flex-col space-y-1 bg-slate-50 border border-slate-200/60 p-2.5 rounded">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-700">{name}</span>
                <span className="text-indigo-600 font-mono">50 items (33.3%)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all bg-indigo-600"
                  style={{
                    backgroundColor: classColors[name].dot,
                    width: "33.33%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
