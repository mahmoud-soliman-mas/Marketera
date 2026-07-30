// ─── AI Service ──────────────────────────────────────────────────────────────
// Core AI abstraction layer for multiple providers

import type { AIProvider, AIModel, ProviderStatus, ProviderCapabilities, MultimodalInput, AIRequest, AIResponse, StreamingChunk } from './types';

// ─── Provider Registry ───────────────────────────────────────────────────────

const PROVIDERS: AIProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    configured: true,
    models: [
      {
        id: 'llama-3.3-70b-versatile',
        name: 'LLaMA 3.3 70B',
        provider: 'groq',
        inputModalities: ['text', 'image'],
        outputModalities: ['text'],
        contextWindow: 128000,
        supportsStreaming: true,
        supportsVision: false,
        supportsAudio: false,
        supportsTools: true,
      },
    ],
    capabilities: {
      text: true,
      image: false,
      imageGeneration: false,
      audio: false,
      audioGeneration: false,
      video: false,
      streaming: true,
      tools: true,
      embeddings: false,
    },
  },
  {
    id: 'fal',
    name: 'Fal.ai',
    configured: true,
    models: [
      {
        id: 'flux-pro',
        name: 'FLUX Pro',
        provider: 'fal',
        inputModalities: ['text'],
        outputModalities: ['image'],
        contextWindow: 0,
        supportsStreaming: false,
        supportsVision: false,
        supportsAudio: false,
        supportsTools: false,
      },
    ],
    capabilities: {
      text: false,
      image: false,
      imageGeneration: true,
      audio: false,
      audioGeneration: false,
      video: false,
      streaming: false,
      tools: false,
      embeddings: false,
    },
  },
  {
    id: 'openai',
    name: 'OpenAI',
    configured: false,
    models: [],
    capabilities: {
      text: true,
      image: true,
      imageGeneration: true,
      audio: true,
      audioGeneration: true,
      video: false,
      streaming: true,
      tools: true,
      embeddings: true,
    },
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    configured: false,
    models: [],
    capabilities: {
      text: true,
      image: true,
      imageGeneration: false,
      audio: false,
      audioGeneration: false,
      video: false,
      streaming: true,
      tools: true,
      embeddings: false,
    },
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    configured: false,
    models: [],
    capabilities: {
      text: true,
      image: true,
      imageGeneration: true,
      audio: true,
      audioGeneration: false,
      video: true,
      streaming: true,
      tools: true,
      embeddings: true,
    },
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    configured: false,
    models: [],
    capabilities: {
      text: true,
      image: true,
      imageGeneration: false,
      audio: false,
      audioGeneration: false,
      video: false,
      streaming: true,
      tools: true,
      embeddings: false,
    },
  },
];

// ─── AI Service Class ───────────────────────────────────────────────────────

class AIService {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    PROVIDERS.forEach((p) => this.providers.set(p.id, p));
  }

  getProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  getProvider(id: string): AIProvider | undefined {
    return this.providers.get(id);
  }

  getConfiguredProviders(): AIProvider[] {
    return this.getProviders().filter((p) => p.configured);
  }

  getProviderStatus(): ProviderStatus[] {
    return this.getProviders().map((p) => ({
      provider: p.id,
      name: p.name,
      status: p.configured ? 'connected' : 'disconnected',
      capabilities: p.capabilities,
    }));
  }

  getDefaultTextProvider(): AIProvider | undefined {
    return this.getProviders().find((p) => p.configured && p.capabilities.text);
  }

  getDefaultImageProvider(): AIProvider | undefined {
    return this.getProviders().find((p) => p.configured && p.capabilities.imageGeneration);
  }

  detectInputModality(input: string | File | Blob): 'text' | 'image' | 'audio' | 'document' | 'video' {
    if (typeof input === 'string') return 'text';
    if (input instanceof File || input instanceof Blob) {
      const type = input.type;
      if (type.startsWith('image/')) return 'image';
      if (type.startsWith('audio/')) return 'audio';
      if (type.startsWith('video/')) return 'video';
      if (type.includes('pdf') || type.includes('document') || type.includes('word')) return 'document';
    }
    return 'text';
  }

  canHandle(modality: 'text' | 'image' | 'audio' | 'document' | 'video', provider?: string): boolean {
    const targetProvider = provider ? this.providers.get(provider) : this.getDefaultTextProvider();
    if (!targetProvider) return false;

    const caps = targetProvider.capabilities;
    switch (modality) {
      case 'text': return caps.text;
      case 'image': return caps.image;
      case 'audio': return caps.audio;
      case 'video': return caps.video;
      case 'document': return caps.text; // Documents are processed as text after extraction
      default: return false;
    }
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    // This is an abstraction - actual calls go through existing services
    throw new Error('Use specific service methods for generation');
  }

  async *stream(request: AIRequest): AsyncGenerator<StreamingChunk> {
    // Streaming is handled by the streaming service
    yield { delta: '', done: true };
  }
}

export const aiService = new AIService();

// ─── Capability Checks ───────────────────────────────────────────────────────

export function hasTextProvider(): boolean {
  return PROVIDERS.some((p) => p.configured && p.capabilities.text);
}

export function hasImageGeneration(): boolean {
  return PROVIDERS.some((p) => p.configured && p.capabilities.imageGeneration);
}

export function hasVisionCapability(): boolean {
  return PROVIDERS.some((p) => p.configured && p.capabilities.image);
}

export function hasAudioCapability(): boolean {
  return PROVIDERS.some((p) => p.configured && p.capabilities.audio);
}

export function hasEmbeddingCapability(): boolean {
  return PROVIDERS.some((p) => p.configured && p.capabilities.embeddings);
}

export function getImageProviderStatus(): ProviderStatus | undefined {
  const imageProvider = PROVIDERS.find((p) => p.configured && p.capabilities.imageGeneration);
  if (imageProvider) {
    return {
      provider: imageProvider.id,
      name: imageProvider.name,
      status: 'connected',
      capabilities: imageProvider.capabilities,
    };
  }
  return {
    provider: 'none',
    name: 'No Image Provider',
    status: 'disconnected',
    message: 'Connect an AI Image Provider',
    capabilities: {
      text: false,
      image: false,
      imageGeneration: false,
      audio: false,
      audioGeneration: false,
      video: false,
      streaming: false,
      tools: false,
      embeddings: false,
    },
  };
}

export function getVoiceProviderStatus(): ProviderStatus {
  // Voice requires STT + TTS - check if any provider supports it
  const hasProvider = PROVIDERS.some((p) => p.configured && (p.capabilities.audio || p.capabilities.audioGeneration));
  return {
    provider: hasProvider ? 'configured' : 'none',
    name: 'Voice AI',
    status: hasProvider ? 'connected' : 'coming-soon',
    message: hasProvider ? undefined : 'Voice AI Coming Soon',
    capabilities: {
      text: true,
      image: false,
      imageGeneration: false,
      audio: hasProvider,
      audioGeneration: hasProvider,
      video: false,
      streaming: true,
      tools: false,
      embeddings: false,
    },
  };
}

export function getKnowledgeBaseStatus(): ProviderStatus {
  const hasEmbeddings = hasEmbeddingCapability();
  return {
    provider: 'knowledge-base',
    name: 'Knowledge Base',
    status: hasEmbeddings ? 'connected' : 'ready',
    message: hasEmbeddings ? undefined : 'Knowledge Base Ready',
    capabilities: {
      text: true,
      image: false,
      imageGeneration: false,
      audio: false,
      audioGeneration: false,
      video: false,
      streaming: false,
      tools: true,
      embeddings: hasEmbeddings,
    },
  };
}

export function getToolLayerStatus(): ProviderStatus {
  return {
    provider: 'tool-layer',
    name: 'AI Tool Layer',
    status: 'ready',
    message: 'Tool Layer Ready',
    capabilities: {
      text: true,
      image: false,
      imageGeneration: false,
      audio: false,
      audioGeneration: false,
      video: false,
      streaming: false,
      tools: true,
      embeddings: false,
    },
  };
}
