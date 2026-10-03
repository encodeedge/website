import React, { useState, useEffect } from 'react';
import { Coffee, Heart, Sparkles, X, ExternalLink, Check } from 'lucide-react';

export interface BuyMeCoffeePopupProps {
  enabled?: boolean;
  coffeeUrl?: string;
  title?: string;
  message?: string;
  triggerPageViews?: number;
  delaySeconds?: number;
  dismissDays?: number;
  presetAmounts?: string[];
  showFloatingButtonWhenDismissed?: boolean;
  position?: 'bottom-right' | 'bottom-left';
}

const STORAGE_KEY_DISMISSED = 'ee_coffee_dismissed_until';
const STORAGE_KEY_SUPPORTED = 'ee_coffee_supported';
const SESSION_KEY_NAV_COUNT = 'ee_coffee_nav_count';

export const BuyMeCoffeePopup: React.FC<BuyMeCoffeePopupProps> = ({
  enabled = true,
  coffeeUrl = 'https://buymeacoffee.com/encodeedge',
  title = 'Enjoying the free courses & guides? ☕',
  message = 'EncodeEdge is 100% free with zero ads or paywalls. If our tutorials helped you learn, consider buying a coffee to keep our servers brewing!',
  triggerPageViews = 2,
  delaySeconds = 4,
  dismissDays = 7,
  presetAmounts = ['3', '5', '10'],
  showFloatingButtonWhenDismissed = true,
  position = 'bottom-right',
}) => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>(presetAmounts[1] || '5');
  const [hasSupported, setHasSupported] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasProgressBtn, setHasProgressBtn] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setMounted(true);

    try {
      const supported = localStorage.getItem(STORAGE_KEY_SUPPORTED);
      if (supported) {
        setHasSupported(true);
      }

      // Check snooze / dismissal cooldown
      const dismissedUntilStr = localStorage.getItem(STORAGE_KEY_DISMISSED);
      const now = Date.now();
      const isCooldown = dismissedUntilStr ? now < parseInt(dismissedUntilStr, 10) : false;

      // Track session page views to make this non-aggressive
      const currentNavCount = parseInt(sessionStorage.getItem(SESSION_KEY_NAV_COUNT) || '0', 10) + 1;
      sessionStorage.setItem(SESSION_KEY_NAV_COUNT, currentNavCount.toString());

      if (isCooldown) {
        setIsDismissed(true);
        return;
      }

      // Only trigger auto-popup if user has navigated past threshold or scrolled
      if (currentNavCount >= triggerPageViews) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, (delaySeconds || 4) * 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is blocked
    }
  }, [enabled, triggerPageViews, delaySeconds]);

  // Handle detecting floating progress bar buttons (roadmaps study progress, scroll-to-top rings)
  useEffect(() => {
    const checkProgressElements = () => {
      const roadmapProgress = !!document.getElementById('floatingProgressContainer') ||
                             !!document.getElementById('floatingProgressBtn');
      const scrollTopProgress = !!document.getElementById('scrollTopBtn') ||
                                !!document.querySelector('button[aria-label="Scroll to top"]');
      const customProgress = !!document.querySelector('[data-floating-progress]');
      setHasProgressBtn(roadmapProgress || scrollTopProgress || customProgress);
    };

    checkProgressElements();
    window.addEventListener('resize', checkProgressElements, { passive: true });
    window.addEventListener('scroll', checkProgressElements, { passive: true });
    const observer = new MutationObserver(checkProgressElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', checkProgressElements);
      window.removeEventListener('scroll', checkProgressElements);
      observer.disconnect();
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!enabled || !mounted) return null;

  const handleDismiss = () => {
    setIsOpen(false);
    setIsDismissed(true);
    try {
      const snoozeMs = (dismissDays || 7) * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY_DISMISSED, (Date.now() + snoozeMs).toString());
    } catch {
      // Ignore storage errors
    }
  };

  const handleSupportClick = () => {
    try {
      localStorage.setItem(STORAGE_KEY_SUPPORTED, 'true');
      setHasSupported(true);
    } catch {
      // Ignore storage errors
    }

    // Open target coffee url in new window/tab
    window.open(coffeeUrl, '_blank', 'noopener,noreferrer');

    // Smoothly close after a brief delay with appreciation
    setTimeout(() => {
      handleDismiss();
    }, 2500);
  };

  const handleReopen = () => {
    setIsDismissed(false);
    setIsOpen(true);
  };

  // Determine amount labels
  const getAmountEmoji = (amt: string) => {
    const val = parseInt(amt, 10);
    if (val <= 3) return '☕ Small Coffee';
    if (val <= 5) return '☕☕ Double Shot';
    return '🥐 Coffee & Treat';
  };

  const isLeft = position === 'bottom-left';

  // Smart non-overlapping coordinates:
  // When on bottom-right and any progress bar button exists (such as the roadmap Study Progress pill or scroll progress),
  // offset by ~80px so it stacks above it with zero overlapping.
  const triggerPositionClass = isLeft
    ? 'bottom-6 left-6'
    : hasProgressBtn
    ? 'bottom-[78px] right-5 sm:bottom-[86px] sm:right-6'
    : 'bottom-5 right-5 sm:bottom-6 sm:right-6';

  const modalPositionClass = isLeft
    ? 'bottom-6 left-5 sm:left-6'
    : hasProgressBtn
    ? 'bottom-[78px] right-5 sm:bottom-[86px] sm:right-6'
    : 'bottom-5 right-5 sm:bottom-6 sm:right-6';

  return (
    <>
      <style>{`
        @keyframes coffee-steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          40% { opacity: 0.8; }
          80% { transform: translateY(-7px) scaleX(1.15); opacity: 0.4; }
          100% { transform: translateY(-12px) scaleX(1.3); opacity: 0; }
        }
        .animate-coffee-steam-1 {
          animation: coffee-steam 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-coffee-steam-2 {
          animation: coffee-steam 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.7s;
        }
      `}</style>

      {/* ── Subtitle / Collapsed Floating Coffee Trigger ─────────────────── */}
      {!isOpen && showFloatingButtonWhenDismissed && (
        <aside
          aria-label="Buy Me a Coffee Support"
          className={`fixed ${triggerPositionClass} z-[9970] flex items-center transition-all duration-300`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Tooltip on hover */}
          <div
            className={`pointer-events-none absolute ${
              isLeft ? 'left-full ml-3' : 'right-full mr-3'
            } whitespace-nowrap rounded-xl bg-slate-900/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-amber-200 border border-amber-500/20 shadow-xl transition-all duration-200 ${
              isHovered
                ? 'translate-x-0 opacity-100'
                : isLeft
                ? '-translate-x-2 opacity-0'
                : 'translate-x-2 opacity-0'
            }`}
          >
            Buy us a coffee ☕
          </div>

          <button
            onClick={handleReopen}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 p-2.5 sm:p-3 text-white shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/30 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-95 transition-all duration-300"
            title="Support EncodeEdge with a coffee"
            aria-label="Support with a coffee"
          >
            <div className="relative">
              {/* Animated steam lines */}
              <span className="absolute -top-2 left-1.5 h-2 w-0.5 rounded-full bg-amber-200 animate-coffee-steam-1 pointer-events-none" />
              <span className="absolute -top-3 left-3 h-2 w-0.5 rounded-full bg-amber-100 animate-coffee-steam-2 pointer-events-none" />
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <span className="hidden sm:inline-block pr-1.5 text-xs font-bold text-amber-950">
              Buy a Coffee
            </span>
          </button>
        </aside>
      )}

      {/* ── Innovative Non-Intrusive Floating Card / Modal ─────────────────── */}
      {isOpen && (
        <aside
          role="dialog"
          aria-modal="false"
          aria-labelledby="coffee-popup-title"
          className={`fixed ${modalPositionClass} z-[9975] w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm transform transition-all duration-500 ease-out`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950/95 dark:bg-zinc-950/95 backdrop-blur-xl p-5 text-slate-100 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.3)] ring-1 ring-white/10">
            {/* Ambient amber glow in background */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-yellow-500/10 blur-3xl" />

            {/* Header with dismiss button */}
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 shadow-md shadow-amber-500/30">
                  {/* Steaming elements */}
                  <span className="absolute -top-1.5 left-3 h-2 w-0.5 rounded-full bg-amber-200 animate-coffee-steam-1" />
                  <span className="absolute -top-2.5 left-5 h-2 w-0.5 rounded-full bg-amber-100 animate-coffee-steam-2" />
                  <Coffee className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
                      <Sparkles className="h-2.5 w-2.5" /> 100% Free & Open
                    </span>
                  </div>
                  <h3 id="coffee-popup-title" className="mt-1 text-sm font-bold text-white leading-tight">
                    {title}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Dismiss coffee popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message Body */}
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              {message}
            </p>

            {/* Preset Amount Selector Chips */}
            <div className="mt-4">
              <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center justify-between">
                <span>Select coffee fuel:</span>
                <span className="text-amber-400 font-semibold">{getAmountEmoji(selectedAmount)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amt) => {
                  const isSelected = selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedAmount(amt)}
                      className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/20 scale-[1.02]'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm font-extrabold">${amt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleSupportClick}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 px-4 py-2.5 text-xs font-bold text-amber-950 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/35 active:scale-[0.98]"
              >
                {hasSupported ? (
                  <>
                    <Check className="h-4 w-4 text-amber-950" />
                    <span>Thank you for brewing with us! ❤️</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 text-amber-950 fill-amber-950/20 transition-transform group-hover:scale-110" />
                    <span>Fuel with ${selectedAmount} Coffee</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between px-1 pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Maybe later
                </button>
                <span className="text-[10px] text-slate-500">
                  Snoozes for {dismissDays} days
                </span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default BuyMeCoffeePopup;
