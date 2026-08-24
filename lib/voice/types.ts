// ─── Voice Types ─────────────────────────────────────────────────────────────
// Speech-to-Text and Text-to-Speech architecture

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error' | 'unavailable';

export interface VoiceConfig {
  language: string;
  voice?: string;
  rate?: number;
  pitch?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface TextToSpeechOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export interface VoiceProvider {
  id: string;
  name: string;
  stt: boolean;
  tts: boolean;
  streaming: boolean;
  voices: string[];
  configured: boolean;
}

export const VOICE_PROVIDERS: VoiceProvider[] = [
  {
    id: 'browser',
    name: 'Browser Speech API',
    stt: typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
    tts: typeof window !== 'undefined' && 'speechSynthesis' in window,
    streaming: true,
    voices: [],
    configured: true,
  },
  {
    id: 'whisper',
    name: 'OpenAI Whisper',
    stt: true,
    tts: false,
    streaming: false,
    voices: [],
    configured: false,
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    stt: false,
    tts: true,
    streaming: true,
    voices: [],
    configured: false,
  },
];

export function getAvailableVoiceProviders(): VoiceProvider[] {
  return VOICE_PROVIDERS.filter((p) => p.configured);
}

export function hasVoiceCapability(): boolean {
  return VOICE_PROVIDERS.some((p) => p.configured && (p.stt || p.tts));
}

export function hasSTTCapability(): boolean {
  return VOICE_PROVIDERS.some((p) => p.configured && p.stt);
}

export function hasTTSCapability(): boolean {
  return VOICE_PROVIDERS.some((p) => p.configured && p.tts);
}
