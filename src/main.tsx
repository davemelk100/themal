// import React from "react";
import ReactDOM from "react-dom/client";
import AppWithRouter from "./App";
import "./globals.css";

// Storage migration removed - no longer needed
// Migration system was removed with authentication system

// Register service worker for caching and offline support
// Defer to after page is interactive to avoid blocking critical path
if ("serviceWorker" in navigator) {
  // Use requestIdleCallback with fallback to defer registration
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(
      () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // Check for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // New service worker available
                    if (
                      confirm("A new version is available. Reload to update?")
                    ) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch(() => {
            // Silently fail - app will still work without service worker
          });
      },
      { timeout: 3000 }
    );
  } else {
    // Fallback: defer with setTimeout
    setTimeout(() => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silently fail
      });
    }, 2000);
  }
}

// Fix back/forward cache restoration
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    // Page was restored from back/forward cache
    // Trigger visibility change to refresh any state-dependent components
    const visibilityEvent = new Event("visibilitychange", { bubbles: true });
    document.dispatchEvent(visibilityEvent);
  }
});

// Optimize page unload for better back/forward cache
window.addEventListener("pagehide", (event) => {
  // Clean up any timers or listeners that might prevent bfcache
  if (event.persisted) {
    // Page is entering bfcache - minimal cleanup
  }
});

// Add error boundary for unhandled errors
window.addEventListener("error", (event) => {
  console.error("Unhandled error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWithRouter />);
