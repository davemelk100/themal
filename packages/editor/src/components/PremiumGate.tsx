import React from "react";
import { useLicense } from "../hooks/useLicense";

export interface PremiumGateProps {
  feature: string;
  /** "section" dims content; "inline" dims inline content. Default: "section" */
  variant?: "section" | "inline";
  upgradeUrl?: string;
  children: React.ReactNode;
}

export function PremiumGate({
  variant = "section",
  children,
}: PremiumGateProps) {
  const { isPremium } = useLicense();

  if (isPremium) return <>{children}</>;

  if (variant === "inline") {
    return (
      <span
        className="ds-premium-inline"
        style={{
          display: "inline-flex",
          alignItems: "center",
          opacity: 0.4,
          pointerEvents: "none" as const,
          userSelect: "none" as const,
        }}
      >
        {children}
      </span>
    );
  }

  // variant === "section"
  return (
    <div
      className="ds-premium-section"
      style={{
        opacity: 0.4,
        pointerEvents: "none" as const,
        userSelect: "none" as const,
      }}
    >
      {children}
    </div>
  );
}
