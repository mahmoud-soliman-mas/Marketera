'use client';

import { useState } from 'react';
import {
  Globe, Sliders, Palette, History, Download, Info, Sun, Moon, MonitorSmartphone,
  Languages, FileText, Copy, CopyCheck, Trash2, Check, Smile, UserCircle, Sparkles,
  FileEdit, Zap, Accessibility, Mic, BookOpen, Volume2, Brain, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/section-card';
import {
  useSettings, type LanguageMode, type OutputStyle, type ThemeMode, type ResultCount,
  type MoodMode, type PersonaMode, type OutputMode,
  MOOD_LABELS, PERSONA_LABELS,
} from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { useI18n, useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/tools';
import { exportHistoryToPDF } from '@/lib/pdf/service';

function Section({ title, icon: Icon, children, hint }: { title: string; icon: React.ElementType; children: React.ReactNode; hint?: string }) {
  return (
    <SectionCard
      header={
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-900/30">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</h3>
            {hint && <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>}
          </div>
        </div>
      }
    >
      {children}
    </SectionCard>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 transition-all duration-200',
          checked ? 'border-sky-500 bg-sky-500' : 'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-700'
        )}
        aria-pressed={checked}
      >
        <span className={cn('absolute h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200', checked ? 'left-5' : 'left-0.5')} />
      </button>
    </div>
  );
}

function ChipRow<T extends string | number>({
  label, desc, value, options, onChange,
}: {
  label: string; desc?: string; value: T;
  options: { value: T; label: string; icon?: React.ElementType; hint?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{desc}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              title={opt.hint}
              className={cn(
                'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-150',
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

function ActionRow({ label, desc, icon: Icon, variant, onClick, loading }: {
  label: string; desc?: string; icon: React.ElementType;
  variant?: 'default' | 'danger'; onClick: () => void; loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        'flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition-all',
        variant === 'danger'
          ? 'hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50',
        loading && 'opacity-70 cursor-wait'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
          variant === 'danger' ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
        )}>
          <Icon className={cn('h-4 w-4', loading && 'animate-spin')} />
        </span>
        <div className="min-w-0">
          <p className={cn('text-sm font-semibold', variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100')}>{label}</p>
          {desc && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>}
        </div>
      </div>
    </button>
  );
}

export function SettingsView() {
  const { settings, update, reset } = useSettings();
  const { items, removeItem, clearAll } = useHistory();
  const { language, setLanguage, isAuto, t } = useI18n();
  const [copiedAll, setCopiedAll] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const allResults = items.flatMap((i) => i.results as string[]);

  const handleCopyAll = async () => {
    if (!allResults.length) return;
    const text = items
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
    if (!items.length) { toast.error(t.errors.noHistory); return; }
    const text = items
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

  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <div className="space-y-5">
        {/* Application Language */}
        <Section title={t.common.applicationLanguage} icon={Languages}>
          <div className="space-y-4">
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
          </div>
        </Section>

        {/* AI Response Language */}
        <Section title={t.common.aiResponseLanguage} icon={Brain}>
          <div className="space-y-4">
            <ToggleRow
              label={t.settingsView.autoLanguage}
              desc={t.settingsView.autoLanguageDesc}
              checked={settings.autoLanguage}
              onChange={(v) => update('autoLanguage', v)}
            />
            <ChipRow<LanguageMode>
              label={t.settingsView.responseLanguage}
              desc={t.settingsView.responseLanguageDesc}
              value={settings.languageMode}
              options={[
                { value: 'auto', label: t.settingsView.autoDetect, icon: Globe },
                { value: 'ar', label: t.common.arabic, icon: Languages },
                { value: 'en', label: t.common.english, icon: Languages },
              ]}
              onChange={(v) => update('languageMode', v)}
            />
          </div>
        </Section>

        {/* AI Control Center */}
        <Section title="AI Control Center" icon={Sparkles} hint={t.settingsView.moodDesc}>
          <div className="space-y-6">
            {/* Mood Dial */}
            <ChipRow<MoodMode>
              label={t.settingsView.moodDial}
              desc={t.settingsView.moodDesc}
              value={settings.mood}
              options={(Object.keys(MOOD_LABELS) as MoodMode[]).map((m) => ({
                value: m, label: language === 'ar' ? MOOD_LABELS[m].ar : MOOD_LABELS[m].en, icon: Smile, hint: MOOD_LABELS[m].hint,
              }))}
              onChange={(v) => update('mood', v)}
            />

            {/* Persona Mixer */}
            <ChipRow<PersonaMode>
              label={t.settingsView.personaMixer}
              desc={t.settingsView.personaDesc}
              value={settings.persona}
              options={(Object.keys(PERSONA_LABELS) as PersonaMode[]).map((p) => ({
                value: p, label: language === 'ar' ? PERSONA_LABELS[p].ar : PERSONA_LABELS[p].en, icon: UserCircle, hint: PERSONA_LABELS[p].hint,
              }))}
              onChange={(v) => update('persona', v)}
            />

            {/* Creativity Slider */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.settingsView.creativitySlider}</p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settingsView.creativityDesc}</p>
                </div>
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
              <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                <span>{t.settingsView.focused}</span>
                <span>{t.settingsView.balanced}</span>
                <span>{t.settingsView.wild}</span>
              </div>
            </div>

            {/* Draft vs Final */}
            <ChipRow<OutputMode>
              label={t.settingsView.draftVsFinal}
              desc={t.settingsView.draftFinalDesc}
              value={settings.outputMode}
              options={[
                { value: 'draft', label: t.settingsView.draft, icon: FileEdit, hint: t.settingsView.draftHint },
                { value: 'final', label: t.settingsView.final, icon: Check, hint: t.settingsView.finalHint },
              ]}
              onChange={(v) => update('outputMode', v)}
            />
          </div>
        </Section>

        {/* User Preferences */}
        <Section title={t.settingsView.userPreferences} icon={Sliders}>
          <div className="space-y-5">
            <ChipRow<ResultCount>
              label={t.settingsView.numberOfResults}
              desc={t.settingsView.resultsDesc}
              value={settings.resultCount}
              options={[
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 50, label: '50' },
              ]}
              onChange={(v) => update('resultCount', v)}
            />
            <ChipRow<OutputStyle>
              label={t.settingsView.defaultOutputStyle}
              desc={t.settingsView.styleDesc}
              value={settings.outputStyle}
              options={[
                { value: 'professional', label: t.settingsView.professional },
                { value: 'casual', label: t.settingsView.casual },
                { value: 'creative', label: t.settingsView.creative },
                { value: 'persuasive', label: t.settingsView.persuasive },
              ]}
              onChange={(v) => update('outputStyle', v)}
            />
          </div>
        </Section>

        {/* Theme */}
        <Section title={t.settingsView.themeSettings} icon={Palette}>
          <ChipRow<ThemeMode>
            label={t.settingsView.colorTheme}
            desc={t.settingsView.colorThemeDesc}
            value={settings.themeMode}
            options={[
              { value: 'light', label: t.common.lightMode, icon: Sun },
              { value: 'dark', label: t.common.darkMode, icon: Moon },
              { value: 'system', label: t.common.system, icon: MonitorSmartphone },
            ]}
            onChange={(v) => update('themeMode', v)}
          />
        </Section>

        {/* Accessibility */}
        <Section title="Accessibility" icon={Accessibility} hint="Make the app easier to use">
          <div className="space-y-5">
            <ToggleRow
              label="Accessibility Mode"
              desc="Bigger buttons, larger text, and higher contrast for easier use."
              checked={settings.accessibilityMode}
              onChange={(v) => update('accessibilityMode', v)}
            />
            <ToggleRow
              label="Beginner Mode"
              desc="Replace technical marketing terms with simple explanations."
              checked={settings.beginnerMode}
              onChange={(v) => update('beginnerMode', v)}
            />
            <ToggleRow
              label="Voice Navigation"
              desc="Use voice commands to navigate the app."
              checked={settings.voiceNavigation}
              onChange={(v) => update('voiceNavigation', v)}
            />
            <ToggleRow
              label="Auto-Speak Instructions"
              desc="Automatically read important instructions aloud."
              checked={settings.autoSpeak}
              onChange={(v) => update('autoSpeak', v)}
            />
            <div className="rounded-xl bg-sky-50 dark:bg-sky-900/20 px-4 py-3 text-xs text-sky-700 dark:text-sky-300">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4" />
                <span className="font-semibold">Voice Features</span>
              </div>
              <p className="text-sky-600 dark:text-sky-400">
                {t.common.language === 'ar'
                  ? 'يدعم هذا التطبيق الإدخال والإخراج الصوتي بالعربية والإنجليزية. يتم كشف اللغة تلقائياً من كلامك أو نصك.'
                  : 'This app supports both Arabic and English voice input and output. The language is detected automatically from your speech or text.'}
              </p>
            </div>
          </div>
        </Section>

        {/* History */}
        <Section title={t.settingsView.historySettings} icon={History}>
          <div className="space-y-4">
            <ToggleRow
              label={t.settingsView.saveResults}
              desc={t.settingsView.saveResultsDesc}
              checked={settings.saveHistory}
              onChange={(v) => update('saveHistory', v)}
            />
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
              {items.length} {t.dashboard.savedItems}
              {items.length > 0 && ` · ${t.settingsView.storedLocally}`}
            </div>
            {items.length > 0 && (
              <ActionRow
                label={t.historyView.clearHistory}
                desc={language === 'ar' ? 'يحذف جميع الأجيال المحفوظة نهائياً' : 'Permanently removes all saved generations'}
                icon={Trash2}
                variant="danger"
                onClick={() => { clearAll(); toast.success(t.historyView.cleared); }}
              />
            )}
          </div>
        </Section>

        {/* Export */}
        <Section title={t.settingsView.exportOptions} icon={Download}>
          <div className="space-y-2">
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
              loading={isExportingPdf}
            />
          </div>
        </Section>

        {/* Account */}
        <Section title={t.settingsView.account} icon={Info}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoTile label={t.settingsView.toolVersion} value="v2.0.0" />
            <InfoTile label={t.common.poweredBy} value="MW" />
            <InfoTile label="AI Engine" value="Groq · LLaMA 3.3 70B" />
            <InfoTile label={t.settingsView.storage} value={t.settingsView.local} />
          </div>
          <button
            type="button"
            onClick={() => { reset(); toast.success(t.success.saved); }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-sky-300 hover:text-sky-600 transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
            {t.settingsView.resetToDefaults}
          </button>
        </Section>
      </div>
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}
