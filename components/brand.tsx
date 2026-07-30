'use client';

import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandMark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-sm',
        dims,
        className
      )}
    >
      <Zap className={cn('text-white', icon)} fill="white" />
    </span>
  );
}

export function BrandName({ className, subtle = false }: { className?: string; subtle?: boolean }) {
  return (
    <span className={cn('font-bold tracking-tight text-slate-900 dark:text-white', className)}>
      Marketra{subtle && <span className="text-slate-400 dark:text-slate-500 font-medium"> AI</span>}
    </span>
  );
}

export function PoweredByMW({ className }: { className?: string }) {
  return (
    <span className={cn('text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400', className)}>
      Powered by <span className="text-sky-600 dark:text-sky-400">MW</span>
    </span>
  );
}
