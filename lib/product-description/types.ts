export interface ProductDescriptionRequest {
  productName: string;
  category: string;
  features: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'luxury' | 'playful';
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface ProductDescriptionResult {
  headline: string;
  shortDescription: string;
  longDescription: string;
  bulletPoints: string[];
  cta: string;
}
