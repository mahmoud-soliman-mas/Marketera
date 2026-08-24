// ─── Enhanced AI Assistant Service ──────────────────────────────────────────────────
// Intelligent marketing assistant with smart tool routing and memory

import { callApi } from '@/lib/api';
import type { AIAssistantRequest, AIAssistantResult, AIMessage, ConversationMemory, SuggestedAction, FollowUpOption, GeneratedContent } from './types';

const MEMORY_KEY = 'ai-assistant-memory';
const CONVERSATION_KEY = 'ai-assistant-conversation';
const PREFERENCES_KEY = 'ai-assistant-preferences';

// ─── Memory Management ─────────────────────────────────────────────────────────────

export function loadMemory(): ConversationMemory {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        language: parsed.language || 'en',
      };
    }
  } catch {}
  return { language: 'en' };
}

export function saveMemory(memory: ConversationMemory): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch {}
}

export function clearMemory(): void {
  try {
    localStorage.removeItem(MEMORY_KEY);
  } catch {}
}

export function updateMemory(updates: Partial<ConversationMemory>): void {
  const memory = loadMemory();
  saveMemory({ ...memory, ...updates, updatedAt: Date.now() });
}

// ─── Conversation Management ──────────────────────────────────────────────────────

export function saveConversation(messages: AIMessage[]): void {
  try {
    localStorage.setItem(CONVERSATION_KEY, JSON.stringify(messages));
  } catch {}
}

export function loadConversation(): AIMessage[] {
  try {
    const raw = localStorage.getItem(CONVERSATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function clearConversation(): void {
  try {
    localStorage.removeItem(CONVERSATION_KEY);
  } catch {}
}

// ─── Preferences Management ────────────────────────────────────────────────────────

interface AssistantPreferences {
  autoSpeak: boolean;
  playbackSpeed: number;
  volume: number;
}

export function loadPreferences(): AssistantPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { autoSpeak: false, playbackSpeed: 1, volume: 1 };
}

export function savePreferences(prefs: AssistantPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  } catch {}
}

// ─── Suggested Actions Generator ───────────────────────────────────────────────────

function generateSuggestedActions(
  context: string,
  memory: ConversationMemory,
  lang: 'ar' | 'en'
): SuggestedAction[] {
  const actions: SuggestedAction[] = [];
  const hasBusiness = memory.business || context.toLowerCase().includes('sell') || context.toLowerCase().includes('business') || context.toLowerCase().includes('بيع') || context.toLowerCase().includes('مشروع');
  const hasProduct = memory.products?.length || context.toLowerCase().includes('product') || context.toLowerCase().includes('منتج');
  const hasAudience = memory.audience || context.toLowerCase().includes('audience') || context.toLowerCase().includes('جمهور') || context.toLowerCase().includes('عملاء');

  // Prioritize based on what's missing
  if (!hasBusiness && !hasProduct) {
    actions.push({
      id: 'tell-about-business',
      label: lang === 'ar' ? 'أخبرني عن مشروعك' : 'Tell me about your business',
      description: lang === 'ar' ? 'سأساعدك في إنشاء استراتيجية تسويقية' : "I'll help you create a marketing strategy",
      toolId: 'ai-assistant',
    });
  }

  if (hasBusiness || hasProduct) {
    actions.push({
      id: 'generate-hooks',
      label: lang === 'ar' ? 'إنشاء عناوين جذابة' : 'Generate Hooks',
      description: lang === 'ar' ? 'عناوين قصيرة تجذب الانتباه' : 'Scroll-stopping headlines for your ads',
      toolId: 'hooks',
    });

    actions.push({
      id: 'generate-ad-copy',
      label: lang === 'ar' ? 'إنشاء نص إعلاني' : 'Create Ad Copy',
      description: lang === 'ar' ? 'نصوص إعلانية عالية التحويل' : 'High-converting ad copy for any platform',
      toolId: 'ad-copy',
    });

    actions.push({
      id: 'generate-content-ideas',
      label: lang === 'ar' ? 'أفكار محتوى' : 'Content Ideas',
      description: lang === 'ar' ? 'أفكار لمنشورات سوشيال ميديا' : 'Social media content ideas',
      toolId: 'content-ideas',
    });
  }

  if (hasBusiness && hasAudience) {
    actions.push({
      id: 'create-persona',
      label: lang === 'ar' ? 'إنشاء شخصية العميل' : 'Create Persona',
      description: lang === 'ar' ? 'ملف تفصيلي لعميلك المثالي' : 'Detailed customer persona',
      toolId: 'persona',
    });

    actions.push({
      id: 'create-marketing-plan',
      label: lang === 'ar' ? 'خطة تسويقية' : 'Marketing Plan',
      description: lang === 'ar' ? 'استراتيجية تسويقية شاملة' : 'Comprehensive marketing strategy',
      toolId: 'marketing-plan',
    });
  }

  // Always show these
  actions.push({
    id: 'seo-keywords',
    label: lang === 'ar' ? 'كلمات مفتاحية SEO' : 'SEO Keywords',
    description: lang === 'ar' ? 'كلمات لتحسين ظهورك في البحث' : 'Keywords to boost your search visibility',
    toolId: 'seo',
  });

  actions.push({
    id: 'video-prompts',
    label: lang === 'ar' ? 'برومبتات فيديو' : 'Video Prompts',
    description: lang === 'ar' ? 'وصوف لأدوات فيديو AI' : 'Prompts for AI video tools',
    toolId: 'video-prompt',
  });

  return actions;
}

// ─── Follow-Up Options Generator ──────────────────────────────────────────────────

function generateFollowUpOptions(lang: 'ar' | 'en'): FollowUpOption[] {
  return [
    { id: 'improve', label: lang === 'ar' ? 'تحسين' : 'Improve', action: 'improve' },
    { id: 'rewrite', label: lang === 'ar' ? 'إعادة كتابة' : 'Rewrite', action: 'rewrite' },
    { id: 'simplify', label: lang === 'ar' ? 'تبسيط' : 'Simplify', action: 'simplify' },
    { id: 'expand', label: lang === 'ar' ? 'توسيع' : 'Expand', action: 'expand' },
    { id: 'professional', label: lang === 'ar' ? 'احترافي' : 'Professional', action: 'professional' },
    { id: 'creative', label: lang === 'ar' ? 'إبداعي' : 'Creative', action: 'creative' },
    { id: 'short', label: lang === 'ar' ? 'أقصر' : 'Shorter', action: 'short' },
    { id: 'long', label: lang === 'ar' ? 'أطول' : 'Longer', action: 'long' },
    { id: 'seo', label: 'SEO Optimized', action: 'seo' },
  ];
}

// ─── Main Service ─────────────────────────────────────────────────────────────────

interface AIAssistantResponse {
  response: string;
  reasoning?: {
    userGoal: string;
    recommendedTools: string[];
  };
  generatedContent?: GeneratedContent[];
}

export const aiAssistantService = {
  async chat(req: AIAssistantRequest): Promise<AIAssistantResult> {
    const memory = loadMemory();

    // Build enhanced request with memory context
    const result = await callApi<AIAssistantResponse>({
      type: 'ai-assistant',
      message: req.message,
      conversationHistory: req.conversationHistory?.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      })),
      memory: {
        business: memory.business,
        products: memory.products,
        audience: memory.audience,
        brandVoice: memory.brandVoice,
        preferredStyle: memory.preferredStyle,
        preferredChannels: memory.preferredChannels,
        language: memory.language,
      },
      language: req.language,
      creativity: req.creativity,
      persona: req.persona,
      mood: req.mood,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to get response');
    }

    // Update memory based on conversation
    this.extractAndSaveMemory(req.message, result.data.response, memory);

    // Generate suggested actions
    const suggestedActions = generateSuggestedActions(
      `${req.message} ${result.data.response}`,
      memory,
      req.language
    );

    // Generate follow-up options
    const followUpOptions = generateFollowUpOptions(req.language);

    return {
      response: result.data.response,
      reasoning: result.data.reasoning ? {
        userGoal: result.data.reasoning.userGoal,
        businessType: memory.business,
        targetAudience: memory.audience,
        funnelStage: 'awareness', // Could be inferred from context
        recommendedTools: result.data.reasoning.recommendedTools || [],
        nextAction: suggestedActions[0]?.label || '',
      } : undefined,
      suggestedActions,
      followUpOptions,
      generatedContent: result.data.generatedContent,
    };
  },

  /**
   * Streaming chat — yields text tokens as they arrive from the edge function.
   * Returns the full response text when complete.
   */
  async chatStream(
    req: AIAssistantRequest,
    onToken: (token: string) => void,
    signal?: AbortSignal
  ): Promise<string> {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured. Check your environment variables.');
    }

    const memory = loadMemory();

    const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-hooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        type: 'ai-assistant',
        message: req.message,
        conversationHistory: req.conversationHistory?.slice(-10).map(m => ({
          role: m.role,
          content: m.content,
        })),
        memory: {
          business: memory.business,
          products: memory.products,
          audience: memory.audience,
          brandVoice: memory.brandVoice,
          preferredStyle: memory.preferredStyle,
          preferredChannels: memory.preferredChannels,
          language: memory.language,
        },
        language: req.language,
        creativity: req.creativity,
        persona: req.persona,
        mood: req.mood,
        stream: true,
      }),
      signal,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || `AI service request failed (${res.status}). Please try again.`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      const jsonContent = data?.response ?? data?.reply ?? data?.result;
      if (typeof jsonContent !== 'string' || !jsonContent.trim()) {
        throw new Error('The AI service returned an empty response. Please try again.');
      }
      onToken(jsonContent);
      this.extractAndSaveMemory(req.message, jsonContent, memory);
      return jsonContent;
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response stream available.');

    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullContent += chunk;
      onToken(chunk);
    }

    if (!fullContent.trim()) throw new Error('The AI service returned an empty response. Please try again.');

    // Update memory after streaming completes
    this.extractAndSaveMemory(req.message, fullContent, memory);

    return fullContent;
  },

  extractAndSaveMemory(userMessage: string, aiResponse: string, memory: ConversationMemory): void {
    const combined = `${userMessage} ${aiResponse}`.toLowerCase();

    // Extract business info
    const businessPatterns = [
      /i sell (\w+(?:\s+\w+)?)/i,
      /my business is (\w+(?:\s+\w+)?)/i,
      /we sell (\w+(?:\s+\w+)?)/i,
      /(?:أبيع|أبيع)\s+(\S+(?:\s+\S+)?)/,
      /مشروعي\s+(\S+(?:\s+\S+)?)/,
    ];

    for (const pattern of businessPatterns) {
      const match = combined.match(pattern);
      if (match && !memory.business) {
        updateMemory({ business: match[1] });
        break;
      }
    }

    // Extract audience info
    const audiencePatterns = [
      /target(?:ing)?\s+(?:is\s+)?(\w+(?:\s+\w+)?)/i,
      /audience(?:\s+is)?\s+(\w+(?:\s+\w+)?)/i,
      /(?:عملائي|جمهوري)\s+(\S+(?:\s+\S+)?)/,
    ];

    for (const pattern of audiencePatterns) {
      const match = combined.match(pattern);
      if (match && !memory.audience) {
        updateMemory({ audience: match[1] });
        break;
      }
    }
  },

  async followUp(
    originalResponse: string,
    action: FollowUpOption['action'],
    context: { language: 'ar' | 'en'; creativity?: number; persona?: string; mood?: string }
  ): Promise<AIAssistantResult> {
    const actionPrompts: Record<string, string> = {
      improve: context.language === 'ar' ? 'حسّن هذا النص واجعله أفضل:' : 'Improve this text and make it better:',
      rewrite: context.language === 'ar' ? 'أعد كتابة هذا النص بشكل مختلف:' : 'Rewrite this text differently:',
      simplify: context.language === 'ar' ? 'بسّط هذا النص واجعله أسهل للفهم:' : 'Simplify this text and make it easier to understand:',
      expand: context.language === 'ar' ? 'وسّع هذا النص وأضف المزيد من التفاصيل:' : 'Expand this text and add more details:',
      professional: context.language === 'ar' ? 'أعد كتابة هذا النص بأسلوب احترافي:' : 'Rewrite this in a professional tone:',
      luxury: context.language === 'ar' ? 'أعد كتابة هذا النص بأسلوب فاخر:' : 'Rewrite this in a luxury/premium tone:',
      friendly: context.language === 'ar' ? 'أعد كتابة هذا النص بأسلوب ودي:' : 'Rewrite this in a friendly, conversational tone:',
      creative: context.language === 'ar' ? 'أعد كتابة هذا النص بأسلوب إبداعي ومبتكر:' : 'Rewrite this in a creative and innovative way:',
      persuasive: context.language === 'ar' ? 'اجعل هذا النص أكثر إقناعاً:' : 'Make this text more persuasive:',
      short: context.language === 'ar' ? 'اجعل هذا النص أقصر وأكثر إيجازاً:' : 'Make this text shorter and more concise:',
      long: context.language === 'ar' ? 'اجعل هذا النص أطول وأكثر تفصيلاً:' : 'Make this text longer and more detailed:',
      seo: context.language === 'ar' ? 'حسّن هذا النص لمحركات البحث:' : 'Optimize this text for SEO:',
      social: context.language === 'ar' ? 'حوّل هذا النص لمنشور سوشيال ميديا:' : 'Convert this into a social media post:',
      translate: '',
    };

    const prompt = actionPrompts[action];
    const fullMessage = `${prompt}\n\n---\n${originalResponse}\n---`;

    return this.chat({
      message: fullMessage,
      language: context.language,
      creativity: context.creativity,
      persona: context.persona,
      mood: context.mood,
    });
  },
};
