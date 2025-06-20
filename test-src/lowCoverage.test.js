import { describe, test, expect } from "vitest";
import { poorlyTestedFunction } from "./lowCoverage.js";

describe("Low Coverage Tests", () => {
  test("should return tested for the main path", () => {
    // This only tests the main return path, not the if branch
    expect(poorlyTestedFunction()).toBe("tested");
  });

  // Intentionally not testing:
  // - The if branch in poorlyTestedFunction
  // - anotherPoorlyTestedFunction (completely untested)
  // - untestedFunction (completely untested)
});
