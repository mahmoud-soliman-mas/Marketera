'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Target, Users, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { VoiceInputButton, VoiceOutputButton, ToolHelpButton } from '@/components/voice/voice-buttons';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { seoService } from '@/lib/seo/service';
import type { SEOResult } from '@/lib/seo/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

export function SEOGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const [product, setProduct] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SEOResult | null>(null);

  const handleGenerate = async () => {
    if (!product.trim() || !industry.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const autoLang = detectLang(product + ' ' + industry);
      const language = settings.autoLanguage ? autoLang : (settings.languageMode === 'auto' ? autoLang : settings.languageMode);

      const res = await seoService.generate({
        product: product.trim(),
        industry: industry.trim(),
        targetAudience: targetAudience.trim(),
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      });

      setResult(res);

      addItem({
        type: 'seo',
        label: `${product.trim().slice(0, 30)}... | SEO`,
        inputs: { product: product.trim(), industry: industry.trim(), targetAudience: targetAudience.trim() },
        results: [res],
      });

      toast.success('SEO keywords generated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate SEO keywords');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">SEO Keyword Generator</h2>
        <p className="text-muted-foreground">Generate keywords, search intent & content opportunities for your niche.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-emerald-500" />
              SEO Details
              <ToolHelpButton toolId="seo" className="ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Product or Service <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-end gap-2">
                <Textarea
                  id="product"
                  placeholder="Describe your product or service..."
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  rows={3}
                  className="resize-none flex-1"
                />
                <VoiceInputButton fillField={setProduct} className="h-10 w-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                Industry / Niche <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="industry"
                  placeholder="e.g., Fitness, E-commerce, SaaS, Real Estate"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton fillField={setIndustry} className="h-10 w-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Target Audience
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="audience"
                  placeholder="e.g., Young professionals aged 25-35"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton fillField={setTargetAudience} className="h-10 w-10" />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !product.trim() || !industry.trim()}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate SEO Keywords
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              <SEOCard title="Primary Keywords" items={result.primaryKeywords} accent="emerald" onCopy={handleCopy} />
              <SEOCard title="Long Tail Keywords" items={result.longTailKeywords} accent="teal" onCopy={handleCopy} />
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase text-muted-foreground">Search Intent</span>
                      <p className="mt-1 font-semibold">{result.searchIntent}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase text-muted-foreground">Keyword Difficulty</span>
                      <p className="mt-1 font-semibold">{result.keywordDifficulty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <SEOCard title="Content Opportunities" items={result.contentOpportunities} accent="cyan" onCopy={handleCopy} />
              <SEOCard title="Suggested Titles" items={result.suggestedTitles} accent="blue" onCopy={handleCopy} />
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Meta Description</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.metaDescription, 'Meta description')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{result.metaDescription}</p>
                </CardContent>
              </Card>
              <SEOCard title="FAQ Ideas" items={result.faqIdeas} accent="indigo" onCopy={handleCopy} />
              <Button onClick={handleGenerate} disabled={loading} variant="outline" className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </>
          ) : (
            <Card className="border-dashed flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground p-8">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your SEO keywords will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SEOCard({ title, items, accent, onCopy }: { title: string; items: string[]; accent: string; onCopy: (text: string, label: string) => void }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onCopy(items.join('\n'), title)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <Badge key={i} variant="secondary" className={colors[accent]}>
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
