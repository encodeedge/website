import { getSourcesSettings } from "./settings";

export interface PodcastEpisode {
  title: string;
  summary: string;
  pubDate: string;
  link: string;
  audioUrl: string;
  duration: string;
  episode: string;
  source: string;
  featured?: boolean;
}

export interface AiNewsDispatch {
  title: string;
  summary: string;
  source: string;
  tag: string;
  timeAgo: string;
  badgeColor: string;
  url: string;
  isExternal: boolean;
  pubDate?: string;
}

export interface SyndicatedFeedSource {
  name: string;
  url: string;
  defaultTag: string;
  badgeColorKey?: string;
  fetchLimit?: number;
}

export const DEFAULT_NEWS_FEEDS: SyndicatedFeedSource[] = [
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    defaultTag: "Industry Radar",
  },
  {
    name: "Google AI News",
    url: "https://news.google.com/rss/search?q=Artificial+Intelligence+models+OR+chips&hl=en-US&gl=US&ceid=US:en",
    defaultTag: "Frontier AI",
  },
  {
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    defaultTag: "Open Source",
  },
];

export const DEFAULT_PODCAST_FEED_URL = "https://changelog.com/practicalai/feed";

export const FALLBACK_PODCASTS: PodcastEpisode[] = [
  {
    title: "From AGENTS.md to Enterprise Deployment",
    summary: "Exploring multi-agent orchestration, repository-level context files, and what autonomous systems require in production environments.",
    pubDate: "24 Sep 2026",
    link: "https://share.transistor.fm/s/74934e48",
    audioUrl: "https://pscrb.fm/rss/p/dts.podtrac.com/redirect.mp3/media.transistor.fm/66185604/d94b5158.mp3",
    duration: "49 min",
    episode: "Ep. 373",
    source: "Practical AI",
    featured: true,
  },
  {
    title: "How to get discovered in AI search",
    summary: "AI search is fundamentally transforming discovery and visibility across modern web indexes. Retrieval rankings and synthetic citation analysis.",
    pubDate: "17 Sep 2026",
    link: "https://share.transistor.fm/s/66185604",
    audioUrl: "https://pscrb.fm/rss/p/dts.podtrac.com/redirect.mp3/media.transistor.fm/66185604/d94b5158.mp3",
    duration: "55 min",
    episode: "Ep. 372",
    source: "Practical AI",
  },
  {
    title: "Computer-Use Agents and the Future of the Agentic Internet",
    summary: "Multi-agent workflows, browser and desktop computer-use primitives, and how frontier models interact with desktop GUIs.",
    pubDate: "10 Sep 2026",
    link: "https://share.transistor.fm/s/72586f97",
    audioUrl: "https://pscrb.fm/rss/p/dts.podtrac.com/redirect.mp3/media.transistor.fm/72586f97/42471284.mp3",
    duration: "56 min",
    episode: "Ep. 371",
    source: "Practical AI",
  },
  {
    title: "Foundations of Practical Machine Learning",
    summary: "An architectural audio briefing on practical machine learning foundations, scikit-learn models, and learning roadmaps by EncodeEdge.",
    pubDate: "20 Sep 2026",
    link: "/blog/welcome-to-encode-edge-your-path-to-practical-ai-mastery/",
    audioUrl: "",
    duration: "12 min",
    episode: "Ep. 01",
    source: "EncodeEdge Audio Briefing",
  },
];

export const FALLBACK_NEWS_DISPATCHES: AiNewsDispatch[] = [
  {
    title: "Anthropic Releases Claude 3.7 Sonnet with Hybrid Reasoning",
    summary: "Dynamic switching between instantaneous inference and extended thought chains for code verification and mathematical proofs.",
    source: "Anthropic Research",
    tag: "Reasoning Models",
    timeAgo: "2h ago",
    badgeColor: "bg-[#E5E795]/40 text-[#303305] dark:bg-[#E5E795]/20 dark:text-[#E5E795]",
    url: "https://www.anthropic.com/news/claude-3-7-sonnet",
    isExternal: true,
  },
  {
    title: "Google tests buying from Walmart-owned Flipkart through Gemini and AI Mode",
    summary: "The pilot test allows conversational purchasing and multimodal shopping discovery powered by Gemini models across modern e-commerce catalogs.",
    source: "TechCrunch AI",
    tag: "Industry Radar",
    timeAgo: "3h ago",
    badgeColor: "bg-[#FDA4AF]/40 text-[#54111c] dark:bg-[#FDA4AF]/20 dark:text-[#FDA4AF]",
    url: "https://techcrunch.com/category/artificial-intelligence/",
    isExternal: true,
  },
  {
    title: "DeepSeek-R1 Architecture: Multi-Head Latent Attention Deep-Dive",
    summary: "Breaking down pure reinforcement learning, high-density MLA caching, and why modern architectures prioritize attention memory.",
    source: "EncodeEdge Analysis",
    tag: "Architecture",
    timeAgo: "5h ago",
    badgeColor: "bg-[#A2D2FF]/40 text-[#0c2e4e] dark:bg-[#A2D2FF]/20 dark:text-[#A2D2FF]",
    url: "/blog/welcome-to-encode-edge-your-path-to-practical-ai-mastery/",
    isExternal: false,
  },
  {
    title: "PyTorch 2.6 Released: Native AOT Inductor Speedups and FP8 Matmuls",
    summary: "Accelerated compilation for transformer blocks, improved memory tracking, and native FP8 matrix multipliers out of the box.",
    source: "PyTorch Foundation",
    tag: "Frameworks",
    timeAgo: "1d ago",
    badgeColor: "bg-[#FFB86A]/40 text-[#522503] dark:bg-[#FFB86A]/20 dark:text-[#FFB86A]",
    url: "https://pytorch.org/blog/",
    isExternal: true,
  },
  {
    title: "OpenAI Deep Research: Autonomous Multi-Step Reasoning for Enterprise",
    summary: "Recursive agentic search loops, source synthesis protocols, and automated code review pipelines running on reasoning models.",
    source: "AI Engineering",
    tag: "AI Agents",
    timeAgo: "2d ago",
    badgeColor: "bg-[#EEA9ED]/40 text-[#3a1560] dark:bg-[#EEA9ED]/20 dark:text-[#EEA9ED]",
    url: "https://openai.com/index/introducing-deep-research/",
    isExternal: true,
  },
  {
    title: "Accelerating Vision-Language Models with Compact Attention Blocks",
    summary: "Novel sparse parameter allocations and linear projection layers yielding 3x throughput gains on commodity edge accelerators.",
    source: "Hugging Face Blog",
    tag: "Open Source",
    timeAgo: "2d ago",
    badgeColor: "bg-[#FFB86A]/40 text-[#522503] dark:bg-[#FFB86A]/20 dark:text-[#FFB86A]",
    url: "https://huggingface.co/blog",
    isExternal: true,
  },
];

export const AI_NEWS_DISPATCHES = FALLBACK_NEWS_DISPATCHES;

// Helper to strip HTML tags and decode common XML entities
function cleanText(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

// Compute human-friendly relative time string
function formatTimeAgo(date: Date): string {
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return `${Math.max(1, diffMinutes)}m ago`;
  }
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Classify technical tags and color tokens based on content keywords
function classifyNewsTag(title: string, summary: string, defaultTag: string): { tag: string; badgeColor: string } {
  const text = `${title} ${summary}`.toLowerCase();

  if (text.includes("agent") || text.includes("autonomous") || text.includes("computer-use") || text.includes("multi-agent")) {
    return {
      tag: "AI Agents",
      badgeColor: "bg-[#EEA9ED]/40 text-[#3a1560] dark:bg-[#EEA9ED]/20 dark:text-[#EEA9ED]",
    };
  }
  if (text.includes("reasoning") || text.includes("claude") || text.includes("gpt") || text.includes("gemini") || text.includes("deepseek") || text.includes("llama") || text.includes("frontier")) {
    return {
      tag: "Reasoning Models",
      badgeColor: "bg-[#E5E795]/40 text-[#303305] dark:bg-[#E5E795]/20 dark:text-[#E5E795]",
    };
  }
  if (text.includes("gpu") || text.includes("nvidia") || text.includes("silicon") || text.includes("chip") || text.includes("hardware") || text.includes("tpu") || text.includes("accelerat") || text.includes("fp8")) {
    return {
      tag: "AI Silicon",
      badgeColor: "bg-[#A2D2FF]/40 text-[#0c2e4e] dark:bg-[#A2D2FF]/20 dark:text-[#A2D2FF]",
    };
  }
  if (text.includes("open-source") || text.includes("open source") || text.includes("hugging face") || text.includes("weights") || text.includes("pytorch") || text.includes("dataset") || text.includes("vllm")) {
    return {
      tag: "Open Source",
      badgeColor: "bg-[#FFB86A]/40 text-[#522503] dark:bg-[#FFB86A]/20 dark:text-[#FFB86A]",
    };
  }
  if (text.includes("health") || text.includes("market") || text.includes("policy") || text.includes("court") || text.includes("law") || text.includes("invest") || text.includes("billion") || text.includes("cost") || text.includes("buy")) {
    return {
      tag: "Industry & Policy",
      badgeColor: "bg-[#FDA4AF]/40 text-[#54111c] dark:bg-[#FDA4AF]/20 dark:text-[#FDA4AF]",
    };
  }

  return {
    tag: defaultTag || "Frontier AI",
    badgeColor: "bg-[#A2D2FF]/40 text-[#0c2e4e] dark:bg-[#A2D2FF]/20 dark:text-[#A2D2FF]",
  };
}

const BADGE_COLOR_MAP: Record<string, string> = {
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  violet: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
};

/**
 * Fetch and aggregate real-time AI & technology dispatches from syndicated RSS/Atom feeds
 */
export async function getAiNewsDispatches(limit?: number, customFeeds?: SyndicatedFeedSource[]): Promise<AiNewsDispatch[]> {
  const sourcesConfig = await getSourcesSettings().catch(() => null);
  const actualLimit = limit ?? sourcesConfig?.displaySettings.homepageNewsLimit ?? 6;
  const timeoutMs = sourcesConfig?.displaySettings.feedTimeoutMs ?? 3800;

  const feedsToQuery: SyndicatedFeedSource[] =
    customFeeds && customFeeds.length > 0
      ? customFeeds
      : sourcesConfig && sourcesConfig.newsSources.length > 0
      ? sourcesConfig.newsSources
          .filter((s) => s.enabled)
          .map((s) => ({
            name: s.name,
            url: s.url,
            defaultTag: s.category || "Frontier AI",
            badgeColorKey: s.badgeColor,
            fetchLimit: s.fetchLimit || 3,
          }))
      : DEFAULT_NEWS_FEEDS;

  const collectedDispatches: Array<AiNewsDispatch & { timestamp: number }> = [];

  const feedPromises = feedsToQuery.map(async (feed) => {
    try {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; EncodeEdgeSyndication/1.0; +https://www.encodeedge.com)",
          "Accept": "application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!res.ok) return;
      const xml = await res.text();

      // Support both RSS <item> and Atom <entry> elements
      const items = xml.match(/<(?:item|entry)>[\s\S]*?<\/(?:item|entry)>/g) || [];
      const fetchCount = feed.fetchLimit && feed.fetchLimit > 0 ? feed.fetchLimit : 5;

      for (const item of items.slice(0, fetchCount)) {
        // Parse Title
        const rawTitle =
          item.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)?.[1] ||
          item.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ||
          "";
        let title = cleanText(rawTitle);

        // Parse Link
        let link =
          item.match(/<link[^>]*href="([^"]*)"/i)?.[1] ||
          item.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ||
          "";
        link = cleanText(link);

        // Parse Date
        const rawDate =
          item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ||
          item.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ||
          item.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] ||
          "";
        const pubDateObj = rawDate ? new Date(cleanText(rawDate)) : new Date();
        const timestamp = isNaN(pubDateObj.getTime()) ? Date.now() : pubDateObj.getTime();

        // Parse Summary / Description
        const rawDesc =
          item.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)?.[1] ||
          item.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
          item.match(/<summary[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/summary>/i)?.[1] ||
          item.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ||
          "";
        let summary = cleanText(rawDesc);

        // Deduce source name from title if it has a suffix like " - Source" (e.g. Google News)
        let sourceName = feed.name;
        if (title.includes(" - ")) {
          const parts = title.split(" - ");
          if (parts.length > 1 && parts[parts.length - 1].length < 30) {
            sourceName = parts.pop()!.trim();
            title = parts.join(" - ").trim();
          }
        }

        if (summary.length > 170) {
          summary = summary.slice(0, 165).replace(/[,;.]?\s+\S*$/, "") + "...";
        }
        if (!summary) {
          summary = `Latest technical release and technical analysis from ${sourceName}.`;
        }

        if (title && link) {
          const classified = classifyNewsTag(title, summary, feed.defaultTag);
          const badgeColor =
            (feed.badgeColorKey && BADGE_COLOR_MAP[feed.badgeColorKey]) || classified.badgeColor;
          const tag = classified.tag;
          collectedDispatches.push({
            title,
            summary,
            source: sourceName,
            tag,
            timeAgo: formatTimeAgo(new Date(timestamp)),
            badgeColor,
            url: link,
            isExternal: true,
            pubDate: new Date(timestamp).toISOString(),
            timestamp,
          });
        }
      }
    } catch (_err) {
      // Gracefully continue with other feeds
    }
  });

  await Promise.allSettled(feedPromises);

  // Sort by publication timestamp descending
  collectedDispatches.sort((a, b) => b.timestamp - a.timestamp);

  // Deduplicate by URL or title
  const seenUrls = new Set<string>();
  const uniqueDispatches: AiNewsDispatch[] = [];
  for (const item of collectedDispatches) {
    const key = item.url || item.title;
    if (!seenUrls.has(key)) {
      seenUrls.add(key);
      uniqueDispatches.push(item);
    }
    if (uniqueDispatches.length >= actualLimit) break;
  }

  // If fewer than limit were retrieved from the live feeds, pad with fallback items
  if (uniqueDispatches.length < actualLimit) {
    for (const fallback of FALLBACK_NEWS_DISPATCHES) {
      if (!uniqueDispatches.some((d) => d.title === fallback.title)) {
        uniqueDispatches.push(fallback);
      }
      if (uniqueDispatches.length >= actualLimit) break;
    }
  }

  return uniqueDispatches.slice(0, actualLimit);
}

/**
 * Fetch and format podcast episodes from syndicated audio RSS feeds
 */
export async function getPodcastEpisodes(feedUrl?: string, limit?: number): Promise<PodcastEpisode[]> {
  try {
    const sourcesConfig = await getSourcesSettings().catch(() => null);
    const activePodcast = sourcesConfig?.podcastSources.find((p) => p.enabled);
    const targetFeedUrl = feedUrl || activePodcast?.feedUrl || DEFAULT_PODCAST_FEED_URL;
    const actualLimit = limit ?? sourcesConfig?.displaySettings.homepagePodcastLimit ?? 3;
    const timeoutMs = sourcesConfig?.displaySettings.feedTimeoutMs ?? 3800;
    const sourceLabel = activePodcast?.title || "Practical AI";

    const res = await fetch(targetFeedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EncodeEdgePodcastBot/1.0; +https://www.encodeedge.com)",
        "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) return FALLBACK_PODCASTS;
    const txt = await res.text();
    const items = txt.match(/<item>[\s\S]*?<\/item>/g);
    if (!items || items.length === 0) return FALLBACK_PODCASTS;

    const episodes: PodcastEpisode[] = items.slice(0, actualLimit).map((item, index) => {
      const rawTitle =
        item.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)?.[1] ||
        item.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ||
        "Podcast Episode";
      const title = cleanText(rawTitle);

      const rawLink =
        item.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ||
        activePodcast?.siteUrl ||
        "https://changelog.com/practicalai";
      const link = cleanText(rawLink);

      const rawDate = item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] || "";
      const dateStr = rawDate
        ? new Date(cleanText(rawDate)).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Recent";

      const rawDesc =
        item.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)?.[1] ||
        item.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
        "";
      let summary = cleanText(rawDesc);
      if (summary.length > 160) {
        summary = summary.slice(0, 155).replace(/[,;.]?\s+\S*$/, "") + "...";
      }

      const audioUrl = (item.match(/<enclosure[^>]*url="([^"]*)"/i)?.[1] || "").trim();

      // Parse real episode number from <itunes:episode> or from title string
      const rawEpNum =
        item.match(/<itunes:episode[^>]*>(\d+)<\/itunes:episode>/i)?.[1] ||
        title.match(/#(\d+)|Ep(?:isode)?\.?\s*(\d+)/i)?.[1] ||
        title.match(/#(\d+)|Ep(?:isode)?\.?\s*(\d+)/i)?.[2] ||
        "";
      const episode = rawEpNum ? `Ep. ${rawEpNum}` : `Episode ${index + 1}`;

      // Parse duration
      const rawDuration = item.match(/<itunes:duration[^>]*>(.*?)<\/itunes:duration>/i)?.[1] || "";
      let duration = "45 min";
      if (rawDuration) {
        if (rawDuration.includes(":")) {
          const parts = rawDuration.split(":").map((p) => parseInt(p, 10));
          if (parts.length === 3) {
            duration = `${parts[0] * 60 + parts[1]} min`;
          } else if (parts.length === 2) {
            duration = `${parts[0]} min`;
          }
        } else {
          const secs = parseInt(rawDuration, 10);
          if (!isNaN(secs) && secs > 0) {
            duration = `${Math.round(secs / 60)} min`;
          }
        }
      }

      return {
        title,
        summary,
        pubDate: dateStr,
        link,
        audioUrl: audioUrl || FALLBACK_PODCASTS[index]?.audioUrl || "",
        duration,
        episode,
        source: sourceLabel,
        featured: index === 0,
      };
    });

    // Add EncodeEdge's own internal audio briefing as the 4th item
    episodes.push(FALLBACK_PODCASTS[3]);
    return episodes;
  } catch (_e) {
    return FALLBACK_PODCASTS;
  }
}
