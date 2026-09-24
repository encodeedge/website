import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  GitBranch,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Calendar,
  Clock,
  User,
  Tag,
  BookOpen,
  Copy,
  Check,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Code2,
} from 'lucide-react';

interface ParsedPost {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  readTime?: number;
  authorName?: string;
  authorImage?: string;
  image?: string;
  topics?: string[];
  tags?: string[];
  faqs?: Array<{ question: string; answer: string; category?: string }>;
  references?: Array<{ title: string; url: string; description?: string; type?: string }>;
  content: string;
}

export function KeystaticLivePreview() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branch, setBranch] = useState('master');
  const [toPath, setToPath] = useState('');
  const [post, setPost] = useState<ParsedPost | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Parse parameters from window location
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    let currentBranch = params.get('branch');
    if (!currentBranch) {
      const match = document.cookie.match(/ks-branch=([^;]+)/);
      if (match) currentBranch = decodeURIComponent(match[1]);
    }
    const targetBranch = currentBranch || 'master';
    setBranch(targetBranch);

    let to = params.get('to') || '';
    if (!to && params.get('slug')) {
      const collection = params.get('collection') || 'blog';
      to = `/${collection}/${params.get('slug')}`;
    }
    setToPath(to);

    fetchDraft(targetBranch, to);
  }, []);

  const fetchDraft = useCallback(async (activeBranch: string, targetPath: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Determine file paths to search in GitHub repo
      let slug = '';
      let candidates: string[] = [];

      const cleanPath = targetPath.replace(/^\/+/, '');
      const segments = cleanPath.split('/');

      if (segments[0] === 'blog') {
        slug = segments.slice(1).join('/');
        candidates = [
          `src/content/blog/${slug}.mdx`,
          `src/content/blog/${slug}.md`,
          `src/content/blog/${slug}/index.mdx`,
          `src/content/blog/${slug}/index.md`,
        ];
      } else if (segments[0] === 'courses') {
        slug = segments.slice(1).join('/');
        candidates = [
          `src/content/courses/${slug}.md`,
          `src/content/courses/${slug}.mdx`,
          `src/content/courses/${slug}/index.mdoc`,
          `src/content/courses/${slug}/about.md`,
        ];
      } else if (segments[0] === 'lessons') {
        slug = segments.slice(1).join('/');
        candidates = [
          `src/content/lessons/${slug}.md`,
          `src/content/lessons/${slug}.mdx`,
        ];
      } else {
        slug = cleanPath;
        candidates = [
          `src/content/blog/${slug}.mdx`,
          `src/content/blog/${slug}.md`,
          `src/content/lessons/${slug}.md`,
          `src/content/courses/${slug}.md`,
        ];
      }

      let rawText: string | null = null;
      let foundPath = '';

      // Try raw.githubusercontent.com first with cache-busting
      const timestamp = Date.now();
      for (const candidate of candidates) {
        try {
          const rawUrl = `https://raw.githubusercontent.com/encodeedge/website/${encodeURIComponent(activeBranch)}/${candidate}?_t=${timestamp}`;
          const res = await fetch(rawUrl);
          if (res.ok) {
            rawText = await res.text();
            foundPath = candidate;
            break;
          }
        } catch {
          // continue checking next candidate
        }
      }

      // Fallback: Use GitHub REST API if raw didn't resolve immediately
      if (!rawText) {
        for (const candidate of candidates) {
          try {
            const apiUrl = `https://api.github.com/repos/encodeedge/website/contents/${candidate}?ref=${encodeURIComponent(activeBranch)}`;
            const res = await fetch(apiUrl);
            if (res.ok) {
              const data = await res.json();
              if (data.content && data.encoding === 'base64') {
                rawText = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
                foundPath = candidate;
                break;
              }
            }
          } catch {
            // continue
          }
        }
      }

      if (!rawText) {
        throw new Error(
          `Could not locate draft content on GitHub branch "${activeBranch}". Looked in:\n` +
          candidates.map((c) => ` • ${c}`).join('\n') +
          `\n\nEnsure you have clicked "Save" in Keystatic so the changes are committed to GitHub.`
        );
      }

      // Parse YAML frontmatter and markdown body
      const parsed = parseMarkdownFile(rawText, slug);
      setPost(parsed);
      setLastSynced(new Date());
    } catch (err: any) {
      console.error('Preview fetch error:', err);
      setError(err.message || 'Failed to fetch preview draft from GitHub.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    fetchDraft(branch, toPath, true);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Determine Keystatic item URL for easy navigation back to editor
  const keystaticUrl = getKeystaticEditorUrl(branch, toPath);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Preview Top Bar Placeholder */}
        <div className="sticky top-0 z-50 bg-amber-500/10 dark:bg-amber-950/80 backdrop-blur-md border-b border-amber-500/30 px-4 py-2.5">
          <div className="container mx-auto max-w-5xl flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <Eye className="w-3.5 h-3.5" /> Connecting to GitHub Live Preview...
            </span>
            <span className="font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-950 dark:text-amber-300">
              {branch}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 max-w-md mx-auto text-center">
          <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          <h2 className="text-xl font-bold font-display">Loading Live Draft Preview</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Fetching unmerged draft content directly from branch <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs font-semibold">{branch}</code> on GitHub...
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Preview Top Bar */}
        <div className="sticky top-0 z-50 bg-amber-500/10 dark:bg-amber-950/80 backdrop-blur-md border-b border-amber-500/30 px-4 py-2.5">
          <div className="container mx-auto max-w-5xl flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-amber-950 dark:text-amber-200">Keystatic Live Preview</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-950 dark:text-amber-300 font-mono font-semibold flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {branch}
              </span>
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Exit Preview
            </a>
          </div>
        </div>

        <div className="flex-1 container mx-auto max-w-2xl px-4 py-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shadow-inner">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">Draft File Not Ready on GitHub</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto whitespace-pre-line leading-relaxed text-left bg-muted/60 p-4 rounded-xl border border-border/80 font-mono text-xs">
              {error}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <button
              onClick={handleRefresh}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 transition-all inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Retry Fetch
            </button>
            {keystaticUrl && (
              <a
                href={keystaticUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-all inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in Keystatic Editor
              </a>
            )}
            <a
              href="/"
              className="px-5 py-2.5 rounded-xl border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Sticky Live Preview Top Bar */}
      <header className="sticky top-0 z-50 bg-amber-500/15 dark:bg-amber-950/80 backdrop-blur-md border-b border-amber-500/30 px-4 py-2.5 shadow-sm">
        <div className="container mx-auto max-w-5xl flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Live Keystatic Preview
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-950 dark:text-amber-200 font-mono font-semibold flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              {branch}
            </span>
            {lastSynced && (
              <span className="text-[11px] text-amber-800/80 dark:text-amber-300/70 hidden sm:inline">
                • Synced {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-amber-200 font-bold transition-colors disabled:opacity-50"
              title="Re-fetch latest content saved in Keystatic from GitHub"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Updating...' : 'Refresh'}
            </button>

            {keystaticUrl && (
              <a
                href={keystaticUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-950 dark:text-amber-200 font-semibold hover:bg-amber-500/10 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Keystatic
              </a>
            )}

            <a
              href="/"
              className="px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-foreground font-semibold transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Exit
            </a>
          </div>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-16 space-y-10">
        {/* Article Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            {post.topics && post.topics.length > 0 ? (
              post.topics.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20"
                >
                  {t.replace(/-/g, ' ')}
                </span>
              ))
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                Draft Preview
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
              Unpublished Branch Draft
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground leading-[1.15]">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-base sm:text-xl text-muted-foreground font-body leading-relaxed max-w-3xl">
              {post.description}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-muted-foreground pt-2 border-b border-border/60 pb-6">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <User className="w-4 h-4 text-primary" />
              {post.authorName || 'Atul Jha'}
            </span>
            {post.pubDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {post.pubDate}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {post.readTime} min read
              </span>
            )}
          </div>
        </div>

        {/* Hero Image if provided */}
        {post.image && (
          <div className="rounded-2xl overflow-hidden border border-border/80 shadow-md">
            <img src={post.image} alt={post.title} className="w-full h-auto max-h-[480px] object-cover" />
          </div>
        )}

        {/* Rendered Markdown Body */}
        <article className="prose prose-lg dark:prose-invert max-w-none font-body leading-relaxed">
          <RenderMarkdownContent
            content={post.content}
            onCopyCode={handleCopyCode}
            copiedCodeId={copiedCodeId}
          />
        </article>

        {/* FAQs Section if present */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="pt-10 border-t border-border/60 space-y-4">
            <h2 className="text-2xl font-bold font-display">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {post.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border rounded-xl overflow-hidden transition-all bg-card"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left px-5 py-4 font-semibold text-sm flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* References Section if present */}
        {post.references && post.references.length > 0 && (
          <section className="pt-10 border-t border-border/60 space-y-4">
            <h2 className="text-2xl font-bold font-display">References & Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.references.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-border hover:border-primary/50 bg-card hover:bg-muted/30 transition-all group block space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-primary">
                      {ref.type || 'Resource'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{ref.title}</h4>
                  {ref.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{ref.description}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------
// Helper: Convert raw Markdown + Keystatic MDX blocks to JSX
// ---------------------------------------------------------
function RenderMarkdownContent({
  content,
  onCopyCode,
  copiedCodeId,
}: {
  content: string;
  onCopyCode: (code: string, id: string) => void;
  copiedCodeId: string | null;
}) {
  // Split content by blocks and parse
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          const TagName = `h${block.level}` as keyof JSX.IntrinsicElements;
          const headingClasses: Record<number, string> = {
            1: 'text-3xl font-bold font-display tracking-tight mt-8 mb-4 text-foreground',
            2: 'text-2xl font-bold font-display tracking-tight mt-8 mb-4 text-foreground border-b border-border/40 pb-2',
            3: 'text-xl font-bold font-display mt-6 mb-3 text-foreground',
            4: 'text-lg font-bold font-display mt-4 mb-2 text-foreground',
          };
          return (
            <TagName key={idx} className={headingClasses[block.level] || headingClasses[3]}>
              {block.text}
            </TagName>
          );
        }

        if (block.type === 'callout') {
          const kindStyles: Record<string, { border: string; bg: string; icon: any; title: string }> = {
            info: {
              border: 'border-blue-500/40',
              bg: 'bg-blue-500/5 text-blue-950 dark:text-blue-200',
              icon: Info,
              title: block.title || 'Note',
            },
            tip: {
              border: 'border-emerald-500/40',
              bg: 'bg-emerald-500/5 text-emerald-950 dark:text-emerald-200',
              icon: CheckCircle2,
              title: block.title || 'Tip',
            },
            warning: {
              border: 'border-amber-500/40',
              bg: 'bg-amber-500/5 text-amber-950 dark:text-amber-200',
              icon: AlertTriangle,
              title: block.title || 'Warning',
            },
            danger: {
              border: 'border-red-500/40',
              bg: 'bg-red-500/5 text-red-950 dark:text-red-200',
              icon: XCircle,
              title: block.title || 'Danger',
            },
          };
          const style = kindStyles[block.kind || 'info'] || kindStyles.info;
          const IconComp = style.icon;
          return (
            <div
              key={idx}
              className={`my-6 p-4 rounded-xl border ${style.border} ${style.bg} space-y-2`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <IconComp className="w-4 h-4 shrink-0" />
                <span>{style.title}</span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line pl-6">
                {block.text}
              </div>
            </div>
          );
        }

        if (block.type === 'codesnippet') {
          const codeId = `snippet-${idx}`;
          const isCopied = copiedCodeId === codeId;
          return (
            <div
              key={idx}
              className="my-6 rounded-xl overflow-hidden border border-border/80 bg-neutral-950 text-neutral-200 shadow-md"
            >
              <div className="px-4 py-2 bg-neutral-900 border-b border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>{block.filename || block.language || 'code'}</span>
                <button
                  onClick={() => onCopyCode(block.code, codeId)}
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        if (block.type === 'codesandbox') {
          return (
            <div
              key={idx}
              className="my-6 p-5 rounded-2xl border border-primary/30 bg-primary/5 flex items-center justify-between flex-wrap gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  Interactive Lab
                </span>
                <div className="font-bold text-sm text-foreground">{block.title || 'Code Sandbox'}</div>
                <div className="text-xs text-muted-foreground">Category: {block.category || 'Python'}</div>
              </div>
              <span className="text-xs font-semibold text-primary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Code2 className="w-4 h-4" /> Live Runner Active in Publish
              </span>
            </div>
          );
        }

        if (block.type === 'codeblock') {
          const codeId = `block-${idx}`;
          const isCopied = copiedCodeId === codeId;
          return (
            <div
              key={idx}
              className="my-6 rounded-xl overflow-hidden border border-border/80 bg-neutral-950 text-neutral-200 shadow-md"
            >
              {block.language && (
                <div className="px-4 py-2 bg-neutral-900 border-b border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>{block.language}</span>
                  <button
                    onClick={() => onCopyCode(block.code, codeId)}
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="list-disc pl-6 space-y-1 text-base text-foreground/90 my-4">
              {block.items.map((item: string, i: number) => (
                <li key={i}>{formatInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote
              key={idx}
              className="my-6 pl-4 border-l-4 border-primary/50 italic text-muted-foreground text-base"
            >
              {formatInlineMarkdown(block.text)}
            </blockquote>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-base sm:text-lg text-foreground/90 font-body leading-relaxed my-4">
            {formatInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------
// Helper: Parse frontmatter and content from raw markdown
// ---------------------------------------------------------
function parseMarkdownFile(raw: string, slug: string): ParsedPost {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      title: slug || 'Preview Document',
      description: '',
      pubDate: new Date().toISOString().split('T')[0],
      content: raw,
    };
  }

  const yaml = match[1];
  const content = match[2];
  const data: Record<string, any> = {};

  let currentKey = '';
  let inArray = false;

  yaml.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.startsWith('- ') && inArray && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(trimmed.slice(2).trim().replace(/^["']|["']$/g, ''));
      return;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      const rawVal = line.slice(colonIdx + 1).trim();
      currentKey = key;

      if (rawVal === '' || rawVal === '[]') {
        inArray = true;
        data[key] = [];
      } else {
        inArray = false;
        let val: any = rawVal.replace(/^["']|["']$/g, '');
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (!isNaN(Number(val)) && val !== '') val = Number(val);
        data[key] = val;
      }
    }
  });

  return {
    title: data.title || slug || 'Preview Document',
    description: data.description || '',
    pubDate: data.pubDate ? String(data.pubDate) : new Date().toISOString().split('T')[0],
    updatedDate: data.updatedDate ? String(data.updatedDate) : undefined,
    readTime: data.readTime || 5,
    authorName: data.authorName || 'Atul Jha',
    authorImage: data.authorImage,
    image: data.image,
    topics: Array.isArray(data.topics) ? data.topics : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    faqs: Array.isArray(data.faqs) ? data.faqs : [],
    references: Array.isArray(data.references) ? data.references : [],
    content: content.trim(),
  };
}

// ---------------------------------------------------------
// Helper: Parse markdown content into structured block elements
// ---------------------------------------------------------
function parseMarkdownBlocks(text: string) {
  const blocks: any[] = [];
  const lines = text.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Callout block: <Callout kind="...">...</Callout>
    if (trimmed.startsWith('<Callout')) {
      const kindMatch = trimmed.match(/kind="([^"]*)"/);
      const titleMatch = trimmed.match(/title="([^"]*)"/);
      const kind = kindMatch ? kindMatch[1] : 'info';
      const title = titleMatch ? titleMatch[1] : '';

      let body = '';
      i++;
      while (i < lines.length && !lines[i].includes('</Callout>')) {
        body += lines[i] + '\n';
        i++;
      }
      i++; // skip </Callout>
      blocks.push({ type: 'callout', kind, title, text: body.trim() });
      continue;
    }

    // CodeSnippet block: <CodeSnippet ... />
    if (trimmed.startsWith('<CodeSnippet')) {
      const langMatch = trimmed.match(/language="([^"]*)"/);
      const fileMatch = trimmed.match(/filename="([^"]*)"/);
      const codeMatch = trimmed.match(/code="([^"]*)"/);
      blocks.push({
        type: 'codesnippet',
        language: langMatch ? langMatch[1] : 'python',
        filename: fileMatch ? fileMatch[1] : '',
        code: codeMatch ? codeMatch[1].replace(/\\n/g, '\n') : '',
      });
      i++;
      continue;
    }

    // CodeSandbox block: <CodeSandbox ... />
    if (trimmed.startsWith('<CodeSandbox')) {
      const titleMatch = trimmed.match(/title="([^"]*)"/);
      const catMatch = trimmed.match(/category="([^"]*)"/);
      blocks.push({
        type: 'codesandbox',
        title: titleMatch ? titleMatch[1] : 'Code Sandbox',
        category: catMatch ? catMatch[1] : 'Python',
      });
      i++;
      continue;
    }

    // Fenced Code Block: ```lang
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      let code = '';
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'codeblock', language, code: code.trimEnd() });
      continue;
    }

    // Headings: #, ##, ###
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      i++;
      continue;
    }

    // Blockquote: > text
    if (trimmed.startsWith('>')) {
      let quoteText = trimmed.replace(/^>\s*/, '');
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteText += ' ' + lines[i].trim().replace(/^>\s*/, '');
        i++;
      }
      blocks.push({ type: 'blockquote', text: quoteText });
      continue;
    }

    // Unordered list: - item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Regular paragraph
    let para = trimmed;
    i++;
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('<') && !lines[i].trim().startsWith('```') && !lines[i].trim().startsWith('- ')) {
      para += ' ' + lines[i].trim();
      i++;
    }
    blocks.push({ type: 'paragraph', text: para });
  }

  return blocks;
}

// ---------------------------------------------------------
// Helper: Format inline bold, italic, code, links
// ---------------------------------------------------------
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining) {
    // Inline code: `code`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    // Link: [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Find first match among them
    const matches = [
      codeMatch ? { type: 'code', index: codeMatch.index!, full: codeMatch[0], content: codeMatch[1] } : null,
      boldMatch ? { type: 'bold', index: boldMatch.index!, full: boldMatch[0], content: boldMatch[1] } : null,
      linkMatch ? { type: 'link', index: linkMatch.index!, full: linkMatch[0], content: linkMatch[1], href: linkMatch[2] } : null,
    ].filter(Boolean).sort((a: any, b: any) => a.index - b.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const first: any = matches[0];
    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index));
    }

    if (first.type === 'code') {
      parts.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs font-semibold text-primary"
        >
          {first.content}
        </code>
      );
    } else if (first.type === 'bold') {
      parts.push(<strong key={keyIdx++} className="font-bold">{first.content}</strong>);
    } else if (first.type === 'link') {
      parts.push(
        <a
          key={keyIdx++}
          href={first.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {first.content}
        </a>
      );
    }

    remaining = remaining.slice(first.index + first.full.length);
  }

  return <>{parts}</>;
}

function getKeystaticEditorUrl(branch: string, toPath: string): string | null {
  const clean = toPath.replace(/^\/+/, '');
  const segments = clean.split('/');
  if (segments.length >= 2) {
    const collection = segments[0] === 'blog' ? 'blogs' : segments[0];
    const slug = segments.slice(1).join('/');
    return `https://www.login.encodeedge.com/keystatic/branch/${encodeURIComponent(branch)}/collection/${collection}/item/${encodeURIComponent(slug)}`;
  }
  return null;
}

