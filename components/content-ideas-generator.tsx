'use client';

import { useState, useCallback, useEffect } from 'react';
import { Loader2, Sparkles, Lightbulb, RotateCcw, CopyCheck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContentIdeaCard, type ContentIdea } from '@/components/content-idea-card';
import { ErrorBanner } from '@/components/error-banner';
import { SkeletonList } from '@/components/skeletons';
import { VoiceInputButton, ToolHelpButton, VoiceOutputButton } from '@/components/voice/voice-buttons';
import { useSettings } from '@/lib/settings';
import { useHistory, type HistoryItem } from '@/lib/history';
import { callApi, detectLang } from '@/lib/api';

interface Props {
  reopenedHistory?: HistoryItem | null;
  onHistoryConsumed?: () => void;
}

export function ContentIdeasGenerator({ reopenedHistory, onHistoryConsumed }: Props) {
  const { settings } = useSettings();
  const { addItem } = useHistory();

  const [niche, setNiche] = useState('');
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (reopenedHistory?.type === 'content-ideas') {
      setNiche(reopenedHistory.inputs.niche ?? '');
      setProduct(reopenedHistory.inputs.product ?? '');
      setIdeas(reopenedHistory.results as ContentIdea[]);
      setError(null);
      onHistoryConsumed?.();
    }
  }, [reopenedHistory]);

  const autoLang = detectLang(`${niche} ${product}`);
  const lang = settings.autoLanguage ? (settings.languageMode === 'auto' ? autoLang : settings.languageMode) : settings.languageMode;
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const generate = useCallback(async () => {
    if (!niche.trim() || !product.trim()) {
      setError(isAr ? 'يرجى ملء حقلي المجال والمنتج.' : 'Please fill in both Niche and Product fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setIdeas([]);

    const result = await callApi<{ ideas?: ContentIdea[]; error?: string }>({
      type: 'content-ideas',
      niche: niche.trim(),
      product: product.trim(),
      audience: audience.trim() || undefined,
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
      setError(result.error || (isAr ? 'فشل التوليد. حاول مرة أخرى.' : 'Failed to generate ideas. Please try again.'));
      return;
    }

    const generated: ContentIdea[] = result.data.ideas ?? [];
    setIdeas(generated);
    toast.success(isAr ? `تم توليد ${generated.length} فكرة!` : `${generated.length} ideas generated!`);

    if (settings.saveHistory) {
      addItem({
        type: 'content-ideas',
        label: `${niche.trim()} | ${product.trim()}`,
        inputs: { niche: niche.trim(), product: product.trim(), audience: audience.trim() },
        results: generated,
      });
    }
  }, [niche, product, audience, lang, isAr, settings, addItem]);

  const reset = () => {
    setNiche('');
    setProduct('');
    setAudience('');
    setIdeas([]);
    setError(null);
  };

  const copyAll = async () => {
    const text = ideas
      .map((idea, i) =>
        `${i + 1}. ${idea.title}\n   [${idea.contentType}] ${idea.category}\n   ${idea.description}`
      )
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      toast.success(isAr ? 'تم نسخ الكل!' : 'All ideas copied!');
      setTimeout(() => setCopiedAll(false), 2500);
    } catch { /* ignore */ }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200" dir={dir}>
            {isAr ? 'معلومات عملك' : 'Your Business Details'}
          </h3>
          <ToolHelpButton toolId="content-ideas" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400" dir={dir}>
              {isAr ? 'المجال أو نوع العمل *' : 'Niche / Business Type *'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={niche}
                dir={dir}
                onChange={(e) => { setNiche(e.target.value); if (error) setError(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !loading) generate(); }}
                placeholder={isAr ? 'مثال: تدريب لياقة بدنية، تعليم برمجة' : 'e.g. fitness coaching, coding education'}
                maxLength={200}
                className="h-12 flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-[15px] text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-sky-100/60 dark:focus:ring-sky-900/40"
              />
              <VoiceInputButton fillField={setNiche} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400" dir={dir}>
              {isAr ? 'المنتج أو الخدمة *' : 'Product / Service *'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={product}
                dir={dir}
                onChange={(e) => { setProduct(e.target.value); if (error) setError(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !loading) generate(); }}
                placeholder={isAr ? 'مثال: كورس لياقة 12 أسبوع' : 'e.g. 12-week fitness course'}
                maxLength={300}
                className="h-12 flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-[15px] text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-sky-100/60 dark:focus:ring-sky-900/40"
              />
              <VoiceInputButton fillField={setProduct} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400" dir={dir}>
              {isAr ? 'الجمهور المستهدف (اختياري)' : 'Target Audience (optional)'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={audience}
                dir={dir}
                onChange={(e) => setAudience(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !loading) generate(); }}
                placeholder={isAr ? 'مثال: أمهات في الثلاثينيات' : 'e.g. busy moms in their 30s'}
                maxLength={200}
                className="h-12 flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-[15px] text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-sky-100/60 dark:focus:ring-sky-900/40"
              />
              <VoiceInputButton fillField={setAudience} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={generate}
            disabled={loading}
            size="lg"
            className="h-12 w-full gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-sm font-bold tracking-wide shadow-md transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isAr ? 'جاري توليد الأفكار...' : 'Generating ideas...'}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {isAr ? `توليد ${settings.resultCount} فكرة محتوى` : `Generate ${settings.resultCount} Content Ideas`}
              </>
            )}
          </Button>
        </div>
      </div>

      {error && <ErrorBanner message={error} rtl={isAr} className="mt-4" />}

      {loading && <div className="mt-6"><SkeletonList count={6} kind="idea" /></div>}

      {ideas.length > 0 && !loading && (
        <div className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 shadow-sm">
                <Lightbulb className="h-4 w-4 text-white" />
              </span>
              {isAr ? 'أفكار المحتوى' : 'Content Ideas'}
              <span className="rounded-full bg-sky-50 dark:bg-sky-900/30 px-2.5 py-0.5 text-xs font-bold text-sky-600 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-800">
                {ideas.length}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyAll}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                  copiedAll
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600'
                )}
              >
                <CopyCheck className="h-3 w-3" />
                {isAr ? 'نسخ الكل' : 'Copy All'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
              >
                <RotateCcw className="h-3 w-3" />
                {isAr ? 'إعادة' : 'Reset'}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {ideas.map((idea, i) => (
              <ContentIdeaCard
                key={`${idea.title.slice(0, 12)}-${i}`}
                idea={idea}
                index={i}
                rtl={isAr}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
