import { motion } from "motion/react";
import { STEPS } from "../constants.js";
import { RenoLensAnalysisResult } from "../types.js";

interface Props {
  currentStep: number;
  result: RenoLensAnalysisResult | null;
  onStepClick: (step: number) => void;
}

export default function Header({ currentStep, result, onStepClick }: Props) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#c2c8c5]/30 px-6 md:px-10 py-4 flex justify-between items-center bg-opacity-95 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <span className="font-bold text-2xl tracking-tight text-[#051916]">RenoLens</span>
        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-xs bg-[#d0e7e1] text-[#0a1f1b] font-medium uppercase tracking-wider">
          AI Co-Pilot
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {STEPS.map((step) => {
          const isActive = currentStep === step.num;
          const isDisabled = !result && step.num > 1;
          return (
            <button
              key={step.num}
              onClick={() => result && onStepClick(step.num)}
              disabled={isDisabled}
              className={`font-medium text-sm pb-1 transition-all relative ${
                isActive
                  ? "text-[#009bdc] font-semibold"
                  : isDisabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-[#051916]"
              }`}
            >
              {step.label}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-[#009bdc]"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a2e2a] text-white text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span>Vision Agent</span>
        </div>
      </div>
    </header>
  );
}
