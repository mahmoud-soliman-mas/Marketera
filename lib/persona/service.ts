// ─── Persona Generator Service ────────────────────────────────────────────────
// Calls the generate-hooks edge function with type: 'persona'

import { callApi } from '@/lib/api';
import type { PersonaRequest, PersonaResult } from './types';

export interface PersonaService {
  generate(req: PersonaRequest, onProgress?: (stage: string) => void): Promise<PersonaResult>;
}

interface PersonaResponse extends PersonaResult {}

export const personaService: PersonaService = {
  async generate(req, onProgress) {
    onProgress?.('analyzing');
    const result = await callApi<PersonaResponse>({
      type: 'persona',
      ...req,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to generate persona');
    }

    onProgress?.('done');
    return {
      personaName: result.data.personaName,
      age: result.data.age,
      gender: result.data.gender,
      occupation: result.data.occupation,
      incomeLevel: result.data.incomeLevel,
      goals: result.data.goals,
      painPoints: result.data.painPoints,
      motivations: result.data.motivations,
      buyingBehavior: result.data.buyingBehavior,
      preferredPlatforms: result.data.preferredPlatforms,
      preferredContent: result.data.preferredContent,
      objections: result.data.objections,
      bestMessage: result.data.bestMessage,
      recommendedCta: result.data.recommendedCta,
    };
  },
};
