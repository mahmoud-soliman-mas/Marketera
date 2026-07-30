// ─── Ad Copy Generator Service ─────────────────────────────────────────────────
// Calls the generate-hooks edge function with type: 'ad-copy' to generate
// high-converting advertisement copy for any platform.

import { callApi } from '@/lib/api';
import type { AdCopyRequest, AdCopyResult } from './types';

export interface AdCopyService {
  generate(req: AdCopyRequest, onProgress?: (stage: string) => void): Promise<AdCopyResult>;
}

interface AdCopyResponse {
  hook: string;
  primaryText: string;
  headline: string;
  cta: string;
  description: string;
}

export const adCopyService: AdCopyService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<AdCopyResponse>({
      type: 'ad-copy',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate ad copy');
    }

    onProgress?.('done');
    return {
      hook: result.data.hook,
      primaryText: result.data.primaryText,
      headline: result.data.headline,
      cta: result.data.cta,
      description: result.data.description,
    };
  },
};
