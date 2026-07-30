'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Target, Smile, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { socialMediaService } from '@/lib/social-media/service';
import type { SocialPlatform, SocialMediaResult } from '@/lib/social-media/types';
import { PLATFORM_LABELS, PLATFORM_SPECS } from '@/lib/social-media/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

const PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'threads'];
const TONES = ['professional', 'casual', 'playful', 'luxury', 'bold'] as const;

export function SocialMediaGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const [product, setProduct] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [tone, setTone] = useState<'professional' | 'casual' | 'playful' | 'luxury' | 'bold'>('casual');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SocialMediaResult | null>(null);

  const handleGenerate = async () => {
    if (!product.trim()) {
      toast.error('Please describe your product or message');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const autoLang = detectLang(product);
      const language = settings.autoLanguage ? autoLang : (settings.languageMode === 'auto' ? autoLang : settings.languageMode);

      const res = await socialMediaService.generate({
        product: product.trim(),
        platform,
        tone,
        includeEmojis,
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      });

      setResult(res);

      addItem({
        type: 'social-media',
        label: `${product.trim().slice(0, 30)}... | ${PLATFORM_LABELS[platform]}`,
        inputs: { product: product.trim(), platform, tone, includeEmojis: String(includeEmojis) },
        results: [res],
      });

      toast.success('Social media post generated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate post');
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
        <h2 className="text-3xl font-bold tracking-tight">Social Media Post Generator</h2>
        <p className="text-muted-foreground">Generate engaging posts for any social platform.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              Post Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Product or Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="product"
                placeholder="Describe your product, service, or message you want to share..."
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Badge
                    key={p}
                    variant={platform === p ? 'default' : 'outline'}
                    className={`cursor-pointer px-3 py-1.5 transition-all ${platform === p ? 'bg-pink-500 hover:bg-pink-600' : 'hover:bg-muted'}`}
                    onClick={() => setPlatform(p)}
                  >
                    {PLATFORM_LABELS[p]}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Max {PLATFORM_SPECS[platform].maxChars} characters, up to {PLATFORM_SPECS[platform].hashtagLimit} hashtags
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <Badge
                    key={t}
                    variant={tone === t ? 'default' : 'outline'}
                    className={`cursor-pointer px-3 py-1.5 capitalize transition-all ${tone === t ? 'bg-pink-500 hover:bg-pink-600' : 'hover:bg-muted'}`}
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Smile className="h-4 w-4" />
                  Include Emojis
                </Label>
                <p className="text-xs text-muted-foreground">Add relevant emojis to your post</p>
              </div>
              <Switch checked={includeEmojis} onCheckedChange={setIncludeEmojis} />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !product.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
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
                  Generate Post
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">Caption</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.caption, 'Caption')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap text-lg">{result.caption}</p>
                </CardContent>
              </Card>

              <Card>
                <div className="bg-muted/50 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Call to Action</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.cta, 'CTA')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-xl font-bold text-pink-600 dark:text-pink-400">{result.cta}</p>
                </CardContent>
              </Card>

              <Card>
                <div className="bg-muted/50 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Hashtags</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.hashtags.map(h => `#${h}`).join(' '), 'Hashtags')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-pink-600 dark:text-pink-400">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
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
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your social media post will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
