'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Volume2, Target, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { brandVoiceService } from '@/lib/brand-voice/service';
import type { BrandVoiceResult } from '@/lib/brand-voice/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

export function BrandVoiceGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandValues, setBrandValues] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrandVoiceResult | null>(null);

  const handleGenerate = async () => {
    if (!brandName.trim() || !industry.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const autoLang = detectLang(brandName + ' ' + industry);
      const language = settings.autoLanguage ? autoLang : (settings.languageMode === 'auto' ? autoLang : settings.languageMode);

      const res = await brandVoiceService.generate({
        brandName: brandName.trim(),
        industry: industry.trim(),
        targetAudience: targetAudience.trim(),
        brandValues: brandValues.trim(),
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      });

      setResult(res);

      addItem({
        type: 'brand-voice',
        label: `${brandName.trim()} | Brand Voice`,
        inputs: { brandName: brandName.trim(), industry: industry.trim(), targetAudience: targetAudience.trim(), brandValues: brandValues.trim() },
        results: [res],
      });

      toast.success('Brand voice generated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate brand voice');
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
        <h2 className="text-3xl font-bold tracking-tight">Brand Voice Generator</h2>
        <p className="text-muted-foreground">Define your brand personality, tone, story & messaging guidelines.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.3fr]">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-purple-500" />
              Brand Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brandName" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Brand Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="brandName"
                placeholder="e.g., Nike, Apple, Spotify"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                Industry <span className="text-destructive">*</span>
              </Label>
              <Input
                id="industry"
                placeholder="e.g., Tech, Fashion, Health & Fitness"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Target Audience
              </Label>
              <Input
                id="audience"
                placeholder="e.g., Millennials, professionals"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="values" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Brand Values
              </Label>
              <Textarea
                id="values"
                placeholder="e.g., Innovation, sustainability, authenticity..."
                value={brandValues}
                onChange={(e) => setBrandValues(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !brandName.trim() || !industry.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
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
                  Generate Brand Voice
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">Brand Personality</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.personality, 'Personality')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-lg">{result.personality}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Brand Tone</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.tone, 'Tone')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground">{result.tone}</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Brand Story</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.story, 'Brand story')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap">{result.story}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Messaging Guidelines</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.messagingGuidelines.join('\n'), 'Guidelines')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {result.messagingGuidelines.map((g, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span className="text-sm">{g}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold">Vocabulary</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.vocabulary.join(', '), 'Vocabulary')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {result.vocabulary.map((v, i) => (
                        <Badge key={i} variant="secondary" className="text-purple-600 dark:text-purple-400">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold">Words to Avoid</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.wordsToAvoid.join(', '), 'Words to avoid')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {result.wordsToAvoid.map((w, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {w}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={handleGenerate} disabled={loading} variant="outline" className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </>
          ) : (
            <Card className="border-dashed flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground p-8">
                <Volume2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your brand voice will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
