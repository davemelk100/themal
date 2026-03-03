import React from "react";
import type { PremiumFeature } from "../utils/license";
import { useLicense } from "../hooks/useLicense";

export interface PremiumGateProps {
  feature: PremiumFeature;
  /** "section" blurs content with overlay; "inline" dims with lock badge. Default: "section" */
  variant?: "section" | "inline";
  upgradeUrl?: string;
  children: React.ReactNode;
}

const lockSvg = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export function PremiumGate({
  feature,
  variant = "section",
  upgradeUrl = "https://theemel.com/pricing",
  children,
}: PremiumGateProps) {
  const { isPremium } = useLicense();

  if (isPremium) return <>{children}</>;

  if (variant === "inline") {
    return (
      <span
        className="ds-premium-inline"
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
        }}
        title={`Premium feature: ${feature}`}
      >
        <span
          style={{
            opacity: 0.4,
            pointerEvents: "none" as const,
            userSelect: "none" as const,
          }}
        >
          {children}
        </span>
        <span
          style={{
            position: "absolute",
            top: -2,
            right: -6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
            fontSize: 9,
            lineHeight: 1,
            pointerEvents: "auto" as const,
          }}
          aria-label="Premium feature"
        >
          {lockSvg}
        </span>
      </span>
    );
  }

  // variant === "section"
  return (
    <div
      className="ds-premium-section"
      style={{ position: "relative" }}
    >
      <div
        style={{
          opacity: 0.3,
          filter: "blur(1px)",
          pointerEvents: "none" as const,
          userSelect: "none" as const,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          zIndex: 10,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "hsl(var(--muted-foreground))",
            fontSize: 13,
            fontWeight: 300,
          }}
        >
          {lockSvg}
          Premium Feature
        </span>
        <a
          href={upgradeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "hsl(var(--brand))",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Upgrade
        </a>
      </div>
    </div>
  );
}
