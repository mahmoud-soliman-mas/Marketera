'use client';

import { useState } from 'react';
import {
  Sparkles, TrendingUp, AlertTriangle, Lightbulb, Brain, Target,
  Zap, Heart, BarChart2, BookOpen, Wand2, ArrowRight, Loader2, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/settings';
import {
  getViralScore, getEngagementPrediction, getEmotionalAnalysis,
  getReadabilityScore, getPersuasionScore, getAiInsights,
} from '@/lib/analysis/service';
import type {
  ViralScoreResult, EngagementPrediction, EmotionalAnalysis,
  ReadabilityScore, PersuasionScore, AiInsights,
} from '@/lib/analysis/types';

type AnalysisKind = 'viral' | 'engagement' | 'emotional' | 'readability' | 'persuasion' | 'insights';

interface AnalysisPanelProps {
  content: string;
  lang: 'ar' | 'en';
  className?: string;
}

const ANALYSIS_TABS: { id: AnalysisKind; label: string; labelAr: string; icon: React.ElementType }[] = [
  { id: 'viral', label: 'Viral Score', labelAr: 'النتيجة الفيروسية', icon: Zap },
  { id: 'engagement', label: 'Engagement', labelAr: 'التفاعل', icon: TrendingUp },
  { id: 'emotional', label: 'Emotions', labelAr: 'العواطف', icon: Heart },
  { id: 'readability', label: 'Readability', labelAr: 'القراءة', icon: BookOpen },
  { id: 'persuasion', label: 'Persuasion', labelAr: 'الإقناع', icon: Target },
  { id: 'insights', label: 'AI Insights', labelAr: 'الرؤى', icon: Brain },
];

export function AnalysisPanel({ content, lang, className }: AnalysisPanelProps) {
  const { settings } = useSettings();
  const [active, setActive] = useState<AnalysisKind>('viral');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viral, setViral] = useState<ViralScoreResult | null>(null);
  const [engagement, setEngagement] = useState<EngagementPrediction | null>(null);
  const [emotional, setEmotional] = useState<EmotionalAnalysis | null>(null);
  const [readability, setReadability] = useState<ReadabilityScore | null>(null);
  const [persuasion, setPersuasion] = useState<PersuasionScore | null>(null);
  const [insights, setInsights] = useState<AiInsights | null>(null);

  const isAr = lang === 'ar';

  const runAnalysis = async (kind: AnalysisKind) => {
    setActive(kind);
    setError(null);

    const cached = {
      viral, engagement, emotional, readability, persuasion, insights,
    }[kind];

    if (cached) return;

    setLoading(true);
    try {
      switch (kind) {
        case 'viral':
          setViral(await getViralScore(content, lang, settings.creativity));
          break;
        case 'engagement':
          setEngagement(await getEngagementPrediction(content, undefined, lang, settings.creativity));
          break;
        case 'emotional':
          setEmotional(await getEmotionalAnalysis(content, lang, settings.creativity));
          break;
        case 'readability':
          setReadability(await getReadabilityScore(content, lang, settings.creativity));
          break;
        case 'persuasion':
          setPersuasion(await getPersuasionScore(content, lang, settings.creativity));
          break;
        case 'insights':
          setInsights(await getAiInsights(content, lang, settings.creativity));
          break;
      }
    } catch (e) {
      setError(isAr ? 'فشل التحليل. حاول مرة أخرى.' : 'Analysis failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('rounded-2xl glass overflow-hidden', className)}>
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-border/40 px-3 py-2">
        {ANALYSIS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => runAnalysis(tab.id)}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {isAr ? tab.labelAr : tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5" dir={isAr ? 'rtl' : 'ltr'}>
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="mt-3 text-xs">{isAr ? 'جاري التحليل...' : 'Analyzing...'}</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && active === 'viral' && viral && (
          <ViralScoreView data={viral} isAr={isAr} />
        )}
        {!loading && !error && active === 'engagement' && engagement && (
          <EngagementView data={engagement} isAr={isAr} />
        )}
        {!loading && !error && active === 'emotional' && emotional && (
          <EmotionalView data={emotional} isAr={isAr} />
        )}
        {!loading && !error && active === 'readability' && readability && (
          <ReadabilityView data={readability} isAr={isAr} />
        )}
        {!loading && !error && active === 'persuasion' && persuasion && (
          <PersuasionView data={persuasion} isAr={isAr} />
        )}
        {!loading && !error && active === 'insights' && insights && (
          <InsightsView data={insights} isAr={isAr} />
        )}

        {!loading && !error && !{ viral, engagement, emotional, readability, persuasion, insights }[active] && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm text-muted-foreground">
              {isAr ? 'انقر على تبويب لبدء التحليل' : 'Click a tab to start analysis'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-views ────────────────────────────────────────────────────────────────

function ScoreRing({ score, isAr }: { score: number; isAr: boolean }) {
  const color = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500';
  const ringColor = score >= 80 ? 'stroke-emerald-500' : score >= 60 ? 'stroke-amber-500' : 'stroke-rose-500';
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" strokeWidth="6" className="stroke-muted/40" />
          <circle
            cx="40" cy="40" r="36" fill="none" strokeWidth="6"
            strokeLinecap="round"
            className={cn(ringColor, 'transition-all duration-700')}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', color)}>{score}</span>
          <span className="text-[10px] font-medium text-muted-foreground">/100</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-muted-foreground">
        {isAr ? 'النتيجة' : 'Score'}
      </p>
    </div>
  );
}

function BreakdownBar({ label, value, isAr }: { label: string; value: number; isAr: boolean }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ViralScoreView({ data, isAr }: { data: ViralScoreResult; isAr: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        <ScoreRing score={data.score} isAr={isAr} />
        <div className="flex-1 space-y-2.5">
          <BreakdownBar label={isAr ? 'الفضول' : 'Curiosity'} value={data.breakdown.curiosity} isAr={isAr} />
          <BreakdownBar label={isAr ? 'العاطفة' : 'Emotion'} value={data.breakdown.emotion} isAr={isAr} />
          <BreakdownBar label={isAr ? 'الوضوح' : 'Clarity'} value={data.breakdown.clarity} isAr={isAr} />
          <BreakdownBar label={isAr ? 'التميّز' : 'Uniqueness'} value={data.breakdown.uniqueness} isAr={isAr} />
          <BreakdownBar label={isAr ? 'القابلية للتنفيذ' : 'Actionability'} value={data.breakdown.actionability} isAr={isAr} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{data.reasoning}</p>
      {data.tips.length > 0 && (
        <div className="rounded-lg bg-primary/5 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
            <Lightbulb className="h-3 w-3" />
            {isAr ? 'نصائح' : 'Tips'}
          </p>
          <ul className="space-y-1">
            {data.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <ArrowRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary/60" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EngagementView({ data, isAr }: { data: EngagementPrediction; isAr: boolean }) {
  const metrics = [
    { label: isAr ? 'CTR' : 'CTR', value: data.ctr, icon: TrendingUp },
    { label: isAr ? 'التفاعل' : 'Engagement', value: data.engagement, icon: Heart },
    { label: isAr ? 'معدل الإيقاف' : 'Scroll Stop', value: data.scrollStopRate, icon: BarChart2 },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl bg-muted/40 p-3 text-center">
              <Icon className="mx-auto mb-1.5 h-4 w-4 text-primary" />
              <p className="text-xl font-bold text-foreground">{m.value}</p>
              <p className="text-[10px] font-medium text-muted-foreground">{m.label}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-primary/5 p-3">
        <p className="text-xs font-bold text-primary">{isAr ? 'الوصول المتوقع' : 'Predicted Reach'}</p>
        <p className="mt-1 text-sm text-foreground">{data.predictedReach}</p>
      </div>
      <p className="text-sm text-muted-foreground">{data.analysis}</p>
    </div>
  );
}

function EmotionalView({ data, isAr }: { data: EmotionalAnalysis; isAr: boolean }) {
  const emotions = [
    { key: 'curiosity', label: isAr ? 'الفضول' : 'Curiosity', value: data.emotions.curiosity },
    { key: 'trust', label: isAr ? 'الثقة' : 'Trust', value: data.emotions.trust },
    { key: 'fear', label: isAr ? 'الخوف' : 'Fear', value: data.emotions.fear },
    { key: 'excitement', label: isAr ? 'الحماس' : 'Excitement', value: data.emotions.excitement },
    { key: 'urgency', label: isAr ? 'الإلحاح' : 'Urgency', value: data.emotions.urgency },
    { key: 'fomo', label: isAr ? 'FOMO' : 'FOMO', value: data.emotions.fomo },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/10 p-3 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">
          {isAr ? 'العاطفة المهيمنة' : 'Dominant Emotion'}
        </p>
        <p className="mt-1 text-lg font-bold text-foreground">{data.dominantEmotion}</p>
      </div>
      <div className="space-y-2.5">
        {emotions.map((e) => (
          <BreakdownBar key={e.key} label={e.label} value={e.value} isAr={isAr} />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{data.analysis}</p>
    </div>
  );
}

function ReadabilityView({ data, isAr }: { data: ReadabilityScore; isAr: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={data.score} isAr={isAr} />
        <div className="space-y-2">
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{isAr ? 'المستوى' : 'Grade Level'}</p>
            <p className="text-sm font-semibold text-foreground">{data.gradeLevel}</p>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{isAr ? 'وقت القراءة' : 'Reading Time'}</p>
            <p className="text-sm font-semibold text-foreground">{data.readingTime}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{data.analysis}</p>
      {data.suggestions.length > 0 && (
        <div className="rounded-lg bg-primary/5 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
            <Lightbulb className="h-3 w-3" />
            {isAr ? 'اقتراحات' : 'Suggestions'}
          </p>
          <ul className="space-y-1">
            {data.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <ArrowRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary/60" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PersuasionView({ data, isAr }: { data: PersuasionScore; isAr: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={data.score} isAr={isAr} />
        <div className="flex-1 space-y-2.5">
          <BreakdownBar label={isAr ? 'المصداقية (Ethos)' : 'Ethos'} value={data.breakdown.ethos} isAr={isAr} />
          <BreakdownBar label={isAr ? 'العاطفة (Pathos)' : 'Pathos'} value={data.breakdown.pathos} isAr={isAr} />
          <BreakdownBar label={isAr ? 'المنطق (Logos)' : 'Logos'} value={data.breakdown.logos} isAr={isAr} />
          <BreakdownBar label={isAr ? 'الدعوة للعمل' : 'CTA'} value={data.breakdown.cta} isAr={isAr} />
        </div>
      </div>
      <div className="rounded-lg bg-primary/10 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{isAr ? 'الإطار التسويقي' : 'Marketing Framework'}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{data.framework}</p>
      </div>
      <p className="text-sm text-muted-foreground">{data.analysis}</p>
      {data.suggestions.length > 0 && (
        <div className="rounded-lg bg-primary/5 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
            <Lightbulb className="h-3 w-3" />
            {isAr ? 'اقتراحات' : 'Suggestions'}
          </p>
          <ul className="space-y-1">
            {data.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <ArrowRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary/60" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InsightsView({ data, isAr }: { data: AiInsights; isAr: boolean }) {
  const sections = [
    { title: isAr ? 'نقاط القوة' : 'Strengths', items: data.strengths, icon: TrendingUp, color: 'text-emerald-500' },
    { title: isAr ? 'نقاط الضعف' : 'Weaknesses', items: data.weaknesses, icon: AlertTriangle, color: 'text-amber-500' },
    { title: isAr ? 'تحسينات' : 'Improvements', items: data.improvements, icon: Lightbulb, color: 'text-primary' },
    { title: isAr ? 'بدائل أفضل' : 'Alternatives', items: data.alternatives, icon: ArrowRight, color: 'text-violet-500' },
    { title: isAr ? 'محفزات نفسية' : 'Psychological Triggers', items: data.psychologicalTriggers, icon: Brain, color: 'text-pink-500' },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gradient-to-r from-primary/10 to-cyan-500/10 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{isAr ? 'الإطار التسويقي' : 'Marketing Framework'}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{data.marketingFramework}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="rounded-xl bg-muted/30 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Icon className={cn('h-3.5 w-3.5', s.color)} />
                {s.title}
              </p>
              <ul className="space-y-1">
                {s.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                    <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
