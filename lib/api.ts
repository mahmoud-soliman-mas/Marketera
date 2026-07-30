'use client';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface ApiOptions {
  /** Discriminator for the edge function. */
  type: string;
  [key: string]: unknown;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

/**
 * Maps request type to edge function name.
 */
function getEdgeFunctionName(type: string): string {
  switch (type) {
    case 'hooks':
    case 'content-ideas':
    case 'ad-copy':
    case 'video-prompt':
    case 'persona':
    case 'marketing-plan':
    case 'seo':
    case 'social-media':
    case 'email':
    case 'landing-page':
    case 'product-description':
    case 'brand-voice':
    case 'ai-assistant':
    case 'hook-optimizer':
    case 'viral-score':
    case 'engagement-prediction':
    case 'emotional-analyzer':
    case 'readability-score':
    case 'persuasion-score':
    case 'ai-rewrite':
    case 'cta-generator':
    case 'headline-improver':
    case 'ai-insights':
      return 'generate-hooks';
    default:
      return 'generate-hooks';
  }
}

/**
 * Calls the Supabase edge function that proxies Groq.
 * Returns a normalized result so callers can handle errors uniformly.
 */
export async function callApi<T = unknown>(payload: ApiOptions): Promise<ApiResult<T>> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      ok: false,
      status: 0,
      error: 'Supabase is not configured. Check your environment variables.',
    };
  }

  const functionName = getEdgeFunctionName(payload.type);

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string } & T;

    if (!res.ok || (data as { error?: string }).error) {
      return {
        ok: false,
        status: res.status,
        error: (data as { error?: string }).error || 'Request failed. Please try again.',
      };
    }

    return { ok: true, status: res.status, data: data as T };
  } catch {
    return {
      ok: false,
      status: 0,
      error: 'Network error. Check your connection and try again.',
    };
  }
}

/** Detects Arabic content so the UI can flip direction and language. */
export function detectLang(text: string): 'ar' | 'en' {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicChars / Math.max(text.length, 1) > 0.2 ? 'ar' : 'en';
}

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
