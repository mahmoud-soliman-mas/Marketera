'use client';

import { useState, useRef, useEffect } from 'react';
import {
  X, Settings, Globe, Sliders, Palette, Download, Info, Trash2, ChevronRight,
  Check, Sun, Moon, MonitorSmartphone, Languages, FileText, Copy, CopyCheck,
  Sparkles, Smile, Zap, Brain, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useSettings, type LanguageMode, type ThemeMode, type MoodMode, MOOD_LABELS,
} from '@/lib/settings';
import { useHistory, type HistoryItem } from '@/lib/history';
import { useI18n, useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/tools';
import { exportHistoryToPDF } from '@/lib/pdf/service';

function QuickSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600 dark:bg-sky-900/30">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</h3>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
        {children}
      </div>
    </div>
  );
}

function ChipRow<T extends string | number>({
  label, desc, value, options, onChange,
}: {
  label: string; desc?: string; value: T;
  options: { value: T; label: string; icon?: React.ElementType }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="px-4 py-3.5">
      <p className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
      {desc && <p className="mb-2.5 text-xs text-slate-400 dark:text-slate-500">{desc}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all',
                active
                  ? 'border-sky-400 bg-sky-50 text-sky-700 shadow-sm dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-500'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200 hover:bg-sky-50/60 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {opt.label}
              {active && <Check className="h-3 w-3 text-sky-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 transition-all',
          checked ? 'border-sky-500 bg-sky-500' : 'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-700'
        )}
        aria-pressed={checked}
      >
        <span className={cn('absolute h-4 w-4 rounded-full bg-white shadow-sm transition-all', checked ? 'left-5' : 'left-0.5')} />
      </button>
    </div>
  );
}

function ActionRow({ label, desc, icon: Icon, variant, onClick }: {
  label: string; desc?: string; icon: React.ElementType;
  variant?: 'default' | 'danger'; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50',
        variant === 'danger' ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : ''
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={cn(
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg',
          variant === 'danger' ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
        )}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <p className={cn('text-sm font-semibold', variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100')}>{label}</p>
          {desc && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600" />
    </button>
  );
}

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  onReopenHistory?: (item: HistoryItem) => void;
}

export function SettingsPanel({ open, onClose, onReopenHistory }: SettingsPanelProps) {
  const { settings, update } = useSettings();
  const { items: historyItems, clearAll } = useHistory();
  const { language, setLanguage, isAuto, t } = useI18n();
  const [copiedAll, setCopiedAll] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopyAll = async () => {
    if (!historyItems.length) return;
    const text = historyItems
      .map((item) => `=== ${item.label} (${new Date(item.createdAt).toLocaleString()}) ===\n${(item.results as string[]).map((r, i) => `${i + 1}. ${r}`).join('\n')}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      toast.success(t.success.copiedAll);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch { toast.error(t.errors.failedToCopy); }
  };

  const handleDownloadTxt = () => {
    if (!historyItems.length) { toast.error(t.errors.noHistory); return; }
    const text = historyItems
      .map((item) => `=== ${item.label} (${new Date(item.createdAt).toLocaleString()}) ===\n${(item.results as string[]).map((r, i) => `${i + 1}. ${r}`).join('\n')}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'marketra-results.txt'; a.click();
    URL.revokeObjectURL(url);
    toast.success(t.success.downloaded + ' TXT');
  };

  const handleDownloadPdf = async () => {
    if (!historyItems.length) { toast.error(t.errors.noHistory); return; }
    setIsExportingPdf(true);
    try {
      await exportHistoryToPDF(historyItems, TOOLS, { language });
      toast.success(t.success.downloaded + ' PDF');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(language === 'ar' ? 'فشل تصدير PDF' : 'Failed to export PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-slate-50 dark:bg-slate-900 shadow-2xl',
          'animate-[slideInRight_0.28s_cubic-bezier(0.22,1,0.36,1)_both]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-sm">
              <Settings className="h-4 w-4 text-white" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{t.settingsView.quickSettings}</h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{t.settingsView.openFullSettings}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 hover:border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all"
            aria-label={t.common.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {/* Application Language (UI) */}
          <QuickSection title={t.common.applicationLanguage} icon={Languages}>
            <ChipRow<'auto' | 'ar' | 'en'>
              label={t.common.uiLanguage}
              desc={t.common.appLanguageDesc}
              value={isAuto ? 'auto' : language}
              options={[
                { value: 'auto', label: t.common.autoDetect, icon: Globe },
                { value: 'ar', label: t.common.arabic, icon: Languages },
                { value: 'en', label: t.common.english, icon: Languages },
              ]}
              onChange={(v) => setLanguage(v)}
            />
          </QuickSection>

          {/* AI Response Language */}
          <QuickSection title={t.common.aiResponseLanguage} icon={Brain}>
            <ChipRow<LanguageMode>
              label={t.common.aiResponseLanguage}
              desc={t.common.aiLanguageDesc}
              value={settings.languageMode}
              options={[
                { value: 'auto', label: t.settingsView.autoDetect, icon: Globe },
                { value: 'ar', label: t.common.arabic, icon: Languages },
                { value: 'en', label: t.common.english, icon: Languages },
              ]}
              onChange={(v) => update('languageMode', v)}
            />
          </QuickSection>

          <QuickSection title={t.settingsView.moodDial} icon={Smile}>
            <ChipRow<MoodMode>
              label={t.settingsView.moodDial}
              value={settings.mood}
              options={(Object.keys(MOOD_LABELS) as MoodMode[]).map((m) => ({
                value: m, label: language === 'ar' ? MOOD_LABELS[m].ar : MOOD_LABELS[m].en, icon: Smile,
              }))}
              onChange={(v) => update('mood', v)}
            />
          </QuickSection>

          <QuickSection title={t.settingsView.creativitySlider} icon={Sparkles}>
            <div className="px-4 py-3.5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.settingsView.creativitySlider}</p>
                <span className="rounded-lg bg-sky-50 dark:bg-sky-900/30 px-2.5 py-1 text-xs font-bold text-sky-600 dark:text-sky-300">
                  {settings.creativity}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={settings.creativity}
                onChange={(e) => update('creativity', Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
          </QuickSection>

          <QuickSection title={t.settingsView.themeSettings} icon={Palette}>
            <ChipRow<ThemeMode>
              label={t.settingsView.colorTheme}
              value={settings.themeMode}
              options={[
                { value: 'light', label: t.common.lightMode, icon: Sun },
                { value: 'dark', label: t.common.darkMode, icon: Moon },
                { value: 'system', label: t.common.system, icon: MonitorSmartphone },
              ]}
              onChange={(v) => update('themeMode', v)}
            />
          </QuickSection>

          <QuickSection title={t.settingsView.historySettings} icon={Sliders}>
            <ToggleRow
              label={t.settingsView.saveResults}
              desc={t.settingsView.saveResultsDesc}
              checked={settings.saveHistory}
              onChange={(v) => update('saveHistory', v)}
            />
            {historyItems.length > 0 && (
              <ActionRow
                label={t.historyView.clearHistory}
                desc={`${historyItems.length} ${t.dashboard.savedItems}`}
                icon={Trash2}
                variant="danger"
                onClick={() => { clearAll(); toast.success(t.historyView.cleared); }}
              />
            )}
          </QuickSection>

          <QuickSection title={t.settingsView.exportOptions} icon={Download}>
            <ActionRow
              label={copiedAll ? t.common.copied : t.settingsView.copyAllResults}
              desc={t.settingsView.copyAllDesc}
              icon={copiedAll ? CopyCheck : Copy}
              onClick={handleCopyAll}
            />
            <ActionRow label={t.settingsView.downloadTxt} desc={t.settingsView.downloadTxtDesc} icon={FileText} onClick={handleDownloadTxt} />
            <ActionRow
              label={isExportingPdf ? (language === 'ar' ? 'جارٍ التصدير...' : 'Exporting...') : t.settingsView.downloadPdf}
              desc={t.settingsView.downloadPdfDesc}
              icon={isExportingPdf ? Loader2 : FileText}
              onClick={handleDownloadPdf}
            />
          </QuickSection>

          <QuickSection title={t.settingsView.account} icon={Info}>
            <div className="px-4 py-3.5 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t.settingsView.toolVersion}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">v2.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t.common.poweredBy}</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">MW</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">AI Engine</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Groq · LLaMA 3.3 70B</span>
              </div>
            </div>
          </QuickSection>

          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <Zap className="h-3 w-3 text-sky-400" />
            {t.settingsView.openFullSettings}
          </div>
        </div>
      </aside>
    </>
  );
}
