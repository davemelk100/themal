/**
 * Image optimization utility - Minimal implementation for critical path
 * Uses Netlify Image CDN for automatic WebP/AVIF conversion in production
 * Returns original in dev to avoid any processing overhead
 */

// Cache env checks to avoid repeated lookups
const isProd = import.meta.env.PROD;
let isNetlifyChecked = false;
let isNetlify = false;

/**
 * Get optimized image URL
 * Ultra-lightweight for critical path - minimal processing
 * @param src - Original image path (e.g., "/img/tunnel-article.png")
 * @param width - Target width in pixels (optional)
 * @param quality - Quality 0-100 (optional, defaults to 80)
 * @returns Optimized image URL
 */
export function getOptimizedImage(
  src: string,
  width?: number,
  quality: number = 75
): string {
  // Fast path: Skip optimization for SVGs
  if (src.endsWith(".svg")) {
    return src;
  }

  // Fast path: In development, return immediately without any checks
  if (!isProd) {
    return src;
  }

  // Production only: Check Netlify once, cache result
  if (!isNetlifyChecked && typeof window !== "undefined") {
    const hostname = window.location.hostname;
    isNetlify =
      hostname.includes("netlify.app") || hostname.includes("netlify.com");
    isNetlifyChecked = true;
  }

  // Use Netlify Image CDN in production
  if (isNetlify) {
    const params = new URLSearchParams({
      url: src,
      q: quality.toString(),
      fm: "webp",
    });

    if (width) {
      params.set("w", width.toString());
    }

    return `/.netlify/images?${params.toString()}`;
  }

  return src;
}

/**
 * Get responsive image srcset
 * @param src - Original image path
 * @param sizes - Array of widths for different breakpoints
 * @param quality - Quality 0-100 (optional, defaults to 80)
 * @returns Object with src and srcSet for responsive images
 */
export function getResponsiveImage(
  src: string,
  sizes: number[] = [400, 800, 1200],
  quality: number = 75
): { src: string; srcSet: string } {
  // Skip for SVGs
  if (src.endsWith(".svg")) {
    return { src, srcSet: "" };
  }

  // Use optimized image function which handles production/dev checks
  const baseSrc = getOptimizedImage(
    src,
    sizes[Math.floor(sizes.length / 2)],
    quality
  );

  if (isProd && isNetlify) {
    const srcSet = sizes
      .map((width) => {
        const optimized = getOptimizedImage(src, width, quality);
        return `${optimized} ${width}w`;
      })
      .join(", ");

    return { src: baseSrc, srcSet };
  }

  return { src: baseSrc, srcSet: "" };
}

/**
 * Get responsive image props for card images (grid view)
 * Optimized for 3-column grid: mobile (1 col), tablet (2 col), desktop (3 col)
 * @param src - Original image path
 * @param quality - Quality 0-100 (optional, defaults to 75 for better compression)
 * @returns Object with image props including src, srcSet, and sizes
 */
export function getCardImageProps(
  src: string,
  quality: number = 75
): {
  src: string;
  srcSet: string;
  sizes: string;
} {
  // Grid layout: 1 col mobile (~400px), 2 col tablet (~450px), 3 col desktop (~333px)
  // But we use larger sizes to account for high-DPI displays (2x)
  const widths = [400, 600, 800];
  const responsive = getResponsiveImage(src, widths, quality);

  return {
    ...responsive,
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  };
}

/**
 * Get responsive image props for compact list images
 * Optimized for small thumbnail images (80-96px width)
 * @param src - Original image path
 * @param quality - Quality 0-100 (optional, defaults to 75)
 * @returns Object with image props including src, srcSet, and sizes
 */
export function getThumbnailImageProps(
  src: string,
  quality: number = 75
): {
  src: string;
  srcSet: string;
  sizes: string;
} {
  // Small thumbnails: 96px base, 192px for 2x displays
  const widths = [96, 192];
  const responsive = getResponsiveImage(src, widths, quality);

  return {
    ...responsive,
    sizes: "96px",
  };
}
