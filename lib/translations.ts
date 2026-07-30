// ─── Centralized Translation System ─────────────────────────────────────────────
// Provides translations for English and Arabic.
// Extendable for future languages.

export type Language = 'en' | 'ar';

export interface TranslationDict {
  // Common
  common: {
    generate: string;
    generating: string;
    copy: string;
    copyAll: string;
    copied: string;
    regenerate: string;
    delete: string;
    deleteAll: string;
    clearAll: string;
    search: string;
    searchPlaceholder: string;
    loading: string;
    save: string;
    cancel: string;
    close: string;
    settings: string;
    history: string;
    dashboard: string;
    poweredBy: string;
    yes: string;
    no: string;
    or: string;
    required: string;
    optional: string;
    language: string;
    uiLanguage: string;
    auto: string;
    autoDetect: string;
    arabic: string;
    english: string;
    darkMode: string;
    lightMode: string;
    system: string;
    exportPdf: string;
    exportTxt: string;
    exportPdfComingSoon: string;
    download: string;
    all: string;
    none: string;
    select: string;
    selectAll: string;
    deselectAll: string;
    noResults: string;
    tryAgain: string;
    open: string;
    fillDetailsAndGenerate: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    followBrowser: string;
    manuallySelected: string;
    applicationLanguage: string;
    appLanguageDesc: string;
    aiResponseLanguage: string;
    aiLanguageDesc: string;
    aiPowered: string;
    version: string;
    seeAll: string;
    viewAll: string;
  };
  // Navigation / Sidebar
  nav: {
    overview: string;
    content: string;
    advertising: string;
    strategy: string;
    seo: string;
    system: string;
  };
  // Tools
  tools: {
    dashboard: string;
    hooksGenerator: string;
    hooksShort: string;
    hooksDesc: string;
    contentIdeas: string;
    contentIdeasShort: string;
    contentIdeasDesc: string;
    imageGenerator: string;
    imageShort: string;
    imageDesc: string;
    adCopyGenerator: string;
    adCopyShort: string;
    adCopyDesc: string;
    videoPromptGenerator: string;
    videoPromptShort: string;
    videoPromptDesc: string;
    personaGenerator: string;
    personaShort: string;
    personaDesc: string;
    marketingPlanGenerator: string;
    marketingPlanShort: string;
    marketingPlanDesc: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    welcomeBack: string;
    subtitle: string;
    startGenerating: string;
    quickAccess: string;
    totalGenerations: string;
    favoriteTool: string;
    historyCount: string;
    aiStatus: string;
    currentModel: string;
    apiStatus: string;
    aiControlSnapshot: string;
    tune: string;
    recentActivity: string;
    viewAll: string;
    noGenerationsYet: string;
    noGenerationsDesc: string;
    openHooksGenerator: string;
    results: string;
    savedItems: string;
    savedAcrossSessions: string;
    mostUsedGenerator: string;
    allTimeSavedResults: string;
    edgeFunction: string;
    groqInference: string;
    localStorage: string;
    operational: string;
    reachable: string;
    connected: string;
    online: string;
    lastChecked: string;
    allSystemsOperational: string;
    aiPowered: string;
    aiWorkspace: string;
  };
  // Hooks Generator
  hooks: {
    title: string;
    subtitle: string;
    productOrIdea: string;
    productOrIdeaPlaceholder: string;
    productOrIdeaDesc: string;
    generateHooks: string;
    hooksReady: string;
    hooksWillAppear: string;
    fillDetailsAndGenerate: string;
    yourHooksWillAppearHere: string;
    noHooksYet: string;
    copyToClipboard: string;
    copyAllHooks: string;
  };
  // Content Ideas
  contentIdeas: {
    title: string;
    subtitle: string;
    nicheOrBusiness: string;
    nichePlaceholder: string;
    productOrService: string;
    productPlaceholder: string;
    targetAudience: string;
    audiencePlaceholder: string;
    generateIdeas: string;
    ideasWillAppear: string;
    yourIdeasWillAppear: string;
    educational: string;
    problemSolving: string;
    storytelling: string;
    engagement: string;
    viral: string;
    authority: string;
    promotional: string;
    post: string;
    reel: string;
    video: string;
    carousel: string;
    blog: string;
  };
  // Ad Copy
  adCopy: {
    title: string;
    subtitle: string;
    campaignDetails: string;
    productOrService: string;
    productPlaceholder: string;
    targetAudience: string;
    audiencePlaceholder: string;
    platform: string;
    campaignGoal: string;
    generateAdCopy: string;
    yourAdCopyWillAppear: string;
    hook: string;
    primaryText: string;
    headline: string;
    callToAction: string;
    description: string;
    charsMax: string;
    awareness: string;
    consideration: string;
    conversion: string;
    engagementGoal: string;
    traffic: string;
  };
  // Video Prompt
  videoPrompt: {
    title: string;
    subtitle: string;
    videoDetails: string;
    productOrService: string;
    productPlaceholder: string;
    targetAudience: string;
    audiencePlaceholder: string;
    marketingGoal: string;
    goalPlaceholder: string;
    platform: string;
    videoLength: string;
    visualStyle: string;
    generatePrompt: string;
    yourPromptWillAppear: string;
    marketingHook: string;
    videoPrompt: string;
    negativePrompt: string;
    recommendedModel: string;
    whyRecommended: string;
    compatibleWith: string;
    seconds: string;
  };
  // Persona Generator
  persona: {
    title: string;
    subtitle: string;
    generateDetailedPersona: string;
    productOrService: string;
    productPlaceholder: string;
    industry: string;
    industryPlaceholder: string;
    targetMarket: string;
    targetMarketPlaceholder: string;
    country: string;
    countryPlaceholder: string;
    generatePersona: string;
    yourPersonaWillAppear: string;
    personaName: string;
    age: string;
    gender: string;
    occupation: string;
    incomeLevel: string;
    goals: string;
    painPoints: string;
    motivations: string;
    buyingBehavior: string;
    preferredPlatforms: string;
    preferredContent: string;
    objections: string;
    bestMessage: string;
    recommendedCta: string;
  };
  // Marketing Plan
  marketingPlan: {
    title: string;
    subtitle: string;
    generateCompleteStrategy: string;
    business: string;
    businessPlaceholder: string;
    product: string;
    productPlaceholder: string;
    targetAudience: string;
    audiencePlaceholder: string;
    monthlyBudget: string;
    budgetPlaceholder: string;
    goal: string;
    goalPlaceholder: string;
    generatePlan: string;
    yourPlanWillAppear: string;
    executiveSummary: string;
    swotAnalysis: string;
    idealCustomer: string;
    marketingChannels: string;
    contentStrategy: string;
    advertisingStrategy: string;
    seoStrategy: string;
    emailMarketing: string;
    socialMediaPlan: string;
    kpis: string;
    actionPlan30Days: string;
    growthPlan90Days: string;
    budgetDistribution: string;
    recommendedTools: string;
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
  };
  // History
  historyView: {
    title: string;
    searchPlaceholder: string;
    noHistoryYet: string;
    noHistoryDesc: string;
    noMatches: string;
    noMatchesDesc: string;
    hooks: string;
    ideas: string;
    adCopy: string;
    videoPrompt: string;
    image: string;
    persona: string;
    marketingPlan: string;
    clearHistory: string;
    cleared: string;
    removed: string;
  };
  // Settings
  settingsView: {
    title: string;
    quickSettings: string;
    openFullSettings: string;
    moodDial: string;
    moodDesc: string;
    personaMixer: string;
    personaDesc: string;
    creativitySlider: string;
    creativityDesc: string;
    focused: string;
    balanced: string;
    wild: string;
    draftVsFinal: string;
    draftFinalDesc: string;
    draft: string;
    draftHint: string;
    final: string;
    finalHint: string;
    languageSettings: string;
    autoLanguage: string;
    autoLanguageDesc: string;
    responseLanguage: string;
    responseLanguageDesc: string;
    autoDetect: string;
    userPreferences: string;
    numberOfResults: string;
    resultsDesc: string;
    defaultOutputStyle: string;
    styleDesc: string;
    professional: string;
    casual: string;
    creative: string;
    persuasive: string;
    themeSettings: string;
    colorTheme: string;
    colorThemeDesc: string;
    historySettings: string;
    saveResults: string;
    saveResultsDesc: string;
    storedLocally: string;
    exportOptions: string;
    copyAllResults: string;
    copyAllDesc: string;
    downloadTxt: string;
    downloadTxtDesc: string;
    downloadPdf: string;
    downloadPdfDesc: string;
    account: string;
    toolVersion: string;
    storage: string;
    local: string;
    resetDefaults: string;
    resetToDefaults: string;
    moodNeutral: string;
    moodNeutralHint: string;
    moodEnergetic: string;
    moodEnergeticHint: string;
    moodCalm: string;
    moodCalmHint: string;
    moodBold: string;
    moodBoldHint: string;
    moodPlayful: string;
    moodPlayfulHint: string;
    moodLuxury: string;
    moodLuxuryHint: string;
    personaMarketer: string;
    personaMarketerHint: string;
    personaFounder: string;
    personaFounderHint: string;
    personaCopywriter: string;
    personaCopywriterHint: string;
    personaStrategist: string;
    personaStrategistHint: string;
    personaStoryteller: string;
    personaStorytellerHint: string;
    personaAnalyst: string;
    personaAnalystHint: string;
  };
  // Platforms
  platforms: {
    facebook: string;
    instagram: string;
    tiktok: string;
    linkedin: string;
    google: string;
    tiktokShorts: string;
    instagramReels: string;
    youtubeShorts: string;
  };
  // Styles
  styles: {
    cinematic: string;
    ugc: string;
    luxury: string;
    corporate: string;
    viral: string;
    documentary: string;
    minimal: string;
  };
  // Time
  time: {
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    months: string;
    justNow: string;
    ago: string;
  };
  // Errors
  errors: {
    somethingWentWrong: string;
    pleaseTryAgain: string;
    pleaseFillAllFields: string;
    networkError: string;
    apiError: string;
    noHistory: string;
    failedToCopy: string;
    failedToGenerate: string;
    keepUnderChars: string;
    provideAtLeast: string;
  };
  // Success messages
  success: {
    copied: string;
    copiedAll: string;
    generated: string;
    saved: string;
    downloaded: string;
    languageChanged: string;
  };
}

// ─── English Translation ──────────────────────────────────────────────────────

export const en: TranslationDict = {
  common: {
    generate: 'Generate',
    generating: 'Generating...',
    copy: 'Copy',
    copyAll: 'Copy All',
    copied: 'Copied!',
    regenerate: 'Regenerate',
    delete: 'Delete',
    deleteAll: 'Delete All',
    clearAll: 'Clear All',
    search: 'Search',
    searchPlaceholder: 'Search...',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    settings: 'Settings',
    history: 'History',
    dashboard: 'Dashboard',
    poweredBy: 'Powered by MW',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    required: 'Required',
    optional: 'Optional',
    language: 'Language',
    uiLanguage: 'Application Language',
    auto: 'Auto',
    autoDetect: 'Auto Detect',
    arabic: 'Arabic',
    english: 'English',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    system: 'System',
    exportPdf: 'Export as PDF',
    exportTxt: 'Export as TXT',
    exportPdfComingSoon: 'Export as PDF (Coming Soon)',
    download: 'Download',
    all: 'All',
    none: 'None',
    select: 'Select',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    noResults: 'No results',
    tryAgain: 'Try Again',
    open: 'Open',
    fillDetailsAndGenerate: 'Fill in the details and click Generate',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    followBrowser: 'Follow Browser',
    manuallySelected: 'Manually Selected',
    applicationLanguage: 'Application Language',
    appLanguageDesc: 'Language for the interface, buttons, menus, and messages.',
    aiResponseLanguage: 'AI Response Language',
    aiLanguageDesc: 'Language the AI uses to generate content (auto detects from your input).',
    aiPowered: 'AI-Powered',
    version: 'Version',
    seeAll: 'See All',
    viewAll: 'View All',
  },
  nav: {
    overview: 'Overview',
    content: 'Content',
    advertising: 'Advertising',
    strategy: 'Strategy',
    seo: 'SEO',
    system: 'System',
  },
  tools: {
    dashboard: 'Dashboard',
    hooksGenerator: 'Hooks Generator',
    hooksShort: 'Hooks',
    hooksDesc: 'High-converting marketing hooks',
    contentIdeas: 'Content Ideas',
    contentIdeasShort: 'Ideas',
    contentIdeasDesc: 'Unique content ideas per niche',
    imageGenerator: 'Image Generator',
    imageShort: 'Image',
    imageDesc: 'AI marketing images powered by Marketra AI',
    adCopyGenerator: 'Ad Copy Generator',
    adCopyShort: 'Ad Copy',
    adCopyDesc: 'High-converting ad copy for any platform',
    videoPromptGenerator: 'Video Prompt Generator',
    videoPromptShort: 'Video Prompt',
    videoPromptDesc: 'Professional prompts for AI video generators',
    personaGenerator: 'Persona Generator',
    personaShort: 'Persona',
    personaDesc: 'Generate detailed customer personas',
    marketingPlanGenerator: 'Marketing Plan Generator',
    marketingPlanShort: 'Marketing Plan',
    marketingPlanDesc: 'Complete marketing strategy generator',
  },
  dashboard: {
    title: 'Dashboard',
    welcomeBack: 'Welcome back',
    subtitle: 'Generate high-converting marketing content in seconds. Pick a tool to begin.',
    startGenerating: 'Start Generating',
    quickAccess: 'Quick Access',
    totalGenerations: 'Total Generations',
    favoriteTool: 'Favorite Tool',
    historyCount: 'History Count',
    aiStatus: 'AI Status',
    currentModel: 'Current Model',
    apiStatus: 'API Status',
    aiControlSnapshot: 'AI Control Snapshot',
    tune: 'Tune',
    recentActivity: 'Recent Activity',
    viewAll: 'View all',
    noGenerationsYet: 'No generations yet',
    noGenerationsDesc: 'Your saved hooks and content ideas will appear here. Try the Hooks Generator to get started.',
    openHooksGenerator: 'Open Hooks Generator',
    results: 'results',
    savedItems: 'saved items',
    savedAcrossSessions: 'Saved across sessions',
    mostUsedGenerator: 'Most used generator',
    allTimeSavedResults: 'All-time saved results',
    edgeFunction: 'Edge Function',
    groqInference: 'Groq Inference',
    localStorage: 'Local Storage',
    operational: 'Operational',
    reachable: 'Reachable',
    connected: 'Connected',
    online: 'Online',
    lastChecked: 'Last checked just now.',
    allSystemsOperational: 'All systems operational.',
    aiPowered: 'AI-Powered',
    aiWorkspace: 'AI Workspace',
  },
  hooks: {
    title: 'Hooks Generator',
    subtitle: 'Generate scroll-stopping marketing hooks for ads and social media.',
    productOrIdea: 'Product or Idea',
    productOrIdeaPlaceholder: 'Describe your product, service, or idea...',
    productOrIdeaDesc: 'Enter your product, service, or marketing angle.',
    generateHooks: 'Generate Hooks',
    hooksReady: 'Your hooks are ready!',
    hooksWillAppear: 'Your hooks will appear here',
    fillDetailsAndGenerate: 'Fill in the details and click Generate',
    yourHooksWillAppearHere: 'Your marketing hooks will appear here',
    noHooksYet: 'No hooks yet',
    copyToClipboard: 'Copy to clipboard',
    copyAllHooks: 'Copy all hooks',
  },
  contentIdeas: {
    title: 'Content Ideas',
    subtitle: 'Generate unique, actionable content ideas for your niche.',
    nicheOrBusiness: 'Niche or Business',
    nichePlaceholder: 'e.g., Fitness, E-commerce, SaaS...',
    productOrService: 'Product or Service',
    productPlaceholder: 'Describe your product or service...',
    targetAudience: 'Target Audience',
    audiencePlaceholder: 'e.g., Young professionals aged 25-35',
    generateIdeas: 'Generate Ideas',
    ideasWillAppear: 'Your content ideas will appear here',
    yourIdeasWillAppear: 'Fill in the details and click Generate',
    educational: 'Educational',
    problemSolving: 'Problem-Solving',
    storytelling: 'Storytelling',
    engagement: 'Engagement',
    viral: 'Viral',
    authority: 'Authority',
    promotional: 'Promotional',
    post: 'Post',
    reel: 'Reel',
    video: 'Video',
    carousel: 'Carousel',
    blog: 'Blog',
  },
  adCopy: {
    title: 'Ad Copy Generator',
    subtitle: 'Generate high-converting ad copy for any platform in seconds.',
    campaignDetails: 'Campaign Details',
    productOrService: 'Product or Service',
    productPlaceholder: 'Describe your product or service...',
    targetAudience: 'Target Audience',
    audiencePlaceholder: 'e.g., Young professionals aged 25-35 interested in fitness',
    platform: 'Platform',
    campaignGoal: 'Campaign Goal',
    generateAdCopy: 'Generate Ad Copy',
    yourAdCopyWillAppear: 'Your ad copy will appear here',
    hook: 'Hook',
    primaryText: 'Primary Text',
    headline: 'Headline',
    callToAction: 'Call to Action',
    description: 'Description',
    charsMax: 'chars max for primary text',
    awareness: 'Brand Awareness',
    consideration: 'Consideration',
    conversion: 'Conversion',
    engagementGoal: 'Engagement',
    traffic: 'Traffic',
  },
  videoPrompt: {
    title: 'Video Prompt Generator',
    subtitle: 'Generate professional prompts for AI video generators like Veo, Runway, Pika, Kling & Luma.',
    videoDetails: 'Video Details',
    productOrService: 'Product or Service',
    productPlaceholder: 'Describe your product or service...',
    targetAudience: 'Target Audience',
    audiencePlaceholder: 'e.g., Young professionals aged 25-35',
    marketingGoal: 'Marketing Goal',
    goalPlaceholder: 'e.g., Drive app downloads, increase brand awareness',
    platform: 'Platform',
    videoLength: 'Video Length',
    visualStyle: 'Visual Style',
    generatePrompt: 'Generate Prompt',
    yourPromptWillAppear: 'Your video prompt will appear here',
    marketingHook: 'Marketing Hook',
    videoPrompt: 'Video Prompt',
    negativePrompt: 'Negative Prompt',
    recommendedModel: 'Recommended AI Model',
    whyRecommended: 'why this model is recommended',
    compatibleWith: 'Compatible with Veo, Runway, Pika, Kling & Luma Dream Machine',
    seconds: 'seconds',
  },
  persona: {
    title: 'Persona Generator',
    subtitle: 'Generate detailed customer personas for your target market.',
    generateDetailedPersona: 'Generate Detailed Persona',
    productOrService: 'Product or Service',
    productPlaceholder: 'Describe your product or service...',
    industry: 'Industry',
    industryPlaceholder: 'e.g., Technology, Fashion, Health...',
    targetMarket: 'Target Market',
    targetMarketPlaceholder: 'e.g., B2B, B2C, Enterprise...',
    country: 'Country',
    countryPlaceholder: 'e.g., United States, Saudi Arabia...',
    generatePersona: 'Generate Persona',
    yourPersonaWillAppear: 'Your persona will appear here',
    personaName: 'Persona Name',
    age: 'Age',
    gender: 'Gender',
    occupation: 'Occupation',
    incomeLevel: 'Income Level',
    goals: 'Goals',
    painPoints: 'Pain Points',
    motivations: 'Motivations',
    buyingBehavior: 'Buying Behavior',
    preferredPlatforms: 'Preferred Social Platforms',
    preferredContent: 'Preferred Content Type',
    objections: 'Objections Before Buying',
    bestMessage: 'Best Marketing Message',
    recommendedCta: 'Recommended CTA',
  },
  marketingPlan: {
    title: 'Marketing Plan Generator',
    subtitle: 'Generate a complete marketing strategy for your business.',
    generateCompleteStrategy: 'Generate Complete Strategy',
    business: 'Business',
    businessPlaceholder: 'Describe your business...',
    product: 'Product',
    productPlaceholder: 'Describe your product or service...',
    targetAudience: 'Target Audience',
    audiencePlaceholder: 'Describe your target audience...',
    monthlyBudget: 'Monthly Budget',
    budgetPlaceholder: 'e.g., $5,000',
    goal: 'Goal',
    goalPlaceholder: 'e.g., Increase sales by 20%',
    generatePlan: 'Generate Marketing Plan',
    yourPlanWillAppear: 'Your marketing plan will appear here',
    executiveSummary: 'Executive Summary',
    swotAnalysis: 'SWOT Analysis',
    idealCustomer: 'Ideal Customer',
    marketingChannels: 'Marketing Channels',
    contentStrategy: 'Content Strategy',
    advertisingStrategy: 'Advertising Strategy',
    seoStrategy: 'SEO Strategy',
    emailMarketing: 'Email Marketing',
    socialMediaPlan: 'Social Media Plan',
    kpis: 'KPIs',
    actionPlan30Days: '30-Day Action Plan',
    growthPlan90Days: '90-Day Growth Plan',
    budgetDistribution: 'Budget Distribution',
    recommendedTools: 'Recommended AI Tools',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    opportunities: 'Opportunities',
    threats: 'Threats',
  },
  historyView: {
    title: 'History',
    searchPlaceholder: 'Search history by label, type, or content...',
    noHistoryYet: 'No history yet',
    noHistoryDesc: 'Generate hooks or content ideas and they will be saved here automatically.',
    noMatches: 'No matches found',
    noMatchesDesc: 'Try a different search term or filter.',
    hooks: 'Hooks',
    ideas: 'Ideas',
    adCopy: 'Ad Copy',
    videoPrompt: 'Video Prompt',
    image: 'Image',
    persona: 'Persona',
    marketingPlan: 'Plan',
    clearHistory: 'Clear All History',
    cleared: 'History cleared',
    removed: 'Removed',
  },
  settingsView: {
    title: 'Settings',
    quickSettings: 'Quick Settings',
    openFullSettings: 'Open the Settings tab for the full control center',
    moodDial: 'Mood Dial',
    moodDesc: 'Sets the emotional tone of the output.',
    personaMixer: 'Persona Mixer',
    personaDesc: 'Who the AI writes as.',
    creativitySlider: 'Creativity Slider',
    creativityDesc: 'Higher = more varied, lower = more focused.',
    focused: 'Focused',
    balanced: 'Balanced',
    wild: 'Wild',
    draftVsFinal: 'Draft vs Final',
    draftFinalDesc: 'Drafts are exploratory; Final is polished and ready to ship.',
    draft: 'Draft',
    draftHint: 'Brainstorm mode',
    final: 'Final',
    finalHint: 'Polished output',
    languageSettings: 'Language Settings',
    autoLanguage: 'Auto Language Detection',
    autoLanguageDesc: 'Detect Arabic vs English from your input automatically.',
    responseLanguage: 'Response Language',
    responseLanguageDesc: 'Controls what language the AI generates content in.',
    autoDetect: 'Auto Detect',
    userPreferences: 'User Preferences',
    numberOfResults: 'Number of Results',
    resultsDesc: 'How many results to generate per request.',
    defaultOutputStyle: 'Default Output Style',
    styleDesc: 'Tone applied to all generated content.',
    professional: 'Professional',
    casual: 'Casual',
    creative: 'Creative',
    persuasive: 'Persuasive',
    themeSettings: 'Theme Settings',
    colorTheme: 'Color Theme',
    colorThemeDesc: 'Applies immediately across the entire app.',
    historySettings: 'History Settings',
    saveResults: 'Save Generated Results',
    saveResultsDesc: 'Stores results locally in your browser.',
    storedLocally: 'stored locally on this device',
    exportOptions: 'Export Options',
    copyAllResults: 'Copy All Results',
    copyAllDesc: 'Copies entire history to clipboard',
    downloadTxt: 'Download as TXT',
    downloadTxtDesc: 'Plain text file of all history',
    downloadPdf: 'Download as PDF',
    downloadPdfDesc: 'Formatted PDF of all history',
    account: 'Account',
    toolVersion: 'Tool Version',
    storage: 'Storage',
    local: 'Local',
    resetDefaults: 'Reset',
    resetToDefaults: 'Reset to defaults',
    moodNeutral: 'Neutral',
    moodNeutralHint: 'Balanced, even tone',
    moodEnergetic: 'Energetic',
    moodEnergeticHint: 'High-energy, punchy',
    moodCalm: 'Calm',
    moodCalmHint: 'Soft, reassuring',
    moodBold: 'Bold',
    moodBoldHint: 'Confident, daring',
    moodPlayful: 'Playful',
    moodPlayfulHint: 'Fun, lighthearted',
    moodLuxury: 'Luxury',
    moodLuxuryHint: 'Premium, refined',
    personaMarketer: 'Marketer',
    personaMarketerHint: 'Conversion-focused',
    personaFounder: 'Founder',
    personaFounderHint: 'Vision-led storytelling',
    personaCopywriter: 'Copywriter',
    personaCopywriterHint: 'Punchy, persuasive',
    personaStrategist: 'Strategist',
    personaStrategistHint: 'Insight-driven',
    personaStoryteller: 'Storyteller',
    personaStorytellerHint: 'Narrative, emotional',
    personaAnalyst: 'Analyst',
    personaAnalystHint: 'Data-led, precise',
  },
  platforms: {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    google: 'Google Ads',
    tiktokShorts: 'TikTok',
    instagramReels: 'Instagram Reels',
    youtubeShorts: 'YouTube Shorts',
  },
  styles: {
    cinematic: 'Cinematic',
    ugc: 'UGC',
    luxury: 'Luxury',
    corporate: 'Corporate',
    viral: 'Viral',
    documentary: 'Documentary',
    minimal: 'Minimal',
  },
  time: {
    seconds: 'seconds',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    months: 'months',
    justNow: 'just now',
    ago: 'ago',
  },
  errors: {
    somethingWentWrong: 'Something went wrong. Please try again.',
    pleaseTryAgain: 'Please try again.',
    pleaseFillAllFields: 'Please fill in all required fields.',
    networkError: 'Network error. Check your connection and try again.',
    apiError: 'The AI service is unavailable. Please try again.',
    noHistory: 'No history to download.',
    failedToCopy: 'Failed to copy.',
    failedToGenerate: 'Could not generate. Please try again.',
    keepUnderChars: 'Please keep your input undercharacters.',
    provideAtLeast: 'Please provide at leastcharacters.',
  },
  success: {
    copied: 'Copied to clipboard',
    copiedAll: 'All results copied',
    generated: 'Generated successfully!',
    saved: 'Saved',
    downloaded: 'Downloaded',
    languageChanged: 'Language changed',
  },
};

// ─── Arabic Translation ────────────────────────────────────────────────────────

export const ar: TranslationDict = {
  common: {
    generate: 'إنشاء',
    generating: 'جارٍ الإنشاء...',
    copy: 'نسخ',
    copyAll: 'نسخ الكل',
    copied: 'تم النسخ!',
    regenerate: 'إعادة الإنشاء',
    delete: 'حذف',
    deleteAll: 'حذف الكل',
    clearAll: 'مسح الكل',
    search: 'بحث',
    searchPlaceholder: 'بحث...',
    loading: 'جارٍ التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    settings: 'الإعدادات',
    history: 'السجل',
    dashboard: 'لوحة التحكم',
    poweredBy: 'مدعوم من MW',
    yes: 'نعم',
    no: 'لا',
    or: 'أو',
    required: 'مطلوب',
    optional: 'اختياري',
    language: 'اللغة',
    uiLanguage: 'لغة التطبيق',
    auto: 'تلقائي',
    autoDetect: 'كشف تلقائي',
    arabic: 'العربية',
    english: 'الإنجليزية',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    system: 'النظام',
    exportPdf: 'تصدير كـ PDF',
    exportTxt: 'تصدير كـ TXT',
    exportPdfComingSoon: 'تصدير كـ PDF (قريباً)',
    download: 'تنزيل',
    all: 'الكل',
    none: 'لا شيء',
    select: 'اختر',
    selectAll: 'اختيار الكل',
    deselectAll: 'إلغاء اختيار الكل',
    noResults: 'لا توجد نتائج',
    tryAgain: 'حاول مرة أخرى',
    open: 'فتح',
    fillDetailsAndGenerate: 'املأ التفاصيل وانقر على إنشاء',
    error: 'خطأ',
    success: 'نجاح',
    warning: 'تحذير',
    info: 'معلومات',
    followBrowser: 'تتبع المتصفح',
    manuallySelected: 'محدد يدوياً',
    applicationLanguage: 'لغة التطبيق',
    appLanguageDesc: 'لغة الواجهة والأزرار والقوائم والرسائل.',
    aiResponseLanguage: 'لغة استجابة الذكاء الاصطناعي',
    aiLanguageDesc: 'اللغة التي يستخدمها الذكاء الاصطناعي لإنشاء المحتوى (يكشف تلقائياً من رسالتك).',
    aiPowered: 'مدعوم بالذكاء الاصطناعي',
    version: 'الإصدار',
    seeAll: 'عرض الكل',
    viewAll: 'عرض الكل',
  },
  nav: {
    overview: 'نظرة عامة',
    content: 'المحتوى',
    advertising: 'الإعلانات',
    strategy: 'الاستراتيجية',
    seo: 'تحسين محركات البحث',
    system: 'النظام',
  },
  tools: {
    dashboard: 'لوحة التحكم',
    hooksGenerator: 'مولد العناوين',
    hooksShort: 'العناوين',
    hooksDesc: 'عناوين تسويقية عالية التحويل',
    contentIdeas: 'أفكار المحتوى',
    contentIdeasShort: 'الأفكار',
    contentIdeasDesc: 'أفكار محتوى فريدة لكل مجال',
    imageGenerator: 'مولد الصور',
    imageShort: 'الصور',
    imageDesc: 'صور تسويقية بالذكاء الاصطناعي مدعومة بـ fal.ai FLUX',
    adCopyGenerator: 'مولد نصوص الإعلانات',
    adCopyShort: 'نصوص الإعلانات',
    adCopyDesc: 'نصوص إعلانية عالية التحويل لأي منصة',
    videoPromptGenerator: 'مولد برومبتات الفيديو',
    videoPromptShort: 'برومبت الفيديو',
    videoPromptDesc: 'برومبتات احترافية لمولدات الفيديو بالذكاء الاصطناعي',
    personaGenerator: 'مولد الشخصيات',
    personaShort: 'الشخصيات',
    personaDesc: 'إنشاء شخصيات عملاء تفصيلية',
    marketingPlanGenerator: 'مولد خطة التسويق',
    marketingPlanShort: 'خطة التسويق',
    marketingPlanDesc: 'مولد استراتيجية تسويقية كاملة',
  },
  dashboard: {
    title: 'لوحة التحكم',
    welcomeBack: 'مرحباً بعودتك',
    subtitle: 'أنشئ محتوى تسويقياً عالي التحويل في ثوانٍ. اختر أداة للبدء.',
    startGenerating: 'ابدأ الإنشاء',
    quickAccess: 'وصول سريع',
    totalGenerations: 'إجمالي الإنشاءات',
    favoriteTool: 'الأداة المفضلة',
    historyCount: 'عدد السجل',
    aiStatus: 'حالة الذكاء الاصطناعي',
    currentModel: 'النموذج الحالي',
    apiStatus: 'حالة API',
    aiControlSnapshot: 'لقطة تحكم الذكاء الاصطناعي',
    tune: 'تعديل',
    recentActivity: 'النشاط الأخير',
    viewAll: 'عرض الكل',
    noGenerationsYet: 'لا توجد إنشاءات بعد',
    noGenerationsDesc: 'ستظهر العناوين وأفكار المحتوى المحفوظة هنا. جرب مولد العناوين للبدء.',
    openHooksGenerator: 'فتح مولد العناوين',
    results: 'نتائج',
    savedItems: 'عناصر محفوظة',
    savedAcrossSessions: 'محفوظة عبر الجلسات',
    mostUsedGenerator: 'المولد الأكثر استخداماً',
    allTimeSavedResults: 'جميع النتائج المحفوظة',
    edgeFunction: 'Edge Function',
    groqInference: 'Groq Inference',
    localStorage: 'التخزين المحلي',
    operational: 'يعمل',
    reachable: 'متاح',
    connected: 'متصل',
    online: 'متصل',
    lastChecked: 'آخر فحص للتو.',
    allSystemsOperational: 'جميع الأنظمة تعمل.',
    aiPowered: 'مدعوم بالذكاء الاصطناعي',
    aiWorkspace: 'مساحة الذكاء الاصطناعي',
  },
  hooks: {
    title: 'مولد العناوين',
    subtitle: 'أنشئ عناوين تسويقية تجذب الانتباه للإعلانات ووسائل التواصل.',
    productOrIdea: 'المنتج أو الفكرة',
    productOrIdeaPlaceholder: 'صف منتجك أو خدمتك أو فكرتك...',
    productOrIdeaDesc: 'أدخل منتجك أو خدمتك أو زاويتك التسويقية.',
    generateHooks: 'إنشاء العناوين',
    hooksReady: 'عناوينك جاهزة!',
    hooksWillAppear: 'ستظهر عناوينك هنا',
    fillDetailsAndGenerate: 'املأ التفاصيل وانقر على إنشاء',
    yourHooksWillAppearHere: 'ستظهر عناوينك التسويقية هنا',
    noHooksYet: 'لا توجد عناوين بعد',
    copyToClipboard: 'نسخ إلى الحافظة',
    copyAllHooks: 'نسخ جميع العناوين',
  },
  contentIdeas: {
    title: 'أفكار المحتوى',
    subtitle: 'أنشئ أفكار محتوى فريدة وقابلة للتنفيذ لمجالك.',
    nicheOrBusiness: 'المجال أو النشاط',
    nichePlaceholder: 'مثال: اللياقة، التجارة الإلكترونية، SaaS...',
    productOrService: 'المنتج أو الخدمة',
    productPlaceholder: 'صف منتجك أو خدمتك...',
    targetAudience: 'الجمهور المستهدف',
    audiencePlaceholder: 'مثال: المحترفون الشباب من 25-35 سنة',
    generateIdeas: 'إنشاء الأفكار',
    ideasWillAppear: 'ستظهر أفكار المحتوى هنا',
    yourIdeasWillAppear: 'املأ التفاصيل وانقر على إنشاء',
    educational: 'تعليمي',
    problemSolving: 'حل المشاكل',
    storytelling: 'قصص',
    engagement: 'تفاعل',
    viral: 'فيروسي',
    authority: 'بناء السلطة',
    promotional: 'ترويجي',
    post: 'منشور',
    reel: 'ريلز',
    video: 'فيديو',
    carousel: 'كاروسيل',
    blog: 'مقال',
  },
  adCopy: {
    title: 'مولد نصوص الإعلانات',
    subtitle: 'أنشئ نصوصاً إعلانية عالية التحويل لأي منصة في ثوانٍ.',
    campaignDetails: 'تفاصيل الحملة',
    productOrService: 'المنتج أو الخدمة',
    productPlaceholder: 'صف منتجك أو خدمتك...',
    targetAudience: 'الجمهور المستهدف',
    audiencePlaceholder: 'مثال: المحترفون الشباب من 25-35 سنة المهتمون باللياقة',
    platform: 'المنصة',
    campaignGoal: 'هدف الحملة',
    generateAdCopy: 'إنشاء نص الإعلان',
    yourAdCopyWillAppear: 'سيظهر نص إعلانك هنا',
    hook: 'العنوان الجذاب',
    primaryText: 'النص الرئيسي',
    headline: 'العنوان الرئيسي',
    callToAction: 'الدعوة للعمل',
    description: 'الوصف',
    charsMax: 'حرف كحد أقصى للنص الرئيسي',
    awareness: 'التوعية بالعلامة',
    consideration: 'التفكير',
    conversion: 'التحويل',
    engagementGoal: 'التفاعل',
    traffic: 'الزيارات',
  },
  videoPrompt: {
    title: 'مولد برومبتات الفيديو',
    subtitle: 'أنشئ برومبتات احترافية لمولدات الفيديو بالذكاء الاصطناعي مثل Veo و Runway و Pika و Kling و Luma.',
    videoDetails: 'تفاصيل الفيديو',
    productOrService: 'المنتج أو الخدمة',
    productPlaceholder: 'صف منتجك أو خدمتك...',
    targetAudience: 'الجمهور المستهدف',
    audiencePlaceholder: 'مثال: المحترفون الشباب من 25-35 سنة',
    marketingGoal: 'الهدف التسويقي',
    goalPlaceholder: 'مثال: زيادة تنزيلات التطبيق، تعزيز الوعي بالعلامة',
    platform: 'المنصة',
    videoLength: 'مدة الفيديو',
    visualStyle: 'النمط البصري',
    generatePrompt: 'إنشاء البرومبت',
    yourPromptWillAppear: 'سيظهر برومبت الفيديو هنا',
    marketingHook: 'العنوان التسويقي',
    videoPrompt: 'برومبت الفيديو',
    negativePrompt: 'البرومبت السلبي',
    recommendedModel: 'نموذج الذكاء الاصطناعي الموصى به',
    whyRecommended: 'سبب التوصية بهذا النموذج',
    compatibleWith: 'متوافق مع Veo و Runway و Pika و Kling و Luma Dream Machine',
    seconds: 'ثواني',
  },
  persona: {
    title: 'مولد الشخصيات',
    subtitle: 'أنشئ شخصيات عملاء تفصيلية لسوقك المستهدف.',
    generateDetailedPersona: 'إنشاء شخصية تفصيلية',
    productOrService: 'المنتج أو الخدمة',
    productPlaceholder: 'صف منتجك أو خدمتك...',
    industry: 'الصناعة',
    industryPlaceholder: 'مثال: التكنولوجيا، الموضة، الصحة...',
    targetMarket: 'السوق المستهدف',
    targetMarketPlaceholder: 'مثال: B2B، B2C، الشركات...',
    country: 'الدولة',
    countryPlaceholder: 'مثال: الولايات المتحدة، المملكة العربية السعودية...',
    generatePersona: 'إنشاء الشخصية',
    yourPersonaWillAppear: 'ستظهر شخصيتك هنا',
    personaName: 'اسم الشخصية',
    age: 'العمر',
    gender: 'الجنس',
    occupation: 'المهنة',
    incomeLevel: 'مستوى الدخل',
    goals: 'الأهداف',
    painPoints: 'نقاط الألم',
    motivations: 'الدوافع',
    buyingBehavior: 'سلوك الشراء',
    preferredPlatforms: 'المنصات المفضلة',
    preferredContent: 'نوع المحتوى المفضل',
    objections: 'الاعتراضات قبل الشراء',
    bestMessage: 'أفضل رسالة تسويقية',
    recommendedCta: 'الدعوة للعمل الموصى بها',
  },
  marketingPlan: {
    title: 'مولد خطة التسويق',
    subtitle: 'أنشئ استراتيجية تسويقية كاملة لعملك.',
    generateCompleteStrategy: 'إنشاء استراتيجية كاملة',
    business: 'النشاط التجاري',
    businessPlaceholder: 'صف نشاطك التجاري...',
    product: 'المنتج',
    productPlaceholder: 'صف منتجك أو خدمتك...',
    targetAudience: 'الجمهور المستهدف',
    audiencePlaceholder: 'صف جمهورك المستهدف...',
    monthlyBudget: 'الميزانية الشهرية',
    budgetPlaceholder: 'مثال: 5,000 دولار',
    goal: 'الهدف',
    goalPlaceholder: 'مثال: زيادة المبيعات بنسبة 20%',
    generatePlan: 'إنشاء الخطة التسويقية',
    yourPlanWillAppear: 'ستظهر خطة التسويق هنا',
    executiveSummary: 'الملخص التنفيذي',
    swotAnalysis: 'تحليل SWOT',
    idealCustomer: 'العميل المثالي',
    marketingChannels: 'قنوات التسويق',
    contentStrategy: 'استراتيجية المحتوى',
    advertisingStrategy: 'استراتيجية الإعلانات',
    seoStrategy: 'استراتيجية SEO',
    emailMarketing: 'التسويق عبر البريد الإلكتروني',
    socialMediaPlan: 'خطة وسائل التواصل',
    kpis: 'مؤشرات الأداء',
    actionPlan30Days: 'خطة 30 يوماً',
    growthPlan90Days: 'خطة النمو 90 يوماً',
    budgetDistribution: 'توزيع الميزانية',
    recommendedTools: 'أدوات الذكاء الاصطناعي الموصى بها',
    strengths: 'نقاط القوة',
    weaknesses: 'نقاط الضعف',
    opportunities: 'الفرص',
    threats: 'التهديدات',
  },
  historyView: {
    title: 'السجل',
    searchPlaceholder: 'البحث في السجل حسب العنوان أو النوع أو المحتوى...',
    noHistoryYet: 'لا يوجد سجل بعد',
    noHistoryDesc: 'سيتم حفظ العناوين وأفكار المحتوى هنا تلقائياً.',
    noMatches: 'لا توجد نتائج مطابقة',
    noMatchesDesc: 'جرب مصطلح بحث أو فلتر مختلف.',
    hooks: 'العناوين',
    ideas: 'الأفكار',
    adCopy: 'نص الإعلان',
    videoPrompt: 'برومبت الفيديو',
    image: 'الصورة',
    persona: 'الشخصية',
    marketingPlan: 'الخطة',
    clearHistory: 'مسح كل السجل',
    cleared: 'تم مسح السجل',
    removed: 'تم الحذف',
  },
  settingsView: {
    title: 'الإعدادات',
    quickSettings: 'إعدادات سريعة',
    openFullSettings: 'افتح علامة الإعدادات لمركز التحكم الكامل',
    moodDial: 'مزاج النص',
    moodDesc: 'يحدد النغمة العاطفية للمخرجات.',
    personaMixer: 'شخصية الكاتب',
    personaDesc: 'من يكتب كـه الذكاء الاصطناعي.',
    creativitySlider: 'مستوى الإبداع',
    creativityDesc: 'أعلى = أكثر تنويعاً، أقل = أكثر تركيزاً.',
    focused: 'مركز',
    balanced: 'متوازن',
    wild: 'عشوائي',
    draftVsFinal: 'مسودة أم نهائي',
    draftFinalDesc: 'المسودات استكشافية؛ النهائي مصقول وجاهز للنشر.',
    draft: 'مسودة',
    draftHint: 'وضع العصف الذهني',
    final: 'نهائي',
    finalHint: 'مخرجات مصقولة',
    languageSettings: 'إعدادات اللغة',
    autoLanguage: 'الكشف التلقائي عن اللغة',
    autoLanguageDesc: 'كشف العربية مقابل الإنجليزية من إدخالك تلقائياً.',
    responseLanguage: 'لغة الاستجابة',
    responseLanguageDesc: 'يتحكم في لغة المحتوى الذي ينشئه الذكاء الاصطناعي.',
    autoDetect: 'كشف تلقائي',
    userPreferences: 'تفضيلات المستخدم',
    numberOfResults: 'عدد النتائج',
    resultsDesc: 'كم عدد النتائج المراد إنشاؤها لكل طلب.',
    defaultOutputStyle: 'نمط المخرجات الافتراضي',
    styleDesc: 'النغمة المطبقة على جميع المحتوى المُنشأ.',
    professional: 'احترافي',
    casual: 'عفوي',
    creative: 'إبداعي',
    persuasive: 'مقنع',
    themeSettings: 'إعدادات المظهر',
    colorTheme: 'مظهر الألوان',
    colorThemeDesc: 'يُطبق فوراً على التطبيق بأكمله.',
    historySettings: 'إعدادات السجل',
    saveResults: 'حفظ النتائج المُنشأة',
    saveResultsDesc: 'يخزن النتائج محلياً في متصفحك.',
    storedLocally: 'مخزنة محلياً على هذا الجهاز',
    exportOptions: 'خيارات التصدير',
    copyAllResults: 'نسخ جميع النتائج',
    copyAllDesc: 'ينسخ السجل بالكامل إلى الحافظة',
    downloadTxt: 'تنزيل كـ TXT',
    downloadTxtDesc: 'ملف نصي عادي لكل السجل',
    downloadPdf: 'تنزيل كـ PDF',
    downloadPdfDesc: 'PDF منسق لكل السجل',
    account: 'الحساب',
    toolVersion: 'إصدار الأداة',
    storage: 'التخزين',
    local: 'محلي',
    resetDefaults: 'إعادة تعيين',
    resetToDefaults: 'إعادة التعيين للافتراضيات',
    moodNeutral: 'محايد',
    moodNeutralHint: 'نغمة متوازنة وهادئة',
    moodEnergetic: 'حيوي',
    moodEnergeticHint: 'طاقة عالية، قوي',
    moodCalm: 'هادئ',
    moodCalmHint: 'ناعم، مطمئن',
    moodBold: 'جريء',
    moodBoldHint: 'واثق، مقدام',
    moodPlayful: 'مرح',
    moodPlayfulHint: 'ممتع، خفيف',
    moodLuxury: 'فاخر',
    moodLuxuryHint: 'فاخر، راقٍ',
    personaMarketer: 'مسوّق',
    personaMarketerHint: 'يركز على التحويل',
    personaFounder: 'مؤسس',
    personaFounderHint: 'سرد القصص بالرؤية',
    personaCopywriter: 'كاتب إعلانات',
    personaCopywriterHint: 'قوي، مقنع',
    personaStrategist: 'استراتيج',
    personaStrategistHint: 'مدفوع بالرؤى',
    personaStoryteller: 'راوي',
    personaStorytellerHint: 'سردي، عاطفي',
    personaAnalyst: 'محلل',
    personaAnalystHint: 'مدفوع بالبيانات، دقيق',
  },
  platforms: {
    facebook: 'فيسبوك',
    instagram: 'انستغرام',
    tiktok: 'تيك توك',
    linkedin: 'لينكد إن',
    google: 'إعلانات جوجل',
    tiktokShorts: 'تيك توك',
    instagramReels: 'ريلز انستغرام',
    youtubeShorts: 'يوتيوب شورتس',
  },
  styles: {
    cinematic: 'سينمائي',
    ugc: 'محتوى مستخدم',
    luxury: 'فاخر',
    corporate: 'شركات',
    viral: 'فيروسي',
    documentary: 'وثائقي',
    minimal: 'بسيط',
  },
  time: {
    seconds: 'ثواني',
    minutes: 'دقائق',
    hours: 'ساعات',
    days: 'أيام',
    months: 'أشهر',
    justNow: 'الآن',
    ago: 'مضت',
  },
  errors: {
    somethingWentWrong: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    pleaseTryAgain: 'يرجى المحاولة مرة أخرى.',
    pleaseFillAllFields: 'يرجى ملء جميع الحقول المطلوبة.',
    networkError: 'خطأ في الشبكة. تحقق من اتصالك وحاول مرة أخرى.',
    apiError: 'خدمة الذكاء الاصطناعي غير متاحة. يرجى المحاولة مرة أخرى.',
    noHistory: 'لا يوجد سجل للتنزيل.',
    failedToCopy: 'فشل النسخ.',
    failedToGenerate: 'تعذر الإنشاء. يرجى المحاولة مرة أخرى.',
    keepUnderChars: 'يرجى إبقاء إدخالك أقل منcharacters.',
    provideAtLeast: 'يرجى تقديمcharacters على الأقل.',
  },
  success: {
    copied: 'تم النسخ إلى الحافظة',
    copiedAll: 'تم نسخ جميع النتائج',
    generated: 'تم الإنشاء بنجاح!',
    saved: 'تم الحفظ',
    downloaded: 'تم التنزيل',
    languageChanged: 'تم تغيير اللغة',
  },
};

// ─── Translation Dictionary Map ───────────────────────────────────────────────

export const translations: Record<Language, TranslationDict> = { en, ar };

// ─── Helper Functions ──────────────────────────────────────────────────────────

export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';
  const browserLang = navigator.language?.toLowerCase() || 'ar';
  // Default to Arabic unless browser is explicitly English
  if (browserLang.startsWith('en')) return 'en';
  return 'ar';
}

export function getTranslation(lang: Language): TranslationDict {
  return translations[lang] || translations.en;
}

export function isRTL(lang: Language): boolean {
  return lang === 'ar';
}

export function getTextDirection(lang: Language): 'rtl' | 'ltr' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}
