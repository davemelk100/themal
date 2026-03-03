import React, { useState, useRef, useEffect } from "react";
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
  upgradeUrl,
  children,
}: PremiumGateProps) {
  const { isPremium } = useLicense();

  if (isPremium) return <>{children}</>;

  return (
    <PremiumGateWrapper variant={variant} upgradeUrl={upgradeUrl}>
      {children}
    </PremiumGateWrapper>
  );
}

function PremiumGateWrapper({
  variant,
  upgradeUrl,
  children,
}: {
  variant: "section" | "inline";
  upgradeUrl?: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement | HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
    setShow(true);
  };
  const hideTooltip = () => {
    hideTimer.current = setTimeout(() => { setShow(false); setPos(null); }, 120);
  };

  useEffect(() => {
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, []);

  useEffect(() => {
    if (!show || !tooltipRef.current || !ref.current) return;
    const tip = tooltipRef.current;
    const rect = ref.current.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    // Keep tooltip within viewport
    let x = rect.left + rect.width / 2 - tipRect.width / 2;
    let y = rect.top - tipRect.height - 8;
    if (x < 8) x = 8;
    if (x + tipRect.width > window.innerWidth - 8) x = window.innerWidth - tipRect.width - 8;
    if (y < 8) y = rect.bottom + 8;
    setPos({ x, y });
  }, [show]);

  const wrapperStyle: React.CSSProperties = {
    cursor: "not-allowed",
  };

  const sharedProps = {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
  };

  const pricingHref = upgradeUrl || "/pricing";

  const tooltip = show && (
    <div
      ref={tooltipRef}
      className="ds-premium-tooltip"
      style={{
        position: "fixed",
        left: pos ? pos.x : -9999,
        top: pos ? pos.y : -9999,
        zIndex: 9999,
        opacity: pos ? 1 : 0,
        pointerEvents: pos ? "auto" : "none",
      }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      Pro feature
      <span style={{ opacity: 0.4 }}>&middot;</span>
      <a
        href={pricingHref}
        style={{
          color: "hsl(var(--background))",
          textDecoration: "underline",
          cursor: "pointer",
          opacity: 0.8,
        }}
      >
        View pricing
      </a>
    </div>
  );

  if (variant === "inline") {
    return (
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        style={wrapperStyle}
        {...sharedProps}
      >
        <span
          className="ds-premium-inline"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          {children}
        </span>
        {tooltip}
      </span>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={wrapperStyle}
      {...sharedProps}
    >
      <div
        className="ds-premium-section"
      >
        {children}
      </div>
      {tooltip}
    </div>
  );
}
