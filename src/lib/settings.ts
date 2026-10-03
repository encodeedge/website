import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config.ts';

let readerInstance: ReturnType<typeof createReader> | null = null;

function getReader() {
  if (!readerInstance) {
    if (typeof process === 'undefined' || typeof process.cwd !== 'function') {
      throw new Error('Keystatic reader requires a Node.js filesystem environment.');
    }
    const cwd = process.cwd();
    if (!cwd) {
      throw new Error('Invalid working directory for Keystatic reader.');
    }
    readerInstance = createReader(cwd, keystaticConfig);
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
  showCoffeeButton: boolean;
  coffeeButtonText: string;
  coffeeButtonUrl: string;
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
  showCoffeeButton: true,
  coffeeButtonText: 'Buy Me a Coffee',
  coffeeButtonUrl: 'https://buymeacoffee.com/encodeedge',
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
      showCoffeeButton: (nav as any).showCoffeeButton ?? DEFAULT_NAVIGATION_SETTINGS.showCoffeeButton,
      coffeeButtonText: (nav as any).coffeeButtonText || DEFAULT_NAVIGATION_SETTINGS.coffeeButtonText,
      coffeeButtonUrl: (nav as any).coffeeButtonUrl || DEFAULT_NAVIGATION_SETTINGS.coffeeButtonUrl,
    };
  } catch (error) {
    console.warn('[Keystatic Settings] Failed to load navigationSettings, using defaults:', error);
    return DEFAULT_NAVIGATION_SETTINGS;
  }
}

// ─── SEO Settings ───────────────────────────────────────────────────────────

export interface SeoSettings {
  defaultOgImage?: string;
  twitterHandle: string;
  defaultKeywords: string[];
  googleSiteVerification?: string;
  robotsNoIndex: boolean;
  schemaOrgType: 'EducationalOrganization' | 'Organization' | 'WebSite';
}

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  defaultOgImage: '/assets/og-image.jpg',
  twitterHandle: '@encodeedge',
  defaultKeywords: [
    'Machine Learning',
    'Deep Learning',
    'Python',
    'Artificial Intelligence',
    'Data Science',
    'Neural Networks',
    'Algorithms',
    'EncodeEdge',
  ],
  googleSiteVerification: '',
  robotsNoIndex: false,
  schemaOrgType: 'EducationalOrganization',
};

export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const reader = getReader();
    const seo = await reader.singletons.seoSettings.read();
    if (!seo) return DEFAULT_SEO_SETTINGS;

    const rawKeywords = seo.defaultKeywords || '';
    const defaultKeywords = rawKeywords
      ? rawKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : DEFAULT_SEO_SETTINGS.defaultKeywords;

    return {
      defaultOgImage: seo.defaultOgImage || DEFAULT_SEO_SETTINGS.defaultOgImage,
      twitterHandle: seo.twitterHandle || DEFAULT_SEO_SETTINGS.twitterHandle,
      defaultKeywords,
      googleSiteVerification: seo.googleSiteVerification || DEFAULT_SEO_SETTINGS.googleSiteVerification,
      robotsNoIndex: !!seo.robotsNoIndex,
      schemaOrgType: (seo.schemaOrgType as any) || DEFAULT_SEO_SETTINGS.schemaOrgType,
    };
  } catch (error) {
    console.warn('[Keystatic Settings] Failed to load seoSettings, using defaults:', error);
    return DEFAULT_SEO_SETTINGS;
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
    trackEnhancedGeo: boolean;
  };
  googleTagManager: {
    enabled: boolean;
    containerId: string;
    trackEnhancedGeo: boolean;
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
  membership: {
    enabled: boolean;
    provider: 'polar' | 'stripe' | 'lemonsqueezy' | 'custom';
    proMonthlyPrice: number;
    proAnnualPrice: number;
    lifetimePrice: number;
    proMonthlyCheckoutUrl: string;
    proAnnualCheckoutUrl: string;
    lifetimeCheckoutUrl: string;
    customerPortalUrl: string;
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
    trackEnhancedGeo: true,
  },
  googleTagManager: {
    enabled: true,
    containerId: 'GTM-NX6PVH5K',
    trackEnhancedGeo: true,
  },
  crispChat: {
    enabled: false,
    websiteId: '',
  },
  convertKit: {
    enabled: false,
    formId: '',
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
  membership: {
    enabled: true,
    provider: 'polar',
    proMonthlyPrice: 19,
    proAnnualPrice: 190,
    lifetimePrice: 399,
    proMonthlyCheckoutUrl: 'https://polar.sh/encodeedge/subscriptions',
    proAnnualCheckoutUrl: 'https://polar.sh/encodeedge/subscriptions?cycle=yearly',
    lifetimeCheckoutUrl: 'https://polar.sh/encodeedge/products/lifetime-access',
    customerPortalUrl: 'https://polar.sh/purchases',
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
    const gtm = (integrations as any).googleTagManager;
    const memb = (integrations as any).membership;
    return {
      googleAnalytics: {
        enabled: ga?.enabled ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.enabled,
        measurementId: ga?.measurementId || DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.measurementId,
        debugMode: ga?.debugMode ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.debugMode,
        excludeInternalTraffic: ga?.excludeInternalTraffic ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.excludeInternalTraffic,
        sendPageViewOnLoad: ga?.sendPageViewOnLoad ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.sendPageViewOnLoad,
        trackEngagement: ga?.trackEngagement ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.trackEngagement,
        trackEnhancedGeo: ga?.trackEnhancedGeo ?? DEFAULT_INTEGRATIONS_SETTINGS.googleAnalytics.trackEnhancedGeo,
      },
      googleTagManager: {
        enabled: gtm?.enabled ?? DEFAULT_INTEGRATIONS_SETTINGS.googleTagManager.enabled,
        containerId: gtm?.containerId || DEFAULT_INTEGRATIONS_SETTINGS.googleTagManager.containerId,
        trackEnhancedGeo: gtm?.trackEnhancedGeo ?? DEFAULT_INTEGRATIONS_SETTINGS.googleTagManager.trackEnhancedGeo,
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
      membership: {
        enabled: memb?.enabled ?? DEFAULT_INTEGRATIONS_SETTINGS.membership.enabled,
        provider: memb?.provider || DEFAULT_INTEGRATIONS_SETTINGS.membership.provider,
        proMonthlyPrice: memb?.proMonthlyPrice ?? DEFAULT_INTEGRATIONS_SETTINGS.membership.proMonthlyPrice,
        proAnnualPrice: memb?.proAnnualPrice ?? DEFAULT_INTEGRATIONS_SETTINGS.membership.proAnnualPrice,
        lifetimePrice: memb?.lifetimePrice ?? DEFAULT_INTEGRATIONS_SETTINGS.membership.lifetimePrice,
        proMonthlyCheckoutUrl: memb?.proMonthlyCheckoutUrl || DEFAULT_INTEGRATIONS_SETTINGS.membership.proMonthlyCheckoutUrl,
        proAnnualCheckoutUrl: memb?.proAnnualCheckoutUrl || DEFAULT_INTEGRATIONS_SETTINGS.membership.proAnnualCheckoutUrl,
        lifetimeCheckoutUrl: memb?.lifetimeCheckoutUrl || DEFAULT_INTEGRATIONS_SETTINGS.membership.lifetimeCheckoutUrl,
        customerPortalUrl: memb?.customerPortalUrl || DEFAULT_INTEGRATIONS_SETTINGS.membership.customerPortalUrl,
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
  newsSources?: NewsSourceConfig[];
  podcastSources?: PodcastSourceConfig[];
  competitionSources: CompetitionSourceConfig[];
  displaySettings: {
    homepageNewsLimit?: number;
    homepagePodcastLimit?: number;
    enableLiveClientSync?: boolean;
    autoSyncOnPageLoad?: boolean;
    enableCompetitionsSync: boolean;
    autoSyncCompetitions: boolean;
    hideCompletedCompetitions: boolean;
    maxCompetitionsDisplay: number;
    feedTimeoutMs: number;
  };
}

export const DEFAULT_SOURCES_SETTINGS: SourcesSettings = {
  newsSources: [],
  podcastSources: [],
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

    const rawNews = (sources as any).newsSources as any[];
    const newsSources: NewsSourceConfig[] = Array.isArray(rawNews) && rawNews.length > 0
      ? rawNews.map((s: any) => ({
          name: s.name || 'Untitled Feed',
          url: s.url || '',
          category: s.category || 'Frontier AI',
          badgeColor: s.badgeColor || 'rose',
          fetchLimit: Number(s.fetchLimit) || 3,
          enabled: s.enabled !== false,
        }))
      : [];

    const rawPodcasts = (sources as any).podcastSources as any[];
    const podcastSources: PodcastSourceConfig[] = Array.isArray(rawPodcasts) && rawPodcasts.length > 0
      ? rawPodcasts.map((p: any) => ({
          title: p.title || 'Untitled Podcast',
          feedUrl: p.feedUrl || '',
          siteUrl: p.siteUrl || '',
          badgeText: p.badgeText || 'Practical AI',
          isSpotlight: p.isSpotlight !== false,
          enabled: p.enabled !== false,
        }))
      : [];

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
        homepageNewsLimit: Number(ds?.homepageNewsLimit) || undefined,
        homepagePodcastLimit: Number(ds?.homepagePodcastLimit) || undefined,
        enableLiveClientSync: ds?.enableLiveClientSync ?? false,
        autoSyncOnPageLoad: ds?.autoSyncOnPageLoad ?? false,
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
  showInteractiveLab: boolean;
  interactiveLabHeading: string;
  interactiveLabSubheading: string;
  interactiveLabEyebrow: string;
  showGamificationBar: boolean;
  showFlashcardsDrawer: boolean;
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

export interface PageSystemDesignSettings {
  hero: {
    eyebrow: string;
    heading: string;
    subheading: string;
    badge1Number: string;
    badge1Label: string;
    badge2Number: string;
    badge2Label: string;
    badge3Number: string;
    badge3Label: string;
  };
  goldenPrinciples: {
    number: string;
    title: string;
    description: string;
  }[];
  bottomCta: {
    heading: string;
    subheading: string;
    primaryButtonText: string;
    primaryButtonUrl: string;
    secondaryButtonText: string;
    secondaryButtonUrl: string;
  };
  seoTitle?: string;
  seoDescription?: string;
}

// Defaults
export const DEFAULT_COURSES_PAGE: PageCoursesSettings = {
  hero: { eyebrow: 'EncodeEdge Academy', heading: 'Build Real AI Skills', subheading: 'Master modern Artificial Intelligence, Machine Learning, Deep Learning, and Python through hands-on, production-grade courses.', ctaLabel: 'Browse All Courses', ctaUrl: '#courses', secondaryCtaLabel: 'View Roadmaps', secondaryCtaUrl: '/roadmaps' },
  stats: [{ value: '12+', label: 'Courses' }, { value: '100+', label: 'Lessons' }, { value: '50+', label: 'Quizzes' }],
  showFeaturedSection: true, showBatchesSection: true, showInstructorsSection: true, maxCoursesShown: 0,
  showInteractiveLab: true,
  interactiveLabHeading: 'Try Live Algorithms in the Browser',
  interactiveLabSubheading: 'Test real PyTorch autograd computations, gradient descent steps, and semantic RAG cosine similarity with zero local environment setup.',
  interactiveLabEyebrow: 'Hands-On Engineering',
  showGamificationBar: true,
  showFlashcardsDrawer: true,
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
export const DEFAULT_SYSTEM_DESIGN_PAGE: PageSystemDesignSettings = {
  hero: {
    eyebrow: 'AWS Well-Architected Framework for AI/ML',
    heading: 'AI & ML System Design Architecture Center',
    subheading: 'Real-world production engineering reference architectures. Design distributed RAG systems, sub-45ms recommendation funnels, and continuous MLOps pipelines with interactive AWS architectural blueprints.',
    badge1Number: '4',
    badge1Label: 'Reference Blueprints',
    badge2Number: '<45ms',
    badge2Label: 'Production SLAs',
    badge3Number: 'Interactive',
    badge3Label: 'Graph Canvas',
  },
  goldenPrinciples: [
    {
      number: '01',
      title: 'The Funnel Principle of ML Retrieval',
      description: 'Never run heavy neural models on the entire database. Structure every retrieval pipeline into coarse-to-fine filtering: 10M -> 2,000 (Two-Tower / HNSW) -> 100 (LightGBM) -> 10 (Cross-Encoder / LLM).'
    },
    {
      number: '02',
      title: 'Strict Latency Budget Partitioning',
      description: 'Allocate hard millisecond timeouts to every network hop and model inference step. If the reranker exceeds 70ms, trigger circuit breakers to fallback to coarse ANN scores.'
    },
    {
      number: '03',
      title: 'Prevent Online-Offline Feature Skew',
      description: 'Training and production inference must source features from the same unified feature store. Log exact point-in-time snapshot features during training to eliminate data leakage.'
    },
    {
      number: '04',
      title: 'Graceful Degradation & Fallback Heuristics',
      description: 'When GPU clusters encounter backpressure or outages, fall back gracefully to lightweight quantized models or popularity-based heuristics instead of throwing 500 errors.'
    }
  ],
  bottomCta: {
    heading: 'Continue Learning AI Engineering',
    subheading: 'Dive into step-by-step algorithms, loss surface mathematics, and complete code walkthroughs.',
    primaryButtonText: 'Explore Courses',
    primaryButtonUrl: '/courses',
    secondaryButtonText: 'All Interactive Labs',
    secondaryButtonUrl: '/labs',
  },
  seoTitle: 'AI & ML System Design: Reference Architectures & Blueprint Lab | EncodeEdge',
  seoDescription: 'Master enterprise Machine Learning system design. Explore production reference architectures for RAG, real-time recommendations, distributed LLM serving, and continuous MLOps with interactive AWS-style dataflow labs.',
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
export const getSystemDesignPageSettings = () => getPageSetting<PageSystemDesignSettings>('pageSystemDesignSettings', DEFAULT_SYSTEM_DESIGN_PAGE);

// ─── AI Article Synthesizer Settings ────────────────────────────────────────

export interface AiBlogGeneratorSettings {
  sourceUrls: string[];
  targetTopic: string;
  writingTone: 'engineer' | 'tutorial' | 'architecture';
  modelPreference: string;
  additionalDirectives?: string;
  targetBranch?: string;
  autoCreatePullRequest: boolean;
  lastGeneratedSlug?: string;
}

export const DEFAULT_AI_GENERATOR_SETTINGS: AiBlogGeneratorSettings = {
  sourceUrls: [],
  targetTopic: 'machine-learning',
  writingTone: 'engineer',
  modelPreference: '@cf/meta/llama-3.3-70b-instruct',
  additionalDirectives: '',
  targetBranch: 'drafts/ai-articles',
  autoCreatePullRequest: false,
  lastGeneratedSlug: '',
};


export async function getAiBlogGeneratorSettings(): Promise<AiBlogGeneratorSettings> {
  try {
    const reader = getReader();
    const data = await (reader.singletons as any).aiBlogGenerator?.read();
    if (!data) return DEFAULT_AI_GENERATOR_SETTINGS;
    return {
      ...DEFAULT_AI_GENERATOR_SETTINGS,
      ...data,
      sourceUrls: Array.isArray(data.sourceUrls) ? data.sourceUrls.filter(Boolean) : [],
    };
  } catch {
    return DEFAULT_AI_GENERATOR_SETTINGS;
  }
}
