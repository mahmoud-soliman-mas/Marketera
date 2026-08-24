'use client';

import { ReactNode } from 'react';
import { useIntro } from '@/hooks/useIntro';
import Intro from '@/components/intro/intro';
import { I18nProvider } from '@/lib/i18n';

function ClientLayoutContent({ children }: { children: ReactNode }) {
  const { ready, showIntro, finishIntro } = useIntro();

  return (
    <>
      {ready && showIntro && <Intro onFinish={finishIntro} />}
      {children}
    </>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </I18nProvider>
  );
}
