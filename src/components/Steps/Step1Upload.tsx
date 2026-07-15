import { useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle, Zap, Upload, MessageSquare, FileText,
  ArrowRight, ChevronDown, ChevronUp, Settings2
} from "lucide-react";
import { IMAGES } from "../../constants.js";
import { APIConfig } from "../../types.js";
import UploadZone from "../UploadZone.js";
import ApiSettings from "../ApiSettings.js";

interface Props {
  roomPreview: string | null;
  inspirationPreview: string | null;
  errorMessage: string | null;
  apiConfig: APIConfig;
  onApiConfigChange: (config: APIConfig) => void;
  onSaveConfig: (config: APIConfig) => void;
  savedConfig: APIConfig;
  onRoomFile: (file: File) => void;
  onInspirationFile: (file: File) => void;
  onLoadSample: () => void;
  onAnalyze: () => void;
}

export default function Step1Upload({
  roomPreview, inspirationPreview, errorMessage,
  apiConfig, onApiConfigChange, onSaveConfig, savedConfig,
  onRoomFile, onInspirationFile, onLoadSample, onAnalyze
}: Props) {
  const [apiOpen, setApiOpen] = useState(false);
  const hasKey = !!apiConfig.apiKey || !!apiConfig.sessionToken;
  const hasImages = !!roomPreview && !!inspirationPreview;
  const isPreset = roomPreview === IMAGES.roomKitchenPreRenovation && inspirationPreview === IMAGES.inspirationKitchenScandinavian;
  const canAnalyze = hasImages && (hasKey || isPreset);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl w-full mx-auto"
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 leading-tight">
          Your AI Renovation Architect
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          Upload your current room and a dream design inspiration. Answer 3 quick questions.
          Get a complete renovation analysis with cost estimates, design insights, and more.
        </p>
      </div>

      {/* Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <UploadZone
          type="room"
          preview={roomPreview}
          placeholderImg={IMAGES.yourRoomPlaceholder}
          placeholderLabel="Premium Template: Traditional Classic Kitchen"
          onFile={onRoomFile}
        />
        <UploadZone
          type="inspiration"
          preview={inspirationPreview}
          placeholderImg={IMAGES.inspirationPlaceholder}
          placeholderLabel="Premium Template: Scandinavian Minimalism"
          onFile={onInspirationFile}
        />
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex items-center justify-center gap-3 flex-col sm:flex-row mb-6">
        <button
          onClick={onLoadSample}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors"
        >
          <Zap className="w-4 h-4" />
          1-Click Sandbox Demo
        </button>

        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Analyze My Renovation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* How It Works */}
      <div className="mt-12 mb-12">
        <h2 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              1
            </div>
            <div className="flex justify-center mb-2">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800 mb-1">Upload Photos</h3>
            <p className="text-xs text-gray-400">Two photos — your current room and a dream design</p>
          </div>

          <div className="flex items-center justify-center hidden md:flex">
            <ArrowRight className="w-5 h-5 text-gray-300" />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              2
            </div>
            <div className="flex justify-center mb-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800 mb-1">Answer Profile</h3>
            <p className="text-xs text-gray-400">3 quick questions about your home and style</p>
          </div>

          <div className="flex items-center justify-center hidden md:flex">
            <ArrowRight className="w-5 h-5 text-gray-300" />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              3
            </div>
            <div className="flex justify-center mb-2">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800 mb-1">Get Full Report</h3>
            <p className="text-xs text-gray-400">Design analysis, costs, reality check, and savings</p>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="mb-12 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sample Analysis Preview</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              78
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">RenoScore</p>
              <p className="text-lg font-bold text-gray-800">Good</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-12 bg-gray-200" />

          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">Design 85</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold">Cost 72</span>
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold">Reality 68</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">Savings 80</span>
          </div>

          <div className="hidden sm:block w-px h-12 bg-gray-200" />

          <div className="text-left">
            <p className="text-xs text-gray-400 font-medium">Est. Cost Range</p>
            <p className="text-sm font-bold text-gray-800">$12,400 &ndash; $18,200</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
          See what RenoLens can discover about your renovation project &mdash; from material recommendations to structural feasibility and budget insights.
        </p>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mb-6" />

      {/* API Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <button
          onClick={() => setApiOpen(!apiOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-left">
              <span className="font-bold text-sm text-gray-800 block">API Configuration</span>
              <span className="text-[11px] text-gray-400 font-medium">
                {apiConfig.sessionToken
                  ? "Connected · Key saved on server"
                  : apiConfig.apiKey
                    ? "Key provided in session"
                    : "Not configured"}
              </span>
            </div>
          </div>
          {apiOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {apiOpen && (
          <div className="border-t border-gray-100">
            <ApiSettings config={apiConfig} onChange={onApiConfigChange} onSave={onSaveConfig} saved={JSON.stringify(savedConfig) === JSON.stringify(apiConfig)} defaultOpen />
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 text-center font-medium">
        Your API key, photos, and answers are sent securely to the AI for a single analysis session.
      </p>
    </motion.div>
  );
}
