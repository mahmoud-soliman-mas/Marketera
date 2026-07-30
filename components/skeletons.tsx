'use client';

import { cn } from '@/lib/utils';

export function HookSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />
      <div className="flex-1 space-y-2.5">
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
        <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
      </div>
      <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />
    </div>
  );
}

export function IdeaSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
          <div className="flex gap-2">
            <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
            <div className="h-5 w-24 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2 pl-11">
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5, kind = 'hook' }: { count?: number; kind?: 'hook' | 'idea' }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) =>
        kind === 'hook' ? <HookSkeleton key={i} index={i} /> : <IdeaSkeleton key={i} index={i} />
      )}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return <div className={cn('h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60', className)} />;
}
