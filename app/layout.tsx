// @ts-ignore: CSS imports are handled by Next.js
import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from '@/components/ui/sonner';
import { Viewport } from 'next/dist/lib/metadata/types/extra-types';

// معالجة آمنة لـ SITE_URL للوقاية من أخطاء new URL()
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketra.ai';
const safeMetadataBase = (() => {
  try {
    return new URL(SITE_URL);
  } catch {
    return new URL('https://marketra.ai');
  }
})();

export const metadata: Metadata = {
  metadataBase: safeMetadataBase,
  title: {
    default: 'Marketra AI',
    template: '%s · Marketra AI',
  },
  description:
    'Marketra AI is an all-in-one AI marketing platform for creating viral hooks, ad copy, SEO content, marketing strategies, and high-converting campaigns powered by AI.',
  keywords: [
    'AI marketing',
    'marketing hooks',
    'ad copy generator',
    'content ideas',
    'SEO keywords',
    'marketing plan',
    'AI copywriting',
    'viral hooks',
    'email marketing',
    'social media generator',
  ],
  authors: [{ name: 'Marketra AI' }],
  openGraph: {
    title: 'Marketra AI',
    description:
      'Marketra AI is an all-in-one AI marketing platform for creating viral hooks, ad copy, SEO content, marketing strategies, and high-converting campaigns powered by AI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketra AI',
    description:
      'Marketra AI is an all-in-one AI marketing platform for creating viral hooks, ad copy, SEO content, marketing strategies, and high-converting campaigns powered by AI.',
  },
  robots: { index: true, follow: true },
};

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
  { media: '(prefers-color-scheme: dark)', color: '#0c1322' },
];

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// السكريبت المسؤول عن ضبط الثيم واللغة قبل الـ Paint لمنع الـ Flicker
const themeAndLangScript = `
  (function() {
    try {
      var autoKey = 'ai-marketing-ui-language-auto';
      var langKey = 'ai-marketing-ui-language';
      var settingsKey = 'ai-marketing-settings';
      var isAuto = localStorage.getItem(autoKey);
      var savedLang = localStorage.getItem(langKey);
      var lang = 'ar';
      var dir = 'rtl';

      if (isAuto === 'false' && (savedLang === 'ar' || savedLang === 'en')) {
        lang = savedLang;
      } else if (isAuto === 'true') {
        var browserLang = navigator.language || navigator.userLanguage || 'ar';
        lang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'ar';
      }

      dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;

      var raw = localStorage.getItem(settingsKey);
      var themeMode = 'light';
      if (raw) {
        try { themeMode = JSON.parse(raw).themeMode || 'light'; } catch(e) {}
      }
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = themeMode === 'dark' || (themeMode === 'system' && prefersDark);
      if (isDark) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* استدعاء الخطوط عبر CDN لتفادي أخطاء الشبكة والـ Timeout مع next/font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Marketra AI" />
        <meta name="apple-mobile-web-app-title" content="Marketra AI" />

        <Script
          id="theme-lang-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeAndLangScript }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}