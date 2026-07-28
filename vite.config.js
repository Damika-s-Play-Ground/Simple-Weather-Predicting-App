import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the GitHub Pages project sub-path.
export default defineConfig({
  base: "/Simple-Weather-Predicting-App/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.test.{js,jsx}", "src/setupTests.js"],
      reporter: ["text", "json-summary"],
      thresholds: { statements: 80, branches: 80, functions: 75, lines: 80 },
    },
  },
});
