import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/code-review-study/" : "/",
  plugins: [react()],
  server: { port: 5173 },
}));
