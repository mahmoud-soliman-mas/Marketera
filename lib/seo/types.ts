export interface SEORequest {
  product: string;
  industry: string;
  targetAudience: string;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface SEOResult {
  primaryKeywords: string[];
  longTailKeywords: string[];
  searchIntent: string;
  keywordDifficulty: string;
  contentOpportunities: string[];
  suggestedTitles: string[];
  metaDescription: string;
  faqIdeas: string[];
}

export const SEARCH_INTENTS = ['informational', 'navigational', 'transactional', 'commercial'] as const;
