import { useState, useCallback } from "react";
import ErrorBoundary from "./components/ErrorBoundary.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import StepperProgress from "./components/StepperProgress.js";
import Step1Upload from "./components/Steps/Step1Upload.js";
import Step2DesignAnalysis from "./components/Steps/Step2DesignAnalysis.js";
import Step3CostEstimate from "./components/Steps/Step3CostEstimate.js";
import Step4RealityCheck from "./components/Steps/Step4RealityCheck.js";
import Step5Savings from "./components/Steps/Step5Savings.js";
import Step6FullReport from "./components/Steps/Step6FullReport.js";
import QuestionnairePage from "./components/QuestionnairePage.js";
import LoadingAnimation from "./components/LoadingAnimation.js";
import { IMAGES } from "./constants.js";
import { RenoLensAnalysisResult, APIConfig, HomeProfile } from "./types.js";

const DEFAULT_API_CONFIG: APIConfig = {
  provider: "openai",
  apiKey: "",
  model: "gpt-4o",
  baseUrl: "https://api.openai.com/v1",
};

const STORAGE_KEY = "renolens_api_config";

function loadSavedConfig(): APIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as APIConfig;
  } catch { /* ignore */ }
  return DEFAULT_API_CONFIG;
}

type Phase = "upload" | "profile" | "loading" | "results";

export default function App() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [inspirationImage, setInspirationImage] = useState<string | null>(null);
  const [roomPreview, setRoomPreview] = useState<string | null>(null);
  const [inspirationPreview, setInspirationPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [result, setResult] = useState<RenoLensAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedConfig, setSavedConfig] = useState<APIConfig>(() => loadSavedConfig());
  const [apiConfig, setApiConfig] = useState<APIConfig>(() => loadSavedConfig());
  const [homeProfile, setHomeProfile] = useState<HomeProfile | null>(null);

  const handleSaveConfig = useCallback((config: APIConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSavedConfig(config);
  }, []);

  const handleLoadSample = () => {
    setRoomPreview(IMAGES.roomKitchenPreRenovation);
    setInspirationPreview(IMAGES.inspirationKitchenScandinavian);
    setRoomImage("PRESET:suburban_classic_kitchen");
    setInspirationImage("PRESET:scandinavian_minimal_kitchen");
    setErrorMessage(null);
  };

  const readFile = (file: File, type: "room" | "inspiration") => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === "room") {
        setRoomPreview(base64String);
        setRoomImage(base64String);
      } else {
        setInspirationPreview(base64String);
        setInspirationImage(base64String);
      }
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRoomFile = (file: File) => readFile(file, "room");
  const handleInspirationFile = (file: File) => readFile(file, "inspiration");

  const handleStartProfile = () => {
    if (!roomImage || !inspirationImage) {
      setErrorMessage("Please upload both Your Room photo and an Inspiration Design image to proceed.");
      return;
    }
    setPhase("profile");
  };

  const handleProfileComplete = (answers: { homeDescription: string; lifestyleStyle: string; budgetRange: string }) => {
    const profile: HomeProfile = {
      homeDescription: answers.homeDescription,
      lifestyleStyle: answers.lifestyleStyle,
      budgetRange: answers.budgetRange,
    };
    setHomeProfile(profile);
    setPhase("loading");
    runOrchestrator(profile);
  };

  const runOrchestrator = async (profile: HomeProfile) => {
    if (!roomImage || !inspirationImage) return;

    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomImage,
          inspirationImage,
          usePreset: roomImage.startsWith("PRESET:"),
          ...(roomImage.startsWith("PRESET:")
            ? {}
            : apiConfig.sessionToken
              ? { sessionToken: apiConfig.sessionToken, apiConfig: { provider: apiConfig.provider, model: apiConfig.model, baseUrl: apiConfig.baseUrl } }
              : { apiConfig }),
          homeProfile: profile
        })
      });

      const data = await response.json();

      if (data.success) {
        const resultData = data.data;

        // Migrate old server response format (regretAnalysis → realityCheck)
        if (!resultData.realityCheck) {
          resultData.warnings = [...(resultData.warnings || []), "Reality Check data is simulated — the AI agent returned incomplete results."];
          if (resultData.regretAnalysis) {
            resultData.realityCheck = {
              riskLevel: resultData.regretAnalysis.riskLevel || "Unknown",
              overallScore: resultData.finalReport?.regretRisk ?? 50,
              homeFit: { score: 50, insight: "Home fit assessment not available.", details: [] },
              styleFit: { score: 50, insight: "Style fit assessment not available.", details: [] },
              budgetFit: { score: 50, insight: "Budget fit assessment not available.", details: [] },
              topRisks: (resultData.regretAnalysis.warnings || []).map((w: string, i: number) => ({
                category: "General",
                risk: w,
                severity: "Medium",
                likelihood: "Possible",
                mitigation: resultData.regretAnalysis.explanations?.[i] || "Review this concern with your contractor.",
                regretTimeline: "Variable"
              })),
              beforeYouCommit: ["Review all identified risks with your contractor before proceeding."],
              satisfactionCurve: [
                { year: 1, score: 70, note: "Initial satisfaction based on available data" },
                { year: 5, score: 55, note: "Long-term satisfaction may vary" }
              ]
            };
          } else {
            resultData.realityCheck = {
              riskLevel: "Unknown",
              overallScore: 50,
              homeFit: { score: 50, insight: "Home fit assessment not available.", details: [] },
              styleFit: { score: 50, insight: "Style fit assessment not available.", details: [] },
              budgetFit: { score: 50, insight: "Budget fit assessment not available.", details: [] },
              topRisks: [],
              beforeYouCommit: [],
              satisfactionCurve: []
            };
          }
        }

        setResult(resultData);
        setCurrentStep(2);
        setPhase("results");
      } else {
        setErrorMessage(data.error || "A secure connection error occurred during model analysis.");
        setPhase("upload");
      }
    } catch {
      setErrorMessage("The server backend was unreachable. Please confirm port is running and active.");
      setPhase("upload");
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setRoomPreview(null);
    setInspirationPreview(null);
    setRoomImage(null);
    setInspirationImage(null);
    setHomeProfile(null);
    setCurrentStep(2);
    setPhase("upload");
  };

  // Upload phase
  if (phase === "upload") {
    return (
      <ErrorBoundary>
      <div className="bg-[#f4faff] text-[#161c20] min-h-screen flex flex-col font-sans transition-colors duration-300">
        <Header currentStep={1} result={null} onStepClick={() => {}} />
        <main className="flex-grow pt-28 pb-16 px-4 md:px-8 max-w-7xl w-full mx-auto flex flex-col">
          <div className="flex-grow flex flex-col justify-center">
            <Step1Upload
              roomPreview={roomPreview}
              inspirationPreview={inspirationPreview}
              errorMessage={errorMessage}
              apiConfig={apiConfig}
              onApiConfigChange={setApiConfig}
              onSaveConfig={handleSaveConfig}
              savedConfig={savedConfig}
              onRoomFile={handleRoomFile}
              onInspirationFile={handleInspirationFile}
              onLoadSample={handleLoadSample}
              onAnalyze={handleStartProfile}
            />
          </div>
        </main>
        <Footer />
      </div>
      </ErrorBoundary>
    );
  }

  // Profile (questionnaire) phase
  if (phase === "profile") {
    return (
      <div className="bg-[#f4faff] min-h-screen">
        <QuestionnairePage onComplete={handleProfileComplete} />
      </div>
    );
  }

  // Loading phase
  if (phase === "loading") {
    return (
      <div className="bg-[#f4faff] min-h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  // Results phase (stepper + result steps)
  return (
    <ErrorBoundary>
    <div className="bg-[#f4faff] text-[#161c20] min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Header currentStep={currentStep} result={result} onStepClick={setCurrentStep} />

      <main className="flex-grow pt-28 pb-16 px-4 md:px-8 max-w-7xl w-full mx-auto flex flex-col">
        <StepperProgress currentStep={currentStep} result={result} onStepClick={setCurrentStep} />

        <div className="flex-grow flex flex-col justify-center">
          {currentStep === 2 && result && (
            <Step2DesignAnalysis
              result={result}
              roomPreview={roomPreview}
              inspirationPreview={inspirationPreview}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && result && (
            <Step3CostEstimate
              result={result}
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && result && (
            <Step4RealityCheck
              result={result}
              onBack={() => setCurrentStep(3)}
              onNext={() => setCurrentStep(5)}
            />
          )}

          {currentStep === 5 && result && (
            <Step5Savings result={result} onReset={resetAnalysis} onNext={() => setCurrentStep(6)} />
          )}

          {currentStep === 6 && result && (
            <Step6FullReport result={result} onReset={resetAnalysis} />
          )}
        </div>
      </main>

      <Footer />
    </div>
    </ErrorBoundary>
  );
}
