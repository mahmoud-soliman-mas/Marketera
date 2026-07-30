'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Users, Building2, Globe, CopyCheck } from 'lucide-react';
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
import { personaService } from '@/lib/persona/service';
import type { PersonaResult, PersonaRequest } from '@/lib/persona/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

export function PersonaGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const t = useTranslation();
  const [product, setProduct] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonaResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!product.trim() || !industry.trim() || !targetMarket.trim()) {
      toast.error(t.errors.pleaseFillAllFields);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const autoLang = detectLang(product + ' ' + industry);
      const language = settings.autoLanguage ? autoLang : (settings.languageMode === 'auto' ? autoLang : settings.languageMode);

      const req: PersonaRequest = {
        product: product.trim(),
        industry: industry.trim(),
        targetMarket: targetMarket.trim(),
        country: country.trim() || undefined,
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      };

      const res = await personaService.generate(req);
      setResult(res);

      addItem({
        type: 'persona',
        label: `${t.persona.title}: ${res.personaName}`,
        inputs: { product: product.trim(), industry: industry.trim(), targetMarket: targetMarket.trim() },
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
      [t.persona.personaName]: result.personaName,
      [t.persona.age]: result.age,
      [t.persona.gender]: result.gender,
      [t.persona.occupation]: result.occupation,
      [t.persona.incomeLevel]: result.incomeLevel,
      [t.persona.goals]: result.goals,
      [t.persona.painPoints]: result.painPoints,
      [t.persona.motivations]: result.motivations,
      [t.persona.buyingBehavior]: result.buyingBehavior,
      [t.persona.preferredPlatforms]: result.preferredPlatforms,
      [t.persona.preferredContent]: result.preferredContent,
      [t.persona.objections]: result.objections,
      [t.persona.bestMessage]: result.bestMessage,
      [t.persona.recommendedCta]: result.recommendedCta,
    })
      .map(([key, value]) => `${key}:\n${value}`)
      .join('\n\n');
    navigator.clipboard.writeText(allText);
    toast.success(t.success.copiedAll);
  };

  const fields: Array<{ key: keyof PersonaResult; label: string }> = [
    { key: 'personaName', label: t.persona.personaName },
    { key: 'age', label: t.persona.age },
    { key: 'gender', label: t.persona.gender },
    { key: 'occupation', label: t.persona.occupation },
    { key: 'incomeLevel', label: t.persona.incomeLevel },
    { key: 'goals', label: t.persona.goals },
    { key: 'painPoints', label: t.persona.painPoints },
    { key: 'motivations', label: t.persona.motivations },
    { key: 'buyingBehavior', label: t.persona.buyingBehavior },
    { key: 'preferredPlatforms', label: t.persona.preferredPlatforms },
    { key: 'preferredContent', label: t.persona.preferredContent },
    { key: 'objections', label: t.persona.objections },
    { key: 'bestMessage', label: t.persona.bestMessage },
    { key: 'recommendedCta', label: t.persona.recommendedCta },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t.persona.title}</h2>
        <p className="text-muted-foreground">{t.persona.subtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
        {/* Input Form */}
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6 space-y-6">
            {/* Product */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                {t.persona.productOrService} <span className="text-destructive">*</span>
                <ToolHelpButton toolId="persona" className="ml-auto" />
              </Label>
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder={t.persona.productPlaceholder}
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  rows={2}
                  className="resize-none flex-1"
                />
                <VoiceInputButton fillField={setProduct} className="h-10 w-10" />
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {t.persona.industry} <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t.persona.industryPlaceholder}
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton fillField={setIndustry} className="h-10 w-10" />
              </div>
            </div>

            {/* Target Market */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {t.persona.targetMarket} <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t.persona.targetMarketPlaceholder}
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton fillField={setTargetMarket} className="h-10 w-10" />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {t.persona.country} <span className="text-muted-foreground text-xs">({t.common.optional})</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t.persona.countryPlaceholder}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton fillField={setCountry} className="h-10 w-10" />
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !product.trim() || !industry.trim() || !targetMarket.trim()}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
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
                  {t.persona.generatePersona}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Header with Copy All */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-semibold text-lg px-4 py-2">
                  {result.personaName}
                </Badge>
                <div className="flex items-center gap-2">
                  <VoiceOutputButton text={Object.values(result).join('. ')} />
                  <Button variant="outline" onClick={handleCopyAll}>
                    {copied === 'all' ? <CopyCheck className="mr-2 h-4 w-4 text-emerald-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    {t.common.copyAll}
                  </Button>
                </div>
              </div>

              {/* Persona Fields */}
              {fields.slice(1).map(({ key, label }) => (
                <Card key={key}>
                  <div className="bg-muted/50 px-6 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{label}</Badge>
                      <div className="flex items-center gap-1">
                        <VoiceOutputButton text={String(result[key])} />
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(result[key], key)}>
                          {copied === key ? <CopyCheck className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
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
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">{t.persona.yourPersonaWillAppear}</p>
                <p className="text-sm mt-2">{t.common.fillDetailsAndGenerate}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
