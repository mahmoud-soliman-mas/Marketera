'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import type { Language } from '@/lib/translations';
import { clamp01 } from './intro-constants';

interface RobotSpeechProps {
  progressRef: React.MutableRefObject<number>;
  language: Language;
  reducedMotion?: boolean;
  autoSpeak?: boolean;
}

type SpeechLine = {
  start: number;
  end: number;
  text: string;
};

const SPEECH_SCRIPTS: Record<Language, SpeechLine[]> = {
  ar: [
    { start: 0.08, end: 0.28, text: 'مرحبًا بك في Marketera، مساعدك الذكي للتسويق الرقمي.' },
    { start: 0.29, end: 0.51, text: 'أنا هنا لأساعدك على فهم بياناتك وتحليل جمهورك.' },
    { start: 0.53, end: 0.78, text: 'سأساعدك على تحسين حملاتك التسويقية باستخدام الذكاء الاصطناعي.' },
    { start: 0.81, end: 1, text: 'لنبدأ.' },
  ],
  en: [
    { start: 0.08, end: 0.28, text: 'Welcome to Marketera, your intelligent digital marketing assistant.' },
    { start: 0.29, end: 0.51, text: 'I am here to help you understand your data and analyze your audience.' },
    { start: 0.53, end: 0.78, text: 'I will help you optimize your marketing campaigns with artificial intelligence.' },
    { start: 0.81, end: 1, text: "Let's get started." },
  ],
};

export default function RobotSpeech({ progressRef, language, reducedMotion = false, autoSpeak = true }: RobotSpeechProps) {
  const [progress, setProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(autoSpeak);
  const lines = useMemo(() => SPEECH_SCRIPTS[language], [language]);
  const activeLine = useMemo(() => lines.find((line) => progress >= line.start && progress < line.end) || lines[lines.length - 1], [lines, progress]);
  const isArabic = language === 'ar';

  useEffect(() => {
    setVoiceEnabled(autoSpeak);
  }, [autoSpeak, language]);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      setProgress(clamp01(progressRef.current));
      frame = window.requestAnimationFrame(sync);
    };
    frame = window.requestAnimationFrame(sync);
    return () => window.cancelAnimationFrame(frame);
  }, [progressRef]);

  useEffect(() => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synthesis = window.speechSynthesis;
    let cancelled = false;
    let index = 0;

    const speakNext = () => {
      if (cancelled || index >= lines.length) return;
      const utterance = new SpeechSynthesisUtterance(lines[index].text);
      utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = language === 'ar' ? 0.68 : 0.72;
      utterance.pitch = 0.94;
      utterance.volume = 1;
      utterance.onend = () => {
        index += 1;
        if (!cancelled) window.setTimeout(speakNext, 520);
      };
      synthesis.speak(utterance);
    };

    synthesis.cancel();
    window.setTimeout(speakNext, 500);
    return () => {
      cancelled = true;
      synthesis.cancel();
    };
  }, [language, lines, voiceEnabled]);

  const toggleVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setVoiceEnabled((enabled) => !enabled);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-5 sm:bottom-12">
      <div className="pointer-events-auto flex w-full max-w-xl flex-col items-center">
        <motion.div
          key={`${language}-${activeLine.text}`}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: reducedMotion ? 0.1 : 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-2xl border border-white/12 bg-[#071529]/72 px-5 py-3 text-center shadow-[0_18px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          dir={isArabic ? 'rtl' : 'ltr'}
          aria-live="polite"
        >
          <p className="text-sm font-medium leading-7 text-white/90 sm:text-base">{activeLine.text}</p>
        </motion.div>
        <div className="mt-3 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.26em] text-white/35">
          <span className="h-px w-8 bg-white/15" />
          <span>{isArabic ? 'ذكاء تسويقي' : 'MARKETING INTELLIGENCE'}</span>
          <span className="h-px w-8 bg-white/15" />
          <button
            type="button"
            onClick={toggleVoice}
            className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-cyan-100/75 transition-all duration-200 hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-cyan-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            aria-label={voiceEnabled ? (isArabic ? 'إيقاف صوت الروبوت' : 'Mute robot voice') : (isArabic ? 'تشغيل صوت الروبوت' : 'Enable robot voice')}
            aria-pressed={voiceEnabled}
            title={voiceEnabled ? (isArabic ? 'إيقاف الصوت' : 'Mute voice') : (isArabic ? 'تشغيل الصوت' : 'Enable voice')}
          >
            {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
