/// <reference types="vitest/globals" />
import {
  parseSvgSprite,
  parseIconFont,
  fetchCdnIconIndex,
  cdnIconToImported,
  CDN_LIBRARIES,
} from "../utils/iconImport";
import type { ImportedIconData } from "../utils/iconImport";

// ---------------------------------------------------------------------------
// SVG sanitisation (tested via parseSvgSprite)
// ---------------------------------------------------------------------------
describe("parseSvgSprite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const spriteSvg = `<svg xmlns="http://www.w3.org/2000/svg">
    <symbol id="icon-home" viewBox="0 0 24 24">
      <path d="M3 12l9-9 9 9"/>
      <path d="M9 21V12h6v9"/>
    </symbol>
    <symbol id="icon-star" viewBox="0 0 24 24">
      <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8"/>
    </symbol>
  </svg>`;

  it("parses symbols from an SVG sprite", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => spriteSvg,
    } as Response);

    const icons = await parseSvgSprite("https://example.com/sprite.svg");
    expect(icons).toHaveLength(2);
    expect(icons[0].id).toBe("sprite:icon-home");
    expect(icons[0].name).toBe("Icon Home");
    expect(icons[0].source).toBe("sprite");
    expect(icons[0].svgMarkup).toContain("<path");
    expect(icons[1].id).toBe("sprite:icon-star");
  });

  it("strips script tags from SVG markup", async () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg">
      <symbol id="evil" viewBox="0 0 24 24">
        <script>alert("xss")</script>
        <path d="M0 0h24v24H0z"/>
      </symbol>
    </svg>`;

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => maliciousSvg,
    } as Response);

    const icons = await parseSvgSprite("https://example.com/evil.svg");
    expect(icons).toHaveLength(1);
    expect(icons[0].svgMarkup).not.toContain("<script");
    expect(icons[0].svgMarkup).not.toContain("alert");
  });

  it("strips event handler attributes", async () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg">
      <symbol id="bad" viewBox="0 0 24 24">
        <path d="M0 0" onload="alert(1)" onclick="alert(2)"/>
      </symbol>
    </svg>`;

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => maliciousSvg,
    } as Response);

    const icons = await parseSvgSprite("https://example.com/bad.svg");
    expect(icons[0].svgMarkup).not.toContain("onload");
    expect(icons[0].svgMarkup).not.toContain("onclick");
  });

  it("throws on non-OK response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(parseSvgSprite("https://example.com/missing.svg")).rejects.toThrow(
      "Failed to fetch sprite: 404",
    );
  });

  it("throws when no symbols are found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => `<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>`,
    } as Response);

    await expect(parseSvgSprite("https://example.com/no-symbols.svg")).rejects.toThrow(
      "No <symbol> elements",
    );
  });
});

// ---------------------------------------------------------------------------
// parseIconFont
// ---------------------------------------------------------------------------
describe("parseIconFont", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("parses Font Awesome CSS classes", async () => {
    const faCss = `
      @font-face { font-family: "Font Awesome 6 Free"; }
      .fa-home:before { content: "\\f015"; }
      .fa-star:before { content: "\\f005"; }
      .fa-heart::before { content: "\\f004"; }
    `;

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => faCss,
    } as Response);

    const icons = await parseIconFont("https://cdn.example.com/fa.css");
    expect(icons.length).toBeGreaterThanOrEqual(3);
    expect(icons[0].source).toBe("font");
    expect(icons[0].className).toContain("fa ");
    expect(icons[0].fontStylesheet).toBe("https://cdn.example.com/fa.css");
  });

  it("parses Bootstrap Icons CSS classes", async () => {
    const biCss = `
      @font-face { font-family: "bootstrap-icons"; }
      .bi-alarm:before { content: "\\f101"; }
      .bi-bell:before { content: "\\f18a"; }
    `;

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => biCss,
    } as Response);

    const icons = await parseIconFont("https://cdn.example.com/bi.css");
    expect(icons.length).toBeGreaterThanOrEqual(2);
    expect(icons[0].className).toContain("bi-");
  });

  it("returns Material Icons ligature names", async () => {
    const materialCss = `
      @font-face { font-family: "Material Icons"; }
      .material-icons { font-family: "Material Icons"; }
    `;

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => materialCss,
    } as Response);

    const icons = await parseIconFont("https://fonts.googleapis.com/icon?family=Material+Icons");
    expect(icons.length).toBeGreaterThan(0);
    expect(icons[0].className).toBe("material-icons");
    expect(icons[0].id).toMatch(/^font:material-/);
  });

  it("throws on non-OK response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(parseIconFont("https://cdn.example.com/bad.css")).rejects.toThrow(
      "Failed to fetch CSS: 500",
    );
  });
});

// ---------------------------------------------------------------------------
// CDN utilities
// ---------------------------------------------------------------------------
describe("CDN_LIBRARIES", () => {
  it("includes lucide, heroicons, and phosphor", () => {
    const ids = CDN_LIBRARIES.map((l) => l.id);
    expect(ids).toContain("lucide");
    expect(ids).toContain("heroicons");
    expect(ids).toContain("phosphor");
  });
});

describe("cdnIconToImported", () => {
  it("creates a properly structured ImportedIconData", () => {
    const result: ImportedIconData = cdnIconToImported(
      "arrow-right",
      '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
      "lucide",
      "https://unpkg.com/lucide-static/icons/arrow-right.svg",
    );

    expect(result.id).toBe("cdn:lucide:arrow-right");
    expect(result.name).toBe("Arrow Right");
    expect(result.source).toBe("cdn");
    expect(result.svgMarkup).toContain("<path");
    expect(result.sourceUrl).toContain("arrow-right.svg");
  });
});

describe("fetchCdnIconIndex", () => {
  it("throws for unknown library", async () => {
    await expect(fetchCdnIconIndex("nonexistent")).rejects.toThrow("Unknown library");
  });
});
