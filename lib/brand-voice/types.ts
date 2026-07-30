export interface BrandVoiceRequest {
  brandName: string;
  industry: string;
  targetAudience: string;
  brandValues: string;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface BrandVoiceResult {
  personality: string;
  tone: string;
  story: string;
  messagingGuidelines: string[];
  vocabulary: string[];
  wordsToAvoid: string[];
}
