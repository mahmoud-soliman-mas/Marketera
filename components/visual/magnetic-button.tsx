'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Magnetic button — subtly translates toward the cursor on hover.
 * Respects reduced-motion via the global CSS media query.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.3,
  onClick,
  type = 'button',
  disabled,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || disabled) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0, 0)';
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn('magnetic', className)}
    >
      {children}
    </button>
  );
}
