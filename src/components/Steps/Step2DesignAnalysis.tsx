import { motion } from "motion/react";
import {
  Check, ArrowLeft, ArrowRight, Palette, Layers, Zap, AlertTriangle, Info, BadgeAlert, Flame, ShieldCheck
} from "lucide-react";
import { IMAGES } from "../../constants.js";
import { RenoLensAnalysisResult } from "../../types.js";

interface Props {
  result: RenoLensAnalysisResult;
  roomPreview: string | null;
  inspirationPreview: string | null;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2DesignAnalysis({ result, roomPreview, inspirationPreview, onBack, onNext }: Props) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl w-full mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#051916] mb-2">
          Design Analysis &mdash; Style Matching
        </h1>
        <p className="text-gray-500 text-sm">
          Our Room and Inspiration agents have indexed your current spatial details against target style specs. Here is the compatibility breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a2e2a] hover:scale-105 text-white p-4 rounded-full shadow-2xl border-4 border-white hidden md:flex flex-col items-center justify-center transition-all duration-300 w-24 h-24">
          <span className="text-[9px] uppercase tracking-wider font-semibold opacity-85">Match</span>
          <span className="text-3xl font-black text-[#009bdc] leading-none">
            {result.compatibilityAnalysis.compatibilityScore}%
          </span>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-[#c2c8c5]/35 shadow-sm group">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Your Baseline Space</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold uppercase tracking-wider">
              Detected: {result.roomAnalysis.roomType}
            </span>
          </div>
          <div className="relative aspect-video bg-gray-100">
            <img
              src={roomPreview || IMAGES.roomKitchenPreRenovation}
              alt="Existing Layout"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
              Style: {result.roomAnalysis.style}
            </div>
          </div>

          <div className="p-5 space-y-3.5">
            <div className="flex border-b border-gray-100 pb-2 flex-wrap sm:flex-nowrap gap-2 justify-between">
              <span className="text-xs text-gray-400 font-semibold uppercase">Estimated Area</span>
              <span className="text-xs font-bold text-gray-800">{result.roomAnalysis.estimatedSize}</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2 flex-wrap sm:flex-nowrap gap-2 justify-between">
              <span className="text-xs text-gray-400 font-semibold uppercase">Flooring Material</span>
              <span className="text-xs font-bold text-gray-800">{result.roomAnalysis.flooring}</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2 flex-wrap sm:flex-nowrap gap-2 justify-between">
              <span className="text-xs text-gray-400 font-semibold uppercase">Primary Walls</span>
              <span className="text-xs font-bold text-gray-800">{result.roomAnalysis.wallColor}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-semibold uppercase mb-1">Identified constraints</span>
              <div className="flex flex-wrap gap-1.5">
                {result.roomAnalysis.limitations.map((limit, idx) => (
                  <span key={idx} className="bg-red-50 text-red-700 border border-red-100 px-2.5 py-0.5 rounded text-[10px] font-bold">
                    {limit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-[#c2c8c5]/35 shadow-sm group">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Dream Inspiration Target</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#d5e3fc] text-[#0d1c2e] font-bold uppercase tracking-wider">
              {result.inspirationAnalysis.luxuryLevel}
            </span>
          </div>
          <div className="relative aspect-video bg-gray-100">
            <img
              src={inspirationPreview || IMAGES.inspirationKitchenScandinavian}
              alt="Inspiration layout"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute bottom-3 left-3 bg-[#009bdc] px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
              Design Style: {result.inspirationAnalysis.designStyle}
            </div>
          </div>

          <div className="p-5 space-y-3.5">
            <div className="flex border-b border-gray-100 pb-2 flex-wrap sm:flex-nowrap gap-2 justify-between">
              <span className="text-xs text-[#009bdc] font-bold uppercase tracking-wider">Target Complexity</span>
              <span className="text-xs font-black text-gray-800 uppercase">{result.inspirationAnalysis.complexity}</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2 flex-wrap sm:flex-nowrap gap-2 justify-between">
              <span className="text-xs text-gray-400 font-semibold uppercase">Premium Materials</span>
              <span className="text-xs font-bold text-gray-800">{result.inspirationAnalysis.materials.join(", ")}</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2 flex-wrap sm:flex-nowrap gap-2 justify-between">
              <span className="text-xs text-gray-400 font-semibold uppercase">Lighting Pattern</span>
              <span className="text-xs font-bold text-gray-800">{result.inspirationAnalysis.lightingStyle}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-semibold uppercase mb-1">Primary Color Palette Specs</span>
              <div className="flex flex-wrap gap-1.5">
                {result.inspirationAnalysis.colors.map((color, idx) => (
                  <span key={idx} className="bg-sky-50 text-sky-700 border border-sky-100 px-2.5 py-0.5 rounded text-[10px] font-bold">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#c2c8c5]/35 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#009bdc]">
            <Palette className="w-5 h-5" />
            <h4 className="font-bold text-sm uppercase tracking-wider">Color Alignment</h4>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Suggesting <b>{result.inspirationAnalysis.colors[0]}</b> and accents of <b>{result.inspirationAnalysis.colors[1]}</b>. Transitioning from dull beige walls to bright, pristine neutrals.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c2c8c5]/35 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-500">
            <Layers className="w-5 h-5" />
            <h4 className="font-bold text-sm uppercase tracking-wider">Material Flow</h4>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Transitioning from heavy textured <b>{result.roomAnalysis.flooring}</b> to engineered surfaces like <b>{result.inspirationAnalysis.materials[0]}</b>.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c2c8c5]/35 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-violet-500">
            <Zap className="w-5 h-5" />
            <h4 className="font-bold text-sm uppercase tracking-wider">Lighting Feasibility</h4>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Existing environment exhibits constrained natural sunlight. Contractor recommends supplemental warm <b>{result.inspirationAnalysis.lightingStyle}</b> fixtures.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-[#c2c8c5]/25 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-[#727876]/45 text-xs text-gray-500 font-bold hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#1a2e2a] hover:opacity-90 font-bold text-xs text-white shadow-md transition-all font-sans"
        >
          Next: Cost Estimate
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
