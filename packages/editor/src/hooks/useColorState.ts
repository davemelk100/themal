import React, { useState, useEffect, useCallback } from "react";
import {
  EDITABLE_VARS,
  applyStoredThemeColors,
} from "../utils/themeUtils";
import { useContrastEnforcement } from "./useContrastEnforcement";

/** Fallback palette — only used to fill in variables the host doesn't define */
const FALLBACK_COLORS: Record<string, string> = {
  "--brand": "210 80% 50%",
  "--secondary": "210 15% 90%",
  "--accent": "210 60% 50%",
  "--background": "0 0% 100%",
  "--foreground": "0 0% 5%",
  "--primary-foreground": "0 0% 100%",
  "--secondary-foreground": "0 0% 10%",
  "--muted": "210 15% 95%",
  "--muted-foreground": "0 0% 40%",
  "--accent-foreground": "0 0% 5%",
  "--destructive": "0 70% 50%",
  "--destructive-foreground": "0 0% 100%",
  "--success": "142 50% 40%",
  "--success-foreground": "0 0% 100%",
  "--warning": "45 80% 50%",
  "--warning-foreground": "0 0% 10%",
  "--border": "0 0% 85%",
};

/**
 * Read a CSS variable from computed styles, checking both the editor
 * element and :root so we pick up host-defined variables regardless
 * of where they are declared.
 */
function readVar(key: string, el: HTMLElement): string {
  const val = getComputedStyle(el).getPropertyValue(key).trim();
  if (val) return val;
  return getComputedStyle(document.documentElement).getPropertyValue(key).trim();
}

export function useColorState(editorRootRef: React.RefObject<HTMLDivElement | null>, wcagEnforcement: boolean = true, defaultColors?: Record<string, string>) {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [lockedKeys, setLockedKeys] = useState<Set<string>>(new Set());
  const [colorUndoStack, setColorUndoStack] = useState<Record<string, string>[]>([]);

  const readCurrentColors = useCallback(() => {
    const el = editorRootRef.current || document.documentElement;
    const current: Record<string, string> = {};
    EDITABLE_VARS.forEach(({ key }) => {
      current[key] = readVar(key, el);
    });
    setColors(current);
  }, [editorRootRef]);

  useContrastEnforcement(colors, setColors, lockedKeys, wcagEnforcement, editorRootRef);

  const defaultColorsRef = React.useRef(defaultColors);
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    const el = editorRootRef.current || document.documentElement;
    if (isInitialMount.current) {
      if (defaultColors) {
        applyStoredThemeColors(el);
        Object.entries(defaultColors).forEach(([key, value]) => {
          el.style.setProperty(key, value);
        });
      } else {
        applyStoredThemeColors(el);
        // Fill in any missing variables with fallbacks immediately so the
        // first render isn't blank. Host-defined variables are preserved.
        EDITABLE_VARS.forEach(({ key }) => {
          if (!readVar(key, el) && key in FALLBACK_COLORS) {
            el.style.setProperty(key, FALLBACK_COLORS[key]);
          }
        });
      }
      isInitialMount.current = false;
    } else if (defaultColors && defaultColors !== defaultColorsRef.current) {
      Object.entries(defaultColors).forEach(([key, value]) => {
        el.style.setProperty(key, value);
      });
    }
    defaultColorsRef.current = defaultColors;
    readCurrentColors();

    // Re-read after a frame in case host stylesheets loaded late
    const raf = requestAnimationFrame(() => readCurrentColors());

    const handlePendingUpdate = () => {
      setTimeout(() => readCurrentColors(), 50);
    };
    window.addEventListener("theme-pending-update", handlePendingUpdate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("theme-pending-update", handlePendingUpdate);
    };
  }, [readCurrentColors, editorRootRef, defaultColors]);

  return {
    colors,
    setColors,
    lockedKeys,
    setLockedKeys,
    colorUndoStack,
    setColorUndoStack,
    readCurrentColors,
  };
}
