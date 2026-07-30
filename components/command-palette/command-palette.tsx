'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { Wand2, Lightbulb, FileText, Video, Users, Search, BarChart2, Settings, History, Moon, Sun, MonitorSmartphone, MessageSquare } from 'lucide-react';
import type { ToolId } from '@/lib/tools';
import { TOOLS, SYSTEM_TOOLS, getTool } from '@/lib/tools';
import { useSettings, type ThemeMode } from '@/lib/settings';

interface CommandPaletteProps {
  onNavigate?: (toolId: ToolId) => void;
  onOpenSettings?: () => void;
}

const NAVIGATION_TOOLS: { id: ToolId | string; label: string; icon: React.ElementType; section: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Wand2, section: 'Navigation' },
  { id: 'ai-assistant', label: 'Marketra AI Assistant', icon: MessageSquare, section: 'Navigation' },
  { id: 'hooks', label: 'Hooks Generator', icon: Wand2, section: 'Content' },
  { id: 'content-ideas', label: 'Content Ideas', icon: Lightbulb, section: 'Content' },
  { id: 'ad-copy', label: 'Ad Copy Generator', icon: FileText, section: 'Advertising' },
  { id: 'video-prompt', label: 'Video Prompt Generator', icon: Video, section: 'Advertising' },
  { id: 'persona', label: 'Persona Generator', icon: Users, section: 'Strategy' },
  { id: 'seo', label: 'SEO Generator', icon: Search, section: 'SEO' },
  { id: 'marketing-plan', label: 'Marketing Plan', icon: BarChart2, section: 'Strategy' },
  { id: 'email', label: 'Email Generator', icon: FileText, section: 'Content' },
  { id: 'landing-page', label: 'Landing Page Generator', icon: FileText, section: 'Content' },
  { id: 'product-description', label: 'Product Description', icon: FileText, section: 'Content' },
  { id: 'brand-voice', label: 'Brand Voice', icon: Users, section: 'Strategy' },
  { id: 'social-media', label: 'Social Media Generator', icon: Wand2, section: 'Content' },
  { id: 'history', label: 'History', icon: History, section: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
];

export function CommandPalette({ onNavigate, onOpenSettings }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const { settings, update } = useSettings();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = useCallback((toolId: string) => {
    setOpen(false);

    if (toolId === 'settings') {
      onOpenSettings?.();
    } else if (onNavigate) {
      onNavigate(toolId as ToolId);
    }
  }, [onNavigate, onOpenSettings]);

  const handleThemeChange = useCallback((theme: ThemeMode) => {
    update('themeMode', theme);
    setOpen(false);
  }, [update]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:first-child_[cmdk-group-heading]]:pt-1.5 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => handleSelect('ai-assistant')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Open AI Assistant</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('hooks')}>
                <Wand2 className="mr-2 h-4 w-4" />
                <span>Generate Hooks</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('ad-copy')}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Generate Ad Copy</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('content-ideas')}>
                <Lightbulb className="mr-2 h-4 w-4" />
                <span>Get Content Ideas</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Tools">
              {NAVIGATION_TOOLS.filter(t => !['dashboard', 'ai-assistant', 'hooks', 'ad-copy', 'content-ideas'].includes(t.id)).map((tool) => (
                <CommandItem key={tool.id} onSelect={() => handleSelect(tool.id)}>
                  <tool.icon className="mr-2 h-4 w-4" />
                  <span>{tool.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => handleThemeChange('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light Mode</span>
              </CommandItem>
              <CommandItem onSelect={() => handleThemeChange('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
              </CommandItem>
              <CommandItem onSelect={() => handleThemeChange('system')}>
                <MonitorSmartphone className="mr-2 h-4 w-4" />
                <span>System</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// Keyboard shortcut hint component
export function CommandPaletteHint() {
  return (
    <div className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground">
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
        <span className="text-xs">⌘</span>K
      </kbd>
      <span>for commands</span>
    </div>
  );
}
