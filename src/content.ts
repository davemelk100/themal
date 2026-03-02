// This file exports application content data
// It must not be tree-shaken away - marked as having side effects in vite.config.ts
export const content = {
  designSystem: {
    title: "Live Design System",
    subtitle: "",
    backToSite: "Back to Site",
    storageNotAvailable: "Storage not available.",
    sections: {
      colors: "Colors",
      typography: "Typography",
      buttons: "Buttons",
      cards: "Cards",
      icons: "Icons",
      spacing: "Spacing",
    },
    colorLabels: [
      { label: "Primary" },
      { label: "Secondary" },
      { label: "Gray 100" },
      { label: "Gray 200" },
      { label: "Gray 600" },
      { label: "Gray 900" },
    ],
    specsContent: `The live design system on this site is built around CSS custom properties (design tokens) defined on :root. Every color in the palette is stored in HSL (Hue, Saturation, Lightness), which makes algorithmic manipulation straightforward — shifting a hue by 180° gives you a complementary color; splitting by ±150° gives you a split-complementary scheme, and so on.

When you pick a brand color, the system derives the full token set using one of several harmony schemes: complementary, triadic, analogous, split-complementary, or tetradic. Each scheme applies a different set of hue offsets to generate secondary, accent, muted, and destructive palette roles from a single base hue.

After palette generation, every foreground/background pair is audited against WCAG AA contrast requirements in real time. The system uses axe-core to run a full accessibility audit, then automatically corrects any pair that falls below the 4.5:1 contrast ratio threshold. Correction works by adjusting the foreground's lightness value — nudging it lighter or darker until the ratio passes. A knowledge base records these corrections so the same fix is applied instantly on subsequent visits, avoiding a redundant audit cycle.

Your theme state — the full set of custom-property values — is persisted in localStorage. Reload the page, navigate away and come back, and your customized palette is still there. You can also generate a CSS snapshot of your current theme, or open a pull request to propose your theme changes directly to the repository.`,
  },
} as const;

export default content;
