'use client';

import { ReactNode } from 'react';
import { useIntro } from '@/hooks/useIntro';
import Intro from '@/components/intro/intro';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { ready, showIntro, finishIntro } = useIntro();

  return (
    <>
      {ready && showIntro && <Intro onFinish={finishIntro} />}
      {children}
    </>
  );
}
