import { callApi } from '@/lib/api';
import type { LandingPageRequest, LandingPageResult } from './types';

export interface LandingPageService {
  generate(req: LandingPageRequest, onProgress?: (stage: string) => void): Promise<LandingPageResult>;
}

export const landingPageService: LandingPageService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<LandingPageResult>({
      type: 'landing-page',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate landing page');
    }

    onProgress?.('done');
    return result.data;
  },
};
