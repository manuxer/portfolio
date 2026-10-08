import { copyFile } from "node:fs/promises";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";

// Breakpoints every source image is rendered at. Originals stay untouched in
// src/assets; the build emits right-sized WebP copies so a 6 MB slide becomes a
// few hundred KB without losing sharpness on retina screens.
const WIDTHS = [640, 1280, 1920, 2560];

// GitHub Pages serves 404.html for unknown paths, which lets deep links like
// /projects/9 boot the SPA instead of showing GitHub's error page.
const spaFallback = (): Plugin => {
  let outDir = "dist";
  return {
    name: "spa-fallback",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(path.join(outDir, "index.html"), path.join(outDir, "404.html"));
    },
  };
};

// BASE_PATH is provided by actions/configure-pages ("" for a custom domain,
// "/portfolio" for a project page). Locally it is unset and the site lives at /.
const base = `${(process.env.BASE_PATH ?? "").replace(/\/$/, "")}/`;

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      defaultDirectives: async (url, metadata) => {
        if (!url.searchParams.has("responsive")) return new URLSearchParams();
        const { width = WIDTHS[0] } = await metadata();
        const widths = WIDTHS.filter((w) => w < width);
        widths.push(Math.min(width, WIDTHS[WIDTHS.length - 1]));
        return new URLSearchParams({
          w: widths.join(";"),
          format: "webp",
          quality: "82",
          as: "picture",
        });
      },
    }),
    spaFallback(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { host: true, port: 8080 },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        // Framework code changes rarely; keep it out of the app chunk so
        // content updates don't invalidate the cached vendor files.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
          if (id.includes("react-router")) return "router";
          if (/[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return "motion";
        },
      },
    },
  },
});
