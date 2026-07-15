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

The app starts at **http://localhost:3000**.

## How to Use

1. **Open the app** in your browser at `http://localhost:3000`.
2. **Configure your API key** — click the **API Settings** panel on the upload page:
   - Select your AI provider
   - Enter your model name (or use the default)
   - Paste your API key
   - Click **Save Key Securely** (key is stored server-side in memory, never in localStorage)
   - Click **Test Connection** to verify everything works
3. **Upload photos:**
   - Upload a photo of **your current room**
   - Upload an **inspiration design image** (Pinterest, magazine, etc.)
   - Or click **Load Sample Photos** to try with built-in demo data
4. **Answer 3 questions** about your home, lifestyle, and budget.
5. **View your report** across 6 steps:
   - **Design Analysis** — room breakdown + inspiration comparison + compatibility score
   - **Cost Estimate** — itemized costs for flooring, paint, lighting, furniture, labor
   - **Reality Check** — home fit, style fit, budget fit scores, top regret risks, 10-year satisfaction curve
   - **Savings** — cheaper alternatives for expensive materials
   - **Full Report** — consolidated RenoScore, executive summary, next steps

## Production Build

```bash
npm run build
npm start
```

Serves the built app from `dist/` on port 3000.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Vite hot reload |
| `npm run build` | Build frontend + bundle server |
| `npm start` | Run production server |
| `npm run lint` | Type-check with TypeScript |
