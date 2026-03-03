import React, { useState } from "react";
import { useLicense } from "../hooks/useLicense";

export interface PremiumGateProps {
  feature: string;
  /** "section" blocks content; "inline" shows lock inline. Default: "section" */
  variant?: "section" | "inline";
  upgradeUrl?: string;
  signInUrl?: string;
  children: React.ReactNode;
}

const lockIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function UpgradePopover({
  upgradeUrl,
  signInUrl,
  visible,
}: {
  upgradeUrl: string;
  signInUrl?: string;
  visible: boolean;
}) {
  return (
    <div
      className="ds-premium-popover"
      style={visible ? { opacity: 1, pointerEvents: "auto" } : undefined}
    >
      <span>{lockIcon}</span>
      <span>Pro feature</span>
      {signInUrl && <a href={signInUrl}>Sign in &rarr;</a>}
      <a href={upgradeUrl}>View pricing &rarr;</a>
    </div>
  );
}

export function PremiumGate({
  variant = "section",
  upgradeUrl,
  signInUrl,
  children,
}: PremiumGateProps) {
  const { isPremium } = useLicense();
  const [hovered, setHovered] = useState(false);
  const leaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    setHovered(true);
  };
  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => setHovered(false), 300);
  };

  if (isPremium) return <>{children}</>;

  const pricingHref = upgradeUrl || "/pricing";

  if (variant === "inline") {
    return (
      <span className="ds-premium-gated-inline">
        <span className="ds-premium-locked-content">{children}</span>
        <span
          className="ds-premium-lock"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          style={
            hovered ? { opacity: 1, color: "hsl(var(--brand))" } : undefined
          }
        >
          {lockIcon}
        </span>
        <UpgradePopover upgradeUrl={pricingHref} signInUrl={signInUrl} visible={hovered} />
      </span>
    );
  }

  return (
    <div className="ds-premium-gated-section">
      {children}
      <span
        className="ds-premium-lock ds-premium-section-lock"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={
          hovered ? { opacity: 1, color: "hsl(var(--brand))" } : undefined
        }
      >
        {lockIcon}
        <UpgradePopover upgradeUrl={pricingHref} signInUrl={signInUrl} visible={hovered} />
      </span>
    </div>
  );
}
