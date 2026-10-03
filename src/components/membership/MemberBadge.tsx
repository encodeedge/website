import React, { useState } from 'react';
import { useMembership } from '@/lib/membership';
import { Sparkles, ShieldCheck, Key, LogOut } from 'lucide-react';

export const MemberBadge: React.FC = () => {
  const { isPro, profile, mounted, resetMembership } = useMembership();
  const [open, setOpen] = useState(false);

  if (!mounted) return null;

  if (isPro) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/15 via-primary/15 to-emerald-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:opacity-90 transition-all cursor-pointer shadow-xs"
          title="Click to view subscription details"
        >
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Pro Member</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card p-4 shadow-xl z-50 text-left space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-500" />
              <div>
                <p className="text-xs font-bold text-foreground">Pro Plan Active</p>
                <p className="text-[11px] text-muted-foreground capitalize">
                  Provider: {profile.provider || 'Polar'}
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/60 text-[11px] text-muted-foreground space-y-1">
              <p>
                <span className="font-medium text-foreground">Key:</span> {profile.licenseKey || 'Active'}
              </p>
              <p>
                <span className="font-medium text-foreground">Status:</span> All blueprints & labs unlocked
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border">
              <a
                href="/pricing"
                className="text-xs text-primary hover:underline font-medium"
              >
                Plan Details
              </a>
              <button
                onClick={() => {
                  resetMembership();
                  setOpen(false);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-red-500 cursor-pointer"
              >
                <LogOut className="size-3" />
                <span>Reset to Free</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href="/pricing"
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
    >
      <Key className="size-3" />
      <span>Get Pro</span>
    </a>
  );
};

export default MemberBadge;
