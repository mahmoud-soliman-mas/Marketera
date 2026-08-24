'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import type { Language } from '@/lib/translations';
import LanguageSelector from './LanguageSelector';
import RobotSpeech from './RobotSpeech';
import { ROBOT_DURATION_MS } from './intro-constants';

const RobotScene = dynamic(() => import('./RobotScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#030914]" aria-hidden="true" />,
});

interface IntroProps {
  onFinish: () => void;
}

export default function Intro({ onFinish }: IntroProps) {
  const { language, setLanguage } = useI18n();
  const robotProgressRef = useRef(0);
  const finishRequestedRef = useRef(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [started, setStarted] = useState(false);
  const [robotProgress, setRobotProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!started) setSelectedLanguage(language);
  }, [language, started]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener?.('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener?.('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const syncRobot = () => {
      const nextProgress = robotProgressRef.current;
      setRobotProgress(nextProgress);
      frame = window.requestAnimationFrame(syncRobot);
    };
    frame = window.requestAnimationFrame(syncRobot);
    return () => window.cancelAnimationFrame(frame);
  }, [started]);

  const finish = useCallback(() => {
    if (finishRequestedRef.current) return;
    finishRequestedRef.current = true;
    setExiting(true);
    window.setTimeout(onFinish, reducedMotion ? 100 : 680);
  }, [onFinish, reducedMotion]);

  useEffect(() => {
    if (!started || robotProgress < 0.995 || finishRequestedRef.current) return;
    const timer = window.setTimeout(finish, reducedMotion ? 70 : 780);
    return () => window.clearTimeout(timer);
  }, [finish, reducedMotion, robotProgress, started]);

  const startAssistant = () => {
    setLanguage(selectedLanguage);
    robotProgressRef.current = 0;
    setRobotProgress(0);
    setStarted(true);
  };

  const isRobotSpeaking = (robotProgress >= 0.06 && robotProgress < 0.43) || (robotProgress >= 0.47 && robotProgress < 0.86) || robotProgress >= 0.87;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.section
          key="marketera-robot-intro"
          className="fixed inset-0 z-[9999] isolate overflow-hidden bg-[#030914] text-white"
          role="dialog"
          aria-label="Marketera AI assistant welcome"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.035, filter: 'blur(12px)' }}
          transition={{ duration: reducedMotion ? 0.1 : 0.68, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(30,126,184,0.18),transparent_28%,rgba(0,0,0,0.5)_78%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(4,10,24,0.42),transparent_42%,rgba(8,35,58,0.3))]" />

          <AnimatePresence mode="wait">
            {started ? (
              <motion.div key="robot-scene" className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reducedMotion ? 0.1 : 0.9, ease: [0.23, 1, 0.32, 1] }}>
                <RobotScene progressRef={robotProgressRef} speaking={isRobotSpeaking} reducedMotion={reducedMotion} playing />
              </motion.div>
            ) : (
              <motion.div key="language-scene" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0.1 : 0.45 }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(34,177,219,0.13),transparent_22%)]" />
                <div className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full border border-cyan-100/10 shadow-[0_0_100px_rgba(63,212,255,0.13)]" />
                <div className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 scale-75 rounded-full border border-violet-200/10" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(2,9,19,0.8),transparent)]" />
              </motion.div>
            )}
          </AnimatePresence>

          {started ? (
            <>
              <motion.div className="absolute left-6 top-6 z-10 flex items-center gap-3 sm:left-9 sm:top-8" initial={{ opacity: 0, y: -8 }} animate={{ opacity: exiting ? 0 : 1, y: 0 }} transition={{ duration: 0.55 }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100/30 bg-white/[0.06] text-lg font-black text-cyan-100 shadow-[0_0_30px_rgba(55,208,255,0.22)]">M</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/72 sm:text-xs">MARKETERA AI</span>
              </motion.div>
              <motion.div className="absolute right-6 top-7 z-10 text-right sm:right-9 sm:top-9" initial={{ opacity: 0, x: 8 }} animate={{ opacity: exiting ? 0 : 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
                <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-cyan-100/60 sm:text-[10px]">AI MARKETING ASSISTANT</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/25">{selectedLanguage === 'ar' ? 'المساعد جاهز' : 'ASSISTANT ONLINE'}</p>
              </motion.div>
              <RobotSpeech progressRef={robotProgressRef} language={selectedLanguage} reducedMotion={reducedMotion} autoSpeak />
            </>
          ) : (
            <LanguageSelector value={selectedLanguage} onChange={setSelectedLanguage} onConfirm={startAssistant} reducedMotion={reducedMotion} />
          )}

          <button
            type="button"
            onClick={finish}
            className="pointer-events-auto absolute bottom-6 right-6 z-40 rounded-full border border-white/15 bg-white/[0.055] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-white/55 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-200 hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-cyan-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:bottom-8 sm:right-8 sm:px-5 sm:py-2.5"
            aria-label="Skip Marketera AI introduction"
          >
            Skip Intro <span aria-hidden="true" className="ml-1 text-cyan-200/80">→</span>
          </button>

          <div className="pointer-events-none absolute bottom-7 left-6 z-10 text-left text-[9px] uppercase tracking-[0.32em] text-white/25 sm:bottom-9 sm:left-8">
            <span className="text-cyan-200/45">MRK</span> / {started ? (selectedLanguage === 'ar' ? 'نظام المساعد' : 'ASSISTANT SYSTEM') : 'WELCOME SYSTEM'}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
