import React from "react";
import { useLicense } from "../hooks/useLicense";

export interface PremiumGateProps {
  feature: string;
  /** "section" shows lock next to section; "inline" shows lock inline. Default: "section" */
  variant?: "section" | "inline";
  upgradeUrl?: string;
  children: React.ReactNode;
}

const lockIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export function PremiumGate({
  variant = "section",
  upgradeUrl,
  children,
}: PremiumGateProps) {
  const { isPremium } = useLicense();

  if (isPremium) return <>{children}</>;

  const pricingHref = upgradeUrl || "/pricing";

  if (variant === "inline") {
    return (
      <span className="ds-premium-gated-inline">
        {children}
        <a
          href={pricingHref}
          className="ds-premium-lock"
          title="Pro feature — click to view pricing"
        >
          {lockIcon}
        </a>
      </span>
    );
  }

  return (
    <div className="ds-premium-gated-section">
      {children}
      <a
        href={pricingHref}
        className="ds-premium-lock-badge"
        title="Pro feature — click to view pricing"
      >
        {lockIcon}
        <span>Pro</span>
      </a>
    </div>
  );
}
