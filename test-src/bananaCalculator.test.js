import { describe, it, expect } from "vitest";
import {
  calculateBananaRipeness,
  countBananasInBunch,
  estimateBananaCalories,
} from "./bananaCalculator.js";

describe("Banana Calculator", () => {
  describe("calculateBananaRipeness", () => {
    it("should return message for green bananas", () => {
      expect(calculateBananaRipeness("green")).toBe(
        "not ready yet, you impatient monkey!"
      );
    });

    it("should return message for yellow bananas", () => {
      expect(calculateBananaRipeness("yellow")).toBe("perfect for eating!");
    });

    it("should return message for brown bananas", () => {
      expect(calculateBananaRipeness("brown")).toBe(
        "time to make banana bread!"
      );
    });

    it("should return message for unknown color", () => {
      expect(calculateBananaRipeness("purple")).toBe(
        "that's not a banana color, silly!"
      );
    });
  });

  describe("countBananasInBunch", () => {
    it("should count bananas correctly", () => {
      expect(countBananasInBunch(5)).toBe(5);
      expect(countBananasInBunch(0)).toBe(0);
      expect(countBananasInBunch(10)).toBe(10);
    });
  });

  describe("estimateBananaCalories", () => {
    it("should calculate calories correctly", () => {
      expect(estimateBananaCalories(1)).toBe(105);
      expect(estimateBananaCalories(3)).toBe(315);
      expect(estimateBananaCalories(0)).toBe(0);
    });
  });
});
