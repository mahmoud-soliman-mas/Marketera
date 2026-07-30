declare global {
  namespace Deno {
    function serve(handler: (req: Request) => Promise<Response>): void;
    namespace env {
      function get(key: string): string | undefined;
    }
  }
}

export {};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseRequest {
  language?: "en" | "ar";
  count?: number;
  style?: "professional" | "casual" | "creative" | "persuasive";
  mood?: "neutral" | "energetic" | "calm" | "bold" | "playful" | "luxury";
  persona?: "marketer" | "founder" | "copywriter" | "strategist" | "storyteller" | "analyst";
  creativity?: number;
  outputMode?: "draft" | "final";
}

interface GenerateHooksRequest extends BaseRequest {
  type: "hooks";
  idea: string;
}

interface GenerateContentIdeasRequest extends BaseRequest {
  type: "content-ideas";
  niche: string;
  product: string;
  audience?: string;
}

interface AdCopyRequest extends BaseRequest {
  type: "ad-copy";
  product: string;
  audience: string;
  platform: "facebook" | "instagram" | "tiktok" | "linkedin" | "google";
  goal: "awareness" | "consideration" | "conversion" | "engagement" | "traffic";
}

interface VideoPromptRequest extends BaseRequest {
  type: "video-prompt";
  product: string;
  audience: string;
  goal: string;
  platform: "tiktok" | "instagram-reels" | "youtube-shorts" | "facebook" | "linkedin";
  length: "15" | "30" | "60";
  videoStyle: "cinematic" | "ugc" | "luxury" | "corporate" | "viral" | "documentary" | "minimal";
}

interface PersonaRequest extends BaseRequest {
  type: "persona";
  product: string;
  industry: string;
  targetMarket: string;
  country?: string;
}

interface MarketingPlanRequest extends BaseRequest {
  type: "marketing-plan";
  business: string;
  product: string;
  targetAudience: string;
  budget: string;
  goal: string;
}

interface SEORequest extends BaseRequest {
  type: "seo";
  product: string;
  industry: string;
  targetAudience: string;
}

interface SocialMediaRequest extends BaseRequest {
  type: "social-media";
  product: string;
  platform: "facebook" | "instagram" | "linkedin" | "twitter" | "tiktok" | "threads";
  tone: "professional" | "casual" | "playful" | "luxury" | "bold";
  includeEmojis: boolean;
}

interface EmailRequest extends BaseRequest {
  type: "email";
  product: string;
  audience: string;
  emailType: "subject-lines" | "welcome" | "sales" | "follow-up" | "promotional" | "newsletter";
  goal: string;
}

interface LandingPageRequest extends BaseRequest {
  type: "landing-page";
  product: string;
  audience: string;
  goal: string;
}

interface ProductDescriptionRequest extends BaseRequest {
  type: "product-description";
  productName: string;
  category: string;
  features: string;
  targetAudience: string;
  tone: "professional" | "casual" | "luxury" | "playful";
}

interface BrandVoiceRequest extends BaseRequest {
  type: "brand-voice";
  brandName: string;
  industry: string;
  targetAudience: string;
  brandValues: string;
}

interface AIAssistantRequest extends BaseRequest {
  type: "ai-assistant";
  message: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  stream?: boolean;
}

type GenerateRequest =
  | GenerateHooksRequest
  | GenerateContentIdeasRequest
  | AdCopyRequest
  | VideoPromptRequest
  | PersonaRequest
  | MarketingPlanRequest
  | SEORequest
  | SocialMediaRequest
  | EmailRequest
  | LandingPageRequest
  | ProductDescriptionRequest
  | BrandVoiceRequest
  | AIAssistantRequest;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function detectLang(text: string): "ar" | "en" {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicChars / Math.max(text.length, 1) > 0.2 ? "ar" : "en";
}

function clamp(n: unknown, min: number, max: number, fallback: number): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

function temperatureFromCreativity(creativity: unknown): number {
  const c = clamp(creativity, 0, 100, 70);
  return 0.3 + (c / 100) * 0.8;
}

function moodDirective(mood: unknown, lang: "ar" | "en"): string {
  const m = ["neutral", "energetic", "calm", "bold", "playful", "luxury"].includes(String(mood))
    ? (String(mood) as "neutral" | "energetic" | "calm" | "bold" | "playful" | "luxury")
    : "neutral";
  const en: Record<typeof m, string> = {
    neutral: "balanced and even-tempered",
    energetic: "high-energy, punchy and dynamic",
    calm: "soft, reassuring and steady",
    bold: "confident, daring and assertive",
    playful: "fun, lighthearted and witty",
    luxury: "premium, refined and exclusive",
  };
  const ar: Record<typeof m, string> = {
    neutral: "متوازن وهادئ",
    energetic: "حيوي وديناميكي وقوي",
    calm: "ناعم ومطمئن وثابت",
    bold: "واثق وجريء وحازم",
    playful: "مرح وخفيف الظل",
    luxury: "فاخر وراقٍ وحصري",
  };
  return lang === "ar" ? ar[m] : en[m];
}

function personaDirective(persona: unknown, lang: "ar" | "en"): string {
  const p = ["marketer", "founder", "copywriter", "strategist", "storyteller", "analyst"].includes(String(persona))
    ? (String(persona) as "marketer" | "founder" | "copywriter" | "strategist" | "storyteller" | "analyst")
    : "marketer";
  const en: Record<typeof p, string> = {
    marketer: "a senior growth marketer obsessed with conversion",
    founder: "a visionary founder who tells the company's story",
    copywriter: "a world-class copywriter who writes punchy, persuasive lines",
    strategist: "a brand strategist who thinks in insights and positioning",
    storyteller: "a natural storyteller who weaves emotion into every line",
    analyst: "a data-driven analyst who backs every claim with a reason",
  };
  const ar: Record<typeof p, string> = {
    marketer: "مسوّق خبير مهووس بالتحويل",
    founder: "مؤسس رؤيوي يروي قصة الشركة",
    copywriter: "كاتب إعلانات عالمي يكتب عبارات قوية ومقنعة",
    strategist: "استراتيج علامة تجارية يفكر بالرؤى والتموضع",
    storyteller: "راوي ينسج العاطفة في كل سطر",
    analyst: "محلل يعتمد على البيانات ويدعم كل ادعاء بسبب",
  };
  return lang === "ar" ? ar[p] : en[p];
}

function styleDirective(style: unknown, lang: "ar" | "en"): string {
  const s = ["professional", "casual", "creative", "persuasive"].includes(String(style))
    ? (String(style) as "professional" | "casual" | "creative" | "persuasive")
    : "professional";
  const en: Record<typeof s, string> = {
    professional: "polished and professional",
    casual: "casual and conversational",
    creative: "highly creative and unexpected",
    persuasive: "persuasive and action-driving",
  };
  const ar: Record<typeof s, string> = {
    professional: "احترافي ومصقول",
    casual: "عفوي وتلقائي",
    creative: "مبدع وغير متوقع",
    persuasive: "مقنع ويحفّز الفعل",
  };
  return lang === "ar" ? ar[s] : en[s];
}

function outputModeDirective(mode: unknown, lang: "ar" | "en"): string {
  if (mode === "draft") {
    return lang === "ar"
      ? "هذه مسودة استكشافية: نوّع الزوايا بحرية ولو لم تكن كلها مصقولة."
      : "This is an exploratory draft: vary angles freely even if not every line is polished.";
  }
  return lang === "ar"
    ? "هذه النسخة النهائية: كل سطر يجب أن يكون مصقولاً وجاهزاً للنشر."
    : "This is the final version: every line must be polished and ready to ship.";
}

// ─── System Prompts ───────────────────────────────────────────────────────────

function buildHooksSystem(req: GenerateHooksRequest, lang: "ar" | "en"): string {
  const count = clamp(req.count, 1, 50, 10) | 0;
  const mood = moodDirective(req.mood, lang);
  const persona = personaDirective(req.persona, lang);
  const style = styleDirective(req.style, lang);
  const mode = outputModeDirective(req.outputMode, lang);

  if (lang === "ar") {
    return `أنت ${persona}. تكتب عناوين تسويقية قصيرة وجذابة عالية التحويل.

المزاج المطلوب: ${mood}.
الأسلوب: ${style}.
${mode}

القواعد:
- اكتب بالضبط ${count} عنواناً تسويقياً لمنتج/فكرة المستخدم
- كل عنوان قصير (بحد أقصى ~14 كلمة)
- اجعلها توقف التمرير وتثير الفضول أو العاطفة
- مناسبة للإعلانات ووسائل التواصل
- تجنّب العبارات المستهلكة والتكرار بين العناوين
- كل عنوان يجب أن يقدم زاوية مختلفة (خوف، طمع، فضول، تحدي، هوية، إثبات...)
- لا تستخدم علامات اقتباس أو ترقيم داخل العناوين

أجب فقط بكائن JSON: {"hooks": ["عنوان1", "عنوان2", ...]}. لا تستخدم markdown ولا أي نص إضافي.`;
  }

  return `You are ${persona}. You write short, catchy, high-converting marketing hooks.

Desired mood: ${mood}.
Tone: ${style}.
${mode}

Rules:
- Generate exactly ${count} marketing hooks for the user's product/idea
- Each hook must be SHORT (max ~14 words)
- Make them scroll-stopping — use emotion, curiosity, or a sharp angle
- Suitable for ads and social media
- Avoid clichés and generic phrasing
- Each hook must use a DIFFERENT angle (fear, greed, curiosity, challenge, identity, proof, contrast...)
- Do NOT wrap hooks in quotes or add numbering inside the text
- Do NOT repeat phrasing across hooks

Respond with ONLY a JSON object: {"hooks": ["hook1", "hook2", ...]}. Do NOT wrap in markdown.`;
}

function buildContentIdeasSystem(req: GenerateContentIdeasRequest, lang: "ar" | "en"): string {
  const count = clamp(req.count, 1, 50, 20) | 0;
  const mood = moodDirective(req.mood, lang);
  const persona = personaDirective(req.persona, lang);
  const style = styleDirective(req.style, lang);
  const mode = outputModeDirective(req.outputMode, lang);

  if (lang === "ar") {
    return `أنت ${persona} متخصص في إنشاء محتوى فيروسي عالي الأداء.

المزاج المطلوب: ${mood}.
الأسلوب: ${style}.
${mode}

أنشئ بالضبط ${count} فكرة محتوى فريدة وعملية للمجال/المنتج/الجمهور المعطى.

كل فكرة يجب أن تتضمن:
- title: عنوان محتوى مقنع ومحدد (ليس عاماً)
- contentType: واحد من "بوست", "ريل", "فيديو", "كاروسيل", "بلوج"
- category: واحد من "تعليمي", "حل مشكلة", "قصص", "تفاعل", "فيروسي", "بناء سلطة", "ترويجي"
- description: جملة أو جملتان عن ما يغطيه المحتوى ولماذا يعمل

القواعد:
- الأفكار قابلة للتنفيذ فوراً
- غطِّ أنواع الفئات السبع عبر الأفكار
- اجعل العناوين محددة ("كيف ضاعفت متابعيني 10x في 30 يوماً" وليس "نصائح للنمو")
- نوّع أنواع المحتوى
- لا تكرر فكرة مرتين
- تجنّب العناوين العامة والمستهلكة

أجب فقط بكائن JSON: {"ideas": [{title, contentType, category, description}, ...]}. لا تستخدم markdown.`;
  }

  return `You are ${persona} who specializes in viral, high-performing social content.

Desired mood: ${mood}.
Tone: ${style}.
${mode}

Generate exactly ${count} unique, practical content ideas for the given niche/product/audience.

Each idea must include:
- title: A compelling, SPECIFIC content title (not generic)
- contentType: One of "Post", "Reel", "Video", "Carousel", "Blog"
- category: One of "Educational", "Problem-Solving", "Storytelling", "Engagement", "Viral", "Authority", "Promotional"
- description: A 1–2 sentence brief on what the content covers and why it works

Rules:
- Ideas must be IMMEDIATELY actionable
- Cover all 7 category types across the ideas
- Make titles specific ("How I grew my Instagram to 10k in 30 days" not "Tips to grow Instagram")
- Vary content types
- Do NOT repeat the same idea twice
- Avoid generic, overused titles

Respond with ONLY a JSON object: {"ideas": [{title, contentType, category, description}, ...]}. Do NOT wrap in markdown.`;
}

const AD_PLATFORM_SPECS: Record<AdCopyRequest["platform"], { name: string; maxPrimary: number; maxHeadline: number }> = {
  facebook: { name: "Facebook", maxPrimary: 125, maxHeadline: 40 },
  instagram: { name: "Instagram", maxPrimary: 125, maxHeadline: 40 },
  tiktok: { name: "TikTok", maxPrimary: 100, maxHeadline: 30 },
  linkedin: { name: "LinkedIn", maxPrimary: 150, maxHeadline: 50 },
  google: { name: "Google Ads", maxPrimary: 90, maxHeadline: 30 },
};

const AD_GOAL_SPECS: Record<AdCopyRequest["goal"], string> = {
  awareness: "introduce the brand/product to new audiences",
  consideration: "drive interest and engagement with the product",
  conversion: "drive immediate action (purchase, sign-up, etc.)",
  engagement: "encourage likes, comments, shares, and interaction",
  traffic: "drive clicks to website or landing page",
};

function buildAdCopySystem(req: AdCopyRequest, lang: "ar" | "en"): string {
  const platform = AD_PLATFORM_SPECS[req.platform] ?? AD_PLATFORM_SPECS.facebook;
  const goalDesc = AD_GOAL_SPECS[req.goal] ?? AD_GOAL_SPECS.conversion;
  const mood = moodDirective(req.mood, lang);
  const persona = personaDirective(req.persona, lang);
  const mode = outputModeDirective(req.outputMode, lang);

  if (lang === "ar") {
    return `أنت ${persona}. تكتب نصوص إعلانية عالية التحويل لمنصة ${platform.name}.

المزاج: ${mood}.
الهدف الإعلاني: ${goalDesc}.
${mode}

أنتج كائن JSON يحتوي على:
1. "hook": عنوان تسويقي قوي يوقف التمرير (بحد أقصى 12 كلمة)
2. "primaryText": نص الإعلان الرئيسي (بحد أقصى ${platform.maxPrimary} حرف)
3. "headline": عنوان رئيسي للإعلان (بحد أقصى ${platform.maxHeadline} حرف)
4. "cta": دعوة للعمل قوية ومباشرة (2-4 كلمات)
5. "description": وصف مختصر للمنتج/الخدمة (جملة واحدة)

القواعد:
- اجعل النص مقنعاً ومناسباً للمنصة
- استخدم لغة قوية تدفع للفعل
- تجنّب العبارات المستهلكة
- اجعل CTA واضح ومباشر

أجب فقط بكائن JSON: {hook, primaryText, headline, cta, description}. لا تستخدم markdown.`;
  }

  return `You are ${persona}. You write high-converting ad copy for ${platform.name}.

Desired mood: ${mood}.
Ad goal: ${goalDesc}.
${mode}

Produce a JSON object with:
1. "hook": a scroll-stopping marketing hook (max 12 words)
2. "primaryText": the main ad copy (max ${platform.maxPrimary} characters)
3. "headline": a punchy headline (max ${platform.maxHeadline} characters)
4. "cta": a strong call-to-action (2-4 words)
5. "description": a brief product/service description (one sentence)

Rules:
- Make the copy persuasive and platform-appropriate
- Use strong, action-driving language
- Avoid clichés and generic phrasing
- Make the CTA clear and direct

Respond with ONLY a JSON object: {hook, primaryText, headline, cta, description}. Do NOT wrap in markdown.`;
}

const VIDEO_PLATFORM_LABELS: Record<VideoPromptRequest["platform"], string> = {
  tiktok: "TikTok",
  "instagram-reels": "Instagram Reels",
  "youtube-shorts": "YouTube Shorts",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

const VIDEO_STYLE_SPECS: Record<string, string> = {
  cinematic: "film-quality visuals, dramatic lighting, professional camera work",
  ugc: "authentic user-generated content feel, handheld camera, natural lighting",
  luxury: "premium aesthetics, sleek transitions, high-end product showcase",
  corporate: "clean, professional, business-appropriate, minimal distractions",
  viral: "attention-grabbing, fast-paced, trend-aligned, high energy",
  documentary: "narrative-driven, interview style, authentic storytelling",
  minimal: "simple, clean, focused on the product/message",
};

function buildVideoPromptSystem(req: VideoPromptRequest, lang: "ar" | "en"): string {
  const platform = VIDEO_PLATFORM_LABELS[req.platform] ?? "TikTok";
  const styleKey = req.videoStyle ?? "minimal";
  const styleDesc = VIDEO_STYLE_SPECS[styleKey] ?? VIDEO_STYLE_SPECS["minimal"];
  const mood = moodDirective(req.mood, lang);
  const persona = personaDirective(req.persona, lang);
  const mode = outputModeDirective(req.outputMode, lang);

  if (lang === "ar") {
    return `أنت ${persona}. تكتب برومبتات احترافية لأدوات توليد الفيديو بالذكاء الاصطناعي.

منصة النشر: ${platform}.
مدة الفيديو: ${req.length} ثانية.
النمط البصري: ${styleDesc}.
المزاج: ${mood}.
${mode}

أنتج كائن JSON يحتوي على:
1. "hook": عنوان تسويقي قوي يوقف التمرير (بحد أقصى 12 كلمة)
2. "prompt": برومبت كامل ومفصّل لتوليد فيديو احترافي
3. "negativePrompt": برومبت سلبي يصف كل ما يجب تجنبه
4. "recommendedModel": أفضل نموذج AI للفيديو لهذا البرومبت
5. "recommendedModelReason": سبب التوصية بهذا النموذج

أجب فقط بكائن JSON: {hook, prompt, negativePrompt, recommendedModel, recommendedModelReason}. لا تستخدم markdown.`;
  }

  return `You are ${persona}. You write professional prompts for AI video generation tools.

Target platform: ${platform}.
Video length: ${req.length} seconds.
Visual style: ${styleDesc}.
Mood: ${mood}.
${mode}

Produce a JSON object with:
1. "hook": a scroll-stopping marketing hook (max 12 words)
2. "prompt": a complete, detailed prompt for generating a professional video
3. "negativePrompt": a negative prompt describing everything to avoid
4. "recommendedModel": the best AI video model for this prompt
5. "recommendedModelReason": why this model is recommended

Respond with ONLY a JSON object: {hook, prompt, negativePrompt, recommendedModel, recommendedModelReason}. Do NOT wrap in markdown.`;
}

function buildGenericSystem(type: string, personaStr: string, moodStr: string, modeStr: string, schema: string): string {
  return `You are ${personaStr}. Generating response for task type "${type}".
Mood: ${moodStr}.
${modeStr}

Generate ONLY a JSON object matching this schema:
${schema}

Do not wrap in markdown syntax. Output valid JSON.`;
}

// ─── Response helpers ──────────────────────────────────────────────────────────

function errorResponse(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function okResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ─── Generic AI Provider Callers ───────────────────────────────────────────────

async function callAiProvider(system: string, user: string, creativity: unknown) {
  // يمكنك هنا إضافة كود الاتصال بأي مزود AI آخر (مثل OpenAI / Gemini / Claude)
  // مثال على استرجاع النص:
  console.log("System Prompt:", system);
  console.log("User Input:", user);

  return null; // يستبدل بنص الـ JSON القادم من المزود الجديد
}

async function callAiProviderStream(system: string, user: string, history: Array<{ role: string; content: string }> = [], creativity: unknown): Promise<Response> {
  // يمكنك استبداله بكود Stream الخاص بالمزود الجديد
  return new Response(JSON.stringify({ error: "Stream function not configured." }), {
    status: 501,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ─── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as GenerateRequest;

    // ── Hooks ──────────────────────────────────────────────────────────────
    if (body.type === "hooks" || !body.type) {
      const req2 = body as GenerateHooksRequest;
      const idea = req2.idea?.trim();
      if (!idea || idea.length < 2) return errorResponse("Please provide a product or idea (at least 2 characters).");
      if (idea.length > 500) return errorResponse("Please keep your input under 500 characters.");

      const lang = req2.language ?? detectLang(idea);
      const system = buildHooksSystem(req2, lang);
      const content = await callAiProvider(system, idea, req2.creativity);
      if (!content) return errorResponse("The AI service is unavailable. Please try again.", 502);

      let hooks: string[] = [];
      try {
        const parsed = JSON.parse(content);
        hooks = Array.isArray(parsed?.hooks)
          ? parsed.hooks
              .map((h: unknown) => (typeof h === "string" ? h.trim() : ""))
              .filter((h: string) => h.length > 0)
          : [];
      } catch {
        hooks = [];
      }

      if (hooks.length === 0) return errorResponse("Could not generate hooks. Please try rephrasing your input.", 502);
      return okResponse({ hooks });
    }

    // ── Content Ideas ──────────────────────────────────────────────────────
    if (body.type === "content-ideas") {
      const req2 = body as GenerateContentIdeasRequest;
      const niche = req2.niche?.trim();
      const product = req2.product?.trim();
      if (!niche || niche.length < 2) return errorResponse("Please provide a niche or business type.");
      if (!product || product.length < 2) return errorResponse("Please describe your product or service.");

      const lang = req2.language ?? detectLang(`${niche} ${product}`);
      const userPrompt = [
        `Niche/Business: ${niche}`,
        `Product/Service: ${product}`,
        req2.audience ? `Target Audience: ${req2.audience.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const system = buildContentIdeasSystem(req2, lang);
      const content = await callAiProvider(system, userPrompt, req2.creativity);
      if (!content) return errorResponse("The AI service is unavailable. Please try again.", 502);

      let ideas: unknown[] = [];
      try {
        const parsed = JSON.parse(content);
        ideas = Array.isArray(parsed?.ideas) ? parsed.ideas.filter((i: unknown) => i && typeof i === "object") : [];
      } catch {
        ideas = [];
      }

      if (ideas.length === 0) return errorResponse("Could not generate ideas. Please try rephrasing your input.", 502);
      return okResponse({ ideas });
    }

    // ── Ad Copy ─────────────────────────────────────────────────────────────
    if (body.type === "ad-copy") {
      const req2 = body as AdCopyRequest;
      const product = req2.product?.trim();
      const audience = req2.audience?.trim();
      if (!product || product.length < 2) return errorResponse("Please describe your product or service.");
      if (!audience || audience.length < 2) return errorResponse("Please describe your target audience.");

      const lang = req2.language ?? detectLang(`${product} ${audience}`);
      const system = buildAdCopySystem(req2, lang);

      const userPrompt = [
        `Product/Service: ${product}`,
        `Target Audience: ${audience}`,
        `Platform: ${AD_PLATFORM_SPECS[req2.platform]?.name ?? req2.platform}`,
        `Goal: ${req2.goal}`,
      ].join("\n");

      const content = await callAiProvider(system, userPrompt, req2.creativity);
      if (!content) return errorResponse("The AI service is unavailable. Please try again.", 502);

      try {
        const parsed = JSON.parse(content);
        return okResponse(parsed);
      } catch {
        return errorResponse("Failed to parse AI response into structured JSON.", 502);
      }
    }

    // ── Video Prompt ────────────────────────────────────────────────────────
    if (body.type === "video-prompt") {
      const req2 = body as VideoPromptRequest;
      const product = req2.product?.trim();
      if (!product) return errorResponse("Please provide product/service description.");

      const lang = req2.language ?? detectLang(product);
      const system = buildVideoPromptSystem(req2, lang);
      const userPrompt = `Product: ${product}\nAudience: ${req2.audience}\nGoal: ${req2.goal}`;

      const content = await callAiProvider(system, userPrompt, req2.creativity);
      if (!content) return errorResponse("The AI service is unavailable. Please try again.", 502);

      try {
        return okResponse(JSON.parse(content));
      } catch {
        return errorResponse("Failed to parse video prompt response.", 502);
      }
    }

    // ── AI Assistant (Streaming support) ──────────────────────────────────
    if (body.type === "ai-assistant") {
      const req2 = body as AIAssistantRequest;
      const userMsg = req2.message?.trim();
      if (!userMsg) return errorResponse("Message cannot be empty.");

      const lang = req2.language ?? detectLang(userMsg);
      const persona = personaDirective(req2.persona, lang);
      const system = `You are ${persona}, an expert AI marketing assistant. Output conversational markdown. Language: ${lang}.`;

      if (req2.stream) {
        return await callAiProviderStream(system, userMsg, req2.conversationHistory ?? [], req2.creativity);
      }

      const content = await callAiProvider(system, userMsg, req2.creativity);
      return okResponse({ reply: content });
    }

    // ── Fallback for other JSON Generation endpoints ──────────────────────
    const lang = body.language ?? "en";
    const persona = personaDirective(body.persona, lang);
    const mood = moodDirective(body.mood, lang);
    const mode = outputModeDirective(body.outputMode, lang);

    const schemaStr = `{ "result": "detailed response object for type '${body.type}'" }`;
    const system = buildGenericSystem(body.type, persona, mood, mode, schemaStr);
    const userPrompt = JSON.stringify(body);

    const content = await callAiProvider(system, userPrompt, body.creativity);
    if (!content) return errorResponse("Service error.", 502);

    try {
      return okResponse(JSON.parse(content));
    } catch {
      return okResponse({ result: content });
    }
  } catch (err) {
    console.error("Handler error:", err);
    return errorResponse("Internal server error", 500);
  }
});