'use client';

import { useState, useCallback } from 'react';
import { Loader2, Sparkles, AlertTriangle, Copy, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/settings';
import { useI18n } from '@/lib/i18n';
import { toast } from 'sonner';
import { SectionCard } from '@/components/section-card';
import { ScrollReveal } from '@/components/visual/scroll-reveal';
import { SmartPromptControls } from '@/components/smart-prompt-controls';
import { AnalysisPanel } from '@/components/analysis/analysis-panel';
import {
  optimizeHook, rewriteText, generateCtas, improveHeadline,
} from '@/lib/analysis/service';
import { REWRITE_STYLES } from '@/lib/analysis/types';
import type {
  HookOptimizerResult, RewriteResult, CtaGeneratorResult, HeadlineImproverResult,
} from '@/lib/analysis/types';

interface AiToolsViewProps {
  toolId: 'hook-optimizer' | 'ai-rewrite' | 'cta-generator' | 'headline-improver';
}

export function AiToolsView({ toolId }: AiToolsViewProps) {
  const { settings } = useSettings();
  const { language, t } = useI18n();
  const isAr = language === 'ar';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewriteStyle, setRewriteStyle] = useState('professional');

  const [optimizerResult, setOptimizerResult] = useState<HookOptimizerResult | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [ctaResult, setCtaResult] = useState<CtaGeneratorResult | null>(null);
  const [headlineResult, setHeadlineResult] = useState<HeadlineImproverResult | null>(null);

  const run = useCallback(async () => {
    if (!input.trim()) {
      setError(isAr ? 'يرجى إدخال محتوى أولاً.' : 'Please enter some content first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      switch (toolId) {
        case 'hook-optimizer':
          setOptimizerResult(await optimizeHook(input.trim(), undefined, isAr ? 'ar' : 'en', settings.creativity));
          break;
        case 'ai-rewrite':
          setRewriteResult(await rewriteText(input.trim(), rewriteStyle, isAr ? 'ar' : 'en', settings.creativity));
          break;
        case 'cta-generator':
          setCtaResult(await generateCtas(input.trim(), undefined, isAr ? 'ar' : 'en', settings.creativity));
          break;
        case 'headline-improver':
          setHeadlineResult(await improveHeadline(input.trim(), isAr ? 'ar' : 'en', settings.creativity));
          break;
      }
      toast.success(isAr ? 'تم!' : 'Done!');
    } catch (e) {
      setError(isAr ? 'فشل. حاول مرة أخرى.' : 'Failed. Try again.');
    } finally {
      setLoading(false);
    }
  }, [input, toolId, rewriteStyle, isAr, settings.creativity]);

  const titles: Record<string, { en: string; ar: string; desc: { en: string; ar: string }; placeholder: { en: string; ar: string } }> = {
    'hook-optimizer': {
      en: 'AI Hook Optimizer',
      ar: 'محسّن العناوين',
      desc: { en: 'Improve your existing hooks for more impact', ar: 'حسّن عناوينك الموجودة لمزيد من التأثير' },
      placeholder: { en: 'Paste your hook here...', ar: 'الصق العنوان هنا...' },
    },
    'ai-rewrite': {
      en: 'AI Rewrite',
      ar: 'إعادة الكتابة',
      desc: { en: 'Rewrite text in 8 different styles', ar: 'أعد كتابة النص بـ 8 أساليب مختلفة' },
      placeholder: { en: 'Paste your text here...', ar: 'الصق النص هنا...' },
    },
    'cta-generator': {
      en: 'CTA Generator',
      ar: 'مولد الدعوات للعمل',
      desc: { en: 'Generate multiple CTA styles in seconds', ar: 'أنشئ عدة أساليب دعوات للعمل بثواني' },
      placeholder: { en: 'Describe your product or offer...', ar: 'صف منتجك أو عرضك...' },
    },
    'headline-improver': {
      en: 'Headline Improver',
      ar: 'محسّن العناوين الرئيسية',
      desc: { en: 'Improve headlines with 5 angle variants', ar: 'حسّن العناوين بـ 5 زوايا مختلفة' },
      placeholder: { en: 'Paste your headline here...', ar: 'الصق العنوان الرئيسي هنا...' },
    },
  };

  const meta = titles[toolId];
  const title = isAr ? meta.ar : meta.en;
  const desc = isAr ? meta.desc.ar : meta.desc.en;
  const placeholder = isAr ? meta.placeholder.ar : meta.placeholder.en;

  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <ScrollReveal>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <SectionCard>
          <div className="flex flex-col gap-3">
            <textarea
              value={input}
              dir={isAr ? 'rtl' : 'ltr'}
              onChange={(e) => { setInput(e.target.value); if (error) setError(null); }}
              placeholder={placeholder}
              rows={4}
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-border bg-card/60 p-4 text-[15px] text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
            />

            {toolId === 'ai-rewrite' && (
              <div className="flex flex-wrap gap-2">
                {REWRITE_STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setRewriteStyle(s.id)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                      rewriteStyle === s.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-primary'
                    )}
                  >
                    {isAr ? s.labelAr : s.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <SmartPromptControls />
              <button
                type="button"
                onClick={run}
                disabled={loading}
                className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-cyan-500 px-6 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? (isAr ? 'جاري...' : 'Working...') : (isAr ? 'استخدم الذكاء' : 'Run AI')}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </SectionCard>
      </ScrollReveal>

      {/* Results */}
      {optimizerResult && (
        <ScrollReveal delay={150}>
          <div className="mt-6 space-y-4">
            <ResultCard label={isAr ? 'النسخ المحسّنة' : 'Optimized Variants'} items={optimizerResult.optimizedHooks} isAr={isAr} />
            <ResultCard label={isAr ? 'التحسينات' : 'Improvements'} items={optimizerResult.improvements} isAr={isAr} icon />
            <div className="rounded-2xl glass p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{isAr ? 'تحليل' : 'Analysis'}</p>
              <AnalysisPanel content={optimizerResult.optimizedHooks[0] || input} lang={isAr ? 'ar' : 'en'} />
            </div>
          </div>
        </ScrollReveal>
      )}

      {rewriteResult && (
        <ScrollReveal delay={150}>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl glass-strong p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{isAr ? 'النص المعاد كتابته' : 'Rewritten Text'}</p>
              <p className="text-[15px] leading-relaxed text-foreground" dir={isAr ? 'rtl' : 'ltr'}>{rewriteResult.rewritten}</p>
            </div>
            <ResultCard label={isAr ? 'التغييرات' : 'Changes Made'} items={rewriteResult.changes} isAr={isAr} icon />
          </div>
        </ScrollReveal>
      )}

      {ctaResult && (
        <ScrollReveal delay={150}>
          <div className="mt-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {ctaResult.ctas.map((cta, i) => (
                <CtaCard key={i} cta={cta} isAr={isAr} index={i} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {headlineResult && (
        <ScrollReveal delay={150}>
          <div className="mt-6 space-y-3">
            {headlineResult.improvedHeadlines.map((h, i) => (
              <HeadlineCard key={i} headline={h} isAr={isAr} index={i} />
            ))}
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}

function ResultCard({ label, items, isAr, icon }: { label: string; items: string[]; isAr: boolean; icon?: boolean }) {
  return (
    <div className="rounded-2xl glass p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
            {icon ? (
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
            ) : (
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
            )}
            <span dir={isAr ? 'rtl' : 'ltr'}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CtaCard({ cta, isAr, index }: { cta: { text: string; style: string; reason: string }; isAr: boolean; index: number }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cta.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="group rounded-2xl glass p-4 card-hover hover:shadow-[0_8px_24px_hsl(var(--primary)/0.1)] animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">{cta.style}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
          aria-label={isAr ? 'نسخ' : 'Copy'}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-foreground" dir={isAr ? 'rtl' : 'ltr'}>{cta.text}</p>
      <p className="mt-1.5 text-xs text-muted-foreground">{cta.reason}</p>
    </div>
  );
}

function HeadlineCard({ headline, isAr, index }: { headline: { text: string; angle: string; improvement: string }; isAr: boolean; index: number }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(headline.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="group rounded-2xl glass p-4 card-hover hover:shadow-[0_8px_24px_hsl(var(--primary)/0.1)] animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-500">{headline.angle}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
          aria-label={isAr ? 'نسخ' : 'Copy'}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-foreground" dir={isAr ? 'rtl' : 'ltr'}>{headline.text}</p>
      <p className="mt-1.5 text-xs text-muted-foreground">{headline.improvement}</p>
    </div>
  );
}
