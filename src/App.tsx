import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { applyStoredThemeColors } from "./pages/portfolio/themeUtils";

const PortfolioLanding = lazy(() => import("./pages/portfolio/PortfolioLanding"));

function App() {
  useEffect(() => {
    applyStoredThemeColors();
  }, []);

  return (
    <div className="min-h-screen text-foreground transition-colors duration-300 flex flex-col relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-white focus:text-gray-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-dynamic dark:focus:bg-gray-900 dark:focus:text-white"
      >
        Skip to content
      </a>
      <main id="main-content" className="flex-1 relative z-10">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<PortfolioLanding />} />
            <Route path="*" element={<PortfolioLanding />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  );
}
