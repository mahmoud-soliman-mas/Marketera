// ─── Ad Copy Generator Types ───────────────────────────────────────────────────

export type AdPlatform = 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'google';
export type AdGoal = 'awareness' | 'consideration' | 'conversion' | 'engagement' | 'traffic';

export interface AdCopyRequest {
  product: string;
  audience: string;
  platform: AdPlatform;
  goal: AdGoal;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface AdCopyResult {
  hook: string;
  primaryText: string;
  headline: string;
  cta: string;
  description: string;
}

export const PLATFORM_LABELS: Record<AdPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  google: 'Google Ads',
};

export const GOAL_LABELS: Record<AdGoal, string> = {
  awareness: 'Brand Awareness',
  consideration: 'Consideration',
  conversion: 'Conversion',
  engagement: 'Engagement',
  traffic: 'Traffic',
};

export const PLATFORM_SPECS: Record<AdPlatform, { maxPrimary: number; maxHeadline: number; ctaOptions: string[] }> = {
  facebook: {
    maxPrimary: 125,
    maxHeadline: 40,
    ctaOptions: ['Learn More', 'Shop Now', 'Sign Up', 'Get Offer', 'Contact Us'],
  },
  instagram: {
    maxPrimary: 125,
    maxHeadline: 40,
    ctaOptions: ['Learn More', 'Shop Now', 'Sign Up', 'Get Offer', 'Contact Us'],
  },
  tiktok: {
    maxPrimary: 100,
    maxHeadline: 30,
    ctaOptions: ['Shop Now', 'Learn More', 'Sign Up', 'Download', 'Get Offer'],
  },
  linkedin: {
    maxPrimary: 150,
    maxHeadline: 50,
    ctaOptions: ['Learn More', 'Sign Up', 'Contact Us', 'Apply Now', 'Get Started'],
  },
  google: {
    maxPrimary: 90,
    maxHeadline: 30,
    ctaOptions: ['Learn More', 'Shop Now', 'Sign Up', 'Get Quote', 'Contact Us'],
  },
};
