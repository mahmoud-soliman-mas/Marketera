// ─── Marketing Plan Generator Types ────────────────────────────────────────────

export interface MarketingPlanRequest {
  business: string;
  product: string;
  targetAudience: string;
  budget: string;
  goal: string;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface MarketingPlanResult {
  executiveSummary: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  idealCustomer: string;
  marketingChannels: string;
  contentStrategy: string;
  advertisingStrategy: string;
  seoStrategy: string;
  emailMarketing: string;
  socialMediaPlan: string;
  kpis: string;
  actionPlan30Days: string;
  growthPlan90Days: string;
  budgetDistribution: string;
  recommendedTools: string;
}
