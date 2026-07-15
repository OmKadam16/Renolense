import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Home, Heart, DollarSign } from "lucide-react";

interface Props {
  onComplete: (answers: { homeDescription: string; lifestyleStyle: string; budgetRange: string }) => void;
}

const QUESTIONS = [
  {
    key: "homeDescription" as const,
    icon: Home,
    label: "Tell us about your home",
    hint: "What type of home is it? How old? What's the architecture style? Any quirks or challenges?",
    placeholder: "e.g., 1920s bungalow, 3-bed, small galley kitchen, low ceilings, lots of natural light in the morning..."
  },
  {
    key: "lifestyleStyle" as const,
    icon: Heart,
    label: "Describe your lifestyle & style",
    hint: "Who lives here? How do you use the space? What style speaks to you? Any design pet peeves?",
    placeholder: "e.g., Family with two young kids, we love hosting, prefer cozy warm tones, hate clutter, need durable surfaces..."
  },
  {
    key: "budgetRange" as const,
    icon: DollarSign,
    label: "What's your budget range?",
    hint: "A rough estimate helps us check if your dream design is realistic.",
    placeholder: "e.g., $25,000 - $35,000, not sure yet, flexible for the right look..."
  }
];

export default function QuestionnairePage({ onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    homeDescription: "",
    lifestyleStyle: "",
    budgetRange: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const current = QUESTIONS[currentQ];
  const isLast = currentQ === QUESTIONS.length - 1;
  const canProceed = answers[current.key]?.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    if (isLast) {
      setSubmitting(true);
      setTimeout(() => {
        onComplete({
          homeDescription: answers.homeDescription,
          lifestyleStyle: answers.lifestyleStyle,
          budgetRange: answers.budgetRange
        });
      }, 600);
    } else {
      setCurrentQ(q => q + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4faff] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-[#c2c8c5]/25 shadow-sm p-8"
          >
            {/* Progress dots */}
            <div className="flex items-center gap-2 mb-8">
              {QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentQ ? "w-8 bg-[#1a2e2a]" :
                    idx < currentQ ? "w-6 bg-emerald-400" : "w-6 bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#d0e7e1] flex items-center justify-center mb-5">
              <current.icon className="w-6 h-6 text-[#1a2e2a]" />
            </div>

            {/* Question */}
            <h2 className="text-2xl font-extrabold text-[#051916] mb-2">
              {current.label}
            </h2>
            <p className="text-sm text-gray-400 font-medium mb-5">
              {current.hint}
            </p>

            {/* Answer */}
            <textarea
              value={answers[current.key]}
              onChange={(e) => setAnswers({ ...answers, [current.key]: e.target.value })}
              placeholder={current.placeholder}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[#c2c8c5]/40 text-sm text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc] focus:ring-1 focus:ring-[#009bdc]/20 placeholder:text-gray-300 resize-none transition-all"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleNext();
                }
              }}
            />

            {/* Action */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                disabled={!canProceed || submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1a2e2a] text-white text-sm font-bold hover:opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? "Starting analysis..." : isLast ? "Analyze My Renovation" : "Next Question"}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
