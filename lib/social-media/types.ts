export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'threads';

export interface SocialMediaRequest {
  product: string;
  platform: SocialPlatform;
  tone: 'professional' | 'casual' | 'playful' | 'luxury' | 'bold';
  includeEmojis: boolean;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface SocialMediaResult {
  caption: string;
  cta: string;
  hashtags: string[];
}

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'X (Twitter)',
  tiktok: 'TikTok',
  threads: 'Threads',
};

export const PLATFORM_SPECS: Record<SocialPlatform, { maxChars: number; hashtagLimit: number }> = {
  facebook: { maxChars: 63206, hashtagLimit: 3 },
  instagram: { maxChars: 2200, hashtagLimit: 30 },
  linkedin: { maxChars: 3000, hashtagLimit: 5 },
  twitter: { maxChars: 280, hashtagLimit: 3 },
  tiktok: { maxChars: 300, hashtagLimit: 10 },
  threads: { maxChars: 500, hashtagLimit: 5 },
};
