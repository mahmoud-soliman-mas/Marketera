'use client';

import { useMemo, useState } from 'react';
import {
  Search, Trash2, History, Wand2, Lightbulb, Clock, RotateCcw,
  Copy, CopyCheck, FileText, Download, X, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/section-card';
import { EmptyState } from '@/components/empty-state';
import { useHistory, type HistoryItem } from '@/lib/history';
import { useI18n, useTranslation } from '@/lib/i18n';
import { TOOLS } from '@/lib/tools';
import { toast } from 'sonner';
import { exportHistoryToPDF, exportSingleItemToPDF } from '@/lib/pdf/service';

interface HistoryViewProps {
  onReopen: (item: HistoryItem) => void;
  onRegenerate: (item: HistoryItem) => void;
}

export function HistoryView({ onReopen, onRegenerate }: HistoryViewProps) {
  const { items, removeItem, clearAll, search } = useHistory();
  const { language, t } = useI18n();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'hooks' | 'content-ideas' | 'ad-copy' | 'video-prompt' | 'seo' | 'social-media' | 'email' | 'landing-page' | 'product-description' | 'brand-voice' | 'persona' | 'marketing-plan'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const filtered = useMemo(() => {
    let list = search(query);
    if (filter !== 'all') list = list.filter((i) => i.type === filter);
    return list;
  }, [items, query, filter, search]);

  const copyItem = async (item: HistoryItem) => {
    const text = resultsToText(item);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      toast.success(t.success.copied);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error(t.errors.failedToCopy);
    }
  };

  const downloadTxt = () => {
    if (!items.length) { toast.error(t.errors.noHistory); return; }
    const text = items
      .map((item) => `=== ${item.label} (${new Date(item.createdAt).toLocaleString()}) ===\n${resultsToText(item)}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'marketra-history.txt'; a.click();
    URL.revokeObjectURL(url);
    toast.success(t.success.downloaded + ' TXT');
  };

  const downloadPdf = async () => {
    if (!items.length) { toast.error(t.errors.noHistory); return; }
    setIsExportingPdf(true);
    try {
      await exportHistoryToPDF(items, TOOLS, { language });
      toast.success(t.success.downloaded + ' PDF');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(language === 'ar' ? 'فشل تصدير PDF' : 'Failed to export PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const downloadItemPdf = async (item: HistoryItem) => {
    const tool = TOOLS.find((t) => t.id === item.type);
    try {
      await exportSingleItemToPDF(item, tool, { language });
      toast.success(t.success.downloaded + ' PDF');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(language === 'ar' ? 'فشل تصدير PDF' : 'Failed to export PDF');
    }
  };

  const getToolLabel = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) return toolId;
    return language === 'ar' ? (tool.shortLabelAr || tool.labelAr) : (tool.shortLabel || tool.label);
  };

  const filterLabels: Record<string, string> = {
    all: t.common.all,
    hooks: t.historyView.hooks,
    'content-ideas': t.historyView.ideas,
    'ad-copy': t.historyView.adCopy,
    'video-prompt': t.historyView.videoPrompt,
    'seo': 'SEO',
    'social-media': language === 'ar' ? 'التواصل' : 'Social',
    'email': language === 'ar' ? 'البريد' : 'Email',
    'landing-page': language === 'ar' ? 'الهبوط' : 'Landing',
    'product-description': language === 'ar' ? 'المنتج' : 'Product',
    'brand-voice': language === 'ar' ? 'الصوت' : 'Brand',
    persona: t.historyView.persona,
    'marketing-plan': t.historyView.marketingPlan,
  };

  return (
    <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
      {/* Toolbar */}
      <SectionCard padded={false} className="overflow-hidden">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.historyView.searchPlaceholder}
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 pl-10 pr-9 text-sm text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-sky-100/60 dark:focus:ring-sky-900/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-0.5">
              {(['all', 'hooks', 'content-ideas', 'ad-copy', 'video-prompt', 'seo', 'social-media', 'email', 'persona', 'marketing-plan'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-lg px-2 py-1.5 text-xs font-semibold transition-all',
                    filter === f
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  )}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={downloadTxt}
              disabled={!items.length}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 hover:text-sky-600 hover:border-sky-300 transition-all disabled:opacity-40"
              title={t.common.exportTxt}
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!items.length || isExportingPdf}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 hover:text-sky-600 hover:border-sky-300 transition-all disabled:opacity-40 disabled:cursor-wait"
              title={t.common.exportPdf}
            >
              {isExportingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => { clearAll(); toast.success(t.historyView.cleared); }}
              disabled={!items.length}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t.common.clearAll}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* List */}
      <div className="mt-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={History}
            title={items.length === 0 ? t.historyView.noHistoryYet : t.historyView.noMatches}
            description={
              items.length === 0
                ? t.historyView.noHistoryDesc
                : t.historyView.noMatchesDesc
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const tool = TOOLS.find((t) => t.id === item.type);
              const Icon = tool?.icon ?? (item.type === 'hooks' ? Wand2 : Lightbulb);
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-all hover:shadow-md sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm', tool?.accent ?? 'from-sky-500 to-cyan-400')}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-slate-200 dark:text-slate-600">·</span>
                        <span>{item.results.length} {t.dashboard.results}</span>
                        <span className="text-slate-200 dark:text-slate-600">·</span>
                        <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 font-semibold text-slate-500 dark:text-slate-400">
                          {getToolLabel(item.type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconBtn label={t.common.copy} onClick={() => copyItem(item)}>
                        {isCopied ? <CopyCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </IconBtn>
                      <IconBtn label={t.common.exportPdf} onClick={() => downloadItemPdf(item)}>
                        <FileText className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn label={t.common.regenerate} onClick={() => onRegenerate(item)}>
                        <RotateCcw className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn label={t.common.open} onClick={() => onReopen(item)}>
                        <Wand2 className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn label={t.common.delete} danger onClick={() => { removeItem(item.id); toast.success(t.historyView.removed); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconBtn>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-3 space-y-1.5 pl-13 sm:pl-13">
                    {previewLines(item).map((r, i) => (
                      <p key={i} className="truncate text-xs text-slate-500 dark:text-slate-400">
                        <span className="text-slate-300 dark:text-slate-600">{i + 1}.</span> {r}
                      </p>
                    ))}
                    {previewMore(item) > 0 && (
                      <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                        +{previewMore(item)} {language === 'ar' ? 'المزيد' : 'more'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function IconBtn({
  children, label, onClick, danger,
}: {
  children: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg border transition-all',
        danger
          ? 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20'
          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 hover:border-sky-300 hover:text-sky-600 dark:hover:bg-slate-600'
      )}
    >
      {children}
    </button>
  );
}

/** Normalizes a history item's results into an array of string lines. */
function resultsLines(item: HistoryItem): string[] {
  if (item.type === 'ad-copy') {
    const r = item.results[0] as { hook?: string; headline?: string; cta?: string } | undefined;
    if (!r) return ['(ad copy)'];
    const lines: string[] = [];
    if (r.hook) lines.push(`Hook: ${r.hook}`);
    if (r.headline) lines.push(`Headline: ${r.headline}`);
    if (r.cta) lines.push(`CTA: ${r.cta}`);
    return lines;
  }
  if (item.type === 'video-prompt') {
    const r = item.results[0] as { hook?: string; prompt?: string; recommendedModel?: string } | undefined;
    if (!r) return ['(video prompt)'];
    const lines: string[] = [];
    if (r.hook) lines.push(`Hook: ${r.hook}`);
    if (r.prompt) lines.push(`Prompt: ${r.prompt.slice(0, 100)}...`);
    if (r.recommendedModel) lines.push(`Recommended: ${r.recommendedModel}`);
    return lines;
  }
  if (item.type === 'persona') {
    const r = item.results[0] as { personaName?: string; age?: string; occupation?: string } | undefined;
    if (!r) return ['(persona)'];
    const lines: string[] = [];
    if (r.personaName) lines.push(`Name: ${r.personaName}`);
    if (r.age) lines.push(`Age: ${r.age}`);
    if (r.occupation) lines.push(`Occupation: ${r.occupation}`);
    return lines;
  }
  if (item.type === 'marketing-plan') {
    const r = item.results[0] as { executiveSummary?: string; kpis?: string } | undefined;
    if (!r) return ['(marketing plan)'];
    const lines: string[] = [];
    if (r.executiveSummary) lines.push(`Summary: ${r.executiveSummary.slice(0, 100)}...`);
    if (r.kpis) lines.push(`KPIs: ${r.kpis.slice(0, 80)}...`);
    return lines;
  }
  return (item.results as string[]).map((r) => String(r));
}

function resultsToText(item: HistoryItem): string {
  return resultsLines(item).map((r, i) => `${i + 1}. ${r}`).join('\n');
}

function previewLines(item: HistoryItem): string[] {
  return resultsLines(item).slice(0, 2);
}

function previewMore(item: HistoryItem): number {
  const total = resultsLines(item).length;
  return Math.max(0, total - 2);
}
