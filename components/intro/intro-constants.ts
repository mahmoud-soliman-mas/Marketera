export const INTRO_DURATION_MS = 14_000;
export const INTRO_STORAGE_KEY = 'marketra-intro-seen';
export const FORCE_INTRO_QUERY_PARAM = 'intro';

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
