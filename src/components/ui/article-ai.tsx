import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ArticleAIProps {
  articleTitle: string;
  articleDescription: string;
  articleExcerpt?: string;
}

// ─── Gemini free tier (set PUBLIC_GEMINI_API_KEY in .env) ────────────────────
function getApiKey(): string {
  try {
    return (import.meta as any).env?.PUBLIC_GEMINI_API_KEY || '';
  } catch {
    return '';
  }
}

async function askGemini(question: string, context: string, history: Message[]): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    await new Promise(r => setTimeout(r, 500));
    return (
      `I'd love to answer that! The AI needs a free Gemini API key to work. ` +
      `Get one at aistudio.google.com/app/apikey and add ` +
      `PUBLIC_GEMINI_API_KEY=your_key to your .env file.\n\n` +
      `Meanwhile, the article above likely covers "${question}" — it's a great resource!`
    );
  }

  const systemInstruction =
    `You are a helpful AI tutor for the article "${context}". ` +
    `Answer questions concisely (under 120 words). Keep it conversational, no markdown headers.`;

  const conversationHistory = history.slice(-6).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [...conversationHistory, { role: 'user', parts: [{ text: question }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
      }),
    }
  );
  if (!response.ok) throw new Error(`${response.status}`);
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";
}

const STARTERS = [
  'What is the main concept here?',
  'Give me a real-world example',
  'What should I learn next?',
  'Summarize the key takeaways',
];

// ─── Chat Panel (portaled to body) ───────────────────────────────────────────
const ChatPanel = ({
  articleTitle,
  context,
  onClose,
}: {
  articleTitle: string;
  context: string;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi! I'm your AI tutor for "${articleTitle}". Ask me anything about this topic! 🧠` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setError('');
    const userMsg: Message = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const reply = await askGemini(q, context, [...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setError('Failed to get a response. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([{ role: 'assistant', content: `Hi! I'm your AI tutor for "${articleTitle}". Ask me anything! 🧠` }]);
    setInput('');
    setError('');
  };

  return createPortal(
    <div className="fixed inset-0 z-[10020] pointer-events-none flex items-end justify-end p-4 sm:p-6">
      <div
        className="w-full max-w-sm bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ height: 'min(520px, 85vh)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-violet-500/10 to-purple-500/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-violet-500/15">
              <Bot className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">AI Tutor</div>
              <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">{articleTitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={reset} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Reset">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-violet-500" />
                </div>
              )}
              <div className={`max-w-[82%] text-xs leading-relaxed px-3 py-2.5 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted text-foreground rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-violet-500/15 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-violet-500" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                <span className="text-xs text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Starter suggestions */}
        {messages.length === 1 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
            {STARTERS.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 py-3 border-t border-border shrink-0">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 text-xs px-3 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-50 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[9px] text-muted-foreground/60 text-center mt-1.5">
            {getApiKey() ? 'Powered by Gemini · Free tier' : 'Set PUBLIC_GEMINI_API_KEY to enable AI'}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ─── Exported component — renders a FIXED floating pill (always visible) ─────
export const ArticleAI = ({ articleTitle, articleDescription, articleExcerpt }: ArticleAIProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render after hydration (avoid SSR mismatch)
  useEffect(() => { setMounted(true); }, []);

  const context = `${articleTitle}. ${articleDescription}${articleExcerpt ? ` ${articleExcerpt.slice(0, 500)}` : ''}`;

  if (!mounted) return null;

  return (
    <>
      {/* Fixed floating pill — bottom-right, above scroll-to-top button */}
      {!open && createPortal(
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-6 z-[9985] flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-xl hover:shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Ask AI about this article"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI</span>
          <Sparkles className="w-3.5 h-3.5 opacity-70" />
        </button>,
        document.body
      )}

      {/* Chat panel */}
      {open && (
        <ChatPanel
          articleTitle={articleTitle}
          context={context}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ArticleAI;
