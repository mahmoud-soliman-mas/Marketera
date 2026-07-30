'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ErrorBanner({ message, className, rtl = false }: { message: string; className?: string; rtl?: boolean }) {
  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className={cn(
        'flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400',
        'animate-[fadeInUp_0.3s_ease-out_both]',
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
