import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ThemalLogo from "../components/ThemalLogo";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";

export default function LandingPage() {
  const [zoomDone, setZoomDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    const img = imgRef.current;
    if (!el || !img) return;
    const vh = el.clientHeight;
    const progress = el.scrollTop / vh;
    // Grow uniformly: 1x at top, 2x after one pane, 3x after two, etc.
    const s = 1 + progress;
    img.style.transform = `scale(${s})`;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col overflow-x-hidden"
      style={{
        backgroundColor: "hsl(var(--background))",
        height: "100dvh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
      }}
    >
      {/* Background image - fixed, grows with scroll */}
      <div
        className="pointer-events-none"
        onAnimationEnd={() => setZoomDone(true)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100dvh",
          zIndex: 0,
          animation: zoomDone
            ? "heroPulse 6s ease-in-out infinite"
            : "heroZoom 16s ease-in-out forwards",
          transformOrigin: "center center",
        }}
      >
        <img
          ref={imgRef}
          src="/themal-hero-t.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            transformOrigin: "center top",
            transition: "transform 0.6s ease-out",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative flex-shrink-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 sm:py-32" style={{ minHeight: "100dvh", scrollSnapAlign: "start" }}>
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <ThemalLogo className="w-48 sm:w-64 lg:w-80" />

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Real Designs. Real Time. Real Code.
          </h1>

          <p
            className="text-base sm:text-lg max-w-xl font-light leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Plug Themal into your app. Design your elements on screen. Open a pull request right from the editor.
          </p>
          <Link
            to="/editor"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "hsl(var(--brand))",
              color: "hsl(var(--brand-foreground, var(--background)))",
            }}
          >
            Open the Editor
          </Link>
        </div>

        {/* Scroll indicator */}
        <button
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer bg-transparent border-none p-2"
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            const vh = el.clientHeight;
            const nextPane = Math.floor(el.scrollTop / vh + 1) * vh;
            el.scrollTo({ top: nextPane, behavior: "smooth" });
          }}
          aria-label="Scroll down"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* Dev power */}
      <section
        className="relative z-10 flex-shrink-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        style={{ backgroundColor: "transparent", minHeight: "100dvh", scrollSnapAlign: "start" }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-10">
          <h2
            className="text-2xl sm:text-3xl font-light tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            A developer's design system, alive.
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Themal is a visual editor that plugs directly into your codebase.
            Adjust colors, typography, spacing, buttons, cards, and interaction
            states, then export production-ready CSS variables, Tailwind
            configs, or W3C design tokens. When you're happy with the result,
            open a pull request without leaving the browser. No more translating
            cumbersome Figma files into code. Design and ship from the same
            place.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { title: "Live Preview", detail: "Every change renders instantly across your full component library." },
              { title: "Export Anything", detail: "CSS variables, SCSS, Tailwind configs, or W3C design tokens in one click." },
              { title: "PR from the Editor", detail: "Push a design-system update straight to your repo. No context switching." },
              { title: "Accessibility Built In", detail: "Contrast ratios and WCAG checks run automatically as you design." },
            ].map((item) => (
              <div key={item.title}>
                <h3
                  className="text-sm font-medium uppercase tracking-wider mb-2"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm font-light leading-relaxed"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer bg-transparent border-none p-2"
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            const vh = el.clientHeight;
            const nextPane = Math.floor(el.scrollTop / vh + 1) * vh;
            el.scrollTo({ top: nextPane, behavior: "smooth" });
          }}
          aria-label="Scroll down"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* Promo */}
      <section
        className="relative z-10 flex-shrink-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        style={{ backgroundColor: "transparent", minHeight: "100dvh", scrollSnapAlign: "start" }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-10">
          <h2
            className="text-2xl sm:text-3xl font-light tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Not just for developers.
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Product owners can present design options to stakeholders in real
            time. Marketing teams can explore brand directions without waiting on
            a dev cycle. Leadership can review and approve visual changes on the
            spot. Vendors and agencies can collaborate on shared design systems
            without exchanging static mockups. Themal puts the creative process
            in the hands of the people making the decisions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { role: "Product Owners", detail: "Present comps to stakeholders without filing a ticket." },
              { role: "Marketing Teams", detail: "Explore brand directions and campaign themes on the fly." },
              { role: "Leadership", detail: "Review and approve visual changes in real time." },
              { role: "Vendor Collaborations", detail: "Share a live design system instead of static mockups." },
            ].map((item) => (
              <div key={item.role}>
                <h3
                  className="text-sm font-medium uppercase tracking-wider mb-2"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {item.role}
                </h3>
                <p
                  className="text-sm font-light leading-relaxed"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div
        className="relative z-10 flex-shrink-0 [&>*]:border-t-0"
        style={{
          scrollSnapAlign: "start",
          backgroundColor: "hsl(var(--background))",
        }}
      >
        <SiteFooterBranding />
        <SiteFooter sticky={false} />
      </div>
    </div>
  );
}
