'use client';

import { useMemo } from 'react';
import {
  Wand2, Lightbulb, FileText, Video, Users, Mail, Search, Target, Layout,
  Share2, ShoppingBag, Volume2, MessageSquare, History, Sparkles, ArrowRight,
  BarChart2, TrendingUp, Clock, Globe, Zap, Activity,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/section-card';
import { StatCard } from '@/components/stat-card';
import { ScrollReveal } from '@/components/visual/scroll-reveal';
import { useHistory, type HistoryItem } from '@/lib/history';
import { useI18n, useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { TOOLS, type ToolId } from '@/lib/tools';
import { EmptyState } from '@/components/empty-state';
import { VoiceStatusBadge } from '@/components/voice/voice-buttons';

interface DashboardProps {
  onNavigate: (toolId: ToolId) => void;
  onReopenHistory: (item: HistoryItem) => void;
}

const TOOL_ACCENTS: Record<string, string> = {
  hooks: 'from-sky-500 to-cyan-400',
  'content-ideas': 'from-amber-400 to-orange-500',
  'ad-copy': 'from-rose-500 to-pink-500',
  'video-prompt': 'from-violet-500 to-purple-500',
  persona: 'from-emerald-500 to-teal-500',
  'marketing-plan': 'from-indigo-500 to-blue-500',
  seo: 'from-emerald-500 to-teal-500',
  'social-media': 'from-pink-500 to-rose-500',
  email: 'from-blue-500 to-indigo-500',
  'landing-page': 'from-cyan-500 to-blue-500',
  'product-description': 'from-teal-500 to-cyan-500',
  'brand-voice': 'from-purple-500 to-indigo-500',
  'ai-assistant': 'from-sky-500 to-violet-500',
};

const PIE_COLORS = [
  'hsl(199 89% 55%)',
  'hsl(173 80% 45%)',
  'hsl(142 71% 50%)',
  'hsl(38 92% 55%)',
  'hsl(280 70% 60%)',
  'hsl(0 84% 60%)',
  'hsl(217 91% 60%)',
  'hsl(12 76% 61%)',
];

export function Dashboard({ onNavigate, onReopenHistory }: DashboardProps) {
  const { items } = useHistory();
  const { language, t } = useI18n();
  const { settings } = useSettings();

  const stats = useMemo(() => {
    const count = items.length;
    const toolCounts: Record<string, number> = {};
    const langCounts: Record<string, number> = {};
    items.forEach((item) => {
      toolCounts[item.type] = (toolCounts[item.type] || 0) + 1;
      const inferredLang = /[u0600-\u06FF]/.test(item.label) ? 'ar' : 'en';
      langCounts[inferredLang] = (langCounts[inferredLang] || 0) + 1;
    });
    const favoriteTool = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0];
    const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0];
    const totalResults = items.reduce((sum, i) => sum + (Array.isArray(i.results) ? i.results.length : 0), 0);
    return {
      count,
      favoriteTool: favoriteTool ? favoriteTool[0] : null,
      topLanguage: topLanguage ? topLanguage[0] : null,
      totalResults,
      toolCounts,
    };
  }, [items]);

  const quickAccessTools = TOOLS.filter((tool) => tool.available && tool.id !== 'dashboard');

  const recentItems = useMemo(() => {
    return [...items]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [items]);

  // Weekly activity data (last 7 days)
  const weeklyData = useMemo(() => {
    const days: { day: string; count: number; label: string }[] = [];
    const now = new Date();
    const dayLabels = language === 'ar'
      ? ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const count = items.filter((item) => {
        const created = new Date(item.createdAt);
        return created >= dayStart && created < dayEnd;
      }).length;
      days.push({ day: dayLabels[dayStart.getDay()], count, label: dayStart.toLocaleDateString() });
    }
    return days;
  }, [items, language]);

  // Tool distribution for pie chart
  const toolDistribution = useMemo(() => {
    return Object.entries(stats.toolCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [stats.toolCounts]);

  const getToolLabel = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) return toolId;
    return language === 'ar' ? (tool.shortLabelAr || tool.labelAr) : (tool.shortLabel || tool.label);
  };

  const hasData = items.length > 0;

  return (
    <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      {/* Welcome Header */}
      <ScrollReveal>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-400 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {language === 'ar' ? 'مساحة الذكاء الاصطناعي' : 'AI Workspace'}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.dashboard.welcomeBack}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.dashboard.subtitle}
          </p>
        </div>
      </ScrollReveal>

      {/* Stats Row */}
      <ScrollReveal delay={100}>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label={t.dashboard.totalGenerations}
            value={stats.count}
            icon={BarChart2}
            animateValue
          />
          <StatCard
            label={t.dashboard.favoriteTool}
            value={stats.favoriteTool ? getToolLabel(stats.favoriteTool) : '-'}
            icon={Wand2}
            accent={stats.favoriteTool ? TOOL_ACCENTS[stats.favoriteTool] : 'from-sky-500 to-cyan-400'}
          />
          <StatCard
            label={language === 'ar' ? 'إجمالي النتائج' : 'Total Results'}
            value={stats.totalResults}
            icon={TrendingUp}
            accent="from-emerald-500 to-teal-500"
            animateValue
          />
          <StatCard
            label={language === 'ar' ? 'اللغة الأكثر استخداماً' : 'Top Language'}
            value={stats.topLanguage ? (stats.topLanguage === 'ar' ? (language === 'ar' ? 'العربية' : 'Arabic') : 'English') : '-'}
            icon={Globe}
            accent="from-violet-500 to-purple-500"
          />
        </div>
      </ScrollReveal>

      {/* Voice Status */}
      <ScrollReveal delay={150}>
        <div className="mb-6">
          <VoiceStatusBadge />
        </div>
      </ScrollReveal>

      {/* Charts Row */}
      {hasData && (
        <ScrollReveal delay={200}>
          <div className="mb-6 grid gap-4 lg:grid-cols-3">
            {/* Weekly Activity Chart */}
            <SectionCard
              className="lg:col-span-2"
              header={
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Activity className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {language === 'ar' ? 'النشاط الأسبوعي' : 'Weekly Activity'}
                  </h2>
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199 89% 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(199 89% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 12,
                      fontSize: 12,
                      color: 'hsl(var(--popover-foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(199 89% 55%)"
                    strokeWidth={2.5}
                    fill="url(#activityGradient)"
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>

            {/* Tool Distribution */}
            <SectionCard
              header={
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Zap className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {language === 'ar' ? 'توزيع الأدوات' : 'Tool Usage'}
                  </h2>
                </div>
              }
            >
              {toolDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={toolDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      animationDuration={900}
                    >
                      {toolDistribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 12,
                        fontSize: 12,
                        color: 'hsl(var(--popover-foreground))',
                      }}
                      formatter={(value: number, name: string) => [value, getToolLabel(name)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                  {language === 'ar' ? 'لا توجد بيانات' : 'No data yet'}
                </div>
              )}
            </SectionCard>
          </div>
        </ScrollReveal>
      )}

      {/* Quick Access */}
      <ScrollReveal delay={250}>
        <SectionCard
          header={
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wand2 className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t.dashboard.quickAccess}
              </h2>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {quickAccessTools.map((tool, i) => {
              const Icon = tool.icon;
              const shortLabel = language === 'ar' ? (tool.shortLabelAr || tool.labelAr) : (tool.shortLabel || tool.label);
              const description = language === 'ar' ? tool.descriptionAr : tool.description;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onNavigate(tool.id)}
                  className={cn(
                    'group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4 text-center transition-all duration-300',
                    'hover:border-primary/40 hover:shadow-[0_8px_24px_hsl(var(--primary)/0.12)] hover:-translate-y-1',
                    'animate-fade-in-up'
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                      tool.accent
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{shortLabel}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>
      </ScrollReveal>

      {/* Recent Activity */}
      <ScrollReveal delay={300}>
        <div className="mt-6">
          <SectionCard
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <History className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t.dashboard.recentActivity}
                  </h2>
                </div>
              </div>
            }
          >
            {recentItems.length === 0 ? (
              <EmptyState
                icon={Wand2}
                title={t.dashboard.noGenerationsYet}
                description={t.dashboard.noGenerationsDesc}
                action={
                  <button
                    type="button"
                    onClick={() => onNavigate('hooks')}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Wand2 className="h-4 w-4" />
                    {t.dashboard.openHooksGenerator}
                  </button>
                }
              />
            ) : (
              <div className="space-y-2.5">
                {recentItems.map((item, i) => {
                  const tool = TOOLS.find((t) => t.id === item.type);
                  const Icon = tool?.icon ?? Wand2;
                  const toolLabel = tool ? (language === 'ar' ? (tool.shortLabelAr || tool.labelAr) : (tool.shortLabel || tool.label)) : item.type;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onReopenHistory(item)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3 text-left transition-all duration-200',
                        'hover:border-primary/40 hover:bg-card/60 hover:shadow-sm animate-fade-in-up'
                      )}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm',
                          tool?.accent ?? 'from-sky-500 to-cyan-400'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {toolLabel} · {item.results.length} {t.dashboard.results}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      </ScrollReveal>
    </section>
  );
}
