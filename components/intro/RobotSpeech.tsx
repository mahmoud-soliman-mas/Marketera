'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { clamp01 } from './intro-constants';

interface RobotSpeechProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

type SpeechLine = {
  start: number;
  end: number;
  arabic: string;
  english: string;
  lang: 'ar-SA' | 'en-US';
};

const SPEECH_LINES: SpeechLine[] = [
  {
    start: 0.08,
    end: 0.23,
    arabic: 'مرحبًا بك في Marketera، مساعدك الذكي للتسويق الرقمي.',
    english: 'Welcome to Marketera, your intelligent digital marketing assistant.',
    lang: 'ar-SA',
  },
  {
    start: 0.23,
    end: 0.43,
    arabic: 'أساعدك على فهم بياناتك وتحليل جمهورك.',
    english: "I help you understand your data and analyze your audience.",
    lang: 'ar-SA',
  },
  {
    start: 0.47,
    end: 0.65,
    arabic: 'وأحسّن حملاتك التسويقية باستخدام الذكاء الاصطناعي.',
    english: 'Then I optimize your marketing campaigns with AI.',
    lang: 'en-US',
  },
  {
    start: 0.65,
    end: 0.86,
    arabic: 'من الفكرة إلى القرار الذكي.',
    english: 'From idea to intelligent decision.',
    lang: 'en-US',
  },
  {
    start: 0.87,
    end: 1,
    arabic: 'لنبدأ.',
    english: "Let's get started.",
    lang: 'en-US',
  },
];

export default function RobotSpeech({ progressRef, reducedMotion = false }: RobotSpeechProps) {
  const [progress, setProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const activeLine = useMemo(() => {
    const current = SPEECH_LINES.find((line) => progress >= line.start && progress < line.end);
    return current || SPEECH_LINES[SPEECH_LINES.length - 1];
  }, [progress]);

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
      if (cancelled || index >= SPEECH_LINES.length) return;
      const line = SPEECH_LINES[index];
      const utterance = new SpeechSynthesisUtterance(line.lang === 'ar-SA' ? line.arabic : line.english);
      utterance.lang = line.lang;
      utterance.rate = line.lang === 'ar-SA' ? 0.92 : 0.96;
      utterance.pitch = 0.96;
      utterance.onend = () => {
        index += 1;
        speakNext();
      };
      synthesis.speak(utterance);
    };

    synthesis.cancel();
    speakNext();
    return () => {
      cancelled = true;
      synthesis.cancel();
    };
  }, [voiceEnabled]);

  const toggleVoice = () => {
    if (!('speechSynthesis' in window)) return;
    setVoiceEnabled((enabled) => !enabled);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-5 sm:bottom-12">
      <div className="pointer-events-auto flex w-full max-w-xl flex-col items-center">
        <motion.div
          key={`${activeLine.arabic}-${activeLine.english}`}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: reducedMotion ? 0.1 : 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-2xl border border-white/12 bg-[#071529]/72 px-5 py-3 text-center shadow-[0_18px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          dir="rtl"
          aria-live="polite"
        >
          <p className="text-sm font-medium leading-7 text-white/90 sm:text-base">{activeLine.arabic}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-cyan-100/55 sm:text-xs" dir="ltr">{activeLine.english}</p>
        </motion.div>
        <div className="mt-3 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.26em] text-white/35">
          <span className="h-px w-8 bg-white/15" />
          <span>MARKETING INTELLIGENCE</span>
          <span className="h-px w-8 bg-white/15" />
          <button
            type="button"
            onClick={toggleVoice}
            className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-cyan-100/75 transition-all duration-200 hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-cyan-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            aria-label={voiceEnabled ? 'Mute robot voice' : 'Enable robot voice'}
            title={voiceEnabled ? 'Mute robot voice' : 'Enable robot voice'}
          >
            {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
