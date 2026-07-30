// ─── Marketing Plan Generator Service ─────────────────────────────────────────
// Calls the generate-hooks edge function with type: 'marketing-plan'

import { callApi } from '@/lib/api';
import type { MarketingPlanRequest, MarketingPlanResult } from './types';

export interface MarketingPlanService {
  generate(req: MarketingPlanRequest, onProgress?: (stage: string) => void): Promise<MarketingPlanResult>;
}

interface MarketingPlanResponse extends MarketingPlanResult {}

export const marketingPlanService: MarketingPlanService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<MarketingPlanResponse>({
      type: 'marketing-plan',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate marketing plan');
    }

    onProgress?.('done');
    return {
      executiveSummary: result.data.executiveSummary,
      strengths: result.data.strengths,
      weaknesses: result.data.weaknesses,
      opportunities: result.data.opportunities,
      threats: result.data.threats,
      idealCustomer: result.data.idealCustomer,
      marketingChannels: result.data.marketingChannels,
      contentStrategy: result.data.contentStrategy,
      advertisingStrategy: result.data.advertisingStrategy,
      seoStrategy: result.data.seoStrategy,
      emailMarketing: result.data.emailMarketing,
      socialMediaPlan: result.data.socialMediaPlan,
      kpis: result.data.kpis,
      actionPlan30Days: result.data.actionPlan30Days,
      growthPlan90Days: result.data.growthPlan90Days,
      budgetDistribution: result.data.budgetDistribution,
      recommendedTools: result.data.recommendedTools,
    };
  },
};
