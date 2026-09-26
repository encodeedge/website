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
