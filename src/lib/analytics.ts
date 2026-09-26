/**
 * Google Analytics 4 (GA4) Client-side Helper
 * Provides intuitive, strongly-typed tracking for Educational/LMS interactions.
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const OPT_OUT_KEY = 'encodeedge_ga_optout';

/**
 * Check if the current browser session has opted out of analytics tracking
 * (e.g. for administrators or developers wanting to completely hide their own views).
 */
export function isAnalyticsOptedOut(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(OPT_OUT_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Enable or disable analytics opt-out for this browser.
 */
export function setAnalyticsOptOut(optOut: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (optOut) {
      localStorage.setItem(OPT_OUT_KEY, 'true');
      console.info('[GA4] Analytics tracking disabled for this browser.');
    } else {
      localStorage.removeItem(OPT_OUT_KEY);
      console.info('[GA4] Analytics tracking enabled for this browser.');
    }
  } catch {}
}

/**
 * Core event tracking function.
 * Dispatches to window.gtag and window.dataLayer with safe fallbacks and optional dev logging.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;
  if (isAnalyticsOptedOut()) return;

  const enrichedParams = {
    ...params,
    page_location: window.location.href,
    page_path: window.location.pathname,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, enrichedParams);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...enrichedParams,
    });
  }

  // Developer feedback in local development
  if (import.meta.env.DEV) {
    console.debug(`%c[GA4 Event] %c${eventName}`, 'color: #10b981; font-weight: bold;', 'color: inherit;', enrichedParams);
  }
}

/**
 * Track custom page view (useful for SPA transitions and drawer/modal route changes).
 */
export function trackPageView(pageTitle?: string, pagePath?: string): void {
  trackEvent('page_view', {
    page_title: pageTitle || document.title,
    page_location: window.location.href,
    page_path: pagePath || window.location.pathname,
  });
}

/**
 * Track reading depth on articles and lessons (25%, 50%, 75%, 90%, 100%).
 */
export function trackReadingDepth(contentSlug: string, depthPercent: number, contentType: 'article' | 'lesson' = 'article'): void {
  trackEvent('scroll_depth', {
    content_slug: contentSlug,
    content_type: contentType,
    depth_percent: depthPercent,
  });
}

/**
 * Track quiz completion with score and pass/fail metric.
 */
export function trackQuizAttempt(quizId: string, score: number, maxScore: number, passed: boolean): void {
  trackEvent('quiz_submission', {
    quiz_id: quizId,
    score,
    max_score: maxScore,
    score_percentage: Math.round((score / Math.max(1, maxScore)) * 100),
    passed,
  });
}

/**
 * Track when a user marks a course lesson as completed.
 */
export function trackLessonCompletion(courseId: string, lessonSlug: string, lessonTitle?: string): void {
  trackEvent('lesson_complete', {
    course_id: courseId,
    lesson_slug: lessonSlug,
    lesson_title: lessonTitle || lessonSlug,
  });
}

/**
 * Track search queries from global search modal.
 */
export function trackSearchQuery(query: string, resultCount: number): void {
  if (!query || query.trim().length < 2) return;
  trackEvent('search', {
    search_term: query.trim(),
    results_count: resultCount,
  });
}

/**
 * Track theme change (dark vs light mode).
 */
export function trackThemeChange(theme: 'dark' | 'light' | 'system'): void {
  trackEvent('theme_change', {
    theme_preference: theme,
  });
}

/**
 * Track interactive code lab execution.
 */
export function trackCodeRun(language: string, labName?: string): void {
  trackEvent('code_execution', {
    language,
    lab_name: labName || 'interactive_runner',
  });
}

/**
 * Track gamification achievement unlock.
 */
export function trackAchievementUnlock(achievementId: string, title: string): void {
  trackEvent('achievement_unlocked', {
    achievement_id: achievementId,
    achievement_title: title,
  });
}
