'use client';

import { ReactNode } from 'react';
import { useIntro } from '@/hooks/useIntro';
import Intro from '@/components/intro/intro';
import { I18nProvider } from '@/lib/i18n';

function ClientLayoutContent({ children }: { children: ReactNode }) {
  const { ready, showIntro, finishIntro } = useIntro();

  if (!ready) {
    return <div className="fixed inset-0 z-[9999] bg-[#030914]" aria-hidden="true" />;
  }

  if (showIntro) {
    return <Intro onFinish={finishIntro} />;
  }

  return <>{children}</>;
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </I18nProvider>
  );
}
