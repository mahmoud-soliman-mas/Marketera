'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Building2, Target, Users, DollarSign, CopyCheck, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { VoiceInputButton, VoiceOutputButton, ToolHelpButton } from '@/components/voice/voice-buttons';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { useTranslation } from '@/lib/i18n';
import { marketingPlanService } from '@/lib/marketing-plan/service';
import type { MarketingPlanResult, MarketingPlanRequest } from '@/lib/marketing-plan/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

export function MarketingPlanGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const t = useTranslation();
  const [business, setBusiness] = useState('');
  const [product, setProduct] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketingPlanResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!business.trim() || !product.trim() || !targetAudience.trim() || !budget.trim() || !goal.trim()) {
      toast.error(t.errors.pleaseFillAllFields);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const autoLang = detectLang(business + ' ' + product);
      const language = settings.autoLanguage ? autoLang : (settings.languageMode === 'auto' ? autoLang : settings.languageMode);

      const req: MarketingPlanRequest = {
        business: business.trim(),
        product: product.trim(),
        targetAudience: targetAudience.trim(),
        budget: budget.trim(),
        goal: goal.trim(),
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      };

      const res = await marketingPlanService.generate(req);
      setResult(res);

      addItem({
        type: 'marketing-plan',
        label: `${t.tools.marketingPlanShort}: ${business.slice(0, 30)}`,
        inputs: { business: business.trim(), product: product.trim(), targetAudience: targetAudience.trim() },
        results: [res],
      });

      toast.success(t.success.generated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.errors.failedToGenerate);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(t.success.copied);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const allText = Object.entries({
      [t.marketingPlan.executiveSummary]: result.executiveSummary,
      [t.marketingPlan.swotAnalysis]: `${t.marketingPlan.strengths}: ${result.strengths}\n${t.marketingPlan.weaknesses}: ${result.weaknesses}\n${t.marketingPlan.opportunities}: ${result.opportunities}\n${t.marketingPlan.threats}: ${result.threats}`,
      [t.marketingPlan.idealCustomer]: result.idealCustomer,
      [t.marketingPlan.marketingChannels]: result.marketingChannels,
      [t.marketingPlan.contentStrategy]: result.contentStrategy,
      [t.marketingPlan.advertisingStrategy]: result.advertisingStrategy,
      [t.marketingPlan.seoStrategy]: result.seoStrategy,
      [t.marketingPlan.emailMarketing]: result.emailMarketing,
      [t.marketingPlan.socialMediaPlan]: result.socialMediaPlan,
      [t.marketingPlan.kpis]: result.kpis,
      [t.marketingPlan.actionPlan30Days]: result.actionPlan30Days,
      [t.marketingPlan.growthPlan90Days]: result.growthPlan90Days,
      [t.marketingPlan.budgetDistribution]: result.budgetDistribution,
      [t.marketingPlan.recommendedTools]: result.recommendedTools,
    })
      .map(([key, value]) => `${key}:\n${value}`)
      .join('\n\n');
    navigator.clipboard.writeText(allText);
    toast.success(t.success.copiedAll);
  };

  const sections: Array<{ key: keyof MarketingPlanResult; label: string }> = [
    { key: 'executiveSummary', label: t.marketingPlan.executiveSummary },
    { key: 'idealCustomer', label: t.marketingPlan.idealCustomer },
    { key: 'marketingChannels', label: t.marketingPlan.marketingChannels },
    { key: 'contentStrategy', label: t.marketingPlan.contentStrategy },
    { key: 'advertisingStrategy', label: t.marketingPlan.advertisingStrategy },
    { key: 'seoStrategy', label: t.marketingPlan.seoStrategy },
    { key: 'emailMarketing', label: t.marketingPlan.emailMarketing },
    { key: 'socialMediaPlan', label: t.marketingPlan.socialMediaPlan },
    { key: 'kpis', label: t.marketingPlan.kpis },
    { key: 'actionPlan30Days', label: t.marketingPlan.actionPlan30Days },
    { key: 'growthPlan90Days', label: t.marketingPlan.growthPlan90Days },
    { key: 'budgetDistribution', label: t.marketingPlan.budgetDistribution },
    { key: 'recommendedTools', label: t.marketingPlan.recommendedTools },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t.marketingPlan.title}</h2>
        <p className="text-muted-foreground">{t.marketingPlan.subtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.5fr]">
        {/* Input Form */}
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6 space-y-6">
            {/* Business */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {t.marketingPlan.business} <span className="text-destructive">*</span>
                <ToolHelpButton toolId="marketing-plan" className="ml-auto" />
              </Label>
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder={t.marketingPlan.businessPlaceholder}
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  rows={2}
                  className="resize-none flex-1"
                />
                <VoiceInputButton fillField={setBusiness} className="h-10 w-10" />
              </div>
            </div>

            {/* Product */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                {t.marketingPlan.product} <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder={t.marketingPlan.productPlaceholder}
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  rows={2}
                  className="resize-none flex-1"
                />
                <VoiceInputButton fillField={setProduct} className="h-10 w-10" />
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {t.marketingPlan.targetAudience} <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder={t.marketingPlan.audiencePlaceholder}
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  rows={2}
                  className="resize-none flex-1"
                />
                <VoiceInputButton fillField={setTargetAudience} className="h-10 w-10" />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {t.marketingPlan.monthlyBudget} <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t.marketingPlan.budgetPlaceholder}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton fillField={setBudget} className="h-10 w-10" />
              </div>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                {t.marketingPlan.goal} <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t.marketingPlan.goalPlaceholder}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton fillField={setGoal} className="h-10 w-10" />
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !business.trim() || !product.trim() || !targetAudience.trim() || !budget.trim() || !goal.trim()}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {t.common.generating}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t.marketingPlan.generatePlan}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Header with Copy All and Export */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="secondary" className="font-semibold text-lg px-4 py-2">
                  {t.marketingPlan.title}
                </Badge>
                <div className="flex gap-2">
                  <VoiceOutputButton text={result.executiveSummary} />
                  <Button variant="outline" onClick={handleCopyAll}>
                    {copied === 'all' ? <CopyCheck className="mr-2 h-4 w-4 text-emerald-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    {t.common.copyAll}
                  </Button>
                </div>
              </div>

              {/* SWOT Analysis - Special Card */}
              <Card className="border-2 border-indigo-100 dark:border-indigo-900/50">
                <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 px-6 py-3 border-b border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">{t.marketingPlan.swotAnalysis}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(
                        `${t.marketingPlan.strengths}: ${result.strengths}\n${t.marketingPlan.weaknesses}: ${result.weaknesses}\n${t.marketingPlan.opportunities}: ${result.opportunities}\n${t.marketingPlan.threats}: ${result.threats}`,
                        'swot'
                      )}
                    >
                      {copied === 'swot' ? <CopyCheck className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">{t.marketingPlan.strengths}</p>
                      <p className="text-sm">{result.strengths}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <p className="font-semibold text-red-700 dark:text-red-400 mb-2">{t.marketingPlan.weaknesses}</p>
                      <p className="text-sm">{result.weaknesses}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">{t.marketingPlan.opportunities}</p>
                      <p className="text-sm">{result.opportunities}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2">{t.marketingPlan.threats}</p>
                      <p className="text-sm">{result.threats}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Sections */}
              {sections.map(({ key, label }) => (
                <Card key={key}>
                  <div className="bg-muted/50 px-6 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{label}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result[key], key)}>
                        {copied === key ? <CopyCheck className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="whitespace-pre-wrap">{result[key]}</p>
                  </CardContent>
                </Card>
              ))}

              {/* Regenerate */}
              <Button onClick={handleGenerate} disabled={loading} variant="outline" className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t.common.regenerate}
              </Button>
            </>
          ) : (
            <Card className="border-dashed flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground p-8">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">{t.marketingPlan.yourPlanWillAppear}</p>
                <p className="text-sm mt-2">{t.common.fillDetailsAndGenerate}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
