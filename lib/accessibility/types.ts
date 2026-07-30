// ─── Accessibility Types ─────────────────────────────────────────────────────────

import type { Language } from '@/lib/translations';
import type { ToolId } from '@/lib/tools';

export interface ToolExplanation {
  toolId: ToolId;
  title: { en: string; ar: string };
  whatIsThis: { en: string; ar: string };
  whenToUse: { en: string; ar: string };
  whatToWrite: { en: string; ar: string };
  whatYouGet: { en: string; ar: string };
  beginnerTip: { en: string; ar: string };
}

export const TOOL_EXPLANATIONS: ToolExplanation[] = [
  {
    toolId: 'hooks',
    title: { en: 'Hooks Generator', ar: 'مولد العناوين الجذابة' },
    whatIsThis: {
      en: 'This tool creates short, attention-grabbing sentences for your ads and social media posts.',
      ar: 'تقوم هذه الأداة بإنشاء جمل قصيرة وجذابة لإعلاناتك ومنشوراتك على وسائل التواصل.',
    },
    whenToUse: {
      en: 'Use this when you want people to stop scrolling and look at your content.',
      ar: 'استخدم هذه الأداة عندما تريد أن يتوقف الناس عن التمرير ويرون محتواك.',
    },
    whatToWrite: {
      en: 'Write the name of your product or service, and what makes it special.',
      ar: 'اكتب اسم منتجك أو خدمتك، وما يجعلها مميزة.',
    },
    whatYouGet: {
      en: 'You will get multiple catchy sentences that you can use in your ads.',
      ar: 'ستحصل على عدة جمل جذابة يمكنك استخدامها في إعلاناتك.',
    },
    beginnerTip: {
      en: 'A good hook makes people curious. Think about what problem you solve for them.',
      ar: 'العنوان الجيد يثير الفضول. فكر في المشكلة التي تحلها لهم.',
    },
  },
  {
    toolId: 'content-ideas',
    title: { en: 'Content Ideas', ar: 'أفكار المحتوى' },
    whatIsThis: {
      en: 'This tool gives you ideas for posts, videos, and articles you can create.',
      ar: 'تمنحك هذه الأداة أفكار للمنشورات ومقاطع الفيديو والمقالات التي يمكنك إنشاؤها.',
    },
    whenToUse: {
      en: 'Use this when you do not know what to post on your social media.',
      ar: 'استخدم هذه الأداة عندما لا تعرف ماذا تنشر على وسائل التواصل الخاصة بك.',
    },
    whatToWrite: {
      en: 'Write about your business and who your customers are.',
      ar: 'اكتب عن نشاطك التجاري ومن هم عملاؤك.',
    },
    whatYouGet: {
      en: 'You will get a list of content ideas you can create today.',
      ar: 'ستحصل على قائمة بأفكار المحتوى التي يمكنك إنشاؤها اليوم.',
    },
    beginnerTip: {
      en: 'Good content teaches or entertains. Pick ideas that match your style.',
      ar: 'المحتوى الجيد يعلم أو يمتع. اختر الأفكار التي تناسب أسلوبك.',
    },
  },
  {
    toolId: 'ad-copy',
    title: { en: 'Ad Copy Generator', ar: 'مولد نصوص الإعلانات' },
    whatIsThis: {
      en: 'This tool writes the text for your advertisements on Facebook, Instagram, TikTok, and more.',
      ar: 'تقوم هذه الأداة بكتابة نصوص إعلاناتك على فيسبوك وإنستغرام وتيكتوك والمزيد.',
    },
    whenToUse: {
      en: 'Use this when you want to run ads and need professional text.',
      ar: 'استخدم هذه الأداة عندما تريد تشغيل إعلانات وتحتاج إلى نصوص احترافية.',
    },
    whatToWrite: {
      en: 'Write about your product, who you want to reach, and which platform you will use.',
      ar: 'اكتب عن منتجك، ومن تريد الوصول إليه، ومنصة التي ستستخدمها.',
    },
    whatYouGet: {
      en: 'You will get a complete ad with a headline, main text, and button text.',
      ar: 'ستحصل على إعلان كامل مع عنوان ونص رئيسي ونص الزر.',
    },
    beginnerTip: {
      en: 'Start with one platform. You can always create more ads later.',
      ar: 'ابدأ بمنصة واحدة. يمكنك دائمًا إنشاء المزيد من الإعلانات لاحقًا.',
    },
  },
  {
    toolId: 'video-prompt',
    title: { en: 'Video Prompt Generator', ar: 'مولد وصف الفيديو' },
    whatIsThis: {
      en: 'This tool creates detailed descriptions for AI video makers like Runway, Pika, and others.',
      ar: 'تقوم هذه الأداة بإنشاء وصف تفصيلي لمصنعي فيديو الذكاء الاصطناعي مثل Runway و Pika وغيرهم.',
    },
    whenToUse: {
      en: 'Use this when you want AI to create a video for you.',
      ar: 'استخدم هذه الأداة عندما تريد من الذكاء الاصطناعي إنشاء فيديو لك.',
    },
    whatToWrite: {
      en: 'Describe your product, who the video is for, and the feeling you want.',
      ar: 'صف منتجك، ومن هو الفيديو له، والشعور الذي تريده.',
    },
    whatYouGet: {
      en: 'You will get a detailed description you can copy into any AI video tool.',
      ar: 'ستحصل على وصف تفصيلي يمكنك نسخه إلى أي أداة فيديو بالذكاء الاصطناعي.',
    },
    beginnerTip: {
      en: 'Be specific about colors, mood, and style. AI works better with details.',
      ar: 'كن محددًا بشأن الألوان والمزاج والأسلوب. الذكاء الاصطناعي يعمل بشكل أفضل مع التفاصيل.',
    },
  },
  {
    toolId: 'persona',
    title: { en: 'Persona Generator', ar: 'مولد الشخصيات' },
    whatIsThis: {
      en: 'This tool creates a profile of your ideal customer - who they are and what they like.',
      ar: 'تقوم هذه الأداة بإنشاء ملف لعميلك المثالي - من هو وماذا يحب.',
    },
    whenToUse: {
      en: 'Use this when you want to understand your customers better.',
      ar: 'استخدم هذه الأداة عندما تريد فهم عملائك بشكل أفضل.',
    },
    whatToWrite: {
      en: 'Write about your product and the type of people who buy it.',
      ar: 'اكتب عن منتجك ونوع الأشخاص الذين يشترونه.',
    },
    whatYouGet: {
      en: 'You will get a detailed profile with age, interests, problems, and how to reach them.',
      ar: 'ستحصل على ملف تفصيلي مع العمر والاهتمامات والمشاكل وكيفية الوصول إليهم.',
    },
    beginnerTip: {
      en: 'Understanding your customer helps you sell more. Think about real people you know.',
      ar: 'فهم عميلك يساعدك على البيع أكثر. فكر في أشخاص حقيقيين تعرفهم.',
    },
  },
  {
    toolId: 'marketing-plan',
    title: { en: 'Marketing Plan Generator', ar: 'مولد خطة التسويق' },
    whatIsThis: {
      en: 'This tool creates a complete marketing plan for your business.',
      ar: 'تقوم هذه الأداة بإنشاء خطة تسويقية كاملة لنشاطك التجاري.',
    },
    whenToUse: {
      en: 'Use this when starting a new business or planning your marketing.',
      ar: 'استخدم هذه الأداة عند بدء نشاط تجاري جديد أو تخطيط تسويقك.',
    },
    whatToWrite: {
      en: 'Write about your business, product, budget, and what you want to achieve.',
      ar: 'اكتب عن نشاطك التجاري ومنتجك وميزانيتك وما تريد تحقيقه.',
    },
    whatYouGet: {
      en: 'You will get a step-by-step plan with clear actions and timeline.',
      ar: 'ستحصل على خطة خطوة بخطوة مع إجراءات واضحة وجدول زمني.',
    },
    beginnerTip: {
      en: 'A good plan matches your budget. Start small and grow over time.',
      ar: 'الخطة الجيدة تناسب ميزانيتك. ابدأ صغيرًا واكبر بمرور الوقت.',
    },
  },
  {
    toolId: 'seo',
    title: { en: 'SEO Keyword Generator', ar: 'مولد كلمات البحث' },
    whatIsThis: {
      en: 'This tool finds words people search for on Google so your content can be found.',
      ar: 'تقوم هذه الأداة بالعثور على الكلمات التي يبحث عنها الناس على جوجل.',
    },
    whenToUse: {
      en: 'Use this when writing blogs or website content.',
      ar: 'استخدم هذه الأداة عند كتابة المدونات أو محتوى الموقع.',
    },
    whatToWrite: {
      en: 'Write about your business and what topics you want to cover.',
      ar: 'اكتب عن نشاطك التجاري والمواضيع التي تريد تغطيتها.',
    },
    whatYouGet: {
      en: 'You will get a list of words to include in your content.',
      ar: 'ستحصل على قائمة بالكلمات لتضمينها في محتواك.',
    },
    beginnerTip: {
      en: 'Use words naturally. Do not repeat them too many times.',
      ar: 'استخدم الكلمات بشكل طبيعي. لا تكررها كثيرًا.',
    },
  },
  {
    toolId: 'social-media',
    title: { en: 'Social Media Post Generator', ar: 'مولد منشورات التواصل' },
    whatIsThis: {
      en: 'This tool writes posts for Facebook, Instagram, LinkedIn, Twitter, and TikTok.',
      ar: 'تقوم هذه الأداة بكتابة منشورات لفيسبوك وإنستغرام ولينكد إن وتويتر وتيكتوك.',
    },
    whenToUse: {
      en: 'Use this when you want to post on social media but do not know what to say.',
      ar: 'استخدم هذه الأداة عندما تريد النشر على وسائل التواصل ولا تعرف ماذا تقول.',
    },
    whatToWrite: {
      en: 'Write about your topic and which platform you will use.',
      ar: 'اكتب عن موضوعك ومنصة التي ستستخدمها.',
    },
    whatYouGet: {
      en: 'You will get ready-to-post content with hashtags.',
      ar: 'ستحصل على محتوى جاهز للنشر مع الهاشتاقات.',
    },
    beginnerTip: {
      en: 'Each platform is different. Use the right style for each one.',
      ar: 'كل منصة مختلفة. استخدم الأسلوب الصحيح لكل واحدة.',
    },
  },
  {
    toolId: 'email',
    title: { en: 'Email Marketing Generator', ar: 'مولد رسائل البريد' },
    whatIsThis: {
      en: 'This tool writes professional emails to send to your customers.',
      ar: 'تقوم هذه الأداة بكتابة رسائل بريد إلكتروني احترافية لإرسالها لعملائك.',
    },
    whenToUse: {
      en: 'Use this when sending newsletters, promotions, or welcome emails.',
      ar: 'استخدم هذه الأداة عند إرسال النشرات الإخبارية أو العروض أو رسائل الترحيب.',
    },
    whatToWrite: {
      en: 'Write about the purpose of your email and who will receive it.',
      ar: 'اكتب عن الغرض من بريدك الإلكتروني ومن سيتلقاه.',
    },
    whatYouGet: {
      en: 'You will get a complete email with subject line and body text.',
      ar: 'ستحصل على بريد إلكتروني كامل مع عنوان الموضوع ونص الرسالة.',
    },
    beginnerTip: {
      en: 'Keep emails short. People read fast on mobile phones.',
      ar: 'اجعل الرسائل قصيرة. الناس يقرؤون بسرعة على الهواتف المحمولة.',
    },
  },
  {
    toolId: 'landing-page',
    title: { en: 'Landing Page Generator', ar: 'مولد صفحات الهبوط' },
    whatIsThis: {
      en: 'This tool creates the text and structure for a web page about your product.',
      ar: 'تقوم هذه الأداة بإنشاء النص والهيكل لصفحة ويب حول منتجك.',
    },
    whenToUse: {
      en: 'Use this when creating a page to sell something or collect leads.',
      ar: 'استخدم هذه الأداة عند إنشاء صفحة لبيع شيء ما أو جمع العملاء المحتملين.',
    },
    whatToWrite: {
      en: 'Write about your product and what action you want visitors to take.',
      ar: 'اكتب عن منتجك والإجراء الذي تريد من الزوار اتخاذه.',
    },
    whatYouGet: {
      en: 'You will get headings, descriptions, and sections for your page.',
      ar: 'ستحصل على العناوين والأوصاف والأقسام لصفحتك.',
    },
    beginnerTip: {
      en: 'A good page has one clear goal. Do not confuse visitors with too many options.',
      ar: 'الصفحة الجيدة لها هدف واحد واضح. لا تشوش الزوار بخيارات كثيرة.',
    },
  },
  {
    toolId: 'product-description',
    title: { en: 'Product Description Generator', ar: 'مولد وصف المنتج' },
    whatIsThis: {
      en: 'This tool writes descriptions for products you want to sell online.',
      ar: 'تقوم هذه الأداة بكتابة أوصاف للمنتجات التي تريد بيعها عبر الإنترنت.',
    },
    whenToUse: {
      en: 'Use this when listing products on your website or marketplace.',
      ar: 'استخدم هذه الأداة عند إدراج المنتجات على موقعك أو السوق.',
    },
    whatToWrite: {
      en: 'Write the product name, what it does, and why it is special.',
      ar: 'اكتب اسم المنتج، وما يفعله، وما الذي يجعله مميزًا.',
    },
    whatYouGet: {
      en: 'You will get a compelling description that helps sell your product.',
      ar: 'ستحصل على وصف مقنع يساعد في بيع منتجك.',
    },
    beginnerTip: {
      en: 'Focus on benefits, not just features. Tell them why they need it.',
      ar: 'ركز على الفوائد، وليس فقط الميزات. أخبرهم لماذا يحتاجونه.',
    },
  },
  {
    toolId: 'brand-voice',
    title: { en: 'Brand Voice Generator', ar: 'مولد صوت العلامة' },
    whatIsThis: {
      en: 'This tool helps you define how your brand should sound when it talks.',
      ar: 'تساعدك هذه الأداة على تحديد كيف يجب أن يبدو صوت علامتك التجارية.',
    },
    whenToUse: {
      en: 'Use this when starting a brand or when you want consistent messaging.',
      ar: 'استخدم هذه الأداة عند بدء علامة تجارية أو عندما تريد رسائل متسقة.',
    },
    whatToWrite: {
      en: 'Write about your brand, your values, and who your customers are.',
      ar: 'اكتب عن علامتك التجارية وقيمك ومن هم عملاؤك.',
    },
    whatYouGet: {
      en: 'You will get guidelines on tone, style, and words to use.',
      ar: 'ستحصل على إرشادات حول النبرة والأسلوب والكلمات للاستخدام.',
    },
    beginnerTip: {
      en: 'Your brand voice should match your audience. Be consistent everywhere.',
      ar: 'يجب أن يطابق صوت علامتك جمهورك. كن متسقًا في كل مكان.',
    },
  },
  {
    toolId: 'ai-assistant',
    title: { en: 'Marketra AI Assistant', ar: 'مساعد التسويق الذكي' },
    whatIsThis: {
      en: 'This is a chat assistant that answers your marketing questions.',
      ar: 'هذا مساعد محادثة يجيب على أسئلتك التسويقية.',
    },
    whenToUse: {
      en: 'Use this when you have questions about marketing or need advice.',
      ar: 'استخدم هذه الأداة عندما لديك أسئلة حول التسويق أو تحتاج نصيحة.',
    },
    whatToWrite: {
      en: 'Ask any question about marketing, ads, or your business.',
      ar: 'اسأل أي سؤال حول التسويق أو الإعلانات أو نشاطك التجاري.',
    },
    whatYouGet: {
      en: 'You will get a helpful answer from a marketing expert AI.',
      ar: 'ستحصل على إجابة مفيدة من ذكاء اصطناعي خبير في التسويق.',
    },
    beginnerTip: {
      en: 'Be specific with your questions. The more detail, the better the answer.',
      ar: 'كن محددًا مع أسئلتك. كلما زاد التفصيل، كانت الإجابة أفضل.',
    },
  },
  {
    toolId: 'dashboard',
    title: { en: 'Dashboard', ar: 'لوحة التحكم' },
    whatIsThis: {
      en: 'This is the main page where you can see all tools and your recent activity.',
      ar: 'هذه هي الصفحة الرئيسية حيث يمكنك رؤية جميع الأدوات ونشاطك الأخير.',
    },
    whenToUse: {
      en: 'Start here when you open the app to see your options.',
      ar: 'ابدأ من هنا عندما تفتح التطبيق لرؤية خياراتك.',
    },
    whatToWrite: {
      en: 'No input needed. Just click on any tool you want to use.',
      ar: 'لا حاجة لإدخال. فقط انقر على أي أداة تريد استخدامها.',
    },
    whatYouGet: {
      en: 'Quick access to all tools and your recent generations.',
      ar: 'وصول سريع إلى جميع الأدوات وإنشاءاتك الأخيرة.',
    },
    beginnerTip: {
      en: 'Bookmark this page. It is your home base for everything.',
      ar: 'احفظ هذه الصفحة. هي قاعدتك لكل شيء.',
    },
  },
];

export function getToolExplanation(toolId: ToolId): ToolExplanation | undefined {
  return TOOL_EXPLANATIONS.find((e) => e.toolId === toolId);
}

export function getExplanationText(explanation: ToolExplanation, lang: Language): string {
  const l = lang === 'ar' ? 'ar' : 'en';
  return `${explanation.title[l]}

${lang === 'ar' ? 'ما هذه الأداة؟' : 'What is this tool?'}
${explanation.whatIsThis[l]}

${lang === 'ar' ? 'متى أستخدمها؟' : 'When should I use it?'}
${explanation.whenToUse[l]}

${lang === 'ar' ? 'ماذا أكتب؟' : 'What should I write?'}
${explanation.whatToWrite[l]}

${lang === 'ar' ? 'ماذا سأحصل عليه؟' : 'What result will I get?'}
${explanation.whatYouGet[l]}

${lang === 'ar' ? 'نصيحة للمبتدئين:' : 'Beginner tip:'}
${explanation.beginnerTip[l]}`;
}
