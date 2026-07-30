'use client';

import { useState, useCallback, useEffect } from 'react';
import { Loader2, Sparkles, Wand2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { HookCard } from '@/components/hook-card';
import { ErrorBanner } from '@/components/error-banner';
import { SkeletonList } from '@/components/skeletons';
import { VoiceInputButton, VoiceOutputButton, ToolHelpButton } from '@/components/voice/voice-buttons';
import { ConfettiBurst } from '@/components/visual/confetti-burst';
import { useSettings } from '@/lib/settings';
import { useHistory, type HistoryItem } from '@/lib/history';
import { callApi, detectLang } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const EXAMPLES_EN = [
  'English course for beginners',
  'AI fitness coach for busy parents',
  'Organic skincare for sensitive skin',
  'Productivity app for freelancers',
];

const EXAMPLES_AR = [
  'كورس لغة إنجليزية للمبتدئين',
  'تطبيق لياقة بدنية بالذكاء الاصطناعي',
  'منتجات عناية طبيعية للبشرة',
  'أداة إنتاجية للمستقلين',
];

interface GenerateResponse {
  hooks?: string[];
  error?: string;
}

interface Props {
  reopenedHistory?: HistoryItem | null;
  onHistoryConsumed?: () => void;
}

export function Generator({ reopenedHistory, onHistoryConsumed }: Props) {
  const { settings, update } = useSettings();
  const { addItem, toggleFavorite, isFavorite } = useHistory();
  const { t } = useI18n();

  const [idea, setIdea] = useState('');
  const [hooks, setHooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [bestIndex, setBestIndex] = useState<number>(-1);

  useEffect(() => {
    if (reopenedHistory?.type === 'hooks') {
      setIdea(reopenedHistory.inputs.idea ?? reopenedHistory.label);
      setHooks(reopenedHistory.results as string[]);
      setError(null);
      setBestIndex(-1);
      onHistoryConsumed?.();
    }
  }, [reopenedHistory, onHistoryConsumed]);

  const autoLang = detectLang(idea);
  const lang = settings.autoLanguage ? (settings.languageMode === 'auto' ? autoLang : settings.languageMode) : settings.languageMode;
  const isAr = lang === 'ar';
  const examples = isAr ? EXAMPLES_AR : EXAMPLES_EN;

  const generate = useCallback(async () => {
    if (!idea.trim()) {
      setError(isAr ? 'يرجى وصف منتجك أو فكرتك أولاً.' : 'Please describe your product or idea first.');
      return;
    }

    setLoading(true);
    setError(null);
    setHooks([]);
    setBestIndex(-1);

    const result = await callApi<GenerateResponse>({
      type: 'hooks',
      idea: idea.trim(),
      language: lang,
      count: settings.resultCount,
      style: settings.outputStyle,
      mood: settings.mood,
      persona: settings.persona,
      creativity: settings.creativity,
      outputMode: settings.outputMode,
    });

    setLoading(false);

    if (!result.ok || !result.data) {
      setError(result.error || (isAr ? 'فشل التوليد. حاول مرة أخرى.' : 'Failed to generate hooks. Please try again.'));
      return;
    }

    const generated = result.data.hooks ?? [];
    setHooks(generated);

    // Highlight the "best" hook — pick the most distinctive one (longest unique words)
    if (generated.length > 1) {
      const scores = generated.map((h) => {
        const words = new Set(h.toLowerCase().split(/\s+/));
        return words.size;
      });
      const maxScore = Math.max(...scores);
      setBestIndex(scores.indexOf(maxScore));
    }

    setConfettiTrigger((n) => n + 1);
    toast.success(isAr ? `تم توليد ${generated.length} هوك!` : `${generated.length} hooks generated!`);

    if (settings.saveHistory) {
      addItem({ type: 'hooks', label: idea.trim(), inputs: { idea: idea.trim() }, results: generated });
    }
  }, [idea, lang, isAr, settings, addItem]);

  const reset = () => {
    setIdea('');
    setHooks([]);
    setError(null);
    setBestIndex(-1);
  };

  const countOptions: { value: 5 | 10 | 20 | 50; label: string }[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
  ];

  return (
    <section id="generator" className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <ConfettiBurst trigger={confettiTrigger} />

      <div className="rounded-2xl glass-strong p-6 shadow-[0_2px_16px_hsl(var(--foreground)/0.06)] sm:p-8 animate-fade-in-up">
        <div className="mb-4 flex items-center justify-between">
          <label htmlFor="idea" className="block text-sm font-semibold text-foreground" dir={isAr ? 'rtl' : 'ltr'}>
            {isAr ? 'صف منتجك أو فكرتك' : 'Describe your product or idea'}
          </label>
          <ToolHelpButton toolId="hooks" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="idea"
            type="text"
            value={idea}
            dir={isAr ? 'rtl' : 'ltr'}
            onChange={(e) => { setIdea(e.target.value); if (error) setError(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !loading) generate(); }}
            placeholder={isAr ? 'مثال: كورس لغة إنجليزية للمبتدئين' : 'e.g. English course for beginners'}
            maxLength={500}
            className="h-12 flex-1 rounded-xl border border-border bg-card/60 px-4 text-[15px] text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
          />
          <VoiceInputButton
            fillField={setIdea}
            autoSubmit
            submitForm={generate}
          />

          <Button
            onClick={generate}
            disabled={loading}
            size="lg"
            className="h-12 flex-shrink-0 gap-2 bg-gradient-to-r from-primary to-cyan-500 px-7 text-sm font-bold tracking-wide shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isAr ? 'جاري التوليد...' : 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {isAr ? 'استخدم الذكاء الاصطناعي' : 'Use AI'}
              </>
            )}
          </Button>
        </div>

        {/* Multi-output selector */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isAr ? 'عدد النتائج:' : 'Output count:'}
            </span>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card/40 p-0.5">
              {countOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('resultCount', opt.value)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-all',
                    settings.resultCount === opt.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hooks.length === 0 && !loading && !error && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {isAr ? 'جرب مثالاً:' : 'Try an example:'}
            </span>
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setIdea(ex)}
                className="rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <ErrorBanner message={error} rtl={isAr} className="mt-4" />}

      {loading && <div className="mt-6"><SkeletonList count={Math.min(settings.resultCount, 6)} kind="hook" /></div>}

      {hooks.length > 0 && !loading && (
        <div className="mt-8 animate-fade-in">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 text-base font-bold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-400 shadow-sm">
                <Wand2 className="h-4 w-4 text-white" />
              </span>
              {isAr ? 'الهوكات الخاصة بك' : 'Your Marketing Hooks'}
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-primary/20">
                {hooks.length}
              </span>
            </h2>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
            >
              <RotateCcw className="h-3 w-3" />
              {isAr ? 'إعادة' : 'Reset'}
            </button>
          </div>
          <div className="space-y-3">
            {hooks.map((hook, i) => (
              <HookCard
                key={`${hook.slice(0, 10)}-${i}`}
                hook={hook}
                index={i}
                rtl={isAr}
                lang={isAr ? 'ar' : 'en'}
                isFavorite={isFavorite(hook)}
                onToggleFavorite={toggleFavorite}
                isBest={i === bestIndex && hooks.length > 1}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function Footer() {
  const { t, direction } = useI18n();

  return (
    <footer className="border-t border-border/40 glass py-6" dir={direction}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Marketra AI. {direction === 'rtl' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>
        <p className="text-xs font-semibold text-muted-foreground tracking-wide">
          {t.common.poweredBy}
        </p>
      </div>
    </footer>
  );
}
