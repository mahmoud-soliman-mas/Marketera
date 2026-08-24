'use client';

import { useCallback, useEffect, useState } from 'react';
import { FORCE_INTRO_QUERY_PARAM, INTRO_STORAGE_KEY } from '@/components/intro/intro-constants';

export function useIntro() {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forcedByQuery = params.get(FORCE_INTRO_QUERY_PARAM) === '1' || params.get(FORCE_INTRO_QUERY_PARAM) === 'true';
    const forcedByEnvironment = process.env.NEXT_PUBLIC_FORCE_INTRO === 'true';
    const alreadySeen = window.localStorage.getItem(INTRO_STORAGE_KEY) === 'true';

    setShowIntro(forcedByQuery || forcedByEnvironment || !alreadySeen);
    setReady(true);
  }, []);

  const finishIntro = useCallback(() => {
    window.localStorage.setItem(INTRO_STORAGE_KEY, 'true');
    setShowIntro(false);
  }, []);

  return { ready, showIntro, finishIntro };
}
