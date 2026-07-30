import { callApi } from '@/lib/api';
import type { ProductDescriptionRequest, ProductDescriptionResult } from './types';

export interface ProductDescriptionService {
  generate(req: ProductDescriptionRequest, onProgress?: (stage: string) => void): Promise<ProductDescriptionResult>;
}

export const productDescriptionService: ProductDescriptionService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<ProductDescriptionResult>({
      type: 'product-description',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate product description');
    }

    onProgress?.('done');
    return result.data;
  },
};
