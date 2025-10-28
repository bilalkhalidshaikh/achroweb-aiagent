import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  root: path.resolve(__dirname, "client"), // source folder
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID
      ? [
          (await import("@replit/vite-plugin-cartographer")).cartographer(),
          (await import("@replit/vite-plugin-dev-banner")).devBanner(),
        ]
      : []),
  ],
  resolve: {
    alias: [
      { find: /^@\//, replacement: path.resolve(__dirname, "client/src") + "/" },
      { find: "@shared", replacement: path.resolve(__dirname, "shared") },
      { find: "@assets", replacement: path.resolve(__dirname, "attached_assets") },
    ],
  },
  build: {
    outDir: path.resolve(__dirname, "client/dist"), // inside client folder
    emptyOutDir: true,
  },
  server: {
    fs: { strict: true, deny: ["**/.*"] },
  },
});
