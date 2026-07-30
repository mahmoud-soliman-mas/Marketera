'use client';

import { Sparkles, Zap, TrendingUp } from 'lucide-react';

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 shadow-sm">
            <Zap className="h-4 w-4 text-white" fill="white" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            Marketra AI
          </span>
        </div>
        <a
          href="https://groq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
        >
          <TrendingUp className="h-3 w-3" />
          Powered by Groq
        </a>
      </div>
    </nav>
  );
}

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-white">
      {/* Background gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14,165,233,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-16 text-center sm:pt-24 sm:pb-20">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-600 shadow-sm">
          <Sparkles className="h-3 w-3" />
          AI-Powered Marketing Suite
        </span>

        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Marketra{' '}
          <span
            className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent"
          >
            AI
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-500 sm:text-xl">
          Generate high-converting marketing hooks, content ideas, ad copy,
          and marketing insights using AI.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {[
            { label: 'Marketing Hooks' },
            { label: 'Ad Copy' },
            { label: 'Content Ideas' },
            { label: 'Insights' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-sm font-medium text-slate-500"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
