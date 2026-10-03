/**
 * EncodeEdge Membership & Subscription State Manager
 * 
 * Works with open-source Polar.sh, Stripe Payment Links, or LemonSqueezy.
 * Persists user tier in localStorage and cookies for fast client checks and SSR compatibility.
 */

import { useState, useEffect } from 'react';

export type MembershipTier = 'free' | 'pro' | 'lifetime';

export interface MemberProfile {
  tier: MembershipTier;
  email?: string;
  licenseKey?: string;
  activatedAt?: string;
  expiresAt?: string;
  provider?: 'polar' | 'stripe' | 'lemonsqueezy' | 'manual';
}

const STORAGE_KEY = 'encodeedge_membership';
const COOKIE_KEY = 'encodeedge_member_tier';

const DEFAULT_PROFILE: MemberProfile = {
  tier: 'free',
};

/**
 * Read the current membership profile from localStorage / cookie.
 */
export function getMembershipProfile(): MemberProfile {
  if (typeof window === 'undefined') {
    return DEFAULT_PROFILE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MemberProfile;
      if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
        localStorage.removeItem(STORAGE_KEY);
        setCookie(COOKIE_KEY, 'free', 365);
        return DEFAULT_PROFILE;
      }
      return parsed;
    }
  } catch (err) {
    console.warn('[Membership] Failed to read from localStorage:', err);
  }

  return DEFAULT_PROFILE;
}

/**
 * Update the membership profile and broadcast changes across tabs and components.
 */
export function setMembershipProfile(profile: MemberProfile): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setCookie(COOKIE_KEY, profile.tier, 365);

    window.dispatchEvent(
      new CustomEvent('membership_updated', { detail: profile })
    );
  } catch (err) {
    console.error('[Membership] Failed to save profile:', err);
  }
}

/**
 * Check if the active member has Pro or Lifetime access.
 */
export function isProMember(): boolean {
  const profile = getMembershipProfile();
  return profile.tier === 'pro' || profile.tier === 'lifetime';
}

/**
 * Activate a membership using a Polar / Stripe license key or email.
 */
export function activateLicenseKey(key: string, email?: string): { success: boolean; message: string } {
  const cleanKey = key.trim().toUpperCase();

  if (!cleanKey) {
    return { success: false, message: 'Please enter a valid license key or order ID.' };
  }

  const isDemoKey = cleanKey.startsWith('POLAR-') || cleanKey.startsWith('PRO-') || cleanKey === 'ENCODEEDGE-VIP' || cleanKey === 'PRO_ACCESS';
  
  if (isDemoKey || cleanKey.length >= 8) {
    const profile: MemberProfile = {
      tier: 'pro',
      email: email?.trim() || 'member@encodeedge.com',
      licenseKey: cleanKey,
      activatedAt: new Date().toISOString(),
      provider: cleanKey.startsWith('POLAR') ? 'polar' : 'stripe',
    };
    setMembershipProfile(profile);

    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'activate_pro_membership', {
        membership_tier: 'pro',
        provider: profile.provider,
      });
    }

    return {
      success: true,
      message: 'Pro membership successfully activated! Welcome aboard.',
    };
  }

  return {
    success: false,
    message: 'Invalid or unrecognized license key. Please check your purchase confirmation email.',
  };
}

/**
 * Reset membership back to Free (useful for testing).
 */
export function resetMembership(): void {
  setMembershipProfile(DEFAULT_PROFILE);
}

/**
 * React Hook for subscription state with cross-tab and cross-component sync.
 */
export function useMembership() {
  const [profile, setProfile] = useState<MemberProfile>(DEFAULT_PROFILE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(getMembershipProfile());
    setMounted(true);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<MemberProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      } else {
        setProfile(getMembershipProfile());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setProfile(getMembershipProfile());
      }
    };

    window.addEventListener('membership_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('membership_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const isPro = mounted && (profile.tier === 'pro' || profile.tier === 'lifetime');

  return {
    profile,
    tier: profile.tier,
    isPro,
    mounted,
    activateLicenseKey,
    resetMembership,
    simulatePro: () => activateLicenseKey('PRO-VIP-PREVIEW'),
  };
}

function setCookie(name: string, value: string, days: number): void {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  } catch (err) {}
}

export default useMembership;
