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
}

const FALLBACK_PODCASTS: PodcastEpisode[] = [
  {
    title: "How to get discovered in AI search",
    summary: "AI search is fundamentally transforming discovery and visibility across modern web indexes. Daniel and Chris analyze retrieval rankings with Liam Dunne.",
    pubDate: "17 Sep 2026",
    link: "https://share.transistor.fm/s/66185604",
    audioUrl: "https://pscrb.fm/rss/p/dts.podtrac.com/redirect.mp3/media.transistor.fm/66185604/d94b5158.mp3",
    duration: "55 min",
    episode: "Ep. 324",
    source: "Practical AI",
    featured: true,
  },
  {
    title: "Computer-Use Agents and the Future of the Agentic Internet",
    summary: "Exploring multi-agent workflows, browser and desktop computer-use primitives, and what autonomous systems require in production environments.",
    pubDate: "10 Sep 2026",
    link: "https://share.transistor.fm/s/72586f97",
    audioUrl: "https://pscrb.fm/rss/p/dts.podtrac.com/redirect.mp3/media.transistor.fm/72586f97/42471284.mp3",
    duration: "56 min",
    episode: "Ep. 323",
    source: "Practical AI",
  },
  {
    title: "Less about Models; More about Architecture",
    summary: "As AI moves from experimentation to enterprise deployment, why organizations are focusing heavily on architectures, evaluation loops, and caching.",
    pubDate: "03 Sep 2026",
    link: "https://share.transistor.fm/s/ec79b4ac",
    audioUrl: "https://pscrb.fm/rss/p/dts.podtrac.com/redirect.mp3/media.transistor.fm/ec79b4ac/efba87b4.mp3",
    duration: "46 min",
    episode: "Ep. 322",
    source: "Practical AI",
  },
  {
    title: "Foundations of Practical Machine Learning",
    summary: "An architectural audio briefing on practical machine learning foundations, scikit-learn models, and learning roadmaps by EncodeEdge.",
    pubDate: "20 Aug 2026",
    link: "/blog/welcome-to-encode-edge-your-path-to-practical-ai-mastery/",
    audioUrl: "",
    duration: "12 min",
    episode: "Ep. 01",
    source: "EncodeEdge Audio Briefing",
  },
];

export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const res = await fetch("https://changelog.com/practicalai/feed", {
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return FALLBACK_PODCASTS;
    const txt = await res.text();
    const items = txt.match(/<item>[\s\S]*?<\/item>/g);
    if (!items || items.length === 0) return FALLBACK_PODCASTS;

    const episodes: PodcastEpisode[] = items.slice(0, 3).map((item, index) => {
      const title = (
        item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
        item.match(/<title>(.*?)<\/title>/)?.[1] ||
        "Podcast Episode"
      ).trim();

      const link = (
        item.match(/<link>(.*?)<\/link>/)?.[1] ||
        "https://changelog.com/practicalai"
      ).trim();

      const rawDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const dateStr = rawDate
        ? new Date(rawDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Recent";

      const rawDesc =
        item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
        item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
        "";
      const summary =
        rawDesc
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 150) + "...";

      const audioUrl = (
        item.match(/<enclosure[^>]*url="([^"]*)"/)?.[1] || ""
      ).trim();

      const rawSecs = parseInt(
        item.match(/<itunes:duration>(.*?)<\/itunes:duration>/)?.[1] || "0",
        10
      );
      const duration =
        rawSecs > 0 ? `${Math.round(rawSecs / 60)} min` : "45 min";
      const epNum = 324 - index;

      return {
        title,
        summary,
        pubDate: dateStr,
        link,
        audioUrl: audioUrl || FALLBACK_PODCASTS[index]?.audioUrl || "",
        duration,
        episode: `Ep. ${epNum}`,
        source: "Practical AI",
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

export const AI_NEWS_DISPATCHES: AiNewsDispatch[] = [
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
    badgeColor: "bg-[#FDA4AF]/40 text-[#54111c] dark:bg-[#FDA4AF]/20 dark:text-[#FDA4AF]",
    url: "https://pytorch.org/blog/",
    isExternal: true,
  },
  {
    title: "Understanding Regression Error Metrics: MSE, RMSE, MAE and R²",
    summary: "Mathematical formulation, sensitivity to outliers, and how to choose the right loss metric for real-world continuous predictions.",
    source: "EncodeEdge Tutorial",
    tag: "Machine Learning",
    timeAgo: "1d ago",
    badgeColor: "bg-[#FDA4AF]/40 text-[#54111c] dark:bg-[#FDA4AF]/20 dark:text-[#FDA4AF]",
    url: "/blog/regression-error-metrics/",
    isExternal: false,
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
    title: "Python Memory References and Object Identity in CPython",
    summary: "How PyObject handles reference counts, cyclic references, and mutable vs immutable memory bindings under the hood.",
    source: "EncodeEdge Tutorial",
    tag: "Python Internals",
    timeAgo: "3d ago",
    badgeColor: "bg-[#FFB86A]/40 text-[#522503] dark:bg-[#FFB86A]/20 dark:text-[#FFB86A]",
    url: "/blog/python-variables-and-memory-references/",
    isExternal: false,
  },
];

