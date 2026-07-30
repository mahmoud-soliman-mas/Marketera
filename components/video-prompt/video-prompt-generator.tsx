'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Users, Target, Clock, Palette, Video, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { videoPromptService } from '@/lib/video-prompt/service';
import type { VideoPromptResult, VideoPromptPlatform, VideoPromptLength, VideoPromptStyle, VideoPromptRequest } from '@/lib/video-prompt/types';
import { PLATFORM_LABELS, LENGTH_LABELS, STYLE_LABELS, VIDEO_MODELS } from '@/lib/video-prompt/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

const PLATFORMS: VideoPromptPlatform[] = ['tiktok', 'instagram-reels', 'youtube-shorts', 'facebook', 'linkedin'];
const LENGTHS: VideoPromptLength[] = ['15', '30', '60'];
const STYLES: VideoPromptStyle[] = ['cinematic', 'ugc', 'luxury', 'corporate', 'viral', 'documentary', 'minimal'];

export function VideoPromptGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [platform, setPlatform] = useState<VideoPromptPlatform>('tiktok');
  const [length, setLength] = useState<VideoPromptLength>('30');
  const [style, setStyle] = useState<VideoPromptStyle>('cinematic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoPromptResult | null>(null);

  const handleGenerate = async () => {
    if (!product.trim() || !audience.trim() || !goal.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const autoLang = detectLang(product + ' ' + audience + ' ' + goal);
      const language = settings.autoLanguage ? autoLang : (settings.languageMode === 'auto' ? autoLang : settings.languageMode);

      const req: VideoPromptRequest = {
        product: product.trim(),
        audience: audience.trim(),
        goal: goal.trim(),
        platform,
        length,
        style,
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      };

      const res = await videoPromptService.generate(req);
      setResult(res);

      addItem({
        type: 'video-prompt',
        label: `${product.trim().slice(0, 30)}... | ${PLATFORM_LABELS[platform]}`,
        inputs: { product: product.trim(), audience: audience.trim(), goal: goal.trim(), platform, length, style },
        results: [res],
      });

      toast.success('Video prompt generated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate video prompt');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Video Prompt Generator</h2>
        <p className="text-muted-foreground">Generate professional prompts for AI video generators like Veo, Runway, Pika, Kling & Luma.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
        {/* Input Form */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-violet-500" />
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product */}
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

            {/* Audience */}
            <div className="space-y-2">
              <Label htmlFor="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Target Audience <span className="text-destructive">*</span>
              </Label>
              <Input
                id="audience"
                placeholder="e.g., Young professionals aged 25-35"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                Marketing Goal <span className="text-destructive">*</span>
              </Label>
              <Input
                id="goal"
                placeholder="e.g., Drive app downloads, increase brand awareness"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                Platform
              </Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Badge
                    key={p}
                    variant={platform === p ? 'default' : 'outline'}
                    className={`cursor-pointer px-3 py-1.5 transition-all ${platform === p ? 'bg-violet-500 hover:bg-violet-600' : 'hover:bg-muted'}`}
                    onClick={() => setPlatform(p)}
                  >
                    {PLATFORM_LABELS[p]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Length */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Video Length
              </Label>
              <div className="flex gap-2">
                {LENGTHS.map((l) => (
                  <Badge
                    key={l}
                    variant={length === l ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-2 transition-all ${length === l ? 'bg-violet-500 hover:bg-violet-600' : 'hover:bg-muted'}`}
                    onClick={() => setLength(l)}
                  >
                    {LENGTH_LABELS[l]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Visual Style
              </Label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <Badge
                    key={s}
                    variant={style === s ? 'default' : 'outline'}
                    className={`cursor-pointer px-3 py-1.5 transition-all ${style === s ? 'bg-violet-500 hover:bg-violet-600' : 'hover:bg-muted'}`}
                    onClick={() => setStyle(s)}
                  >
                    {STYLE_LABELS[s]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !product.trim() || !audience.trim() || !goal.trim()}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
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
                  Generate Prompt
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
                <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">Marketing Hook</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.hook, 'Hook')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-xl font-semibold">{result.hook}</p>
                </CardContent>
              </Card>

              {/* Main Prompt */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">Video Prompt</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.prompt, 'Video prompt')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.prompt}</p>
                </CardContent>
              </Card>

              {/* Negative Prompt */}
              <Card className="border-orange-200 dark:border-orange-900/50">
                <div className="bg-orange-500/10 px-6 py-3 border-b border-orange-200 dark:border-orange-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <Badge variant="secondary" className="font-semibold">Negative Prompt</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.negativePrompt, 'Negative prompt')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">{result.negativePrompt}</p>
                </CardContent>
              </Card>

              {/* Recommended Model */}
              <Card className="border-emerald-200 dark:border-emerald-900/50">
                <div className="bg-emerald-500/10 px-6 py-3 border-b border-emerald-200 dark:border-emerald-900/50">
                  <Badge variant="secondary" className="font-semibold">Recommended AI Model</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Video className="h-6 w-6 text-emerald-500" />
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {result.recommendedModel}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{result.recommendedModelReason}</p>
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
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your video prompt will appear here</p>
                <p className="text-sm mt-2">Fill in the details and click Generate</p>
                <p className="text-xs mt-4 text-muted-foreground/70">
                  Compatible with Veo, Runway, Pika, Kling & Luma Dream Machine
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
