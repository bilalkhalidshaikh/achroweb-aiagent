import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
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
  root: path.resolve(__dirname, "client"),  // keep root as client
  build: {
    outDir: path.resolve(__dirname, "dist"), // IMPORTANT: move build output to root/dist
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
