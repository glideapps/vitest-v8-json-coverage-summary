import { describe, it, expect } from "vitest";
import { generateV8CoverageSummary } from "./v8.json.summary.reporter";

describe("generateV8CoverageSummary", () => {
  it("should generate correct summary for 100% coverage", () => {
    const mockCoverage = {
      data: {
        "test.js": {
          path: "/test.js",
          s: { "0": 1, "1": 1, "2": 1 },
          f: { "0": 1 },
          b: { "0": [1, 1] },
          statementMap: {
            "0": { start: { line: 1 } },
            "1": { start: { line: 2 } },
            "2": { start: { line: 3 } },
          },
        },
      },
    };

    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.summary.statements).toBe(100);
    expect(summary.summary.branches).toBe(100);
    expect(summary.summary.functions).toBe(100);
    expect(summary.summary.lines).toBe(100);
    expect(summary.files).toHaveLength(1);
    expect(summary.files[0].statements).toBe(100);
    expect(summary.files[0].branches).toBe(100);
    expect(summary.files[0].functions).toBe(100);
    expect(summary.files[0].lines).toBe(100);
    expect(summary.files[0].uncoveredLines).toBeUndefined();
  });

  it("should generate correct summary for partial coverage", () => {
    const mockCoverage = {
      data: {
        "test.js": {
          path: "/test.js",
          s: { "0": 1, "1": 0, "2": 1, "3": 0 },
          f: { "0": 1, "1": 0 },
          b: { "0": [1, 0], "1": [0, 0] },
          statementMap: {
            "0": { start: { line: 1 } },
            "1": { start: { line: 2 } },
            "2": { start: { line: 3 } },
            "3": { start: { line: 4 } },
          },
        },
      },
    };

    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.summary.statements).toBe(50);
    expect(summary.summary.branches).toBe(25);
    expect(summary.summary.functions).toBe(50);
    expect(summary.summary.lines).toBe(50);
    expect(summary.files[0].statements).toBe(50);
    expect(summary.files[0].branches).toBe(25);
    expect(summary.files[0].functions).toBe(50);
    expect(summary.files[0].lines).toBe(50);
    expect(summary.files[0].uncoveredLines).toEqual([2, 4]);
  });

  it("should generate correct summary for 0% coverage", () => {
    const mockCoverage = {
      data: {
        "test.js": {
          path: "/test.js",
          s: { "0": 0, "1": 0 },
          f: { "0": 0 },
          b: { "0": [0, 0] },
          statementMap: {
            "0": { start: { line: 1 } },
            "1": { start: { line: 2 } },
          },
        },
      },
    };

    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.summary.statements).toBe(0);
    expect(summary.summary.branches).toBe(0);
    expect(summary.summary.functions).toBe(0);
    expect(summary.summary.lines).toBe(0);
    expect(summary.files[0].statements).toBe(0);
    expect(summary.files[0].branches).toBe(0);
    expect(summary.files[0].functions).toBe(0);
    expect(summary.files[0].lines).toBe(0);
    expect(summary.files[0].uncoveredLines).toEqual([1, 2]);
  });

  it("should handle multiple files correctly", () => {
    const mockCoverage = {
      data: {
        "file1.js": {
          path: "/file1.js",
          s: { "0": 1, "1": 1 },
          f: { "0": 1 },
          b: { "0": [1, 1] },
          statementMap: {
            "0": { start: { line: 1 } },
            "1": { start: { line: 2 } },
          },
        },
        "file2.js": {
          path: "/file2.js",
          s: { "0": 0, "1": 1 },
          f: { "0": 0, "1": 1 },
          b: { "0": [0, 0] },
          statementMap: {
            "0": { start: { line: 1 } },
            "1": { start: { line: 2 } },
          },
        },
      },
    };

    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.files).toHaveLength(2);
    expect(summary.summary.statements).toBe(75); // (2+1)/(2+2) = 75
    expect(summary.summary.branches).toBe(50); // (2/4) = 50
    expect(summary.summary.functions).toBe(66.67); // (1+1)/(1+2) = 66.67
    expect(summary.summary.lines).toBe(75); // Same as statements
  });

  it("should handle empty coverage data", () => {
    const mockCoverage = { data: {} };
    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.summary.statements).toBe(100);
    expect(summary.summary.branches).toBe(100);
    expect(summary.summary.functions).toBe(100);
    expect(summary.summary.lines).toBe(100);
    expect(summary.files).toHaveLength(0);
  });

  it("should handle files with missing coverage data", () => {
    const mockCoverage = {
      data: {
        "valid.js": {
          path: "/valid.js",
          s: { "0": 1 },
          f: { "0": 1 },
          b: { "0": [1] },
          statementMap: { "0": { start: { line: 1 } } },
        },
        "invalid.js": {
          path: "/invalid.js",
          // Missing s, f, b properties
        },
      },
    };

    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.files).toHaveLength(1);
    expect(summary.files[0].file).toContain("valid.js");
    expect(summary.summary.statements).toBe(100);
  });

  it("should handle coverage data without .data property", () => {
    const mockCoverage = {
      "test.js": {
        path: "/test.js",
        s: { "0": 1 },
        f: { "0": 1 },
        b: { "0": [1] },
        statementMap: { "0": { start: { line: 1 } } },
      },
    };

    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.files).toHaveLength(1);
    expect(summary.summary.statements).toBe(100);
  });

  it("should calculate percentages with proper rounding", () => {
    const mockCoverage = {
      data: {
        "test.js": {
          path: "/test.js",
          s: { "0": 1, "1": 1, "2": 0 }, // 2/3 = 66.666...%
          f: { "0": 1, "1": 0 }, // 1/2 = 50%
          b: { "0": [1, 0], "1": [0, 0] }, // 1/4 = 25%
          statementMap: {
            "0": { start: { line: 1 } },
            "1": { start: { line: 2 } },
            "2": { start: { line: 3 } },
          },
        },
      },
    };

    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.files[0].statements).toBe(66.67); // Rounded to 2 decimal places
    expect(summary.files[0].functions).toBe(50);
    expect(summary.files[0].branches).toBe(25);
    expect(summary.files[0].lines).toBe(66.67);
  });

  it("should handle files with no branches or functions", () => {
    const mockCoverage = {
      data: {
        "simple.js": {
          path: "/simple.js",
          s: { "0": 1, "1": 0 },
          f: {}, // No functions
          b: {}, // No branches
          statementMap: {
            "0": { start: { line: 1 } },
            "1": { start: { line: 2 } },
          },
        },
      },
    };

    const summary = generateV8CoverageSummary(mockCoverage);

    expect(summary.files[0].statements).toBe(50);
    expect(summary.files[0].branches).toBe(100); // No branches = 100% coverage
    expect(summary.files[0].functions).toBe(100); // No functions = 100% coverage
    expect(summary.files[0].lines).toBe(50);
  });
});
