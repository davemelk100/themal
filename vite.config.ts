import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./") },
      // Redirect lucide-react barrel to custom barrel with deep imports only
      // This reduces the bundle from 648KB to ~30KB by avoiding the full icon barrel
      { find: /^lucide-react$/, replacement: path.resolve(__dirname, "src/lib/lucide-icons.ts") },
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/.netlify/functions": {
        target: "http://localhost:8888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, ""),
      },
      "/uploads": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "esnext", // Use modern JS for better tree-shaking and performance improvement
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id) => {
          // Normalize path separators for cross-platform compatibility
          const normalizedId = id.replace(/\\/g, "/");

          // Preserve content.ts as it has side effects (data exports)
          if (
            (normalizedId.includes("/content.ts") ||
              normalizedId.endsWith("content.ts")) &&
            !normalizedId.includes("node_modules")
          ) {
            return true;
          }
          // Preserve other data files
          if (
            normalizedId.includes("/data/") &&
            !normalizedId.includes("node_modules")
          ) {
            return true;
          }
          // Preserve CSS imports (they have side effects)
          if (normalizedId.endsWith(".css")) {
            return true;
          }
          // Packages that declare sideEffects: false - explicitly mark as side-effect-free
          // to enable tree-shaking of unused exports (e.g., unused icons)
          if (
            normalizedId.includes("node_modules/lucide-react") ||
            normalizedId.includes("node_modules/@radix-ui/react-icons")
          ) {
            return false;
          }
          // Other node_modules: preserve (they may have side effects)
          if (normalizedId.includes("node_modules")) {
            return true;
          }
          // Application code: preserve modules (dynamic imports need this)
          return true;
        },
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Disable to speed up builds
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react-router-dom"],
    // Exclude large dependencies that are only used in lazy-loaded components
    // This prevents them from being pre-bundled and blocking the critical path in dev mode
    exclude: [
      "framer-motion", // Only used in lazy-loaded pages/components
    ],
    // Force exclude to prevent pre-bundling even if imported
    esbuildOptions: {
      // This helps ensure excluded packages aren't pre-bundled
    },
  },
});
