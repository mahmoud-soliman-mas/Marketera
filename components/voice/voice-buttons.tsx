'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { voiceService } from '@/lib/voice/service';
import type { VoiceStatus } from '@/lib/voice/types';
import { toast } from 'sonner';
import { useAccessibility } from '@/lib/accessibility/provider';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import type { ToolId } from '@/lib/tools';

// ─── Voice Input Button ─────────────────────────────────────────────────────────

interface VoiceInputButtonProps {
  onResult?: (transcript: string) => void;
  onInterim?: (transcript: string) => void;
  className?: string;
  fillField?: (text: string) => void;
  autoSubmit?: boolean;
  submitForm?: () => void;
}

export function VoiceInputButton({
  onResult,
  onInterim,
  className,
  fillField,
  autoSubmit,
  submitForm,
}: VoiceInputButtonProps) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [isAvailable, setIsAvailable] = useState(false);
  const { accessibilityMode } = useAccessibility();

  useEffect(() => {
    setIsAvailable(voiceService.hasSTT());
    const unsubscribe = voiceService.stt.subscribeStatus(setStatus);
    return unsubscribe;
  }, []);

  const handleToggle = useCallback(async () => {
    if (!isAvailable) {
      toast.error('Voice features are not supported in this browser.');
      return;
    }

    if (status === 'listening') {
      voiceService.stt.stop();
    } else {
      try {
        await voiceService.stt.start();
      } catch (e) {
        toast.error('Failed to start speech recognition. Please try again.');
      }
    }
  }, [status, isAvailable]);

  useEffect(() => {
    const unsubscribe = voiceService.stt.subscribe((result) => {
      if (result.isFinal && onResult) {
        onResult(result.transcript);
        if (fillField) {
          fillField(result.transcript);
        }
        if (autoSubmit && submitForm) {
          // Delay to allow field to fill
          setTimeout(() => submitForm(), 100);
        }
      } else if (!result.isFinal && onInterim) {
        onInterim(result.transcript);
        if (fillField) {
          fillField(result.transcript);
        }
      }
    });
    return unsubscribe;
  }, [onResult, onInterim, fillField, autoSubmit, submitForm]);

  if (!isAvailable) {
    return (
      <Button
        variant="ghost"
        size={accessibilityMode ? 'lg' : 'icon'}
        disabled
        className={cn(
          'relative',
          accessibilityMode && 'h-14 w-14 rounded-xl',
          className
        )}
        title="Voice features are not supported in this browser"
      >
        <MicOff className={cn('text-muted-foreground', accessibilityMode ? 'h-6 w-6' : 'h-4 w-4')} />
        {accessibilityMode && (
          <span className="sr-only">Voice not available</span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={status === 'listening' ? 'default' : 'ghost'}
      size={accessibilityMode ? 'lg' : 'icon'}
      onClick={handleToggle}
      className={cn(
        'relative',
        status === 'listening' && 'bg-rose-500 hover:bg-rose-600 text-white',
        accessibilityMode && 'h-14 w-14 rounded-xl',
        className
      )}
      title={status === 'listening' ? 'Stop listening' : 'Start voice input'}
    >
      {status === 'listening' ? (
        <div className="relative">
          <Mic className={accessibilityMode ? 'h-6 w-6' : 'h-4 w-4'} />
          <span className="absolute inset-0 animate-ping rounded-full bg-rose-400 opacity-75" />
        </div>
      ) : (
        <Mic className={accessibilityMode ? 'h-6 w-6' : 'h-4 w-4'} />
      )}
      {accessibilityMode && (
        <span className="sr-only">
          {status === 'listening' ? 'Stop listening' : 'Start voice input'}
        </span>
      )}
    </Button>
  );
}

// ─── Voice Output Button ────────────────────────────────────────────────────────

interface VoiceOutputButtonProps {
  text?: string;
  className?: string;
  lang?: 'ar' | 'en';
}

export function VoiceOutputButton({ text, className, lang }: VoiceOutputButtonProps) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [isAvailable, setIsAvailable] = useState(false);
  const { accessibilityMode } = useAccessibility();
  const { language } = useI18n();

  useEffect(() => {
    setIsAvailable(voiceService.hasTTS());
    const unsubscribe = voiceService.tts.subscribeStatus(setStatus);
    return unsubscribe;
  }, []);

  const handleSpeak = useCallback(async () => {
    if (!text || !isAvailable) return;

    if (status === 'speaking') {
      voiceService.tts.stop();
      return;
    }

    try {
      const speakLang = lang || language;
      await voiceService.tts.speak({
        text,
        lang: speakLang,
        rate: accessibilityMode ? 0.85 : 1.0, // Slower for accessibility mode
      });
    } catch (e) {
      toast.error('Failed to speak text');
    }
  }, [text, status, isAvailable, lang, language, accessibilityMode]);

  if (!isAvailable) {
    return (
      <Button
        variant="ghost"
        size={accessibilityMode ? 'lg' : 'icon'}
        disabled
        className={cn(
          'relative',
          accessibilityMode && 'h-14 w-14 rounded-xl',
          className
        )}
        title="Voice features are not supported in this browser"
      >
        <VolumeX className={cn('text-muted-foreground', accessibilityMode ? 'h-6 w-6' : 'h-4 w-4')} />
        {accessibilityMode && (
          <span className="sr-only">Voice not available</span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={status === 'speaking' ? 'default' : 'ghost'}
      size={accessibilityMode ? 'lg' : 'icon'}
      onClick={handleSpeak}
      disabled={!text}
      className={cn(
        status === 'speaking' && 'bg-emerald-500 hover:bg-emerald-600 text-white',
        accessibilityMode && 'h-14 w-14 rounded-xl',
        className
      )}
      title={status === 'speaking' ? 'Stop speaking' : 'Read aloud'}
    >
      {status === 'speaking' ? (
        <Loader2 className={cn('animate-spin', accessibilityMode ? 'h-6 w-6' : 'h-4 w-4')} />
      ) : (
        <Volume2 className={accessibilityMode ? 'h-6 w-6' : 'h-4 w-4'} />
      )}
      {accessibilityMode && (
        <span className="sr-only">
          {status === 'speaking' ? 'Stop speaking' : 'Read aloud'}
        </span>
      )}
    </Button>
  );
}

// ─── Tool Help Button ────────────────────────────────────────────────────────────

interface ToolHelpButtonProps {
  toolId: ToolId;
  className?: string;
  onHelpClick?: () => void;
}

export function ToolHelpButton({ toolId, className, onHelpClick }: ToolHelpButtonProps) {
  const { speakExplanation, accessibilityMode } = useAccessibility();
  const { language, t } = useI18n();
  const [isExplaining, setIsExplaining] = useState(false);

  const handleExplain = useCallback(async () => {
    setIsExplaining(true);
    try {
      if (onHelpClick) {
        onHelpClick();
      }
      await speakExplanation(toolId);
    } finally {
      setIsExplaining(false);
    }
  }, [toolId, speakExplanation, onHelpClick]);

  return (
    <Button
      variant="ghost"
      size={accessibilityMode ? 'lg' : 'icon'}
      onClick={handleExplain}
      disabled={isExplaining}
      className={cn(
        'text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-900/20',
        accessibilityMode && 'h-14 w-14 rounded-xl text-lg',
        className
      )}
      title={language === 'ar' ? 'شرح هذه الأداة' : 'Explain this tool'}
    >
      {isExplaining ? (
        <Loader2 className={cn('animate-spin', accessibilityMode ? 'h-6 w-6' : 'h-4 w-4')} />
      ) : (
        <HelpCircle className={accessibilityMode ? 'h-6 w-6' : 'h-4 w-4'} />
      )}
      {accessibilityMode && (
        <span className="sr-only">Explain this tool</span>
      )}
    </Button>
  );
}

// ─── Combined Voice Status Badge ─────────────────────────────────────────────────

export function VoiceStatusBadge({ className }: { className?: string }) {
  const [sttAvailable, setSttAvailable] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const { accessibilityMode } = useAccessibility();
  const { language } = useI18n();

  useEffect(() => {
    setSttAvailable(voiceService.hasSTT());
    setTtsAvailable(voiceService.hasTTS());
  }, []);

  if (!sttAvailable && !ttsAvailable) {
    return (
      <div className={cn(
        'flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs',
        accessibilityMode && 'text-sm px-4 py-2',
        className
      )}>
        <VolumeX className={cn('text-muted-foreground', accessibilityMode ? 'h-5 w-5' : 'h-3 w-3')} />
        <span className="text-muted-foreground">
          {language === 'ar' ? 'الصوت غير مدعوم' : 'Voice not supported'}
        </span>
      </div>
    );
  }

  const features = [];
  if (sttAvailable) features.push(language === 'ar' ? 'الإدخال الصوتي' : 'Voice Input');
  if (ttsAvailable) features.push(language === 'ar' ? 'الإخراج الصوتي' : 'Voice Output');

  return (
    <div className={cn(
      'flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 text-xs',
      accessibilityMode && 'text-sm px-4 py-2',
      className
    )}>
      <Volume2 className={cn('text-emerald-600 dark:text-emerald-400', accessibilityMode ? 'h-5 w-5' : 'h-3 w-3')} />
      <span className="text-emerald-700 dark:text-emerald-300">{features.join(' + ')}</span>
    </div>
  );
}

// ─── Voice Input for Fields ─────────────────────────────────────────────────────

interface VoiceFieldInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function VoiceFieldInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  className,
  inputClassName,
}: VoiceFieldInputProps) {
  const { accessibilityMode } = useAccessibility();
  const { language } = useI18n();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/40',
          accessibilityMode && 'text-lg py-4 px-5',
          inputClassName
        )}
      />
      <VoiceInputButton
        fillField={onChange}
        autoSubmit={!!onSubmit}
        submitForm={onSubmit}
        className={accessibilityMode ? 'h-14 w-14' : 'h-10 w-10'}
      />
    </div>
  );
}
