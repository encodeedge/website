import React, { useEffect, useRef, useState, useCallback } from "react";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostComments from "@/components/ui/PostComments.tsx";
import { slugify } from "@/utils/slugs";
import FAQs from "@/components/blocks/faqs";
import References from "@/components/blocks/references";
import { TOPIC_METADATA } from "@/lib/topics";
import { ArticleAI } from "@/components/ui/article-ai";
import {
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Share2,
  Copy,
  Check,
  Printer,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Map,
  BookOpen,
  ArrowUp,
  Type,
  FileText,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronUp,
  Flame,
  Lightbulb,
  Target,
  Heart,
  MessageCircle,
  Eye,
  Hash,
  Link2,
} from "lucide-react";

interface PostData {
  title: string;
  description: string;
  pubDate: Date | string;
  updatedDate?: Date | string;
  readTime?: number;
  image?: string;
  authorImage?: string;
  authorName?: string;
  faqs?: { question: string; answer: string; category?: string }[];
  references?: {
    title: string;
    url: string;
    description?: string;
    type?: string;
    affiliate?: string;
    image?: string;
  }[];
  topics?: string[];
  tags?: string[];
  featured?: boolean;
}

interface BlogPostProps {
  post: {
    id: string;
    data: PostData;
    [key: string]: any;
  };
  children: React.ReactNode;
  featured?: Array<any>;
  prevPost?: any;
  nextPost?: any;
  relatedPosts?: Array<any>;
  enableAI?: boolean;
}

const formatSlug = (slug: string) => {
  if (TOPIC_METADATA[slug]) {
    return TOPIC_METADATA[slug].label;
  }
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

const normalizeTagSlug = (tag: string) =>
  tag.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, "");

// Reaction definitions
const REACTIONS = [
  { key: "insightful", emoji: "🔥", label: "Insightful" },
  { key: "helpful", emoji: "💡", label: "Helpful" },
  { key: "practical", emoji: "🎯", label: "Practical" },
  { key: "well-written", emoji: "👏", label: "Well Written" },
] as const;

const BlogPost: React.FC<BlogPostProps> = ({
  post,
  children,
  featured,
  prevPost,
  nextPost,
  relatedPosts,
  enableAI = true,
}) => {
  const {
    title,
    authorName = "Atul Jha",
    image,
    pubDate,
    updatedDate,
    description,
    authorImage,
    topics = [],
    tags = [],
    faqs = [],
    references = [],
    readTime = 6,
    featured: isFeatured,
  } = post.data;

  const contentRef = useRef<HTMLElement | null>(null);
  const tocListRef = useRef<HTMLUListElement | null>(null);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showFloatingBar, setShowFloatingBar] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkToast, setBookmarkToast] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [minutesLeft, setMinutesLeft] = useState<number>(readTime);

  // Text highlight state
  const [selectionPopover, setSelectionPopover] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [showHighlights, setShowHighlights] = useState(false);

  // Reactions state
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  const primaryTopic = topics[0] || "machine-learning";
  const topicMeta = TOPIC_METADATA[primaryTopic];
  const roadmapSlug = topicMeta?.roadmapSlug;

  const localSlugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const getInitials = (t?: string) => {
    if (!t) return "E";
    return t
      .split(" ")
      .slice(0, 2)
      .map((s) => (s && s.length ? s.charAt(0) : ""))
      .join("");
  };

  const estimatedWordCount = Math.max(readTime * 220, 600);

  // Load bookmark and reactions on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("encodeedge_blog_bookmarks");
      if (saved) {
        const list = JSON.parse(saved);
        setIsBookmarked(list.includes(post.id));
      }
    } catch (e) {}

    // Load reactions
    try {
      const savedReactions = localStorage.getItem(`blog_reactions_${post.id}`);
      if (savedReactions) setReactions(JSON.parse(savedReactions));
      const savedUserReactions = localStorage.getItem(`blog_user_reactions_${post.id}`);
      if (savedUserReactions) setUserReactions(new Set(JSON.parse(savedUserReactions)));
    } catch (e) {}

    // Load highlights
    try {
      const savedHighlights = localStorage.getItem(`blog_highlights_${post.id}`);
      if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
    } catch (e) {}
  }, [post.id]);

  const handleToggleBookmark = () => {
    try {
      const saved = localStorage.getItem("encodeedge_blog_bookmarks");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(post.id)) {
        list = list.filter((id) => id !== post.id);
        setIsBookmarked(false);
      } else {
        list = [...list, post.id];
        setIsBookmarked(true);
        setBookmarkToast(true);
        setTimeout(() => setBookmarkToast(false), 2500);
      }
      localStorage.setItem("encodeedge_blog_bookmarks", JSON.stringify(list));
    } catch (e) {}
  };

  const handleReaction = (key: string) => {
    const newUserReactions = new Set(userReactions);
    const newReactions = { ...reactions };

    if (newUserReactions.has(key)) {
      newUserReactions.delete(key);
      newReactions[key] = Math.max(0, (newReactions[key] || 1) - 1);
    } else {
      newUserReactions.add(key);
      newReactions[key] = (newReactions[key] || 0) + 1;
    }

    setUserReactions(newUserReactions);
    setReactions(newReactions);
    try {
      localStorage.setItem(`blog_reactions_${post.id}`, JSON.stringify(newReactions));
      localStorage.setItem(`blog_user_reactions_${post.id}`, JSON.stringify([...newUserReactions]));
    } catch (e) {}
  };

  const addHighlight = useCallback(
    (text: string) => {
      const newHighlights = [...highlights, text];
      setHighlights(newHighlights);
      try {
        localStorage.setItem(`blog_highlights_${post.id}`, JSON.stringify(newHighlights));
      } catch (e) {}
      setSelectionPopover(null);
      window.getSelection()?.removeAllRanges();
    },
    [highlights, post.id]
  );

  const removeHighlight = (index: number) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights);
    try {
      localStorage.setItem(`blog_highlights_${post.id}`, JSON.stringify(newHighlights));
    } catch (e) {}
  };

  // Extract headings and add copy buttons to code blocks
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const nodes = Array.from(el.querySelectorAll("h2, h3")) as HTMLElement[];
    const items = nodes.map((node) => {
      let id = node.id;
      if (!id) {
        id = localSlugify(node.textContent || "section");
        node.id = id;
      }
      const level = parseInt(node.tagName.substring(1));
      return { id, text: node.textContent || "", level };
    });
    setHeadings(items);

    // Code copy buttons
    const preNodes = el.querySelectorAll("pre");
    preNodes.forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return;
      const btn = document.createElement("button");
      btn.className =
        "code-copy-btn absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-sm border border-white/10";
      btn.textContent = "Copy";
      btn.onclick = () => {
        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        navigator.clipboard.writeText(code);
        btn.textContent = "Copied!";
        btn.classList.add("bg-emerald-500/30", "text-emerald-200");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("bg-emerald-500/30", "text-emerald-200");
        }, 2000);
      };
      pre.classList.add("relative", "group");
      pre.appendChild(btn);
    });
  }, [children]);

  // Text selection handler for highlight feature
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      if (
        selectedText &&
        selectedText.length > 5 &&
        contentRef.current?.contains(selection?.anchorNode || null)
      ) {
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          setSelectionPopover({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            text: selectedText,
          });
        }
      } else {
        setTimeout(() => setSelectionPopover(null), 200);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 600);
      setShowFloatingBar(scrollTop > 500);

      // Estimate minutes left
      const remaining = Math.max(0, Math.ceil(readTime * (1 - scrollPercent / 100)));
      setMinutesLeft(remaining);

      // Active heading tracking
      const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
      if (headingElements.length === 0) return;

      let active = headings[0]?.id || "";
      for (const heading of headingElements) {
        if (!heading) continue;
        const rect = heading.getBoundingClientRect();
        if (rect.top < window.innerHeight / 3) {
          active = heading.id;
        }
      }
      setActiveId(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings, readTime]);

  // Auto-scroll TOC container so active link is always centered and more items display as user scrolls
  useEffect(() => {
    if (!activeId || !tocListRef.current) return;
    const container = tocListRef.current;
    if (headings.length > 0 && activeId === headings[0].id) {
      container.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const activeEl = container.querySelector(`a[href="#${activeId}"]`) as HTMLElement | null;
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const linkRect = activeEl.getBoundingClientRect();
      const targetScroll = container.scrollTop + (linkRect.top - containerRect.top) - (containerRect.height / 2) + (linkRect.height / 2);
      container.scrollTo({ top: Math.max(0, Math.round(targetScroll)), behavior: "smooth" });
    }
  }, [activeId, headings]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const currentTitle = encodeURIComponent(title);

  const fontSizeClass =
    fontSize === "sm"
      ? "prose-sm sm:prose-base leading-relaxed"
      : fontSize === "lg"
      ? "prose-lg sm:prose-xl leading-loose"
      : "prose-base sm:prose-lg leading-relaxed";

  // SVG for progress ring on scroll-to-top button
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <article className="relative w-full">
      {/* 1. Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-black-100 dark:bg-black-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#3533cd] via-[#6366f1] to-[#a78bfa] dark:from-[#E5E795] dark:via-[#a3e635] dark:to-[#E5E795] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Breadcrumbs */}
      <nav className="woords_container_small mb-4 pt-2 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <span className="text-muted-foreground/40">/</span>
            <a href="/blog/" className="hover:text-foreground transition-colors">
              Articles
            </a>
            {primaryTopic && (
              <>
                <span className="text-muted-foreground/40">/</span>
                <a
                  href={`/topics/${primaryTopic}/`}
                  className="hover:text-foreground transition-colors font-medium text-foreground truncate max-w-[160px]"
                >
                  {formatSlug(primaryTopic)}
                </a>
              </>
            )}
          </div>

          <a
            href="/blog/"
            className="inline-flex items-center gap-1.5 font-semibold hover:text-foreground text-primary transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>All articles</span>
          </a>
        </div>
      </nav>

      {/* 3. Immersive Hero Section */}
      {image ? (
        <div className="woords_container_small mb-10">
          <div className="relative rounded-3xl overflow-hidden border border-black-100 dark:border-black-800 shadow-lg">
            {/* Hero Image */}
            <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full overflow-hidden">
              <img
                src={image}
                alt={`Hero visual for ${title}`}
                className="h-full w-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content Overlaid on Hero */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {isFeatured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E5E795] text-black shadow-sm">
                      ★ Featured
                    </span>
                  )}
                  {topics.slice(0, 2).map((topic) => {
                    const meta = TOPIC_METADATA[topic];
                    return (
                      <a
                        key={topic}
                        href={`/topics/${topic}/`}
                        className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-transform hover:scale-105"
                        style={{
                          backgroundColor: `${meta?.color || "#FDA4AF"}cc`,
                          color: "#000",
                        }}
                      >
                        {formatSlug(topic)}
                      </a>
                    );
                  })}
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/15 backdrop-blur-md text-white flex items-center gap-1">
                    <Clock className="size-3" />
                    {readTime} min read
                  </span>
                </div>

                {/* Title on Hero */}
                <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] max-w-4xl drop-shadow-lg">
                  {title}
                </h1>

                {/* Description */}
                {description && (
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl mt-2.5 drop-shadow-md hidden sm:block">
                    {description}
                  </p>
                )}

                {/* Author & Date on Hero */}
                <div className="flex items-center gap-3 mt-4">
                  <Avatar className="size-9 border-2 border-white/40 shadow-sm">
                    <AvatarImage src={authorImage} alt={authorName} />
                    <AvatarFallback className="text-xs font-bold bg-white/20 text-white">
                      {getInitials(authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs text-white/90">
                    <span className="font-semibold block">{authorName}</span>
                    <span className="text-white/60">
                      {format(new Date(pubDate), "dd MMM yyyy")} · ~{estimatedWordCount.toLocaleString()} words
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback: No-image header */
        <header className="woords_container_small mb-10 text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {isFeatured && (
                <span className="woords_tag_secondary_small font-bold shadow-2xs">
                  ★ Featured Blueprint
                </span>
              )}
              {topics.map((topic) => {
                const meta = TOPIC_METADATA[topic];
                return (
                  <a
                    key={topic}
                    href={`/topics/${topic}/`}
                    className="px-3 py-1 rounded-full text-xs font-semibold border hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: `${meta?.color || "#FDA4AF"}25`,
                      borderColor: `${meta?.color || "#FDA4AF"}60`,
                      color: "inherit",
                    }}
                  >
                    {formatSlug(topic)}
                  </a>
                );
              })}
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight leading-[1.12]">
              {title}
            </h1>

            {description && (
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-body">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-border/40 w-full">
              <div className="flex items-center gap-2.5 text-left">
                <Avatar className="size-10 border border-border">
                  <AvatarImage src={authorImage} alt={authorName} />
                  <AvatarFallback className="text-xs font-bold">{getInitials(authorName)}</AvatarFallback>
                </Avatar>
                <div className="text-xs leading-tight">
                  <a
                    href={`/authors/${slugify(authorName)}/`}
                    className="font-bold text-foreground hover:underline block"
                  >
                    {authorName}
                  </a>
                  <span className="text-[11px] text-muted-foreground">
                    {format(new Date(pubDate), "dd MMM yyyy")} · {readTime} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Tags Row (below hero, above content) */}
      {tags.length > 0 && (
        <div className="woords_container_small mb-6 print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <Hash className="size-3.5 text-muted-foreground" />
            {tags.map((tag) => (
              <a
                key={tag}
                href={`/tags/${normalizeTagSlug(tag)}/`}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-black-50 dark:bg-black-900 text-muted-foreground hover:text-foreground hover:bg-black-100 dark:hover:bg-black-800 border border-black-100 dark:border-black-800 transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 4. Main Content Area: Article + Sidebar */}
      <div className="woords_container">
        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_18rem] gap-10 items-start">
          {/* Main Article Column */}
          <main className="w-full min-w-0 max-w-[820px] mx-auto xl:mx-0" ref={contentRef}>
            <div className={`prose dark:prose-invert max-w-none font-body ${fontSizeClass}`}>
              {children}
            </div>

            {/* Article Reactions Bar */}
            <div className="mt-14 pt-8 border-t border-border/60 not-prose">
              <div className="text-center mb-4">
                <h3 className="font-serif font-bold text-lg text-foreground">
                  How was this article?
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Your feedback helps us create better content
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {REACTIONS.map((r) => {
                  const isActive = userReactions.has(r.key);
                  const count = reactions[r.key] || 0;
                  return (
                    <button
                      key={r.key}
                      onClick={() => handleReaction(r.key)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-foreground text-background border-foreground shadow-md scale-105"
                          : "bg-card border-black-150 dark:border-black-800 text-foreground hover:border-foreground/40 hover:shadow-sm"
                      }`}
                    >
                      <span className="text-lg">{r.emoji}</span>
                      <span className="text-xs font-semibold">{r.label}</span>
                      {count > 0 && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-background/20 text-background"
                              : "bg-black-100 dark:bg-black-800 text-muted-foreground"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FAQs Accordion */}
            {faqs && faqs.length > 0 && (
              <div className="mt-14 pt-8 border-t border-border/60 not-prose">
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <HelpCircle className="size-4" />
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-foreground">
                    Frequently Asked Questions
                  </h3>
                </div>
                <FAQs items={faqs} />
              </div>
            )}

            {/* References Section */}
            {references && references.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border/60 not-prose">
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="size-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <ExternalLink className="size-4" />
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-foreground">
                    Citations & References
                  </h3>
                </div>
                <References items={references} />
              </div>
            )}

            {/* Author Bio Card */}
            <div className="mt-14 rounded-3xl border border-black-150 dark:border-black-800 bg-card p-6 sm:p-8 shadow-xs not-prose">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Avatar className="size-16 border-2 border-border shadow-xs">
                  <AvatarImage src={authorImage} alt={authorName} />
                  <AvatarFallback className="text-base font-bold">{getInitials(authorName)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1.5 flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Written by
                  </div>
                  <a
                    href={`/authors/${slugify(authorName)}/`}
                    className="font-bold font-serif text-xl text-foreground hover:underline block"
                  >
                    {authorName}
                  </a>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    AI Researcher and Systems Engineer focusing on production machine learning
                    pipelines, transformer architectures, and performant Python runtime internals.
                  </p>
                </div>
                <a
                  href={`/authors/${slugify(authorName)}/`}
                  className="px-4 py-2 rounded-full border border-border hover:bg-foreground hover:text-background text-xs font-semibold text-foreground transition-all self-start sm:self-center shrink-0"
                >
                  View Profile →
                </a>
              </div>
            </div>

            {/* Bottom Share & Bookmark Bar */}
            <div className="mt-8 border-t border-border/60 pt-6 not-prose flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-muted-foreground mr-1">
                  Share:
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${currentTitle}&url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background hover:bg-black-100 dark:hover:bg-black-800 transition-colors"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M13.68 10.62 20.24 3h-1.55L13 9.62 8.45 3H3.19l6.88 10.01L3.19 21h1.55l6.01-6.99 4.8 6.99h5.24l-7.13-10.38Zm-2.13 2.47-.7-1-5.54-7.93H7.7l4.47 6.4.7 1 5.82 8.32H16.3z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background hover:bg-black-100 dark:hover:bg-black-800 transition-colors"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 1.64 1.64 1.64 1.64 0 0 0-1.64-1.64Z" />
                  </svg>
                </a>
                <button
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background hover:bg-black-100 dark:hover:bg-black-800 transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              <button
                onClick={handleToggleBookmark}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-amber-500 text-black border-amber-500"
                    : "bg-background border-border hover:bg-black-100 dark:hover:bg-black-800 text-foreground"
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="size-4 fill-black" />
                ) : (
                  <Bookmark className="size-4" />
                )}
                <span>{isBookmarked ? "Saved to Reading List" : "Save for Later"}</span>
              </button>

              {/* AI Ask button */}
              <ArticleAI
                articleTitle={post.data.title}
                articleDescription={post.data.description}
                enabled={enableAI}
              />
            </div>

            {/* Prev / Next Navigation */}
            <div className="mt-12 not-prose grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <a
                  href={`/blog/${prevPost.id}/`}
                  className="p-5 rounded-2xl border border-black-150 dark:border-black-800 bg-card hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between space-y-2"
                >
                  <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                    Previous Article
                  </div>
                  <div className="font-serif font-bold text-sm sm:text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {prevPost.data.title}
                  </div>
                </a>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextPost ? (
                <a
                  href={`/blog/${nextPost.id}/`}
                  className="p-5 rounded-2xl border border-black-150 dark:border-black-800 bg-card hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between items-end space-y-2 text-right"
                >
                  <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    Next Article
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="font-serif font-bold text-sm sm:text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {nextPost.data.title}
                  </div>
                </a>
              ) : (
                <div className="hidden sm:block" />
              )}
            </div>

            {/* Comments */}
            <div className="mt-14 not-prose">
              <PostComments />
            </div>
          </main>

          {/* 5. Sticky Editorial Sidebar */}
          <aside className="hidden xl:block sticky top-[calc(var(--site-header-height,7.75rem)+1.5rem)] space-y-4 print:hidden max-h-[calc(100vh-var(--site-header-height,7.75rem)-2rem)] overflow-y-auto overscroll-contain pt-2.5 px-1 pb-6 scrollbar-none">
            {/* Table of Contents with Progress */}
            {headings.length > 0 && (
              <div className="border border-black-150 dark:border-black-800 rounded-2xl p-5 bg-card shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/40">
                  <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground font-serif flex items-center gap-1.5">
                    <Layers className="size-3.5" />
                    On this page
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {minutesLeft > 0 ? `${minutesLeft} min left` : "Done!"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-foreground font-mono">
                      {Math.round(scrollProgress)}%
                    </span>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="w-full h-1 rounded-full bg-black-100 dark:bg-black-800 mb-3 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>

                <ul ref={tocListRef} className="space-y-1 list-none pl-0 py-1 text-xs max-h-[138px] overflow-y-auto scrollbar-none scroll-smooth relative">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "pl-3.5" : ""}>
                      <a
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(h.id);
                          if (target) {
                            const headerOffset = 136;
                            const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                            window.scrollTo({
                              top: Math.max(0, elementPosition - headerOffset),
                              behavior: "smooth"
                            });
                            history.pushState(null, "", `#${h.id}`);
                          }
                        }}
                        className={`toc-link block rounded-lg px-2.5 py-1.5 leading-snug ${
                          activeId === h.id ? "is-active shadow-xs" : ""
                        }`}
                      >
                        {h.level === 3 && <span className="text-muted-foreground/40 mr-1">–</span>}
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights Widget */}
            {highlights.length > 0 && (
              <div className="border border-black-150 dark:border-black-800 rounded-2xl p-5 bg-card shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/40">
                  <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground font-serif flex items-center gap-1.5">
                    <Eye className="size-3.5 text-amber-500" />
                    My Highlights
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {highlights.length}
                  </span>
                </div>
                <ul className="space-y-2 list-none pl-0 max-h-[200px] overflow-y-auto">
                  {highlights.map((h, i) => (
                    <li
                      key={i}
                      className="relative group text-[11px] text-foreground/80 bg-amber-500/5 border-l-2 border-amber-500/40 rounded-r-lg pl-3 pr-7 py-2 leading-snug"
                    >
                      "{h.length > 80 ? h.slice(0, 80) + "…" : h}"
                      <button
                        onClick={() => removeHighlight(i)}
                        className="absolute top-1.5 right-1.5 text-muted-foreground/50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove highlight"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Roadmap Track */}
            {roadmapSlug && (
              <div className="border border-black-150 dark:border-black-800 rounded-2xl p-5 bg-card shadow-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Map className="size-4" />
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Learning Path
                    </div>
                    <div className="text-xs font-bold font-serif text-foreground">
                      {topicMeta?.label} Roadmap
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Track your progress and master {topicMeta?.label} step-by-step with our interactive graph curriculum.
                </p>
                <a
                  href={`/roadmaps/${roadmapSlug}/`}
                  className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-black-100 dark:bg-black-800 hover:bg-foreground hover:text-background text-xs font-semibold text-foreground transition-all group"
                >
                  <span>Explore Roadmap</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            )}

            {/* Featured Posts */}
            {featured && featured.length > 0 && (
              <div className="border border-black-150 dark:border-black-800 rounded-2xl p-5 bg-card shadow-xs">
                <div className="font-bold mb-3 text-xs uppercase tracking-wider text-muted-foreground font-serif flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  Recommended Reading
                </div>
                <ul className="space-y-3 list-none pl-0">
                  {featured.slice(0, 3).map((f: any) => (
                    <li key={f.id}>
                      <a
                        href={`/blog/${f.id}/`}
                        className="group flex items-start gap-3 rounded-xl p-2 -mx-2 hover:bg-black-100 dark:hover:bg-black-800 transition-colors"
                      >
                        {f.data.image ? (
                          <img
                            src={f.data.image}
                            alt={f.data.title}
                            className="size-11 rounded-lg object-cover border border-border shrink-0 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="size-11 rounded-lg bg-black-100 dark:bg-black-800 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                            {getInitials(f.data.title)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h6 className="text-xs font-bold font-serif text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {f.data.title}
                          </h6>
                          <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
                            <span>{format(new Date(f.data.pubDate), "dd MMM")}</span>
                            <span>·</span>
                            <span>{f.data.readTime || 6} min</span>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Actions */}
            <div className="border border-black-150 dark:border-black-800 rounded-2xl p-4 bg-card shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleBookmark}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isBookmarked
                      ? "bg-amber-500 text-black"
                      : "bg-black-100 dark:bg-black-800 text-foreground hover:bg-black-200 dark:hover:bg-black-700"
                  }`}
                >
                  {isBookmarked ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
                  {isBookmarked ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-black-100 dark:bg-black-800 text-foreground hover:bg-black-200 dark:hover:bg-black-700 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="size-3.5 text-emerald-500" /> : <Link2 className="size-3.5" />}
                  {copiedLink ? "Copied" : "Copy Link"}
                </button>
                <button
                  onClick={handlePrint}
                  className="size-9 inline-flex items-center justify-center rounded-xl bg-black-100 dark:bg-black-800 text-foreground hover:bg-black-200 dark:hover:bg-black-700 transition-colors cursor-pointer shrink-0"
                >
                  <Printer className="size-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 6. Related Articles Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="woords_container mt-20 pt-12 border-t border-border/60 print:hidden">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="woords_tag_small mb-1">Continue Learning</span>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-foreground">
                  Related Articles & Guides
                </h3>
              </div>
              <a
                href="/blog/"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="size-3.5" />
              </a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.slice(0, 3).map((item: any) => {
                const itemTopic = (item.data.topics || [])[0] || "machine-learning";
                const itemMeta = TOPIC_METADATA[itemTopic];
                return (
                  <a
                    key={item.id}
                    href={`/blog/${item.id}/`}
                    className="flex flex-col rounded-2xl border border-black-150 dark:border-black-800 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden group"
                  >
                    {item.data.image && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-black-100 dark:bg-black-800">
                        <img
                          src={item.data.image}
                          alt={item.data.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md"
                            style={{
                              backgroundColor: itemMeta ? `${itemMeta.color}cc` : "rgba(0,0,0,0.6)",
                              color: itemMeta ? "#000" : "#fff",
                            }}
                          >
                            {formatSlug(itemTopic)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4 space-y-2.5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{item.data.readTime || 6} min read</span>
                        <span>·</span>
                        <span>{format(new Date(item.data.pubDate), "dd MMM yyyy")}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug flex-1">
                        {item.data.title}
                      </h4>
                      {item.data.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.data.description}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. Floating Action Bar (appears on scroll) */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 print:hidden ${
          showFloatingBar
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-card/95 backdrop-blur-xl border border-black-200 dark:border-black-700 shadow-2xl">
          {/* Reading progress mini indicator */}
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground font-mono">
            <div className="w-16 h-1.5 rounded-full bg-black-100 dark:bg-black-800 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold w-7 text-right">{Math.round(scrollProgress)}%</span>
          </div>

          <div className="h-5 w-px bg-border/60 mx-0.5" />

          {/* Font size toggle */}
          <div className="inline-flex items-center rounded-lg bg-black-100 dark:bg-black-800 p-0.5">
            {(["sm", "base", "lg"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                  fontSize === size
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {size === "sm" ? "A⁻" : size === "lg" ? "A⁺" : "A"}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border/60 mx-0.5" />

          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isBookmarked ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
            }`}
            title={isBookmarked ? "Bookmarked" : "Bookmark"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="size-4 fill-amber-500" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Copy link"
          >
            {copiedLink ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
          </button>

          {/* Share */}
          <a
            href={`https://twitter.com/intent/tweet?text=${currentTitle}&url=${currentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            title="Share on X"
          >
            <svg className="size-4 fill-current" viewBox="0 0 24 24">
              <path d="M13.68 10.62 20.24 3h-1.55L13 9.62 8.45 3H3.19l6.88 10.01L3.19 21h1.55l6.01-6.99 4.8 6.99h5.24l-7.13-10.38Zm-2.13 2.47-.7-1-5.54-7.93H7.7l4.47 6.4.7 1 5.82 8.32H16.3z" />
            </svg>
          </a>
        </div>
      </div>

      {/* 8. Scroll to Top with Progress Ring */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 right-6 size-11 rounded-full bg-card border border-border shadow-lg hover:shadow-xl hover:bg-foreground hover:text-background flex items-center justify-center transition-all duration-200 z-40 cursor-pointer group print:hidden"
        >
          {/* SVG Progress Ring */}
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-black-100 dark:text-black-800"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-primary group-hover:text-background transition-colors"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.3s" }}
            />
          </svg>
          <ChevronUp className="size-4 relative z-10" />
        </button>
      )}

      {/* 9. Text Selection Highlight Popover */}
      {selectionPopover && (
        <div
          className="fixed z-50 flex items-center gap-1 px-2 py-1.5 rounded-xl bg-foreground text-background shadow-xl border border-border/20 text-[11px] font-semibold animate-in fade-in slide-in-from-bottom-1"
          style={{
            left: `${selectionPopover.x}px`,
            top: `${selectionPopover.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            onClick={() => addHighlight(selectionPopover.text)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 transition-colors cursor-pointer"
          >
            <Eye className="size-3" />
            Highlight
          </button>
          <div className="h-4 w-px bg-white/20 dark:bg-black/20" />
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectionPopover.text);
              setSelectionPopover(null);
              window.getSelection()?.removeAllRanges();
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 transition-colors cursor-pointer"
          >
            <Copy className="size-3" />
            Copy
          </button>
        </div>
      )}

      {/* Bookmark Toast */}
      {bookmarkToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold shadow-xl flex items-center gap-2 z-50">
          <BookmarkCheck className="size-4 text-amber-400 dark:text-amber-600" />
          Article saved to your reading list!
        </div>
      )}
    </article>
  );
};

export { BlogPost };