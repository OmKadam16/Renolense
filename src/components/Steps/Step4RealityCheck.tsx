import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, TrendingDown, Lightbulb, Gauge, ChevronDown, ChevronUp } from "lucide-react";
import { RenoLensAnalysisResult } from "../../types.js";

interface Props {
  result: RenoLensAnalysisResult;
  onBack: () => void;
  onNext: () => void;
}

const RISK_COLORS: Record<string, string> = {
  "Critical": "bg-red-600",
  "High": "bg-orange-500",
  "Medium": "bg-amber-400",
  "Low": "bg-emerald-400"
};

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 border-red-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-emerald-100 text-emerald-800 border-emerald-200"
};

export default function Step4RealityCheck({ result, onBack, onNext }: Props) {
  const rc = result.realityCheck || {
    riskLevel: "Unknown",
    overallScore: 50,
    homeFit: { score: 50, insight: "Not available", details: [] },
    styleFit: { score: 50, insight: "Not available", details: [] },
    budgetFit: { score: 50, insight: "Not available", details: [] },
    topRisks: [],
    beforeYouCommit: [],
    satisfactionCurve: []
  };
  const [expandedRisk, setExpandedRisk] = useState<number | null>(0);
  const [expandedFit, setExpandedFit] = useState<number | null>(null);

  const fitColor = (score: number) =>
    score >= 70 ? "text-emerald-600" : score >= 45 ? "text-amber-500" : "text-red-500";

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl w-full mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#051916] mb-2">
            The Reality Check
          </h1>
          <p className="text-gray-500 text-sm max-w-lg">
            An honest assessment of how your dream design fits your home, your lifestyle, and your budget.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${
          rc.riskLevel === "Low Risk" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
          rc.riskLevel === "Medium Risk" ? "bg-amber-50 text-amber-800 border-amber-200" :
          rc.riskLevel === "High Risk" ? "bg-orange-50 text-orange-800 border-orange-200" :
          "bg-red-50 text-red-800 border-red-200"
        }`}>
          <Gauge className="w-4 h-4" />
          {rc.riskLevel}
        </div>
      </div>

      {/* Simulation warning */}
      {result.warnings && result.warnings.some(w => w.toLowerCase().includes("reality check") || w.toLowerCase().includes("simulated")) && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Simulated Data</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              The AI analysis for this section was incomplete. The data shown below is a placeholder. 
              To get a real reality check, try using a different AI provider or model in API Settings, or restart the server.
            </p>
          </div>
        </div>
      )}

      {/* Overall Score */}
      <div className="bg-[#1a2e2a] text-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Reality Check Score</p>
            <p className="text-4xl font-black text-white">{rc.overallScore}<span className="text-lg text-gray-400 font-bold">/100</span></p>
          </div>
          <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rc.overallScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${rc.overallScore >= 70 ? "bg-emerald-400" : rc.overallScore >= 45 ? "bg-amber-400" : "bg-red-400"}`}
            />
          </div>
        </div>
      </div>

      {/* Fit Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { key: "homeFit" as const, label: "Home Fit", icon: ArrowLeft },
          { key: "styleFit" as const, label: "Style Fit", icon: Lightbulb },
          { key: "budgetFit" as const, label: "Budget Fit", icon: TrendingDown }
        ].map((dim, idx) => {
          const fit = rc[dim.key];
          return (
          <div key={idx} className="bg-white border border-[#c2c8c5]/35 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{dim.label}</span>
                <span className={`text-lg font-black ${fitColor(fit.score)}`}>{fit.score}<span className="text-xs text-gray-400">/100</span></span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${fit.score >= 70 ? "bg-emerald-400" : fit.score >= 45 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${fit.score}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{fit.insight}</p>
            </div>

            {fit.details && fit.details.length > 0 && (
              <>
                <button
                  onClick={() => setExpandedFit(expandedFit === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-2.5 border-t border-[#c2c8c5]/15 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  {expandedFit === idx ? "Hide details" : "Why this score?"}
                  {expandedFit === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {expandedFit === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-4 pt-2 space-y-2"
                  >
                    {fit.details.map((d, i) => (
                      <div key={i} className="flex gap-2 text-xs text-[#424846] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#009bdc] flex-shrink-0 mt-1.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </div>
          );
        })}
      </div>

      {/* Top Risks */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Top Risks & Mitigations
        </h3>

        <div className="space-y-3">
          {rc.topRisks.map((risk, idx) => (
            <div key={idx} className="bg-white border border-[#c2c8c5]/35 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedRisk(expandedRisk === idx ? null : idx)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${RISK_COLORS[risk.severity] || "bg-gray-400"}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 block">{risk.category}</span>
                  <span className="text-sm font-semibold text-[#051916] block truncate">{risk.risk}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${SEVERITY_COLORS[risk.severity] || "bg-gray-100 text-gray-600"}`}>
                  {risk.severity}
                </span>
              </button>

              {expandedRisk === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-[#c2c8c5]/20 px-4 py-4 space-y-3"
                >
                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-gray-400 font-bold uppercase tracking-wider">Likelihood</span>
                      <p className="font-semibold text-[#051916] mt-0.5">{risk.likelihood}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase tracking-wider">Regret Timeline</span>
                      <p className="font-semibold text-[#051916] mt-0.5">{risk.regretTimeline}</p>
                    </div>
                  </div>
                  <div className="bg-[#f4faff] border border-[#009bdc]/20 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-[#009bdc] text-[10px] font-bold uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Mitigation
                    </div>
                    <p className="text-xs text-[#161c20] font-medium leading-relaxed">{risk.mitigation}</p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
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
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Satisfaction Curve */}
      {rc.satisfactionCurve.length > 0 && (
        <div className="bg-white border border-[#c2c8c5]/35 rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Projected Satisfaction Over Time
          </h3>
          <div className="flex items-end gap-4 h-32">
            {rc.satisfactionCurve.map((point, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(point.score / 100) * 100}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                  className={`w-full max-w-[60px] rounded-t-lg ${
                    point.score >= 70 ? "bg-emerald-400" : point.score >= 45 ? "bg-amber-400" : "bg-red-400"
                  }`}
                  style={{ height: `${(point.score / 100) * 100}%` }}
                />
                <div className="text-center">
                  <span className="block text-xs font-black text-[#051916]">{point.score}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{point.year}yr</span>
                </div>
                <p className="text-[10px] text-gray-500 text-center leading-tight max-w-[120px]">{point.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center border-t border-[#c2c8c5]/25 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-[#727876]/45 text-xs text-gray-500 font-bold hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cost Estimate
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#1a2e2a] hover:opacity-90 font-bold text-xs text-white shadow-md transition-all"
        >
          Next: Savings
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
