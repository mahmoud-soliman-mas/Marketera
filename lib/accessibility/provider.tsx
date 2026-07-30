'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useSettings } from '@/lib/settings';
import { useI18n } from '@/lib/i18n';
import { voiceService } from '@/lib/voice/service';
import { getToolExplanation, getExplanationText } from './types';
import type { ToolId } from '@/lib/tools';

// ─── Inactivity Detection ──────────────────────────────────────────────────────

export function useInactivityDetection(
  timeoutMs: number = 20000,
  onInactive?: () => void
) {
  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onInactiveRef = useRef(onInactive);

  useEffect(() => {
    onInactiveRef.current = onInactive;
  }, [onInactive]);

  const resetTimer = useCallback(() => {
    setIsInactive(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsInactive(true);
      onInactiveRef.current?.();
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  return { isInactive, resetActivity: resetTimer };
}

// ─── Accessibility Context ─────────────────────────────────────────────────────

interface AccessibilityContextValue {
  accessibilityMode: boolean;
  beginnerMode: boolean;
  voiceNavigation: boolean;
  autoSpeak: boolean;
  speakText: (text: string, lang?: 'ar' | 'en') => Promise<void>;
  speakExplanation: (toolId: ToolId) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  showInactivityHelp: boolean;
  dismissInactivityHelp: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const { language } = useI18n();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showInactivityHelp, setShowInactivityHelp] = useState(false);

  // Subscribe to TTS status
  useEffect(() => {
    const unsubscribe = voiceService.tts.subscribeStatus((status) => {
      setIsSpeaking(status === 'speaking');
    });
    return unsubscribe;
  }, []);

  // Speak text in the appropriate language
  const speakText = useCallback(async (text: string, lang?: 'ar' | 'en') => {
    if (!settings.accessibilityMode && !settings.autoSpeak) return;

    const speakLang = lang || language;

    try {
      await voiceService.tts.speak({
        text,
        lang: speakLang,
        rate: 0.9, // Slightly slower for accessibility
      });
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  }, [settings.accessibilityMode, settings.autoSpeak, language]);

  // Speak tool explanation
  const speakExplanation = useCallback(async (toolId: ToolId) => {
    const explanation = getToolExplanation(toolId);
    if (!explanation) return;

    const text = getExplanationText(explanation, language);
    await speakText(text, language);
  }, [language, speakText]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    voiceService.tts.stop();
  }, []);

  // Dismiss inactivity help
  const dismissInactivityHelp = useCallback(() => {
    setShowInactivityHelp(false);
  }, []);

  // Inactivity detection
  const { resetActivity } = useInactivityDetection(20000, () => {
    if (settings.accessibilityMode) {
      setShowInactivityHelp(true);
    }
  });

  // Auto-speak important notifications when accessibility mode is on
  const announceNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (settings.autoSpeak) {
      speakText(message);
    }
  }, [settings.autoSpeak, speakText]);

  return (
    <AccessibilityContext.Provider
      value={{
        accessibilityMode: settings.accessibilityMode,
        beginnerMode: settings.beginnerMode,
        voiceNavigation: settings.voiceNavigation,
        autoSpeak: settings.autoSpeak,
        speakText,
        speakExplanation,
        stopSpeaking,
        isSpeaking,
        showInactivityHelp,
        dismissInactivityHelp,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    // Return default values if not in provider
    return {
      accessibilityMode: false,
      beginnerMode: false,
      voiceNavigation: false,
      autoSpeak: false,
      speakText: async () => {},
      speakExplanation: async () => {},
      stopSpeaking: () => {},
      isSpeaking: false,
      showInactivityHelp: false,
      dismissInactivityHelp: () => {},
    };
  }
  return ctx;
}
