// ─── Smart Suggestions Types ─────────────────────────────────────────────────

import type { ToolId } from '@/lib/tools';

export type SuggestionContext =
  | 'hooks-generated'
  | 'content-ideas-generated'
  | 'ad-copy-generated'
  | 'video-prompt-generated'
  | 'persona-generated'
  | 'seo-generated'
  | 'marketing-plan-generated'
  | 'email-generated'
  | 'landing-page-generated'
  | 'product-description-generated'
  | 'brand-voice-generated'
  | 'social-media-generated';

export interface SmartSuggestion {
  id: string;
  toolId: ToolId;
  label: string;
  description: string;
  priority: number;
  context: SuggestionContext[];
}

export const SMART_SUGGESTIONS: SmartSuggestion[] = [
  // After generating hooks
  {
    id: 'hooks-to-ad-copy',
    toolId: 'ad-copy',
    label: 'Create Ad Copy',
    description: 'Turn these hooks into full ad copy for any platform',
    priority: 1,
    context: ['hooks-generated'],
  },
  {
    id: 'hooks-to-video-prompt',
    toolId: 'video-prompt',
    label: 'Generate Video Prompt',
    description: 'Create a video prompt using these hooks',
    priority: 2,
    context: ['hooks-generated'],
  },
  {
    id: 'hooks-to-email',
    toolId: 'email',
    label: 'Create Email Campaign',
    description: 'Use these hooks in email subject lines',
    priority: 3,
    context: ['hooks-generated'],
  },

  // After generating content ideas
  {
    id: 'ideas-to-hooks',
    toolId: 'hooks',
    label: 'Generate Hooks',
    description: 'Create marketing hooks from your content ideas',
    priority: 1,
    context: ['content-ideas-generated'],
  },
  {
    id: 'ideas-to-social',
    toolId: 'social-media',
    label: 'Create Social Posts',
    description: 'Turn ideas into social media content',
    priority: 2,
    context: ['content-ideas-generated'],
  },

  // After generating ad copy
  {
    id: 'ad-copy-to-hooks',
    toolId: 'hooks',
    label: 'Generate More Hooks',
    description: 'Create variations of your ad hooks',
    priority: 1,
    context: ['ad-copy-generated'],
  },

  // After generating video prompt
  {
    id: 'video-to-ad-copy',
    toolId: 'ad-copy',
    label: 'Create Ad Copy',
    description: 'Generate ad copy for the same campaign',
    priority: 1,
    context: ['video-prompt-generated'],
  },
  {
    id: 'video-to-hooks',
    toolId: 'hooks',
    label: 'Generate Hooks',
    description: 'Create more hooks for this video concept',
    priority: 2,
    context: ['video-prompt-generated'],
  },

  // After generating persona
  {
    id: 'persona-to-hooks',
    toolId: 'hooks',
    label: 'Generate Hooks',
    description: 'Create hooks targeting this persona',
    priority: 1,
    context: ['persona-generated'],
  },
  {
    id: 'persona-to-ad-copy',
    toolId: 'ad-copy',
    label: 'Create Ad Copy',
    description: 'Write ad copy for this persona',
    priority: 2,
    context: ['persona-generated'],
  },
  {
    id: 'persona-to-content',
    toolId: 'content-ideas',
    label: 'Get Content Ideas',
    description: 'Generate content ideas for this persona',
    priority: 3,
    context: ['persona-generated'],
  },

  // After SEO
  {
    id: 'seo-to-content',
    toolId: 'content-ideas',
    label: 'Get Content Ideas',
    description: 'Create content around these keywords',
    priority: 1,
    context: ['seo-generated'],
  },
  {
    id: 'seo-to-hooks',
    toolId: 'hooks',
    label: 'Generate Hooks',
    description: 'Create hooks using these keywords',
    priority: 2,
    context: ['seo-generated'],
  },

  // After marketing plan
  {
    id: 'plan-to-hooks',
    toolId: 'hooks',
    label: 'Generate Hooks',
    description: 'Create hooks for your campaigns',
    priority: 1,
    context: ['marketing-plan-generated'],
  },
  {
    id: 'plan-to-ad-copy',
    toolId: 'ad-copy',
    label: 'Create Ad Copy',
    description: 'Write ad copy for your plan',
    priority: 2,
    context: ['marketing-plan-generated'],
  },

  // After email
  {
    id: 'email-to-hooks',
    toolId: 'hooks',
    label: 'Generate More Hooks',
    description: 'Get more subject line ideas',
    priority: 1,
    context: ['email-generated'],
  },
  {
    id: 'email-to-landing',
    toolId: 'landing-page',
    label: 'Create Landing Page',
    description: 'Build a landing page for this email campaign',
    priority: 2,
    context: ['email-generated'],
  },

  // After landing page
  {
    id: 'landing-to-ad-copy',
    toolId: 'ad-copy',
    label: 'Create Ad Copy',
    description: 'Write ads to drive traffic to your page',
    priority: 1,
    context: ['landing-page-generated'],
  },
  {
    id: 'landing-to-email',
    toolId: 'email',
    label: 'Create Email Campaign',
    description: 'Build an email sequence for this page',
    priority: 2,
    context: ['landing-page-generated'],
  },

  // After product description
  {
    id: 'product-to-ad-copy',
    toolId: 'ad-copy',
    label: 'Create Ad Copy',
    description: 'Write ads with this description',
    priority: 1,
    context: ['product-description-generated'],
  },
  {
    id: 'product-to-hooks',
    toolId: 'hooks',
    label: 'Generate Hooks',
    description: 'Create hooks for this product',
    priority: 2,
    context: ['product-description-generated'],
  },

  // After brand voice
  {
    id: 'brand-to-hooks',
    toolId: 'hooks',
    label: 'Generate Hooks',
    description: 'Create hooks in this brand voice',
    priority: 1,
    context: ['brand-voice-generated'],
  },
  {
    id: 'brand-to-ad-copy',
    toolId: 'ad-copy',
    label: 'Create Ad Copy',
    description: 'Write ad copy in this voice',
    priority: 2,
    context: ['brand-voice-generated'],
  },

  // After social media
  {
    id: 'social-to-hooks',
    toolId: 'hooks',
    label: 'Generate Hooks',
    description: 'Create hooks from your social posts',
    priority: 1,
    context: ['social-media-generated'],
  },
];

export function getSuggestionsForContext(context: SuggestionContext): SmartSuggestion[] {
  return SMART_SUGGESTIONS.filter((s) => s.context.includes(context)).sort((a, b) => a.priority - b.priority);
}
