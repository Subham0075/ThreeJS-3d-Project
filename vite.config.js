import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // Ensures proper asset loading
  build: {
    outDir: "dist",
  },
});
