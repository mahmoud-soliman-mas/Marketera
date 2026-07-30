'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type LanguageMode = 'auto' | 'ar' | 'en';
export type ResultCount = 5 | 10 | 20 | 50;
export type OutputStyle = 'professional' | 'casual' | 'creative' | 'persuasive';
export type ThemeMode = 'light' | 'dark' | 'system';
export type MoodMode = 'neutral' | 'energetic' | 'calm' | 'bold' | 'playful' | 'luxury';
export type PersonaMode = 'marketer' | 'founder' | 'copywriter' | 'strategist' | 'storyteller' | 'analyst';
export type OutputMode = 'draft' | 'final';

export interface AppSettings {
  languageMode: LanguageMode;
  resultCount: ResultCount;
  outputStyle: OutputStyle;
  themeMode: ThemeMode;
  saveHistory: boolean;
  // ── AI Control Center
  mood: MoodMode;
  persona: PersonaMode;
  creativity: number; // 0..100 slider
  outputMode: OutputMode;
  autoLanguage: boolean; // when false, languageMode is honored exactly
  // ── Accessibility
  accessibilityMode: boolean;
  beginnerMode: boolean;
  voiceNavigation: boolean;
  autoSpeak: boolean; // speak important instructions automatically
}

const DEFAULTS: AppSettings = {
  languageMode: 'ar',
  resultCount: 10,
  outputStyle: 'professional',
  themeMode: 'light',
  saveHistory: true,
  mood: 'neutral',
  persona: 'marketer',
  creativity: 70,
  outputMode: 'final',
  autoLanguage: true,
  accessibilityMode: false,
  beginnerMode: false,
  voiceNavigation: false,
  autoSpeak: false,
};

const STORAGE_KEY = 'ai-marketing-settings';

interface SettingsCtx {
  settings: AppSettings;
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  reset: () => void;
}

const Ctx = createContext<SettingsCtx>({ settings: DEFAULTS, update: () => {}, reset: () => {} });

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const { themeMode } = settings;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = themeMode === 'dark' || (themeMode === 'system' && prefersDark);
    root.classList.toggle('dark', isDark);
  }, [settings.themeMode]);

  const update = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULTS);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS)); } catch {}
  }, []);

  return <Ctx.Provider value={{ settings, update, reset }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return useContext(Ctx);
}

export const MOOD_LABELS: Record<MoodMode, { en: string; ar: string; hint: string }> = {
  neutral:   { en: 'Neutral',   ar: 'محايد',        hint: 'Balanced, even tone' },
  energetic: { en: 'Energetic', ar: 'حيوي',         hint: 'High-energy, punchy' },
  calm:      { en: 'Calm',      ar: 'هادئ',         hint: 'Soft, reassuring' },
  bold:      { en: 'Bold',      ar: 'جريء',         hint: 'Confident, daring' },
  playful:   { en: 'Playful',   ar: 'مرح',          hint: 'Fun, lighthearted' },
  luxury:    { en: 'Luxury',    ar: 'فاخر',         hint: 'Premium, refined' },
};

export const PERSONA_LABELS: Record<PersonaMode, { en: string; ar: string; hint: string }> = {
  marketer:    { en: 'Marketer',    ar: 'مسوّق',      hint: 'Conversion-focused' },
  founder:     { en: 'Founder',     ar: 'مؤسس',       hint: 'Vision-led storytelling' },
  copywriter:  { en: 'Copywriter',  ar: 'كاتب إعلانات', hint: 'Punchy, persuasive' },
  strategist:  { en: 'Strategist',  ar: 'استراتيج',   hint: 'Insight-driven' },
  storyteller: { en: 'Storyteller', ar: 'راوي',       hint: 'Narrative, emotional' },
  analyst:     { en: 'Analyst',     ar: 'محلل',       hint: 'Data-led, precise' },
};
