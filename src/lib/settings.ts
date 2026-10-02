import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config.ts';

let readerInstance: ReturnType<typeof createReader> | null = null;

function getReader() {
  if (!readerInstance) {
    readerInstance = createReader(process.cwd(), keystaticConfig);
  }
  return readerInstance;
}

export interface FeatureFlags {
  newsletterBanner: {
    enabled: boolean;
    headline: string;
    subtext: string;
    buttonLabel: string;
    delaySeconds: number;
  };
  globalSearch: {
    enabled: boolean;
    placeholder: string;
  };
  articleAI: {
    enabled: boolean;
    buttonLabel: string;
    welcomeMessage: string;
  };
  gamification: {
    enabled: boolean;
    xpPerCorrectAnswer: number;
    xpBonusPerfectQuiz: number;
    streakEnabled: boolean;
    quizMinimumPassPercentage: number;
  };
  spacedRepetition: {
    enabled: boolean;
    maxHistoryPerQuiz: number;
  };
  peerStudyRooms: {
    enabled: boolean;
  };
  liveClasses: {
    enabled: boolean;
    showInNav: boolean;
  };
  courseCertificates: {
    enabled: boolean;
  };
  courseLeaderboard: {
    enabled: boolean;
  };
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  newsletterBanner: {
    enabled: true,
    headline: 'Join 2,000+ learners getting weekly AI & ML insights',
    subtext: 'No spam. Unsubscribe anytime. Free forever.',
    buttonLabel: 'Join free',
    delaySeconds: 30,
  },
  globalSearch: {
    enabled: true,
    placeholder: 'Search articles, roadmaps, quizzes, courses...',
  },
  articleAI: {
    enabled: true,
    buttonLabel: 'Ask AI',
    welcomeMessage: "Hi! I'm your AI tutor for this article. Ask me anything about this topic! 🧠",
  },
  gamification: {
    enabled: true,
    xpPerCorrectAnswer: 10,
    xpBonusPerfectQuiz: 25,
    streakEnabled: true,
    quizMinimumPassPercentage: 0,
  },
  spacedRepetition: {
    enabled: true,
    maxHistoryPerQuiz: 20,
  },
  peerStudyRooms: {
    enabled: true,
  },
  liveClasses: {
    enabled: true,
    showInNav: true,
  },
  courseCertificates: {
    enabled: true,
  },
  courseLeaderboard: {
    enabled: true,
  },
};

export interface AnnouncementSettings {
  enabled: boolean;
  message: string;
  linkText: string;
  linkUrl: string;
  style: 'info' | 'success' | 'warning' | 'promo';
  dismissible: boolean;
}

export const DEFAULT_ANNOUNCEMENT: AnnouncementSettings = {
  enabled: true,
  message: '🚀 New courses just launched — Deep Learning, LLMs & Python Mastery!',
  linkText: 'Explore courses',
  linkUrl: '/courses',
  style: 'promo',
  dismissible: true,
};

export const THEME_PALETTES: Record<string, { primary: string; accent: string }> = {
  indigo: { primary: '#6366f1', accent: '#E5E795' },
  emerald: { primary: '#10b981', accent: '#38bdf8' },
  violet: { primary: '#8b5cf6', accent: '#f43f5e' },
  amber: { primary: '#f59e0b', accent: '#ec4899' },
  cyan: { primary: '#06b6d4', accent: '#a855f7' },
  crimson: { primary: '#ef4444', accent: '#f59e0b' },
};

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  themePreset?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  darkBackgroundColor: string;
  logo: string | null;
  favicon: string | null;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'EncodeEdge',
  siteTagline: 'The Modern Developer & AI Engineer Learning Platform',
  siteDescription: 'Master Artificial Intelligence, Deep Learning, and Modern Software Engineering with interactive visual roadmaps and labs.',
  primaryColor: '#6366f1',
  accentColor: '#E5E795',
  backgroundColor: '#ffffff',
  darkBackgroundColor: '#09090b',
  logo: null,
  favicon: null,
  socialLinks: {
    github: 'https://github.com/encodeedge',
    twitter: 'https://x.com/encodeedge',
    linkedin: 'https://linkedin.com/company/encodeedge',
    youtube: 'https://youtube.com/@encodeedge',
  },
};

/**
 * Read feature flags from Keystatic with comprehensive fallbacks.
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const reader = getReader();
    const flags = await reader.singletons.featureFlags.read();
    if (!flags) return DEFAULT_FEATURE_FLAGS;

    return {
      newsletterBanner: {
        enabled: flags.newsletterBanner?.enabled ?? DEFAULT_FEATURE_FLAGS.newsletterBanner.enabled,
        headline: flags.newsletterBanner?.headline ?? DEFAULT_FEATURE_FLAGS.newsletterBanner.headline,
        subtext: flags.newsletterBanner?.subtext ?? DEFAULT_FEATURE_FLAGS.newsletterBanner.subtext,
        buttonLabel: flags.newsletterBanner?.buttonLabel ?? DEFAULT_FEATURE_FLAGS.newsletterBanner.buttonLabel,
        delaySeconds: flags.newsletterBanner?.delaySeconds ?? DEFAULT_FEATURE_FLAGS.newsletterBanner.delaySeconds,
      },
      globalSearch: {
        enabled: flags.globalSearch?.enabled ?? DEFAULT_FEATURE_FLAGS.globalSearch.enabled,
        placeholder: flags.globalSearch?.placeholder ?? DEFAULT_FEATURE_FLAGS.globalSearch.placeholder,
      },
      articleAI: {
        enabled: flags.articleAI?.enabled ?? DEFAULT_FEATURE_FLAGS.articleAI.enabled,
        buttonLabel: flags.articleAI?.buttonLabel ?? DEFAULT_FEATURE_FLAGS.articleAI.buttonLabel,
        welcomeMessage: flags.articleAI?.welcomeMessage ?? DEFAULT_FEATURE_FLAGS.articleAI.welcomeMessage,
      },
      gamification: {
        enabled: flags.gamification?.enabled ?? DEFAULT_FEATURE_FLAGS.gamification.enabled,
        xpPerCorrectAnswer: flags.gamification?.xpPerCorrectAnswer ?? DEFAULT_FEATURE_FLAGS.gamification.xpPerCorrectAnswer,
        xpBonusPerfectQuiz: flags.gamification?.xpBonusPerfectQuiz ?? DEFAULT_FEATURE_FLAGS.gamification.xpBonusPerfectQuiz,
        streakEnabled: flags.gamification?.streakEnabled ?? DEFAULT_FEATURE_FLAGS.gamification.streakEnabled,
        quizMinimumPassPercentage: (flags.gamification as any)?.quizMinimumPassPercentage ?? DEFAULT_FEATURE_FLAGS.gamification.quizMinimumPassPercentage,
      },
      spacedRepetition: {
        enabled: flags.spacedRepetition?.enabled ?? DEFAULT_FEATURE_FLAGS.spacedRepetition.enabled,
        maxHistoryPerQuiz: flags.spacedRepetition?.maxHistoryPerQuiz ?? DEFAULT_FEATURE_FLAGS.spacedRepetition.maxHistoryPerQuiz,
      },
      peerStudyRooms: {
        enabled: (flags as any).peerStudyRooms?.enabled ?? DEFAULT_FEATURE_FLAGS.peerStudyRooms.enabled,
      },
      liveClasses: {
        enabled: (flags as any).liveClasses?.enabled ?? DEFAULT_FEATURE_FLAGS.liveClasses.enabled,
        showInNav: (flags as any).liveClasses?.showInNav ?? DEFAULT_FEATURE_FLAGS.liveClasses.showInNav,
      },
      courseCertificates: {
        enabled: (flags as any).courseCertificates?.enabled ?? DEFAULT_FEATURE_FLAGS.courseCertificates.enabled,
      },
      courseLeaderboard: {
        enabled: (flags as any).courseLeaderboard?.enabled ?? DEFAULT_FEATURE_FLAGS.courseLeaderboard.enabled,
      },
    };
  } catch (error) {
    console.warn('[Keystatic Settings] Failed to load featureFlags, using defaults:', error);
    return DEFAULT_FEATURE_FLAGS;
  }
}

/**
 * Read announcement banner settings from Keystatic with comprehensive fallbacks.
 */
export async function getAnnouncementBanner(): Promise<AnnouncementSettings> {
  try {
    const reader = getReader();
    const banner = await reader.singletons.announcementBanner.read();
    if (!banner) return DEFAULT_ANNOUNCEMENT;

    return {
      enabled: banner.enabled ?? DEFAULT_ANNOUNCEMENT.enabled,
      message: banner.message ?? DEFAULT_ANNOUNCEMENT.message,
      linkText: banner.linkText ?? DEFAULT_ANNOUNCEMENT.linkText,
      linkUrl: banner.linkUrl ?? DEFAULT_ANNOUNCEMENT.linkUrl,
      style: (banner.style as any) ?? DEFAULT_ANNOUNCEMENT.style,
      dismissible: banner.dismissible ?? DEFAULT_ANNOUNCEMENT.dismissible,
    };
  } catch (error) {
    console.warn('[Keystatic Settings] Failed to load announcementBanner, using defaults:', error);
    return DEFAULT_ANNOUNCEMENT;
  }
}

/**
 * Read site settings from Keystatic with comprehensive fallbacks.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const reader = getReader();
    const site = await reader.singletons.siteSettings.read();
    if (!site) return DEFAULT_SITE_SETTINGS;

    const preset = (site as any).themePreset;
    const presetColors = preset && preset !== 'custom' ? THEME_PALETTES[preset] : null;

    return {
      siteName: site.siteName ?? DEFAULT_SITE_SETTINGS.siteName,
      siteTagline: site.siteTagline ?? DEFAULT_SITE_SETTINGS.siteTagline,
      siteDescription: site.siteDescription ?? DEFAULT_SITE_SETTINGS.siteDescription,
      themePreset: preset ?? 'indigo',
      primaryColor: presetColors?.primary || site.primaryColor || DEFAULT_SITE_SETTINGS.primaryColor,
      accentColor: presetColors?.accent || site.accentColor || DEFAULT_SITE_SETTINGS.accentColor,
      backgroundColor: site.backgroundColor || DEFAULT_SITE_SETTINGS.backgroundColor,
      darkBackgroundColor: site.darkBackgroundColor || DEFAULT_SITE_SETTINGS.darkBackgroundColor,
      logo: site.logo ?? null,
      favicon: site.favicon ?? null,
      socialLinks: {
        github: site.socialLinks?.github ?? DEFAULT_SITE_SETTINGS.socialLinks.github,
        twitter: site.socialLinks?.twitter ?? DEFAULT_SITE_SETTINGS.socialLinks.twitter,
        linkedin: site.socialLinks?.linkedin ?? DEFAULT_SITE_SETTINGS.socialLinks.linkedin,
        youtube: site.socialLinks?.youtube ?? DEFAULT_SITE_SETTINGS.socialLinks.youtube,
      },
    };
  } catch (error) {
    console.warn('[Keystatic Settings] Failed to load siteSettings, using defaults:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export interface NavChildItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  icon?: string;
  openInNewTab?: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  badge?: string;
  icon?: string;
  openInNewTab?: boolean;
  children?: NavChildItem[];
}

export interface NavigationSettings {
  navLinks: NavItem[];
  showSearch: boolean;
  showSubscribeButton: boolean;
  subscribeButtonText: string;
  subscribeButtonUrl: string;
}

export const DEFAULT_NAVIGATION_SETTINGS: NavigationSettings = {
  navLinks: [
    {
      label: 'Home',
      href: '/',
      openInNewTab: false,
    },
    {
      label: 'Learn',
      href: '/courses',
      openInNewTab: false,
      children: [
        {
          label: 'Courses',
          href: '/courses',
          description: 'Full-stack AI, ML, and Python curriculum with code walkthroughs',
          badge: 'Popular',
          openInNewTab: false,
        },
        {
          label: 'Live Classes',
          href: '/live-classes',
          description: 'Interactive cohorts, hands-on workshops, and webinars',
          badge: 'Live',
          openInNewTab: false,
        },
        {
          label: 'Roadmaps',
          href: '/roadmaps',
          description: 'Visual career roadmaps and guided competency paths',
          openInNewTab: false,
        },
        {
          label: 'Topics',
          href: '/topics',
          description: 'Browse all lessons, algorithms, and deep-dive concepts',
          openInNewTab: false,
        },
      ],
    },
    {
      label: 'Labs',
      href: '/labs',
      badge: 'Interactive',
      openInNewTab: false,
      children: [
        {
          label: 'Interactive Simulators',
          href: '/labs',
          description: 'Visual playgrounds for Attention, Convolutions, and Memory',
          badge: 'New',
          openInNewTab: false,
        },
        {
          label: 'Math & AI Decoder',
          href: '/labs#math-decoder',
          description: 'Glossary of neural network symbols, notation, and LaTeX',
          openInNewTab: false,
        },
        {
          label: 'Competitions',
          href: '/competitions',
          description: 'Live Kaggle, HackerRank, and hackathon challenges tracker',
          badge: 'Live',
          openInNewTab: false,
        },
      ],
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      badge: 'LMS',
      openInNewTab: false,
    },
    {
      label: 'Blog',
      href: '/blog',
      openInNewTab: false,
    },
    {
      label: 'More',
      href: '/about',
      openInNewTab: false,
      children: [
        {
          label: 'About Us',
          href: '/about',
          description: 'Our mission, team, and modern AI engineering education',
          openInNewTab: false,
        },
        {
          label: 'FAQs',
          href: '/faq',
          description: 'Answers to commonly asked questions',
          openInNewTab: false,
        },
        {
          label: 'Contact',
          href: '/contact',
          description: 'Get in touch with instructors and the community',
          openInNewTab: false,
        },
        {
          label: 'Verify Certificate',
          href: '/verify/demo',
          description: 'Cryptographically verify student certificates and credentials',
          openInNewTab: false,
        },
      ],
    },
  ],
  showSearch: true,
  showSubscribeButton: true,
  subscribeButtonText: 'Subscribe',
  subscribeButtonUrl: '/subscribe',
};

/**
 * Read navigation settings from Keystatic with comprehensive fallbacks.
 */
export async function getNavigationSettings(): Promise<NavigationSettings> {
  try {
    const reader = getReader();
    const nav = await reader.singletons.navigationSettings.read();
    if (!nav) return DEFAULT_NAVIGATION_SETTINGS;

    const rawLinks = nav.navLinks as any[];
    const navLinks: NavItem[] = Array.isArray(rawLinks) && rawLinks.length > 0
      ? rawLinks.map((item: any) => ({
          label: item.label || '',
          href: item.href || '',
          badge: item.badge || undefined,
          icon: item.icon || undefined,
          openInNewTab: !!item.openInNewTab,
          children: Array.isArray(item.children) && item.children.length > 0
            ? item.children.map((c: any) => ({
                label: c.label || '',
                href: c.href || '',
                description: c.description || undefined,
                badge: c.badge || undefined,
                icon: c.icon || undefined,
                openInNewTab: !!c.openInNewTab,
              }))
            : undefined,
        }))
      : DEFAULT_NAVIGATION_SETTINGS.navLinks;

    return {
      navLinks,
      showSearch: nav.showSearch ?? DEFAULT_NAVIGATION_SETTINGS.showSearch,
      showSubscribeButton: nav.showSubscribeButton ?? DEFAULT_NAVIGATION_SETTINGS.showSubscribeButton,
      subscribeButtonText: nav.subscribeButtonText || DEFAULT_NAVIGATION_SETTINGS.subscribeButtonText,
      subscribeButtonUrl: nav.subscribeButtonUrl || DEFAULT_NAVIGATION_SETTINGS.subscribeButtonUrl,
    };
  } catch (error) {
    console.warn('[Keystatic Settings] Failed to load navigationSettings, using defaults:', error);
    return DEFAULT_NAVIGATION_SETTINGS;
  }
}

export interface IntegrationsSettings {
  googleAnalytics: {
    enabled: boolean;
    measurementId: string;
    debugMode: boolean;
    excludeInternalTraffic: boolean;
    sendPageViewOnLoad: boolean;
    trackEngagement: boolean;
  };
  crispChat: {
    enabled: boolean;
    websiteId: string;
  };
  convertKit: {
    enabled: boolean;
    formId: string;
    apiKey: string;
  };
  discord: {
    enabled: boolean;
    widgetServerId: string;
    inviteUrl: string;
  };
  posthog: {
    enabled: boolean;
    apiKey: string;
    apiHost: string;
  };
}

export const DEFAULT_INTEGRATIONS_SETTINGS: IntegrationsSettings = {
  googleAnalytics: {
    enabled: true,
    measurementId: 'G-5WBXFR71Y5',
    debugMode: false,
    excludeInternalTraffic: true,
    sendPageViewOnLoad: true,
    trackEngagement: true,
  },
  crispChat: {
    enabled: false,
    websiteId: '',
  },
  convertKit: {
    enabled: false,
    formId: '',
    apiKey: '',
  },
  discord: {
    enabled: false,
    widgetServerId: '',
    inviteUrl: '',
  },
  posthog: {
    enabled: false,
    apiKey: '',
    apiHost: 'https://app.posthog.com',
  },
};

/**
 * Read integrations settings from Keystatic with comprehensive fallbacks.
 */
export async function getIntegrationsSettings(): Promise<IntegrationsSettings> {
  try {
    const reader = getReader();
    const integrations = await reader.singletons.integrationsSettings.read();
    if (!integrations) return DEFAULT_INTEGRATIONS_SETTINGS;

    const ga = (integrations as any).googleAnalytics;
    return {
      googleAnalytics: {
        enabled: ga?.enabled ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.enabled,
        measurementId: ga?.measurementId || DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.measurementId,
        debugMode: ga?.debugMode ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.debugMode,
        excludeInternalTraffic: ga?.excludeInternalTraffic ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.excludeInternalTraffic,
        sendPageViewOnLoad: ga?.sendPageViewOnLoad ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.sendPageViewOnLoad,
        trackEngagement: ga?.trackEngagement ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.trackEngagement,
      },
      crispChat: {
        enabled: integrations.crispChat?.enabled ?? DEFAULT_INTEGRATIONS_SETTINGS.crispChat.enabled,
        websiteId: integrations.crispChat?.websiteId || DEFAULT_INTEGRATIONS_SETTINGS.crispChat.websiteId,
      },
      convertKit: {
        enabled: integrations.convertKit?.enabled ?? DEFAULT_INTEGRATIONS_SETTINGS.convertKit.enabled,
        formId: integrations.convertKit?.formId || DEFAULT_INTEGRATIONS_SETTINGS.convertKit.formId,
        apiKey: integrations.convertKit?.apiKey || DEFAULT_INTEGRATIONS_SETTINGS.convertKit.apiKey,
      },
      discord: {
        enabled: integrations.discord?.enabled ?? DEFAULT_INTEGRATIONS_SETTINGS.discord.enabled,
        widgetServerId: integrations.discord?.widgetServerId || DEFAULT_INTEGRATIONS_SETTINGS.discord.widgetServerId,
        inviteUrl: integrations.discord?.inviteUrl || DEFAULT_INTEGRATIONS_SETTINGS.discord.inviteUrl,
      },
      posthog: {
        enabled: integrations.posthog?.enabled ?? DEFAULT_INTEGRATIONS_SETTINGS.posthog.enabled,
        apiKey: integrations.posthog?.apiKey || DEFAULT_INTEGRATIONS_SETTINGS.posthog.apiKey,
        apiHost: integrations.posthog?.apiHost || DEFAULT_INTEGRATIONS_SETTINGS.posthog.apiHost,
      },
    };
  } catch (error) {
    console.warn('[Keystatic Settings] Failed to load integrationsSettings, using defaults:', error);
    return DEFAULT_INTEGRATIONS_SETTINGS;
  }
}

export interface NewsSourceConfig {
  name: string;
  url: string;
  category: string;
  badgeColor: string;
  fetchLimit: number;
  enabled: boolean;
}

export interface PodcastSourceConfig {
  title: string;
  feedUrl: string;
  siteUrl: string;
  badgeText: string;
  isSpotlight: boolean;
  enabled: boolean;
}

export interface CompetitionSourceConfig {
  name: string;
  platformId: string;
  url: string;
  feedUrl?: string;
  category: string;
  fetchLimit: number;
  enabled: boolean;
}

export interface SourcesSettings {
  newsSources: NewsSourceConfig[];
  podcastSources: PodcastSourceConfig[];
  competitionSources: CompetitionSourceConfig[];
  displaySettings: {
    homepageNewsLimit: number;
    homepagePodcastLimit: number;
    enableLiveClientSync: boolean;
    autoSyncOnPageLoad: boolean;
    enableCompetitionsSync: boolean;
    autoSyncCompetitions: boolean;
    hideCompletedCompetitions: boolean;
    maxCompetitionsDisplay: number;
    feedTimeoutMs: number;
  };
}

export const DEFAULT_SOURCES_SETTINGS: SourcesSettings = {
  newsSources: [
    {
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
      category: 'Frontier AI',
      badgeColor: 'rose',
      fetchLimit: 3,
      enabled: true,
    },
    {
      name: 'Google AI News',
      url: 'https://blog.google/technology/ai/rss/',
      category: 'Research',
      badgeColor: 'blue',
      fetchLimit: 3,
      enabled: true,
    },
    {
      name: 'Hugging Face Blog',
      url: 'https://huggingface.co/blog/feed.xml',
      category: 'Open Source',
      badgeColor: 'amber',
      fetchLimit: 3,
      enabled: true,
    },
  ],
  podcastSources: [
    {
      title: 'Practical AI',
      feedUrl: 'https://changelog.com/practicalai/feed',
      siteUrl: 'https://changelog.com/practicalai',
      badgeText: 'Practical AI',
      isSpotlight: true,
      enabled: true,
    },
  ],
  competitionSources: [
    {
      name: 'Kaggle',
      platformId: 'kaggle',
      url: 'https://www.kaggle.com/competitions',
      feedUrl: 'https://www.kaggle.com/competitions',
      category: 'all',
      fetchLimit: 6,
      enabled: true,
    },
    {
      name: 'HackerRank',
      platformId: 'hackerrank',
      url: 'https://www.hackerrank.com/contests',
      feedUrl: 'https://www.hackerrank.com/contests',
      category: 'all',
      fetchLimit: 4,
      enabled: true,
    },
    {
      name: 'DrivenData',
      platformId: 'drivendata',
      url: 'https://www.drivendata.org/competitions',
      feedUrl: 'https://www.drivendata.org/competitions',
      category: 'all',
      fetchLimit: 4,
      enabled: true,
    },
    {
      name: 'Hugging Face',
      platformId: 'huggingface',
      url: 'https://huggingface.co/spaces',
      feedUrl: 'https://huggingface.co/spaces',
      category: 'all',
      fetchLimit: 4,
      enabled: true,
    },
    {
      name: 'Zindi',
      platformId: 'zindi',
      url: 'https://zindi.africa/competitions',
      feedUrl: 'https://zindi.africa/competitions',
      category: 'all',
      fetchLimit: 4,
      enabled: true,
    },
    {
      name: 'AIcrowd',
      platformId: 'aicrowd',
      url: 'https://www.aicrowd.com/challenges',
      feedUrl: 'https://www.aicrowd.com/challenges',
      category: 'all',
      fetchLimit: 4,
      enabled: true,
    },
  ],
  displaySettings: {
    homepageNewsLimit: 6,
    homepagePodcastLimit: 3,
    enableLiveClientSync: true,
    autoSyncOnPageLoad: true,
    enableCompetitionsSync: true,
    autoSyncCompetitions: true,
    hideCompletedCompetitions: true,
    maxCompetitionsDisplay: 24,
    feedTimeoutMs: 3800,
  },
};

/**
 * Read syndication and media feed sources from Keystatic with comprehensive fallbacks.
 */
export async function getSourcesSettings(): Promise<SourcesSettings> {
  try {
    const reader = getReader();
    const sources = await reader.singletons.sources.read();
    if (!sources) return DEFAULT_SOURCES_SETTINGS;

    const rawNews = sources.newsSources as any[];
    const newsSources: NewsSourceConfig[] = Array.isArray(rawNews) && rawNews.length > 0
      ? rawNews.map((s: any) => ({
          name: s.name || 'Untitled Feed',
          url: s.url || '',
          category: s.category || 'Frontier AI',
          badgeColor: s.badgeColor || 'rose',
          fetchLimit: Number(s.fetchLimit) || 3,
          enabled: s.enabled !== false,
        }))
      : DEFAULT_SOURCES_SETTINGS.newsSources;

    const rawPodcasts = sources.podcastSources as any[];
    const podcastSources: PodcastSourceConfig[] = Array.isArray(rawPodcasts) && rawPodcasts.length > 0
      ? rawPodcasts.map((p: any) => ({
          title: p.title || 'Untitled Podcast',
          feedUrl: p.feedUrl || '',
          siteUrl: p.siteUrl || '',
          badgeText: p.badgeText || 'Practical AI',
          isSpotlight: p.isSpotlight !== false,
          enabled: p.enabled !== false,
        }))
      : DEFAULT_SOURCES_SETTINGS.podcastSources;

    const rawCompetitions = (sources as any).competitionSources as any[];
    const competitionSources: CompetitionSourceConfig[] = Array.isArray(rawCompetitions) && rawCompetitions.length > 0
      ? rawCompetitions.map((c: any) => ({
          name: c.name || 'Untitled Platform',
          platformId: c.platformId || 'kaggle',
          url: c.url || 'https://www.kaggle.com/competitions',
          feedUrl: c.feedUrl || '',
          category: c.category || 'all',
          fetchLimit: Number(c.fetchLimit) || 4,
          enabled: c.enabled !== false,
        }))
      : DEFAULT_SOURCES_SETTINGS.competitionSources;

    const ds = (sources as any).displaySettings;

    return {
      newsSources,
      podcastSources,
      competitionSources,
      displaySettings: {
        homepageNewsLimit: Number(ds?.homepageNewsLimit) || DEFAULT_SOURCES_SETTINGS.displaySettings.homepageNewsLimit,
        homepagePodcastLimit: Number(ds?.homepagePodcastLimit) || DEFAULT_SOURCES_SETTINGS.displaySettings.homepagePodcastLimit,
        enableLiveClientSync: ds?.enableLiveClientSync ?? DEFAULT_SOURCES_SETTINGS.displaySettings.enableLiveClientSync,
        autoSyncOnPageLoad: ds?.autoSyncOnPageLoad ?? DEFAULT_SOURCES_SETTINGS.displaySettings.autoSyncOnPageLoad,
        enableCompetitionsSync: ds?.enableCompetitionsSync ?? DEFAULT_SOURCES_SETTINGS.displaySettings.enableCompetitionsSync,
        autoSyncCompetitions: ds?.autoSyncCompetitions ?? DEFAULT_SOURCES_SETTINGS.displaySettings.autoSyncCompetitions,
        hideCompletedCompetitions: ds?.hideCompletedCompetitions ?? DEFAULT_SOURCES_SETTINGS.displaySettings.hideCompletedCompetitions,
        maxCompetitionsDisplay: Number(ds?.maxCompetitionsDisplay) || DEFAULT_SOURCES_SETTINGS.displaySettings.maxCompetitionsDisplay,
        feedTimeoutMs: Number(ds?.feedTimeoutMs) || DEFAULT_SOURCES_SETTINGS.displaySettings.feedTimeoutMs,
      },
    };
  } catch (error) {
    console.warn('[Keystatic Settings] Failed to load sources settings, using defaults:', error);
    return DEFAULT_SOURCES_SETTINGS;
  }
}

// ─── Page-Level Settings ──────────────────────────────────────────────────────

export interface PageHero {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
}

export interface PageCoursesSettings {
  hero: PageHero;
  stats: { value: string; label: string }[];
  showFeaturedSection: boolean;
  showBatchesSection: boolean;
  showInstructorsSection: boolean;
  maxCoursesShown: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PageBlogSettings {
  hero: PageHero;
  postsPerPage: number;
  showNotebooks: boolean;
  showFeaturedPosts: boolean;
  defaultSortOrder: 'newest' | 'oldest' | 'popular';
  seoTitle?: string;
  seoDescription?: string;
}

export interface PageLabsSettings {
  hero: PageHero;
  showGlossaryTab: boolean;
  defaultTab: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PageRoadmapsSettings {
  hero: PageHero;
  sortOrder: 'alpha' | 'featured';
  seoTitle?: string;
  seoDescription?: string;
}

export interface PageTopicsSettings {
  hero: PageHero;
  showTopicStats: boolean;
  showRoadmapBadge: boolean;
  showRecentArticlesPreview: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PageLiveClassesSettings {
  hero: PageHero;
  showLeaderboard: boolean;
  showCountdownTimer: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PageDashboardSettings {
  hero: PageHero;
  showStreakWidget: boolean;
  showXpWidget: boolean;
  showCertificatesSection: boolean;
  showLeaderboardWidget: boolean;
  showRecommendedCourses: boolean;
  seoTitle?: string;
}

// Defaults
export const DEFAULT_COURSES_PAGE: PageCoursesSettings = {
  hero: { eyebrow: 'EncodeEdge Academy', heading: 'Build Real AI Skills', subheading: 'Master modern Artificial Intelligence, Machine Learning, Deep Learning, and Python through hands-on, production-grade courses.', ctaLabel: 'Browse All Courses', ctaUrl: '#courses', secondaryCtaLabel: 'View Roadmaps', secondaryCtaUrl: '/roadmaps' },
  stats: [{ value: '12+', label: 'Courses' }, { value: '100+', label: 'Lessons' }, { value: '50+', label: 'Quizzes' }],
  showFeaturedSection: true, showBatchesSection: true, showInstructorsSection: true, maxCoursesShown: 0,
};
export const DEFAULT_BLOG_PAGE: PageBlogSettings = {
  hero: { eyebrow: 'EncodeEdge Blog', heading: 'Blueprints for Modern AI Engineers', subheading: 'Clear, code-backed deep dives into Machine Learning, Deep Learning, Python internals, and AI systems.' },
  postsPerPage: 12, showNotebooks: true, showFeaturedPosts: true, defaultSortOrder: 'newest',
};
export const DEFAULT_LABS_PAGE: PageLabsSettings = {
  hero: { eyebrow: 'Interactive AI Labs', heading: 'Learn by Doing', subheading: 'Explore interactive simulators for Transformers, Convolutions, Gradient Descent, and a comprehensive AI math notation glossary.' },
  showGlossaryTab: true, defaultTab: 'all',
};
export const DEFAULT_ROADMAPS_PAGE: PageRoadmapsSettings = {
  hero: { eyebrow: 'Learning Paths', heading: 'Step-by-Step Roadmaps', subheading: 'Master complex engineering domains with structured visual roadmaps from novice to production expert.' },
  sortOrder: 'alpha',
};
export const DEFAULT_TOPICS_PAGE: PageTopicsSettings = {
  hero: { eyebrow: 'Knowledge Hubs', heading: 'All Engineering Topics', subheading: 'Browse curated engineering tracks from foundational Python to deep learning architectures and production LLMs.' },
  showTopicStats: true, showRoadmapBadge: true, showRecentArticlesPreview: true,
};
export const DEFAULT_LIVE_CLASSES_PAGE: PageLiveClassesSettings = {
  hero: { eyebrow: '1 Live Session In Progress', heading: 'Live Classes & Community', subheading: 'Attend live coding sessions, ask questions in real time, and watch recordings when you can\'t make it live.' },
  showLeaderboard: true, showCountdownTimer: true,
};
export const DEFAULT_DASHBOARD_PAGE: PageDashboardSettings = {
  hero: { heading: 'My Learning Dashboard', subheading: 'Track your progress, resume active modules, and manage earned certificates.' },
  showStreakWidget: true, showXpWidget: true, showCertificatesSection: true, showLeaderboardWidget: true, showRecommendedCourses: true,
};

// Generic page settings getter
async function getPageSetting<T>(singletonKey: string, defaults: T): Promise<T> {
  try {
    const reader = getReader();
    const data = await (reader.singletons as any)[singletonKey]?.read();
    if (!data) return defaults;
    return { ...defaults, ...data, hero: { ...(defaults as any).hero, ...(data.hero || {}) } } as T;
  } catch {
    return defaults;
  }
}

export const getCoursesPageSettings = () => getPageSetting<PageCoursesSettings>('pageCoursesSettings', DEFAULT_COURSES_PAGE);
export const getBlogPageSettings = () => getPageSetting<PageBlogSettings>('pageBlogSettings', DEFAULT_BLOG_PAGE);
export const getLabsPageSettings = () => getPageSetting<PageLabsSettings>('pageLabsSettings', DEFAULT_LABS_PAGE);
export const getRoadmapsPageSettings = () => getPageSetting<PageRoadmapsSettings>('pageRoadmapsSettings', DEFAULT_ROADMAPS_PAGE);
export const getTopicsPageSettings = () => getPageSetting<PageTopicsSettings>('pageTopicsSettings', DEFAULT_TOPICS_PAGE);
export const getLiveClassesPageSettings = () => getPageSetting<PageLiveClassesSettings>('pageLiveClassesSettings', DEFAULT_LIVE_CLASSES_PAGE);
export const getDashboardPageSettings = () => getPageSetting<PageDashboardSettings>('pageDashboardSettings', DEFAULT_DASHBOARD_PAGE);
