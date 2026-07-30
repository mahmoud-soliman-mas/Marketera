'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Sparkles, Bot, User, Wand2, FileText, Video, Search, Target,
  Mail, Layout, Share2, Users, ShoppingBag, Volume2, Mic, MicOff,
  RefreshCw, Trash2, Copy, Check, ChevronRight, Lightbulb, Zap, X,
  Settings, Square, Pencil, Play, ArrowDown, Brain, Cpu, Languages,
  FileSearch, Megaphone, PenLine, ListChecks, StopCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/settings';
import { useAccessibility } from '@/lib/accessibility/provider';
import {
  aiAssistantService,
  loadConversation,
  saveConversation,
  clearConversation,
  loadMemory,
  clearMemory,
} from '@/lib/ai-assistant/service';
import type { AIMessage, SuggestedAction, FollowUpOption, ConversationMemory } from '@/lib/ai-assistant/types';
import { detectLang } from '@/lib/api';
import { toast } from 'sonner';
import { voiceService } from '@/lib/voice/service';
import type { ToolId } from '@/lib/tools';
import { Markdown } from './markdown';

interface AIAssistantProps {
  onNavigate?: (toolId: ToolId) => void;
}

// ─── Quick Actions ───────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  prompt: string;
  promptAr: string;
  toolId?: ToolId;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'ads', label: 'Generate Ads', labelAr: 'إنشاء إعلانات', icon: FileText, prompt: 'Generate ad copy for this', promptAr: 'أنشئ نسخة إعلانية لهذا', toolId: 'ad-copy' },
  { id: 'hooks', label: 'Generate Hooks', labelAr: 'إنشاء عناوين', icon: Wand2, prompt: 'Generate marketing hooks for this', promptAr: 'أنشئ عناوين تسويقية لهذا', toolId: 'hooks' },
  { id: 'persona', label: 'Generate Persona', labelAr: 'إنشاء شخصية', icon: Users, prompt: 'Create a customer persona for this', promptAr: 'أنشئ شخصية عميل لهذا', toolId: 'persona' },
  { id: 'seo', label: 'Generate SEO', labelAr: 'تحسين SEO', icon: Search, prompt: 'Generate SEO keywords for this', promptAr: 'أنشئ كلمات مفتاحية لهذا', toolId: 'seo' },
  { id: 'plan', label: 'Marketing Plan', labelAr: 'خطة تسويقية', icon: Target, prompt: 'Create a marketing plan for this', promptAr: 'أنشئ خطة تسويقية لهذا', toolId: 'marketing-plan' },
  { id: 'email', label: 'Create Email', labelAr: 'إنشاء بريد', icon: Mail, prompt: 'Create an email campaign for this', promptAr: 'أنشئ حملة بريدية لهذا', toolId: 'email' },
  { id: 'landing', label: 'Landing Page', labelAr: 'صفحة هبوط', icon: Layout, prompt: 'Create landing page copy for this', promptAr: 'أنشئ نسخة صفحة هبوط لهذا', toolId: 'landing-page' },
  { id: 'rewrite', label: 'Rewrite', labelAr: 'إعادة كتابة', icon: PenLine, prompt: 'Rewrite this with a fresh angle', promptAr: 'أعد كتابة هذا بزاوية جديدة' },
  { id: 'summarize', label: 'Summarize', labelAr: 'تلخيص', icon: ListChecks, prompt: 'Summarize this in key points', promptAr: 'لخص هذا في نقاط رئيسية' },
  { id: 'translate', label: 'Translate', labelAr: 'ترجمة', icon: Languages, prompt: 'Translate this to English', promptAr: 'ترجم هذا إلى الإنجليزية' },
];

const TOOL_ICONS: Record<string, React.ElementType> = {
  hooks: Wand2,
  'ad-copy': FileText,
  'video-prompt': Video,
  persona: Users,
  'marketing-plan': Target,
  seo: Search,
  'social-media': Share2,
  email: Mail,
  'landing-page': Layout,
  'product-description': ShoppingBag,
};

// ─── Component ───────────────────────────────────────────────────────────────

export function AIAssistant({ onNavigate }: AIAssistantProps) {
  const { settings } = useSettings();
  const { accessibilityMode, speakText } = useAccessibility();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [memory, setMemory] = useState<ConversationMemory>({ language: 'en' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load conversation and memory on mount
  useEffect(() => {
    const saved = loadConversation();
    if (saved.length > 0) {
      setMessages(saved);
    }
    setMemory(loadMemory());
  }, []);

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversation(messages);
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  // Scroll detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setShowScrollDown(distanceFromBottom > 200);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (!showScrollDown) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      voiceService.stt.stop();
      voiceService.tts.stop();
    };
  }, []);

  const autoLang = detectLang(input);
  const language: 'ar' | 'en' = settings.autoLanguage || settings.languageMode === 'auto'
    ? autoLang
    : settings.languageMode;
  const isAr = language === 'ar';

  // ─── Send Message (with streaming) ──────────────────────────────────────────

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    // If editing, remove messages after the edited one
    let baseMessages = messages;
    if (editingId) {
      const editIndex = messages.findIndex((m) => m.id === editingId);
      if (editIndex >= 0) {
        baseMessages = messages.slice(0, editIndex);
      }
      setEditingId(null);
      setEditText('');
    }

    const userMessage: AIMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...(editingId ? baseMessages : prev), userMessage]);
    setInput('');
    setLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    const assistantId = `${Date.now()}-assistant`;
    abortRef.current = new AbortController();

    try {
      const fullContent = await aiAssistantService.chatStream(
        {
          message: text,
          conversationHistory: [...baseMessages, userMessage],
          language,
          creativity: settings.creativity,
          persona: settings.persona,
          mood: settings.mood,
        },
        (token) => {
          setStreamingContent((prev) => prev + token);
        },
        abortRef.current.signal
      );

      // Generate suggested actions and follow-ups
      const suggestedActions = generateSuggestedActionsLocal(text + ' ' + fullContent, language);
      const followUpOptions = generateFollowUpOptionsLocal(language);

      const assistantMessage: AIMessage = {
        id: assistantId,
        role: 'assistant',
        content: fullContent,
        timestamp: Date.now(),
        metadata: {
          suggestedActions,
          followUpOptions,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setMemory(loadMemory());

      // Auto-speak if enabled
      if (settings.autoSpeak && accessibilityMode) {
        handleSpeak(fullContent);
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // Save partial content if we have any
        if (streamingContent) {
          const partialMessage: AIMessage = {
            id: assistantId,
            role: 'assistant',
            content: streamingContent + '\n\n*[Stopped by user]*',
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, partialMessage]);
        }
      } else {
        toast.error(isAr ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
      abortRef.current = null;
    }
  };

  // ─── Stop Generating ───────────────────────────────────────────────────────

  const handleStop = () => {
    abortRef.current?.abort();
  };

  // ─── Regenerate Response ────────────────────────────────────────────────────

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex < 0) return;

    // Find the user message before this assistant message
    let userMessage: AIMessage | null = null;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMessage = messages[i];
        break;
      }
    }
    if (!userMessage) return;
    const userMsg = userMessage;

    // Remove the assistant message we're regenerating
    setMessages((prev) => prev.slice(0, messageIndex));
    setLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    const assistantId = `${Date.now()}-assistant`;
    abortRef.current = new AbortController();

    try {
      const fullContent = await aiAssistantService.chatStream(
        {
          message: userMsg.content,
          conversationHistory: messages.slice(0, messageIndex).filter((m) => m.id !== userMsg.id),
          language,
          creativity: settings.creativity,
          persona: settings.persona,
          mood: settings.mood,
        },
        (token) => {
          setStreamingContent((prev) => prev + token);
        },
        abortRef.current.signal
      );

      const suggestedActions = generateSuggestedActionsLocal(userMsg.content + ' ' + fullContent, language);
      const followUpOptions = generateFollowUpOptionsLocal(language);

      const assistantMessage: AIMessage = {
        id: assistantId,
        role: 'assistant',
        content: fullContent,
        timestamp: Date.now(),
        metadata: { suggestedActions, followUpOptions },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setMemory(loadMemory());
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error(isAr ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
      abortRef.current = null;
    }
  };

  // ─── Edit Message ──────────────────────────────────────────────────────────

  const handleEditStart = (message: AIMessage) => {
    setEditingId(message.id);
    setEditText(message.content);
  };

  const handleEditSave = () => {
    if (!editingId || !editText.trim()) return;
    handleSend(editText);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  // ─── Continue Generating ───────────────────────────────────────────────────

  const handleContinue = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    setLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    abortRef.current = new AbortController();

    try {
      const fullContent = await aiAssistantService.chatStream(
        {
          message: isAr ? 'أكمل من حيث توقفت' : 'Continue from where you left off',
          conversationHistory: messages.slice(0, messages.indexOf(message) + 1),
          language,
          creativity: settings.creativity,
          persona: settings.persona,
          mood: settings.mood,
        },
        (token) => {
          setStreamingContent((prev) => prev + token);
        },
        abortRef.current.signal
      );

      // Append to existing message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: m.content + '\n\n' + fullContent }
            : m
        )
      );
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error(isAr ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
      abortRef.current = null;
    }
  };

  // ─── Keyboard ──────────────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Clear ──────────────────────────────────────────────────────────────────

  const handleClear = () => {
    setMessages([]);
    clearConversation();
    clearMemory();
    setMemory({ language: 'en' });
    toast.success(isAr ? 'تم مسح المحادثة' : 'Conversation cleared');
  };

  // ─── Voice Input ────────────────────────────────────────────────────────────

  const handleVoiceInput = useCallback(async () => {
    if (!voiceService.hasSTT()) {
      toast.error(isAr ? 'المتصفح لا يدعم الإدخال الصوتي' : 'Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      voiceService.stt.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      try {
        voiceService.stt.setLanguage(language);
        await voiceService.stt.start();
      } catch {
        toast.error(isAr ? 'فشل بدء التسجيل' : 'Failed to start voice input');
        setIsListening(false);
      }
    }
  }, [isListening, language, isAr]);

  useEffect(() => {
    const unsubscribe = voiceService.stt.subscribe((result) => {
      if (result.isFinal) {
        setInput((prev) => prev + (prev ? ' ' : '') + result.transcript);
        setIsListening(false);
      }
    });
    return unsubscribe;
  }, []);

  // ─── Speak ──────────────────────────────────────────────────────────────────

  const handleSpeak = useCallback(async (text: string) => {
    if (!voiceService.hasTTS()) {
      toast.error(isAr ? 'المتصفح لا يدعم الإخراج الصوتي' : 'Voice output not supported');
      return;
    }

    if (isSpeaking) {
      voiceService.tts.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await voiceService.tts.speak({ text, lang: language, rate: accessibilityMode ? 0.85 : 1.0 });
      } catch {
        toast.error(isAr ? 'فشل قراءة النص' : 'Failed to speak text');
      } finally {
        setIsSpeaking(false);
      }
    }
  }, [isSpeaking, language, accessibilityMode, isAr]);

  // ─── Copy ──────────────────────────────────────────────────────────────────

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error(isAr ? 'فشل النسخ' : 'Failed to copy');
    }
  };

  // ─── Follow-up ──────────────────────────────────────────────────────────────

  const handleFollowUp = async (message: AIMessage, action: FollowUpOption) => {
    if (loading) return;
    setLoading(true);
    setStreamingContent('');
    setIsStreaming(true);

    const assistantId = `${Date.now()}-assistant`;
    abortRef.current = new AbortController();

    try {
      const fullContent = await aiAssistantService.chatStream(
        {
          message: `${action.label}: ${message.content}`,
          conversationHistory: messages,
          language,
          creativity: settings.creativity,
          persona: settings.persona,
          mood: settings.mood,
        },
        (token) => {
          setStreamingContent((prev) => prev + token);
        },
        abortRef.current.signal
      );

      const followUpOptions = generateFollowUpOptionsLocal(language);
      const newMessage: AIMessage = {
        id: assistantId,
        role: 'assistant',
        content: fullContent,
        timestamp: Date.now(),
        metadata: { followUpOptions },
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error(isAr ? 'فشل التحسين' : 'Failed to improve');
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
      abortRef.current = null;
    }
  };

  // ─── Quick Action ───────────────────────────────────────────────────────────

  const handleQuickAction = (action: QuickAction, message?: AIMessage) => {
    if (action.toolId && onNavigate) {
      onNavigate(action.toolId);
      return;
    }
    const prompt = isAr ? action.promptAr : action.prompt;
    const context = message ? `${prompt}: "${message.content.slice(0, 500)}"` : prompt;
    handleSend(context);
  };

  // ─── Action Click ──────────────────────────────────────────────────────────

  const handleActionClick = (action: SuggestedAction) => {
    if (onNavigate && action.toolId !== 'ai-assistant') {
      onNavigate(action.toolId as ToolId);
    } else {
      setInput(isAr ? `أريد ${action.label}` : `I want ${action.label}`);
    }
  };

  // ─── Scroll to Bottom ──────────────────────────────────────────────────────

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ─── Quick Prompts ──────────────────────────────────────────────────────────

  const quickPrompts = isAr
    ? [
        'أبيع دورات تعليمية للغة الإنجليزية. ساعدني في إنشاء استراتيجية تسويقية كاملة.',
        'أنشئ عناوين جذابة لمنتجي',
        'أنشئ إعلانات لفيسبوك تستهدف الشباب',
        'ساعدني في فهم جمهوري المستهدف',
      ]
    : [
        'I sell English courses. Help me create a complete marketing strategy.',
        'Generate hooks for my fitness app',
        'Create ad copy for Facebook targeting young professionals',
        'Help me understand my target audience better',
      ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 shadow-lg shadow-sky-500/25">
            <Sparkles className="h-5 w-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {isAr ? 'مساعد التسويق الذكي' : 'Marketra AI Assistant'}
              <span className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-2 py-0.5 text-[10px] font-bold text-white">
                AI
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              {memory.business
                ? (isAr ? `مشروعك: ${memory.business}` : `Your business: ${memory.business}`)
                : (isAr ? 'مساعدك الشخصي للتسويق' : 'Your personal marketing expert')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {memory.business && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-sky-50 dark:bg-sky-900/20 px-3 py-1 text-xs text-sky-600 dark:text-sky-400">
              <Brain className="h-3.5 w-3.5" />
              {isAr ? 'ذاكرة نشطة' : 'Memory active'}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 h-9 w-9"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="gap-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 h-9"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isAr ? 'مسح' : 'Clear'}</span>
          </Button>
        </div>
      </div>

      {/* Memory Context Bar */}
      {showSettings && (memory.business || memory.audience || memory.products?.length) && (
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-sky-50/50 dark:bg-sky-900/10 px-6 py-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {memory.business && (
              <span className="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-slate-600 dark:text-slate-300 shadow-sm">
                {isAr ? 'المشروع:' : 'Business:'} {memory.business}
              </span>
            )}
            {memory.audience && (
              <span className="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-slate-600 dark:text-slate-300 shadow-sm">
                {isAr ? 'الجمهور:' : 'Audience:'} {memory.audience}
              </span>
            )}
            {memory.products && memory.products.length > 0 && (
              <span className="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-slate-600 dark:text-slate-300 shadow-sm">
                {isAr ? 'المنتجات:' : 'Products:'} {memory.products.join(', ')}
              </span>
            )}
            <button
              onClick={() => { clearMemory(); setMemory({ language: 'en' }); setShowSettings(false); }}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
          {messages.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 shadow-2xl shadow-sky-500/30">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900">
                  <Zap className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {isAr ? 'كيف يمكنني مساعدتك؟' : 'How can I help you today?'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
                {isAr
                  ? 'أنا مساعدك التسويقي الذكي. أخبرني عن مشروعك وسأساعدك في إنشاء استراتيجية تسويقية كاملة.'
                  : "I'm your Marketra AI assistant. Tell me about your business, and I'll help you create a complete marketing strategy."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(prompt); textareaRef.current?.focus(); }}
                    className={cn(
                      'group flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-700',
                      'bg-white dark:bg-slate-800 p-4 text-left transition-all duration-300',
                      'hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-0.5',
                      'active:translate-y-0'
                    )}
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-900/50 dark:to-cyan-900/50">
                      <Lightbulb className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-snug">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isAr={isAr}
              isSpeaking={isSpeaking}
              copiedId={copiedId}
              editingId={editingId}
              editText={editText}
              onCopy={handleCopy}
              onSpeak={handleSpeak}
              onRegenerate={handleRegenerate}
              onEditStart={handleEditStart}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
              onEditText={setEditText}
              onFollowUp={handleFollowUp}
              onActionClick={handleActionClick}
              onQuickAction={handleQuickAction}
              onContinue={handleContinue}
            />
          ))}

          {/* Streaming message */}
          {isStreaming && (
            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 shadow-lg shadow-sky-500/25">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 max-w-[85%]">
                <div className="rounded-3xl rounded-tl-md bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 p-5">
                  {streamingContent ? (
                    <Markdown content={streamingContent} />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {isAr ? 'جارٍ التفكير...' : 'Thinking...'}
                      </span>
                    </div>
                  )}
                  {streamingContent && (
                    <span className="inline-block h-4 w-1 bg-sky-500 animate-pulse ml-0.5 align-middle" />
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll Down Button */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-all hover:scale-110"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <div className="relative flex items-end gap-2.5">
            {/* Microphone Button */}
            <Button
              onClick={handleVoiceInput}
              size="lg"
              className={cn(
                'h-12 w-12 flex-shrink-0 rounded-2xl shadow-md transition-all duration-300',
                isListening
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              )}
            >
              {isListening ? (
                <div className="relative">
                  <MicOff className="h-5 w-5" />
                  <span className="absolute -inset-1 rounded-full bg-rose-400 opacity-30 animate-ping" />
                </div>
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>

            {/* Text Input */}
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isAr
                  ? 'اسأل أي سؤال في التسويق أو صف مشروعك...'
                  : 'Ask anything about marketing or describe your business...'}
                className={cn(
                  'w-full min-h-[48px] max-h-[200px] resize-none rounded-2xl border border-slate-200 dark:border-slate-600',
                  'bg-white dark:bg-slate-800 px-4 py-3 text-[15px] leading-relaxed outline-none',
                  'transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/40',
                  'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                  'text-slate-800 dark:text-slate-100',
                  accessibilityMode && 'text-lg py-4',
                  isListening && 'ring-2 ring-rose-200 dark:ring-rose-900/40'
                )}
                disabled={loading && !isStreaming}
              />
              {isListening && (
                <div className="absolute -top-2 left-4 flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  {isAr ? 'جارٍ التسجيل' : 'Recording'}
                </div>
              )}
            </div>

            {/* Send / Stop Button */}
            {isStreaming ? (
              <Button
                onClick={handleStop}
                size="lg"
                className="h-12 w-12 flex-shrink-0 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 transition-all hover:scale-105 active:scale-100"
              >
                <Square className="h-5 w-5" fill="currentColor" />
              </Button>
            ) : (
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                size="lg"
                className={cn(
                  'h-12 w-12 flex-shrink-0 rounded-2xl shadow-lg transition-all duration-300',
                  input.trim()
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 active:scale-100'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500'
                )}
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
            {isAr ? 'اضغط Enter للإرسال، Shift+Enter لسطر جديد' : 'Press Enter to send, Shift+Enter for new line'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble Component ─────────────────────────────────────────────────

interface MessageBubbleProps {
  message: AIMessage;
  isAr: boolean;
  isSpeaking: boolean;
  copiedId: string | null;
  editingId: string | null;
  editText: string;
  onCopy: (text: string, id: string) => void;
  onSpeak: (text: string) => void;
  onRegenerate: (id: string) => void;
  onEditStart: (message: AIMessage) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditText: (text: string) => void;
  onFollowUp: (message: AIMessage, action: FollowUpOption) => void;
  onActionClick: (action: SuggestedAction) => void;
  onQuickAction: (action: QuickAction, message?: AIMessage) => void;
  onContinue: (id: string) => void;
}

function MessageBubble({
  message, isAr, isSpeaking, copiedId, editingId, editText,
  onCopy, onSpeak, onRegenerate, onEditStart, onEditSave, onEditCancel, onEditText,
  onFollowUp, onActionClick, onQuickAction, onContinue,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isEditing = editingId === message.id;

  return (
    <div className={cn('flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl shadow-lg',
        isUser
          ? 'bg-slate-200 dark:bg-slate-700'
          : 'bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 shadow-sky-500/25'
      )}>
        {isUser ? (
          <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 min-w-0', isUser ? 'flex flex-col items-end' : 'max-w-[85%]')}>
        {/* Message Body */}
        {isEditing ? (
          <div className="w-full max-w-[85%]">
            <textarea
              value={editText}
              onChange={(e) => onEditText(e.target.value)}
              className="w-full min-h-[80px] rounded-2xl border-2 border-sky-400 bg-white dark:bg-slate-800 p-4 text-[15px] outline-none resize-none text-slate-800 dark:text-slate-100"
              autoFocus
            />
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={onEditSave} className="gap-1.5 h-8">
                <Check className="h-3.5 w-3.5" />
                {isAr ? 'حفظ وإرسال' : 'Save & Send'}
              </Button>
              <Button size="sm" variant="ghost" onClick={onEditCancel} className="h-8">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        ) : (
          <div className={cn(
            'rounded-3xl shadow-lg border p-5',
            isUser
              ? 'rounded-tr-md bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-transparent'
              : 'rounded-tl-md bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
          )}>
            {isUser ? (
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</p>
            ) : (
              <Markdown content={message.content} className="text-slate-700 dark:text-slate-200" />
            )}
          </div>
        )}

        {/* Action Bar (assistant messages) */}
        {!isEditing && !isUser && (
          <>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {/* Copy */}
              <ActionButton
                onClick={() => onCopy(message.content, message.id)}
                icon={copiedId === message.id ? Check : Copy}
                label={copiedId === message.id ? (isAr ? 'تم' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
                active={copiedId === message.id}
              />

              {/* Listen */}
              <ActionButton
                onClick={() => onSpeak(message.content)}
                icon={Volume2}
                label={isSpeaking ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'استمع' : 'Listen')}
                active={isSpeaking}
              />

              {/* Regenerate */}
              <ActionButton
                onClick={() => onRegenerate(message.id)}
                icon={RefreshCw}
                label={isAr ? 'إعادة' : 'Regenerate'}
              />

              {/* Continue */}
              <ActionButton
                onClick={() => onContinue(message.id)}
                icon={Play}
                label={isAr ? 'متابعة' : 'Continue'}
              />

              {/* Follow-up Options */}
              {message.metadata?.followUpOptions?.slice(0, 3).map((option) => (
                <ActionButton
                  key={option.id}
                  onClick={() => onFollowUp(message, option)}
                  icon={Zap}
                  label={option.label}
                  variant="primary"
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.slice(0, 6).map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => onQuickAction(action, message)}
                    className="group flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-700 dark:hover:text-sky-300 transition-all shadow-sm hover:shadow-md"
                  >
                    <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-500" />
                    {isAr ? action.labelAr : action.label}
                  </button>
                );
              })}
            </div>

            {/* Suggested Actions */}
            {message.metadata?.suggestedActions && message.metadata.suggestedActions.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" />
                  {isAr ? 'الخطوات التالية:' : 'Suggested next actions:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {message.metadata.suggestedActions.slice(0, 5).map((action) => {
                    const Icon = TOOL_ICONS[action.toolId] || Wand2;
                    return (
                      <button
                        key={action.id}
                        onClick={() => onActionClick(action)}
                        className="group flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-700 dark:hover:text-sky-300 transition-all shadow-sm hover:shadow-md"
                      >
                        <Icon className="h-4 w-4 text-slate-400 group-hover:text-sky-500" />
                        {action.label}
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-sky-400 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Edit button (user messages) */}
        {!isEditing && isUser && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <button
              onClick={() => onEditStart(message)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <Pencil className="h-3 w-3" />
              {isAr ? 'تعديل' : 'Edit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Action Button ───────────────────────────────────────────────────────────

function ActionButton({
  onClick,
  icon: Icon,
  label,
  active = false,
  variant = 'default',
}: {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  variant?: 'default' | 'primary';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : variant === 'primary'
            ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/30'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
      )}
    >
      <Icon className={cn('h-3.5 w-3.5', active && 'animate-pulse')} />
      {label}
    </button>
  );
}

// ─── Local Suggested Actions Generator ───────────────────────────────────────

function generateSuggestedActionsLocal(text: string, language: 'ar' | 'en'): SuggestedAction[] {
  const lower = text.toLowerCase();
  const actions: SuggestedAction[] = [];

  const has = (kw: string[]) => kw.some((k) => lower.includes(k));

  if (has(['ad', 'إعلان', 'facebook', 'google ads', 'instagram'])) {
    actions.push({ id: 'ad-copy', label: language === 'ar' ? 'إنشاء إعلانات' : 'Generate Ad Copy', description: '', toolId: 'ad-copy' });
  }
  if (has(['hook', 'عنوان', 'headline', 'title'])) {
    actions.push({ id: 'hooks', label: language === 'ar' ? 'إنشاء عناوين' : 'Generate Hooks', description: '', toolId: 'hooks' });
  }
  if (has(['persona', 'جمهور', 'audience', 'customer', 'عميل'])) {
    actions.push({ id: 'persona', label: language === 'ar' ? 'إنشاء شخصية' : 'Generate Persona', description: '', toolId: 'persona' });
  }
  if (has(['seo', 'كلمات مفتاحية', 'keyword', 'search'])) {
    actions.push({ id: 'seo', label: language === 'ar' ? 'تحسين SEO' : 'Generate SEO', description: '', toolId: 'seo' });
  }
  if (has(['plan', 'خطة', 'strategy', 'استراتيجية'])) {
    actions.push({ id: 'marketing-plan', label: language === 'ar' ? 'خطة تسويقية' : 'Marketing Plan', description: '', toolId: 'marketing-plan' });
  }
  if (has(['email', 'بريد', 'newsletter'])) {
    actions.push({ id: 'email', label: language === 'ar' ? 'إنشاء بريد' : 'Create Email', description: '', toolId: 'email' });
  }
  if (has(['landing', 'صفحة هبوط', 'صفحة'])) {
    actions.push({ id: 'landing-page', label: language === 'ar' ? 'صفحة هبوط' : 'Landing Page', description: '', toolId: 'landing-page' });
  }
  if (has(['social', 'وسائل التواصل', 'facebook', 'instagram', 'linkedin', 'tiktok'])) {
    actions.push({ id: 'social-media', label: language === 'ar' ? 'منشورات' : 'Social Posts', description: '', toolId: 'social-media' });
  }

  // Always suggest at least 3 actions
  if (actions.length < 3) {
    const defaults: SuggestedAction[] = [
      { id: 'hooks', label: language === 'ar' ? 'إنشاء عناوين' : 'Generate Hooks', description: '', toolId: 'hooks' },
      { id: 'ad-copy', label: language === 'ar' ? 'إنشاء إعلانات' : 'Generate Ad Copy', description: '', toolId: 'ad-copy' },
      { id: 'persona', label: language === 'ar' ? 'إنشاء شخصية' : 'Generate Persona', description: '', toolId: 'persona' },
    ];
    while (actions.length < 3 && defaults.length > 0) {
      const next = defaults.shift()!;
      if (!actions.find((a) => a.id === next.id)) {
        actions.push(next);
      }
    }
  }

  return actions.slice(0, 5);
}

function generateFollowUpOptionsLocal(language: 'ar' | 'en'): FollowUpOption[] {
  if (language === 'ar') {
    return [
      { id: 'short', label: 'اجعله أقصر', action: 'short' },
      { id: 'rewrite', label: 'إعادة كتابة', action: 'rewrite' },
      { id: 'persuasive', label: 'اجعله أكثر إقناعاً', action: 'persuasive' },
      { id: 'translate', label: 'ترجم للإنجليزية', action: 'translate' },
    ];
  }
  return [
    { id: 'short', label: 'Make it shorter', action: 'short' },
    { id: 'rewrite', label: 'Rewrite', action: 'rewrite' },
    { id: 'persuasive', label: 'Make it more persuasive', action: 'persuasive' },
    { id: 'translate', label: 'Translate to Arabic', action: 'translate' },
  ];
}
