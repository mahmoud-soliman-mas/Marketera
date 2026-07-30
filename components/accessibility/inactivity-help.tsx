'use client';

import { Mic, HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/lib/accessibility/provider';
import { useI18n } from '@/lib/i18n';
import { getToolExplanation, getExplanationText } from '@/lib/accessibility/types';
import type { ToolId } from '@/lib/tools';

interface InactivityHelpProps {
  toolId: ToolId;
  className?: string;
}

export function InactivityHelp({ toolId, className }: InactivityHelpProps) {
  const { showInactivityHelp, dismissInactivityHelp, speakExplanation, accessibilityMode } = useAccessibility();
  const { language, t } = useI18n();

  if (!showInactivityHelp) return null;

  const handleExplain = async () => {
    await speakExplanation(toolId);
    dismissInactivityHelp();
  };

  const langLabel = language === 'ar';

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-800 shadow-lg',
          accessibilityMode ? 'px-6 py-5' : 'px-5 py-4'
        )}
      >
        <div className="flex-shrink-0">
          <HelpCircle className={cn('text-sky-500', accessibilityMode ? 'h-8 w-8' : 'h-6 w-6')} />
        </div>
        <div className="text-center">
          <p className={cn('font-semibold text-slate-900 dark:text-white', accessibilityMode ? 'text-lg' : 'text-sm')}>
            {langLabel ? 'تحتاج مساعدة؟' : 'Need help?'}
          </p>
          <p className={cn('text-slate-500', accessibilityMode ? 'text-base' : 'text-xs')}>
            {langLabel ? 'يمكننا شرح هذه الأداة لك' : 'We can explain this tool for you'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExplain}
            className={cn(
              'flex items-center gap-2 rounded-xl bg-sky-500 text-white transition-colors hover:bg-sky-600',
              accessibilityMode ? 'px-5 py-3 text-lg' : 'px-4 py-2 text-sm font-semibold'
            )}
          >
            <Mic className={accessibilityMode ? 'h-5 w-5' : 'h-4 w-4'} />
            {langLabel ? 'شرح' : 'Explain'}
          </button>
          <button
            onClick={dismissInactivityHelp}
            className={cn(
              'flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors',
              accessibilityMode ? 'h-12 w-12' : 'h-8 w-8'
            )}
            aria-label={langLabel ? 'إغلاق' : 'Close'}
          >
            <X className={accessibilityMode ? 'h-6 w-6' : 'h-4 w-4'} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Help Button for Tools ──────────────────────────────────────────────────────

interface ToolExplanationPanelProps {
  toolId: ToolId;
}

export function ToolExplanationPanel({ toolId }: ToolExplanationPanelProps) {
  const { language } = useI18n();
  const { speakText, accessibilityMode, speakExplanation, isSpeaking, stopSpeaking } = useAccessibility();
  const explanation = getToolExplanation(toolId);

  if (!explanation) return null;

  const l = language === 'ar' ? 'ar' : 'en';

  const sections = [
    { label: language === 'ar' ? 'ما هذه الأداة؟' : 'What is this tool?', content: explanation.whatIsThis[l] },
    { label: language === 'ar' ? 'متى أستخدمها؟' : 'When should I use it?', content: explanation.whenToUse[l] },
    { label: language === 'ar' ? 'ماذا أكتب؟' : 'What should I write?', content: explanation.whatToWrite[l] },
    { label: language === 'ar' ? 'ماذا سأحصل عليه؟' : 'What result will I get?', content: explanation.whatYouGet[l] },
    { label: language === 'ar' ? 'نصيحة للمبتدئين' : 'Beginner tip', content: explanation.beginnerTip[l] },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className={cn('font-bold text-slate-900 dark:text-white', accessibilityMode ? 'text-xl' : 'text-lg')}>
          {explanation.title[l]}
        </h3>
        <button
          onClick={() => isSpeaking ? stopSpeaking() : speakExplanation(toolId)}
          className={cn(
            'flex items-center gap-2 rounded-xl bg-sky-500 text-white transition-colors hover:bg-sky-600',
            accessibilityMode ? 'px-5 py-3 text-lg' : 'px-4 py-2 text-sm font-semibold'
          )}
        >
          <Mic className={accessibilityMode ? 'h-5 w-5' : 'h-4 w-4'} />
          {isSpeaking
            ? (language === 'ar' ? 'إيقاف' : 'Stop')
            : (language === 'ar' ? 'شرح صوتي' : 'Voice Explain')
          }
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">{i + 1}</span>
            </div>
            <div>
              <p className={cn('font-semibold text-slate-700 dark:text-slate-300', accessibilityMode ? 'text-base' : 'text-sm')}>
                {section.label}
              </p>
              <p className={cn('text-slate-600 dark:text-slate-400', accessibilityMode ? 'text-lg' : 'text-sm')}>
                {section.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
