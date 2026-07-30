// ─── Beginner-Friendly Term Translations ─────────────────────────────────────────
// Replaces technical marketing terms with simple explanations

import type { Language } from '@/lib/translations';

export interface BeginnerTerm {
  term: string;
  simple: { en: string; ar: string };
}

export const BEGINNER_TERMS: BeginnerTerm[] = [
  {
    term: 'marketing hook',
    simple: {
      en: 'sentence that grabs attention',
      ar: 'جملة تجذب الانتباه',
    },
  },
  {
    term: 'ad copy',
    simple: {
      en: 'words for your advertisement',
      ar: 'كلمات لإعلانك',
    },
  },
  {
    term: 'conversion',
    simple: {
      en: 'getting people to buy or sign up',
      ar: 'جعل الناس يشترون أو يسجلون',
    },
  },
  {
    term: 'SEO',
    simple: {
      en: 'helping people find you on Google',
      ar: 'مساعدة الناس في العثور عليك على جوجل',
    },
  },
  {
    term: 'keyword',
    simple: {
      en: 'word people search for',
      ar: 'كلمة يبحث عنها الناس',
    },
  },
  {
    term: 'CTA',
    simple: {
      en: 'button or link for people to click',
      ar: 'زر أو رابط للناس للضغط عليه',
    },
  },
  {
    term: 'call to action',
    simple: {
      en: 'button or link for people to click',
      ar: 'زر أو رابط للناس للضغط عليه',
    },
  },
  {
    term: 'landing page',
    simple: {
      en: 'web page where people arrive',
      ar: 'صفحة ويب يصل إليها الناس',
    },
  },
  {
    term: 'persona',
    simple: {
      en: 'description of your ideal customer',
      ar: 'وصف لعميلك المثالي',
    },
  },
  {
    term: 'brand voice',
    simple: {
      en: 'how your brand talks',
      ar: 'كيف تتحدث علامتك التجارية',
    },
  },
  {
    term: 'engagement',
    simple: {
      en: 'people liking and commenting',
      ar: 'إعجاب الناس وتعليقهم',
    },
  },
  {
    term: 'ROAS',
    simple: {
      en: 'profit from ads compared to cost',
      ar: 'الربح من الإعلانات مقارنة بالتكلفة',
    },
  },
  {
    term: 'CPA',
    simple: {
      en: 'cost to get one new customer',
      ar: 'التكلفة للحصول على عميل جديد',
    },
  },
  {
    term: 'CTR',
    simple: {
      en: 'how many people clicked your link',
      ar: 'كم عدد الأشخاص الذين نقرروا على رابطك',
    },
  },
  {
    term: 'CPM',
    simple: {
      en: 'cost for 1000 people to see your ad',
      ar: 'التكلفة ليرى 1000 شخص إعلانك',
    },
  },
  {
    term: 'campaign',
    simple: {
      en: 'planned series of ads',
      ar: 'سلسلة مخططة من الإعلانات',
    },
  },
  {
    term: 'KPI',
    simple: {
      en: 'number that shows your success',
      ar: 'رقم يوضح نجاحك',
    },
  },
  {
    term: 'SWOT',
    simple: {
      en: 'looking at strengths and weaknesses',
      ar: 'النظر في نقاط القوة والضعف',
    },
  },
  {
    term: 'target audience',
    simple: {
      en: 'people you want to reach',
      ar: 'الأشخاص الذين تريد الوصول إليهم',
    },
  },
  {
    term: 'niche',
    simple: {
      en: 'specific area or topic',
      ar: 'مجال أو موضوع محدد',
    },
  },
  {
    term: 'lead',
    simple: {
      en: 'person interested in your product',
      ar: 'شخص مهتم بمنتجك',
    },
  },
  {
    term: 'funnel',
    simple: {
      en: 'steps to turn visitors into buyers',
      ar: 'خطوات لتحويل الزوار إلى مشترين',
    },
  },
  {
    term: 'ROI',
    simple: {
      en: 'profit from your investment',
      ar: 'الربح من استثمارك',
    },
  },
  {
    term: 'value proposition',
    simple: {
      en: 'what makes you special',
      ar: 'ما يجعلك مميزًا',
    },
  },
  {
    term: 'pain point',
    simple: {
      en: 'problem your customer faces',
      ar: 'مشكلة يواجهها عميلك',
    },
  },
];

/**
 * Converts technical terms to beginner-friendly language
 */
export function simplifyText(text: string, lang: Language): string {
  let simplified = text;

  for (const term of BEGINNER_TERMS) {
    const regex = new RegExp(term.term, 'gi');
    simplified = simplified.replace(regex, term.simple[lang]);
  }

  return simplified;
}

/**
 * Gets a beginner-friendly explanation for a term
 */
export function getSimpleTerm(term: string, lang: Language): string | undefined {
  const found = BEGINNER_TERMS.find((t) => t.term.toLowerCase() === term.toLowerCase());
  return found?.simple[lang];
}
