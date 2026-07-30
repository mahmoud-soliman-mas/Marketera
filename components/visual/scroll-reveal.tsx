'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Translate direction on reveal */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  once?: boolean;
}

/**
 * Reveal children with a fade + translate when scrolled into view.
 * Uses IntersectionObserver; falls back to visible if unsupported.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const hiddenTransform = {
    up: 'translateY(24px)',
    down: 'translateY(-24px)',
    left: 'translateX(24px)',
    right: 'translateX(-24px)',
    none: 'none',
  }[direction];

  return (
    <div
      ref={ref}
      className={cn('transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]', className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hiddenTransform,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
