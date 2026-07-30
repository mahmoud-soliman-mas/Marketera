'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type HistoryItemType =
  | 'hooks'
  | 'content-ideas'
  | 'ad-copy'
  | 'video-prompt'
  | 'persona'
  | 'marketing-plan'
  | 'seo'
  | 'social-media'
  | 'email'
  | 'landing-page'
  | 'product-description'
  | 'brand-voice'
  | 'image';

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  label: string;
  /** Original inputs used to produce this generation, so we can regenerate. */
  inputs: Record<string, string>;
  results: unknown[];
  createdAt: string;
  favorite?: boolean;
}

const STORAGE_KEY = 'ai-marketing-history';
const FAVORITES_KEY = 'ai-marketing-favorites';
const MAX_ITEMS = 100;

interface HistoryCtx {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  /** Filters items by a free-text query across label and type. */
  search: (query: string) => HistoryItem[];
  favorites: string[];
  toggleFavorite: (hook: string) => void;
  isFavorite: (hook: string) => boolean;
}

const Ctx = createContext<HistoryCtx>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearAll: () => {},
  search: () => [],
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HistoryItem[];
        // Backfill `inputs` for items saved before the field existed.
        const migrated = parsed.map((p) => ({
          ...p,
          inputs: p.inputs && typeof p.inputs === 'object' ? p.inputs : inferInputs(p),
        }));
        setItems(migrated);
      }
      const favRaw = localStorage.getItem(FAVORITES_KEY);
      if (favRaw) setFavorites(JSON.parse(favRaw));
    } catch {}
  }, []);

  const persist = (next: HistoryItem[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const addItem = useCallback((item: Omit<HistoryItem, 'id' | 'createdAt'>) => {
    setItems((prev) => {
      const entry: HistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      };
      const next = [entry, ...prev].slice(0, MAX_ITEMS);
      persist(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const search = useCallback((query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      i.label.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q) ||
      i.results.some((r) => typeof r === 'string' && r.toLowerCase().includes(q))
    );
  }, [items]);

  const toggleFavorite = useCallback((hook: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(hook);
      const next = exists ? prev.filter((h) => h !== hook) : [...prev, hook];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback((hook: string) => favorites.includes(hook), [favorites]);

  const value = useMemo(() => ({ items, addItem, removeItem, clearAll, search, favorites, toggleFavorite, isFavorite }), [items, addItem, removeItem, clearAll, search, favorites, toggleFavorite, isFavorite]);

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

function inferInputs(item: HistoryItem): Record<string, string> {
  if (item.type === 'content-ideas') {
    const [niche, product] = item.label.split(' | ');
    return { niche: niche ?? '', product: product ?? '' };
  }
  if (item.type === 'ad-copy') {
    return { product: '', audience: '', platform: 'facebook', goal: 'awareness' };
  }
  if (item.type === 'video-prompt') {
    return { product: '', audience: '', goal: '', platform: 'tiktok', length: '15', style: 'cinematic' };
  }
  if (item.type === 'persona') {
    return { product: '', industry: '', targetMarket: '' };
  }
  if (item.type === 'marketing-plan') {
    return { business: '', product: '', targetAudience: '', budget: '', goal: '' };
  }
  return { idea: item.label };
}

export function useHistory() {
  return useContext(Ctx);
}
