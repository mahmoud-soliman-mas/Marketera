export interface LandingPageRequest {
  product: string;
  audience: string;
  goal: string;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
}

export interface LandingPageResult {
  heroHeadline: string;
  heroSubheadline: string;
  benefits: string[];
  features: { title: string; description: string }[];
  testimonials: { quote: string; author: string; role: string }[];
  faq: { question: string; answer: string }[];
  cta: string;
  fullCopy: string;
}
