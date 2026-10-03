import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ArrowRight, Shield, Zap, HelpCircle, Key, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMembership } from '@/lib/membership';

export interface PricingTableProps {
  polarProMonthlyUrl?: string;
  polarProAnnualUrl?: string;
  polarLifetimeUrl?: string;
  proMonthlyPrice?: number;
  proAnnualPrice?: number;
  lifetimePrice?: number;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  polarProMonthlyUrl = 'https://polar.sh/encodeedge/subscriptions',
  polarProAnnualUrl = 'https://polar.sh/encodeedge/subscriptions?cycle=yearly',
  polarLifetimeUrl = 'https://polar.sh/encodeedge/products/lifetime-access',
  proMonthlyPrice = 19,
  proAnnualPrice = 190,
  lifetimePrice = 399,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const { isPro, profile, activateLicenseKey, resetMembership, simulatePro } = useMembership();
  const [activationKey, setActivationKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Automatically activate Pro when redirected back from Polar checkout
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const checkoutId = params.get('checkout_id') || params.get('session_id') || params.get('order_id');
    const status = params.get('status');

    if (checkoutId || status === 'success') {
      const key = checkoutId ? `POLAR-${checkoutId}` : 'POLAR-SUCCESS';
      const res = activateLicenseKey(key);
      if (res.success) {
        setStatusMessage({
          text: '🎉 Welcome to EncodeEdge Pro! Your subscription has been automatically activated.',
          error: false,
        });
        // Clean URL without reloading page
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleKeyActivation = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const result = activateLicenseKey(activationKey);
    if (result.success) {
      setStatusMessage({ text: result.message, error: false });
    } else {
      setStatusMessage({ text: result.message, error: true });
    }
  };

  const handleCheckoutClick = (url: string, planName: string) => {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'begin_checkout', {
        value: planName === 'Lifetime' ? 399 : billingCycle === 'annual' ? 190 : 19,
        currency: 'USD',
        items: [{ item_name: planName, item_category: 'subscription' }],
      });
    }

    if (typeof (window as any).dataLayer !== 'undefined') {
      (window as any).dataLayer.push({
        event: 'begin_checkout',
        plan: planName,
        billing_cycle: billingCycle,
      });
    }

    if (url && !url.includes('example.com') && !url.includes('placeholder')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      simulatePro();
      setStatusMessage({
        text: `Instant test mode: Activated ${planName} successfully!`,
        error: false,
      });
    }
  };

  return (
    <div className="space-y-16">
      {/* Active Member Status Alert */}
      {isPro && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <Sparkles className="size-4 text-emerald-500" />
            <span>
              You currently have an active <strong>Pro Membership</strong> ({profile.licenseKey || 'Active'}).
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetMembership}
            className="text-xs text-muted-foreground hover:text-red-500 h-8"
          >
            <RefreshCw className="size-3 mr-1" />
            Reset to Free for Testing
          </Button>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex items-center rounded-full p-1 bg-muted border border-border">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              Save 20%
            </span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Cancel or switch plans anytime. Powered by open-source Polar.sh and Stripe.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
        
        {/* Tier 1: Community / Free */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card/60 p-8 shadow-xs hover:border-border/80 transition-all">
          <div>
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Community
              </span>
              <h3 className="text-2xl font-bold font-serif text-foreground">Free Starter</h3>
              <p className="text-xs text-muted-foreground min-h-[36px]">
                Foundational AI and software engineering roadmaps for self-directed engineers.
              </p>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$0</span>
                <span className="text-xs text-muted-foreground">/ forever</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Access to all visual career roadmaps</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Foundational blog articles & math guides</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Basic interactive code snippets</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Community Discord channel access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Weekly newsletter & engineering trends</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Button
              asChild
              variant="outline"
              className="w-full font-semibold rounded-xl text-xs h-11"
            >
              <a href="/roadmaps">
                <span>Start Learning Free</span>
                <ArrowRight className="size-3.5 ml-1.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Tier 2: Pro Engineer (Featured) */}
        <div className="relative flex flex-col justify-between rounded-3xl border-2 border-primary bg-card p-8 shadow-xl hover:shadow-2xl transition-all scale-100 md:-translate-y-2">
          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="size-3.5" />
            <span>MOST POPULAR</span>
          </div>

          <div>
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                Full-Access Engineer
              </span>
              <h3 className="text-2xl font-bold font-serif text-foreground">Pro Plan</h3>
              <p className="text-xs text-muted-foreground min-h-[36px]">
                Complete production blueprints, interactive simulators, and verifiable credentials.
              </p>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">
                  {billingCycle === 'annual' ? `$${Math.round(proAnnualPrice / 12)}` : `$${proMonthlyPrice}`}
                </span>
                <span className="text-xs text-muted-foreground">
                  / month {billingCycle === 'annual' && `(billed $${proAnnualPrice}/yr)`}
                </span>
              </div>
              {billingCycle === 'annual' && (proMonthlyPrice * 12 > proAnnualPrice) && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Save ${(proMonthlyPrice * 12) - proAnnualPrice} per year
                </p>
              )}
            </div>

            <ul className="space-y-3 text-xs text-foreground font-medium">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary shrink-0" />
                <span><strong>All Free Community features</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary shrink-0" />
                <span>Interactive System Design & Blueprint Lab</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary shrink-0" />
                <span>Deep Learning & ML production walkthroughs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary shrink-0" />
                <span>Cryptographically verifiable LMS certificates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary shrink-0" />
                <span>Downloadable Jupyter notebooks & diagrams</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary shrink-0" />
                <span>Private Pro Discord engineering lounge</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary shrink-0" />
                <span>Early access to newly published courses</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 space-y-2">
            <Button
              size="lg"
              onClick={() =>
                handleCheckoutClick(
                  billingCycle === 'annual' ? polarProAnnualUrl : polarProMonthlyUrl,
                  'Pro Plan'
                )
              }
              className="w-full font-bold rounded-xl text-xs h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2 cursor-pointer"
            >
              <span>{isPro ? 'Manage Active Pro Plan' : 'Join EncodeEdge Pro'}</span>
              <ArrowRight className="size-4" />
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              7-day money-back guarantee • No questions asked
            </p>
          </div>
        </div>

        {/* Tier 3: Lifetime All-Access */}
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card/60 p-8 shadow-xs hover:border-border/80 transition-all">
          <div>
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                One-Time Payment
              </span>
              <h3 className="text-2xl font-bold font-serif text-foreground">Lifetime Access</h3>
              <p className="text-xs text-muted-foreground min-h-[36px]">
                Pay once, own all current and future courses and blueprints forever.
              </p>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">${lifetimePrice}</span>
                <span className="text-xs text-muted-foreground">/ one-time</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Never pay another subscription fee</p>
            </div>

            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span><strong>Every Pro feature included forever</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>All future courses, lessons & updates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Raw Figma & Excalidraw architecture source files</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>1-on-1 resume & portfolio architecture review</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Direct instructor office hours access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Lifetime Founder badge on certificates</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleCheckoutClick(polarLifetimeUrl, 'Lifetime')}
              className="w-full font-semibold rounded-xl text-xs h-11 cursor-pointer"
            >
              <span>Get Lifetime Access</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </div>
        </div>

      </div>

      {/* License Key Redemption Bar for Existing Customers */}
      <div className="max-w-xl mx-auto rounded-2xl border border-border bg-muted/40 p-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
          <Key className="size-4 text-primary" />
          <span>Already purchased through Polar or Stripe?</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter your license key or order ID below to immediately activate your Pro membership in this browser.
        </p>

        <form onSubmit={handleKeyActivation} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            required
            placeholder="e.g. POLAR-XXXXX or PRO_ACCESS"
            value={activationKey}
            onChange={(e) => setActivationKey(e.target.value)}
            className="flex-1 h-10 px-3.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="sm" className="h-10 px-5 shrink-0 font-medium">
            Activate
          </Button>
        </form>

        {statusMessage && (
          <p
            className={`text-xs font-medium ${
              statusMessage.error ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {statusMessage.text}
          </p>
        )}

        <p className="text-[11px] text-muted-foreground">
          Demo testing tip: Use key <code className="bg-muted px-1.5 py-0.5 rounded font-mono">PRO_ACCESS</code> or click{' '}
          <button
            type="button"
            onClick={simulatePro}
            className="text-primary underline hover:opacity-80 cursor-pointer"
          >
            Instant 1-Click Pro Test
          </button>
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto pt-10 border-t border-border space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-serif text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-muted-foreground">
            Everything you need to know about EncodeEdge paid plans and licensing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-1.5 p-4 rounded-xl border border-border bg-card/40">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <HelpCircle className="size-4 text-primary shrink-0" />
              How do I access Pro content after purchase?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Once you complete checkout on Polar or Stripe, you receive an instant confirmation email with your license key. Entering it here or logging in immediately unlocks all locked blueprints, courses, and downloadable notebooks.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl border border-border bg-card/40">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="size-4 text-primary shrink-0" />
              Can I get a refund if it's not for me?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Yes, absolutely. We offer a 7-day money-back guarantee. If you don't feel the blueprints and labs leveled up your engineering skills, just email support@encodeedge.com for a full refund.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl border border-border bg-card/40">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Zap className="size-4 text-primary shrink-0" />
              Can I expense this with my employer?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Yes! Most companies allow employees to use their annual learning and development budget. Every purchase comes with a full PDF VAT invoice suitable for expense reports.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl border border-border bg-card/40">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Check className="size-4 text-primary shrink-0" />
              Are certificates verifiable?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Yes. All course completion certificates generated on EncodeEdge have unique cryptographic verification IDs that anyone or any prospective employer can verify at /verify.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
