'use client';

import { cn } from '@/lib/utils';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  /** Optional header content (title, actions). */
  header?: React.ReactNode;
  padded?: boolean;
  variant?: 'default' | 'glass' | 'glass-strong';
}

export function SectionCard({ children, className, header, padded = true, variant = 'glass' }: SectionCardProps) {
  const variantClass = variant === 'glass' ? 'glass' : variant === 'glass-strong' ? 'glass-strong' : 'bg-card border border-border';
  return (
    <div
      className={cn(
        'rounded-2xl shadow-[0_2px_16px_hsl(var(--foreground)/0.04)] card-hover hover:shadow-[0_12px_32px_hsl(var(--foreground)/0.08)]',
        variantClass,
        className
      )}
    >
      {header && (
        <div className="border-b border-border/40 px-5 py-4 sm:px-6">
          {header}
        </div>
      )}
      <div className={cn(padded && 'p-5 sm:p-6')}>{children}</div>
    </div>
  );
}
