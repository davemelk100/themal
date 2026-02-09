import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import { content } from "../content";

// Lazy load all icons to avoid blocking critical path
const LazyX = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.X }))
);
const LazyHome = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Home }))
);
const LazyFileText = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.FileText }))
);
const LazyPalette = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Palette }))
);
const LazyBookOpen = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.BookOpen }))
);
const LazyBriefcase = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Briefcase }))
);
const LazySettings = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Settings }))
);

const MobileTrayMenu: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();

  const handleNavClick = (id: string) => {
    if (location.pathname === "/") {
      // If we're on the main page, scroll to the section
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're on another page, navigate to the main page and scroll
      window.location.href = `/#${id}`;
    }
    setIsMobileMenuOpen(false);
  };

  const getNavIcon = (id: string) => {
    const iconProps = { className: "w-6 h-6" };
    const fallback = <span className="w-6 h-6">•</span>;

    switch (id) {
      case "current-projects":
        return (
          <Suspense fallback={fallback}>
            <LazyHome {...iconProps} />
          </Suspense>
        );
      case "articles":
        return (
          <Suspense fallback={fallback}>
            <LazyFileText {...iconProps} />
          </Suspense>
        );
      case "work":
        return (
          <Suspense fallback={fallback}>
            <LazyPalette {...iconProps} />
          </Suspense>
        );
      case "stories":
        return (
          <Suspense fallback={fallback}>
            <LazyBookOpen {...iconProps} />
          </Suspense>
        );
      case "career":
        return (
          <Suspense fallback={fallback}>
            <LazyBriefcase {...iconProps} />
          </Suspense>
        );
      case "design-system":
        return (
          <Suspense fallback={fallback}>
            <LazySettings {...iconProps} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={fallback}>
            <LazyHome {...iconProps} />
          </Suspense>
        );
    }
  };

  const isActiveSection = (id: string) => {
    return activeSection === id;
  };

  useEffect(() => {
    if (location.pathname !== "/") return;

    // Use IntersectionObserver to avoid forced reflows
    // This is more efficient than getBoundingClientRect in scroll handlers
    const sections = content.navigation.links
      .filter((link) => link.id !== "design-system")
      .map((link) => link.id);

    const sectionElements: Map<string, HTMLElement> = new Map();

    // Cache section elements to avoid repeated DOM queries
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        sectionElements.set(sectionId, element);
      }
    });

    // Use IntersectionObserver with rootMargin to detect sections near viewport center
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the section that's most visible in the center of the viewport
      type VisibleSection = {
        id: string;
        ratio: number;
      };
      let mostVisible: VisibleSection | null = null;

      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          const target = entry.target as HTMLElement;
          const targetId = target.id;
          if (!targetId) continue;

          const rect = entry.boundingClientRect;
          const viewportCenter = window.innerHeight / 2;
          const elementCenter = rect.top + rect.height / 2;
          const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
          const visibility = 1 - distanceFromCenter / window.innerHeight;

          if (mostVisible === null || visibility > mostVisible.ratio) {
            mostVisible = {
              id: targetId,
              ratio: visibility,
            };
          }
        }
      }

      if (mostVisible !== null) {
        setActiveSection(mostVisible.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "-40% 0px -40% 0px", // Only trigger when section is in center 20% of viewport
      threshold: [0, 0.1, 0.5, 1],
    });

    // Observe all section elements
    sectionElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between max-w-[1000px] mx-auto px-2 py-2">
          {content.navigation.links
            .filter((link) => link.id !== "design-system")
            .sort((a, b) => {
              // Define the desired order: Lab, Storytelling, Design, Articles, Career
              const order = [
                "current-projects",
                "stories",
                "work",
                "articles",
                "career",
                "contact",
              ];
              const indexA = order.indexOf(a.id);
              const indexB = order.indexOf(b.id);
              return (
                (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
              );
            })
            .map((link) => {
              const isActive = isActiveSection(link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  }`}
                  aria-label={`Navigate to ${link.text}`}
                >
                  {getNavIcon(link.id)}
                  <span className="text-xs font-medium">{link.text}</span>
                </button>
              );
            })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[10000] lg:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close mobile navigation menu"
              >
                <Suspense fallback={<span className="h-5 w-5">×</span>}>
                  <LazyX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Suspense>
              </button>
            </div>

            <div className="space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick("current-projects")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Lab section"
                >
                  Lab
                </button>
                <button
                  onClick={() => handleNavClick("articles")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Articles section"
                >
                  Articles
                </button>
                <button
                  onClick={() => handleNavClick("work")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Designs section"
                >
                  Designs
                </button>
                <button
                  onClick={() => handleNavClick("stories")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Storytelling section"
                >
                  Storytelling
                </button>
                <button
                  onClick={() => handleNavClick("career")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Career section"
                >
                  Career
                </button>
                <button
                  onClick={() => handleNavClick("skills-and-software")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Skills and Software section"
                >
                  Skills & Software
                </button>
                <button
                  onClick={() => handleNavClick("design-system")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Design System section"
                >
                  Design System
                </button>
              </div>

              {/* Page-specific links */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Home
                </Link>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <a
                  href={content.navigation.social.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  LinkedIn
                </a>
                <a
                  href={content.navigation.social.dribbble.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Dribbble
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileTrayMenu;
