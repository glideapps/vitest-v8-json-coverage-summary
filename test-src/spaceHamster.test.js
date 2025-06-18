import { describe, it, expect } from "vitest";
import {
  launchHamsterRocket,
  calculateHamsterOrbit,
  feedSpaceHamster,
} from "./spaceHamster.js";

describe("Space Hamster", () => {
  describe("launchHamsterRocket", () => {
    it("should launch Astro hamster", () => {
      expect(launchHamsterRocket("Astro")).toBe(
        "Astro is ready for space exploration!"
      );
    });

    it("should launch Cosmo hamster", () => {
      expect(launchHamsterRocket("Cosmo")).toBe(
        "Cosmo is floating in zero gravity!"
      );
    });

    it("should handle unknown hamster", () => {
      expect(launchHamsterRocket("Fluffy")).toBe("Unknown hamster astronaut!");
    });
  });

  describe("calculateHamsterOrbit", () => {
    it("should calculate quick orbit", () => {
      expect(calculateHamsterOrbit(2)).toBe("Quick hamster orbit!");
    });

    it("should calculate standard orbit", () => {
      expect(calculateHamsterOrbit(8)).toBe("Standard hamster orbit.");
    });

    it("should calculate long orbit", () => {
      expect(calculateHamsterOrbit(12)).toBe(
        "Long hamster journey through space!"
      );
    });
  });

  describe("feedSpaceHamster", () => {
    it("should feed moon cheese", () => {
      expect(feedSpaceHamster("moon cheese")).toBe(
        "Hamster loves moon cheese!"
      );
    });

    it("should feed star seeds", () => {
      expect(feedSpaceHamster("star seeds")).toBe("Hamster loves star seeds!");
    });

    it("should feed galaxy pellets", () => {
      expect(feedSpaceHamster("galaxy pellets")).toBe(
        "Hamster loves galaxy pellets!"
      );
    });

    it("should reject non-space food", () => {
      expect(feedSpaceHamster("carrots")).toBe("Hamster prefers space food!");
    });
  });
});
