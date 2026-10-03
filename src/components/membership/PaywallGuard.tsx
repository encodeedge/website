import React, { useState } from 'react';
import { useMembership } from '@/lib/membership';
import { Lock, Sparkles, Check, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaywallGuardProps {
  children: React.ReactNode;
  featureName?: string;
  requiredTier?: 'pro' | 'lifetime';
  previewHeight?: string;
}

export const PaywallGuard: React.FC<PaywallGuardProps> = ({
  children,
  featureName = 'Pro Engineering Blueprint',
  requiredTier = 'pro',
  previewHeight = '140px',
}) => {
  const { isPro, mounted, activateLicenseKey } = useMembership();
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = activateLicenseKey(licenseInput);
    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => setShowKeyInput(false), 1200);
    } else {
      setErrorMessage(res.message);
    }
  };

  if (mounted && isPro) {
    return (
      <div className="relative group">
        <div className="flex items-center justify-between mb-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4" />
            <span>Unlocked with your Pro Membership</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Active</span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="relative my-8 overflow-hidden rounded-2xl border border-black-200 dark:border-black-800 bg-background shadow-lg">
      <div
        className="relative overflow-hidden select-none pointer-events-none opacity-40 blur-xs"
        style={{ maxHeight: previewHeight }}
      >
        {children}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      <div className="p-6 md:p-8 text-center flex flex-col items-center">
        <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm">
          <Lock className="size-5" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
          <Sparkles className="size-3.5" />
          Pro Member Exclusive
        </div>

        <h3 className="text-xl md:text-2xl font-bold font-serif text-foreground">
          Unlock {featureName}
        </h3>

        <p className="text-muted-foreground text-sm max-w-md mt-2 leading-relaxed">
          This deep-dive architectural lab and production implementation is reserved for EncodeEdge Pro members.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left my-6 text-xs text-muted-foreground max-w-md w-full">
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>Complete executable code labs</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>High-res architectural blueprints</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>Verified course credentials</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>Priority Discord engineering lounge</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-sm">
            <a href="/pricing">
              <span>Upgrade to Pro</span>
              <ArrowRight className="size-4" />
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-xs"
            onClick={() => setShowKeyInput(!showKeyInput)}
          >
            <Key className="size-3.5 mr-1.5" />
            <span>I have a license key</span>
          </Button>
        </div>

        {showKeyInput && (
          <form
            onSubmit={handleKeySubmit}
            className="mt-6 w-full max-w-md p-4 rounded-xl border border-border bg-muted/40 space-y-3"
          >
            <p className="text-xs text-muted-foreground text-left">
              Enter your Polar or Stripe order ID / license key:
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. POLAR-XXXXX or PRO-XXXXX"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                className="text-xs h-9"
              />
              <Button type="submit" size="sm" className="h-9 shrink-0">
                Unlock
              </Button>
            </div>
            {errorMessage && (
              <p className="text-xs text-red-500 text-left font-medium">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-xs text-emerald-500 text-left font-medium">{successMessage}</p>
            )}
            <p className="text-[11px] text-muted-foreground text-left">
              Tip: Enter <code className="bg-muted px-1 py-0.5 rounded font-mono">PRO_ACCESS</code> or <code className="bg-muted px-1 py-0.5 rounded font-mono">ENCODEEDGE-VIP</code> to test.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaywallGuard;
