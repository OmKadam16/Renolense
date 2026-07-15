import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Info, Coins } from "lucide-react";
import { IMAGES } from "../../constants.js";
import { RenoLensAnalysisResult } from "../../types.js";

interface Props {
  result: RenoLensAnalysisResult;
  onReset: () => void;
  onNext?: () => void;
}

export default function Step5Savings({ result, onReset, onNext }: Props) {
  const totalSavings = result.savingsAnalysis.alternatives.reduce((sum, alt) => {
    const match = alt.estimatedSavings.match(/[\d,]+/);
    return sum + (match ? parseInt(match[0].replace(/,/g, ""), 10) : 0);
  }, 0);

  const formatSavings = (val: number) =>
    "$" + val.toLocaleString("en-US");
  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl w-full mx-auto"
    >
      <div className="flex justify-between items-end mb-8 border-b border-[#c2c8c5]/20 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#051916] mb-1">
            Savings &amp; Optimization Report
          </h1>
          <p className="text-gray-500 text-sm">
            Smart strategic substitutions mapped to preserve architectural value while minimizing cost.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-[#d0e7e1] text-[#0a1f1b] rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Optimization Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 space-y-6">
          {result.savingsAnalysis.alternatives.map((altItem, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#c2c8c5]/35 rounded-xl p-5 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center gap-6 relative"
            >
              <div className="flex-1 w-full space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  ORIGINAL SECIFICATIONS
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <img
                      src={idx === 0 ? IMAGES.carraraMarbleOriginal : IMAGES.oakCabinetryOriginal}
                      alt="Original premium spec demo"
                      className="w-full h-full object-cover filter contrast-[90%] brightness-95"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-700">{altItem.original}</h4>
                    <p className="text-gray-400 text-[11px] font-semibold">Premium Natural Selection</p>
                    <span className="text-red-500 text-xs font-bold line-through block mt-1">
                      {altItem.originalCost}
                    </span>
                    {altItem.originalCostPerSqft && (
                      <span className="text-[10px] text-gray-400 font-medium">{altItem.originalCostPerSqft}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex-1 w-full p-4 bg-[#f4faff] border border-[#009bdc]/30 rounded-xl relative overflow-hidden space-y-2 group">
                <div className="absolute top-0 right-0 bg-[#009bdc] text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">
                  RECOMMENDED
                </div>

                <span className="text-[10px] font-bold text-[#009bdc] uppercase tracking-wider block">
                  ARCHITECTURAL SUBSTITUTE
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200/50 flex-shrink-0">
                    <img
                      src={idx === 0 ? IMAGES.engineeredQuartzAlternative : IMAGES.veneerCabinetryAlternative}
                      alt="Alternative spec demo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#051916]">{altItem.alternative}</h4>
                    <p className="text-gray-500 text-[10px] font-medium leading-tight mt-0.5">
                      {altItem.reason.split(",")[0] || "Low Maintenance & Durable"}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-black text-[#1a2e2a]">
                        {altItem.alternativeCost}
                      </span>
                      {altItem.alternativeCostPerSqft && (
                        <span className="text-[10px] text-gray-400 font-medium ml-1">({altItem.alternativeCostPerSqft})</span>
                      )}
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 uppercase tracking-wide">
                        {altItem.estimatedSavings}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-[#1a2e2a] text-white p-5 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Total Savings Realized</h3>
              <p className="text-xs text-gray-300 font-light mt-0.5">
                By routing structural adjustments and material optimizations.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[#009bdc] text-3xl font-black drop-shadow-sm block">
                {formatSavings(totalSavings)}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-widest text-emerald-200 block mt-1">
                Estimated Total Saved
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#c2c8c5]/35 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-gray-700 tracking-wide uppercase border-b border-gray-100 pb-2">
              Summary of Opportunities Found
            </h4>
            <ul className="space-y-3">
              {result.finalReport.topOpportunities.map((op, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs text-gray-600 leading-relaxed font-medium">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 text-[10px] font-black flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{op}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-[#c2c8c5]/35 rounded-xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block">
              Final Efficiency Status
            </span>

            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#e3e9ee"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#009bdc"
                  strokeWidth="10"
                  strokeDasharray="439.8"
                  initial={{ strokeDashoffset: 439.8 }}
                  animate={{ strokeDashoffset: 439.8 * (1 - result.finalReport.renoScore / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-4xl font-extrabold text-[#1a2e2a]">
                  {result.finalReport.renoScore}
                </span>
                <span className="text-[11px] text-gray-400 font-bold block mt-1">/ 100</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-extrabold text-[#1a2e2a] text-lg">RenoScore: Optimized</h4>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                Your overall value-to-cost placement ranks in the <b>top 15%</b> of Southern California design templates.
              </p>
            </div>
          </div>

          <div className="bg-[#1a2e2a] p-5 rounded-xl shadow-lg text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Coins className="w-5 h-5 text-emerald-300" />
              <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-300">
                Recommended Next Steps
              </h4>
            </div>

            <ul className="space-y-4 font-light text-xs text-gray-300">
              {result.finalReport.nextSteps.map((step, idx) => (
                <li key={idx} className="flex gap-2.5 items-start leading-relaxed">
                  <span className="font-bold text-[#009bdc] text-[13px] flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#d5e3fc]/15 p-4 rounded-xl border border-[#0d1c2e]/10">
            <div className="flex gap-1.5 items-center mb-1 text-[#009bdc]">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Agent Note</span>
            </div>
            <p className="text-[11px] text-[#3a485b] leading-relaxed">
              By switching to engineered stone formats we also compressed the environmental transport emissions footprint of materials by 22% while ensuring flawless geometric fit.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-[#c2c8c5]/25 pt-6 mt-10">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#727876]/45 text-xs text-gray-500 font-bold hover:bg-gray-100 transition-colors"
        >
          <span>Start New Evaluation</span>
        </button>
        {onNext ? (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#009bdc] hover:opacity-95 font-bold text-xs text-white shadow-md transition-all"
          >
            View Full Report
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : <div />}
      </div>
    </motion.div>
  );
}
