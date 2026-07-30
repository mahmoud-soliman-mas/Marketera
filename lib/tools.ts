import {
  Wand2, Lightbulb, FileText, Users, Search, BarChart2, Video, Target,
  Mail, Layout, Share2, ShoppingBag, Volume2, MessageSquare, Heart, FolderKanban,
  Zap, TrendingUp, BookOpen, Brain, RefreshCw, Megaphone, Newspaper, Gauge,
  type LucideIcon,
} from 'lucide-react';
import type { Language } from './translations';

export type ToolId =
  | 'dashboard'
  | 'hooks'
  | 'content-ideas'
  | 'ad-copy'
  | 'video-prompt'
  | 'persona'
  | 'marketing-plan'
  | 'seo'
  | 'social-media'
  | 'email'
  | 'landing-page'
  | 'product-description'
  | 'brand-voice'
  | 'ai-assistant'
  | 'hook-optimizer'
  | 'viral-score'
  | 'engagement-prediction'
  | 'emotional-analyzer'
  | 'readability-score'
  | 'persuasion-score'
  | 'ai-rewrite'
  | 'cta-generator'
  | 'headline-improver'
  | 'favorites'
  | 'projects'
  | 'history'
  | 'settings';

export type ToolCategory = 'Overview' | 'Content' | 'Advertising' | 'Strategy' | 'SEO' | 'Email' | 'Social' | 'AI Tools' | 'Productivity' | 'System';

export interface ToolMeta {
  id: ToolId;
  label: string;
  labelAr: string;
  shortLabel?: string;
  shortLabelAr?: string;
  description: string;
  descriptionAr: string;
  icon: LucideIcon;
  available: boolean;
  comingSoon: boolean;
  category: ToolCategory;
  categoryAr: string;
  accent: string;
}

export const TOOLS: ToolMeta[] = [
  // Overview
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelAr: 'لوحة التحكم',
    description: 'Your AI workspace at a glance',
    descriptionAr: 'مساحة عملك بالذكاء الاصطناعي بنظرة سريعة',
    icon: Wand2,
    available: true,
    comingSoon: false,
    category: 'Overview',
    categoryAr: 'نظرة عامة',
    accent: 'from-sky-500 to-cyan-400',
  },

  // Content
  {
    id: 'hooks',
    label: 'Hooks Generator',
    labelAr: 'مولد العناوين',
    shortLabel: 'Hooks',
    shortLabelAr: 'العناوين',
    description: 'High-converting marketing hooks',
    descriptionAr: 'عناوين تسويقية عالية التحويل',
    icon: Wand2,
    available: true,
    comingSoon: false,
    category: 'Content',
    categoryAr: 'المحتوى',
    accent: 'from-sky-500 to-cyan-400',
  },
  {
    id: 'content-ideas',
    label: 'Content Ideas',
    labelAr: 'أفكار المحتوى',
    description: 'Unique content ideas per niche',
    descriptionAr: 'أفكار محتوى فريدة لكل مجال',
    icon: Lightbulb,
    available: true,
    comingSoon: false,
    category: 'Content',
    categoryAr: 'المحتوى',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    id: 'product-description',
    label: 'Product Description Generator',
    labelAr: 'مولد وصف المنتجات',
    shortLabel: 'Product',
    shortLabelAr: 'المنتج',
    description: 'High-converting ecommerce descriptions',
    descriptionAr: 'وصف منتجات عالي التحويل للتجارة الإلكترونية',
    icon: ShoppingBag,
    available: true,
    comingSoon: false,
    category: 'Content',
    categoryAr: 'المحتوى',
    accent: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'brand-voice',
    label: 'Brand Voice Generator',
    labelAr: 'مولد صوت العلامة',
    shortLabel: 'Brand Voice',
    shortLabelAr: 'صوت العلامة',
    description: 'Define your brand personality and tone',
    descriptionAr: 'حدد شخصية ونبرة علامتك التجارية',
    icon: Volume2,
    available: true,
    comingSoon: false,
    category: 'Content',
    categoryAr: 'المحتوى',
    accent: 'from-purple-500 to-indigo-500',
  },

  // Advertising
  {
    id: 'ad-copy',
    label: 'Ad Copy Generator',
    labelAr: 'مولد نصوص الإعلانات',
    shortLabel: 'Ad Copy',
    shortLabelAr: 'الإعلانات',
    description: 'High-converting ad copy for any platform',
    descriptionAr: 'نصوص إعلانية عالية التحويل لأي منصة',
    icon: FileText,
    available: true,
    comingSoon: false,
    category: 'Advertising',
    categoryAr: 'الإعلانات',
    accent: 'from-rose-500 to-pink-500',
  },
  {
    id: 'video-prompt',
    label: 'Video Prompt Generator',
    labelAr: 'مولد برومبتات الفيديو',
    shortLabel: 'Video Prompt',
    shortLabelAr: 'برومبت الفيديو',
    description: 'Professional prompts for AI video generators',
    descriptionAr: 'برومبتات احترافية لمولدات الفيديو بالذكاء الاصطناعي',
    icon: Video,
    available: true,
    comingSoon: false,
    category: 'Advertising',
    categoryAr: 'الإعلانات',
    accent: 'from-violet-500 to-purple-500',
  },

  // Social Media
  {
    id: 'social-media',
    label: 'Social Media Post Generator',
    labelAr: 'مولد منشورات التواصل',
    shortLabel: 'Social Media',
    shortLabelAr: 'التواصل',
    description: 'Posts for Facebook, Instagram, LinkedIn, X, TikTok',
    descriptionAr: 'منشورات لفيسبوك وانستغرام ولينكد إن وتويتر وتيك توك',
    icon: Share2,
    available: true,
    comingSoon: false,
    category: 'Social',
    categoryAr: 'التواصل',
    accent: 'from-pink-500 to-rose-500',
  },

  // Email
  {
    id: 'email',
    label: 'Email Marketing Generator',
    labelAr: 'مولد التسويق بالبريد',
    shortLabel: 'Email',
    shortLabelAr: 'البريد',
    description: 'Subject lines, welcome, sales & promotional emails',
    descriptionAr: 'عناوين ورسائل ترحيب ومبيعات وعروض ترويجية',
    icon: Mail,
    available: true,
    comingSoon: false,
    category: 'Email',
    categoryAr: 'البريد',
    accent: 'from-blue-500 to-indigo-500',
  },

  // SEO
  {
    id: 'seo',
    label: 'SEO Keyword Generator',
    labelAr: 'مولد كلمات SEO',
    shortLabel: 'SEO',
    shortLabelAr: 'SEO',
    description: 'Keywords, search intent & content opportunities',
    descriptionAr: 'كلمات مفتاحية ونية البحث وفرص المحتوى',
    icon: Search,
    available: true,
    comingSoon: false,
    category: 'SEO',
    categoryAr: 'SEO',
    accent: 'from-emerald-500 to-teal-500',
  },

  // Strategy
  {
    id: 'persona',
    label: 'Persona Generator',
    labelAr: 'مولد الشخصيات',
    shortLabel: 'Persona',
    shortLabelAr: 'الشخصيات',
    description: 'Generate detailed customer personas',
    descriptionAr: 'أنشئ شخصيات عملاء تفصيلية',
    icon: Users,
    available: true,
    comingSoon: false,
    category: 'Strategy',
    categoryAr: 'الاستراتيجية',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'marketing-plan',
    label: 'Marketing Plan Generator',
    labelAr: 'مولد خطة التسويق',
    shortLabel: 'Marketing Plan',
    shortLabelAr: 'الخطة',
    description: 'Complete marketing strategy generator',
    descriptionAr: 'مولد استراتيجية تسويقية كاملة',
    icon: Target,
    available: true,
    comingSoon: false,
    category: 'Strategy',
    categoryAr: 'الاستراتيجية',
    accent: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'landing-page',
    label: 'Landing Page Generator',
    labelAr: 'مولد صفحة الهبوط',
    shortLabel: 'Landing Page',
    shortLabelAr: 'الهبوط',
    description: 'Complete landing page copy & structure',
    descriptionAr: 'نسخة وهيكل صفحة هبوط كاملة',
    icon: Layout,
    available: true,
    comingSoon: false,
    category: 'Strategy',
    categoryAr: 'الاستراتيجية',
    accent: 'from-cyan-500 to-blue-500',
  },

  // AI Assistant
  {
    id: 'ai-assistant',
    label: 'Marketra AI Assistant',
    labelAr: 'مساعد التسويق الذكي',
    shortLabel: 'AI Assistant',
    shortLabelAr: 'المساعد',
    description: 'ChatGPT-like marketing expert assistant',
    descriptionAr: 'مساعد تسويقي ذكي مثل ChatGPT',
    icon: MessageSquare,
    available: true,
    comingSoon: false,
    category: 'Overview',
    categoryAr: 'نظرة عامة',
    accent: 'from-sky-500 to-violet-500',
  },

  // AI Analysis Tools
  {
    id: 'hook-optimizer',
    label: 'AI Hook Optimizer',
    labelAr: 'محسّن العناوين',
    shortLabel: 'Hook Optimizer',
    shortLabelAr: 'تحسين العناوين',
    description: 'Improve existing hooks for more impact',
    descriptionAr: 'حسّن العناوين الموجودة لمزيد من التأثير',
    icon: RefreshCw,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-sky-500 to-blue-500',
  },
  {
    id: 'viral-score',
    label: 'AI Viral Score',
    labelAr: 'النتيجة الفيروسية',
    shortLabel: 'Viral Score',
    shortLabelAr: 'الفيروسية',
    description: 'Score any hook from 0-100 with breakdown',
    descriptionAr: 'قيّم أي عنوان من 0-100 مع تفصيل',
    icon: Zap,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    id: 'engagement-prediction',
    label: 'Engagement Prediction',
    labelAr: 'التنبؤ بالتفاعل',
    shortLabel: 'Engagement',
    shortLabelAr: 'التفاعل',
    description: 'Predict CTR, engagement & scroll stop rate',
    descriptionAr: 'تنبأ بـ CTR والتفاعل ومعدل الإيقاف',
    icon: TrendingUp,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'emotional-analyzer',
    label: 'Emotional Analyzer',
    labelAr: 'محلل العواطف',
    shortLabel: 'Emotions',
    shortLabelAr: 'العواطف',
    description: 'Analyze curiosity, trust, fear, FOMO & more',
    descriptionAr: 'حلل الفضول والثقة والخوف و FOMO والمزيد',
    icon: Heart,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-rose-500 to-pink-500',
  },
  {
    id: 'readability-score',
    label: 'Readability Score',
    labelAr: 'قابلية القراءة',
    shortLabel: 'Readability',
    shortLabelAr: 'القراءة',
    description: 'Assess clarity and reading level',
    descriptionAr: 'قيّم الوضوح ومستوى القراءة',
    icon: BookOpen,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'persuasion-score',
    label: 'Persuasion Score',
    labelAr: 'درجة الإقناع',
    shortLabel: 'Persuasion',
    shortLabelAr: 'الإقناع',
    description: 'Score ethos, pathos, logos & CTA strength',
    descriptionAr: 'قيّم المصداقية والعاطفة والمنطق وقوة الدعوة',
    icon: Target,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    id: 'ai-rewrite',
    label: 'AI Rewrite',
    labelAr: 'إعادة الكتابة',
    shortLabel: 'Rewrite',
    shortLabelAr: 'إعادة',
    description: 'Rewrite in 8 styles: professional, viral, luxury...',
    descriptionAr: 'أعد الكتابة بـ 8 أساليب: احترافي، فيروسي، فاخر...',
    icon: RefreshCw,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'cta-generator',
    label: 'CTA Generator',
    labelAr: 'مولد الدعوات',
    shortLabel: 'CTA',
    shortLabelAr: 'CTA',
    description: 'Generate multiple CTA styles in seconds',
    descriptionAr: 'أنشئ عدة أساليب دعوات للعمل بثواني',
    icon: Megaphone,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    id: 'headline-improver',
    label: 'Headline Improver',
    labelAr: 'محسّن العناوين الرئيسية',
    shortLabel: 'Headlines',
    shortLabelAr: 'العناوين',
    description: 'Improve headlines with 5 angle variants',
    descriptionAr: 'حسّن العناوين بـ 5 زوايا مختلفة',
    icon: Newspaper,
    available: true,
    comingSoon: false,
    category: 'AI Tools',
    categoryAr: 'أدوات الذكاء',
    accent: 'from-orange-500 to-amber-500',
  },
];

export const PRODUCTIVITY_TOOLS: ToolMeta[] = [
  {
    id: 'favorites',
    label: 'Favorites',
    labelAr: 'المفضلة',
    description: 'Your saved favorite generations',
    descriptionAr: 'الأجيال المفضلة المحفوظة',
    icon: Heart,
    available: true,
    comingSoon: false,
    category: 'Productivity',
    categoryAr: 'الإنتاجية',
    accent: 'from-red-500 to-pink-500',
  },
  {
    id: 'projects',
    label: 'Projects',
    labelAr: 'المشاريع',
    description: 'Organize generations by project',
    descriptionAr: 'نظم الأجيال حسب المشروع',
    icon: FolderKanban,
    available: true,
    comingSoon: false,
    category: 'Productivity',
    categoryAr: 'الإنتاجية',
    accent: 'from-orange-500 to-amber-500',
  },
];

export const SYSTEM_TOOLS: ToolMeta[] = [
  {
    id: 'history',
    label: 'History',
    labelAr: 'السجل',
    description: 'Browse, search and replay past generations',
    descriptionAr: 'تصفح وابحث وأعد تشغيل الأجيال السابقة',
    icon: BarChart2,
    available: true,
    comingSoon: false,
    category: 'System',
    categoryAr: 'النظام',
    accent: 'from-slate-500 to-slate-600',
  },
  {
    id: 'settings',
    label: 'Settings',
    labelAr: 'الإعدادات',
    description: 'Tune the AI control center',
    descriptionAr: 'اضبط مركز التحكم بالذكاء الاصطناعي',
    icon: Wand2,
    available: true,
    comingSoon: false,
    category: 'System',
    categoryAr: 'النظام',
    accent: 'from-slate-500 to-slate-600',
  },
];

export const ALL_TOOLS: ToolMeta[] = [...TOOLS, ...PRODUCTIVITY_TOOLS, ...SYSTEM_TOOLS];

export interface SidebarSection {
  title: string;
  titleAr: string;
  tools: ToolMeta[];
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  { title: 'Overview', titleAr: 'نظرة عامة', tools: TOOLS.filter((t) => t.category === 'Overview') },
  { title: 'Content', titleAr: 'المحتوى', tools: TOOLS.filter((t) => t.category === 'Content') },
  { title: 'Social', titleAr: 'التواصل', tools: TOOLS.filter((t) => t.category === 'Social') },
  { title: 'Advertising', titleAr: 'الإعلانات', tools: TOOLS.filter((t) => t.category === 'Advertising') },
  { title: 'Email', titleAr: 'البريد', tools: TOOLS.filter((t) => t.category === 'Email') },
  { title: 'SEO', titleAr: 'SEO', tools: TOOLS.filter((t) => t.category === 'SEO') },
  { title: 'Strategy', titleAr: 'الاستراتيجية', tools: TOOLS.filter((t) => t.category === 'Strategy') },
  { title: 'AI Tools', titleAr: 'أدوات الذكاء', tools: TOOLS.filter((t) => t.category === 'AI Tools') },
  { title: 'Productivity', titleAr: 'الإنتاجية', tools: PRODUCTIVITY_TOOLS },
  { title: 'System', titleAr: 'النظام', tools: SYSTEM_TOOLS },
];

export function getTool(id: ToolId, lang: Language = 'en'): ToolMeta & { tLabel: string; tShortLabel: string; tDescription: string } {
  const tool = ALL_TOOLS.find((t) => t.id === id) ?? TOOLS[0];
  return {
    ...tool,
    tLabel: lang === 'ar' ? tool.labelAr : tool.label,
    tShortLabel: lang === 'ar' ? (tool.shortLabelAr || tool.labelAr) : (tool.shortLabel || tool.label),
    tDescription: lang === 'ar' ? tool.descriptionAr : tool.description,
  };
}

export const AVAILABLE_TOOLS = ALL_TOOLS.filter((t) => t.available);
