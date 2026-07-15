import { motion } from "motion/react";
import { RefreshCw, CheckCircle2, AlertTriangle, TrendingDown, Lightbulb, Home, Sparkles, ArrowLeft, ArrowRight, Gauge } from "lucide-react";
import { RenoLensAnalysisResult } from "../../types.js";

interface Props {
  result: RenoLensAnalysisResult;
  onReset: () => void;
}

export default function Step6FullReport({ result, onReset }: Props) {
  const rc = result.realityCheck || {
    riskLevel: "Unknown",
    overallScore: 50,
    homeFit: { score: 50, insight: "", details: [] },
    styleFit: { score: 50, insight: "", details: [] },
    budgetFit: { score: 50, insight: "", details: [] },
    topRisks: [],
    beforeYouCommit: [],
    satisfactionCurve: []
  };
  const fr = result.finalReport || {
    designMatch: 0, budgetFit: 0, regretRisk: 0, renoScore: 0,
    summary: "", topConcerns: [], topOpportunities: [], nextSteps: []
  };

  const scoreColor = (s: number) =>
    s >= 70 ? "text-emerald-500" : s >= 45 ? "text-amber-500" : "text-red-500";
  const barColor = (s: number) =>
    s >= 70 ? "bg-emerald-400" : s >= 45 ? "bg-amber-400" : "bg-red-400";

  return (
    <motion.div
      key="step6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl w-full mx-auto"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a2e2a] mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#051916] mb-2">
          Your Renovation Report
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          A comprehensive summary of your personalized renovation analysis.
        </p>
      </div>

      {/* RenoScore Hero */}
      <div className="bg-gradient-to-br from-[#1a2e2a] to-[#0d1c18] text-white rounded-2xl p-8 shadow-lg mb-8 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Overall RenoScore</p>
        <p className="text-6xl font-black text-white mb-2">{fr.renoScore}<span className="text-2xl text-gray-400">/100</span></p>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed mt-3">{fr.summary}</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Design Match", score: fr.designMatch, icon: Lightbulb },
          { label: "Budget Fit", score: fr.budgetFit, icon: TrendingDown },
          { label: "Reality Check", score: rc.overallScore, icon: Gauge },
          { label: "Regret Risk", score: fr.regretRisk, icon: AlertTriangle }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#c2c8c5]/35 rounded-xl p-4 shadow-sm text-center">
            <item.icon className={`w-5 h-5 mx-auto mb-2 ${scoreColor(item.score)}`} />
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`text-2xl font-black ${scoreColor(item.score)}`}>{item.score}</p>
          </div>
        ))}
      </div>

      {/* Two Column: Key Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Room & Design Summary */}
        <div className="bg-white border border-[#c2c8c5]/35 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Room & Design
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Current Style</span>
              <span className="font-semibold text-[#051916]">{result.roomAnalysis.style}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target Style</span>
              <span className="font-semibold text-[#051916]">{result.inspirationAnalysis.designStyle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Room Type</span>
              <span className="font-semibold text-[#051916]">{result.roomAnalysis.roomType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Size</span>
              <span className="font-semibold text-[#051916]">{result.roomAnalysis.estimatedSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Cost</span>
              <span className="font-semibold text-[#051916]">{result.costEstimate.realisticEstimate}</span>
            </div>
          </div>
        </div>

        {/* Reality Check Summary */}
        <div className="bg-white border border-[#c2c8c5]/35 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Reality Check
          </h3>
          <div className="space-y-3">
            {[
              { label: "Home Fit", score: rc.homeFit.score },
              { label: "Style Fit", score: rc.styleFit.score },
              { label: "Budget Fit", score: rc.budgetFit.score }
            ].map((fit, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">{fit.label}</span>
                  <span className={`font-bold ${scoreColor(fit.score)}`}>{fit.score}/100</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor(fit.score)}`} style={{ width: `${fit.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Concerns & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#c2c8c5]/35 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Top Concerns
          </h3>
          <ul className="space-y-2">
            {fr.topConcerns.map((c, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{idx + 1}</span>
                <span className="font-medium">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#c2c8c5]/35 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Opportunities
          </h3>
          <ul className="space-y-2">
            {fr.topOpportunities.map((o, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{idx + 1}</span>
                <span className="font-medium">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Before You Commit */}
      {rc.beforeYouCommit.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-5 mb-8">
          <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Before You Commit
          </h3>
          <ul className="space-y-2">
            {rc.beforeYouCommit.map((item, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-amber-900 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{idx + 1}</span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-[#1a2e2a] rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          Recommended Next Steps
        </h3>
        <ul className="space-y-3">
          {fr.nextSteps.map((step, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-[#1a2e2a] border border-[#009bdc]/40 text-[#009bdc] flex items-center justify-center text-[11px] font-black flex-shrink-0">{idx + 1}</span>
              <span className="font-medium pt-0.5">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center border-t border-[#c2c8c5]/25 pt-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#009bdc] hover:opacity-95 font-bold text-xs text-white shadow-md transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Start New Evaluation
        </button>
      </div>
    </motion.div>
  );
}
