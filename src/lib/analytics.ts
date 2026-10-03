/**
 * Google Analytics 4 (GA4) Client-side Helper
 * Provides intuitive, strongly-typed tracking for Educational/LMS interactions.
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    toggleAnalyticsOptOut?: () => void;
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
    page_title: document.title,
    timestamp: new Date().toISOString(),
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

// ─── Page & Navigation Tracking ──────────────────────────────────────────────

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
 * Track in-page section / anchor navigation (e.g. #blueprint-lab, TOC anchors, etc.).
 */
export function trackAnchorNavigation(anchorId: string, anchorLabel?: string): void {
  trackEvent('anchor_navigation', {
    anchor_id: anchorId,
    anchor_label: anchorLabel || anchorId,
  });
}

// ─── Reading & Content Engagement ────────────────────────────────────────────

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
 * Track reading time milestone (e.g. 30s, 60s, 120s, 300s).
 */
export function trackReadingMilestone(contentSlug: string, seconds: number, contentType: 'article' | 'lesson' = 'article'): void {
  trackEvent('reading_milestone', {
    content_slug: contentSlug,
    content_type: contentType,
    duration_seconds: seconds,
    duration_minutes: Math.round((seconds / 60) * 10) / 10,
  });
}

/**
 * Track article reaction (🔥 Insightful, 💡 Helpful, 🎯 Practical, 👏 Well Written).
 */
export function trackArticleReaction(postId: string, reactionKey: string, totalCount?: number): void {
  trackEvent('article_reaction', {
    post_id: postId,
    reaction_key: reactionKey,
    reaction_total: totalCount ?? 1,
  });
}

/**
 * Track article bookmark toggle.
 */
export function trackArticleBookmark(postId: string, isBookmarked: boolean): void {
  trackEvent('article_bookmark', {
    post_id: postId,
    action: isBookmarked ? 'bookmark_added' : 'bookmark_removed',
  });
}

/**
 * Track article share action (Twitter/X, LinkedIn, Copy Link).
 */
export function trackArticleShare(postId: string, platform: 'twitter' | 'linkedin' | 'copy_link' | 'native_share', targetUrl?: string): void {
  trackEvent('article_share', {
    post_id: postId,
    platform,
    target_url: targetUrl || window.location.href,
  });
}

/**
 * Track user text highlight in article.
 */
export function trackArticleHighlight(postId: string, textLength: number): void {
  trackEvent('article_highlight', {
    post_id: postId,
    highlight_length: textLength,
  });
}

/**
 * Track Table of Contents heading click.
 */
export function trackTocClick(postId: string, headingText: string, headingId?: string): void {
  trackEvent('toc_click', {
    post_id: postId,
    heading_text: headingText,
    heading_id: headingId || headingText,
  });
}

// ─── LMS & Course Studio Tracking ────────────────────────────────────────────

/**
 * Track course enrollment or view.
 */
export function trackCourseEnroll(courseId: string, courseTitle?: string, mode: string = 'free'): void {
  trackEvent('course_enroll', {
    course_id: courseId,
    course_title: courseTitle || courseId,
    enrollment_mode: mode,
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
 * Track star rating submitted on a lesson.
 */
export function trackLessonRating(courseId: string, lessonSlug: string, rating: number): void {
  trackEvent('lesson_rating', {
    course_id: courseId,
    lesson_slug: lessonSlug,
    rating,
  });
}

/**
 * Track LMS Studio tab switch (About, Discussions, Notes, Resources).
 */
export function trackLmsTabSwitch(courseId: string, lessonSlug: string, tabName: string): void {
  trackEvent('lms_tab_switch', {
    course_id: courseId,
    lesson_slug: lessonSlug,
    tab_name: tabName,
  });
}

/**
 * Track LMS Studio mode switcher (Learn vs Practice).
 */
export function trackLmsModeSwitch(mode: 'learn' | 'practice', courseId?: string): void {
  trackEvent('lms_mode_switch', {
    mode,
    course_id: courseId || 'general',
  });
}

/**
 * Track notes exported to Markdown (.md).
 */
export function trackNotesExport(courseId: string, lessonSlug: string, noteLength?: number): void {
  trackEvent('notes_export', {
    course_id: courseId,
    lesson_slug: lessonSlug,
    character_count: noteLength ?? 0,
  });
}

/**
 * Track quiz completion with score and pass/fail metric.
 */
export function trackQuizAttempt(quizId: string, score: number, maxScore: number, passed: boolean, timeSeconds?: number): void {
  trackEvent('quiz_submission', {
    quiz_id: quizId,
    score,
    max_score: maxScore,
    score_percentage: Math.round((score / Math.max(1, maxScore)) * 100),
    passed,
    time_taken_seconds: timeSeconds,
  });
}

// ─── Code Execution & Sandbox Tracking ───────────────────────────────────────

/**
 * Track interactive code lab execution (Python runner, WebAssembly, or Simulator).
 */
export function trackCodeExecution(language: string, snippetTitle?: string, success: boolean = true, timeMs?: number): void {
  trackEvent('code_execution', {
    language,
    snippet_title: snippetTitle || 'interactive_runner',
    success,
    execution_time_ms: timeMs,
  });
}

/**
 * Backwards compatibility for existing code.
 */
export function trackCodeRun(language: string, labName?: string): void {
  trackCodeExecution(language, labName, true);
}

/**
 * Track code copied from an interactive snippet or runner.
 */
export function trackCodeCopy(snippetId: string, language: string = 'python'): void {
  trackEvent('code_copy', {
    snippet_id: snippetId,
    language,
  });
}

// ─── System Design & Blueprint Lab Tracking ──────────────────────────────────

/**
 * Track system design blueprint pipeline verification attempt.
 */
export function trackBlueprintValidate(
  scenarioId: string,
  scenarioTitle: string,
  success: boolean,
  accumulatedLatencyMs?: number,
  mistakeIndex?: number
): void {
  trackEvent('blueprint_validate', {
    scenario_id: scenarioId,
    scenario_title: scenarioTitle,
    success,
    accumulated_latency_ms: accumulatedLatencyMs,
    mistake_slot_index: mistakeIndex,
  });
}

/**
 * Track blueprint scenario selection.
 */
export function trackBlueprintScenarioSelect(scenarioId: string, scenarioTitle: string): void {
  trackEvent('blueprint_scenario_select', {
    scenario_id: scenarioId,
    scenario_title: scenarioTitle,
  });
}

/**
 * Track interactive lab simulator switch in LabsHub.
 */
export function trackLabView(labId: string, labTitle: string, category?: string): void {
  trackEvent('lab_view', {
    lab_id: labId,
    lab_title: labTitle,
    lab_category: category || 'General',
  });
}

// ─── Search & Discovery Tracking ─────────────────────────────────────────────

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
 * Track click on a search result.
 */
export function trackSearchSelect(query: string, itemTitle: string, itemType: string, itemUrl: string): void {
  trackEvent('search_result_select', {
    search_term: query.trim(),
    item_title: itemTitle,
    item_type: itemType,
    item_url: itemUrl,
  });
}

// ─── Gamification & Utility Tracking ─────────────────────────────────────────

/**
 * Track gamification achievement unlock.
 */
export function trackAchievementUnlock(achievementId: string, title: string): void {
  trackEvent('achievement_unlocked', {
    achievement_id: achievementId,
    achievement_title: title,
  });
}

/**
 * Track file or asset download.
 */
export function trackFileDownload(fileName: string, fileExtension: string, fileUrl: string): void {
  trackEvent('file_download', {
    file_name: fileName,
    file_extension: fileExtension,
    link_url: fileUrl,
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
