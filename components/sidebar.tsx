'use client';

import { X, Settings, ChevronRight, Sparkles, History, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandMark, BrandName, PoweredByMW } from '@/components/brand';
import { SIDEBAR_SECTIONS, type ToolId, type ToolMeta } from '@/lib/tools';
import { useI18n, useTranslation } from '@/lib/i18n';

interface SidebarProps {
  active: ToolId;
  onSelect: (id: ToolId) => void;
  onClose?: () => void;
  onSettingsOpen: () => void;
}

function NavItem({
  tool,
  activeId,
  onSelect,
  onClose,
  lang,
}: {
  tool: ToolMeta;
  activeId: ToolId;
  onSelect: (id: ToolId) => void;
  onClose?: () => void;
  lang: 'en' | 'ar';
}) {
  const Icon = tool.icon;
  const isActive = activeId === tool.id && tool.available;
  const label = lang === 'ar' ? tool.labelAr : tool.label;
  const shortLabel = lang === 'ar' ? (tool.shortLabelAr || tool.labelAr) : (tool.shortLabel || tool.label);
  const description = lang === 'ar' ? tool.descriptionAr : tool.description;

  return (
    <button
      type="button"
      disabled={!tool.available}
      onClick={() => {
        if (tool.available) {
          onSelect(tool.id);
          onClose?.();
        }
      }}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200',
        isActive
          ? 'glass-strong text-primary shadow-sm'
          : tool.available
          ? 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
          : 'cursor-not-allowed opacity-50'
      )}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-cyan-400"
        />
      )}
      <span
        className={cn(
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200',
          isActive
            ? 'bg-gradient-to-br from-primary to-cyan-400 text-white shadow-sm'
            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight">{shortLabel}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground/70">{description}</p>
      </div>
      {tool.comingSoon && (
        <span className="flex-shrink-0 rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
          {lang === 'ar' ? 'قريباً' : 'Soon'}
        </span>
      )}
      {isActive && <ChevronRight className="h-3 w-3 flex-shrink-0 text-primary" />}
    </button>
  );
}

export function Sidebar({ active, onSelect, onClose, onSettingsOpen }: SidebarProps) {
  const { language, t } = useI18n();

  return (
    <aside className="flex h-full flex-col glass border-r border-border/40">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <BrandName />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSettingsOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            title={t.common.settings}
            aria-label={t.common.settings}
          >
            <Settings className="h-4 w-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              aria-label={t.common.close}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4">
        {SIDEBAR_SECTIONS.map((section) => {
          if (section.tools.length === 0) return null;
          const sectionTitle = language === 'ar' ? section.titleAr : section.title;
          return (
            <div key={section.title} className="mb-4">
              <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                {sectionTitle}
              </p>
              <div className="space-y-0.5">
                {section.tools.map((tool) => (
                  <NavItem
                    key={tool.id}
                    tool={tool}
                    activeId={active}
                    onSelect={onSelect}
                    onClose={onClose}
                    lang={language}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Quick links - Library section */}
        <div className="mt-2 border-t border-border/40 pt-3">
          <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            {language === 'ar' ? 'المكتبة' : 'Library'}
          </p>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => { onSelect('history'); onClose?.(); }}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
                active === 'history'
                  ? 'glass-strong text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                <History className="h-3.5 w-3.5" />
              </span>
              <span className="text-[13px] font-semibold">{t.common.history}</span>
            </button>
            <button
              type="button"
              onClick={() => { onSelect('settings'); onClose?.(); }}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
                active === 'settings'
                  ? 'glass-strong text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                <Settings className="h-3.5 w-3.5" />
              </span>
              <span className="text-[13px] font-semibold">{t.common.settings}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border/40 px-5 py-3">
        <div className="flex items-center justify-between">
          <PoweredByMW />
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            <Sparkles className="h-3 w-3 text-primary" />
            v3.0
          </span>
        </div>
      </div>
    </aside>
  );
}
