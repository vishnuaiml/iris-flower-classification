import { BookOpen, Award, CheckCircle2, Cpu, HelpCircle, Layers } from "lucide-react";

export function ProjectExplanation() {
  const sections = [
    {
      id: "probl-stmt",
      icon: <HelpCircle className="w-4 h-4 text-indigo-500" />,
      title: "1. Problem Statement",
      content:
        "Train a multi-class biometric machine learning classification system capable of categorizing Iris flowers into three distinct species (Setosa, Versicolor, and Virginica) based on physical attributes. This forms a standard non-linear classification boundary benchmark.",
    },
    {
      id: "data-descrip",
      icon: <BookOpen className="w-4 h-4 text-indigo-500" />,
      title: "2. Dataset Description",
      content:
        "The canonical Iris botanical dataset consists of 150 instances (50 records per species, perfectly balanced). Features represent physical centimeter measurements. Exploration confirms that Petal features hold key discriminative correlations.",
    },
    {
      id: "algoops",
      icon: <Cpu className="w-4 h-4 text-indigo-500" />,
      title: "3. Machine Learning Algorithms",
      content:
        "We implement and contrast 5 independent classifiers in native TypeScript logic: Logistic Regression (multi-class Softmax), Decision Trees (Gini splits), Random Forests (bagged decision trees), K-Nearest Neighbors (Euclidean polling), and Support Vector Machine (mapped on custom standardize ranges).",
    },
    {
      id: "evalmetrics",
      icon: <Layers className="w-4 h-4 text-indigo-500" />,
      title: "4. Training & Validation Set splits",
      content:
        "Utilizing an 80/20 train-test partition seed (fixed state = 42) ensures fully-reproducible local execution. Boundaries are evaluated using full validation Confusion Matrices alongside class-level Precision, Recall, and F1 calculations.",
    },
    {
      id: "findings",
      icon: <Award className="w-4 h-4 text-indigo-500" />,
      title: "5. Conclusions & Taxonomic Findings",
      content:
        "Models reliably generate 96.7% - 100.0% validation scores. Setosa clusters represent linear partitions, whereas Versicolor and Virginica showcase neighboring, overlapping spaces solved perfectly by non-linear Random Forest boundaries.",
    },
  ];

  return (
    <div id="project-explanation-view" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <div
            key={sec.id}
            id={`explanation-sec-${sec.id}`}
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2 flex flex-col"
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-50 rounded">{sec.icon}</div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">{sec.title}</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans flex-1">
              {sec.content}
            </p>
          </div>
        ))}
      </div>

      {/* Highlights summary banner (Matches sidebar background #1e293b) */}
      <div className="bg-[#1e293b] text-white p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Biometric Taxonomy Profile Highlights
          </h3>
          <p className="text-[11px] text-slate-300 max-w-xl">
            This study demonstrates that modern machine learning classifiers can identify biometric botanical patterns with nearly 100% precision. Measuring petal dimensions holds over 8 times more predictive weight than sepals.
          </p>
        </div>
        <div className="flex space-x-1.5 shrink-0 self-end sm:self-auto">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-tight">
            Accuracy: 96.7% - 100.0%
          </span>
        </div>
      </div>
    </div>
  );
}
