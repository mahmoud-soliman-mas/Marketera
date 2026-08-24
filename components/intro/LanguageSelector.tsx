'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Languages } from 'lucide-react';
import type { Language } from '@/lib/translations';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  onConfirm: () => void;
  reducedMotion?: boolean;
}

export default function LanguageSelector({ value, onChange, onConfirm, reducedMotion = false }: LanguageSelectorProps) {
  const isArabic = value === 'ar';

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center px-5 py-20"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="w-full max-w-md rounded-[28px] border border-white/15 bg-[#061427]/78 p-6 text-center shadow-[0_24px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100/25 bg-cyan-100/[0.07] text-cyan-100 shadow-[0_0_45px_rgba(54,210,255,0.2)]">
          <Languages className="h-5 w-5" />
        </div>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-100/55">LANGUAGE / اللغة</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl" dir={isArabic ? 'rtl' : 'ltr'}>
          {isArabic ? 'اختر لغة Marketera' : 'Choose your Marketera language'}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/48" dir={isArabic ? 'rtl' : 'ltr'}>
          {isArabic ? 'هذا الخيار سيحدد لغة التطبيق ولغة حديث المساعد الذكي.' : 'This choice controls both the app interface and your AI assistant’s voice.'}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Choose application and assistant language">
          {([
            { code: 'ar' as const, name: 'العربية', sub: 'Arabic', direction: 'RTL' },
            { code: 'en' as const, name: 'English', sub: 'الإنجليزية', direction: 'LTR' },
          ]).map((option) => {
            const selected = value === option.code;
            return (
              <button
                key={option.code}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(option.code)}
                className={`group relative rounded-2xl border px-4 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${selected ? 'border-cyan-200/60 bg-cyan-100/[0.12] shadow-[0_0_35px_rgba(66,213,255,0.12)]' : 'border-white/12 bg-white/[0.035] hover:border-white/30 hover:bg-white/[0.07]'}`}
              >
                <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition-all ${selected ? 'border-cyan-100/70 bg-cyan-100 text-[#05203a]' : 'border-white/20 text-transparent'}`}>
                  <Check className="h-3 w-3" />
                </span>
                <span className="block text-lg font-semibold text-white" dir={option.code === 'ar' ? 'rtl' : 'ltr'}>{option.name}</span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.15em] text-white/35">{option.sub} · {option.direction}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-cyan-100/35 bg-cyan-100/[0.11] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-50 transition-all duration-300 hover:border-cyan-100/60 hover:bg-cyan-100/[0.18] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {isArabic ? 'متابعة إلى المساعد' : 'Continue to assistant'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="mt-4 text-[9px] uppercase tracking-[0.22em] text-white/25">ONE LANGUAGE · ONE INTELLIGENT EXPERIENCE</p>
      </div>
    </motion.div>
  );
}
