'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Target, Users, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/lib/settings';
import { useHistory } from '@/lib/history';
import { emailService } from '@/lib/email/service';
import type { EmailType, EmailResult } from '@/lib/email/types';
import { EMAIL_TYPE_LABELS } from '@/lib/email/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';

const EMAIL_TYPES: EmailType[] = ['subject-lines', 'welcome', 'sales', 'follow-up', 'promotional', 'newsletter'];

export function EmailGenerator() {
  const { settings } = useSettings();
  const { addItem } = useHistory();
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [emailType, setEmailType] = useState<EmailType>('subject-lines');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);

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

      const res = await emailService.generate({
        product: product.trim(),
        audience: audience.trim(),
        goal: goal.trim(),
        emailType,
        language,
        creativity: settings.creativity,
        persona: settings.persona,
        mood: settings.mood,
      });

      setResult(res);

      addItem({
        type: 'email',
        label: `${product.trim().slice(0, 30)}... | ${EMAIL_TYPE_LABELS[emailType]}`,
        inputs: { product: product.trim(), audience: audience.trim(), goal: goal.trim(), emailType },
        results: [res],
      });

      toast.success('Email content generated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate email');
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
        <h2 className="text-3xl font-bold tracking-tight">Email Marketing Generator</h2>
        <p className="text-muted-foreground">Generate subject lines, welcome emails, sales emails & more.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Email Details
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
                placeholder="e.g., Small business owners, SaaS founders"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Email Goal</Label>
              <Input
                id="goal"
                placeholder="e.g., Drive sign-ups, promote new feature"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {EMAIL_TYPES.map((t) => (
                  <Badge
                    key={t}
                    variant={emailType === t ? 'default' : 'outline'}
                    className={`cursor-pointer px-3 py-2 justify-center transition-all ${emailType === t ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-muted'}`}
                    onClick={() => setEmailType(t)}
                  >
                    {EMAIL_TYPE_LABELS[t]}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !product.trim() || !audience.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
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
                  Generate Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              {result.subjectLines && result.subjectLines.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold">Subject Lines</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.subjectLines!.join('\n'), 'Subject lines')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {result.subjectLines.map((line, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <p className="font-medium">{line}</p>
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(line, 'Subject line')}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {result.preview && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold">Preview Text</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.preview!, 'Preview')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground">{result.preview}</p>
                  </CardContent>
                </Card>
              )}

              {result.emailBody && (
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="font-semibold">Email Body</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(result.emailBody!, 'Email body')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="whitespace-pre-wrap">{result.emailBody}</p>
                  </CardContent>
                </Card>
              )}

              <Button onClick={handleGenerate} disabled={loading} variant="outline" className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </>
          ) : (
            <Card className="border-dashed flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground p-8">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your email content will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
