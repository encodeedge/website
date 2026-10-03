// keystatic.config.ts
import React from 'react';
import { config, fields, collection, singleton } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

export const mdxComponents = {
  Callout: wrapper({
    label: 'Callout Box',
    description: 'Highlighted callout note, tip, warning, or alert',
    schema: {
      kind: fields.select({
        label: 'Type',
        options: [
          { label: 'Info (Blue)', value: 'info' },
          { label: 'Tip (Green)', value: 'tip' },
          { label: 'Warning (Amber)', value: 'warning' },
          { label: 'Danger (Red)', value: 'danger' },
          { label: 'Success (Lime)', value: 'success' },
        ],
        defaultValue: 'info',
      }),
      title: fields.text({ label: 'Title (Optional)' }),
    },
  }),
  VideoEmbed: block({
    label: 'Video Embed',
    description: 'Embed a YouTube or Vimeo video',
    schema: {
      url: fields.text({ label: 'Video URL', validation: { isRequired: true } }),
      caption: fields.text({ label: 'Caption (Optional)' }),
    },
  }),
  AudioPlayer: block({
    label: 'Podcast / Audio Player',
    description: 'Embed an audio/podcast player widget',
    schema: {
      title: fields.text({ label: 'Audio / Episode Title', validation: { isRequired: true } }),
      audioUrl: fields.text({ label: 'Audio File URL (.mp3 / stream)' }),
      duration: fields.text({ label: 'Duration (e.g. 15 min)' }),
      host: fields.text({ label: 'Host / Creator Name' }),
      description: fields.text({ label: 'Short Description', multiline: true }),
    },
  }),
  QuizBlock: block({
    label: 'Interactive Quiz / Question',
    description: 'Test reader knowledge with an interactive question',
    schema: {
      question: fields.text({ label: 'Question', validation: { isRequired: true } }),
      option1: fields.text({ label: 'Option A', validation: { isRequired: true } }),
      option2: fields.text({ label: 'Option B', validation: { isRequired: true } }),
      option3: fields.text({ label: 'Option C' }),
      option4: fields.text({ label: 'Option D' }),
      correctAnswer: fields.select({
        label: 'Correct Option',
        options: [
          { label: 'Option A', value: '0' },
          { label: 'Option B', value: '1' },
          { label: 'Option C', value: '2' },
          { label: 'Option D', value: '3' },
        ],
        defaultValue: '0',
      }),
      explanation: fields.text({ label: 'Explanation (Shown after answering)', multiline: true }),
    },
  }),
  NewsletterCTA: block({
    label: 'Newsletter CTA',
    description: 'In-article newsletter subscription box',
    schema: {
      title: fields.text({ label: 'Heading' }),
      description: fields.text({ label: 'Description', multiline: true }),
      buttonText: fields.text({ label: 'Button Label' }),
    },
  }),
  StatCard: block({
    label: 'Stat / Takeaway Card',
    description: 'Highlight a key metric or takeaway',
    schema: {
      statValue: fields.text({ label: 'Stat Value / Metric (e.g. 98.5% or 4.2x)', validation: { isRequired: true } }),
      label: fields.text({ label: 'Label', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', multiline: true }),
      accent: fields.select({
        label: 'Accent Color',
        options: [
          { label: 'Lime Yellow', value: 'lime' },
          { label: 'Rose Pink', value: 'rose' },
          { label: 'Sky Blue', value: 'blue' },
          { label: 'Lavender Purple', value: 'lavender' },
          { label: 'Peach Orange', value: 'peach' },
        ],
        defaultValue: 'lime',
      }),
    },
  }),
  CodeSnippet: block({
    label: 'Code Snippet Block',
    description: 'Syntax-highlighted code block with title and copy button',
    schema: {
      language: fields.text({ label: 'Language (e.g. python, typescript, bash)' }),
      filename: fields.text({ label: 'Filename / Title' }),
      code: fields.text({ label: 'Code Content', multiline: true, validation: { isRequired: true } }),
    },
  }),
  ReferenceCard: block({
    label: 'Resource / Reference Card',
    description: 'Recommend a book, course, paper, or link',
    schema: {
      title: fields.text({ label: 'Resource Title', validation: { isRequired: true } }),
      url: fields.text({ label: 'URL', validation: { isRequired: true } }),
      type: fields.select({
        label: 'Type',
        options: [
          { label: 'Link', value: 'link' },
          { label: 'Book', value: 'book' },
          { label: 'Course', value: 'course' },
          { label: 'Research Paper', value: 'paper' },
          { label: 'Documentation', value: 'documentation' },
        ],
        defaultValue: 'link',
      }),
      author: fields.text({ label: 'Author / Publisher' }),
      description: fields.text({ label: 'Description', multiline: true }),
    },
  }),
  InteractiveLab: block({
    label: 'Interactive Lab Simulator',
    description: 'Embed a hands-on visual simulator widget',
    schema: {
      type: fields.select({
        label: 'Simulator Type',
        options: [
          { label: 'Neural Network & Activation Playground', value: 'neural-playground' },
          { label: 'Loss Surface & Gradient Descent Optimizer Lab', value: 'gradient-descent' },
          { label: 'CPython Stack & Heap Memory Explorer', value: 'memory-explorer' },
          { label: 'ML Pipeline System Design Ordering Challenge', value: 'pipeline-puzzle' },
          { label: 'Transformer Self-Attention Visualizer', value: 'attention-visualizer' },
          { label: '2D Convolution & Feature Maps Lab', value: 'convolution-visualizer' },
          { label: 'AI Model Router & Latency Simulator', value: 'model-router' },
          { label: 'Math Decoder (Symbols & LaTeX)', value: 'math-decoder' },
        ],
        defaultValue: 'neural-playground',
      }),
    },
  }),
  MathFormula: block({
    label: 'Math Equation / LaTeX Formula',
    description: 'LaTeX mathematical equation display block with caption',
    schema: {
      formula: fields.text({ label: 'LaTeX Equation (e.g. \\nabla L(\\theta) = ...)', multiline: true, validation: { isRequired: true } }),
      caption: fields.text({ label: 'Caption / Formula Name (Optional)' }),
    },
  }),
  CodeSandbox: block({
    label: 'Interactive Code Sandbox',
    description: 'Embed an in-browser code runner with terminal output',
    schema: {
      snippetId: fields.text({ label: 'Initial Snippet ID (Optional)' }),
      category: fields.select({
        label: 'Category Scope',
        options: [
          { label: 'Auto (Scoped to Course / Lesson)', value: 'auto' },
          { label: 'Python Systems', value: 'Python Systems' },
          { label: 'Deep Learning', value: 'Deep Learning' },
          { label: 'Machine Learning', value: 'Machine Learning' },
          { label: 'LLMs & RAG', value: 'LLMs & RAG' },
        ],
        defaultValue: 'auto',
      }),
      title: fields.text({ label: 'Title Override (Optional)' }),
    },
  }),
};

const siteUrl = process.env.PUBLIC_SITE_URL || 'https://www.encodeedge.com';
const previewBase = (process.env.NODE_ENV === 'development' || process.env.KEYSTATIC_LOCAL)
  ? ''
  : siteUrl;

export default config({
  storage: (process.env.NODE_ENV === 'development' || process.env.KEYSTATIC_LOCAL)
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: (process.env.KEYSTATIC_GITHUB_REPO || 'encodeedge/website') as `${string}/${string}`,
        branchPrefix: process.env.KEYSTATIC_BRANCH_PREFIX || undefined,
      },

  ui: {
    brand: {
      name: 'EncodeEdge',
      mark: () => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('return_to_ai_generator') === 'true') {
          sessionStorage.removeItem('return_to_ai_generator');
          window.location.href = '/admin/ai-generator';
        }
        return React.createElement(
          'a',
          {
            href: '/admin/ai-generator',
            target: '_blank',
            rel: 'noreferrer',
            title: 'Generate AI Blog Post Draft from URLs',
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#ffffff',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.35)',
            },
          },
          '⚡ AI Drafts'
        );
      },
    },
    navigation: {
      'Site Settings': ['siteSettings', 'featureFlags', 'announcementBanner', 'coffeeWidget'],
      'Competition Feeds': ['sources'],
      'Design & Navigation': ['navigationSettings', 'footerSettings'],
      'Marketing': ['seoSettings', 'integrationsSettings'],
      'Content': ['blogs', 'faqs', 'roadmaps', 'glossary', 'systemDesignArchitectures'],
      'Labs & Competitions': ['labs', 'competitions', 'systemDesignScenarios', 'systemDesignProblems'],
      'Components': ['components'],
      'LMS Core': ['courses', 'batches', 'instructors', 'liveClasses'],
      'LMS Material': ['lessons', 'quizzes', 'assignments'],
      'LMS Administration': ['certificates'],
      'AI Assistant': ['aiBlogGenerator'],
      'Page Settings': ['pageCoursesSettings', 'pageBlogSettings', 'pageLabsSettings', 'pageRoadmapsSettings', 'pageTopicsSettings', 'pageLiveClassesSettings', 'pageDashboardSettings', 'pageSystemDesignSettings'],
    }


  },

  singletons: {
    // ─── Site-wide Settings ────────────────────────────────────────────────
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings/site',
      schema: {
        siteName: fields.text({ label: 'Site Name', defaultValue: 'EncodeEdge' }),
        siteTagline: fields.text({ label: 'Tagline / Hero Subtitle', multiline: false }),
        siteDescription: fields.text({
          label: 'Default Meta Description',
          multiline: true,
        }),
        // ── Brand Colors & Palette Presets ─────────────────────────────────
        themePreset: fields.select({
          label: 'Theme & Palette Preset',
          description: 'Pick an instant coordinated color palette or choose "Custom Hex" to define your own below.',
          options: [
            { label: '🟣 Indigo Modern (Primary #6366f1, Accent #E5E795)', value: 'indigo' },
            { label: '🟢 Emerald Tech (Primary #10b981, Accent #38bdf8)', value: 'emerald' },
            { label: '🟣 Electric Violet (Primary #8b5cf6, Accent #f43f5e)', value: 'violet' },
            { label: '🟠 Sunset Amber (Primary #f59e0b, Accent #ec4899)', value: 'amber' },
            { label: '🔵 Cyber Cyan (Primary #06b6d4, Accent #a855f7)', value: 'cyan' },
            { label: '🔴 Crimson Ruby (Primary #ef4444, Accent #f59e0b)', value: 'crimson' },
            { label: '🎨 Custom Hex (Use custom hex codes specified below)', value: 'custom' },
          ],
          defaultValue: 'indigo',
        }),
        primaryColor: fields.text({
          label: 'Primary Brand Color (Hex)',
          description: 'Hex code (e.g. #6366f1). Used for buttons, active items, and primary accents.',
          defaultValue: '#6366f1',
          validation: {
            pattern: {
              regex: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
              message: 'Please enter a valid hex color code, e.g. #6366f1',
            },
          },
        }),
        accentColor: fields.text({
          label: 'Accent Brand Color (Hex)',
          description: 'Hex code (e.g. #E5E795). Used for secondary badges and highlight pills.',
          defaultValue: '#E5E795',
          validation: {
            pattern: {
              regex: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
              message: 'Please enter a valid hex color code, e.g. #E5E795',
            },
          },
        }),
        backgroundColor: fields.text({
          label: 'Background Color - Light Mode (Hex)',
          description: 'Hex code for light mode background (e.g. #ffffff).',
          defaultValue: '#ffffff',
          validation: {
            pattern: {
              regex: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
              message: 'Please enter a valid hex color code, e.g. #ffffff',
            },
          },
        }),
        darkBackgroundColor: fields.text({
          label: 'Background Color - Dark Mode (Hex)',
          description: 'Hex code for dark mode background (e.g. #09090b).',
          defaultValue: '#09090b',
          validation: {
            pattern: {
              regex: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
              message: 'Please enter a valid hex color code, e.g. #09090b',
            },
          },
        }),
        // ── Logo & Favicon ──────────────────────────────────────────────────
        logo: fields.image({
          label: 'Site Logo',
          publicPath: '/logos/',
          directory: 'public/logos',
        }),
        favicon: fields.image({
          label: 'Favicon',
          publicPath: '/',
          directory: 'public',
        }),
        socialLinks: fields.object({
          github: fields.text({ label: 'GitHub URL' }),
          twitter: fields.text({ label: 'X / Twitter URL' }),
          linkedin: fields.text({ label: 'LinkedIn URL' }),
          youtube: fields.text({ label: 'YouTube URL' }),
        }, { label: 'Social Links' }),
      },
    }),

    // ─── Feature Flags ───────────────────────────────────────────────────────
    featureFlags: singleton({
      label: 'Feature Flags',
      path: 'src/content/settings/features',
      schema: {
        // ── Newsletter Banner ─────────────────────────────────────────────
        newsletterBanner: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Newsletter Banner',
            description: 'Show the sticky newsletter subscribe banner on all pages (appears after 30s).',
            defaultValue: true,
          }),
          headline: fields.text({
            label: 'Headline',
            defaultValue: 'Join 2,000+ learners getting weekly AI & ML insights',
          }),
          subtext: fields.text({
            label: 'Subtext',
            defaultValue: 'No spam. Unsubscribe anytime. Free forever.',
          }),
          buttonLabel: fields.text({
            label: 'CTA Button Label',
            defaultValue: 'Join free',
          }),
          delaySeconds: fields.number({
            label: 'Show Delay (seconds)',
            description: 'How long to wait before showing the banner.',
            defaultValue: 30,
          }),
        }, { label: 'Newsletter Banner' }),

        // ── Global Search ──────────────────────────────────────────────────
        globalSearch: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Global Search (⌘K)',
            description: 'Show the search trigger in the navbar.',
            defaultValue: true,
          }),
          placeholder: fields.text({
            label: 'Search Input Placeholder',
            defaultValue: 'Search articles, roadmaps, quizzes, courses...',
          }),
        }, { label: 'Global Search' }),

        // ── AI Ask-the-Article ─────────────────────────────────────────────
        articleAI: fields.object({
          enabled: fields.checkbox({
            label: 'Enable AI Ask-the-Article',
            description: 'Show the "Ask AI" button on blog posts. Requires PUBLIC_GEMINI_API_KEY env var.',
            defaultValue: true,
          }),
          buttonLabel: fields.text({
            label: 'Button Label',
            defaultValue: 'Ask AI',
          }),
          welcomeMessage: fields.text({
            label: 'AI Tutor Welcome Message',
            multiline: true,
            defaultValue: "Hi! I'm your AI tutor for this article. Ask me anything about this topic! 🧠",
          }),
        }, { label: 'AI Ask-the-Article' }),

        // ── Gamification & Achievements ────────────────────────────────────
        gamification: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Gamification & Achievements',
            description: 'Show the XP/badge floating button and achievement panel.',
            defaultValue: true,
          }),
          xpPerCorrectAnswer: fields.number({
            label: 'XP per Correct Quiz Answer',
            defaultValue: 10,
          }),
          xpBonusPerfectQuiz: fields.number({
            label: 'Bonus XP for Perfect Quiz',
            defaultValue: 25,
          }),
          streakEnabled: fields.checkbox({
            label: 'Enable Day Streak Tracking',
            defaultValue: true,
          }),
          quizMinimumPassPercentage: fields.number({
            label: 'Default Quiz Minimum Pass %',
            description: 'Default score % needed to mark quiz completed (0 = complete on submit even if wrong answers).',
            defaultValue: 0,
          }),
        }, { label: 'Gamification & Achievements' }),

        // ── Spaced Repetition ──────────────────────────────────────────────
        spacedRepetition: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Spaced Repetition Review Mode',
            description: 'Show the "Review Wrong Answers" mode on quiz pages.',
            defaultValue: true,
          }),
          maxHistoryPerQuiz: fields.number({
            label: 'Max Stored Attempts per Quiz',
            defaultValue: 20,
          }),
        }, { label: 'Spaced Repetition Quiz Mode' }),

        // ── Peer Study Rooms ───────────────────────────────────────────────
        peerStudyRooms: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Peer Study Rooms',
            description: 'Show the floating "Study Rooms" button and virtual study rooms modal.',
            defaultValue: true,
          }),
        }, { label: 'Peer Study Rooms' }),

        // ── Live Classes ───────────────────────────────────────────────────
        liveClasses: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Live Classes Page',
            description: 'Enable the /live-classes page and scheduler.',
            defaultValue: true,
          }),
          showInNav: fields.checkbox({
            label: 'Show "Live" in Navigation Bar',
            description: 'Display the Live link in the main navigation menu.',
            defaultValue: true,
          }),
        }, { label: 'Live Classes' }),

        // ── Course Certificates ────────────────────────────────────────────
        courseCertificates: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Course Certificates',
            description: 'Show the "Generate Certificate" button on course pages.',
            defaultValue: true,
          }),
        }, { label: 'Course Certificates' }),

        // ── Course Leaderboard ─────────────────────────────────────────────
        courseLeaderboard: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Course Leaderboard',
            description: 'Show the leaderboard podium and student ranking on live classes page.',
            defaultValue: true,
          }),
        }, { label: 'Course Leaderboard' }),
      },
    }),

    // ─── Announcement Banner ───────────────────────────────────────────────
    announcementBanner: singleton({
      label: 'Announcement Banner',
      path: 'src/content/settings/announcement',
      schema: {
        enabled: fields.checkbox({
          label: 'Show Announcement Banner',
          defaultValue: false,
        }),
        message: fields.text({
          label: 'Banner Message',
          defaultValue: "New courses just launched!",
        }),
        linkText: fields.text({
          label: 'Link Label',
          defaultValue: "See what's new",
        }),
        linkUrl: fields.text({
          label: 'Link URL',
          defaultValue: '/courses',
        }),
        style: fields.select({
          label: 'Style',
          options: [
            { label: 'Blue', value: 'info' },
            { label: 'Green', value: 'success' },
            { label: 'Amber', value: 'warning' },
            { label: 'Gradient', value: 'promo' },
          ],
          defaultValue: 'info',
        }),
        dismissible: fields.checkbox({
          label: 'Allow users to dismiss',
          defaultValue: true,
        }),
      },
    }),

    // ─── Buy Me a Coffee Widget ───────────────────────────────────────────
    coffeeWidget: singleton({
      label: 'Buy Me a Coffee Widget',
      path: 'src/content/settings/coffee-widget',
      schema: {
        enabled: fields.checkbox({
          label: 'Enable Navigation Coffee Popup',
          description: 'Show an innovative, non-aggressive coffee support popup as users navigate the site.',
          defaultValue: true,
        }),
        coffeeUrl: fields.text({
          label: 'Buy Me a Coffee / Support URL',
          description: 'Link to your BuyMeACoffee, Ko-fi, or GitHub Sponsors profile',
          defaultValue: 'https://buymeacoffee.com/encodeedge',
        }),
        title: fields.text({
          label: 'Popup Headline',
          defaultValue: 'Enjoying the free courses & guides? ☕',
        }),
        message: fields.text({
          label: 'Popup Message',
          multiline: true,
          defaultValue: 'EncodeEdge is 100% free with zero ads or paywalls. If our tutorials helped you learn, consider buying a coffee to keep our servers brewing!',
        }),
        triggerPageViews: fields.number({
          label: 'Page Views Threshold Before Showing',
          description: 'Number of pages visited in session before popup slides in (prevents aggressive first-second popups).',
          defaultValue: 2,
        }),
        delaySeconds: fields.number({
          label: 'Delay on Page (seconds)',
          description: 'Seconds to wait on the qualifying page before displaying the card.',
          defaultValue: 4,
        }),
        dismissDays: fields.number({
          label: 'Dismiss Snooze Duration (Days)',
          description: 'How many days to snooze the popup if the user closes it.',
          defaultValue: 7,
        }),
        presetAmounts: fields.text({
          label: 'Preset Dollar Amounts (comma-separated)',
          defaultValue: '3, 5, 10',
        }),
        showFloatingButtonWhenDismissed: fields.checkbox({
          label: 'Keep Subtle Floating Button When Dismissed',
          description: 'Minimizes to an unobtrusive coffee cup icon in the corner instead of vanishing completely.',
          defaultValue: true,
        }),
        position: fields.select({
          label: 'Widget Screen Position',
          description: 'Where the popup and floating button appear (Bottom Right auto-stacks cleanly above any progress bar).',
          options: [
            { label: 'Bottom Right (Auto-stacked above progress bar)', value: 'bottom-right' },
            { label: 'Bottom Left (Stacked above achievements)', value: 'bottom-left' },
          ],
          defaultValue: 'bottom-right',
        }),
      },
    }),

    // ─── Navigation Settings ───────────────────────────────────────────────
    navigationSettings: singleton({
      label: 'Navigation Settings',
      path: 'src/content/settings/navigation',
      schema: {
        navLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL (Leave blank or # if purely a dropdown group)' }),
            badge: fields.text({ label: 'Badge (optional, e.g. "New", "LMS", "Live")' }),
            icon: fields.text({ label: 'Icon (optional)' }),
            openInNewTab: fields.checkbox({ label: 'Open in New Tab', defaultValue: false }),
            children: fields.array(
              fields.object({
                label: fields.text({ label: 'Sub-link Label' }),
                href: fields.text({ label: 'Sub-link URL' }),
                description: fields.text({ label: 'Description (optional)' }),
                badge: fields.text({ label: 'Badge (optional)' }),
                openInNewTab: fields.checkbox({ label: 'Open in New Tab', defaultValue: false }),
              }),
              {
                label: 'Dropdown Sub-links (optional)',
                itemLabel: props => props.fields.label.value || 'Sub-link',
              }
            ),
          }),
          {
            label: 'Navigation Links',
            itemLabel: props => (props.fields.label.value || 'Link') + ((props.fields as any)?.children?.elements?.length ? ` (${(props.fields as any).children.elements.length} sub-links)` : ''),
          }
        ),
        showSearch: fields.checkbox({ label: 'Show Search', defaultValue: true }),
        showSubscribeButton: fields.checkbox({ label: 'Show Subscribe Button', defaultValue: true }),
        subscribeButtonText: fields.text({ label: 'Subscribe Button Text', defaultValue: 'Subscribe' }),
        subscribeButtonUrl: fields.text({ label: 'Subscribe Button URL', defaultValue: '/subscribe' }),
        showCoffeeButton: fields.checkbox({ label: 'Show "Buy Me a Coffee" Button', defaultValue: true }),
        coffeeButtonText: fields.text({ label: 'Coffee Button Text', defaultValue: 'Buy Me a Coffee' }),
        coffeeButtonUrl: fields.text({
          label: 'Buy Me a Coffee / Support URL',
          description: 'Link to your BuyMeACoffee, Ko-fi, or GitHub Sponsors profile',
          defaultValue: 'https://buymeacoffee.com/encodeedge',
        }),
      },
    }),

    // ─── Footer Settings ───────────────────────────────────────────────────
    footerSettings: singleton({
      label: 'Footer Settings',
      path: 'src/content/settings/footer',
      schema: {
        tagline: fields.text({ label: 'Footer Tagline' }),
        columns: fields.array(
          fields.object({
            heading: fields.text({ label: 'Column Heading' }),
            links: fields.array(
              fields.object({
                label: fields.text({ label: 'Link Label' }),
                href: fields.text({ label: 'Link URL' }),
              }),
              { label: 'Links', itemLabel: props => props.fields.label.value }
            ),
          }),
          {
            label: 'Footer Columns',
            itemLabel: props => props.fields.heading.value,
          }
        ),
        copyrightText: fields.text({
          label: 'Copyright Text',
          defaultValue: '© 2025 EncodeEdge. All rights reserved.',
        }),
        socialLinks: fields.object({
          github: fields.text({ label: 'GitHub URL' }),
          twitter: fields.text({ label: 'Twitter URL' }),
          linkedin: fields.text({ label: 'LinkedIn URL' }),
          youtube: fields.text({ label: 'YouTube URL' }),
          rss: fields.text({ label: 'RSS Feed URL' }),
        }, { label: 'Social Links' }),
        showNewsletter: fields.checkbox({
          label: 'Show Newsletter Signup in Footer',
          defaultValue: true,
        }),
      },
    }),

    // ─── SEO Settings ─────────────────────────────────────────────────────
    seoSettings: singleton({
      label: 'SEO Settings',
      path: 'src/content/settings/seo',
      schema: {
        defaultOgImage: fields.image({
          label: 'Default OG Image',
          publicPath: '/assets/',
          directory: 'public/assets',
        }),
        twitterHandle: fields.text({
          label: 'Twitter Handle',
          defaultValue: '@encodeedge',
        }),
        defaultKeywords: fields.text({
          label: 'Default Keywords (comma-separated)',
          multiline: true,
        }),
        googleSiteVerification: fields.text({
          label: 'Google Search Console Verification Code',
        }),
        robotsNoIndex: fields.checkbox({
          label: 'Block all search engines (noindex)',
          defaultValue: false,
        }),
        schemaOrgType: fields.select({
          label: 'Schema.org Type',
          options: [
            { label: 'EducationalOrganization', value: 'EducationalOrganization' },
            { label: 'Organization', value: 'Organization' },
            { label: 'WebSite', value: 'WebSite' },
          ],
          defaultValue: 'EducationalOrganization',
        }),
      },
    }),

    // ─── Integrations Settings ─────────────────────────────────────────────
    integrationsSettings: singleton({
      label: 'Integrations',
      path: 'src/content/settings/integrations',
      schema: {
        googleAnalytics: fields.object({
          enabled: fields.checkbox({ label: 'Enable Google Analytics', defaultValue: true }),
          measurementId: fields.text({
            label: 'GA4 Measurement ID',
            description: 'Your Google Analytics 4 Measurement ID (e.g. G-5WBXFR71Y5)',
            defaultValue: 'G-5WBXFR71Y5',
          }),
          debugMode: fields.checkbox({
            label: 'Debug Mode (GA4 DebugView)',
            description: 'Enable only when testing in GA4 DebugView. Uncheck for real-time and production reports.',
            defaultValue: false,
          }),
          excludeInternalTraffic: fields.checkbox({
            label: 'Tag Localhost as Internal Traffic',
            description: 'Tags localhost and development traffic so your own testing does not skew analytics reports.',
            defaultValue: true,
          }),
          sendPageViewOnLoad: fields.checkbox({
            label: 'Automatic Page View Tracking',
            defaultValue: true,
          }),
          trackEngagement: fields.checkbox({
            label: 'Track Rich Learning Engagement',
            description: 'Automatically tracks reading depth (25%, 50%, 75%, 90%, 100%), active reading dwell milestones, code copies, and downloads.',
            defaultValue: true,
          }),
          trackEnhancedGeo: fields.checkbox({
            label: 'Track Enhanced Geographic & Device Signals',
            description: 'Captures browser timezone, system locale, preferred languages, screen resolution, and connection speed.',
            defaultValue: true,
          }),
        }, { label: 'Google Analytics 4' }),
        googleTagManager: fields.object({
          enabled: fields.checkbox({
            label: 'Enable Google Tag Manager',
            description: 'Use GTM container to manage tags, triggers, and custom geographic/marketing scripts without code deployments.',
            defaultValue: true,
          }),
          containerId: fields.text({
            label: 'GTM Container ID',
            description: 'Your Google Tag Manager Container ID (e.g. GTM-NX6PVH5K)',
            defaultValue: 'GTM-NX6PVH5K',
          }),
          trackEnhancedGeo: fields.checkbox({
            label: 'Push Geographic & Device Details to dataLayer',
            description: 'Pushes user_timezone, user_language, user_languages, screen_resolution, and connection_type into window.dataLayer for GTM triggers and variables.',
            defaultValue: true,
          }),
        }, { label: 'Google Tag Manager' }),
        crispChat: fields.object({
          enabled: fields.checkbox({ label: 'Enable Crisp Chat', defaultValue: false }),
          websiteId: fields.text({ label: 'Crisp Website ID' }),
        }, { label: 'Crisp Chat' }),
        convertKit: fields.object({
          enabled: fields.checkbox({ label: 'Enable ConvertKit', defaultValue: false }),
          formId: fields.text({ label: 'ConvertKit Form ID' }),
          apiKey: fields.text({ label: 'ConvertKit API Key' }),
        }, { label: 'ConvertKit' }),
        discord: fields.object({
          enabled: fields.checkbox({ label: 'Enable Discord Widget', defaultValue: false }),
          widgetServerId: fields.text({ label: 'Discord Widget Server ID' }),
          inviteUrl: fields.text({ label: 'Discord Invite URL' }),
        }, { label: 'Discord' }),
        posthog: fields.object({
          enabled: fields.checkbox({ label: 'Enable PostHog', defaultValue: false }),
          apiKey: fields.text({ label: 'PostHog API Key' }),
          apiHost: fields.text({ label: 'PostHog API Host', defaultValue: 'https://app.posthog.com' }),
        }, { label: 'PostHog' }),
        membership: fields.object({
          enabled: fields.checkbox({ label: 'Enable Membership & Paid Plans', defaultValue: true }),
          provider: fields.select({
            label: 'Payment & Membership Provider',
            options: [
              { label: 'Polar.sh (Open-Source)', value: 'polar' },
              { label: 'Stripe Payment Links', value: 'stripe' },
              { label: 'LemonSqueezy', value: 'lemonsqueezy' },
              { label: 'Custom / Other', value: 'custom' },
            ],
            defaultValue: 'polar',
          }),
          proMonthlyPrice: fields.integer({
            label: 'Pro Monthly Price ($)',
            defaultValue: 19,
          }),
          proAnnualPrice: fields.integer({
            label: 'Pro Annual Price ($)',
            description: 'Total billed annually (e.g. 190 for $15/mo)',
            defaultValue: 190,
          }),
          lifetimePrice: fields.integer({
            label: 'Lifetime Access Price ($)',
            defaultValue: 399,
          }),
          proMonthlyCheckoutUrl: fields.text({
            label: 'Pro Monthly Checkout URL',
            description: 'Link to Polar / Stripe checkout for monthly subscription',
            defaultValue: 'https://polar.sh/encodeedge/subscriptions',
          }),
          proAnnualCheckoutUrl: fields.text({
            label: 'Pro Annual Checkout URL',
            description: 'Link to Polar / Stripe checkout for annual subscription',
            defaultValue: 'https://polar.sh/encodeedge/subscriptions?cycle=yearly',
          }),
          lifetimeCheckoutUrl: fields.text({
            label: 'Lifetime Access Checkout URL',
            description: 'Link to Polar / Stripe checkout for one-time lifetime access',
            defaultValue: 'https://polar.sh/encodeedge/products/lifetime-access',
          }),
          customerPortalUrl: fields.text({
            label: 'Customer Billing Portal URL',
            description: 'Where members can manage or cancel their subscriptions (e.g. Polar or Stripe portal)',
            defaultValue: 'https://polar.sh/purchases',
          }),
        }, { label: 'Membership & Subscriptions (Polar / Stripe)' }),
      },
    }),

    // ─── Competition Sources & Settings ──────────────────────────────────────
    sources: singleton({
      label: 'Competition Sources',
      path: 'src/content/settings/sources',
      schema: {
        // ── AI/ML Competition Platforms & Sources ───────────────────────────
        competitionSources: fields.array(
          fields.object({
            name: fields.text({
              label: 'Platform Name',
              description: 'e.g. Kaggle, HackerRank, DrivenData, Hugging Face, Zindi, AIcrowd',
              validation: { isRequired: true },
            }),
            platformId: fields.select({
              label: 'Platform Identifier',
              options: [
                { label: 'Kaggle', value: 'kaggle' },
                { label: 'HackerRank', value: 'hackerrank' },
                { label: 'DrivenData', value: 'drivendata' },
                { label: 'Hugging Face', value: 'huggingface' },
                { label: 'Zindi', value: 'zindi' },
                { label: 'AIcrowd', value: 'aicrowd' },
                { label: 'Custom / Partner Host', value: 'custom' },
              ],
              defaultValue: 'kaggle',
            }),
            url: fields.text({
              label: 'Challenges Web URL',
              description: 'Official competitions index URL (e.g. https://www.kaggle.com/competitions)',
              validation: { isRequired: true },
            }),
            feedUrl: fields.text({
              label: 'Syndication Feed or API URL (Optional)',
              description: 'Public RSS feed or JSON API endpoint for automated sync',
            }),
            category: fields.select({
              label: 'Primary Domain Focus',
              options: [
                { label: 'All AI/ML Domains', value: 'all' },
                { label: 'NLP & Large Language Models', value: 'nlp' },
                { label: 'Computer Vision & Imaging', value: 'vision' },
                { label: 'Tabular & Predictive Analytics', value: 'tabular' },
                { label: 'Reinforcement Learning & Games', value: 'rl' },
              ],
              defaultValue: 'all',
            }),
            fetchLimit: fields.number({
              label: 'Max Challenges to Feature',
              defaultValue: 6,
            }),
            enabled: fields.checkbox({
              label: 'Platform Active / Enabled',
              defaultValue: true,
            }),
          }),
          {
            label: 'AI/ML Competition Platforms & Sources',
            description: 'Manage competition platforms (Kaggle, HackerRank, DrivenData, Hugging Face, Zindi, AIcrowd) feeding the Competitions Hub.',
            itemLabel: (props) => `${props.fields.name.value || 'Untitled Platform'} (${props.fields.enabled.value ? 'Active' : 'Disabled'})`,
          }
        ),

        // ── Display & Sync Settings ─────────────────────────────────────────
        displaySettings: fields.object({
          enableCompetitionsSync: fields.checkbox({
            label: 'Enable Competitions Live Sync',
            description: 'Show the "Sync Competitions" button on /competitions for visitors.',
            defaultValue: true,
          }),
          autoSyncCompetitions: fields.checkbox({
            label: 'Auto-Sync Competitions on Page Load',
            description: 'Automatically check and sync fresh competitions in background on page visit (debounced 10 mins).',
            defaultValue: true,
          }),
          hideCompletedCompetitions: fields.checkbox({
            label: 'Hide Completed Competitions by Default',
            description: 'Automatically hide competitions whose deadlines have passed from the main listing.',
            defaultValue: true,
          }),
          maxCompetitionsDisplay: fields.number({
            label: 'Max Competitions to Display',
            description: 'Total number of active competitions to show on /competitions.',
            defaultValue: 24,
          }),
          feedTimeoutMs: fields.number({
            label: 'Server Fetch Timeout (ms)',
            description: 'Maximum time to wait when fetching external feeds before using fallback cache (default 3800ms).',
            defaultValue: 3800,
          }),
        }, { label: 'Display & Sync Configuration' }),
      },
    }),

    // ─── Page-Level Settings ─────────────────────────────────────────────────

    pageCoursesSettings: singleton({
      label: 'Courses Page',
      path: 'src/content/settings/pages/courses',
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow Label', defaultValue: 'EncodeEdge Academy' }),
          heading: fields.text({ label: 'Heading', defaultValue: 'Build Real AI Skills' }),
          subheading: fields.text({ label: 'Subheading', multiline: true, defaultValue: 'Master modern Artificial Intelligence, Machine Learning, Deep Learning, and Python through hands-on, production-grade courses.' }),
          ctaLabel: fields.text({ label: 'Primary CTA Label', defaultValue: 'Browse All Courses' }),
          ctaUrl: fields.text({ label: 'Primary CTA URL', defaultValue: '#courses' }),
          secondaryCtaLabel: fields.text({ label: 'Secondary CTA Label', defaultValue: 'View Roadmaps' }),
          secondaryCtaUrl: fields.text({ label: 'Secondary CTA URL', defaultValue: '/roadmaps' }),
        }, { label: 'Hero Section' }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Stat Value (e.g. "12+")' }),
            label: fields.text({ label: 'Stat Label (e.g. "Courses")' }),
          }),
          { label: 'Hero Stats', itemLabel: props => props.fields.label.value }
        ),
        showFeaturedSection: fields.checkbox({ label: 'Show Featured Courses Row', defaultValue: true }),
        showBatchesSection: fields.checkbox({ label: 'Show Upcoming Batches Section', defaultValue: true }),
        showInstructorsSection: fields.checkbox({ label: 'Show Instructors Section', defaultValue: true }),
        maxCoursesShown: fields.number({ label: 'Max Courses in Grid (0 = all)', defaultValue: 0 }),
        // ── Interactive Lab Section ─────────────────────────────────────────
        showInteractiveLab: fields.checkbox({
          label: 'Show Interactive Lab / Code Sandbox Section',
          description: 'Displays the live in-browser code runner section on the courses page.',
          defaultValue: true,
        }),
        interactiveLabHeading: fields.text({
          label: 'Lab Section Heading',
          defaultValue: 'Try Live Algorithms in the Browser',
        }),
        interactiveLabSubheading: fields.text({
          label: 'Lab Section Subheading',
          multiline: true,
          defaultValue: 'Test real PyTorch autograd computations, gradient descent steps, and semantic RAG cosine similarity with zero local environment setup.',
        }),
        interactiveLabEyebrow: fields.text({
          label: 'Lab Section Eyebrow Label',
          defaultValue: 'Hands-On Engineering',
        }),
        // ── Floating Interactive Widgets ───────────────────────────────────
        showGamificationBar: fields.checkbox({
          label: 'Show Learner Gamification Bar (XP / Achievements)',
          description: 'Floating XP bar shown at the top of the courses page.',
          defaultValue: true,
        }),
        showFlashcardsDrawer: fields.checkbox({
          label: 'Show Course Flashcards Drawer',
          description: 'Floating flashcard study drawer button on the courses page.',
          defaultValue: true,
        }),
        seoTitle: fields.text({ label: 'SEO Title Override' }),
        seoDescription: fields.text({ label: 'SEO Description Override', multiline: true }),
      },
    }),

    pageBlogSettings: singleton({
      label: 'Blog Page',
      path: 'src/content/settings/pages/blog',
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow Label', defaultValue: 'EncodeEdge Blog' }),
          heading: fields.text({ label: 'Heading', defaultValue: 'Blueprints for Modern AI Engineers' }),
          subheading: fields.text({ label: 'Subheading', multiline: true, defaultValue: 'Clear, code-backed deep dives into Machine Learning, Deep Learning, Python internals, and AI systems.' }),
        }, { label: 'Hero Section' }),
        postsPerPage: fields.number({ label: 'Posts Per Page', defaultValue: 12 }),
        showNotebooks: fields.checkbox({ label: 'Show Notebooks alongside Blog Posts', defaultValue: true }),
        showFeaturedPosts: fields.checkbox({ label: 'Show Featured Posts Row', defaultValue: true }),
        defaultSortOrder: fields.select({
          label: 'Default Sort Order',
          options: [
            { label: 'Newest First', value: 'newest' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Most Popular (Read Time)', value: 'popular' },
          ],
          defaultValue: 'newest',
        }),
        seoTitle: fields.text({ label: 'SEO Title Override' }),
        seoDescription: fields.text({ label: 'SEO Description Override', multiline: true }),
      },
    }),

    pageLabsSettings: singleton({
      label: 'Labs Page',
      path: 'src/content/settings/pages/labs',
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow Label', defaultValue: 'Interactive AI Labs' }),
          heading: fields.text({ label: 'Heading', defaultValue: 'Learn by Doing' }),
          subheading: fields.text({ label: 'Subheading', multiline: true, defaultValue: 'Explore interactive simulators for Transformers, Convolutions, Gradient Descent, and a comprehensive AI math notation glossary.' }),
        }, { label: 'Hero Section' }),
        showGlossaryTab: fields.checkbox({ label: 'Show Math Decoder / Glossary Tab', defaultValue: true }),
        defaultTab: fields.select({
          label: 'Default Active Tab',
          options: [
            { label: 'All Labs', value: 'all' },
            { label: 'Math Decoder', value: 'math-decoder' },
          ],
          defaultValue: 'all',
        }),
        seoTitle: fields.text({ label: 'SEO Title Override' }),
        seoDescription: fields.text({ label: 'SEO Description Override', multiline: true }),
      },
    }),

    pageRoadmapsSettings: singleton({
      label: 'Roadmaps Page',
      path: 'src/content/settings/pages/roadmaps',
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow Label', defaultValue: 'Learning Paths' }),
          heading: fields.text({ label: 'Heading', defaultValue: 'Step-by-Step Roadmaps' }),
          subheading: fields.text({ label: 'Subheading', multiline: true, defaultValue: 'Master complex engineering domains with structured visual roadmaps from novice to production expert.' }),
        }, { label: 'Hero Section' }),
        sortOrder: fields.select({
          label: 'Sort Order',
          options: [
            { label: 'Alphabetical (A-Z)', value: 'alpha' },
            { label: 'Featured First', value: 'featured' },
          ],
          defaultValue: 'alpha',
        }),
        seoTitle: fields.text({ label: 'SEO Title Override' }),
        seoDescription: fields.text({ label: 'SEO Description Override', multiline: true }),
      },
    }),

    pageTopicsSettings: singleton({
      label: 'Topics Page',
      path: 'src/content/settings/pages/topics',
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow Label', defaultValue: 'Knowledge Hubs' }),
          heading: fields.text({ label: 'Heading', defaultValue: 'All Engineering Topics' }),
          subheading: fields.text({ label: 'Subheading', multiline: true, defaultValue: 'Browse curated engineering tracks from foundational Python to deep learning architectures and production LLMs.' }),
        }, { label: 'Hero Section' }),
        showTopicStats: fields.checkbox({ label: 'Show Article Count & Read Time per Topic', defaultValue: true }),
        showRoadmapBadge: fields.checkbox({ label: 'Show "Has Roadmap" Badge', defaultValue: true }),
        showRecentArticlesPreview: fields.checkbox({ label: 'Show Recent Articles Preview per Topic Card', defaultValue: true }),
        seoTitle: fields.text({ label: 'SEO Title Override' }),
        seoDescription: fields.text({ label: 'SEO Description Override', multiline: true }),
      },
    }),

    pageLiveClassesSettings: singleton({
      label: 'Live Classes Page',
      path: 'src/content/settings/pages/live-classes',
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow Label', defaultValue: '1 Live Session In Progress' }),
          heading: fields.text({ label: 'Heading', defaultValue: 'Live Classes & Community' }),
          subheading: fields.text({ label: 'Subheading', multiline: true, defaultValue: "Attend live coding sessions, ask questions in real time, and watch recordings when you can't make it live." }),
        }, { label: 'Hero Section' }),
        showLeaderboard: fields.checkbox({ label: 'Show Leaderboard Section', defaultValue: true }),
        showCountdownTimer: fields.checkbox({ label: 'Show Countdown to Next Live Session', defaultValue: true }),
        seoTitle: fields.text({ label: 'SEO Title Override' }),
        seoDescription: fields.text({ label: 'SEO Description Override', multiline: true }),
      },
    }),

    pageDashboardSettings: singleton({
      label: 'Dashboard Page',
      path: 'src/content/settings/pages/dashboard',
      schema: {
        hero: fields.object({
          heading: fields.text({ label: 'Heading', defaultValue: 'My Learning Dashboard' }),
          subheading: fields.text({ label: 'Subheading', defaultValue: 'Track your progress, resume active modules, and manage earned certificates.' }),
        }, { label: 'Hero Section' }),
        showStreakWidget: fields.checkbox({ label: 'Show Day Streak Widget', defaultValue: true }),
        showXpWidget: fields.checkbox({ label: 'Show XP / Points Widget', defaultValue: true }),
        showCertificatesSection: fields.checkbox({ label: 'Show Earned Certificates Section', defaultValue: true }),
        showLeaderboardWidget: fields.checkbox({ label: 'Show Mini-Leaderboard Widget', defaultValue: true }),
        showRecommendedCourses: fields.checkbox({ label: 'Show Recommended Courses Panel', defaultValue: true }),
        seoTitle: fields.text({ label: 'SEO Title Override' }),
      },
    }),

    pageSystemDesignSettings: singleton({
      label: 'System Design Page',
      path: 'src/content/settings/pages/system-design',
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow Badge', defaultValue: 'AWS Well-Architected Framework for AI/ML' }),
          heading: fields.text({ label: 'Heading', defaultValue: 'AI & ML System Design Architecture Center' }),
          subheading: fields.text({ label: 'Subheading', multiline: true, defaultValue: 'Real-world production engineering reference architectures. Design distributed RAG systems, sub-45ms recommendation funnels, and continuous MLOps pipelines with interactive AWS architectural blueprints.' }),
          badge1Number: fields.text({ label: 'Stat 1 Value', defaultValue: '4' }),
          badge1Label: fields.text({ label: 'Stat 1 Label', defaultValue: 'Reference Blueprints' }),
          badge2Number: fields.text({ label: 'Stat 2 Value', defaultValue: '<45ms' }),
          badge2Label: fields.text({ label: 'Stat 2 Label', defaultValue: 'Production SLAs' }),
          badge3Number: fields.text({ label: 'Stat 3 Value', defaultValue: 'Interactive' }),
          badge3Label: fields.text({ label: 'Stat 3 Label', defaultValue: 'Graph Canvas' }),
        }, { label: 'Hero Section' }),
        goldenPrinciples: fields.array(
          fields.object({
            number: fields.text({ label: 'Principle Number (e.g. 01)' }),
            title: fields.text({ label: 'Principle Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'The 4 Golden Principles of Production ML',
            itemLabel: props => `${props.fields.number.value} - ${props.fields.title.value}`,
          }
        ),
        bottomCta: fields.object({
          heading: fields.text({ label: 'CTA Heading', defaultValue: 'Continue Learning AI Engineering' }),
          subheading: fields.text({ label: 'CTA Subheading', multiline: true, defaultValue: 'Dive into step-by-step algorithms, loss surface mathematics, and complete code walkthroughs.' }),
          primaryButtonText: fields.text({ label: 'Primary Button Label', defaultValue: 'Explore Courses' }),
          primaryButtonUrl: fields.text({ label: 'Primary Button URL', defaultValue: '/courses' }),
          secondaryButtonText: fields.text({ label: 'Secondary Button Label', defaultValue: 'All Interactive Labs' }),
          secondaryButtonUrl: fields.text({ label: 'Secondary Button URL', defaultValue: '/labs' }),
        }, { label: 'Bottom CTA Banner' }),
        seoTitle: fields.text({ label: 'SEO Title Override' }),
        seoDescription: fields.text({ label: 'SEO Description Override', multiline: true }),
      },
    }),

    // ─── AI Article Synthesizer & Generator ─────────────────────────────────
    aiBlogGenerator: singleton({
      label: 'AI Article Synthesizer',
      previewUrl: '/admin/ai-generator',
      path: 'src/content/settings/ai-generator',
      schema: {
        sourceUrls: fields.array(
          fields.text({
            label: 'Source Reference URL',
            description: 'Public article, paper, or documentation URL to analyze.',
            validation: { isRequired: true },
          }),
          {
            label: 'Source Reference URLs (Web / Research)',
            description: 'Add one or more URLs. The AI synthesizer will read, extract key insights, and draft a manual-grade original tutorial.',
            itemLabel: (props) => props.value || 'URL',
          }
        ),
        targetTopic: fields.select({
          label: 'Primary Topic Category',
          options: [
            { label: 'Machine Learning', value: 'machine-learning' },
            { label: 'Deep Learning', value: 'deep-learning' },
            { label: 'Python Systems & Engineering', value: 'python' },
            { label: 'Natural Language Processing & LLMs', value: 'nlp' },
            { label: 'Computer Vision', value: 'computer-vision' },
            { label: 'Data Science & Analytics', value: 'data-science' },
            { label: 'Web Development', value: 'web-dev' },
          ],
          defaultValue: 'machine-learning',
        }),
        writingTone: fields.select({
          label: 'Writing Tone & Style',
          options: [
            { label: 'Senior Staff Engineer (Deep Dive, Rigorous, Code-First)', value: 'engineer' },
            { label: 'Hands-On Tutorial (Beginner-Friendly, Intuitive, Step-by-Step)', value: 'tutorial' },
            { label: 'Architecture Breakdown (System Design, Tradeoffs, Benchmarks)', value: 'architecture' },
          ],
          defaultValue: 'engineer',
        }),
        modelPreference: fields.select({
          label: 'AI Model (Workers AI / Gemini)',
          description: 'Workers AI offers 10,000 free daily neurons on Cloudflare Pages. Gemini can be used as fallback.',
          options: [
            { label: 'Cloudflare Workers AI (Llama 3.3 70B Instruct Fast - Free)', value: '@cf/meta/llama-3.3-70b-instruct-fp8-fast' },
            { label: 'Cloudflare Workers AI (Llama 3.1 8B Instruct - Free & Fast)', value: '@cf/meta/llama-3.1-8b-instruct' },
            { label: 'Cloudflare Workers AI (DeepSeek R1 Distill Qwen 32B - Free)', value: '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b' },
            { label: 'Google Gemini 2.5 Flash (Generous Free Tier)', value: 'gemini-2.5-flash' },
          ],
          defaultValue: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        }),
        additionalDirectives: fields.text({
          label: 'Custom Author Directives / Focus Points (Optional)',
          description: 'e.g., "Emphasize memory footprints, include a PyTorch comparison, focus on edge cases"',
          multiline: true,
        }),
        targetBranch: fields.text({
          label: 'Target Git Branch (Optional / Private Branch)',
          description: 'Leave blank to save to your local branch / working tree or enter a private branch name (e.g. "drafts/ai-articles" or "feature/new-post").',
          defaultValue: 'drafts/ai-articles',
        }),
        autoCreatePullRequest: fields.checkbox({
          label: 'Commit to GitHub Branch',
          description: 'When enabled, writes directly to the specified Git branch using GITHUB_TOKEN instead of local disk.',
          defaultValue: false,
        }),
        lastGeneratedSlug: fields.text({
          label: 'Last Generated Article Slug / Status',
          description: 'Filled automatically or for reference after running generator.',
        }),
      },
    }),


  },


  collections: {
    blogs: collection({
      label: 'Blogs',
      slugField: 'title',
      path: 'src/content/blog/*',
      previewUrl: `${previewBase}/preview/?branch={branch}&to=/blog/{slug}`,
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' , validation: { isRequired: true }} ),
        pubDate: fields.date({ label: 'Publication Date', validation: { isRequired: true } }),
        updatedDate: fields.date({ label: 'Updated Date', validation: { isRequired: true } }),
        readTime: fields.number({ label: 'Estimated Read Time (minutes)' }),
        draft: fields.checkbox({
          label: 'Draft Status',
          description: 'Keep this article in draft state. It will not appear in the public blog listing.',
          defaultValue: false,
        }),
        featured: fields.checkbox({ label: 'Featured Post', description: 'Mark this post as featured to highlight it on the homepage.' }),
        tags: fields.array(

          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            description: 'Add relevant keywords for search (e.g., Python, Neural Networks).',
            itemLabel: props => props.value,
          }
        ),
        topics: fields.multiselect({
            label: 'Topic',
            description: 'Select the primary topic category for this blog.',
            options: [
                { label: 'Machine Learning', value: 'machine-learning' },
                { label: 'Deep Learning', value: 'deep-learning' },
                { label: 'Data Science', value: 'data-science' },
                { label: 'Natural Language Processing', value: 'nlp' },
                { label: 'Computer Vision', value: 'computer-vision' },
                { label: 'Web Development', value: 'web-dev' },
                { label: 'Python', value: 'python' },
            ]
        }),
        image: fields.image({ 
          label: 'Blog Post Image',
          description: 'Enter an online URL or upload a local image.',
          publicPath: '/assets/',
          directory: 'public/assets/',
        }),
        authorImage: fields.image({ 
          label: 'Author Image',
          description: 'Enter an online URL or upload a local author avatar.',
          publicPath: '/assets/',
          directory: 'public/assets/',
        }),
        authorName: fields.text({ label: 'Author Name', validation: { isRequired: true } }),
        faqs: fields.array(
          fields.object({
            question: fields.text({ label: 'Question', validation: { isRequired: true } }),
            answer: fields.text({ label: 'Answer', validation: { isRequired: true } }),
            category: fields.text({ label: 'Category', description: 'Optional grouping/category' }),
          }),
          {
            label: 'FAQs',
            description: 'Add question and answer pairs to embed in this post',
            itemLabel: props => props.fields.question.value || 'Q&A',
          }
        ),
        references: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            url: fields.text({ label: 'URL', validation: { isRequired: true } }),
            description: fields.text({ label: 'Description' }),
            type: fields.select({ label: 'Type', options: [
              { label: 'Book', value: 'book' },
              { label: 'Link', value: 'link' },
              { label: 'Course', value: 'course' },
              { label: 'Documentation', value: 'docs' },
              { label: 'Documentation (Long)', value: 'documentation' },
              { label: 'Research Paper', value: 'paper' },
              { label: 'Article', value: 'article' },
            ], defaultValue: 'link' }),
            affiliate: fields.text({ label: 'Affiliate ID', description: 'Optional affiliate id or tracking code' }),
            image: fields.image({
              label: 'Image',
              description: 'Optional thumbnail or cover image for the reference',
              publicPath: '/assets/',
              directory: 'public/assets/',
            }),
          }),
          {
            label: 'References',
            description: 'Add related books, links or courses for this post',
            itemLabel: props => props.fields.title.value ,
          }
        ),
        // ── SEO Customization ──────────────────────────────────────────────
        seoTitle: fields.text({
          label: 'SEO Title Override (Optional)',
          description: 'Custom browser tab & search engine title. Defaults to "[Title] | EncodeEdge" if empty.',
        }),
        seoDescription: fields.text({
          label: 'SEO Meta Description Override (Optional)',
          description: 'Custom search snippet description. Defaults to article description if empty.',
          multiline: true,
        }),
        canonicalUrl: fields.text({
          label: 'Canonical URL Override (Optional)',
          description: 'Specify a custom canonical URL if this article was syndicated from another publication (e.g. Medium, Substack).',
        }),
        noIndex: fields.checkbox({
          label: 'Exclude from Search Engines (noindex)',
          description: 'Check this to tell search engines not to index this specific article.',
          defaultValue: false,
        }),
        content: fields.mdx({
          label: 'Content',
          extension: 'mdx',
          components: mdxComponents,
          options: {
            image: {
              directory: 'public/assets/',
              publicPath: '/assets/',
            },
          },
        }),
      },
    }),
    faqs: collection({
      label: 'FAQs',
      slugField: 'question',
      path: 'src/content/faqs/*',
      previewUrl: `${previewBase}/faq`,
      format: { data: 'yaml' },
      schema: {
        question: fields.text({ label: 'Question', validation: { isRequired: true } }),
        answer: fields.text({ label: 'Answer', validation: { isRequired: true } }),
        category: fields.text({ label: 'Category', description: 'Optional grouping/category for the question' }),
      },
    }),
    roadmaps: collection({
      label: 'Roadmaps',
      slugField: 'title',
      path: 'src/content/roadmaps/*',
      previewUrl: `${previewBase}/roadmaps#{slug}`,
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', validation: { isRequired: true } }),
        image: fields.text({
          label: 'Cover Image',
          description: 'Roadmap preview graphic or illustration (e.g. /assets/roadmaps/python.svg)',
        }),
        featured: fields.checkbox({ label: 'Featured', description: 'Highlight this roadmap' }),
        nodes: fields.array(
          fields.object({
            title: fields.text({ label: 'Section Title' }),
            id: fields.text({ label: 'Section ID' }),
            description: fields.text({ label: 'Section Description' }),
            topics: fields.array(
              fields.object({
                name: fields.text({ label: 'Topic Name' }),
                description: fields.text({ label: 'Topic Description' }),
                difficulty: fields.select({
                  label: 'Difficulty',
                  options: [
                    { label: 'Beginner', value: 'beginner' },
                    { label: 'Intermediate', value: 'intermediate' },
                    { label: 'Advanced', value: 'advanced' },
                  ],
                  defaultValue: 'beginner',
                }),
                optional: fields.checkbox({ label: 'Optional', description: 'Is this topic optional?' }),
                duration: fields.text({ label: 'Duration', description: 'Estimated time to complete (e.g., "2 hours")' }),
                prerequisites: fields.array(
                  fields.text({ label: 'Prerequisite' }),
                  { label: 'Prerequisites', itemLabel: props => props.value }
                ),
                takeaways: fields.array(
                  fields.text({ label: 'Key Takeaway' }),
                  { label: 'Key Takeaways', itemLabel: props => props.value }
                ),
                codeSnippet: fields.text({ label: 'Code Example', multiline: true, description: 'Optional code snippet' }),
                videoUrl: fields.text({ label: 'Video Tutorial URL' }),
                links: fields.array(
                  fields.object({
                    title: fields.text({ label: 'Title' }),
                    url: fields.text({ label: 'URL' }),
                  }),
                  { label: 'Links', itemLabel: props => props.fields.title.value }
                ),
                references: fields.array(
                  fields.object({
                    title: fields.text({ label: 'Title' }),
                    url: fields.text({ label: 'URL' }),
                  }),
                  { label: 'References', itemLabel: props => props.fields.title.value }
                ),
              }),
              { label: 'Topics', itemLabel: props => props.fields.name.value }
            ),
          }),
          { label: 'Nodes', itemLabel: props => props.fields.title.value }
        ),
        content: fields.mdx({ label: 'Content', extension: 'md', components: mdxComponents, description: 'Optional content for the roadmap page' }),
      },
    }),
    
    // --- LMS Core ---
    courses: collection({
      label: 'Courses',
      slugField: 'title',
      path: 'src/content/courses/*',
      previewUrl: `${previewBase}/preview/?branch={branch}&to=/courses/{slug}`,
      format: { contentField: 'about' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        shortDescription: fields.text({ label: 'Short Description', multiline: true }),
        coverImage: fields.text({
          label: 'Cover Image',
          description: 'Path or URL to course cover image (e.g. /assets/courses/deep-learning-foundations-and-neurons.svg)',
        }),
        instructor: fields.relationship({
          label: 'Instructor',
          collection: 'instructors',
        }),
        level: fields.select({
          label: 'Level',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
          defaultValue: 'beginner'
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'draft'
        }),
        chapters: fields.array(
          fields.object({
            title: fields.text({ label: 'Chapter Title' }),
            description: fields.text({ label: 'Chapter Description' }),
            items: fields.blocks(
              {
                lesson: {
                  label: 'Lesson',
                  schema: fields.object({
                    lessonRef: fields.relationship({ label: 'Select Lesson', collection: 'lessons' })
                  })
                },
                quiz: {
                  label: 'Quiz',
                  schema: fields.object({
                    quizRef: fields.relationship({ label: 'Select Quiz', collection: 'quizzes' })
                  })
                },
                assignment: {
                  label: 'Assignment',
                  schema: fields.object({
                    assignmentRef: fields.relationship({ label: 'Select Assignment', collection: 'assignments' })
                  })
                }
              },
              { label: 'Curriculum Items' }
            ),
          }),
          { label: 'Chapters', itemLabel: props => props.fields.title.value }
        ),
        // ── Enrollment ─────────────────────────────────────────────────────
        enrollmentMode: fields.select({
          label: 'Enrollment Mode',
          options: [
            { label: 'Free', value: 'free' },
            { label: 'Paid/Stripe', value: 'paid' },
            { label: 'Waitlist', value: 'waitlist' },
            { label: 'Invite Only', value: 'invite' },
          ],
          defaultValue: 'free',
        }),
        price: fields.number({
          label: 'Price (USD)',
          description: 'Only used when enrollment mode is Paid',
        }),
        stripeProductId: fields.text({
          label: 'Stripe Product ID',
          description: 'For paid enrollment',
        }),
        waitlistUrl: fields.text({ label: 'Waitlist Form URL' }),
        maxEnrollments: fields.number({
          label: 'Max Students (0 = unlimited)',
          defaultValue: 0,
        }),
        prerequisites: fields.array(
          fields.text({ label: 'Prerequisite' }),
          { label: 'Prerequisites', itemLabel: props => props.value }
        ),
        about: fields.mdx({ label: 'About this Course', extension: 'md' }),
        // ── Discoverability ────────────────────────────────────────────────
        featured: fields.checkbox({ label: 'Featured Course', description: 'Highlight on the courses landing page', defaultValue: false }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
        topics: fields.multiselect({
          label: 'Topics',
          options: [
            { label: 'Machine Learning', value: 'machine-learning' },
            { label: 'Deep Learning', value: 'deep-learning' },
            { label: 'Python', value: 'python' },
            { label: 'Natural Language Processing', value: 'nlp' },
            { label: 'Computer Vision', value: 'computer-vision' },
            { label: 'Data Science', value: 'data-science' },
            { label: 'LLMs & RAG', value: 'llms-rag' },
            { label: 'Reinforcement Learning', value: 'reinforcement-learning' },
          ],
        }),
        estimatedDuration: fields.text({ label: 'Estimated Duration (e.g. "8 hours", "6 weeks")', defaultValue: '' }),
        seoDescription: fields.text({ label: 'SEO Meta Description (Optional override)', multiline: true }),
      }
    }),
    batches: collection({
      label: 'Batches',
      slugField: 'title',
      path: 'src/content/batches/*',
      previewUrl: `${previewBase}/batches`,
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Batch Title' } }),
        course: fields.relationship({ label: 'Course', collection: 'courses' }),
        startDate: fields.date({ label: 'Start Date' }),
        endDate: fields.date({ label: 'End Date' }),
        capacity: fields.number({ label: 'Capacity' }),
        price: fields.number({ label: 'Price (Optional)' }),
        status: fields.select({
           label: 'Status',
           options: [
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Completed', value: 'completed' }
           ],
           defaultValue: 'upcoming'
        }),
        content: fields.mdx({ label: 'Batch Information (Optional)', extension: 'md' }),
      }
    }),
    instructors: collection({
      label: 'Instructors',
      slugField: 'name',
      path: 'src/content/instructors/*',
      previewUrl: `${previewBase}/instructors/{slug}`,
      format: { contentField: 'bio' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        title: fields.text({ label: 'Title / Role', defaultValue: 'AI & ML Instructor' }),
        avatar: fields.text({
          label: 'Avatar',
          description: 'Avatar image URL or path (e.g. /assets/instructors/atul.jpg)',
        }),
        featured: fields.checkbox({ label: 'Featured Instructor', defaultValue: false }),
        specialties: fields.array(
          fields.text({ label: 'Specialty' }),
          { label: 'Specialties / Skills', itemLabel: props => props.value }
        ),
        email: fields.text({ label: 'Contact Email (Optional)' }),
        socialLinks: fields.array(
          fields.object({
            platform: fields.select({
              label: 'Platform',
              options: [
                { label: 'GitHub', value: 'github' },
                { label: 'Twitter / X', value: 'twitter' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Website', value: 'website' },
              ],
              defaultValue: 'github',
            }),
            url: fields.text({ label: 'URL' }),
          }),
          { label: 'Social Links', itemLabel: props => props.fields.platform.value }
        ),
        bio: fields.mdx({ label: 'Bio', extension: 'md' }),
      }
    }),


    liveClasses: collection({
      label: 'Live Classes',
      slugField: 'title',
      path: 'src/content/live-classes/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        course: fields.relationship({ label: 'Course', collection: 'courses' }),
        instructor: fields.relationship({ label: 'Instructor', collection: 'instructors' }),
        scheduledAt: fields.datetime({ label: 'Scheduled Date & Time' }),
        durationMinutes: fields.number({ label: 'Duration (minutes)', defaultValue: 60 }),
        meetingUrl: fields.text({ label: 'Meeting URL (Zoom/Meet/Teams)' }),
        recordingUrl: fields.text({ label: 'Recording URL (after class)' }),
        maxParticipants: fields.number({ label: 'Max Participants', defaultValue: 100 }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Live', value: 'live' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
          defaultValue: 'scheduled',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
      },
    }),

    // --- LMS Material ---
    lessons: collection({
      label: 'Lessons',
      slugField: 'title',
      path: 'src/content/lessons/*',
      previewUrl: `${previewBase}/preview/?branch={branch}&to=/lessons/{slug}`,
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        lessonType: fields.select({
          label: 'Lesson Type',
          options: [
            { label: 'Video Lesson', value: 'video' },
            { label: 'Article / Written Lesson', value: 'article' },
            { label: 'Interactive Lab Simulator', value: 'lab' },
          ],
          defaultValue: 'video'
        }),
        interactiveLab: fields.select({
          label: 'Interactive Lab Simulator',
          description: 'Optionally embed a specialized interactive simulation widget or live code runner into this lesson',
          options: [
            { label: 'None (No Lab)', value: 'none' },
            { label: 'Lesson-Tailored Code Sandbox', value: 'code-sandbox' },
            { label: 'Neural Network & Activation Playground', value: 'neural-playground' },
            { label: 'Loss Surface & Gradient Descent Optimizer Lab', value: 'gradient-descent' },
            { label: 'CPython Stack & Heap Memory Explorer', value: 'memory-explorer' },
            { label: 'Custom Code Sandbox (User-Defined Code)', value: 'custom-sandbox' },
          ],
          defaultValue: 'none',
        }),
        interactiveLabTitle: fields.text({
          label: 'Interactive Lab Title (Optional)',
          description: 'Override the default lab title (e.g. "2D Convolution Kernel & Feature Maps Lab"). If left blank, automatically adapts to the lesson topic.',
        }),
        interactiveLabDescription: fields.text({
          label: 'Interactive Lab Description (Optional)',
          description: 'Custom learning objective or instructions for this lab.',
          multiline: true,
        }),
        customLabCode: fields.text({
          label: 'Custom Lab Code (Optional Python)',
          description: 'Custom executable Python code for this lesson sandbox (used when type is Code Sandbox or Custom Sandbox).',
          multiline: true,
        }),
        customLabOutput: fields.text({
          label: 'Custom Expected Output (Optional)',
          description: 'Expected terminal execution output lines, separated by line breaks.',
          multiline: true,
        }),
        videoUrl: fields.text({ label: 'Video URL', description: 'YouTube or Vimeo embed URL' }),
        duration: fields.number({ label: 'Duration (in minutes)' }),
        order: fields.number({ label: 'Sort Order', description: 'Order within its chapter (lower = first)', defaultValue: 0 }),
        isFree: fields.checkbox({ label: 'Free Preview Lesson', description: 'Allow non-enrolled users to preview this lesson', defaultValue: false }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
        content: fields.mdx({ label: 'Content', extension: 'md', components: mdxComponents }),
      }
    }),
    quizzes: collection({
      label: 'Quizzes',
      slugField: 'title',
      path: 'src/content/quizzes/*',
      previewUrl: `${previewBase}/quizzes/{slug}`,
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        passingScorePercentage: fields.number({
          label: 'Minimum Passing Percentage (0-100)',
          defaultValue: 0,
          description: 'Required percentage to mark completed. Set to 0 to complete upon submission regardless of score.',
        }),
        markCompletedOnAttempt: fields.checkbox({
          label: 'Always Mark Complete on Submission',
          defaultValue: true,
          description: 'Automatically mark the quiz as completed once all questions are answered, even if answers are incorrect.',
        }),
        questions: fields.array(
          fields.object({
            question: fields.text({ label: 'Question', multiline: true, validation: { isRequired: true } }),
            type: fields.select({
              label: 'Question Type',
              options: [
                { label: 'Multiple Choice (MCQ)', value: 'mcq' },
                { label: 'Multiple Select (MSQ)', value: 'msq' },
                { label: 'Numeric Answer (Decimals)', value: 'answer' },
              ],
              defaultValue: 'mcq',
            }),
            options: fields.array(
              fields.text({ label: 'Option' }),
              { label: 'Options (Leave empty for Numeric Answer)', itemLabel: props => props.value }
            ),
            correctAnswer: fields.number({ label: 'Correct Answer Index (0-based) for MCQ' }),
            correctAnswers: fields.array(
              fields.number({ label: 'Correct Answer Index' }),
              { label: 'Correct Answer Indices (0-based) for MSQ' }
            ),
            numericAnswer: fields.number({ label: 'Correct Numeric Answer' }),
            explanation: fields.text({ label: 'Explanation', multiline: true }),
          }),
          { label: 'Questions', itemLabel: props => props.fields.question.value }
        ),
      }
    }),
    assignments: collection({
      label: 'Assignments',
      slugField: 'title',
      path: 'src/content/assignments/*',
      previewUrl: `${previewBase}/assignments/{slug}`,
      format: { contentField: 'instructions' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        rubric: fields.array(
          fields.object({
            criteria: fields.text({ label: 'Criteria', validation: { isRequired: true } }),
            maxPoints: fields.number({ label: 'Max Points', validation: { isRequired: true } }),
          }),
          { label: 'Grading Rubric', itemLabel: props => `${props.fields.criteria.value} (${props.fields.maxPoints.value} pts)` }
        ),
        resources: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            url: fields.text({ label: 'URL / Path', validation: { isRequired: true } }),
          }),
          { label: 'Downloadable Resources', itemLabel: props => props.fields.title.value }
        ),
        instructions: fields.mdx({ label: 'Detailed Instructions', extension: 'md' }),
      }
    }),

    // --- Reusable Components ---
    components: collection({
      label: 'Reusable Components',
      slugField: 'name',
      path: 'src/content/components/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.slug({ name: { label: 'Component Name' } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Callout / Alert', value: 'callout' },
            { label: 'Newsletter / CTA', value: 'cta' },
            { label: 'Banner / Announcement', value: 'banner' },
            { label: 'Audio / Podcast Feature', value: 'podcast' },
            { label: 'Resource / Reference', value: 'resource' },
          ],
          defaultValue: 'callout',
        }),
        description: fields.text({ label: 'Description / Purpose', multiline: true }),
        buttonText: fields.text({ label: 'Button / Action Text (Optional)' }),
        buttonUrl: fields.text({ label: 'Button / Action URL (Optional)' }),
        accentColor: fields.select({
          label: 'Accent Color',
          options: [
            { label: 'Lime Yellow (Theme Accent)', value: '#E5E795' },
            { label: 'Rose Pink', value: '#FDA4AF' },
            { label: 'Sky Blue', value: '#A2D2FF' },
            { label: 'Lavender Purple', value: '#EEA9ED' },
            { label: 'Peach Orange', value: '#FFB86A' },
            { label: 'Mint Green', value: '#A7F3D0' },
          ],
          defaultValue: '#E5E795',
        }),
        content: fields.mdx({ label: 'Content', extension: 'md', components: mdxComponents }),
      },
    }),

    // --- LMS Administration ---
    certificates: collection({
      label: 'Certificates',
      slugField: 'title',
      path: 'src/content/certificates/*',
      schema: {
        title: fields.slug({ name: { label: 'Template Name' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        course: fields.relationship({ label: 'Associated Course', collection: 'courses' }),
        templateImage: fields.text({
          label: 'Background Template Image',
          description: 'Path to template image (e.g. /assets/certificates/template.svg)',
        }),
      }
    }),

    // --- Active Competitions & Challenges ---
    competitions: collection({
      label: 'Competitions & Hackathons',
      slugField: 'title',
      path: 'src/content/competitions/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        platform: fields.select({
          label: 'Platform',
          options: [
            { label: 'Kaggle', value: 'kaggle' },
            { label: 'HackerRank', value: 'hackerrank' },
            { label: 'DrivenData', value: 'drivendata' },
            { label: 'Hugging Face', value: 'huggingface' },
            { label: 'Zindi', value: 'zindi' },
            { label: 'AIcrowd', value: 'aicrowd' },
          ],
          defaultValue: 'kaggle',
        }),
        url: fields.text({ label: 'Competition URL', validation: { isRequired: true } }),
        hostName: fields.text({ label: 'Host Organization / Company', defaultValue: 'Community Host' }),
        category: fields.select({
          label: 'Track / Category',
          options: [
            { label: 'NLP & LLMs', value: 'NLP & LLMs' },
            { label: 'Computer Vision', value: 'Computer Vision' },
            { label: 'Tabular & Predictive', value: 'Tabular & Predictive' },
            { label: 'Reinforcement Learning', value: 'Reinforcement Learning' },
            { label: 'Multimodal', value: 'Multimodal' },
            { label: 'Audio & Speech', value: 'Audio & Speech' },
          ],
          defaultValue: 'NLP & LLMs',
        }),
        difficulty: fields.select({
          label: 'Difficulty Level',
          options: [
            { label: 'Beginner', value: 'Beginner' },
            { label: 'Intermediate', value: 'Intermediate' },
            { label: 'Advanced', value: 'Advanced' },
            { label: 'Expert', value: 'Expert' },
          ],
          defaultValue: 'Intermediate',
        }),
        prizePool: fields.text({ label: 'Prize Pool Display (e.g. $50,000)', defaultValue: '$10,000' }),
        prizeAmountUSD: fields.number({ label: 'Prize Amount in USD (numeric for sorting)', defaultValue: 10000 }),
        rewardType: fields.select({
          label: 'Reward Type',
          options: [
            { label: 'Cash Prizes', value: 'cash' },
            { label: 'Compute & Credits', value: 'credits' },
            { label: 'Jobs & Interviews', value: 'jobs' },
            { label: 'Knowledge & Medals', value: 'knowledge' },
          ],
          defaultValue: 'cash',
        }),
        deadline: fields.text({ label: 'Deadline (ISO Date or Text e.g. 2026-11-30)', defaultValue: '2026-11-30' }),
        teamsCount: fields.number({ label: 'Registered Teams Count', defaultValue: 100 }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Ending Soon', value: 'ending-soon' },
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Completed / Closed', value: 'completed' },
          ],
          defaultValue: 'active',
        }),
        description: fields.text({ label: 'Short Description', multiline: true }),
        problemStatement: fields.text({ label: 'Problem Statement / Objective (Optional)', multiline: true }),
        evaluationMetric: fields.text({ label: 'Evaluation Metric (Optional, e.g. LogLoss, Macro F1)' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        featured: fields.checkbox({ label: 'Featured Challenge', defaultValue: false }),
      },
    }),

    // --- Glossary (Math & AI Symbol Decoder) ---
    glossary: collection({
      label: 'Glossary',
      slugField: 'name',
      path: 'src/content/glossary/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Term / Symbol Name' } }),
        glyph: fields.text({
          label: 'Symbol / Glyph',
          description: 'The display symbol or notation',
          validation: { isRequired: true },
        }),
        latex: fields.text({
          label: 'LaTeX Notation',
          description: 'Full LaTeX source (rendered with KaTeX)',
          multiline: true,
        }),
        pronunciation: fields.text({ label: 'Pronunciation / How to Read Aloud' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Deep Learning', value: 'deep-learning' },
            { label: 'Machine Learning', value: 'machine-learning' },
            { label: 'Mathematics', value: 'mathematics' },
            { label: 'Statistics', value: 'statistics' },
            { label: 'Linear Algebra', value: 'linear-algebra' },
            { label: 'Optimization & Calculus', value: 'optimization' },
            { label: 'Probability', value: 'probability' },
            { label: 'Python', value: 'python' },
            { label: 'Computer Science', value: 'computer-science' },
            { label: 'NLP & LLMs', value: 'nlp' },
            { label: 'Reinforcement Learning', value: 'reinforcement-learning' },
          ],
          defaultValue: 'deep-learning',
        }),
        meaning: fields.text({
          label: 'Meaning / Definition',
          multiline: true,
          validation: { isRequired: true },
        }),
        example: fields.text({ label: 'Real-World Example / Usage', multiline: true }),
        ambiguity: fields.text({ label: 'Common Ambiguities / Gotchas', multiline: true }),
        relatedLabId: fields.text({
          label: 'Related Interactive Lab ID (Optional)',
          description: 'Slug of an interactive lab that demonstrates this (e.g. "attention-visualizer")',
        }),
        relatedLabTitle: fields.text({ label: 'Related Lab Display Title (Optional)' }),
        featured: fields.checkbox({ label: 'Featured in Decoder', defaultValue: false }),
      },
    }),

    // --- Interactive Labs ---
    labs: collection({
      label: 'Interactive Labs',
      slugField: 'title',
      path: 'src/content/labs/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Lab Title' } }),
        shortTitle: fields.text({ label: 'Short Title (for cards / tabs)', validation: { isRequired: true } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Deep Learning', value: 'Deep Learning' },
            { label: 'Machine Learning', value: 'Machine Learning' },
            { label: 'Python & CS', value: 'Python & CS' },
            { label: 'Mathematics', value: 'Mathematics' },
            { label: 'NLP & LLMs', value: 'NLP & LLMs' },
          ],
          defaultValue: 'Deep Learning',
        }),
        simulatorType: fields.select({
          label: 'Simulator Component',
          description: 'Which interactive React component powers this lab',
          options: [
            { label: 'Transformer Self-Attention Visualizer', value: 'attention-visualizer' },
            { label: '2D Convolution & Feature Maps Lab', value: 'convolution-visualizer' },
            { label: 'Loss Surface & Gradient Descent Lab', value: 'gradient-descent' },
            { label: 'CPython Stack & Heap Memory Explorer', value: 'memory-explorer' },
            { label: 'AI Model Router & Latency Simulator', value: 'model-router' },
            { label: 'Neural Network Playground', value: 'neural-playground' },
            { label: 'Math Decoder (Symbols & LaTeX)', value: 'math-decoder' },
            { label: 'ML Pipeline System Design Ordering Challenge', value: 'pipeline-puzzle' },
          ],
          defaultValue: 'attention-visualizer',
        }),
        badge: fields.text({ label: 'Badge Text (e.g. "Transformers & LLMs")', defaultValue: '' }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        lessonPath: fields.text({ label: 'Related Lesson URL (Optional)', description: 'e.g. /lessons/dl-transformers-attention' }),
        lessonTitle: fields.text({ label: 'Related Lesson Title (Optional)' }),
        order: fields.number({ label: 'Display Order (lower = first)', defaultValue: 99 }),
        featured: fields.checkbox({ label: 'Featured Lab', defaultValue: false }),
      },
    }),

    // --- System Design Architectures ---
    systemDesignArchitectures: collection({
      label: 'System Design Architectures',
      slugField: 'title',
      path: 'src/content/system-design/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Architecture Title' } }),
        category: fields.text({ label: 'Category / Domain (e.g. Information Retrieval & LLMs)', validation: { isRequired: true } }),
        sla: fields.text({ label: 'Production SLA (e.g. P99 < 320ms • 10M Documents)', validation: { isRequired: true } }),
        summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true } }),
        latencyBudget: fields.array(
          fields.object({
            step: fields.text({ label: 'Dataflow Step / Stage' }),
            latency: fields.text({ label: 'Allocated Latency (e.g. 14ms)' }),
          }),
          {
            label: 'Latency Budget Breakdown',
            itemLabel: props => `${props.fields.step.value || 'Step'}: ${props.fields.latency.value || 'Latency'}`,
          }
        ),
        componentsUsed: fields.array(
          fields.text({ label: 'AWS Component / Technology' }),
          {
            label: 'Architecture Components Used',
            itemLabel: props => props.value || 'Component',
          }
        ),
        coreTradeoff: fields.text({ label: 'Core System Trade-off & Rationale', multiline: true, validation: { isRequired: true } }),
        order: fields.number({ label: 'Display Order (lower = first)', defaultValue: 1 }),
        featured: fields.checkbox({ label: 'Featured Blueprint', defaultValue: true }),
      },
    }),

    // --- System Design Interactive Puzzles & Scenarios ---
    systemDesignScenarios: collection({
      label: 'System Design Puzzles & Challenges',
      slugField: 'title',
      path: 'src/content/system-design-scenarios/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Challenge Title' } }),
        systemName: fields.text({ label: 'AWS System Name (e.g. aws-rag-production-vpc)', validation: { isRequired: true } }),
        slaTarget: fields.text({ label: 'SLA Target (e.g. P99 < 320ms SLA • 10M Document Chunks)', validation: { isRequired: true } }),
        difficulty: fields.select({
          label: 'Difficulty Level',
          options: [
            { label: 'Beginner', value: 'Beginner' },
            { label: 'Intermediate', value: 'Intermediate' },
            { label: 'Advanced', value: 'Advanced' },
          ],
          defaultValue: 'Intermediate',
        }),
        xpReward: fields.number({ label: 'XP Reward Points', defaultValue: 200 }),
        scenarioDescription: fields.text({ label: 'Scenario Requirement & Context', multiline: true, validation: { isRequired: true } }),
        objective: fields.text({ label: 'Challenge Objective', multiline: true, validation: { isRequired: true } }),
        vpcName: fields.text({ label: 'AWS VPC Name & CIDR (e.g. VPC: 10.0.0.0/16 [Region: us-east-1])', validation: { isRequired: true } }),
        subnets: fields.array(
          fields.object({
            name: fields.text({ label: 'Subnet Name & Function' }),
            x: fields.number({ label: 'SVG X Position', defaultValue: 40 }),
            y: fields.number({ label: 'SVG Y Position', defaultValue: 45 }),
            width: fields.number({ label: 'SVG Width', defaultValue: 880 }),
            height: fields.number({ label: 'SVG Height', defaultValue: 140 }),
            stroke: fields.text({ label: 'Subnet Boundary Color (Hex)', defaultValue: '#06b6d4' }),
          }),
          {
            label: 'VPC Subnets',
            itemLabel: props => props.fields.name.value || 'Subnet',
          }
        ),
        components: fields.array(
          fields.object({
            id: fields.text({ label: 'Component ID', validation: { isRequired: true } }),
            title: fields.text({ label: 'Component Title', validation: { isRequired: true } }),
            domain: fields.select({
              label: 'AWS Service Domain',
              options: [
                { label: 'API Gateway & Ingress', value: 'gateway' },
                { label: 'Compute & Containers (ECS/EKS)', value: 'compute' },
                { label: 'Storage & Vector Databases', value: 'storage' },
                { label: 'Machine Learning & SageMaker', value: 'ml' },
                { label: 'Event Streaming (MSK/Kafka)', value: 'streaming' },
                { label: 'Security & Quality Gates', value: 'security' },
              ],
              defaultValue: 'compute',
            }),
            awsService: fields.text({ label: 'AWS Service Name (e.g. Amazon OpenSearch Serverless)', validation: { isRequired: true } }),
            badge: fields.text({ label: 'Badge Label (e.g. OpenSearch / Qdrant on EKS)', validation: { isRequired: true } }),
            description: fields.text({ label: 'Component Role & Function', multiline: true, validation: { isRequired: true } }),
            techExample: fields.text({ label: 'Tech Stack Example (e.g. Qdrant / Milvus / pgvector)', validation: { isRequired: true } }),
            latencyBudgetMs: fields.number({ label: 'Latency Budget (ms)', defaultValue: 15 }),
            correctOrder: fields.number({ label: 'Correct Sequence Order (1 to 6)', validation: { min: 1, max: 6 }, defaultValue: 1 }),
          }),
          {
            label: 'Architecture Components (6 Sequenced Nodes)',
            itemLabel: props => `${props.fields.correctOrder.value || '?'}. ${props.fields.title.value || 'Component'} (${props.fields.awsService.value || 'AWS Service'})`,
          }
        ),
        engineeringInsight: fields.text({ label: 'Engineering Insight & Architectural Principles', multiline: true, validation: { isRequired: true } }),
        hint: fields.text({ label: 'Architect Hint / Advisory Note', multiline: true, validation: { isRequired: true } }),
        order: fields.number({ label: 'Challenge Order', defaultValue: 1 }),
      },
    }),

    // --- System Design Interview Simulator Problems ---
    systemDesignProblems: collection({
      label: 'System Design Simulator Problems',
      slugField: 'title',
      path: 'src/content/system-design-problems/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Problem Title (e.g. URL Shortener / TinyURL)' } }),
        difficulty: fields.select({
          label: 'Difficulty',
          options: [
            { label: 'Easy', value: 'Easy' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Hard', value: 'Hard' },
          ],
          defaultValue: 'Medium',
        }),
        category: fields.select({
          label: 'Architecture Category',
          options: [
            { label: 'General Distributed Systems', value: 'General' },
            { label: 'Social & Feed Networks', value: 'Social' },
            { label: 'Media & Streaming', value: 'Media' },
            { label: 'E-Commerce & High-Volume Payments', value: 'Finance' },
            { label: 'AI, LLMs & Machine Learning', value: 'AI/ML' },
          ],
          defaultValue: 'General',
        }),
        targetQps: fields.number({ label: 'Target Peak QPS Load (Requests/sec)', defaultValue: 50000 }),
        readRatioPercent: fields.number({ label: 'Read Ratio (%)', validation: { min: 0, max: 100 }, defaultValue: 90 }),
        maxLatencyMs: fields.number({ label: 'Max Target P99 Latency Budget (ms)', defaultValue: 50 }),
        summary: fields.text({ label: 'Problem Summary & Description', multiline: true, validation: { isRequired: true } }),
        functionalRequirements: fields.array(fields.text({ label: 'Functional Requirement' }), {
          label: 'Functional Requirements',
          itemLabel: props => props.value || 'Requirement',
        }),
        nonFunctionalRequirements: fields.array(fields.text({ label: 'Non-Functional Requirement' }), {
          label: 'Non-Functional Requirements',
          itemLabel: props => props.value || 'Requirement',
        }),
        hints: fields.array(fields.text({ label: 'Interview Hint / Trade-off Guide' }), {
          label: 'Architect Hints',
          itemLabel: props => props.value || 'Hint',
        }),
        referenceNodes: fields.array(
          fields.object({
            id: fields.text({ label: 'Node ID (e.g. client-1, lb-1, app-1)' }),
            componentType: fields.text({ label: 'Component Type (e.g. client, load-balancer, app-server, redis-cache, sql-db)' }),
            label: fields.text({ label: 'Custom Label' }),
            x: fields.number({ label: 'Canvas X Coordinate', defaultValue: 100 }),
            y: fields.number({ label: 'Canvas Y Coordinate', defaultValue: 100 }),
            instances: fields.number({ label: 'Instance Replicas Count', defaultValue: 1 }),
          }),
          {
            label: 'Reference Architecture Nodes',
            itemLabel: props => `${props.fields.label.value || props.fields.componentType.value} (x${props.fields.instances.value})`,
          }
        ),
        referenceEdges: fields.array(
          fields.object({
            from: fields.text({ label: 'Source Node ID' }),
            to: fields.text({ label: 'Target Node ID' }),
            isAsync: fields.checkbox({ label: 'Asynchronous (Decoupled / Non-blocking)' }),
            label: fields.text({ label: 'Edge Label / Traffic Type (e.g. Read, Write, Event)' }),
          }),
          {
            label: 'Reference Architecture Connections / Edges',
            itemLabel: props => `${props.fields.from.value} -> ${props.fields.to.value}${props.fields.isAsync.value ? ' (Async)' : ''}`,
          }
        ),
        order: fields.number({ label: 'Display Order', defaultValue: 1 }),
      },
    }),
  },
});