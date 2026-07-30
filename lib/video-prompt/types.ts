// ─── Video Prompt Generator Types ───────────────────────────────────────────────

export type VideoPromptPlatform = 'tiktok' | 'instagram-reels' | 'youtube-shorts' | 'facebook' | 'linkedin';
export type VideoPromptLength = '15' | '30' | '60';
export type VideoPromptStyle = 'cinematic' | 'ugc' | 'luxury' | 'corporate' | 'viral' | 'documentary' | 'minimal';

export interface VideoPromptRequest {
  product: string;
  audience: string;
  goal: string;
  platform: VideoPromptPlatform;
  length: VideoPromptLength;
  style: VideoPromptStyle;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface VideoPromptResult {
  hook: string;
  prompt: string;
  negativePrompt: string;
  recommendedModel: string;
  recommendedModelReason: string;
}

export const PLATFORM_LABELS: Record<VideoPromptPlatform, string> = {
  tiktok: 'TikTok',
  'instagram-reels': 'Instagram Reels',
  'youtube-shorts': 'YouTube Shorts',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
};

export const LENGTH_LABELS: Record<VideoPromptLength, string> = {
  '15': '15 seconds',
  '30': '30 seconds',
  '60': '60 seconds',
};

export const STYLE_LABELS: Record<VideoPromptStyle, string> = {
  cinematic: 'Cinematic',
  ugc: 'UGC (User Generated)',
  luxury: 'Luxury',
  corporate: 'Corporate',
  viral: 'Viral',
  documentary: 'Documentary',
  minimal: 'Minimal',
};

export const VIDEO_MODELS: string[] = ['Veo', 'Runway', 'Pika', 'Kling', 'Luma'];
