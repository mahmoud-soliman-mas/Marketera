import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketra.ai';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    description: 'Marketra AI is an all-in-one AI marketing platform for creating viral hooks, ad copy, SEO content, marketing strategies, and high-converting campaigns powered by AI.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1322' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var autoKey = 'ai-marketing-ui-language-auto';
                  var langKey = 'ai-marketing-ui-language';
                  var settingsKey = 'ai-marketing-settings';
                  var isAuto = localStorage.getItem(autoKey);
                  var savedLang = localStorage.getItem(langKey);
                  // Default to Arabic + RTL for first-time visitors
                  var lang = 'ar';
                  var dir = 'rtl';

                  if (isAuto === 'false' && (savedLang === 'ar' || savedLang === 'en')) {
                    lang = savedLang;
                  } else if (isAuto === 'true') {
                    // Auto mode: detect browser language, default to Arabic
                    var browserLang = navigator.language || navigator.userLanguage || 'ar';
                    lang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'ar';
                  }

                  dir = lang === 'ar' ? 'rtl' : 'ltr';
                  document.documentElement.lang = lang;
                  document.documentElement.dir = dir;

                  // Apply theme before paint — default to Light for first-time visitors
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
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Marketra AI" />
        <meta name="apple-mobile-web-app-title" content="Marketra AI" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${mono.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
