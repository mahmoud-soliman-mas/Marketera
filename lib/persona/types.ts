// ─── Persona Generator Types ───────────────────────────────────────────────────

export interface PersonaRequest {
  product: string;
  industry: string;
  targetMarket: string;
  country?: string;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface PersonaResult {
  personaName: string;
  age: string;
  gender: string;
  occupation: string;
  incomeLevel: string;
  goals: string;
  painPoints: string;
  motivations: string;
  buyingBehavior: string;
  preferredPlatforms: string;
  preferredContent: string;
  objections: string;
  bestMessage: string;
  recommendedCta: string;
}

export const INCOME_LEVELS = ['Low', 'Lower-Middle', 'Middle', 'Upper-Middle', 'High', 'Affluent', 'Ultra-High-Net-Worth'] as const;
export const TARGET_MARKETS = ['B2B', 'B2C', 'Enterprise', 'SMB', 'SME', 'Startups', 'Government', 'Non-Profit'] as const;
