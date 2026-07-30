'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ElementType;
  accent?: string;
  trend?: string;
  className?: string;
  /** Animate the numeric value counting up on mount */
  animateValue?: boolean;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = 'from-sky-500 to-cyan-400',
  trend,
  className,
  animateValue,
}: StatCardProps) {
  const displayValue = useCountUp(typeof value === 'number' && animateValue ? value : 0, animateValue ?? false);

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl glass p-5',
        'card-hover hover:shadow-[0_12px_32px_hsl(var(--foreground)/0.08)]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {animateValue && typeof value === 'number' ? displayValue : value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110',
            accent
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {trend && (
        <p className="mt-3 text-[11px] font-semibold text-muted-foreground/70">{trend}</p>
      )}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20',
          accent
        )}
      />
    </div>
  );
}

/** Count-up animation hook for numeric values. */
function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || target === 0) {
      setValue(target);
      return;
    }
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, enabled]);

  return value;
}
