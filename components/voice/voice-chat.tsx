'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { voiceService } from '@/lib/voice/service';
import type { VoiceStatus } from '@/lib/voice/types';
import { toast } from 'sonner';
import { useSettings } from '@/lib/settings';
import { useI18n } from '@/lib/i18n';

// ─── Voice Waveform Animation ───────────────────────────────────────────────────

function WaveformAnimation({ active, color = 'sky' }: { active: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-full transition-all duration-150',
            color === 'rose' ? 'bg-rose-500' : 'bg-sky-500',
            active ? 'animate-[wave_0.5s_ease-in-out_infinite]' : ''
          )}
          style={{
            height: active ? `${Math.random() * 24 + 8}px` : '4px',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Enhanced Voice Input Button ───────────────────────────────────────────────

interface VoiceInputButtonProps {
  onResult?: (transcript: string) => void;
  onInterim?: (transcript: string) => void;
  fillField?: (text: string) => void;
  autoSubmit?: boolean;
  submitForm?: () => void;
  continuous?: boolean;
  showWaveform?: boolean;
  size?: 'default' | 'lg' | 'xl';
  className?: string;
}

export function VoiceInputButton({
  onResult,
  onInterim,
  fillField,
  autoSubmit,
  submitForm,
  continuous = false,
  showWaveform = true,
  size = 'default',
  className,
}: VoiceInputButtonProps) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [isAvailable, setIsAvailable] = useState(false);
  const [interimText, setInterimText] = useState('');
  const { settings } = useSettings();
  const { language } = useI18n();

  const sizeClasses = {
    default: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };

  const iconSizes = {
    default: 'h-4 w-4',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  useEffect(() => {
    setIsAvailable(voiceService.hasSTT());
    const unsubscribe = voiceService.stt.subscribeStatus(setStatus);
    return unsubscribe;
  }, []);

  const handleToggle = useCallback(async () => {
    if (!isAvailable) {
      toast.error(language === 'ar' ? 'المتصفح لا يدعم الإدخال الصوتي' : 'Voice features are not supported in this browser.');
      return;
    }

    if (status === 'listening') {
      voiceService.stt.stop();
    } else {
      try {
        // Auto-set language based on browser
        voiceService.stt.setLanguage(language === 'ar' ? 'ar' : 'en');
        await voiceService.stt.start();
      } catch (e) {
        toast.error(language === 'ar' ? 'فشل بدء التسجيل' : 'Failed to start speech recognition');
      }
    }
  }, [status, isAvailable, language]);

  useEffect(() => {
    const unsubscribe = voiceService.stt.subscribe((result) => {
      if (result.isFinal && onResult) {
        onResult(result.transcript);
        if (fillField) fillField(result.transcript);
        if (autoSubmit && submitForm) {
          setTimeout(() => submitForm(), 100);
        }
        setInterimText('');
        // If continuous mode, restart listening
        if (continuous && status === 'listening') {
          setTimeout(() => {
            voiceService.stt.start().catch(() => {});
          }, 300);
        }
      } else if (!result.isFinal) {
        setInterimText(result.transcript);
        onInterim?.(result.transcript);
        if (fillField) fillField(result.transcript);
      }
    });
    return unsubscribe;
  }, [onResult, onInterim, fillField, autoSubmit, submitForm, continuous, status]);

  if (!isAvailable) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(sizeClasses[size], className)}
        title={language === 'ar' ? 'الصوت غير مدعوم' : 'Voice not supported'}
      >
        <MicOff className={iconSizes[size]} />
      </Button>
    );
  }

  return (
    <div className="relative flex items-center">
      <Button
        variant={status === 'listening' ? 'default' : 'ghost'}
        size="icon"
        onClick={handleToggle}
        className={cn(
          'relative transition-all duration-300',
          sizeClasses[size],
          status === 'listening' && 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30',
          className
        )}
        title={status === 'listening' ? (language === 'ar' ? 'إيقاف' : 'Stop listening') : (language === 'ar' ? 'ابدأ التسجيل' : 'Start voice input')}
      >
        {status === 'listening' ? (
          <div className="relative">
            {showWaveform ? (
              <WaveformAnimation active color="rose" />
            ) : (
              <>
                <Mic className={iconSizes[size]} />
                <span className="absolute inset-0 animate-ping rounded-full bg-rose-400 opacity-50" />
              </>
            )}
          </div>
        ) : (
          <Mic className={iconSizes[size]} />
        )}
      </Button>

      {/* Interim text bubble */}
      {status === 'listening' && interimText && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap max-w-xs truncate">
          {interimText}
        </div>
      )}
    </div>
  );
}

// ─── Enhanced Voice Output Button ──────────────────────────────────────────────

interface VoiceOutputButtonProps {
  text?: string;
  lang?: 'ar' | 'en';
  autoDetect?: boolean;
  showSpeed?: boolean;
  size?: 'default' | 'lg' | 'xl';
  className?: string;
}

export function VoiceOutputButton({
  text,
  lang,
  autoDetect = true,
  showSpeed = false,
  size = 'default',
  className,
}: VoiceOutputButtonProps) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [isAvailable, setIsAvailable] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'0.75' | '1' | '1.25' | '1.5' | '2'>('1');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const { settings } = useSettings();
  const { language } = useI18n();

  const sizeClasses = {
    default: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const iconSizes = {
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  };

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
      const detectedLang = autoDetect && !lang ? (language === 'ar' ? 'ar' : 'en') : lang;
      const speed = parseFloat(playbackSpeed);

      await voiceService.tts.speak({
        text,
        lang: detectedLang,
        rate: settings.accessibilityMode ? speed * 0.9 : speed,
      });
    } catch {
      toast.error(language === 'ar' ? 'فشل قراءة النص' : 'Failed to speak text');
    }
  }, [text, status, isAvailable, lang, autoDetect, language, settings.accessibilityMode, playbackSpeed]);

  const speedOptions: Array<{ value: typeof playbackSpeed; label: string }> = [
    { value: '0.75', label: '0.75x' },
    { value: '1', label: '1x' },
    { value: '1.25', label: '1.25x' },
    { value: '1.5', label: '1.5x' },
    { value: '2', label: '2x' },
  ];

  if (!isAvailable) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(sizeClasses[size], className)}
        title={language === 'ar' ? 'الصوت غير مدعوم' : 'Voice not supported'}
      >
        <VolumeX className={iconSizes[size]} />
      </Button>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <Button
        variant={status === 'speaking' ? 'default' : 'ghost'}
        size="icon"
        onClick={handleSpeak}
        disabled={!text}
        className={cn(
          'transition-all duration-300',
          sizeClasses[size],
          status === 'speaking' && 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30',
          className
        )}
        title={status === 'speaking' ? (language === 'ar' ? 'إيقاف' : 'Stop') : (language === 'ar' ? 'استمع' : 'Read aloud')}
      >
        {status === 'speaking' ? (
          <div className="relative animate-pulse">
            <WaveformAnimation active color="emerald" />
          </div>
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
      </Button>

      {/* Speed selector */}
      {showSpeed && (
        <div className="relative ml-1">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded"
          >
            {playbackSpeed}x
          </button>
          {showSpeedMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
              {speedOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setPlaybackSpeed(opt.value); setShowSpeedMenu(false); }}
                  className={cn(
                    'block w-full text-left px-3 py-1 text-xs whitespace-nowrap',
                    playbackSpeed === opt.value
                      ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Voice Chat Mode Component ─────────────────────────────────────────────────

interface VoiceChatProps {
  onMessage?: (text: string) => void;
  onResponse?: (text: string) => Promise<string>;
  className?: string;
}

export function VoiceChat({ onMessage, onResponse, className }: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const { language } = useI18n();

  const handleVoiceResult = useCallback(async (text: string) => {
    if (isProcessing || isSpeaking) return;

    setTranscript(text);
    onMessage?.(text);
    setIsListening(false);

    if (onResponse) {
      setIsProcessing(true);
      try {
        const response = await onResponse(text);
        setLastResponse(response);

        // Auto-speak response
        setIsProcessing(false);
        setIsSpeaking(true);
        await voiceService.tts.speak({
          text: response,
          lang: language,
          rate: 0.9,
        });
        setIsSpeaking(false);
      } catch {
        setIsProcessing(false);
        toast.error(language === 'ar' ? 'حدث خطأ' : 'Something went wrong');
      }
    }
  }, [isProcessing, isSpeaking, onMessage, onResponse, language]);

  const handleToggle = useCallback(() => {
    if (isSpeaking) {
      voiceService.tts.stop();
      setIsSpeaking(false);
      return;
    }

    if (isListening) {
      voiceService.stt.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceService.stt.setLanguage(language === 'ar' ? 'ar' : 'en');
      voiceService.stt.start().catch(() => {
        setIsListening(false);
        toast.error(language === 'ar' ? 'فشل بدء التسجيل' : 'Failed to start voice input');
      });
    }
  }, [isListening, isSpeaking, language]);

  useEffect(() => {
    const unsubscribe = voiceService.stt.subscribe((result) => {
      if (result.isFinal) {
        handleVoiceResult(result.transcript);
      } else {
        setTranscript(result.transcript);
      }
    });
    return unsubscribe;
  }, [handleVoiceResult]);

  const getStatusText = () => {
    if (isSpeaking) return language === 'ar' ? 'جاري التحدث...' : 'Speaking...';
    if (isProcessing) return language === 'ar' ? 'جاري التفكير...' : 'Thinking...';
    if (isListening) return language === 'ar' ? 'جاري الاستماع...' : 'Listening...';
    return language === 'ar' ? 'اضغط للتحدث' : 'Tap to speak';
  };

  return (
    <div className={cn('flex flex-col items-center gap-4 p-6', className)}>
      {/* Status indicator */}
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {getStatusText()}
      </div>

      {/* Main voice button */}
      <button
        onClick={handleToggle}
        disabled={isProcessing}
        className={cn(
          'relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300',
          'shadow-xl hover:shadow-2xl active:scale-95',
          isListening && 'bg-rose-500 shadow-rose-500/40 hover:bg-rose-600',
          isSpeaking && 'bg-emerald-500 shadow-emerald-500/40 hover:bg-emerald-600',
          isProcessing && 'bg-violet-500 shadow-violet-500/40',
          !isListening && !isSpeaking && !isProcessing && 'bg-gradient-to-br from-sky-500 to-violet-500 shadow-violet-500/30'
        )}
      >
        {isProcessing ? (
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        ) : isSpeaking ? (
          <Volume2 className="h-10 w-10 text-white" />
        ) : isListening ? (
          <div className="relative">
            <Mic className="h-10 w-10 text-white" />
            <div className="absolute inset-0 animate-ping rounded-full bg-white/30" />
          </div>
        ) : (
          <Mic className="h-10 w-10 text-white" />
        )}
      </button>

      {/* Waveform animation */}
      {(isListening || isSpeaking) && (
        <div className="flex items-center gap-1 h-8">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 rounded-full transition-all',
                isListening && 'bg-rose-400',
                isSpeaking && 'bg-emerald-400'
              )}
              style={{
                height: `${Math.random() * 24 + 8}px`,
                animation: 'wave 0.6s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Interim transcript */}
      {transcript && isListening && (
        <div className="max-w-md text-center text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
          {transcript}
        </div>
      )}

      {/* Last response */}
      {lastResponse && !isSpeaking && !isListening && (
        <div className="max-w-md text-center text-sm text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
          {lastResponse}
        </div>
      )}
    </div>
  );
}

// ─── Export all ───────────────────────────────────────────────────────────────

export { VoiceStatusBadge } from './voice-buttons';
