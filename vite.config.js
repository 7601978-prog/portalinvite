import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this project under /portalinvite/.
// Keep dev at "/" so the local preview stays simple.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/portalinvite/" : "/",
  plugins: [react()],
  server: { port: 5173 },
}));
