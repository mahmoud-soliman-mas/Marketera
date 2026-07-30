import { callApi } from '@/lib/api';
import type { BrandVoiceRequest, BrandVoiceResult } from './types';

export interface BrandVoiceService {
  generate(req: BrandVoiceRequest, onProgress?: (stage: string) => void): Promise<BrandVoiceResult>;
}

export const brandVoiceService: BrandVoiceService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<BrandVoiceResult>({
      type: 'brand-voice',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate brand voice');
    }

    onProgress?.('done');
    return result.data;
  },
};
