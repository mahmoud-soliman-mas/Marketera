'use client';

import { useState, useCallback } from 'react';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/settings';
import { useI18n } from '@/lib/i18n';
import { toast } from 'sonner';
import { SectionCard } from '@/components/section-card';
import { ScrollReveal } from '@/components/visual/scroll-reveal';
import { SmartPromptControls } from '@/components/smart-prompt-controls';
import { AnalysisPanel } from '@/components/analysis/analysis-panel';

interface AnalysisToolViewProps {
  toolId: 'viral-score' | 'engagement-prediction' | 'emotional-analyzer' | 'readability-score' | 'persuasion-score';
}

export function AnalysisToolView({ toolId }: AnalysisToolViewProps) {
  const { settings } = useSettings();
  const { language } = useI18n();
  const isAr = language === 'ar';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);

  const run = useCallback(async () => {
    if (!input.trim()) {
      setError(isAr ? 'يرجى إدخال محتوى أولاً.' : 'Please enter some content first.');
      return;
    }
    setLoading(true);
    setError(null);
    setHasResult(false);
    try {
      // The AnalysisPanel handles the actual API call based on its internal tab state.
      // Here we just trigger the result display.
      setHasResult(true);
      toast.success(isAr ? 'جاري التحليل...' : 'Analyzing...');
    } catch {
      setError(isAr ? 'فشل. حاول مرة أخرى.' : 'Failed. Try again.');
    } finally {
      setLoading(false);
    }
  }, [input, isAr]);

  const titles: Record<string, { en: string; ar: string; desc: { en: string; ar: string }; placeholder: { en: string; ar: string }; defaultTab: string }> = {
    'viral-score': {
      en: 'AI Viral Score',
      ar: 'النتيجة الفيروسية',
      desc: { en: 'Score any hook from 0-100 with detailed breakdown', ar: 'قيّم أي عنوان من 0-100 مع تفصيل كامل' },
      placeholder: { en: 'Paste your hook or content here...', ar: 'الصق العنوان أو المحتوى هنا...' },
      defaultTab: 'viral',
    },
    'engagement-prediction': {
      en: 'Engagement Prediction',
      ar: 'التنبؤ بالتفاعل',
      desc: { en: 'Predict CTR, engagement & scroll stop rate', ar: 'تنبأ بـ CTR والتفاعل ومعدل الإيقاف' },
      placeholder: { en: 'Paste your content here...', ar: 'الصق المحتوى هنا...' },
      defaultTab: 'engagement',
    },
    'emotional-analyzer': {
      en: 'Emotional Analyzer',
      ar: 'محلل العواطف',
      desc: { en: 'Analyze curiosity, trust, fear, excitement, urgency & FOMO', ar: 'حلل الفضول والثقة والخوف والحماس والإلحاح و FOMO' },
      placeholder: { en: 'Paste your content here...', ar: 'الصق المحتوى هنا...' },
      defaultTab: 'emotional',
    },
    'readability-score': {
      en: 'Readability Score',
      ar: 'قابلية القراءة',
      desc: { en: 'Assess clarity, grade level & reading time', ar: 'قيّم الوضوح ومستوى القراءة ووقت القراءة' },
      placeholder: { en: 'Paste your content here...', ar: 'الصق المحتوى هنا...' },
      defaultTab: 'readability',
    },
    'persuasion-score': {
      en: 'Persuasion Score',
      ar: 'درجة الإقناع',
      desc: { en: 'Score ethos, pathos, logos & CTA strength', ar: 'قيّم المصداقية والعاطفة والمنطق وقوة الدعوة' },
      placeholder: { en: 'Paste your content here...', ar: 'الصق المحتوى هنا...' },
      defaultTab: 'persuasion',
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

            <div className="flex items-center justify-between gap-3">
              <SmartPromptControls />
              <button
                type="button"
                onClick={run}
                disabled={loading || !input.trim()}
                className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-cyan-500 px-6 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? (isAr ? 'جاري...' : 'Analyzing...') : (isAr ? 'حلل' : 'Analyze')}
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

      {hasResult && input.trim() && (
        <ScrollReveal delay={150}>
          <div className="mt-6">
            <AnalysisPanel content={input.trim()} lang={isAr ? 'ar' : 'en'} />
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
