import React, { useState, useEffect } from 'react';
import { X, Megaphone, ArrowRight, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface AnnouncementBannerProps {
  enabled?: boolean;
  message?: string;
  linkText?: string;
  linkUrl?: string;
  style?: 'info' | 'success' | 'warning' | 'promo';
  dismissible?: boolean;
  /** Unique ID for this banner — if set, dismissed state is remembered per ID */
  bannerId?: string;
}

const STYLE_CONFIG = {
  info: {
    bg: 'bg-blue-600',
    text: 'text-white',
    btn: 'bg-white/20 hover:bg-white/30 text-white border-white/30',
    Icon: Info,
  },
  success: {
    bg: 'bg-emerald-600',
    text: 'text-white',
    btn: 'bg-white/20 hover:bg-white/30 text-white border-white/30',
    Icon: CheckCircle,
  },
  warning: {
    bg: 'bg-amber-500',
    text: 'text-white',
    btn: 'bg-white/20 hover:bg-white/30 text-white border-white/30',
    Icon: AlertTriangle,
  },
  promo: {
    bg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600',
    text: 'text-white',
    btn: 'bg-white/20 hover:bg-white/30 text-white border-white/30',
    Icon: Sparkles,
  },
};

export const AnnouncementBanner = ({
  enabled = true,
  message = 'New courses just launched — check what\'s new!',
  linkText = 'See what\'s new',
  linkUrl = '/courses',
  style = 'info',
  dismissible = true,
  bannerId = 'default',
}: AnnouncementBannerProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (dismissible) {
      try {
        const dismissed = JSON.parse(sessionStorage.getItem('ee_banners_dismissed') || '[]');
        if (dismissed.includes(bannerId)) return;
      } catch { /* noop */ }
    }
    setVisible(true);
  }, [enabled, dismissible, bannerId]);

  const dismiss = () => {
    setVisible(false);
    if (dismissible) {
      try {
        const dismissed = JSON.parse(sessionStorage.getItem('ee_banners_dismissed') || '[]');
        dismissed.push(bannerId);
        sessionStorage.setItem('ee_banners_dismissed', JSON.stringify(dismissed));
      } catch { /* noop */ }
    }
  };

  if (!visible) return null;

  const cfg = STYLE_CONFIG[style];
  const Icon = cfg.Icon;

  return (
    <div className={`relative w-full z-[9999] ${cfg.bg} ${cfg.text} py-2.5 px-4`}
      style={style === 'promo' ? { backgroundSize: '200% 100%', animation: 'gradientShift 4s ease infinite' } : undefined}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap text-sm">
        <Icon className="w-4 h-4 shrink-0 opacity-90" />
        <span className="font-semibold">{message}</span>
        {linkUrl && linkText && (
          <a
            href={linkUrl}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-all ${cfg.btn}`}
          >
            {linkText} <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>
      {dismissible && (
        <button
          onClick={dismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default AnnouncementBanner;
