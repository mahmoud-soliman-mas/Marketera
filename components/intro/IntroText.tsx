'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface IntroTextProps {
  progress: number;
  exiting: boolean;
}

const STORY_STEPS = [
  { label: 'IDEA', detail: 'A campaign starts with a signal.' },
  { label: 'CONTENT', detail: 'Turn the idea into high-converting assets.' },
  { label: 'CAMPAIGN', detail: 'Launch the message across every channel.' },
  { label: 'AUDIENCE', detail: 'Read the people behind every interaction.' },
  { label: 'ANALYTICS', detail: 'Transform raw data into clarity.' },
  { label: 'AI INSIGHT', detail: 'Optimize the next decision intelligently.' },
];

const getStepIndex = (progress: number) => {
  if (progress < 0.17) return 0;
  if (progress < 0.36) return 1;
  if (progress < 0.54) return 2;
  if (progress < 0.7) return 3;
  if (progress < 0.86) return 4;
  return 5;
};

export default function IntroText({ progress, exiting }: IntroTextProps) {
  const stepIndex = getStepIndex(progress);
  const currentStep = STORY_STEPS[stepIndex];
  const showFinalLogo = progress > 0.91;
  const stageProgress = Math.min(1, progress / 0.91);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-white">
      <motion.div
        className="absolute left-6 top-6 flex items-center gap-3 sm:left-9 sm:top-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? -10 : 0 }}
        transition={{ duration: 0.55 }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100/30 bg-white/[0.06] text-lg font-black text-cyan-100 shadow-[0_0_30px_rgba(55,208,255,0.22)]">M</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/72 sm:text-xs">MARKETERA</span>
      </motion.div>

      <motion.div
        className="absolute right-6 top-7 text-right sm:right-9 sm:top-9"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: exiting ? 0 : 1, x: exiting ? 10 : 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-cyan-100/55 sm:text-[10px]">CAMPAIGN OS / 001</p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/25">DIGITAL MARKETING INTELLIGENCE</p>
      </motion.div>

      <div className="absolute inset-x-0 bottom-8 flex justify-center px-5 sm:bottom-10">
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: exiting ? 0 : showFinalLogo ? 0 : 1, y: exiting ? -16 : 0 }}
          transition={{ duration: 0.62, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-cyan-200/55">MARKETING CAMPAIGN / BUILDING</p>
              <AnimatePresence mode="wait">
                <motion.div key={currentStep.label} initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }} transition={{ duration: 0.32 }}>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[0.18em] text-white sm:text-3xl">{currentStep.label}</h2>
                  <p className="mt-1 max-w-md text-xs text-white/48 sm:text-sm">{currentStep.detail}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="pb-1 font-mono text-[10px] tracking-[0.2em] text-cyan-200/48">{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
          </div>
          <div className="mb-3 h-px w-full overflow-hidden bg-white/12">
            <motion.div className="h-full origin-left bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-300" animate={{ scaleX: stageProgress }} transition={{ duration: 0.18 }} />
          </div>
          <div className="flex items-center justify-between gap-1">
            {STORY_STEPS.map((step, index) => (
              <div key={step.label} className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <span className={`h-1.5 w-1.5 flex-none rounded-full transition-colors duration-300 ${index <= stepIndex ? 'bg-cyan-200 shadow-[0_0_10px_rgba(129,230,255,0.8)]' : 'bg-white/20'}`} />
                <span className={`hidden truncate text-[8px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 sm:block ${index === stepIndex ? 'text-white/70' : index < stepIndex ? 'text-cyan-200/42' : 'text-white/22'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {showFinalLogo && (
            <motion.div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center text-center" initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }} animate={{ opacity: exiting ? 0 : 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
              <p className="text-4xl font-semibold tracking-[0.24em] text-white sm:text-6xl sm:tracking-[0.38em]">MARKETERA</p>
              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.34em] text-cyan-100/65 sm:text-xs">AI-POWERED DIGITAL MARKETING</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
