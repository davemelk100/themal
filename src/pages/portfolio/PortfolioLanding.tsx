import React, { Suspense, useState, useEffect, useCallback } from "react";
import {
  applyStoredThemeColors,
  EDITABLE_VARS,
  useContrastEnforcement,
} from "./themeUtils";

const PortfolioLandingDesignSystem = React.lazy(() => import('./PortfolioLandingDesignSystem'));

export default function PortfolioLanding() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [lockedKeys, setLockedKeys] = useState<Set<string>>(new Set());
  const [prevColors, setPrevColors] = useState<Record<string, string> | null>(null);

  const readCurrentColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const current: Record<string, string> = {};
    let hasEmpty = false;
    EDITABLE_VARS.forEach(({ key }) => {
      const val = style.getPropertyValue(key).trim();
      current[key] = val;
      if (!val) hasEmpty = true;
    });
    setColors(current);
    if (hasEmpty) {
      setTimeout(() => {
        const retryStyle = getComputedStyle(document.documentElement);
        const retried: Record<string, string> = {};
        EDITABLE_VARS.forEach(({ key }) => {
          retried[key] = retryStyle.getPropertyValue(key).trim();
        });
        setColors(retried);
      }, 100);
    }
  }, []);

  useContrastEnforcement(colors, setColors, lockedKeys);

  useEffect(() => {
    applyStoredThemeColors();
    readCurrentColors();

    const handlePendingUpdate = () => {
      setTimeout(() => readCurrentColors(), 50);
    };
    window.addEventListener("theme-pending-update", handlePendingUpdate);
    return () => window.removeEventListener("theme-pending-update", handlePendingUpdate);
  }, [readCurrentColors]);

  return (
    <Suspense fallback={null}>
      <PortfolioLandingDesignSystem
        colors={colors}
        setColors={setColors}
        lockedKeys={lockedKeys}
        setLockedKeys={setLockedKeys}
        prevColors={prevColors}
        setPrevColors={setPrevColors}
        readCurrentColors={readCurrentColors}
      />
    </Suspense>
  );
}
