'use client';

import { useState, useCallback } from 'react';
import SplashScreen from '@/components/splash-screen';
import { Menu, Settings, Sparkles, Command } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { Generator, Footer } from '@/components/generator';
import { ContentIdeasGenerator } from '@/components/content-ideas-generator';
import { AdCopyGenerator } from '@/components/ad-copy/ad-copy-generator';
import { VideoPromptGenerator } from '@/components/video-prompt/video-prompt-generator';
import { PersonaGenerator } from '@/components/persona/persona-generator';
import { MarketingPlanGenerator } from '@/components/marketing-plan/marketing-plan-generator';
import { SEOGenerator } from '@/components/seo/seo-generator';
import { SocialMediaGenerator } from '@/components/social-media/social-media-generator';
import { EmailGenerator } from '@/components/email/email-generator';
import { LandingPageGenerator } from '@/components/landing-page/landing-page-generator';
import { ProductDescriptionGenerator } from '@/components/product-description/product-description-generator';
import { BrandVoiceGenerator } from '@/components/brand-voice/brand-voice-generator';
import { AIAssistant } from '@/components/ai-assistant/ai-assistant';
import { AiToolsView } from '@/components/ai-tools/ai-tools-view';
import { AnalysisToolView } from '@/components/ai-tools/analysis-tool-view';
import { SettingsPanel } from '@/components/settings-panel';
import { Dashboard } from '@/components/dashboard';
import { HistoryView } from '@/components/history-view';
import { SettingsView } from '@/components/settings-view';
import { ProjectsView } from '@/components/projects/projects-view';
import { CommandPalette, CommandPaletteHint } from '@/components/command-palette/command-palette';
import { SettingsProvider } from '@/lib/settings';
import { HistoryProvider, type HistoryItem } from '@/lib/history';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { AccessibilityProvider } from '@/lib/accessibility/provider';
import { InactivityHelp } from '@/components/accessibility/inactivity-help';
import { getTool, type ToolId } from '@/lib/tools';
import { BrandMark, BrandName } from '@/components/brand';
import { AuroraBackground } from '@/components/visual/aurora-background';
import { cn } from '@/lib/utils';

function AppContent() {
  const [activeToolId, setActiveToolId] = useState<ToolId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showsplash , setshowsplash] = useState(true);
  const [reopenedHistory, setReopenedHistory] = useState<HistoryItem | null>(null);
  const { language, t, direction } = useI18n();

  const activeTool = getTool(activeToolId, language);
  const Icon = activeTool.icon;

  const handleReopenHistory = useCallback((item: HistoryItem) => {
    setActiveToolId(item.type as ToolId);
    setReopenedHistory(item);
  }, []);

  const handleRegenerate = useCallback((item: HistoryItem) => {
    setActiveToolId(item.type as ToolId);
    setReopenedHistory({ ...item, results: [] });
  }, []);

    if (showsplash) {
      return <SplashScreen onFinish={() => setshowsplash(false)} />;
    }

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground" dir={direction}>
      <AuroraBackground />

      {/* Desktop sidebar */}
      <div className="hidden w-64 flex-shrink-0 lg:flex lg:flex-col">
        <Sidebar
          active={activeToolId}
          onSelect={setActiveToolId}
          onSettingsOpen={() => setSettingsOpen(true)}
        />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={cn(
            "fixed inset-y-0 z-50 w-72 shadow-2xl lg:hidden animate-[slideInRight_0.25s_cubic-bezier(0.22,1,0.36,1)_both]",
            direction === 'rtl' ? 'right-0' : 'left-0'
          )}>
            <Sidebar
              active={activeToolId}
              onSelect={setActiveToolId}
              onClose={() => setSidebarOpen(false)}
              onSettingsOpen={() => { setSidebarOpen(false); setSettingsOpen(true); }}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-border/60 glass px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <BrandMark size="sm" />
            <BrandName className="text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:text-primary"
              aria-label={t.common.settings}
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {activeTool.tShortLabel}
              <Menu className="h-3.5 w-3.5 text-muted-foreground/60" />
            </button>
          </div>
        </header>

        {/* Tool header (desktop) */}
        <div className="hidden lg:block border-b border-border/60 glass px-6 py-5 lg:px-8">
          <div className="mx-auto max-w-5xl flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm', activeTool.accent)}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{activeTool.tLabel}</h1>
              <p className="text-sm text-muted-foreground">{activeTool.tDescription}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <CommandPaletteHint />
              <span className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:flex">
                <Sparkles className="h-3 w-3" />
                {t.common.aiPowered}
              </span>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-primary/40 hover:text-primary shadow-sm"
                title={t.common.settings}
                aria-label={t.common.settings}
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="pt-6 lg:pt-8">
            {activeToolId === 'dashboard' && (
              <Dashboard onNavigate={setActiveToolId} onReopenHistory={handleReopenHistory} />
            )}
            {activeToolId === 'hooks' && (
              <Generator
                reopenedHistory={reopenedHistory?.type === 'hooks' ? reopenedHistory : null}
                onHistoryConsumed={() => setReopenedHistory(null)}
              />
            )}
            {activeToolId === 'content-ideas' && (
              <ContentIdeasGenerator
                reopenedHistory={reopenedHistory?.type === 'content-ideas' ? reopenedHistory : null}
                onHistoryConsumed={() => setReopenedHistory(null)}
              />
            )}
            {activeToolId === 'ad-copy' && <AdCopyGenerator />}
            {activeToolId === 'video-prompt' && <VideoPromptGenerator />}
            {activeToolId === 'persona' && <PersonaGenerator />}
            {activeToolId === 'marketing-plan' && <MarketingPlanGenerator />}
            {activeToolId === 'seo' && <SEOGenerator />}
            {activeToolId === 'social-media' && <SocialMediaGenerator />}
            {activeToolId === 'email' && <EmailGenerator />}
            {activeToolId === 'landing-page' && <LandingPageGenerator />}
            {activeToolId === 'product-description' && <ProductDescriptionGenerator />}
            {activeToolId === 'brand-voice' && <BrandVoiceGenerator />}
            {activeToolId === 'ai-assistant' && <AIAssistant onNavigate={setActiveToolId} />}
            {activeToolId === 'hook-optimizer' && <AiToolsView toolId="hook-optimizer" />}
            {activeToolId === 'ai-rewrite' && <AiToolsView toolId="ai-rewrite" />}
            {activeToolId === 'cta-generator' && <AiToolsView toolId="cta-generator" />}
            {activeToolId === 'headline-improver' && <AiToolsView toolId="headline-improver" />}
            {activeToolId === 'viral-score' && <AnalysisToolView toolId="viral-score" />}
            {activeToolId === 'engagement-prediction' && <AnalysisToolView toolId="engagement-prediction" />}
            {activeToolId === 'emotional-analyzer' && <AnalysisToolView toolId="emotional-analyzer" />}
            {activeToolId === 'readability-score' && <AnalysisToolView toolId="readability-score" />}
            {activeToolId === 'persuasion-score' && <AnalysisToolView toolId="persuasion-score" />}
            {activeToolId === 'history' && (
              <HistoryView onReopen={handleReopenHistory} onRegenerate={handleRegenerate} />
            )}
            {activeToolId === 'projects' && <ProjectsView onNavigate={setActiveToolId} />}
            {activeToolId === 'settings' && <SettingsView />}
          </div>
          <Footer />
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        onNavigate={setActiveToolId}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Settings panel (drawer) */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReopenHistory={(item) => { handleReopenHistory(item); setSettingsOpen(false); }}
      />

      {/* Inactivity help overlay */}
      <InactivityHelp toolId={activeToolId} />
    </div>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <SettingsProvider>
        <HistoryProvider>
          <AccessibilityProvider>
            <AppContent />
          </AccessibilityProvider>
        </HistoryProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}
