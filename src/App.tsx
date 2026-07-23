import { useState } from "react";
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
import { runMultiAgentAnalysis } from "./agentsOrchestrator.js";
import { PresetAnalysisReport } from "./presetData.js";
import { IMAGES } from "./constants.js";
import { RenoLensAnalysisResult, APIConfig, HomeProfile } from "./types.js";

const DEFAULT_API_CONFIG: APIConfig = {
  provider: "openai",
  apiKey: "",
  model: "gpt-4o",
  baseUrl: "https://api.openai.com/v1",
};

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
  const [apiConfig, setApiConfig] = useState<APIConfig>(DEFAULT_API_CONFIG);

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
    if (!roomImage.startsWith("PRESET:") && !apiConfig.apiKey) {
      setErrorMessage("Please enter your API key in the settings below before proceeding.");
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
    setPhase("loading");
    runOrchestrator(profile);
  };

  const runOrchestrator = async (profile: HomeProfile) => {
    if (!roomImage || !inspirationImage) return;
    setErrorMessage(null);

    if (roomImage.startsWith("PRESET:")) {
      await new Promise((r) => setTimeout(r, 2500));
      setResult(PresetAnalysisReport);
      setCurrentStep(2);
      setPhase("results");
      return;
    }

    try {
      const resultData = await runMultiAgentAnalysis(
        roomImage,
        inspirationImage,
        apiConfig,
        profile
      );
      setResult(resultData);
      setCurrentStep(2);
      setPhase("results");
    } catch (error: any) {
      const msg = (error?.message || "AI analysis failed. Check your API key and model selection.").replace(/sk-[a-zA-Z0-9]{20,}/g, "[KEY REDACTED]");
      setErrorMessage(msg);
      setPhase("upload");
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setRoomPreview(null);
    setInspirationPreview(null);
    setRoomImage(null);
    setInspirationImage(null);
    setApiConfig(DEFAULT_API_CONFIG);
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
