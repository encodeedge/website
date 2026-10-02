import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Link as LinkIcon,
  Globe,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Sliders,
  X,
  FileCode,
  Copy,
  Check,
  Lock,
  LogOut,
  Github,
  UserCheck
} from 'lucide-react';

interface AiBlogGeneratorProps {
  isStandalone?: boolean;
}

export default function AiBlogGeneratorModal({ isStandalone = false }: AiBlogGeneratorProps) {
  const [isOpen, setIsOpen] = useState(isStandalone);
  const [urls, setUrls] = useState('');
  const [topic, setTopic] = useState('machine-learning');
  const [tone, setTone] = useState<'engineer' | 'tutorial' | 'architecture'>('engineer');
  const [model, setModel] = useState('@cf/meta/llama-3.3-70b-instruct');
  const [targetBranch, setTargetBranch] = useState('drafts/ai-articles');
  const [commitToGit, setCommitToGit] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');

  // Authentication State
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ login: string; avatar_url: string; name?: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isStandalone) {
      setIsOpen(true);
    }
  }, [isStandalone]);

  // Check Keystatic GitHub authentication cookie
  useEffect(() => {
    const checkGitHubAuth = async () => {
      setAuthChecking(true);
      try {
        const isLocalHost = typeof window !== 'undefined' && (
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.endsWith('.app.github.dev')
        );

        const cookieMatch = typeof document !== 'undefined'
          ? document.cookie.match(/(^|;\s*)keystatic-gh-access-token=([^;]*)/)
          : null;
        const token = cookieMatch ? decodeURIComponent(cookieMatch[2]) : null;

        if (token) {
          const res = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json',
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
            setIsAuthenticated(true);
            setAuthChecking(false);
            return;
          }
        }

        // If local dev environment without cookie, allow access for development
        if (isLocalHost && !token) {
          setIsAuthenticated(true);
          setUserProfile({ login: 'developer (local)', avatar_url: 'https://github.com/github.png' });
          setAuthChecking(false);
          return;
        }

        setIsAuthenticated(false);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    };

    checkGitHubAuth();
  }, []);

  const handleGitHubLogin = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('return_to_ai_generator', 'true');
      window.location.href = '/api/keystatic/github/login';
    }
  };

  const handleSignOut = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'keystatic-gh-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.reload();
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const urlList = urls
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) {
      setError('Please provide at least one valid article or documentation URL.');
      return;
    }

    setLoading(true);
    setCurrentStep('1/4 Scraping source content and stripping ads/navigation...');

    try {
      const stepTimer1 = setTimeout(() => {
        setCurrentStep('2/4 Formulating deep technical guide & cross-verifying concepts...');
      }, 4000);

      const stepTimer2 = setTimeout(() => {
        setCurrentStep('3/4 Synthesizing comprehensive MDX with diagrams & code benchmarks...');
      }, 10000);

      const stepTimer3 = setTimeout(() => {
        setCurrentStep('4/4 Building SEO JSON-LD schema & saving in draft mode...');
      }, 18000);

      const response = await fetch('/api/ai/synthesize-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: urlList,
          topic,
          tone,
          model,
          targetBranch: commitToGit ? targetBranch : undefined,
          autoSave: true,
          customInstructions,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { error: responseText || `Server returned error (${response.status})` };
      }

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Authentication expired. Please sign in with GitHub again.');
        }
        throw new Error(data.error || `Failed to synthesize blog post (${response.status}).`);
      }

      setResult(data);
      setCurrentStep('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during AI synthesis.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button for Keystatic Admin */}
      {!isStandalone && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-medium shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-indigo-400/30 backdrop-blur-md"
            title="Create a new draft article from URLs"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Generate AI Draft</span>
            <span className="text-xs bg-indigo-900/60 px-2 py-0.5 rounded-full border border-indigo-300/20 text-indigo-200">
              Drafts Safe
            </span>
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className={
            isStandalone
              ? 'w-full max-w-4xl mx-auto'
              : 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn'
          }
        >
          <div
            className={
              isStandalone
                ? 'bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden text-zinc-100'
                : 'bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden text-zinc-100 max-h-[92vh] flex flex-col my-auto'
            }
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    AI Blog Post Synthesizer
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Draft State Only
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Transform reference URLs into original, manual-grade technical articles with full SEO
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* User badge if authenticated */}
                {isAuthenticated && userProfile && (
                  <div className="hidden sm:flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 px-2.5 py-1 rounded-full text-xs">
                    <img
                      src={userProfile.avatar_url}
                      alt={userProfile.login}
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="text-zinc-200 font-mono text-[11px]">@{userProfile.login}</span>
                    <button
                      onClick={handleSignOut}
                      title="Sign out from GitHub"
                      className="text-zinc-400 hover:text-red-400 transition-colors ml-1"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {!isStandalone && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* AUTHENTICATION GATE */}
              {authChecking ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  <span className="text-xs">Verifying GitHub session...</span>
                </div>
              ) : !isAuthenticated ? (
                <div className="py-12 px-6 flex flex-col items-center text-center max-w-md mx-auto space-y-5 animate-fadeIn">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 shadow-xl">
                      <Github className="w-8 h-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500 text-black">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-white">GitHub Authentication Required</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      The AI Draft Studio is protected and requires an authorized GitHub login (the same account you use for the Keystatic Admin portal).
                    </p>
                  </div>

                  <button
                    onClick={handleGitHubLogin}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-sm shadow-xl hover:shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Github className="w-4 h-4 text-zinc-900" />
                    <span>Sign in with GitHub</span>
                  </button>

                  <p className="text-[11px] text-zinc-500">
                    Signing in grants secure draft generation and private branch commit capabilities.
                  </p>
                </div>
              ) : (
                <>
                  {/* Draft & Branch Safety Notice */}
                  <div className="p-3.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex items-start gap-3 text-xs text-zinc-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">Safe Draft Protection Active</strong>
                      Generated articles are created strictly with <code className="text-emerald-400 font-mono">draft: true</code> or committed to a private branch. They will <strong>never</strong> appear on the public website until you review and publish them.
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleGenerate} className="space-y-5">
                    {/* URLs input */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                        Reference Blog / Documentation URLs *
                      </label>
                      <textarea
                        rows={3}
                        value={urls}
                        onChange={(e) => setUrls(e.target.value)}
                        placeholder="https://pytorch.org/blog/...\nhttps://arxiv.org/html/...\nhttps://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-mono text-zinc-200 placeholder-zinc-500 transition-colors"
                        required
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Enter one or more URLs (separated by newlines). The AI will synthesize and cross-verify insights from all sources.
                      </p>
                    </div>

                    {/* Grid settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Topic */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          Topic Category
                        </label>
                        <select
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="machine-learning">Machine Learning</option>
                          <option value="deep-learning">Deep Learning</option>
                          <option value="python">Python Engineering</option>
                          <option value="nlp">Natural Language Processing</option>
                          <option value="system-design">System Design & AI Infra</option>
                        </select>
                      </div>

                      {/* Writing Tone */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                          Writing Tone
                        </label>
                        <select
                          value={tone}
                          onChange={(e) => setTone(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="engineer">Senior Staff Engineer (rigorous, code-first)</option>
                          <option value="tutorial">Pragmatic Tutorial (step-by-step with visuals)</option>
                          <option value="architecture">Architecture Deep Dive (system mechanics)</option>
                        </select>
                      </div>
                    </div>

                    {/* AI Model & Free Tier info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-indigo-400" />
                          AI Model (Free Tiers Supported)
                        </label>
                        <select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="@cf/meta/llama-3.3-70b-instruct">
                            Cloudflare Workers AI: Llama 3.3 70B (Free)
                          </option>
                          <option value="@cf/deepseek-ai/deepseek-r1-distill-qwen-32b">
                            Cloudflare Workers AI: DeepSeek R1 32B (Free)
                          </option>
                          <option value="gemini-2.5-flash">
                            Google Gemini 2.5 Flash (Generous Free Tier)
                          </option>
                        </select>
                      </div>

                      {/* Target Branch options */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                          Storage & Git Safety
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={commitToGit}
                              onChange={(e) => setCommitToGit(e.target.checked)}
                              className="rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Push to Private Git Branch (off main)</span>
                          </label>
                          {commitToGit ? (
                            <input
                              type="text"
                              value={targetBranch}
                              onChange={(e) => setTargetBranch(e.target.value)}
                              placeholder="drafts/ai-articles"
                              className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-mono text-zinc-200"
                            />
                          ) : (
                            <p className="text-[11px] text-zinc-500">
                              Articles will be generated in draft state (<code className="text-emerald-400 font-mono">draft: true</code>).
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Custom Directives */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        Specific Directives (Optional)
                      </label>
                      <input
                        type="text"
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="e.g. Focus on memory bottlenecks, provide PyTorch code, include an ASCII architectural diagram"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-200 placeholder-zinc-500 focus:border-indigo-500"
                      />
                    </div>

                    {/* Error Banner */}
                    {error && (
                      <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-medium">Generation Failed</strong>
                          <span>{error}</span>
                        </div>
                      </div>
                    )}

                    {/* Progress / Spinner */}
                    {loading && (
                      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
                        <div className="text-xs">
                          <div className="font-medium text-indigo-200">{currentStep}</div>
                          <div className="text-zinc-400 text-[11px] mt-0.5">
                            Please hold on—fetching URLs and performing multi-pass synthesis...
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Synthesizing Authentic Draft...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Generate AI Draft Article</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Result Preview Box */}
                  {result && (
                    <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Article Synthesized Successfully!</span>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                          draft: true
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-base font-semibold text-white">
                          {result.article?.title || 'Synthesized Article'}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {result.article?.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 pt-1">
                          <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                            Slug: <code className="font-mono text-indigo-300">{result.slug}</code>
                          </span>
                          <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                            Read Time: {result.article?.readTime || 12} min
                          </span>
                          <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                            Storage: {result.saveStatus}
                          </span>
                        </div>
                      </div>

                      {/* SEO Metadata Card */}
                      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs space-y-1.5 text-zinc-300">
                        <div className="font-medium text-indigo-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Automated SEO Metadata Injected:
                        </div>
                        <div>
                          <span className="text-zinc-500">SEO Title:</span> {result.article?.seoTitle || result.article?.title}
                        </div>
                        <div>
                          <span className="text-zinc-500">Meta Description:</span> {result.article?.seoDescription || result.article?.description}
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(result.article?.tags || []).map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a
                          href={`/keystatic/collection/blogs/item/${result.slug}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow"
                          target={isStandalone ? '_self' : '_blank'}
                          rel="noreferrer"
                        >
                          <span>Open in Keystatic Editor</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleCopy(result.formattedMdx)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied MDX' : 'Copy MDX'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
