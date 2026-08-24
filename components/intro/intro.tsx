'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroText from './IntroText';
import { INTRO_DURATION_MS } from './intro-constants';

const CinematicScene = dynamic(() => import('./CinematicScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#01040b]" aria-hidden="true" />,
});

interface IntroProps {
  onFinish: () => void;
}

export default function Intro({ onFinish }: IntroProps) {
  const progressRef = useRef(0);
  const finishRequestedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener?.('change', updateMotionPreference);

    let frame = 0;
    const syncProgress = () => {
      setProgress(progressRef.current);
      frame = window.requestAnimationFrame(syncProgress);
    };
    frame = window.requestAnimationFrame(syncProgress);

    return () => {
      window.cancelAnimationFrame(frame);
      mediaQuery.removeEventListener?.('change', updateMotionPreference);
    };
  }, []);

  const finish = useCallback(() => {
    if (finishRequestedRef.current) return;
    finishRequestedRef.current = true;
    setExiting(true);
    window.setTimeout(onFinish, reducedMotion ? 120 : 720);
  }, [onFinish, reducedMotion]);

  useEffect(() => {
    const timer = window.setTimeout(finish, INTRO_DURATION_MS + 380);
    return () => window.clearTimeout(timer);
  }, [finish]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.section
          key="marketra-intro"
          className="fixed inset-0 z-[9999] isolate overflow-hidden bg-[#01040b] text-white"
          role="dialog"
          aria-label="Marketra AI introduction"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
          transition={{ duration: reducedMotion ? 0.12 : 0.72, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(27,122,196,0.12),transparent_27%,rgba(0,0,0,0.4)_74%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(4,10,24,0.46),transparent_42%,rgba(7,35,60,0.22))]" />

          <div className="absolute inset-0" aria-hidden="true">
            <CinematicScene progressRef={progressRef} reducedMotion={reducedMotion} />
          </div>

          <IntroText progress={progress} exiting={exiting} />

          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,250,255,0.72),rgba(37,183,255,0.2)_18%,transparent_48%)] mix-blend-screen"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: progress > 0.78 ? Math.max(0, 1 - (progress - 0.78) / 0.22) * 0.28 : 0,
              scale: progress > 0.78 ? 0.8 + (progress - 0.78) * 6 : 0.5,
            }}
            transition={{ duration: 0.18 }}
          />

          <button
            type="button"
            onClick={finish}
            className="pointer-events-auto absolute bottom-6 right-6 rounded-full border border-white/15 bg-white/[0.055] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-white/55 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-200 hover:border-cyan-200/40 hover:bg-cyan-200/10 hover:text-cyan-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:bottom-8 sm:right-8 sm:px-5 sm:py-2.5"
            aria-label="Skip Marketra AI introduction"
          >
            Skip Intro <span aria-hidden="true" className="ml-1 text-cyan-200/80">→</span>
          </button>

          <div className="pointer-events-none absolute bottom-7 left-6 text-left text-[9px] uppercase tracking-[0.32em] text-white/25 sm:bottom-9 sm:left-8">
            <span className="text-cyan-200/45">MRK</span> / SYSTEM ONLINE
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
