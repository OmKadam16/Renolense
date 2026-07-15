import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  key?: React.Key;
  warning: string;
  explanation: string;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

const CATEGORIES = [
  "Lighting Clashes",
  "Operational Access",
  "Acoustic Discomfort",
  "Space Preservation"
];

export default function AccordionItem({ warning, explanation, index, isOpen, onToggle }: Props) {
  const isHighRisk =
    warning.toLowerCase().includes("high") ||
    warning.toLowerCase().includes("light") ||
    warning.toLowerCase().includes("storage");

  return (
    <div className="bg-white border border-[#c2c8c5]/35 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-sm">
      <button
        onClick={() => onToggle(index)}
        className="w-full p-4 flex items-center justify-between text-left focus:outline-none bg-gray-50/50"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isHighRisk ? "bg-red-500 shadow-sm shadow-red-200" : "bg-amber-500 shadow-sm shadow-amber-200"
            }`}
          />
          <h4 className="font-bold text-sm md:text-base text-gray-800 tracking-tight">
            {warning.split(":")[0] || warning}
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            isHighRisk ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
          }`}>
            {isHighRisk ? "High Risk" : "Medium Risk"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-2 items-center mb-2.5">
            <span className="bg-[#1a2e2a]/5 text-[#1a2e2a] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              {CATEGORIES[index] || ""}
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {warning.split(":")[1] || warning} {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
