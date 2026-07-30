'use client';

import { useState, useCallback } from 'react';
import {
  Check, Copy, Heart, Sparkles, ChevronDown, Zap, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceOutputButton } from '@/components/voice/voice-buttons';
import { AnalysisPanel } from '@/components/analysis/analysis-panel';
import { useSettings } from '@/lib/settings';
import { getViralScore } from '@/lib/analysis/service';
import type { ViralScoreResult } from '@/lib/analysis/types';

interface HookCardProps {
  hook: string;
  index: number;
  rtl?: boolean;
  lang?: 'ar' | 'en';
  isFavorite?: boolean;
  onToggleFavorite?: (hook: string) => void;
  isBest?: boolean;
}

export function HookCard({ hook, index, rtl = false, lang = 'en', isFavorite, onToggleFavorite, isBest }: HookCardProps) {
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [score, setScore] = useState<ViralScoreResult | null>(null);
  const [scoring, setScoring] = useState(false);

  const isAr = lang === 'ar';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleScore = useCallback(async () => {
    if (score) {
      setExpanded((e) => !e);
      return;
    }
    setScoring(true);
    try {
      const result = await getViralScore(hook, lang, settings.creativity);
      setScore(result);
      setExpanded(true);
    } catch {
      setScore(null);
    } finally {
      setScoring(false);
    }
  }, [hook, lang, settings.creativity, score]);

  const scoreColor = score
    ? score.score >= 80
      ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
      : score.score >= 60
      ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
      : 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'
    : '';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl glass p-5',
        'card-hover hover:shadow-[0_8px_24px_hsl(var(--primary)/0.1)]',
        'animate-fade-in-up',
        isBest && 'ring-2 ring-primary/40'
      )}
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {isBest && (
        <div className="absolute -top-px left-4 flex items-center gap-1 rounded-b-lg bg-gradient-to-r from-primary to-cyan-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          <Sparkles className="h-2.5 w-2.5" />
          {isAr ? 'الأفضل' : 'Best'}
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Index badge */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-400 text-sm font-bold text-white shadow-sm">
          {index + 1}
        </div>

        {/* Text */}
        <p
          dir={rtl ? 'rtl' : 'ltr'}
          className={cn('flex-1 pt-1.5 text-[15px] font-medium leading-relaxed text-foreground', rtl && 'text-right')}
        >
          {hook}
        </p>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          {/* Viral score badge / button */}
          {score && (
            <span className={cn('flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-bold', scoreColor)}>
              <Zap className="h-3 w-3" />
              {score.score}
            </span>
          )}
          <button
            type="button"
            onClick={handleScore}
            disabled={scoring}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/50 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
            title={isAr ? 'النتيجة الفيروسية' : 'Viral score'}
            aria-label={isAr ? 'النتيجة الفيروسية' : 'Viral score'}
          >
            {scoring ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
          </button>

          {/* Favorite */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(hook)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl border transition-all',
                isFavorite
                  ? 'border-rose-200 bg-rose-50 text-rose-500 dark:bg-rose-900/20 dark:border-rose-800'
                  : 'border-border bg-card/50 text-muted-foreground hover:border-rose-300 hover:text-rose-500'
              )}
              title={isAr ? 'مفضلة' : 'Favorite'}
              aria-label={isAr ? 'مفضلة' : 'Favorite'}
            >
              <Heart className={cn('h-3.5 w-3.5', isFavorite && 'fill-current')} />
            </button>
          )}

          {/* Voice */}
          <VoiceOutputButton text={hook} lang={lang} />

          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={isAr ? 'نسخ' : 'Copy hook'}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold transition-all duration-200',
              copied
                ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800'
                : 'border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
            )}
          >
            {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable analysis */}
      {expanded && score && (
        <div className="mt-4 animate-fade-in">
          <AnalysisPanel content={hook} lang={lang} />
        </div>
      )}

      {/* Expand toggle */}
      {score && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 flex w-full items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
          {expanded ? (isAr ? 'إخفاء التحليل' : 'Hide analysis') : (isAr ? 'عرض التحليل' : 'Show analysis')}
        </button>
      )}
    </div>
  );
}
