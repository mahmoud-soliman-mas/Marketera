'use client';

import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { ToolId } from '@/lib/tools';

interface LeloHelpButtonProps {
  activeToolId: ToolId;
  onOpenAssistant: (prompt: string) => void;
}

export function LeloHelpButton({ activeToolId, onOpenAssistant }: LeloHelpButtonProps) {
  const { language } = useI18n();
  const isArabic = language === 'ar';
  const isDashboard = activeToolId === 'dashboard';
  const toolName = isDashboard
    ? (isArabic ? 'لوحة التحكم' : 'the dashboard')
    : (isArabic ? 'الأداة الحالية' : 'this tool');
  const message = isArabic
    ? `أنا Lelo، مساعدك لشرح ${toolName}. اضغط هنا لأشرح لك كيف تستخدمها.`
    : `I’m Lelo. Tap here and I’ll explain ${toolName} step by step.`;
  const prompt = isArabic
    ? `أنت Lelo، المساعد المخصص لشرح برنامج Marketera. اشرح لي ${isDashboard ? 'لوحة التحكم والبرنامج بالكامل' : 'الأداة الحالية'} بطريقة بسيطة وعملية، واذكر الخطوات الأولى للاستخدام.`
    : `You are Lelo, Marketera’s product guide. Explain ${isDashboard ? 'the dashboard and the program' : 'the current tool'} in a simple, practical way, including the first steps to use it.`;

  return (
    <div className={`fixed bottom-5 z-[70] flex max-w-[calc(100vw-2rem)] items-end gap-2 sm:bottom-7 ${isArabic ? 'left-5 flex-row-reverse sm:left-7' : 'right-5 sm:right-7'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: [0, -3, 0], scale: 1 }}
        transition={{ opacity: { duration: 0.45 }, scale: { duration: 0.45 }, y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' } }}
        className="relative max-w-[230px] rounded-2xl border border-cyan-400/20 bg-card/95 px-3.5 py-2.5 text-[11px] leading-5 text-foreground shadow-[0_12px_40px_rgba(14,165,233,0.16)] backdrop-blur-xl sm:max-w-[270px]"
      >
        <span className={`absolute bottom-3 h-3 w-3 rotate-45 border-cyan-400/20 bg-card/95 ${isArabic ? '-left-1.5 border-b border-l' : '-right-1.5 border-r border-t'}`} />
        <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
          <Sparkles className="h-3 w-3" />
          Lelo · {isArabic ? 'مساعد الشرح' : 'Guide assistant'}
        </div>
        <p>{message}</p>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => onOpenAssistant(prompt)}
        animate={{ y: [0, -5, 0], boxShadow: ['0 8px 24px rgba(14,165,233,0.18)', '0 14px 34px rgba(14,165,233,0.34)', '0 8px 24px rgba(14,165,233,0.18)'] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="group flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl border border-cyan-400/35 bg-gradient-to-br from-cyan-500 to-blue-600 px-3.5 text-white ring-4 ring-cyan-500/10 transition-colors hover:from-cyan-400 hover:to-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/40 sm:px-4"
        aria-label={isArabic ? 'افتح Lelo لشرح البرنامج والأداة' : 'Open Lelo to explain the program and tool'}
        title={isArabic ? 'Lelo — مساعد شرح البرنامج' : 'Lelo — program guide'}
      >
        <span className="absolute h-14 w-14 animate-ping rounded-2xl bg-cyan-400/10 opacity-60" aria-hidden="true" />
          <Bot className="relative h-6 w-6 shrink-0 transition-transform duration-300 group-hover:rotate-[-8deg]" />
          <span className="relative text-[10px] font-bold uppercase tracking-[0.12em]">{isArabic ? 'شرح الأداة مع Lelo' : 'Explain with Lelo'}</span>
      </motion.button>
    </div>
  );
}
