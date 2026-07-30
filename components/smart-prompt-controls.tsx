'use client';

import { useState, useRef, useEffect } from 'react';
import { Sliders, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/settings';
import { useI18n } from '@/lib/i18n';

interface SmartPromptControlsProps {
  className?: string;
  /** Additional fields specific to a tool (platform, audience, etc.) */
  extraFields?: React.ReactNode;
  compact?: boolean;
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', labelAr: 'احترافي' },
  { value: 'casual', label: 'Casual', labelAr: 'عفوي' },
  { value: 'creative', label: 'Creative', labelAr: 'إبداعي' },
  { value: 'persuasive', label: 'Persuasive', labelAr: 'إقناعي' },
];

const PLATFORM_OPTIONS = [
  { value: 'general', label: 'General', labelAr: 'عام' },
  { value: 'facebook', label: 'Facebook', labelAr: 'فيسبوك' },
  { value: 'instagram', label: 'Instagram', labelAr: 'انستغرام' },
  { value: 'linkedin', label: 'LinkedIn', labelAr: 'لينكد إن' },
  { value: 'tiktok', label: 'TikTok', labelAr: 'تيك توك' },
  { value: 'youtube', label: 'YouTube', labelAr: 'يوتيوب' },
  { value: 'x', label: 'X (Twitter)', labelAr: 'إكس' },
];

const READING_LEVEL_OPTIONS = [
  { value: 'simple', label: 'Simple', labelAr: 'بسيط' },
  { value: 'intermediate', label: 'Intermediate', labelAr: 'متوسط' },
  { value: 'advanced', label: 'Advanced', labelAr: 'متقدم' },
];

export function SmartPromptControls({ className, extraFields, compact }: SmartPromptControlsProps) {
  const { settings, update } = useSettings();
  const { language, t } = useI18n();
  const isAr = language === 'ar';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2 text-xs font-semibold transition-all',
          open ? 'border-primary/40 bg-primary/5 text-primary' : 'text-muted-foreground hover:border-primary/30 hover:text-primary'
        )}
      >
        <Sliders className="h-3.5 w-3.5" />
        {isAr ? 'تحكم متقدم' : 'Advanced controls'}
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-72 rounded-2xl glass-strong p-4 shadow-xl animate-scale-in" style={{ transformOrigin: 'top right' }}>
          {/* Creativity slider */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                {isAr ? 'الإبداع' : 'Creativity'}
              </label>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {settings.creativity}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={settings.creativity}
              onChange={(e) => update('creativity', Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/60">
              <span>{isAr ? 'دقيق' : 'Precise'}</span>
              <span>{isAr ? 'متوازن' : 'Balanced'}</span>
              <span>{isAr ? 'إبداعي' : 'Creative'}</span>
            </div>
          </div>

          {/* Tone */}
          <ControlRow label={isAr ? 'النبرة' : 'Tone'}>
            <ChipSelect
              value={settings.outputStyle}
              options={TONE_OPTIONS}
              isAr={isAr}
              onChange={(v) => update('outputStyle', v as typeof settings.outputStyle)}
            />
          </ControlRow>

          {/* Reading level */}
          <ControlRow label={isAr ? 'مستوى القراءة' : 'Reading Level'}>
            <ChipSelect
              value={'intermediate'}
              options={READING_LEVEL_OPTIONS}
              isAr={isAr}
              onChange={() => {}}
            />
          </ControlRow>

          {/* Platform */}
          <ControlRow label={isAr ? 'المنصة' : 'Platform'}>
            <ChipSelect
              value={'general'}
              options={PLATFORM_OPTIONS}
              isAr={isAr}
              onChange={() => {}}
            />
          </ControlRow>

          {/* Mood */}
          <ControlRow label={isAr ? 'المزاج' : 'Mood'}>
            <select
              value={settings.mood}
              onChange={(e) => update('mood', e.target.value as typeof settings.mood)}
              className="w-full rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="neutral">{isAr ? 'محايد' : 'Neutral'}</option>
              <option value="energetic">{isAr ? 'حيوي' : 'Energetic'}</option>
              <option value="calm">{isAr ? 'هادئ' : 'Calm'}</option>
              <option value="bold">{isAr ? 'جريء' : 'Bold'}</option>
              <option value="playful">{isAr ? 'مرح' : 'Playful'}</option>
              <option value="luxury">{isAr ? 'فاخر' : 'Luxury'}</option>
            </select>
          </ControlRow>

          {/* Output mode */}
          <ControlRow label={isAr ? 'وضع الإخراج' : 'Output Mode'}>
            <ChipSelect
              value={settings.outputMode}
              options={[
                { value: 'draft', label: 'Draft', labelAr: 'مسودة' },
                { value: 'final', label: 'Final', labelAr: 'نهائي' },
              ]}
              isAr={isAr}
              onChange={(v) => update('outputMode', v as typeof settings.outputMode)}
            />
          </ControlRow>

          {extraFields}

          <div className="mt-3 border-t border-border/40 pt-3">
            <p className="text-[10px] text-muted-foreground/60">
              {isAr
                ? 'تُطبق هذه الضوابط على كل توليد تلقائياً.'
                : 'These controls apply to every generation automatically.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-xs font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

function ChipSelect({
  value, options, isAr, onChange,
}: {
  value: string;
  options: { value: string; label: string; labelAr: string }[];
  isAr: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all',
              active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-primary'
            )}
          >
            {isAr ? opt.labelAr : opt.label}
            {active && <Check className="h-3 w-3" />}
          </button>
        );
      })}
    </div>
  );
}
