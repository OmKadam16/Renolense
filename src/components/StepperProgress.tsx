import { Check } from "lucide-react";
import { STEPS } from "../constants.js";
import { RenoLensAnalysisResult } from "../types.js";

interface Props {
  currentStep: number;
  result: RenoLensAnalysisResult | null;
  onStepClick: (step: number) => void;
}

export default function StepperProgress({ currentStep, result, onStepClick }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#c2c8c5]/40 -translate-y-1/2 -z-10" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-[#009bdc] -translate-y-1/2 -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;
          return (
            <button
              key={step.num}
              disabled={!result && step.num > 1}
              onClick={() => result && onStepClick(step.num)}
              className="flex flex-col items-center gap-2 group focus:outline-none"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ring-[#f4faff] ${
                  isCompleted
                    ? "bg-[#051916] text-white"
                    : isActive
                    ? "bg-[#009bdc] text-white shadow-md shadow-[#009bdc]/20"
                    : "bg-white border-2 border-[#c2c8c5] text-gray-400 group-hover:border-gray-650"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-[11px] md:text-xs font-semibold tracking-wide uppercase transition-all hidden sm:block ${
                  isActive ? "text-[#009bdc] font-bold" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
