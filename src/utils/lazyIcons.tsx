/**
 * Lazy icon loader utility
 * Dynamically imports lucide-react icons to avoid loading the entire library
 * This prevents blocking the critical path with icon dependencies
 */

import React, { Suspense, lazy } from "react";

// Icon name to component mapping type
type IconName = string;

// Lazy load icon component
function createLazyIcon(iconName: IconName) {
  return lazy(() =>
    import("lucide-react").then((mod) => {
      const IconComponent = (mod as any)[iconName];
      if (!IconComponent) {
        console.warn(`Icon ${iconName} not found in lucide-react`);
        // Return a fallback component
        return {
          default: () => <span>?</span>,
        };
      }
      return { default: IconComponent };
    })
  );
}

// Icon wrapper with Suspense fallback
export const LazyIcon = ({
  name,
  className,
  fallback = "•",
  ...props
}: {
  name: IconName;
  className?: string;
  fallback?: string | React.ReactNode;
  [key: string]: any;
}) => {
  const IconComponent = React.useMemo(() => createLazyIcon(name), [name]);

  return (
    <Suspense
      fallback={
        typeof fallback === "string" ? (
          <span className={className}>{fallback}</span>
        ) : (
          fallback
        )
      }
    >
      <IconComponent className={className} {...props} />
    </Suspense>
  );
};

// Pre-create lazy icons for commonly used icons to avoid re-creating on each render
const lazyIconCache = new Map<IconName, React.LazyExoticComponent<any>>();

export function getLazyIcon(name: IconName) {
  if (!lazyIconCache.has(name)) {
    lazyIconCache.set(name, createLazyIcon(name));
  }
  return lazyIconCache.get(name)!;
}

// Helper to use lazy icons in components
export function useLazyIcon(name: IconName) {
  return React.useMemo(() => getLazyIcon(name), [name]);
}
