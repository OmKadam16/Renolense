# RenoLens

AI-powered home renovation planning. Upload a photo of your current room and an inspiration design image — RenoLens runs a multi-agent AI pipeline to analyze compatibility, estimate costs, assess regret risks, suggest savings, and generate a comprehensive RenoScore report.

## Supported AI Providers

You need an API key from one of these providers:

| Provider | Provider Key | Recommended Model | Get a Key |
|---|---|---|---|
| **OpenAI** | `openai` | `gpt-4o` | https://platform.openai.com/api-keys |
| **Groq** | `groq` | `llama-3.3-70b-versatile` | https://console.groq.com/keys |
| **Together** | `together` | `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo` | https://api.together.xyz/settings/api-keys |
| **DeepSeek** | `deepseek` | `deepseek-chat` | https://platform.deepseek.com/api_keys |
| **GitHub Models** | `github` | `gpt-4o` | https://github.com/settings/tokens |
| **Custom** | `custom` | Any | Any OpenAI-compatible endpoint |

## How to Run

**Prerequisites:** Node.js (v18+)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The app starts at **http://localhost:5173**.

## How to Use

1. **Open the app** in your browser at `http://localhost:5173`.
2. **Configure your API key** — click the **API Configuration** panel:
   - **Select a model** from the dropdown (grouped by provider — OpenAI, Groq, Together, DeepSeek, GitHub Models)
   - Or choose **Custom** to enter any model name and base URL manually
   - **Paste your API key** in the password field
3. **Upload photos:**
   - Upload a photo of **your current room**
   - Upload an **inspiration design image** (Pinterest, magazine, etc.)
   - Or click **Load Sample Photos** to try with built-in demo data (no API key needed)
4. **Answer 3 questions** about your home, lifestyle, and budget.
5. **View your report** across 6 steps:
   - **Design Analysis** — room breakdown + inspiration comparison + compatibility score
   - **Cost Estimate** — itemized costs for flooring, paint, lighting, furniture, labor
   - **Reality Check** — home fit, style fit, budget fit scores, top regret risks, 10-year satisfaction curve
   - **Savings** — cheaper alternatives for expensive materials
   - **Full Report** — consolidated RenoScore, executive summary, next steps

## API Key — Session Only

Your API key is **never stored or saved**. It lives only in your browser's memory for the current session.
When you click **Analyze My Renovation**, the key is sent directly to the AI provider from your browser.
Starting a new analysis clears the key — you'll need to re-enter it.

## Production Build

```bash
npm run build
npm run preview
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build frontend to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Type-check with TypeScript |
