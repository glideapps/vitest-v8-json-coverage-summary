import { describe, it, expect } from "vitest";
import {
  throwPizzaShuriken,
  calculatePizzaSlices,
  ninjaPizzaDelivery,
} from "./pizzaNinja.js";

describe("Pizza Ninja", () => {
  describe("throwPizzaShuriken", () => {
    it("should hit enemy with pizza shuriken", () => {
      expect(throwPizzaShuriken("enemy")).toBe(
        "Pizza shuriken hits! Enemy is now covered in cheese!"
      );
    });

    it("should share pizza with friend", () => {
      expect(throwPizzaShuriken("friend")).toBe(
        "Friendly pizza shuriken! Sharing is caring!"
      );
    });

    it("should miss other targets", () => {
      expect(throwPizzaShuriken("wall")).toBe(
        "Pizza shuriken missed! The floor is now delicious."
      );
    });
  });

  describe("calculatePizzaSlices", () => {
    it("should calculate slices for large pizza", () => {
      expect(calculatePizzaSlices(18)).toBe(16);
    });

    it("should calculate slices for medium pizza", () => {
      expect(calculatePizzaSlices(14)).toBe(8);
    });

    it("should calculate slices for small pizza", () => {
      expect(calculatePizzaSlices(10)).toBe(4);
    });
  });

  describe("ninjaPizzaDelivery", () => {
    it("should deliver lightning fast", () => {
      expect(ninjaPizzaDelivery(3)).toBe("Lightning fast ninja delivery!");
    });

    it("should deliver at standard speed", () => {
      expect(ninjaPizzaDelivery(8)).toBe("Standard ninja speed delivery.");
    });

    it("should get lost on long distances", () => {
      expect(ninjaPizzaDelivery(15)).toBe("Ninja got lost in the shadows...");
    });
  });
});
