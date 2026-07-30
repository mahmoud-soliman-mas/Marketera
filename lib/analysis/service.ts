// ─── AI Analysis Service ─────────────────────────────────────────────────────
// Client-side service that calls the edge function for AI analysis tools.

import { callApi } from '@/lib/api';
import { useSettings } from '@/lib/settings';
import type {
  ViralScoreResult,
  EngagementPrediction,
  EmotionalAnalysis,
  ReadabilityScore,
  PersuasionScore,
  RewriteResult,
  CtaGeneratorResult,
  HeadlineImproverResult,
  HookOptimizerResult,
  AiInsights,
} from './types';

type Lang = 'ar' | 'en';

function useLang(): Lang {
  const { settings } = useSettings();
  return settings.languageMode === 'ar' ? 'ar' : 'en';
}

export async function getViralScore(hook: string, lang: Lang = 'en', creativity = 70): Promise<ViralScoreResult> {
  const res = await callApi<ViralScoreResult>({ type: 'viral-score', hook, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to score');
  return res.data;
}

export async function getEngagementPrediction(hook: string, platform?: string, lang: Lang = 'en', creativity = 70): Promise<EngagementPrediction> {
  const res = await callApi<EngagementPrediction>({ type: 'engagement-prediction', hook, platform, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to predict');
  return res.data;
}

export async function getEmotionalAnalysis(hook: string, lang: Lang = 'en', creativity = 70): Promise<EmotionalAnalysis> {
  const res = await callApi<EmotionalAnalysis>({ type: 'emotional-analyzer', hook, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to analyze');
  return res.data;
}

export async function getReadabilityScore(hook: string, lang: Lang = 'en', creativity = 70): Promise<ReadabilityScore> {
  const res = await callApi<ReadabilityScore>({ type: 'readability-score', hook, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to assess');
  return res.data;
}

export async function getPersuasionScore(hook: string, lang: Lang = 'en', creativity = 70): Promise<PersuasionScore> {
  const res = await callApi<PersuasionScore>({ type: 'persuasion-score', hook, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to score');
  return res.data;
}

export async function rewriteText(text: string, style: string, lang: Lang = 'en', creativity = 70): Promise<RewriteResult> {
  const res = await callApi<RewriteResult>({ type: 'ai-rewrite', text, style, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to rewrite');
  return res.data;
}

export async function generateCtas(product: string, goal?: string, lang: Lang = 'en', creativity = 70): Promise<CtaGeneratorResult> {
  const res = await callApi<CtaGeneratorResult>({ type: 'cta-generator', product, goal, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to generate CTAs');
  return res.data;
}

export async function improveHeadline(headline: string, lang: Lang = 'en', creativity = 70): Promise<HeadlineImproverResult> {
  const res = await callApi<HeadlineImproverResult>({ type: 'headline-improver', headline, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to improve headline');
  return res.data;
}

export async function optimizeHook(hook: string, goal?: string, lang: Lang = 'en', creativity = 70): Promise<HookOptimizerResult> {
  const res = await callApi<HookOptimizerResult>({ type: 'hook-optimizer', hook, goal, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to optimize hook');
  return res.data;
}

export async function getAiInsights(content: string, lang: Lang = 'en', creativity = 70): Promise<AiInsights> {
  const res = await callApi<AiInsights>({ type: 'ai-insights', content, language: lang, creativity });
  if (!res.ok || !res.data) throw new Error(res.error || 'Failed to generate insights');
  return res.data;
}

export { useLang };
