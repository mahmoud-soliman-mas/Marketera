// ─── AI Analysis Types ──────────────────────────────────────────────────────
// Types for the new AI analysis tools (viral score, emotional analyzer, etc.)

export interface ViralScoreResult {
  score: number;
  breakdown: {
    curiosity: number;
    emotion: number;
    clarity: number;
    uniqueness: number;
    actionability: number;
  };
  reasoning: string;
  tips: string[];
}

export interface EngagementPrediction {
  ctr: number;
  engagement: number;
  scrollStopRate: number;
  predictedReach: string;
  analysis: string;
}

export interface EmotionalAnalysis {
  emotions: {
    curiosity: number;
    trust: number;
    fear: number;
    excitement: number;
    urgency: number;
    fomo: number;
  };
  dominantEmotion: string;
  analysis: string;
}

export interface ReadabilityScore {
  score: number;
  gradeLevel: string;
  readingTime: string;
  analysis: string;
  suggestions: string[];
}

export interface PersuasionScore {
  score: number;
  breakdown: {
    ethos: number;
    pathos: number;
    logos: number;
    cta: number;
  };
  framework: string;
  analysis: string;
  suggestions: string[];
}

export interface RewriteStyle {
  id: string;
  label: string;
  labelAr: string;
  hint: string;
}

export interface RewriteResult {
  rewritten: string;
  changes: string[];
}

export interface CtaItem {
  text: string;
  style: string;
  reason: string;
}

export interface CtaGeneratorResult {
  ctas: CtaItem[];
}

export interface ImprovedHeadline {
  text: string;
  angle: string;
  improvement: string;
}

export interface HeadlineImproverResult {
  improvedHeadlines: ImprovedHeadline[];
}

export interface HookOptimizerResult {
  originalHook: string;
  optimizedHooks: string[];
  improvements: string[];
}

export interface AiInsights {
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  alternatives: string[];
  psychologicalTriggers: string[];
  marketingFramework: string;
}

export const REWRITE_STYLES: RewriteStyle[] = [
  { id: 'professional', label: 'Professional', labelAr: 'احترافي', hint: 'Polished, corporate' },
  { id: 'human', label: 'Human', labelAr: 'إنساني', hint: 'Conversational, natural' },
  { id: 'sales', label: 'Sales', labelAr: 'مبيعات', hint: 'Persuasive, closing' },
  { id: 'friendly', label: 'Friendly', labelAr: 'ودّي', hint: 'Warm, approachable' },
  { id: 'luxury', label: 'Luxury', labelAr: 'فاخر', hint: 'Premium, refined' },
  { id: 'minimal', label: 'Minimal', labelAr: 'مختصر', hint: 'Concise, clean' },
  { id: 'viral', label: 'Viral', labelAr: 'فيروسي', hint: 'Attention-grabbing' },
  { id: 'storytelling', label: 'Storytelling', labelAr: 'سردي', hint: 'Narrative, emotional' },
];

export type AnalysisType =
  | 'viral-score'
  | 'engagement-prediction'
  | 'emotional-analyzer'
  | 'readability-score'
  | 'persuasion-score'
  | 'ai-rewrite'
  | 'cta-generator'
  | 'headline-improver'
  | 'hook-optimizer'
  | 'ai-insights';
