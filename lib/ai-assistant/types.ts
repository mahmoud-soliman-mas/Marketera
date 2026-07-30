// ─── Enhanced AI Assistant Types ─────────────────────────────────────────────────

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    toolUsed?: string;
    suggestedActions?: SuggestedAction[];
    generatedContent?: GeneratedContent[];
    followUpOptions?: FollowUpOption[];
  };
}

export interface SuggestedAction {
  id: string;
  label: string;
  description: string;
  toolId: string;
  icon?: string;
}

export interface FollowUpOption {
  id: string;
  label: string;
  action: 'improve' | 'rewrite' | 'simplify' | 'expand' | 'translate' | 'professional' | 'luxury' | 'friendly' | 'creative' | 'persuasive' | 'short' | 'long' | 'seo' | 'social';
  params?: Record<string, unknown>;
}

export interface GeneratedContent {
  type: string;
  data: unknown;
}

export interface ConversationMemory {
  business?: string;
  products?: string[];
  audience?: string;
  brandVoice?: string;
  previousGenerations?: Array<{
    type: string;
    input: string;
    output: string;
    timestamp: number;
  }>;
  preferredStyle?: string;
  preferredChannels?: string[];
  language: 'ar' | 'en';
  updatedAt?: number;
}

export interface AIAssistantRequest {
  message: string;
  conversationHistory?: AIMessage[];
  memory?: ConversationMemory;
  language: 'ar' | 'en';
  creativity?: number;
  persona?: string;
  mood?: string;
  stream?: boolean;
}

export interface AIAssistantResult {
  response: string;
  reasoning?: {
    userGoal: string;
    businessType?: string;
    targetAudience?: string;
    funnelStage?: string;
    recommendedTools: string[];
    nextAction: string;
  };
  suggestedActions?: SuggestedAction[];
  followUpOptions?: FollowUpOption[];
  generatedContent?: GeneratedContent[];
}

export interface VoiceSettings {
  enabled: boolean;
  autoSpeak: boolean;
  voiceId?: string;
  playbackSpeed: 0.75 | 1 | 1.25 | 1.5 | 2;
  volume: number;
  language: 'auto' | 'ar' | 'en';
  autoReadExplanations: boolean;
  autoReadResponses: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  history: AIMessage[];
  generatedContent: GeneratedContent[];
}
