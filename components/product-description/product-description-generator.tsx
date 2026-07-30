'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, ShoppingBag, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { productDescriptionService } from '@/lib/product-description/service';
import type { ProductDescriptionResult } from '@/lib/product-description/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

const TONES = ['professional', 'casual', 'luxury', 'playful'] as const;

export function ProductDescriptionGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'luxury' | 'playful'>('professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductDescriptionResult | null>(null);

  const handleGenerate = async () => {
    if (!productName.trim() || !category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const autoLang = detectLang(productName + ' ' + category);
      const language = settings.autoLanguage ? autoLang : (settings.languageMode === 'auto' ? autoLang : settings.languageMode);

      const res = await productDescriptionService.generate({
        productName: productName.trim(),
        category: category.trim(),
        features: features.trim(),
        targetAudience: targetAudience.trim(),
        tone,
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      });

      setResult(res);

      addItem({
        type: 'product-description',
        label: `${productName.trim().slice(0, 30)}... | Product`,
        inputs: { productName: productName.trim(), category: category.trim(), features: features.trim(), targetAudience: targetAudience.trim(), tone },
        results: [res],
      });

      toast.success('Product description generated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate product description');
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
        <h2 className="text-3xl font-bold tracking-tight">Product Description Generator</h2>
        <p className="text-muted-foreground">Generate high-converting ecommerce product descriptions.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-teal-500" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="productName"
                placeholder="e.g., Ergonomic Office Chair"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                Category <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                placeholder="e.g., Furniture, Electronics, Fashion"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Key Features</Label>
              <Textarea
                id="features"
                placeholder="List the key features of your product..."
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Target Audience
              </Label>
              <Input
                id="audience"
                placeholder="e.g., Remote workers, professionals"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <Badge
                    key={t}
                    variant={tone === t ? 'default' : 'outline'}
                    className={`cursor-pointer px-3 py-1.5 capitalize transition-all ${tone === t ? 'bg-teal-500 hover:bg-teal-600' : 'hover:bg-muted'}`}
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !productName.trim() || !category.trim()}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
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
                  Generate Description
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">Headline</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.headline, 'Headline')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-2xl font-bold">{result.headline}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Short Description</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.shortDescription, 'Short description')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground">{result.shortDescription}</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Long Description</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.longDescription, 'Long description')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap">{result.longDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Bullet Points</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.bulletPoints.map(b => `• ${b}`).join('\n'), 'Bullet points')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {result.bulletPoints.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-teal-500 mt-1">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200 dark:border-teal-900">
                <CardContent className="p-6 text-center">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Call to Action</span>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-2">{result.cta}</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => handleCopy(result.cta, 'CTA')}>
                    <Copy className="h-4 w-4 mr-1" /> Copy CTA
                  </Button>
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
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your product description will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
