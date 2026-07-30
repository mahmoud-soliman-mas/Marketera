import { callApi } from '@/lib/api';
import type { SocialMediaRequest, SocialMediaResult } from './types';

export interface SocialMediaService {
  generate(req: SocialMediaRequest, onProgress?: (stage: string) => void): Promise<SocialMediaResult>;
}

export const socialMediaService: SocialMediaService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<SocialMediaResult>({
      type: 'social-media',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate social media post');
    }

    onProgress?.('done');
    return result.data;
  },
};
