'use client';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700',
        'bg-slate-50/50 dark:bg-slate-800/40 px-6 py-14 text-center',
        className
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-slate-400 dark:text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
