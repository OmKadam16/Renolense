import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Info, TrendingUp } from "lucide-react";
import { IMAGES } from "../../constants.js";
import { RenoLensAnalysisResult } from "../../types.js";

interface Props {
  result: RenoLensAnalysisResult;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3CostEstimate({ result, onBack, onNext }: Props) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl w-full mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#051916] mb-2">
          Estimated Cost Outline
        </h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Contractor budgets scaled for <b>Southern California</b> zoning and material costs (includes a 15% safety variance).
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-[#c2c8c5]/35 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-3">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              CONFIDENCE RANGE BUDGET
            </span>
            <h4 className="text-xs text-gray-500 font-semibold italic">
              Calculated trajectory for {result.roomAnalysis.estimatedSize}
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[#009bdc] text-xs font-bold uppercase tracking-wider block">
              LIKELY MEDIAN
            </span>
            <span className="text-3xl md:text-4xl font-extrabold text-[#051916]">
              {result.costEstimate.realisticEstimate}
            </span>
          </div>
        </div>

        <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-rose-400 mt-6 mb-16 px-1">
          <div className="absolute left-[15%] -top-2.5 h-9 w-1.5 bg-gray-800 rounded-full" />
          <div className="absolute left-[15%] top-10 transform -translate-x-1/2 text-center w-24">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Low End</span>
            <p className="text-sm font-extrabold text-gray-800">{result.costEstimate.lowEstimate}</p>
          </div>

          <div className="absolute left-[54%] -top-4 h-12 w-2.5 bg-[#009bdc] rounded-full shadow-lg ring-4 ring-white" />

          <div className="absolute left-[85%] -top-2.5 h-9 w-1.5 bg-gray-800 rounded-full" />
          <div className="absolute left-[85%] top-10 transform -translate-x-1/2 text-center w-24">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">High End</span>
            <p className="text-sm font-extrabold text-gray-800">{result.costEstimate.highEstimate}</p>
          </div>
        </div>

        <div className="pt-5 border-t border-gray-100 flex gap-3 text-gray-400">
          <Info className="w-5 h-5 text-[#009bdc] flex-shrink-0" />
          <span className="text-xs italic leading-relaxed">
            Estimates incorporate structural compliance margins and 15% safety contingency for Southern California building codes.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white rounded-xl border border-[#c2c8c5]/35 p-5 shadow-sm">
          <h3 className="font-bold text-lg text-[#051916] mb-4">Line Items</h3>

          <div className="space-y-0.5">
            <div className="flex justify-between py-3 border-b border-gray-100 items-center">
              <span className="text-xs font-semibold text-gray-700">Flooring install (Hardwood/premium veneer)</span>
              <span className="text-xs font-extrabold text-[#051916]">{result.costEstimate.flooringCost}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 items-center">
              <span className="text-xs font-semibold text-gray-700">Premium Matte Interior Painting &amp; walls</span>
              <span className="text-xs font-extrabold text-[#051916]">{result.costEstimate.paintCost}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 items-center">
              <span className="text-xs font-semibold text-gray-700">Premium statement &amp; Recessed lighting</span>
              <span className="text-xs font-extrabold text-[#051916]">{result.costEstimate.lightingCost}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 items-center">
              <span className="text-xs font-semibold text-gray-700">Custom cabinetry / Millwork furniture</span>
              <span className="text-xs font-extrabold text-[#051916]">{result.costEstimate.furnitureCost}</span>
            </div>
            <div className="flex justify-between py-3 items-center">
              <span className="text-xs font-semibold text-gray-700">Estimated Contractor assembly Labor</span>
              <span className="text-xs font-extrabold text-[#051916]">{result.costEstimate.laborCost}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2e2a] text-white p-5 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              BIGGEST COST DRIVER
            </span>
            <h4 className="text-xl font-bold mt-1 text-white">Specialized Labor</h4>
            <p className="text-xs text-gray-300 mt-4 leading-relaxed font-light">
              64% of your Southern California budget is tied directly to specialty carpentry and local contractor union availability. Securing a crew early reduces project fee exposure.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-1.5 relative z-10 bg-black/25 px-2.5 py-1.5 rounded-lg w-fit text-xs font-bold text-white uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span>Volatility Scale: High</span>
          </div>

          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[#051916] opacity-35 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
        </div>
      </div>

      <div className="mb-10 rounded-xl overflow-hidden shadow-sm aspect-[4/1] relative group hidden md:block">
        <img
          src={IMAGES.remodelingContextFooter}
          alt="Active Construction Site Mock"
          className="w-full h-full object-cover filter contrast-[95%] brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-5">
          <p className="text-white text-xs font-semibold italic text-slate-200">
            RenoLens Co-Pilot: Estimations dynamically updated using material and local demographic tables.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-[#c2c8c5]/25 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-[#727876]/45 text-xs text-gray-500 font-bold hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#1a2e2a] hover:opacity-90 font-bold text-xs text-white shadow-md transition-all font-sans"
        >
          Next: The Reality Check
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
