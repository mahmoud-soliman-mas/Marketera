// ─── AI Core Types ────────────────────────────────────────────────────────────
// Multimodal AI support for text, images, audio, and documents

export type InputModality = 'text' | 'image' | 'audio' | 'document' | 'video';
export type OutputModality = 'text' | 'image' | 'audio';

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  capabilities: ProviderCapabilities;
  configured: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  inputModalities: InputModality[];
  outputModalities: OutputModality[];
  contextWindow: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsTools: boolean;
}

export interface ProviderCapabilities {
  text: boolean;
  image: boolean;
  imageGeneration: boolean;
  audio: boolean;
  audioGeneration: boolean;
  video: boolean;
  streaming: boolean;
  tools: boolean;
  embeddings: boolean;
}

export interface MultimodalInput {
  type: InputModality;
  content: string;
  mimeType?: string;
  data?: string | ArrayBuffer;
  url?: string;
}

export interface AIRequest {
  inputs: MultimodalInput[];
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: AIToolDefinition[];
}

export interface AIResponse {
  text: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'tool_call' | 'error';
  toolCalls?: AIToolCall[];
}

export interface AIToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface AIToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface StreamingChunk {
  delta: string;
  done: boolean;
  toolCalls?: AIToolCall[];
}

// ─── Provider Status ─────────────────────────────────────────────────────────

export interface ProviderStatus {
  provider: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'coming-soon' | 'ready';
  message?: string;
  capabilities: ProviderCapabilities;
}
