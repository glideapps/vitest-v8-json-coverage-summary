import { defineConfig } from "vitest/config";
import V8JSONSummaryReporter from "./src/v8.json.summary.reporter";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
      reportsDirectory: "./coverage",
    },
    reporters: ["default", new V8JSONSummaryReporter()],
  },
});
