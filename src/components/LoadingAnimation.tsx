import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2 } from "lucide-react";

const AGENTS = [
  { name: "Agent 1", label: "Room Analysis", emoji: "🏠" },
  { name: "Agent 2", label: "Design Consultant", emoji: "🎨" },
  { name: "Agent 3", label: "Compatibility Planner", emoji: "🔗" },
  { name: "Agent 4", label: "Cost Estimator", emoji: "💰" },
  { name: "Agent 5", label: "The Reality Check", emoji: "🔍" },
  { name: "Agent 6", label: "Savings Optimizer", emoji: "💡" },
  { name: "Agent 7", label: "Final Report", emoji: "📋" },
];

const PATTERNS = [
  "Inspecting your room's layout and lighting conditions...",
  "Analyzing design styles and materials from your inspiration...",
  "Comparing spaces to find compatibility and required changes...",
  "Calculating Southern California renovation costs...",
  "Running the Reality Check — evaluating fit across home, style, and budget...",
  "Finding smart savings opportunities on materials...",
  "Compiling your comprehensive RenoScore report...",
];

export default function LoadingAnimation() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= AGENTS.length) return;

    const timer = setTimeout(() => {
      setActiveIndex(i => i + 1);
    }, 900);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-[#f4faff] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Central loader */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1a2e2a] mb-5"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-[#051916] mb-2">
            Analyzing Your Renovation
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            {activeIndex < AGENTS.length
              ? "Our AI agents are working on your personalized analysis"
              : "Finalizing your report..."}
          </p>
        </div>

        {/* Agent progress list */}
        <div className="space-y-3">
          {AGENTS.map((agent, idx) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: idx <= activeIndex ? 1 : 0.3,
                x: 0
              }}
              transition={{ duration: 0.3, delay: idx <= activeIndex ? 0 : 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                idx === activeIndex
                  ? "bg-white border-[#009bdc]/40 shadow-sm"
                  : idx < activeIndex
                  ? "bg-white border-emerald-200/50 opacity-80"
                  : "bg-gray-50/50 border-[#c2c8c5]/15"
              }`}
            >
              <span className="text-lg">{agent.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${
                    idx === activeIndex ? "text-[#009bdc]" :
                    idx < activeIndex ? "text-emerald-600" : "text-gray-300"
                  }`}>
                    {agent.name}
                  </span>
                  <span className={`text-sm font-semibold ${
                    idx === activeIndex ? "text-[#051916]" :
                    idx < activeIndex ? "text-gray-500" : "text-gray-300"
                  }`}>
                    {agent.label}
                  </span>
                </div>
                {idx === activeIndex && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-gray-400 mt-0.5 truncate"
                  >
                    {PATTERNS[idx]}
                  </motion.p>
                )}
              </div>
              {idx < activeIndex && (
                <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
              {idx === activeIndex && (
                <Loader2 className="w-4 h-4 text-[#009bdc] animate-spin flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* All agents done — show waiting */}
        <AnimatePresence>
          {activeIndex >= AGENTS.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2e2a] border border-[#009bdc]/30 rounded-lg text-white text-sm font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                All agents complete — compiling your final report...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
