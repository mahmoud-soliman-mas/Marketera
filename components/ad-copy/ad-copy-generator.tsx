'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Users, Target, LayoutGrid, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { VoiceInputButton, VoiceOutputButton, ToolHelpButton } from '@/components/voice/voice-buttons';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { adCopyService } from '@/lib/ad-copy/service';
import type { AdCopyResult, AdPlatform, AdGoal, AdCopyRequest } from '@/lib/ad-copy/types';
import { PLATFORM_LABELS, GOAL_LABELS, PLATFORM_SPECS } from '@/lib/ad-copy/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

const PLATFORMS: AdPlatform[] = ['facebook', 'instagram', 'tiktok', 'linkedin', 'google'];
const GOALS: AdGoal[] = ['awareness', 'consideration', 'conversion', 'engagement', 'traffic'];

export function AdCopyGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState<AdPlatform>('facebook');
  const [goal, setGoal] = useState<AdGoal>('conversion');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdCopyResult | null>(null);

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

      const req: AdCopyRequest = {
        product: product.trim(),
        audience: audience.trim(),
        platform,
        goal,
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      };

      const res = await adCopyService.generate(req);
      setResult(res);

      addItem({
        type: 'ad-copy',
        label: `${product.trim().slice(0, 30)}... | ${PLATFORM_LABELS[platform]}`,
        inputs: { product: product.trim(), audience: audience.trim(), platform, goal },
        results: [res],
      });

      toast.success('Ad copy generated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate ad copy');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const specs = PLATFORM_SPECS[platform];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ad Copy Generator</h2>
        <p className="text-muted-foreground">Generate high-converting ad copy for any platform in seconds.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
        {/* Input Form */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              Campaign Details
              <ToolHelpButton toolId="ad-copy" className="ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product */}
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

            {/* Audience */}
            <div className="space-y-2">
              <Label htmlFor="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Target Audience <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="audience"
                  placeholder="e.g., Young professionals aged 25-35 interested in fitness"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton fillField={setAudience} className="h-10 w-10" />
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                Platform
              </Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Badge
                    key={p}
                    variant={platform === p ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-2 transition-all ${platform === p ? 'bg-rose-500 hover:bg-rose-600' : 'hover:bg-muted'}`}
                    onClick={() => setPlatform(p)}
                  >
                    {PLATFORM_LABELS[p]}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {specs.maxPrimary} chars max for primary text, {specs.maxHeadline} for headline
              </p>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                Campaign Goal
              </Label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <Badge
                    key={g}
                    variant={goal === g ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-2 transition-all ${goal === g ? 'bg-rose-500 hover:bg-rose-600' : 'hover:bg-muted'}`}
                    onClick={() => setGoal(g)}
                  >
                    {GOAL_LABELS[g]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !product.trim() || !audience.trim()}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
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
                  Generate Ad Copy
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Hook */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">Hook</Badge>
                    <div className="flex items-center gap-1">
                      <VoiceOutputButton text={result.hook} />
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.hook, 'Hook')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-xl font-semibold">{result.hook}</p>
                </CardContent>
              </Card>

              {/* Headline */}
              <Card>
                <div className="bg-muted/50 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Headline</Badge>
                    <div className="flex items-center gap-1">
                      <VoiceOutputButton text={result.headline} />
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.headline, 'Headline')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-lg font-medium">{result.headline}</p>
                </CardContent>
              </Card>

              {/* Primary Text */}
              <Card>
                <div className="bg-muted/50 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Primary Text</Badge>
                    <div className="flex items-center gap-1">
                      <VoiceOutputButton text={result.primaryText} />
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.primaryText, 'Primary text')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap">{result.primaryText}</p>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card>
                <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Call to Action</Badge>
                    <div className="flex items-center gap-1">
                      <VoiceOutputButton text={result.cta} />
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.cta, 'CTA')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{result.cta}</p>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <div className="bg-muted/50 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Description</Badge>
                    <div className="flex items-center gap-1">
                      <VoiceOutputButton text={result.description} />
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.description, 'Description')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{result.description}</p>
                </CardContent>
              </Card>

              {/* Regenerate */}
              <Button
                onClick={handleRegenerate}
                disabled={loading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </>
          ) : (
            <Card className="border-dashed flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground p-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your ad copy will appear here</p>
                <p className="text-sm mt-2">Fill in the details and click Generate</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
