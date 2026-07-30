'use client';

import { useState } from 'react';
import { Check, Copy, BookOpen, Zap, Heart, Star, TrendingUp, Shield, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceOutputButton } from '@/components/voice/voice-buttons';

export interface ContentIdea {
  title: string;
  contentType: string;
  category: string;
  description: string;
}

interface ContentIdeaCardProps {
  idea: ContentIdea;
  index: number;
  rtl?: boolean;
}

const CATEGORY_CONFIG: Record<string, { label: string; labelAr: string; color: string; bg: string; icon: React.ElementType }> = {
  Educational:       { label: 'Educational',    labelAr: 'تعليمي',        color: 'text-sky-700',     bg: 'bg-sky-50 ring-sky-200',      icon: BookOpen },
  'Problem-Solving': { label: 'Problem-Solving', labelAr: 'حل مشكلة',     color: 'text-amber-700',   bg: 'bg-amber-50 ring-amber-200',   icon: Zap },
  Storytelling:      { label: 'Storytelling',    labelAr: 'قصص',           color: 'text-rose-700',    bg: 'bg-rose-50 ring-rose-200',     icon: Heart },
  Engagement:        { label: 'Engagement',      labelAr: 'تفاعل',         color: 'text-violet-700',  bg: 'bg-violet-50 ring-violet-200', icon: Star },
  Viral:             { label: 'Viral',           labelAr: 'فيروسي',        color: 'text-red-700',     bg: 'bg-red-50 ring-red-200',       icon: TrendingUp },
  Authority:         { label: 'Authority',       labelAr: 'بناء سلطة',    color: 'text-slate-700',   bg: 'bg-slate-100 ring-slate-300',  icon: Shield },
  Promotional:       { label: 'Promotional',     labelAr: 'ترويجي',        color: 'text-emerald-700', bg: 'bg-emerald-50 ring-emerald-200', icon: Tag },
  // Arabic keys too
  'تعليمي':    { label: 'تعليمي',      labelAr: 'تعليمي',     color: 'text-sky-700',     bg: 'bg-sky-50 ring-sky-200',      icon: BookOpen },
  'حل مشكلة': { label: 'حل مشكلة',    labelAr: 'حل مشكلة',   color: 'text-amber-700',   bg: 'bg-amber-50 ring-amber-200',   icon: Zap },
  'قصص':       { label: 'قصص',        labelAr: 'قصص',         color: 'text-rose-700',    bg: 'bg-rose-50 ring-rose-200',     icon: Heart },
  'تفاعل':     { label: 'تفاعل',      labelAr: 'تفاعل',       color: 'text-violet-700',  bg: 'bg-violet-50 ring-violet-200', icon: Star },
  'فيروسي':    { label: 'فيروسي',     labelAr: 'فيروسي',      color: 'text-red-700',     bg: 'bg-red-50 ring-red-200',       icon: TrendingUp },
  'بناء سلطة': { label: 'بناء سلطة', labelAr: 'بناء سلطة',   color: 'text-slate-700',   bg: 'bg-slate-100 ring-slate-300',  icon: Shield },
  'ترويجي':    { label: 'ترويجي',     labelAr: 'ترويجي',      color: 'text-emerald-700', bg: 'bg-emerald-50 ring-emerald-200', icon: Tag },
};

const TYPE_COLOR: Record<string, string> = {
  Post:      'bg-blue-50 text-blue-700 ring-blue-200',
  Reel:      'bg-pink-50 text-pink-700 ring-pink-200',
  Video:     'bg-red-50 text-red-700 ring-red-200',
  Carousel:  'bg-orange-50 text-orange-700 ring-orange-200',
  Blog:      'bg-teal-50 text-teal-700 ring-teal-200',
  // Arabic
  'بوست':    'bg-blue-50 text-blue-700 ring-blue-200',
  'ريل':     'bg-pink-50 text-pink-700 ring-pink-200',
  'فيديو':   'bg-red-50 text-red-700 ring-red-200',
  'كاروسيل': 'bg-orange-50 text-orange-700 ring-orange-200',
  'بلوج':    'bg-teal-50 text-teal-700 ring-teal-200',
};

export function ContentIdeaCard({ idea, index, rtl = false }: ContentIdeaCardProps) {
  const [copied, setCopied] = useState(false);

  const cat = CATEGORY_CONFIG[idea.category] ?? {
    label: idea.category, labelAr: idea.category, color: 'text-slate-700', bg: 'bg-slate-100 ring-slate-300', icon: Star,
  };
  const CatIcon = cat.icon;
  const typeClass = TYPE_COLOR[idea.contentType] ?? 'bg-slate-100 text-slate-700 ring-slate-200';

  const copyText = `${idea.title}\n[${idea.contentType}] ${idea.category}\n${idea.description}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  };

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className={cn(
        'group relative rounded-2xl border border-slate-100 bg-white p-5',
        'shadow-[0_1px_6px_rgba(0,0,0,0.05)] transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)]',
        'animate-[fadeInUp_0.4s_ease-out_both]'
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Top row */}
      <div className={cn('flex items-start gap-3', rtl && 'flex-row-reverse')}>
        {/* Number */}
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-xs font-bold text-white shadow-sm">
          {index + 1}
        </div>

        {/* Title + badges */}
        <div className="min-w-0 flex-1">
          <p className={cn(
            'text-[15px] font-semibold leading-snug text-slate-900',
            rtl && 'text-right'
          )}>
            {idea.title}
          </p>
          <div className={cn('mt-2 flex flex-wrap gap-2', rtl && 'justify-end')}>
            {/* Content type badge */}
            <span className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1',
              typeClass
            )}>
              {idea.contentType}
            </span>
            {/* Category badge */}
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1',
              cat.bg, cat.color
            )}>
              <CatIcon className="h-3 w-3" />
              {rtl ? cat.labelAr : cat.label}
            </span>
          </div>
        </div>

        {/* Voice button */}
        <VoiceOutputButton text={`${idea.title}. ${idea.description}`} lang={rtl ? 'ar' : 'en'} />

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy idea"
          className={cn(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-200',
            copied
              ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
              : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600'
          )}
        >
          {copied
            ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            : <Copy className="h-3.5 w-3.5" />
          }
        </button>
      </div>

      {/* Description */}
      <p className={cn(
        'mt-3 pl-11 text-sm leading-relaxed text-slate-500',
        rtl && 'pl-0 pr-11 text-right'
      )}>
        {idea.description}
      </p>
    </div>
  );
}
