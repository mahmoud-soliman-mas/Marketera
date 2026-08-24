// ─── Voice Service ───────────────────────────────────────────────────────────
// Speech-to-Text and Text-to-Speech service
// Supports Arabic and English with automatic language detection

import type { VoiceStatus, SpeechRecognitionResult, TextToSpeechOptions, VoiceProvider } from './types';
import { getAvailableVoiceProviders, hasSTTCapability, hasTTSCapability } from './types';

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

/** Detects if text is Arabic (for auto language switching) */
function detectArabic(text: string): boolean {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicChars / Math.max(text.length, 1) > 0.2;
}

// ─── Speech-to-Text ───────────────────────────────────────────────────────────

export class SpeechToText {
  private recognition: SpeechRecognition | null = null;
  private status: VoiceStatus = 'idle';
  private listeners: Set<(result: SpeechRecognitionResult) => void> = new Set();
  private statusListeners: Set<(status: VoiceStatus) => void> = new Set();
  private currentLang: 'ar' | 'en' = 'en';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        // Auto-detect language from browser
        this.recognition.lang = this.getBrowserLanguage();

        this.recognition.onresult = (event) => {
          const result = event.results[event.results.length - 1];
          const transcript = result[0].transcript;

          // Auto-detect language from transcript and switch if needed
          const isArabic = detectArabic(transcript);
          const detectedLang = isArabic ? 'ar' : 'en';

          if (detectedLang !== this.currentLang) {
            this.currentLang = detectedLang;
            this.recognition!.lang = isArabic ? 'ar-SA' : 'en-US';
          }

          const recognitionResult: SpeechRecognitionResult = {
            transcript,
            confidence: result[0].confidence,
            isFinal: result.isFinal,
          };
          this.listeners.forEach((l) => l(recognitionResult));
        };

        this.recognition.onerror = (event) => {
          this.status = 'error';
          this.statusListeners.forEach((l) => l(this.status));
          console.error('Speech recognition error:', event.error);
        };

        this.recognition.onend = () => {
          if (this.status === 'listening') {
            this.status = 'idle';
            this.statusListeners.forEach((l) => l(this.status));
          }
        };
      }
    }
  }

  private getBrowserLanguage(): string {
    if (typeof window === 'undefined') return 'en-US';
    const browserLang = navigator.language?.toLowerCase() || 'en';
    if (browserLang.startsWith('ar')) {
      this.currentLang = 'ar';
      return 'ar-SA';
    }
    this.currentLang = 'en';
    return 'en-US';
  }

  isAvailable(): boolean {
    return this.recognition !== null;
  }

  subscribe(listener: (result: SpeechRecognitionResult) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeStatus(listener: (status: VoiceStatus) => void): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  getStatus(): VoiceStatus {
    return this.status;
  }

  setLanguage(lang: 'ar' | 'en') {
    this.currentLang = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    }
  }

  getLanguage(): 'ar' | 'en' {
    return this.currentLang;
  }

  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }
    if (this.status === 'listening') return;

    this.status = 'listening';
    this.statusListeners.forEach((l) => l(this.status));

    return new Promise((resolve, reject) => {
      this.recognition!.onend = () => {
        this.status = 'idle';
        this.statusListeners.forEach((l) => l(this.status));
        resolve();
      };
      this.recognition!.onerror = (event) => {
        this.status = 'error';
        this.statusListeners.forEach((l) => l(this.status));
        reject(new Error(event.error));
      };
      this.recognition!.start();
    });
  }

  stop() {
    if (this.recognition && this.status === 'listening') {
      this.recognition.stop();
      this.status = 'idle';
      this.statusListeners.forEach((l) => l(this.status));
    }
  }
}

// ─── Text-to-Speech ──────────────────────────────────────────────────────────

export class TextToSpeech {
  private synthesis: SpeechSynthesis | null = null;
  private status: VoiceStatus = 'idle';
  private voices: SpeechSynthesisVoice[] = [];
  private statusListeners: Set<(status: VoiceStatus) => void> = new Set();
  private currentLang: 'ar' | 'en' = 'en';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
      // Auto-detect browser language
      this.currentLang = this.getBrowserLanguage();
    }
  }

  private getBrowserLanguage(): 'ar' | 'en' {
    if (typeof window === 'undefined') return 'en';
    const browserLang = navigator.language?.toLowerCase() || 'en';
    return browserLang.startsWith('ar') ? 'ar' : 'en';
  }

  private loadVoices() {
    if (!this.synthesis) return;

    const loadVoiceList = () => {
      this.voices = this.synthesis!.getVoices();
    };

    loadVoiceList();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoiceList;
    }
  }

  /** Get the best available voice for a given language */
  private getBestVoiceForLanguage(lang: 'ar' | 'en'): SpeechSynthesisVoice | null {
    // Priority 1: Try to find a native voice for the language
    const langCode = lang === 'ar' ? 'ar' : 'en';

    // Look for voices that match the language
    const matchingVoices = this.voices.filter((v) =>
      v.lang.toLowerCase().startsWith(langCode)
    );

    if (matchingVoices.length === 0) return null;

    // Priority 2: Prefer local/online quality voices
    // Google and Microsoft voices typically sound better
    const preferredVoice = matchingVoices.find((v) =>
      v.name.includes('Google') ||
      v.name.includes('Microsoft') ||
      v.name.includes('Natural') ||
      v.localService === false
    );

    if (preferredVoice) return preferredVoice;

    // Priority 3: Use the first matching voice
    return matchingVoices[0];
  }

  isAvailable(): boolean {
    return this.synthesis !== null;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getStatus(): VoiceStatus {
    return this.status;
  }

  subscribeStatus(listener: (status: VoiceStatus) => void): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  setLanguage(lang: 'ar' | 'en') {
    this.currentLang = lang;
  }

  getLanguage(): 'ar' | 'en' {
    return this.currentLang;
  }

  speak(options: TextToSpeechOptions & { lang?: 'ar' | 'en' }): Promise<void> {
    if (!this.synthesis) {
      options.onError?.('Text-to-speech not available');
      return Promise.reject(new Error('Text-to-speech not available'));
    }

    return new Promise((resolve, reject) => {
      let settled = false;
      let voiceTimer: number | undefined;

      const finish = (error?: string) => {
        if (settled) return;
        settled = true;
        if (voiceTimer) window.clearTimeout(voiceTimer);
        this.synthesis?.removeEventListener?.('voiceschanged', handleVoicesChanged);
        if (error) {
          this.status = 'error';
          this.statusListeners.forEach((listener) => listener(this.status));
          options.onError?.(error);
          reject(new Error(error));
        } else {
          resolve();
        }
      };

      const speakNow = () => {
        if (settled || !this.synthesis) return;
        this.loadVoices();
        const utterance = new SpeechSynthesisUtterance(options.text);

        // The explicit application language always wins over text auto-detection.
        const isArabic = detectArabic(options.text);
        const textLang = options.lang || (isArabic ? 'ar' : 'en');
        this.currentLang = textLang;

        const voice = this.getBestVoiceForLanguage(textLang);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = textLang === 'ar' ? 'ar-SA' : 'en-US';
        }

        utterance.rate = options.rate ?? 0.86;
        if (options.pitch !== undefined) utterance.pitch = options.pitch;
        utterance.volume = options.volume ?? 1;

        utterance.onstart = () => {
          this.status = 'speaking';
          this.statusListeners.forEach((listener) => listener(this.status));
          options.onStart?.();
        };
        utterance.onend = () => {
          this.status = 'idle';
          this.statusListeners.forEach((listener) => listener(this.status));
          options.onEnd?.();
          finish();
        };
        utterance.onerror = (event) => finish(event.error || 'Speech synthesis failed');

        try {
          this.synthesis.resume();
          this.synthesis.speak(utterance);
        } catch (error) {
          finish(error instanceof Error ? error.message : 'Speech synthesis failed');
        }
      };

      const handleVoicesChanged = () => {
        this.loadVoices();
        if (this.voices.length > 0) speakNow();
      };

      this.synthesis?.addEventListener?.('voiceschanged', handleVoicesChanged);
      this.loadVoices();
      if (this.voices.length > 0) {
        speakNow();
      } else {
        // Some browsers populate voices asynchronously; do not speak before they are ready.
        voiceTimer = window.setTimeout(speakNow, 900);
      }
    });
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.status = 'idle';
      this.statusListeners.forEach((l) => l(this.status));
    }
  }

  pause() {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }
}

// ─── Singleton Instances ─────────────────────────────────────────────────────

export const speechToText = new SpeechToText();
export const textToSpeech = new TextToSpeech();

// ─── Voice Service Facade ────────────────────────────────────────────────────

export const voiceService = {
  stt: speechToText,
  tts: textToSpeech,

  isAvailable(): boolean {
    return this.stt.isAvailable() || this.tts.isAvailable();
  },

  hasSTT(): boolean {
    return this.stt.isAvailable();
  },

  hasTTS(): boolean {
    return this.tts.isAvailable();
  },

  getStatus(): { sttAvailable: boolean; ttsAvailable: boolean } {
    return {
      sttAvailable: this.stt.isAvailable(),
      ttsAvailable: this.tts.isAvailable(),
    };
  },
};
