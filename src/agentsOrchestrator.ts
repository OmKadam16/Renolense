import OpenAI from "openai";
import {
  RoomAnalysis,
  InspirationAnalysis,
  CompatibilityAnalysis,
  CostEstimation,
  RealityCheck,
  SavingsAnalysis,
  FinalReport,
  RenoLensAnalysisResult,
  APIConfig,
  HomeProfile
} from "./types.js";

const PROVIDER_PRESETS: Record<string, { baseURL: string; supportsStructured: boolean }> = {
  openai:    { baseURL: "https://api.openai.com/v1",             supportsStructured: true },
  groq:      { baseURL: "https://api.groq.com/openai/v1",        supportsStructured: true },
  together:  { baseURL: "https://api.together.xyz/v1",           supportsStructured: true },
  deepseek:  { baseURL: "https://api.deepseek.com",              supportsStructured: false },
  github:    { baseURL: "https://models.inference.ai.azure.com",  supportsStructured: true },
};

function createClient(config: APIConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl || PROVIDER_PRESETS[config.provider]?.baseURL,
  });
}

function extractMimeType(dataUri: string): string {
  const match = dataUri.match(/^data:(image\/[a-zA-Z]+);base64,/);
  return match ? match[1] : "image/jpeg";
}

// ---------------------------------------------------------------------------
// JSON Schemas
// ---------------------------------------------------------------------------

const FurnitureItemSchema = {
  type: "object" as const,
  properties: {
    name: { type: "string", description: "Name of the furniture piece (e.g. Sectional Sofa, Dining Table)" },
    style: { type: "string", description: "Design style (e.g. Mid-Century Modern, Scandinavian)" },
    material: { type: "string", description: "Primary material (e.g. Light Birch Veneer, Velvet)" },
    color: { type: "string", description: "Primary color (e.g. Sage Green, Arctic White)" },
    searchQuery: { type: "string", description: "Search query to find this item online" }
  },
  required: ["name", "style", "material", "color", "searchQuery"],
  additionalProperties: false
};

const RoomAnalysisSchema = {
  type: "object" as const,
  properties: {
    roomType: { type: "string", description: "Type of the room (e.g. Kitchen, Bathroom, Bedroom)" },
    estimatedSize: { type: "string", description: "Estimated square feet or size query (e.g., 200 sqft)" },
    flooring: { type: "string", description: "Flooring flooring material (e.g. Oak Hardwood)" },
    wallColor: { type: "string", description: "Primary paint colors on walls" },
    naturalLight: { type: "string", description: "Natural lighting quality (e.g. Dim, Bright)" },
    artificialLight: { type: "string", description: "Artificial lighting quality" },
    furniture: { type: "array", items: { type: "string" }, description: "List of furniture or fixture categories found in room" },
    furnitureItems: { type: "array", items: FurnitureItemSchema, description: "Detailed breakdown of individual furniture pieces in the room" },
    style: { type: "string", description: "Architectural style of the existing room" },
    limitations: { type: "array", items: { type: "string" }, description: "List of architectural design or physical limitations visible" }
  },
  required: ["roomType", "estimatedSize", "flooring", "wallColor", "naturalLight", "artificialLight", "furniture", "furnitureItems", "style", "limitations"],
  additionalProperties: false
};

const InspirationAnalysisSchema = {
  type: "object" as const,
  properties: {
    designStyle: { type: "string", description: "Design style (e.g., Scandinavian, Minimalist)" },
    materials: { type: "array", items: { type: "string" }, description: "Premium materials highlighted in the design (e.g., Carrara marble)" },
    colors: { type: "array", items: { type: "string" }, description: "Primary colors used in palette (e.g. Arctic White, Soft Sage)" },
    lightingStyle: { type: "string", description: "Sophisticated lighting style" },
    furnitureStyle: { type: "string", description: "Furniture or millwork style" },
    luxuryLevel: { type: "string", description: "Luxury quotient level" },
    complexity: { type: "string", description: "Overall renovation complexity level" },
    furnitureItems: { type: "array", items: FurnitureItemSchema, description: "Detailed breakdown of each furniture piece, decor item, rug, lighting fixture, and material visible in the inspiration image" }
  },
  required: ["designStyle", "materials", "colors", "lightingStyle", "furnitureStyle", "luxuryLevel", "complexity", "furnitureItems"],
  additionalProperties: false
};

const CompatibilitySchema = {
  type: "object" as const,
  properties: {
    compatibilityScore: { type: "integer", description: "Core compatibility score between 0 and 100" },
    requiredChanges: { type: "array", items: { type: "string" }, description: "List of key architectural or layout changes required" },
    structuralConcerns: { type: "array", items: { type: "string" }, description: "List of potential structural, wall, plumbing, or electrical concerns" },
    majorDifferences: { type: "array", items: { type: "string" }, description: "List of core style or material layout differences" }
  },
  required: ["compatibilityScore", "requiredChanges", "structuralConcerns", "majorDifferences"],
  additionalProperties: false
};

const CostEstimationSchema = {
  type: "object" as const,
  properties: {
    flooringCost: { type: "string", description: "Estimated flooring remodeling cost, e.g. '$8,400'" },
    paintCost: { type: "string", description: "Estimated paint/wall remodel cost, e.g. '$2,150'" },
    lightingCost: { type: "string", description: "Estimated lighting remodel cost, e.g. '$4,800'" },
    furnitureCost: { type: "string", description: "Estimated furniture/millwork cost, e.g. '$12,500'" },
    laborCost: { type: "string", description: "Estimated specialist labor cost, e.g. '$27,150'" },
    lowEstimate: { type: "string", description: "Total project low-end range cost budget, e.g. '$34,000'" },
    realisticEstimate: { type: "string", description: "Total project likely median cost budget, e.g. '$42,500'" },
    highEstimate: { type: "string", description: "Total project high-end contingency cost budget, e.g. '$58,000'" }
  },
  required: ["flooringCost", "paintCost", "lightingCost", "furnitureCost", "laborCost", "lowEstimate", "realisticEstimate", "highEstimate"],
  additionalProperties: false
};

const RiskItemSchema = {
  type: "object" as const,
  properties: {
    category: { type: "string", description: "Category of risk (e.g. Material Longevity, Lifestyle Fit, Trend Fade, Cost Sink, Maintenance Burden)" },
    risk: { type: "string", description: "Description of the specific risk" },
    severity: { type: "string", description: "Severity level: Low, Medium, High, Critical" },
    likelihood: { type: "string", description: "Likelihood: Unlikely, Possible, Likely, Very Likely" },
    mitigation: { type: "string", description: "Specific actionable mitigation advice" },
    regretTimeline: { type: "string", description: "When this regret typically surfaces, e.g. '6-12 months'" }
  },
  required: ["category", "risk", "severity", "likelihood", "mitigation", "regretTimeline"],
  additionalProperties: false
};

const SatisfactionPointSchema = {
  type: "object" as const,
  properties: {
    year: { type: "integer", description: "Year number (1, 3, 5, 10)" },
    score: { type: "integer", description: "Satisfaction score 0-100" },
    note: { type: "string", description: "Brief explanation for the score at this year" }
  },
  required: ["year", "score", "note"],
  additionalProperties: false
};

const FitAssessmentSchema = {
  type: "object" as const,
  properties: {
    score: { type: "integer", description: "Fit score 0-100" },
    insight: { type: "string", description: "Overall one-sentence summary about this fit dimension" },
    details: { type: "array", items: { type: "string" }, description: "2-4 specific factors or reasons that influenced this score" }
  },
  required: ["score", "insight", "details"],
  additionalProperties: false
};

const RealityCheckSchema = {
  type: "object" as const,
  properties: {
    riskLevel: { type: "string", description: "Overall risk level: Low Risk, Medium Risk, High Risk, Critical" },
    overallScore: { type: "integer", description: "Overall Reality Check score 0-100 (100 = no regrets)" },
    homeFit: FitAssessmentSchema,
    styleFit: FitAssessmentSchema,
    budgetFit: FitAssessmentSchema,
    topRisks: { type: "array", items: RiskItemSchema, description: "Top 3-6 specific risks identified" },
    beforeYouCommit: { type: "array", items: { type: "string" }, description: "3-5 actionable checks the user should do before committing" },
    satisfactionCurve: { type: "array", items: SatisfactionPointSchema, description: "Projected satisfaction at years 1, 3, 5, 10" }
  },
  required: ["riskLevel", "overallScore", "homeFit", "styleFit", "budgetFit", "topRisks", "beforeYouCommit", "satisfactionCurve"],
  additionalProperties: false
};

const SavingsSchema = {
  type: "object" as const,
  properties: {
    alternatives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          original: { type: "string", description: "Expensive original specifications (e.g. Carrara Marble Slab)" },
          alternative: { type: "string", description: "High-quality low-cost alt (e.g. Engineered Quartz)" },
          originalCost: { type: "string", description: "Original cost formatted as string, e.g. '$14,500'" },
          alternativeCost: { type: "string", description: "Alternative cost formatted as string, e.g. '$8,200'" },
          originalCostPerSqft: { type: "string", description: "Original cost per square foot, e.g. '$22/sqft'" },
          alternativeCostPerSqft: { type: "string", description: "Alternative cost per square foot, e.g. '$14/sqft'" },
          estimatedSavings: { type: "string", description: "Dollar value saved as string, e.g. 'Save $6,300'" },
          reason: { type: "string", description: "Practical compromise description or rationale" }
        },
        required: ["original", "alternative", "originalCost", "alternativeCost", "originalCostPerSqft", "alternativeCostPerSqft", "estimatedSavings", "reason"],
        additionalProperties: false
      }
    }
  },
  required: ["alternatives"],
  additionalProperties: false
};

const FinalReportSchema = {
  type: "object" as const,
  properties: {
    designMatch: { type: "integer", description: "Design style match score (0-100)" },
    budgetFit: { type: "integer", description: "Budget efficiency factor score (0-100)" },
    regretRisk: { type: "integer", description: "Homeowner long-term satisfaction score (0-100)" },
    renoScore: { type: "integer", description: "Overall combined RenoScore metric (0-100)" },
    summary: { type: "string", description: "High-level Executive Summary advisory text" },
    topConcerns: { type: "array", items: { type: "string" }, description: "The top 3 structural or budget risk concerns" },
    topOpportunities: { type: "array", items: { type: "string" }, description: "The top 3 core remodeling opportunities" },
    nextSteps: { type: "array", items: { type: "string" }, description: "Top 3 highly actionable next steps" }
  },
  required: ["designMatch", "budgetFit", "regretRisk", "renoScore", "summary", "topConcerns", "topOpportunities", "nextSteps"],
  additionalProperties: false
};

// ---------------------------------------------------------------------------
// Provider-agnostic helpers
// ---------------------------------------------------------------------------

async function callModel<T>(
  client: OpenAI,
  modelName: string,
  supportsStructured: boolean,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  schema: object,
  schemaName: string,
  temperature = 0.2
): Promise<T> {
  if (supportsStructured) {
    const response = await client.chat.completions.create({
      model: modelName,
      messages,
      response_format: {
        type: "json_schema",
        json_schema: { name: schemaName, strict: true, schema: schema as any }
      },
      temperature
    });
    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error(`Empty response from model for ${schemaName}`);
    return JSON.parse(text) as T;
  }

  const schemaDescription = JSON.stringify(schema, null, 2);
  const fallbackMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    ...messages,
    {
      role: "user",
      content: `You MUST respond with ONLY valid JSON matching this schema exactly:\n${schemaDescription}\n\nReturn ONLY the JSON object, no explanation, no markdown.`
    }
  ];
  const response = await client.chat.completions.create({
    model: modelName,
    messages: fallbackMessages,
    temperature
  });
  const text = response.choices[0]?.message?.content || "{}";
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned) as T;
}

async function callVisionModel<T>(
  client: OpenAI,
  modelName: string,
  supportsStructured: boolean,
  imageDataUri: string,
  prompt: string,
  schema: object,
  schemaName: string
): Promise<T> {
  const mimeType = extractMimeType(imageDataUri);
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: [
        { type: "image_url", image_url: { url: imageDataUri, detail: "high" } },
        { type: "text", text: prompt }
      ]
    }
  ];
  return callModel<T>(client, modelName, supportsStructured, messages, schema, schemaName, 0.2);
}

async function callTextModel<T>(
  client: OpenAI,
  modelName: string,
  supportsStructured: boolean,
  prompt: string,
  schema: object,
  schemaName: string,
  temperature = 0.1
): Promise<T> {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "user", content: prompt }
  ];
  return callModel<T>(client, modelName, supportsStructured, messages, schema, schemaName, temperature);
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export async function runMultiAgentAnalysis(
  roomImageBase64: string,
  inspirationImageBase64: string,
  apiConfig: APIConfig,
  homeProfile?: HomeProfile
): Promise<RenoLensAnalysisResult> {
  const client = createClient(apiConfig);
  const modelName = apiConfig.model;
  const supportsStructured = PROVIDER_PRESETS[apiConfig.provider]?.supportsStructured ?? true;

  const roomDataUri = roomImageBase64.startsWith("data:") ? roomImageBase64 : `data:image/jpeg;base64,${roomImageBase64}`;
  const inspDataUri = inspirationImageBase64.startsWith("data:") ? inspirationImageBase64 : `data:image/jpeg;base64,${inspirationImageBase64}`;

  const profileContext = homeProfile
    ? `\n\nHOMEOWNER PROFILE:\n- Home: ${homeProfile.homeDescription}\n- Lifestyle & Style: ${homeProfile.lifestyleStyle}\n- Budget: ${homeProfile.budgetRange}`
    : "";

  console.log("[RenoLens Orchestration] Starting Agent 1: Room Analysis Agent...");

  const roomAnalysis = await callVisionModel<RoomAnalysis>(
    client, modelName, supportsStructured, roomDataUri,
    "Act as an expert interior designer. Analyze the uploaded existing room layout and characterize space components as requested in the JSON schema. Be highly descriptive." + profileContext,
    RoomAnalysisSchema, "room_analysis"
  );
  console.log("[RenoLens Orchestration] Agent 1 complete:", JSON.stringify(roomAnalysis, null, 2));

  console.log("[RenoLens Orchestration] Starting Agent 2: Inspiration Analysis Agent...");

  const inspirationAnalysis = await callVisionModel<InspirationAnalysis>(
    client, modelName, supportsStructured, inspDataUri,
    "Act as a luxury interior design consultant. Analyze the uploaded inspiration design image and categorize its materials, textures, custom styling, light approach, luxury status, and complexity." + profileContext,
    InspirationAnalysisSchema, "inspiration_analysis"
  );
  console.log("[RenoLens Orchestration] Agent 2 complete:", JSON.stringify(inspirationAnalysis, null, 2));

  console.log("[RenoLens Orchestration] Starting Agent 3: Compatibility Agent...");

  const compatibilityAnalysis = await callTextModel<CompatibilityAnalysis>(
    client, modelName, supportsStructured,
    `Act as an expert renovation planner. Compare the current room details and the inspiration dream design goals.
EXISTING ROOM STATS:
${JSON.stringify(roomAnalysis)}

INSPIRATION DESIGN SPECS:
${JSON.stringify(inspirationAnalysis)}

Tasks:
- Calculate a design compatibility score (0 to 100).
- Identify the major layout or material differences.
- Specify actual physical required renovations/changes.
- Warn of structural, plumbing, wall, or electrical code concerns.` + profileContext,
    CompatibilitySchema, "compatibility_analysis", 0.1
  );
  console.log("[RenoLens Orchestration] Agent 3 complete:", JSON.stringify(compatibilityAnalysis, null, 2));

  console.log("[RenoLens Orchestration] Starting Agent 4: Cost Estimation Agent...");

  const costEstimate = await callTextModel<CostEstimation>(
    client, modelName, supportsStructured,
    `Act as an experienced mechanical or general contractor estimator. Estimate itemized remodeling costs for transitioning from the current setup to target.
Assume Southern California standard high premium rates (e.g. expensive union labor, local contractor premiums in LA/San Diego/Orange County).
Include a 15% contingency margin.

EXISTING ROOM ANALYSIS:
${JSON.stringify(roomAnalysis)}

INSPIRATION GOAL SPECIFICATIONS:
${JSON.stringify(inspirationAnalysis)}

STRUCTURAL COMPATIBILITY STEPS REQUIRED:
${JSON.stringify(compatibilityAnalysis)}

Tasks:
- Flooring remodeling budget (Hardwood/Tile installation).
- Premium Matte paint budget or wallpaper.
- Lighting remodeling budget (Recessed LEDs + STATEMENT architectural pendants).
- Custom furniture/Cabinetry cost.
- Labor margin.
- Calculate Low End, Realistic Median, and Contingency-included High End overall totals.
Return each value as a formatted text string starting with a dollar ($) symbol, e.g. "$42,500".` + profileContext,
    CostEstimationSchema, "cost_estimation", 0.1
  );
  console.log("[RenoLens Orchestration] Agent 4 complete:", JSON.stringify(costEstimate, null, 2));

  console.log("[RenoLens Orchestration] Starting Agent 5: The Reality Check...");

  let realityCheck: RealityCheck;
  let agent5Failed = false;
  try {
    realityCheck = await callTextModel<RealityCheck>(
      client, modelName, supportsStructured,
      `Act as a veteran renovation truth-teller with 20 years of experience. Your job is to tell the homeowner what could go wrong before they commit.

Review the homeowner's profile, their current room, their dream design, how compatible they are, and their budget. Then evaluate:

EXISTING ROOM:
${JSON.stringify(roomAnalysis)}

INSPIRATION DESIGN:
${JSON.stringify(inspirationAnalysis)}

COMPATIBILITY:
${JSON.stringify(compatibilityAnalysis)}

COST ESTIMATE:
${JSON.stringify(costEstimate)}

HOMEOWNER PROFILE:
${homeProfile ? JSON.stringify(homeProfile) : "Not provided"}

Your evaluation must cover three dimensions:
1. HOME FIT — Does this design actually suit the homeowner's physical space, architecture, and layout? Will it work structurally?
2. STYLE FIT — Does this design match how the homeowner actually lives? Is it practical for their lifestyle? Does it match their taste?
3. BUDGET FIT — Is the design realistic for their budget? Will they run out of money halfway?

For each dimension, provide:
- score (0-100)
- insight: a one-sentence summary
- details: an array of 2-4 specific factors that influenced your score. Be concrete — mention actual materials, layout elements, lifestyle details, and budget constraints from the data above.

Also identify the top 3-6 specific regret risks. For each risk include:
- category (Material Longevity, Lifestyle Fit, Trend Fade, Cost Sink, Maintenance Burden)
- what the risk is
- severity (Low/Medium/High/Critical)
- likelihood
- specific actionable mitigation advice
- when this regret typically surfaces

Provide 3-5 "before you commit" checks — practical things the homeowner should verify before starting.

Finally, project a satisfaction curve at years 1, 3, 5, and 10 — how will their satisfaction change over time as trends change and wear sets in?` + profileContext,
      RealityCheckSchema, "reality_check", 0.3
    );
    console.log("[RenoLens Orchestration] Agent 5 complete:", JSON.stringify(realityCheck, null, 2));
  } catch (e) {
    console.error("[RenoLens Orchestration] Agent 5 failed:", e);
    agent5Failed = true;
    realityCheck = {
      riskLevel: "Unknown",
      overallScore: 50,
      homeFit: { score: 50, insight: "AI analysis failed for this section. Try a different provider or model.", details: [] },
      styleFit: { score: 50, insight: "AI analysis failed for this section. Try a different provider or model.", details: [] },
      budgetFit: { score: 50, insight: "AI analysis failed for this section. Try a different provider or model.", details: [] },
      topRisks: [],
      beforeYouCommit: ["The AI was unable to complete the reality check analysis for your project. Consider retrying with a different AI provider or model."],
      satisfactionCurve: []
    };
  }

  const warnings: string[] = [];
  if (agent5Failed) {
    warnings.push("Reality Check analysis failed — the AI agent returned an error. The data below is a simulation.");
  }

  console.log("[RenoLens Orchestration] Starting Agent 6: Savings Agent...");

  const savingsAnalysis = await callTextModel<SavingsAnalysis>(
    client, modelName, supportsStructured,
    `Act as a budget-oriented architectural renovation consultant. Your goal is to find cheaper alternatives to the premium materials in the INSPIRATION design.

The user's current room has:
- Flooring: ${roomAnalysis.flooring}
- Wall color: ${roomAnalysis.wallColor}
- Furniture: ${roomAnalysis.furniture?.join(", ")}
- Detailed items: ${JSON.stringify(roomAnalysis.furnitureItems)}

The INSPIRATION design uses:
- Materials: ${inspirationAnalysis.materials?.join(", ")}
- Furniture items: ${JSON.stringify(inspirationAnalysis.furnitureItems)}

Estimated renovation costs so far: ${JSON.stringify(costEstimate)}

For each premium material or item in the inspiration design, suggest a high-quality but cheaper alternative. For each alternative:
- Specify what the inspiration uses (original) and your recommended substitute
- Provide the total cost for original and alternative
- Provide the cost per square foot (or per unit if not a surface material) for both
- Calculate the savings
- Explain why the alternative is a smart compromise

Provide 2-3 alternatives based on the ACTUAL materials in the inspiration, not generic examples.` + profileContext,
    SavingsSchema, "savings_analysis", 0.2
  );
  console.log("[RenoLens Orchestration] Agent 6 complete:", JSON.stringify(savingsAnalysis, null, 2));

  console.log("[RenoLens Orchestration] Starting Agent 7: Final RenoScore Agent...");

  const finalReport = await callTextModel<FinalReport>(
    client, modelName, supportsStructured,
    `Act as the Executive Renovation Advisor to compile the finalized comprehensive Homeowner Report.
Consolidate all preceding modular intelligence details.

CONSOLIDATED RAW AGENTS DATA:
1. Baseline Room: ${JSON.stringify(roomAnalysis)}
2. Inspiration: ${JSON.stringify(inspirationAnalysis)}
3. Compatibility Matrix: ${JSON.stringify(compatibilityAnalysis)}
4. Estimated Costings: ${JSON.stringify(costEstimate)}
5. Reality Check: ${JSON.stringify(realityCheck)}
6. Strategic Savings Options: ${JSON.stringify(savingsAnalysis)}

Tasks:
Evaluate and output 4 key critical scores (0 to 100):
- designMatch: Style match quotient between baseline vs inspiration.
- budgetFit: Efficiency budget metric (optimized value-to-cost).
- regretRisk: Level of long-term functional safety (100 is high safety / zero regret risk). Use the Reality Check data to inform this score.
- renoScore: Holistic score combining design, budget, and regret.

Provide a highly professional 2-3 sentence Executive Summary.
List the top 3 overall professional concerns, top 3 remodeling opportunities, and top 3 highly actionable next steps.` + profileContext,
    FinalReportSchema, "final_report", 0.1
  );
  console.log("[RenoLens Orchestration] Agent 7 complete:", JSON.stringify(finalReport, null, 2));

  return {
    roomAnalysis,
    inspirationAnalysis,
    compatibilityAnalysis,
    costEstimate,
    realityCheck,
    savingsAnalysis,
    finalReport,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}
