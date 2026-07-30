'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTool } from '@/lib/tools';
import type { SmartSuggestion, SuggestionContext } from './types';
import { getSuggestionsForContext } from './types';

interface SmartSuggestionsProps {
  context: SuggestionContext;
  onNavigate: (toolId: string) => void;
  limit?: number;
}

export function SmartSuggestionsBar({ context, onNavigate, limit = 3 }: SmartSuggestionsProps) {
  const suggestions = getSuggestionsForContext(context).slice(0, limit);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-sky-100 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-900/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-sky-500" />
        <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">Next Steps</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => {
          const tool = getTool(suggestion.toolId);
          const Icon = tool?.icon ?? Sparkles;
          return (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              onClick={() => onNavigate(suggestion.toolId)}
              className="h-auto flex-col items-start gap-1 px-4 py-2.5 text-left border-sky-200 dark:border-sky-800 hover:border-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Icon className="h-3.5 w-3.5" />
                {suggestion.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {suggestion.description}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
