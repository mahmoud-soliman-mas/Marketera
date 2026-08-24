'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroText from './IntroText';
import RobotSpeech from './RobotSpeech';
import { CAMPAIGN_DURATION_MS, ROBOT_DURATION_MS } from './intro-constants';

const MarketingScene = dynamic(() => import('./MarketingScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#020712]" aria-hidden="true" />,
});

const RobotScene = dynamic(() => import('./RobotScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#030914]" aria-hidden="true" />,
});

interface IntroProps {
  onFinish: () => void;
}

type IntroStage = 'campaign' | 'robot';

export default function Intro({ onFinish }: IntroProps) {
  const campaignProgressRef = useRef(0);
  const robotProgressRef = useRef(0);
  const finishRequestedRef = useRef(false);
  const [stage, setStage] = useState<IntroStage>('campaign');
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [robotProgress, setRobotProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener?.('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener?.('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (stage !== 'campaign') return;
    let frame = 0;
    const syncCampaign = () => {
      const nextProgress = campaignProgressRef.current;
      setCampaignProgress(nextProgress);
      if (nextProgress >= 1) {
        setStage('robot');
        robotProgressRef.current = 0;
      } else {
        frame = window.requestAnimationFrame(syncCampaign);
      }
    };
    frame = window.requestAnimationFrame(syncCampaign);
    return () => window.cancelAnimationFrame(frame);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'robot') return;
    let frame = 0;
    const syncRobot = () => {
      const nextProgress = robotProgressRef.current;
      setRobotProgress(nextProgress);
      if (nextProgress >= 1) {
        frame = window.requestAnimationFrame(syncRobot);
      } else {
        frame = window.requestAnimationFrame(syncRobot);
      }
    };
    frame = window.requestAnimationFrame(syncRobot);
    return () => window.cancelAnimationFrame(frame);
  }, [stage]);

  const finish = useCallback(() => {
    if (finishRequestedRef.current) return;
    finishRequestedRef.current = true;
    setExiting(true);
    window.setTimeout(onFinish, reducedMotion ? 120 : 720);
  }, [onFinish, reducedMotion]);

  useEffect(() => {
    if (stage !== 'robot' || robotProgress < 0.995 || finishRequestedRef.current) return;
    const timer = window.setTimeout(finish, reducedMotion ? 80 : 480);
    return () => window.clearTimeout(timer);
  }, [finish, reducedMotion, robotProgress, stage]);

  const isRobotSpeaking = (robotProgress >= 0.08 && robotProgress < 0.43) || (robotProgress >= 0.47 && robotProgress < 0.86) || robotProgress >= 0.87;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.section
          key="marketra-intro"
          className="fixed inset-0 z-[9999] isolate overflow-hidden bg-[#020712] text-white"
          role="dialog"
          aria-label="Marketera AI marketing campaign introduction"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
          transition={{ duration: reducedMotion ? 0.12 : 0.72, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(27,122,196,0.15),transparent_27%,rgba(0,0,0,0.44)_77%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(4,10,24,0.52),transparent_42%,rgba(7,35,60,0.24))]" />

          <AnimatePresence mode="wait">
            {stage === 'campaign' ? (
              <motion.div key="campaign-scene" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0.1 : 0.45 }}>
                <MarketingScene progressRef={campaignProgressRef} reducedMotion={reducedMotion} />
              </motion.div>
            ) : (
              <motion.div key="robot-scene" className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0.1 : 0.8, ease: [0.23, 1, 0.32, 1] }}>
                <RobotScene progressRef={robotProgressRef} speaking={isRobotSpeaking} reducedMotion={reducedMotion} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,rgba(220,252,255,0.95),rgba(70,198,255,0.32)_17%,transparent_52%)] mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'robot' ? [0, 0.9, 0] : 0 }}
            transition={{ duration: reducedMotion ? 0.18 : 0.95, times: [0, 0.35, 1], ease: 'easeOut' }}
          />

          {stage === 'campaign' ? (
            <IntroText progress={campaignProgress} exiting={exiting} />
          ) : (
            <>
              <motion.div className="absolute left-6 top-6 z-10 flex items-center gap-3 sm:left-9 sm:top-8" initial={{ opacity: 0, y: -8 }} animate={{ opacity: exiting ? 0 : 1, y: 0 }} transition={{ duration: 0.55 }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100/30 bg-white/[0.06] text-lg font-black text-cyan-100 shadow-[0_0_30px_rgba(55,208,255,0.22)]">M</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/72 sm:text-xs">MARKETERA AI</span>
              </motion.div>
              <motion.div className="absolute right-6 top-7 z-10 text-right sm:right-9 sm:top-9" initial={{ opacity: 0, x: 8 }} animate={{ opacity: exiting ? 0 : 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
                <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-cyan-100/60 sm:text-[10px]">AI MARKETING ASSISTANT</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/25">CAMPAIGN INTELLIGENCE ONLINE</p>
              </motion.div>
              <RobotSpeech progressRef={robotProgressRef} reducedMotion={reducedMotion} />
            </>
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
            <span className="text-cyan-200/45">MRK</span> / {stage === 'campaign' ? 'CAMPAIGN SYSTEM' : 'ASSISTANT SYSTEM'}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
