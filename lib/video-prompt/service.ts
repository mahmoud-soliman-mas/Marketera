// ─── Video Prompt Generator Service ────────────────────────────────────────────
// Calls the generate-hooks edge function with type: 'video-prompt' to generate
// professional prompts for AI video generation tools.

import { callApi } from '@/lib/api';
import type { VideoPromptRequest, VideoPromptResult } from './types';

export interface VideoPromptService {
  generate(req: VideoPromptRequest, onProgress?: (stage: string) => void): Promise<VideoPromptResult>;
}

interface VideoPromptResponse {
  hook: string;
  prompt: string;
  negativePrompt: string;
  recommendedModel: string;
  recommendedModelReason: string;
}

export const videoPromptService: VideoPromptService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<VideoPromptResponse>({
      type: 'video-prompt',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate video prompt');
    }

    onProgress?.('done');
    return {
      hook: result.data.hook,
      prompt: result.data.prompt,
      negativePrompt: result.data.negativePrompt,
      recommendedModel: result.data.recommendedModel,
      recommendedModelReason: result.data.recommendedModelReason,
    };
  },
};
