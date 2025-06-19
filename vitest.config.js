import { defineConfig } from "vitest/config";
import V8JSONSummaryReporter from "./src/v8.json.summary.reporter";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
      reportsDirectory: "./coverage",
      clean: true,
      include: ["test-src/**/*", "src/v8.json.summary.reporter.ts"],
      exclude: [
        "src/action.ts",
        "action.ts",
        "**/*.d.ts",
        "dist/**",
        "node_modules/**",
      ],
    },
    reporters: ["default", new V8JSONSummaryReporter()],
  },
});
