'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface IntroTextProps {
  progress: number;
  exiting: boolean;
}

const systemMessages = [
  'INITIALIZING AI CORE...',
  'ANALYZING MARKET SIGNALS...',
  'MARKET INTELLIGENCE ONLINE',
];

export default function IntroText({ progress, exiting }: IntroTextProps) {
  const messageIndex = progress < 0.26 ? 0 : progress < 0.6 ? 1 : 2;
  const markReveal = Math.max(0, Math.min(1, (progress - 0.4) / 0.32));
  const wordmarkReveal = Math.max(0, Math.min(1, (progress - 0.62) / 0.2));
  const taglineReveal = Math.max(0, Math.min(1, (progress - 0.73) / 0.18));

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-white">
      <div className="relative flex w-full max-w-3xl flex-col items-center">
        <motion.div
          className="mb-8 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.44em] text-cyan-100/55 sm:text-[10px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? -12 : 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="h-px w-8 bg-cyan-200/35 sm:w-12" />
          <AnimatePresence mode="wait">
            <motion.span
              key={systemMessages[messageIndex]}
              initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
              transition={{ duration: 0.42 }}
            >
              {systemMessages[messageIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="h-px w-8 bg-cyan-200/35 sm:w-12" />
        </motion.div>

        <motion.div
          className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-100/40 bg-white/[0.045] shadow-[0_0_80px_rgba(47,189,255,0.25),inset_0_0_35px_rgba(255,255,255,0.05)] backdrop-blur-sm sm:h-28 sm:w-28"
          initial={{ opacity: 0, scale: 0.92, rotate: -5 }}
          animate={{
            opacity: exiting ? 0 : markReveal,
            scale: exiting ? 1.08 : 0.98 + markReveal * 0.02,
            rotate: exiting ? 4 : 0,
          }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="absolute inset-2 rounded-[22px] border border-cyan-200/10" />
          <span className="bg-gradient-to-br from-white via-cyan-100 to-cyan-400 bg-clip-text text-6xl font-black tracking-[-0.12em] text-transparent sm:text-7xl">M</span>
          <span className="absolute -inset-5 rounded-[36px] border border-cyan-200/10" />
        </motion.div>

        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0, y: 24, filter: 'blur(9px)' }}
          animate={{
            opacity: exiting ? 0 : wordmarkReveal,
            y: exiting ? -20 : (1 - wordmarkReveal) * 24,
            filter: exiting ? 'blur(8px)' : `blur(${(1 - wordmarkReveal) * 9}px)`,
          }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="text-3xl font-semibold tracking-[0.28em] text-white sm:text-5xl sm:tracking-[0.42em]">
            MARKETRA <span className="text-cyan-300">AI</span>
          </h1>
        </motion.div>

        <motion.p
          className="mt-4 text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-100/55 sm:text-xs sm:tracking-[0.42em]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: exiting ? 0 : taglineReveal, y: exiting ? -12 : (1 - taglineReveal) * 12 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          AI-POWERED MARKETING INTELLIGENCE
        </motion.p>

        <motion.div
          className="mt-10 flex w-52 items-center gap-3 sm:w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 0.7 }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        >
          <div className="h-px flex-1 bg-white/10" />
          <div className="h-px w-20 overflow-hidden bg-white/10 sm:w-28">
            <motion.div className="h-full origin-left bg-gradient-to-r from-cyan-400 to-blue-400" animate={{ scaleX: Math.max(0.04, progress) }} />
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </motion.div>
      </div>
    </div>
  );
}
