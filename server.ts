import OpenAI from "openai";
import express from "express";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { runMultiAgentAnalysis } from "./src/agentsOrchestrator.js";
import { RenoLensAnalysisResult, APIConfig } from "./src/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const keySessions = new Map<string, { config: APIConfig; createdAt: number }>();

  const PresetAnalysisReport: RenoLensAnalysisResult = {
    roomAnalysis: {
      roomType: "Kitchen",
      estimatedSize: "800 sqft (Kitchen & dining)",
      flooring: "Grain-heavy dated oak hardwood",
      wallColor: "Warm Beige / Dull Classic Cream",
      naturalLight: "Moderate but obstructed, lacks 30% of target Scandinavian ambient luminosity",
      artificialLight: "Dated single-ceiling incandescent, low color rendering",
      furniture: ["Distressed Oak Cabinets", "Dated Formica countertops", "Beige Tile Backsplash"],
      furnitureItems: [
        { name: "Base Cabinets", style: "Traditional Shaker", material: "Solid Oak", color: "Dark Walnut", searchQuery: "traditional shaker oak kitchen cabinets" },
        { name: "Countertops", style: "Standard Laminate", material: "Formica", color: "Beige Speckle", searchQuery: "formica laminate countertop beige" },
        { name: "Backsplash Tile", style: "Subway", material: "Ceramic Tile", color: "Warm Beige", searchQuery: "beige ceramic subway tile backsplash" }
      ],
      style: "Suburban Mid-Century Classic",
      limitations: ["Dated solid oak joinery constraints", "Narrow pathway", "Inadequate storage allocation of only 4% total sqft"]
    },
    inspirationAnalysis: {
      designStyle: "Scandinavian Minimalist Modern",
      materials: ["Light Birch veneer", "Engineered stone countertops (Calacatta pattern)", "Matte black hardware"],
      colors: ["Arctic White", "Soft Sage", "Smooth Birch Light Gold"],
      lightingStyle: "Cinematic recessed LEDs paired with matte black architectural statement pendants",
      furnitureStyle: "Semi-custom factory precision handleless flat panels",
      luxuryLevel: "Premium Contemporary luxury",
      complexity: "Moderate - requiring refinished surfaces and light layout reconfiguration",
      furnitureItems: [
        { name: "Kitchen Cabinets", style: "Flat Panel Scandinavian", material: "Birch Veneer", color: "Arctic White", searchQuery: "scandinavian flat panel birch veneer kitchen cabinets white" },
        { name: "Countertops", style: "Modern Slab", material: "Engineered Quartz", color: "Calacatta Gold Vein", searchQuery: "calacatta gold engineered quartz countertop" },
        { name: "Bar Stools", style: "Minimalist", material: "Matte Black Metal + Oak", color: "Black and Natural", searchQuery: "matte black modern bar stools oak seat" },
        { name: "Pendant Lights", style: "Architectural", material: "Matte Black Metal", color: "Black", searchQuery: "matte black architectural pendant light" },
        { name: "Faucet", style: "Modern Arc", material: "Matte Black Brass", color: "Matte Black", searchQuery: "matte black kitchen faucet modern arc" },
        { name: "Flooring", style: "Wide Plank", material: "Engineered Oak", color: "Light Natural", searchQuery: "light natural wide plank engineered oak flooring" }
      ]
    },
    compatibilityAnalysis: {
      compatibilityScore: 92,
      requiredChanges: [
        "Transitioning from grain-heavy oak cabinetry to smooth birch veneer with geometric lines",
        "Replacing formica with non-porous engineered Calacatta slate or quartz",
        "Upgrading dated hardware to minimalist matte black profile handles",
        "Integrating recessed ambient dry-wall lighting layouts"
      ],
      structuralConcerns: [
        "Space currently lacks 30% of target luminosity. Recessed task lighting channels must be run.",
        "Plumbing routing adjustments required for undermount modern kitchen trough sink alignment."
      ],
      majorDifferences: [
        "Contrast shift from 1980s heavy brown stained oak to bright airy whites & light sage accents",
        "Textural transition from rough wood grain and tile grout lines to seamless engineered quartz and smooth lacquered panels"
      ]
    },
    costEstimate: {
      flooringCost: "$8,400",
      paintCost: "$2,150",
      lightingCost: "$4,800",
      furnitureCost: "$12,500",
      laborCost: "$27,150",
      lowEstimate: "$34,000",
      realisticEstimate: "$42,500",
      highEstimate: "$58,000"
    },
    realityCheck: {
      riskLevel: "Medium Risk",
      overallScore: 65,
      homeFit: {
        score: 78,
        insight: "The open shelving and island layout fits your ranch-style home well, but the lack of upper cabinets may surprise you.",
        details: [
          "Your 1920s bungalow's open floor plan can accommodate the island layout without major structural work",
          "The existing 8ft ceilings will work with the proposed recessed lighting, though some ductwork may need rerouting",
          "Removing upper cabinets reduces storage by ~40% — your current kitchen relies heavily on those for daily use items",
          "The pantry space in your home is limited (only 4% of sqft), so losing upper cabinet storage will be felt immediately"
        ]
      },
      styleFit: {
        score: 62,
        insight: "The minimalist aesthetic contrasts with your described love for cozy, lived-in spaces.",
        details: [
          "You mentioned having young kids and hosting often — the all-white palette will show wear quickly and require frequent cleaning",
          "Matte black fixtures show fingerprints constantly, which conflicts with your 'low maintenance' preference",
          "The Scandinavian look you chose is warm-minimalist, which partially aligns with your love for cozy textures",
          "Open shelving requires curated display — not practical for a family that uses the kitchen heavily throughout the day"
        ]
      },
      budgetFit: {
        score: 55,
        insight: "The premium materials in the inspiration may exceed your stated $25-35k budget by 35-50%.",
        details: [
          "Custom birch veneer cabinets alone are estimated at $12-15k, consuming nearly half your budget",
          "Engineered quartz countertops at $8k leave only $5-10k for flooring, lighting, labor, and appliances",
          "Southern California labor rates add a 15-20% premium over national averages based on your location",
          "Consider phasing the renovation: do structural work first, then save for premium finishes later"
        ]
      },
      topRisks: [
        {
          category: "Material Longevity",
          risk: "White grout on kitchen backsplash will stain and yellow within 6-12 months in a cooking-heavy kitchen",
          severity: "High",
          likelihood: "Very Likely",
          mitigation: "Use epoxy grout or switch to a medium-tone grout color that hides discoloration",
          regretTimeline: "6-12 months"
        },
        {
          category: "Lifestyle Fit",
          risk: "Open shelving requires frequent dusting and organized display — not practical for busy households",
          severity: "High",
          likelihood: "Likely",
          mitigation: "Limit open shelving to a single accent section; use closed cabinets for daily storage",
          regretTimeline: "3-6 months"
        },
        {
          category: "Cost Sink",
          risk: "Custom birch veneer cabinets will consume 40% of budget, leaving insufficient funds for quality appliances",
          severity: "Medium",
          likelihood: "Likely",
          mitigation: "Consider semi-custom pre-finished cabinets and redirect savings to appliances",
          regretTimeline: "During installation"
        },
        {
          category: "Maintenance Burden",
          risk: "Matte black fixtures show water spots and fingerprints constantly in a kitchen environment",
          severity: "Medium",
          likelihood: "Very Likely",
          mitigation: "Choose brushed nickel or satin brass for high-touch areas, limit matte black to statement pieces",
          regretTimeline: "1-3 months"
        }
      ],
      beforeYouCommit: [
        "Order physical samples of the engineered quartz and birch veneer to check color accuracy in your lighting",
        "Measure your current storage capacity — ensure the new design doesn't reduce it",
        "Get at least 3 contractor quotes before committing to any single vendor",
        "Verify that your floor can support the weight of a kitchen island if you're adding one",
        "Check lead times on the custom cabinetry — some premium veneers have 8-12 week waits"
      ],
      satisfactionCurve: [
        { year: 1, score: 85, note: "Fresh and exciting — the transformation feels worth it" },
        { year: 3, score: 72, note: "White grout showing wear, open shelving requiring constant upkeep" },
        { year: 5, score: 58, note: "Matte black fixtures feeling dated, maintenance fatigue setting in" },
        { year: 10, score: 45, note: "Trend-driven choices feeling dated; engineered surfaces holding up well" }
      ]
    },
    savingsAnalysis: {
      alternatives: [
        {
          original: "Carrara Marble Countertops",
          alternative: "Engineered Quartz (Calacatta Pattern)",
          originalCost: "$14,500",
          alternativeCost: "$8,200",
          originalCostPerSqft: "$22/sqft",
          alternativeCostPerSqft: "$14/sqft",
          estimatedSavings: "Save $6,300",
          reason: "Engineered surfaces resist red wine and citrus stains without requiring annual sealing, offering a 98% visual match."
        },
        {
          original: "Custom Solid Oak Cabinetry",
          alternative: "High-Grade Pre-Finished Birch Veneer Modules",
          originalCost: "$28,000",
          alternativeCost: "$17,400",
          originalCostPerSqft: "$180/linear ft",
          alternativeCostPerSqft: "$110/linear ft",
          estimatedSavings: "Save $10,600",
          reason: "Semi-custom factory-built modules deliver flawless geometric alignment and double-wall drawer durability at a fraction of custom woodworking fees."
        }
      ]
    },
    finalReport: {
      designMatch: 92,
      budgetFit: 84,
      regretRisk: 62,
      renoScore: 84,
      summary: "RenoLens has successfully structured a sustainable trajectory for your kitchen remodel. By substituting high-maintenance natural stones with robust engineered equivalents, we maximize visual fidelity and functional resilience while preserving over $24,950 in budget contingency.",
      topConcerns: [
        "Specialized labor constraints constitute 64% of budget volatility in the Southern California zoning region.",
        "Space lacks 30% of target Scandinavian daylight luminosity, making supplemental electrical tracks mandatory.",
        "Utility cabinet ratio of 4% creates active clutter risks if clutter management is not expanded."
      ],
      topOpportunities: [
        "Transitioning from dated rustic frames to flat veneer modules increases perceived spaciousness.",
        "Calacatta engineered stone achieves luxury status with near-zero long-term maintenance overhead.",
        "Acoustic backing insulation can be added during partition painting for minimal cost, resolving home-office leaks."
      ],
      nextSteps: [
        "Begin drywall detailing to layout the 30% luminosity lighting recessed locations.",
        "Contact pre-finished cabinet module supplier for exact Birch cabinet pricing templates.",
        "Secure local contractor early to offset Southern California specialized labor volatility by 12%."
      ]
    }
  };

  app.post("/api/analyze", async (req, res) => {
    try {
      const { roomImage, inspirationImage, usePreset, apiConfig, homeProfile, sessionToken } = req.body;

      if (usePreset) {
        console.log("[RenoLens API] Using high-fidelity custom preset.");
        await new Promise((resolve) => setTimeout(resolve, 2500));
        return res.json({
          success: true,
          data: PresetAnalysisReport,
          presetUsed: true
        });
      }

      let effectiveConfig = apiConfig;
      if (sessionToken) {
        const session = keySessions.get(sessionToken);
        if (session) effectiveConfig = session.config;
      }

      if (!effectiveConfig || !effectiveConfig.apiKey) {
        return res.status(400).json({
          success: false,
          error: "No API key found. Please configure your API key in settings."
        });
      }

      if (!roomImage || !inspirationImage) {
        return res.status(400).json({
          success: false,
          error: "Please upload both Your Room photo and an Inspiration Design image to proceed."
        });
      }

      console.log(`[RenoLens API] Executing multi-agent pipeline using ${effectiveConfig.provider}:${effectiveConfig.model}...`);
      const result = await runMultiAgentAnalysis(roomImage, inspirationImage, effectiveConfig, homeProfile);

      return res.json({
        success: true,
        data: result,
        presetUsed: false
      });
    } catch (error: any) {
      console.error("[RenoLens API Error]", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "An error occurred during multi-agent orchestration execution."
      });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "online" });
  });

  app.post("/api/test-key", async (req, res) => {
    const { apiConfig, sessionToken } = req.body;
    let effectiveConfig = apiConfig;
    if (sessionToken) {
      const session = keySessions.get(sessionToken);
      if (session) effectiveConfig = session.config;
    }
    if (!effectiveConfig?.apiKey) {
      return res.json({ success: false, message: "No API key provided." });
    }

    try {
      const client = new OpenAI({
        apiKey: effectiveConfig.apiKey,
        baseURL: effectiveConfig.baseUrl,
      });

      const start = Date.now();
      await client.chat.completions.create({
        model: effectiveConfig.model || "gpt-4o",
        messages: [{ role: "user", content: "Respond with just: ok" }],
        max_tokens: 10,
      });
      const latency = Date.now() - start;

      res.json({ success: true, message: `Connected successfully (${latency}ms)` });
    } catch (err: any) {
      res.json({ success: false, message: err.message || "Connection failed" });
    }
  });

  app.post("/api/config/set-key", (req, res) => {
    const { apiConfig } = req.body;
    if (!apiConfig?.apiKey) {
      return res.json({ success: false, message: "No API key provided." });
    }
    const sessionToken = crypto.randomUUID();
    keySessions.set(sessionToken, { config: apiConfig, createdAt: Date.now() });
    res.json({ success: true, sessionToken });
  });

  app.post("/api/config/clear-key", (req, res) => {
    const { sessionToken } = req.body;
    keySessions.delete(sessionToken);
    res.json({ success: true });
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("[RenoLens Server] Integrating Vite Dev Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("[RenoLens Server] Production mode. Serving built static assets from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RenoLens Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
