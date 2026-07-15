export type ProviderType = 'openai' | 'groq' | 'together' | 'deepseek' | 'github' | 'custom';

export interface APIConfig {
  provider: ProviderType;
  apiKey: string;
  model: string;
  baseUrl?: string;
  sessionToken?: string;
}

export interface HomeProfile {
  homeDescription: string;
  lifestyleStyle: string;
  budgetRange: string;
}

export interface FurnitureItem {
  name: string;
  style: string;
  material: string;
  color: string;
  searchQuery: string;
}

export interface RoomAnalysis {
  roomType: string;
  estimatedSize: string;
  flooring: string;
  wallColor: string;
  naturalLight: string;
  artificialLight: string;
  furniture: string[];
  furnitureItems: FurnitureItem[];
  style: string;
  limitations: string[];
}

export interface InspirationAnalysis {
  designStyle: string;
  materials: string[];
  colors: string[];
  lightingStyle: string;
  furnitureStyle: string;
  luxuryLevel: string;
  complexity: string;
  furnitureItems: FurnitureItem[];
}

export interface CompatibilityAnalysis {
  compatibilityScore: number;
  requiredChanges: string[];
  structuralConcerns: string[];
  majorDifferences: string[];
}

export interface CostEstimation {
  flooringCost: string;
  paintCost: string;
  lightingCost: string;
  furnitureCost: string;
  laborCost: string;
  lowEstimate: string;
  realisticEstimate: string;
  highEstimate: string;
}

export interface RiskItem {
  category: string;
  risk: string;
  severity: string;
  likelihood: string;
  mitigation: string;
  regretTimeline: string;
}

export interface SatisfactionPoint {
  year: number;
  score: number;
  note: string;
}

export interface FitAssessment {
  score: number;
  insight: string;
  details: string[];
}

export interface RealityCheck {
  riskLevel: string;
  overallScore: number;
  homeFit: FitAssessment;
  styleFit: FitAssessment;
  budgetFit: FitAssessment;
  topRisks: RiskItem[];
  beforeYouCommit: string[];
  satisfactionCurve: SatisfactionPoint[];
}

export interface AlternativeItem {
  original: string;
  alternative: string;
  originalCost: string;
  alternativeCost: string;
  originalCostPerSqft: string;
  alternativeCostPerSqft: string;
  estimatedSavings: string;
  reason: string;
}

export interface SavingsAnalysis {
  alternatives: AlternativeItem[];
}

export interface FinalReport {
  designMatch: number;
  budgetFit: number;
  regretRisk: number;
  renoScore: number;
  summary: string;
  topConcerns: string[];
  topOpportunities: string[];
  nextSteps: string[];
}

export interface RenoLensAnalysisResult {
  roomAnalysis: RoomAnalysis;
  inspirationAnalysis: InspirationAnalysis;
  compatibilityAnalysis: CompatibilityAnalysis;
  costEstimate: CostEstimation;
  realityCheck: RealityCheck;
  savingsAnalysis: SavingsAnalysis;
  finalReport: FinalReport;
  warnings?: string[];
}
