'use client';

import { cn } from '@/lib/utils';

/**
 * Animated aurora background with floating gradient blobs.
 * Fixed-position, pointer-events-none, sits behind all content.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        className
      )}
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Aurora blobs */}
      <div
        className="aurora-blob animate-aurora-1"
        style={{
          top: '-10%',
          left: '-5%',
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, hsl(var(--aurora-1) / 0.5) 0%, transparent 70%)',
        }}
      />
      <div
        className="aurora-blob animate-aurora-2"
        style={{
          top: '20%',
          right: '-10%',
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, hsl(var(--aurora-2) / 0.45) 0%, transparent 70%)',
        }}
      />
      <div
        className="aurora-blob animate-aurora-3"
        style={{
          bottom: '-15%',
          left: '30%',
          width: '38vw',
          height: '38vw',
          background: 'radial-gradient(circle, hsl(var(--aurora-3) / 0.4) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
    </div>
  );
}
