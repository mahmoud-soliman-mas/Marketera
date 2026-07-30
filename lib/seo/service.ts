import { callApi } from '@/lib/api';
import type { SEORequest, SEOResult } from './types';

export interface SEOService {
  generate(req: SEORequest, onProgress?: (stage: string) => void): Promise<SEOResult>;
}

export const seoService: SEOService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<SEOResult>({
      type: 'seo',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate SEO keywords');
    }

    onProgress?.('done');
    return result.data;
  },
};
