'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { translations, detectBrowserLanguage, getTextDirection, type Language, type TranslationDict } from './translations';

// ─── Context Type ─────────────────────────────────────────────────────────────

interface I18nContextValue {
  language: Language;
  t: TranslationDict;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: Language | 'auto') => void;
  isAuto: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Storage Keys ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ai-marketing-ui-language';
const AUTO_KEY = 'ai-marketing-ui-language-auto';

// ─── Provider Component ────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [isAuto, setIsAuto] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize language on mount — default to Arabic for first-time visitors
  useEffect(() => {
    try {
      const savedAuto = localStorage.getItem(AUTO_KEY);
      const savedLang = localStorage.getItem(STORAGE_KEY);

      if (savedAuto === 'false' && savedLang && (savedLang === 'en' || savedLang === 'ar')) {
        setIsAuto(false);
        setLanguageState(savedLang);
      } else {
        // First visit or auto mode: default to Arabic
        setIsAuto(true);
        setLanguageState('ar');
      }
    } catch {
      setLanguageState('ar');
      setIsAuto(true);
    }
    setMounted(true);
  }, []);

  // Update document direction and lang attribute
  useEffect(() => {
    if (!mounted) return;
    const dir = getTextDirection(language);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language, mounted]);

  // Set language with persistence
  const setLanguage = useCallback((lang: Language | 'auto') => {
    if (lang === 'auto') {
      setIsAuto(true);
      // In auto mode, default to Arabic
      setLanguageState('ar');
      try {
        localStorage.setItem(AUTO_KEY, 'true');
      } catch {}
    } else {
      setIsAuto(false);
      setLanguageState(lang);
      try {
        localStorage.setItem(AUTO_KEY, 'false');
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {}
    }
  }, []);

  // Listen for browser language changes when in auto mode
  useEffect(() => {
    if (!isAuto || !mounted) return;

    const handleLanguageChange = () => {
      const browserLang = detectBrowserLanguage();
      setLanguageState(browserLang);
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, [isAuto, mounted]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    t: translations[language],
    direction: getTextDirection(language),
    setLanguage,
    isAuto,
  }), [language, setLanguage, isAuto]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}

// ─── Convenience Hook for Just Translations ────────────────────────────────────

export function useTranslation(): TranslationDict {
  const { t } = useI18n();
  return t;
}
