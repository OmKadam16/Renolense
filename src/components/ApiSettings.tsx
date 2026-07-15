import React, { useState } from "react";
import { ChevronDown, ChevronUp, Settings2, Key, Globe, Cpu, Save, CheckCircle, XCircle, Loader2, Shield } from "lucide-react";
import { APIConfig, ProviderType } from "../types.js";

const PROVIDERS: { value: ProviderType; label: string; baseUrl: string }[] = [
  { value: "openai",   label: "OpenAI",        baseUrl: "https://api.openai.com/v1" },
  { value: "groq",     label: "Groq",          baseUrl: "https://api.groq.com/openai/v1" },
  { value: "together", label: "Together",      baseUrl: "https://api.together.xyz/v1" },
  { value: "deepseek", label: "DeepSeek",      baseUrl: "https://api.deepseek.com" },
  { value: "github",   label: "GitHub Models", baseUrl: "https://models.inference.ai.azure.com" },
  { value: "custom",   label: "Custom",        baseUrl: "" },
];

interface Props {
  config: APIConfig;
  onChange: (config: APIConfig) => void;
  onSave: (config: APIConfig) => void;
  saved: boolean;
  defaultOpen?: boolean;
}

type TestStatus = "idle" | "testing" | "success" | "error";

export default function ApiSettings({ config, onChange, onSave, saved, defaultOpen }: Props) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [testMessage, setTestMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleProviderChange = (provider: ProviderType) => {
    const preset = PROVIDERS.find(p => p.value === provider);
    onChange({
      ...config,
      provider,
      baseUrl: preset?.baseUrl || "",
    });
  };

  const selectedProvider = PROVIDERS.find(p => p.value === config.provider);
  const hasActiveKey = !!config.apiKey || !!config.sessionToken;

  const handleTest = async () => {
    if (!hasActiveKey) return;
    setTestStatus("testing");
    setTestMessage("");
    try {
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiConfig: config.apiKey ? config : undefined,
          sessionToken: config.sessionToken || undefined,
        }),
      });
      const data = await res.json();
      setTestStatus(data.success ? "success" : "error");
      setTestMessage(data.message);
    } catch {
      setTestStatus("error");
      setTestMessage("Server unreachable");
    }
  };

  const handleSave = async () => {
    if (!config.apiKey) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/config/set-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiConfig: config }),
      });
      const data = await res.json();
      if (data.success) {
        onSave({ ...config, sessionToken: data.sessionToken, apiKey: "" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formContent = (
    <div className="p-4 space-y-4">
      {/* Provider */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          <Globe className="w-3.5 h-3.5" />
          Provider
        </label>
        <select
          value={config.provider}
          onChange={(e) => handleProviderChange(e.target.value as ProviderType)}
          className="w-full px-3 py-2 rounded-lg border border-[#c2c8c5]/40 text-sm font-medium text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc]"
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          <Cpu className="w-3.5 h-3.5" />
          Model
        </label>
        <input
          type="text"
          value={config.model}
          onChange={(e) => onChange({ ...config, model: e.target.value })}
          placeholder={selectedProvider?.value === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o"}
          className="w-full px-3 py-2 rounded-lg border border-[#c2c8c5]/40 text-sm font-medium text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc] placeholder:text-gray-300"
        />
      </div>

      {/* API Key */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          <Key className="w-3.5 h-3.5" />
          API Key
        </label>
        {config.sessionToken ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Shield className="w-4 h-4" />
            Key saved securely on server
          </div>
        ) : (
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
            placeholder="sk-..."
            className="w-full px-3 py-2 rounded-lg border border-[#c2c8c5]/40 text-sm font-mono text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc] placeholder:text-gray-300"
          />
        )}
      </div>

      {/* Base URL (shown for Custom) */}
      {config.provider === "custom" && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            <Globe className="w-3.5 h-3.5" />
            Base URL
          </label>
          <input
            type="text"
            value={config.baseUrl || ""}
            onChange={(e) => onChange({ ...config, baseUrl: e.target.value })}
            placeholder="https://api.example.com/v1"
            className="w-full px-3 py-2 rounded-lg border border-[#c2c8c5]/40 text-sm font-mono text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc] placeholder:text-gray-300"
          />
        </div>
      )}

      {/* Save & Test buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {!config.sessionToken ? (
          <button
            onClick={handleSave}
            disabled={!config.apiKey || isSaving}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a2e2a] text-white text-xs font-bold hover:opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Shield className="w-3.5 h-3.5" />
            )}
            {isSaving ? "Saving securely..." : "Save Key Securely"}
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            Saved to server session
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={!hasActiveKey || testStatus === "testing"}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-[#727876]/45 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testStatus === "testing" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Globe className="w-3.5 h-3.5" />
          )}
          {testStatus === "testing" ? "Testing..." : "Test Connection"}
        </button>
      </div>

      {/* Test result */}
      {testStatus === "success" && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{testMessage}</span>
        </div>
      )}
      {testStatus === "error" && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{testMessage}</span>
        </div>
      )}

      <p className="text-[10px] text-gray-400 leading-relaxed">
        Your API key is sent to the server once and stored in memory for this session. It is never written to your browser's storage.
      </p>
    </div>
  );

  if (defaultOpen) {
    return formContent;
  }

  return (
    <div className="bg-white rounded-xl border border-[#c2c8c5]/35 shadow-sm mb-6 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#d0e7e1] flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-[#1a2e2a]" />
          </div>
          <div className="text-left">
            <span className="font-bold text-sm text-[#051916] block">API Settings</span>
            <span className="text-[11px] text-gray-400 font-medium">
              {config.sessionToken
                ? `${selectedProvider?.label} · ${config.model} · Securely saved`
                : config.apiKey
                  ? `${selectedProvider?.label} · ${config.model}`
                  : "Not configured"}
            </span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-[#c2c8c5]/20">
          {formContent}
        </div>
      )}
    </div>
  );
}
