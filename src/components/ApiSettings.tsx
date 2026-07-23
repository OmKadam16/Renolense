import { Key, Globe } from "lucide-react";
import { APIConfig, ProviderType } from "../types.js";

interface ModelEntry {
  model: string;
  provider: ProviderType;
  baseUrl: string;
  providerLabel: string;
}

const MODELS: ModelEntry[] = [
  { model: "gpt-4o",              provider: "openai",   baseUrl: "https://api.openai.com/v1",                providerLabel: "OpenAI" },
  { model: "gpt-4o-mini",         provider: "openai",   baseUrl: "https://api.openai.com/v1",                providerLabel: "OpenAI" },
  { model: "gpt-4-turbo",         provider: "openai",   baseUrl: "https://api.openai.com/v1",                providerLabel: "OpenAI" },
  { model: "gpt-4",               provider: "openai",   baseUrl: "https://api.openai.com/v1",                providerLabel: "OpenAI" },
  { model: "o1",                  provider: "openai",   baseUrl: "https://api.openai.com/v1",                providerLabel: "OpenAI" },
  { model: "o1-mini",             provider: "openai",   baseUrl: "https://api.openai.com/v1",                providerLabel: "OpenAI" },
  { model: "o3-mini",             provider: "openai",   baseUrl: "https://api.openai.com/v1",                providerLabel: "OpenAI" },
  { model: "llama-3.3-70b-versatile",  provider: "groq",   baseUrl: "https://api.groq.com/openai/v1",        providerLabel: "Groq" },
  { model: "llama-3.1-8b-instant",     provider: "groq",   baseUrl: "https://api.groq.com/openai/v1",        providerLabel: "Groq" },
  { model: "mixtral-8x7b-32768",       provider: "groq",   baseUrl: "https://api.groq.com/openai/v1",        providerLabel: "Groq" },
  { model: "gemma2-9b-it",             provider: "groq",   baseUrl: "https://api.groq.com/openai/v1",        providerLabel: "Groq" },
  { model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",  provider: "together", baseUrl: "https://api.together.xyz/v1",  providerLabel: "Together" },
  { model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",   provider: "together", baseUrl: "https://api.together.xyz/v1",  providerLabel: "Together" },
  { model: "mistralai/Mixtral-8x7B-Instruct-v0.1",          provider: "together", baseUrl: "https://api.together.xyz/v1",  providerLabel: "Together" },
  { model: "google/gemma-2-27b-it",                         provider: "together", baseUrl: "https://api.together.xyz/v1",  providerLabel: "Together" },
  { model: "deepseek-chat",         provider: "deepseek", baseUrl: "https://api.deepseek.com",               providerLabel: "DeepSeek" },
  { model: "deepseek-reasoner",     provider: "deepseek", baseUrl: "https://api.deepseek.com",               providerLabel: "DeepSeek" },
  { model: "gpt-4o",                provider: "github",   baseUrl: "https://models.inference.ai.azure.com",  providerLabel: "GitHub Models" },
  { model: "gpt-4o-mini",           provider: "github",   baseUrl: "https://models.inference.ai.azure.com",  providerLabel: "GitHub Models" },
  { model: "gpt-4-turbo",           provider: "github",   baseUrl: "https://models.inference.ai.azure.com",  providerLabel: "GitHub Models" },
];

const CUSTOM_MODEL_VALUE = "__custom__";
const isCustom = (val: string) => val === CUSTOM_MODEL_VALUE;

function modelKey(m: ModelEntry) { return `${m.provider}||${m.model}`; }

function groupModels() {
  const groups = new Map<string, ModelEntry[]>();
  for (const m of MODELS) {
    const list = groups.get(m.providerLabel) || [];
    list.push(m);
    groups.set(m.providerLabel, list);
  }
  return groups;
}

const MODELS_BY_KEY = new Map<string, ModelEntry>(MODELS.map(m => [modelKey(m), m]));

interface Props {
  config: APIConfig;
  onChange: (config: APIConfig) => void;
  defaultOpen?: boolean;
}

export default function ApiSettings({ config, onChange, defaultOpen }: Props) {
  const matchedModel = MODELS.find(m => m.model === config.model && m.provider === config.provider);
  const selectedValue = matchedModel ? modelKey(matchedModel) : (config.model ? CUSTOM_MODEL_VALUE : "");
  const usingCustom = !matchedModel;

  const content = (
    <div className="p-4 space-y-4">
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          <Globe className="w-3.5 h-3.5" />
          Model
        </label>
        <select
          value={selectedValue}
          onChange={(e) => {
            const val = e.target.value;
            if (isCustom(val)) {
              onChange({ ...config, provider: "custom", model: "", baseUrl: "" });
            } else {
              const entry = MODELS_BY_KEY.get(val);
              if (entry) {
                onChange({ ...config, provider: entry.provider, model: entry.model, baseUrl: entry.baseUrl });
              }
            }
          }}
          className="w-full px-3 py-2 rounded-lg border border-[#c2c8c5]/40 text-sm font-medium text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc]"
        >
          <option value="" disabled>Select a model...</option>
          {Array.from(groupModels().entries()).map(([providerLabel, models]) => (
            <optgroup key={providerLabel} label={providerLabel}>
              {models.map(m => (
                <option key={modelKey(m)} value={modelKey(m)}>{m.model}</option>
              ))}
            </optgroup>
          ))}
          <optgroup label="Other">
            <option value={CUSTOM_MODEL_VALUE}>Custom</option>
          </optgroup>
        </select>
      </div>

      {usingCustom && (
        <>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Model Name
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => onChange({ ...config, model: e.target.value })}
              placeholder="e.g. gpt-4o"
              className="w-full px-3 py-2 rounded-lg border border-[#c2c8c5]/40 text-sm font-mono text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc] placeholder:text-gray-300"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Base URL
            </label>
            <input
              type="text"
              value={config.baseUrl || ""}
              onChange={(e) => onChange({ ...config, baseUrl: e.target.value })}
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-2 rounded-lg border border-[#c2c8c5]/40 text-sm font-mono text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc] placeholder:text-gray-300"
            />
          </div>
        </>
      )}

      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          <Key className="w-3.5 h-3.5" />
          API Key
        </label>
        <input
          type="password"
          value={config.apiKey}
          onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
          placeholder="sk-..."
          className="w-full px-3 py-2 rounded-lg border border-[#c2c8c5]/40 text-sm font-mono text-[#161c20] bg-white focus:outline-none focus:border-[#009bdc] placeholder:text-gray-300"
        />
      </div>

      <p className="text-[10px] text-gray-400 leading-relaxed">
        Your API key stays in your browser for this session only. It is cleared when you start a new analysis.
      </p>
    </div>
  );

  if (defaultOpen) return content;

  return content;
}
