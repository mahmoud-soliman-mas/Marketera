import { callApi } from '@/lib/api';
import type { EmailRequest, EmailResult } from './types';

export interface EmailService {
  generate(req: EmailRequest, onProgress?: (stage: string) => void): Promise<EmailResult>;
}

export const emailService: EmailService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<EmailResult>({
      type: 'email',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate email content');
    }

    onProgress?.('done');
    return result.data;
  },
};
