import { useEffect, useRef, useState } from "react";
import { scanHostStyles, mapPaletteToTokens } from "../utils/hostScanner";
import type { HostPalette } from "../utils/hostScanner";
import storage from "../utils/storage";
import { THEME_COLORS_KEY } from "../utils/styles/colorUtils";

export interface ScanResult {
  palette: HostPalette;
  tokenMap: Record<string, string>;
}

const DISMISSED_KEY = "ds-host-scan-dismissed";

export function useHostScanner(
  applyToRoot: boolean,
  setColors: (fn: (prev: Record<string, string>) => Record<string, string>) => void,
  setVar: (key: string, value: string) => void,
  editorRootRef: React.RefObject<HTMLDivElement | null>,
): { scanResult: ScanResult | null; dismissed: boolean; dismiss: () => void } {
  const hasScanned = useRef(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [dismissed, setDismissed] = useState(() => !!storage.get<boolean>(DISMISSED_KEY));

  useEffect(() => {
    if (!applyToRoot || hasScanned.current) return;
    hasScanned.current = true;

    const palette = scanHostStyles(editorRootRef.current);
    const tokenMap = mapPaletteToTokens(palette);
    if (Object.keys(tokenMap).length === 0) return;

    setScanResult({ palette, tokenMap });

    // If no stored theme, populate editor with detected colors
    const stored = storage.get<Record<string, string>>(THEME_COLORS_KEY);
    if (!stored || Object.keys(stored).length === 0) {
      for (const [key, value] of Object.entries(tokenMap)) {
        setVar(key, value);
      }
      setColors((prev) => ({ ...prev, ...tokenMap }));
    }
  }, [applyToRoot, setColors, setVar, editorRootRef]);

  const dismiss = () => {
    setDismissed(true);
    storage.set(DISMISSED_KEY, true);
  };

  return { scanResult, dismissed, dismiss };
}
