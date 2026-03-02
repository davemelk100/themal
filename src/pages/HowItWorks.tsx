import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          &larr; Back to Editor
        </Link>

        <h1 className="text-3xl sm:text-4xl font-light mb-8 title-font" style={{ color: "hsl(var(--foreground))" }}>
          How It Works
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Overview
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
              Explore the interactive design system powering this site. Pick a brand color and watch every token transform in real time. Automatic WCAG AA contrast correction. Generate a CSS snapshot of your custom theme. Open a pull request to propose changes directly to the repo.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Color Harmony
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
              All palette colors are HSL custom properties on :root — shift a hue by 180° for complementary, ±150° for split-complementary, and so on. From one brand color the system derives the full token set (secondary, accent, muted, destructive) using your choice of harmony scheme: complementary, triadic, analogous, split-complementary, or tetradic.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Accessibility Enforcement
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
              Every foreground/background pair is audited against WCAG AA (4.5:1) via axe-core. Failing pairs are auto-corrected by adjusting foreground lightness, and fixes are cached so subsequent visits skip the redundant audit. Your theme persists in localStorage across reloads.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Contrast Learning Loop
            </h2>
            <ol className="text-sm leading-relaxed list-decimal pl-5 space-y-3" style={{ color: "hsl(var(--foreground))" }}>
              <li>
                <span className="font-medium">Detection & Fix</span> — When the accessibility audit runs (the animated swatch fix sequence), it identifies contrast pairs below 4.5:1. For each fix, it calls saveContrastCorrection().
              </li>
              <li>
                <span className="font-medium">Knowledge storage</span> — saveContrastCorrection() saves each fix to localStorage under ds-contrast-knowledge. Each correction records the background hue range (±15 degrees), the background lightness range (±10%), which foreground key was fixed, and the corrected HSL value. It keeps up to 100 corrections (FIFO).
              </li>
              <li>
                <span className="font-medium">Proactive application</span> — When generating new palettes, both generateRandomPalette() and generateHarmonyPalette() call applyKnownCorrections() before running autoAdjustContrast(). This pre-applies learned fixes for similar background colors, so themes with similar hue/lightness ranges get the fix proactively.
              </li>
            </ol>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              In short: when a background color falls within a previously-seen hue/lightness range, the app applies the known-good foreground value before the contrast checker even runs, reducing the chance of WCAG violations in generated palettes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
