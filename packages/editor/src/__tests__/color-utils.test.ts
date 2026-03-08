/// <reference types="vitest/globals" />
import {
  hslStringToHex,
  hexToHslString,
  contrastRatio,
  fgForBg,
  autoAdjustContrast,
  generateHarmonyPalette,
} from "../utils/themeUtils";
import { validateLicenseKey, generateLicenseKey } from "../utils/license";

// ---------------------------------------------------------------------------
// hslStringToHex
// ---------------------------------------------------------------------------
describe("hslStringToHex", () => {
  it("converts black (0 0% 0%) to #000000", () => {
    expect(hslStringToHex("0 0% 0%")).toBe("#000000");
  });

  it("converts white (0 0% 100%) to #ffffff", () => {
    expect(hslStringToHex("0 0% 100%")).toBe("#ffffff");
  });

  it("converts pure red (0 100% 50%) to #ff0000", () => {
    expect(hslStringToHex("0 100% 50%")).toBe("#ff0000");
  });

  it("converts pure green (120 100% 50%) to #00ff00", () => {
    expect(hslStringToHex("120 100% 50%")).toBe("#00ff00");
  });

  it("converts pure blue (240 100% 50%) to #0000ff", () => {
    expect(hslStringToHex("240 100% 50%")).toBe("#0000ff");
  });

  it("returns #000000 for empty or invalid input", () => {
    expect(hslStringToHex("")).toBe("#000000");
    expect(hslStringToHex("   ")).toBe("#000000");
    expect(hslStringToHex("not a color")).toBe("#000000");
  });
});

// ---------------------------------------------------------------------------
// hexToHslString
// ---------------------------------------------------------------------------
describe("hexToHslString", () => {
  it("converts #000000 to an HSL string ending with 0%", () => {
    const result = hexToHslString("#000000");
    expect(result).toMatch(/^0\s/);
    expect(result).toMatch(/0\.0%$/);
  });

  it("converts #ffffff to an HSL string containing 100%", () => {
    const result = hexToHslString("#ffffff");
    expect(result).toContain("100.0%");
  });

  it("converts #ff0000 to an HSL string starting with hue 0", () => {
    const result = hexToHslString("#ff0000");
    expect(result).toMatch(/^0\.0\s/);
  });

  it("round-trips through hslStringToHex and back", () => {
    const original = "210 50% 40%";
    const hex = hslStringToHex(original);
    const roundTripped = hexToHslString(hex);

    // Parse both and compare numerically (small rounding differences are OK)
    const origParts = original.split(/\s+/).map((p) => parseFloat(p));
    const rtParts = roundTripped.split(/\s+/).map((p) => parseFloat(p));

    expect(rtParts[0]).toBeCloseTo(origParts[0], 0); // hue within 1 degree
    expect(rtParts[1]).toBeCloseTo(origParts[1], 0); // saturation within 1%
    expect(rtParts[2]).toBeCloseTo(origParts[2], 0); // lightness within 1%
  });
});

// ---------------------------------------------------------------------------
// contrastRatio
// ---------------------------------------------------------------------------
describe("contrastRatio", () => {
  it("returns ~21 for black vs white", () => {
    const ratio = contrastRatio("0 0% 0%", "0 0% 100%");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 1 for the same color against itself", () => {
    const ratio = contrastRatio("200 50% 50%", "200 50% 50%");
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("returns less than 4.6 for light gray vs white (failing WCAG AA)", () => {
    const ratio = contrastRatio("0 0% 80%", "0 0% 100%");
    expect(ratio).toBeLessThan(4.6);
  });

  it("returns more than 4.6 for dark text on white background", () => {
    const ratio = contrastRatio("0 0% 20%", "0 0% 100%");
    expect(ratio).toBeGreaterThan(4.6);
  });
});

// ---------------------------------------------------------------------------
// fgForBg
// ---------------------------------------------------------------------------
describe("fgForBg", () => {
  it("returns dark foreground for a light background", () => {
    const result = fgForBg("0 0% 90%");
    expect(result).toBe("0 0% 0%");
  });

  it("returns white foreground for a dark background", () => {
    const result = fgForBg("0 0% 10%");
    expect(result).toBe("0 0% 100%");
  });

  it("returns one of the two expected values for a mid-range background", () => {
    const result = fgForBg("0 0% 50%");
    expect(["0 0% 0%", "0 0% 100%"]).toContain(result);
  });
});

// ---------------------------------------------------------------------------
// autoAdjustContrast
// ---------------------------------------------------------------------------
describe("autoAdjustContrast", () => {
  it("returns only foreground overrides when all pairs already meet 4.6:1", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 0%",
      "--brand": "220 80% 30%",
      "--primary": "220 80% 30%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "220 20% 90%",
      "--secondary-foreground": "0 0% 10%",
      "--muted": "220 10% 90%",
      "--muted-foreground": "0 0% 35%",
      "--accent": "220 20% 90%",
      "--accent-foreground": "0 0% 10%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 0%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 0%",
      "--destructive": "0 80% 45%",
      "--destructive-foreground": "0 0% 100%",
      "--success": "142 70% 35%",
      "--success-foreground": "0 0% 100%",
      "--warning": "45 80% 50%",
      "--warning-foreground": "0 0% 0%",
    };
    const adjustments = autoAdjustContrast(colors);

    // Every adjusted value should still meet contrast requirements.
    // The function always sets --foreground, --card-foreground, --popover-foreground
    // based on fgForBg, so those keys may appear. But no color-pair adjustments
    // should be needed beyond that.
    for (const [fgKey, bgKey] of [
      ["--foreground", "--background"],
      ["--brand", "--background"],
      ["--primary-foreground", "--primary"],
    ] as const) {
      const fg = adjustments[fgKey] ?? colors[fgKey];
      const bg = adjustments[bgKey] ?? colors[bgKey];
      if (fg && bg) {
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.6);
      }
    }
  });

  it("adjusts foreground when it fails contrast against background", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 85%", // too light for white bg
      "--brand": "220 80% 30%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 85%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 85%",
    };
    const adjustments = autoAdjustContrast(colors);

    // After adjustment, foreground should pass contrast
    const fg = adjustments["--foreground"] ?? colors["--foreground"];
    const bg = adjustments["--background"] ?? colors["--background"];
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.6);
  });

  it("does not adjust locked keys", () => {
    const colors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 85%", // fails contrast
      "--brand": "220 80% 80%", // fails contrast
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 85%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 85%",
    };
    const locked = new Set(["--foreground", "--brand"]);
    const adjustments = autoAdjustContrast(colors, locked);

    // Locked keys should not appear in adjustments
    expect(adjustments["--foreground"]).toBeUndefined();
    expect(adjustments["--brand"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// generateHarmonyPalette
// ---------------------------------------------------------------------------
describe("generateHarmonyPalette", () => {
  const baseColors: Record<string, string> = {
    "--brand": "0 50% 50%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 0%",
    "--secondary": "0 30% 80%",
    "--secondary-foreground": "0 0% 10%",
    "--accent": "0 30% 80%",
    "--accent-foreground": "0 0% 10%",
    "--muted": "0 10% 90%",
    "--muted-foreground": "0 0% 40%",
    "--border": "0 10% 85%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 0%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 0%",
    "--primary": "0 50% 50%",
    "--primary-foreground": "0 0% 100%",
    "--ring": "0 50% 50%",
    "--destructive": "0 80% 45%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 70% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 50%",
    "--warning-foreground": "0 0% 0%",
  };

  it("complementary scheme produces a secondary hue near 180", () => {
    const result = generateHarmonyPalette("0 50% 50%", "Complementary", baseColors);
    const secParts = result["--secondary"]?.trim().split(/\s+/);
    expect(secParts).toBeDefined();
    const secHue = parseFloat(secParts![0]);
    expect(secHue).toBeCloseTo(180, 0);
  });

  it("triadic scheme produces a secondary hue at 120", () => {
    const result = generateHarmonyPalette("0 50% 50%", "Triadic", baseColors);
    const secParts = result["--secondary"]?.trim().split(/\s+/);
    expect(secParts).toBeDefined();

    const secHue = parseFloat(secParts![0]);
    expect(secHue).toBeCloseTo(120, 0);

    // Accent is also set (may be shifted by palette derivation)
    expect(result["--accent"]).toBeDefined();
  });

  it("analogous scheme produces hues close to the original", () => {
    const result = generateHarmonyPalette("0 50% 50%", "Analogous", baseColors);
    const secParts = result["--secondary"]?.trim().split(/\s+/);
    expect(secParts).toBeDefined();

    const secHue = parseFloat(secParts![0]);
    // Analogous secondary offset is +30
    expect(secHue).toBeCloseTo(30, 0);

    // Accent is also set (may be shifted by palette derivation from secondary)
    expect(result["--accent"]).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// validateLicenseKey
// ---------------------------------------------------------------------------
describe("validateLicenseKey", () => {
  it("accepts a valid generated key", () => {
    const key = generateLicenseKey();
    const result = validateLicenseKey(key);
    expect(result.isValid).toBe(true);
    expect(result.isPremium).toBe(true);
  });

  it("rejects an invalid format", () => {
    const result = validateLicenseKey("NOT-A-VALID-KEY");
    expect(result.isValid).toBe(false);
    expect(result.isPremium).toBe(false);
  });

  it("rejects an empty string", () => {
    const result = validateLicenseKey("");
    expect(result.isValid).toBe(false);
    expect(result.isPremium).toBe(false);
  });

  it("rejects null and undefined", () => {
    expect(validateLicenseKey(null).isValid).toBe(false);
    expect(validateLicenseKey(undefined).isValid).toBe(false);
  });

  it("rejects a key with correct format but wrong checksum", () => {
    const result = validateLicenseKey("THEMAL-AAAA-BBBB-ZZZZ");
    expect(result.isValid).toBe(false);
  });

  it("is case-insensitive", () => {
    const key = generateLicenseKey();
    const lower = validateLicenseKey(key.toLowerCase());
    expect(lower.isValid).toBe(true);
  });
});
