'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfettiBurstProps {
  /** Trigger a burst by changing this value. */
  trigger: number;
  className?: string;
}

const COLORS = [
  'hsl(199 89% 55%)',
  'hsl(173 80% 45%)',
  'hsl(142 71% 50%)',
  'hsl(38 92% 55%)',
  'hsl(280 70% 60%)',
];

/**
 * Lightweight confetti burst — no external deps.
 * Renders ~40 pieces that animate outward when `trigger` changes.
 */
export function ConfettiBurst({ trigger, className }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    x: number;
    y: number;
    rot: number;
    color: string;
    size: number;
  }>>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    const next = Array.from({ length: 40 }, (_, i) => ({
      id: i + trigger * 1000,
      x: (Math.random() - 0.5) * 400,
      y: -(Math.random() * 300 + 100),
      rot: (Math.random() - 0.5) * 720,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
    }));
    setPieces(next);
    setActive(true);
    const t = setTimeout(() => {
      setActive(false);
      setPieces([]);
    }, 1200);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!active || pieces.length === 0) return null;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none fixed left-1/2 top-1/3 z-[100] flex items-center justify-center', className)}
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute animate-confetti"
          style={
            {
              '--confetti-x': `${p.x}px`,
              '--confetti-y': `${p.y}px`,
              '--confetti-rot': `${p.rot}deg`,
              width: p.size,
              height: p.size * 0.4,
              background: p.color,
              borderRadius: 2,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="animate-scale-in">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
      </div>
    </div>
  );
}
