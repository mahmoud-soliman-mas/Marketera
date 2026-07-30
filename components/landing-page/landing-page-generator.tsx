'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Target, Users, Layout, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { landingPageService } from '@/lib/landing-page/service';
import type { LandingPageResult } from '@/lib/landing-page/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

export function LandingPageGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LandingPageResult | null>(null);

  const handleGenerate = async () => {
    if (!product.trim() || !audience.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const autoLang = detectLang(product + ' ' + audience);
      const language = settings.autoLanguage ? autoLang : (settings.languageMode === 'auto' ? autoLang : settings.languageMode);

      const res = await landingPageService.generate({
        product: product.trim(),
        audience: audience.trim(),
        goal: goal.trim(),
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      });

      setResult(res);

      addItem({
        type: 'landing-page',
        label: `${product.trim().slice(0, 30)}... | Landing Page`,
        inputs: { product: product.trim(), audience: audience.trim(), goal: goal.trim() },
        results: [res],
      });

      toast.success('Landing page generated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate landing page');
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
        <h2 className="text-3xl font-bold tracking-tight">Landing Page Generator</h2>
        <p className="text-muted-foreground">Generate complete landing page copy with hero, benefits, features & more.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-cyan-500" />
              Page Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Product or Service <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="product"
                placeholder="Describe your product or service..."
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Target Audience <span className="text-destructive">*</span>
              </Label>
              <Input
                id="audience"
                placeholder="e.g., SaaS founders, small business owners"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Conversion Goal</Label>
              <Input
                id="goal"
                placeholder="e.g., Sign up for free trial, book a demo"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !product.trim() || !audience.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
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
                  Generate Landing Page
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              {/* Hero Section */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-6 py-3 border-b">
                  <Badge variant="secondary" className="font-semibold">Hero Section</Badge>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-muted-foreground">Headline</span>
                    <div className="flex items-start justify-between mt-1">
                      <p className="text-2xl font-bold">{result.heroHeadline}</p>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.heroHeadline, 'Headline')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-muted-foreground">Subheadline</span>
                    <div className="flex items-start justify-between mt-1">
                      <p className="text-lg text-muted-foreground">{result.heroSubheadline}</p>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.heroSubheadline, 'Subheadline')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Benefits</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.benefits.join('\n'), 'Benefits')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {result.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-cyan-500" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">Features</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-3">
                  {result.features.map((f, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                      <p className="font-semibold">{f.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">Testimonials</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-3">
                  {result.testimonials.map((t, i) => (
                    <div key={i} className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border">
                      <p className="italic text-sm">"{t.quote}"</p>
                      <p className="mt-2 text-xs font-semibold text-muted-foreground">— {t.author}, {t.role}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">FAQ</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {result.faq.map((f, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/30">
                      <p className="font-semibold text-sm">{f.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">{f.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="border-cyan-200 dark:border-cyan-900">
                <CardContent className="p-6 text-center">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Call to Action</span>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">{result.cta}</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => handleCopy(result.cta, 'CTA')}>
                    <Copy className="h-4 w-4 mr-1" /> Copy CTA
                  </Button>
                </CardContent>
              </Card>

              {/* Full Copy */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Complete Landing Page Copy</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.fullCopy, 'Full copy')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.fullCopy.slice(0, 500)}...</p>
                </CardContent>
              </Card>

              <Button onClick={handleGenerate} disabled={loading} variant="outline" className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </>
          ) : (
            <Card className="border-dashed flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground p-8">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your landing page will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
