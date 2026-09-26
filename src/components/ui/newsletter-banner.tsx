import React, { useState, useEffect } from 'react';
import { X, Sparkles, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const DISMISS_KEY = 'ee_newsletter_banner_dismissed';
const SUBSCRIBE_KEY = 'ee_newsletter_subscribed';
const SHOW_DELAY_MS = 30000; // 30 seconds

export const NewsletterBanner = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Don't show if already subscribed or dismissed this session
    try {
      if (localStorage.getItem(SUBSCRIBE_KEY)) return;
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch { /* ignore */ }

    // Wait 30s then show
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setStatus('submitting');

    try {
      // Submit to the existing /subscribe page form via fetch or just save locally
      // In production wire this to your email provider API endpoint
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      setStatus('success');
      try { localStorage.setItem(SUBSCRIBE_KEY, '1'); } catch { /* ignore */ }
      setTimeout(() => { setVisible(false); }, 3000);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9980] transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Backdrop fade at top */}
      <div className="h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-white/10 px-4 py-4 md:py-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon + copy */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-500/15 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-snug">
                Join 2,000+ learners getting weekly AI & ML insights
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                No spam. Unsubscribe anytime. Free forever.
              </div>
            </div>
          </div>

          {/* Form */}
          {status === 'success' ? (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>You're in! Welcome 🎉</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 w-full sm:w-auto shrink-0"
            >
              <div className="relative flex-1 sm:w-56">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={status === 'submitting'}
                  className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-60 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 shrink-0"
              >
                {status === 'submitting' ? (
                  <span>Joining...</span>
                ) : (
                  <>
                    <span>Join free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 sm:static p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 text-center mt-2">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default NewsletterBanner;
