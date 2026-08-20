/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/serp": {
        target: "https://serpapi.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/serp/, "/search.json"),
      },
      "/api/register": {
        target: "https://discovery.mkmkataria07.workers.dev",
        changeOrigin: true,
      },
      "/api/signup": {
        target: "https://discovery.mkmkataria07.workers.dev",
        changeOrigin: true,
      },
      "/api/login": {
        target: "https://discovery.mkmkataria07.workers.dev",
        changeOrigin: true,
      },
      "/api/blogs": {
        target: "https://discovery.mkmkataria07.workers.dev",
        changeOrigin: true,
      },
      "/api/generate-blog": {
        target: "https://discovery.mkmkataria07.workers.dev",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(fileURLToPath(new URL(".", import.meta.url)), "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: true,
  },
});
