import { useEffect } from "react";
import {
  EDITABLE_VARS,
  autoAdjustContrast,
  persistContrastFixes,
} from "../utils/themeUtils";

export function useContrastEnforcement(
  colors: Record<string, string>,
  setColors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  lockedKeys: Set<string>,
) {
  useEffect(() => {
    const handleModeChange = () => {
      setTimeout(() => {
        const live: Record<string, string> = {};
        EDITABLE_VARS.forEach((v) => {
          const val = getComputedStyle(document.documentElement)
            .getPropertyValue(v.key)?.trim();
          if (val) live[v.key] = val;
        });
        if (Object.keys(live).length > 0) {
          const fixes = autoAdjustContrast(live, lockedKeys);
          Object.entries(fixes).forEach(([k, v]) => {
            document.documentElement.style.setProperty(k, v);
          });
          setColors(prev => ({ ...prev, ...live, ...fixes }));
          persistContrastFixes(fixes);
          window.dispatchEvent(new Event("theme-pending-update"));
        }
      }, 50);
    };
    window.addEventListener("theme-mode-changed", handleModeChange);
    return () => window.removeEventListener("theme-mode-changed", handleModeChange);
  }, [colors, setColors, lockedKeys]);
}
