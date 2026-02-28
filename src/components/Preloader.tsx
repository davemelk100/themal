import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const assetsToPreload = [
      // Animation SVGs
      "/img/chatbot-animation.svg",
      "/img/ai-nui-animation.svg",
      "/img/design-panes-alt2.svg",
      "/img/health-aware-animation.svg",
      "/img/user-testing-config-animation.svg",

      // Lab project images
      "/img/ai-user-research.png",
      "/img/design-panes.png",
      "/img/lab.svg",

      // Article images
      "/img/seven-interviews-article.png",
      "/img/vibe-engineering.png",
      "/img/smart-dumb.png",
      "/img/ia-flexible.png",
      "/img/genres-article.png",
      "/img/tokens.png",
      "/img/anti-patterns.png",
      "/img/commit-fatigue.png",
      "/img/tunnel-article.png",
      "/img/ai-hydrated.png",
      "/img/all-dumber.png",

      // Design work images
      "/img/on-demand-int.png",
      "/img/delta-search.png",
      "/img/onuog.png",
      "/img/hex-orange.png",
      "/img/nfl-logos.png",
      "/img/record-disc.png",

      // Story images
      "/img/delta-story.png",
      "/img/propio-story.png",
      "/img/meridian-story.png",
      "/img/port-story.png",

      // Other images
      "/img/analytics-desktop.svg",
      "/img/analytics-mobile.svg",
      "/img/analytics-tablet.svg",
      "/img/design-panes-lab.svg",
      "/img/design-panes-slow.svg",
    ];

    setTotalCount(assetsToPreload.length);
    let loaded = 0;

    const preloadAsset = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        if (url.endsWith(".svg")) {
          // For SVGs, we can preload them as images
          const img = new Image();
          img.onload = () => {
            loaded++;
            setLoadedCount(loaded);
            resolve();
          };
          img.onerror = () => {
            loaded++;
            setLoadedCount(loaded);
            resolve(); // Continue even if some assets fail
          };
          img.src = url;
        } else {
          // For other images
          const img = new Image();
          img.onload = () => {
            loaded++;
            setLoadedCount(loaded);
            resolve();
          };
          img.onerror = () => {
            loaded++;
            setLoadedCount(loaded);
            resolve(); // Continue even if some assets fail
          };
          img.src = url;
        }
      });
    };

    const preloadAll = async () => {
      try {
        // Add a timeout to prevent hanging on slow connections
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Preload timeout")), 10000); // 10 second timeout
        });

        const preloadPromise = Promise.all(assetsToPreload.map(preloadAsset));

        await Promise.race([preloadPromise, timeoutPromise]);

        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          onComplete();
        }, 500);
      } catch (error) {
        console.warn("Preloader timeout or error, continuing anyway:", error);
        // Continue even if preloading fails
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    };

    preloadAll();
  }, [onComplete]);

  const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Loading Portfolio
          </h2>
          <p className="text-foreground/70">
            Preparing animations and assets...
          </p>
        </div>

        <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-orange-500 to-teal-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          {loadedCount} / {totalCount} assets loaded
        </div>
      </div>
    </div>
  );
};

export default Preloader;
