import type { Reporter, Vitest } from "vitest/node";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

interface CoverageSummary {
  summary: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  files: Array<{
    file: string;
    statements: number;
    branches: number;
    functions: number;
    lines: number;
    uncoveredLines?: number[];
  }>;
}

interface V8CoverageData {
  [filePath: string]: {
    path: string;
    statementMap: { [key: string]: any };
    s: { [key: string]: number };
    branchMap: { [key: string]: any };
    b: { [key: string]: number[] };
    fnMap: { [key: string]: any };
    f: { [key: string]: number };
    l: { [key: string]: number };
  };
}

class V8JSONSummaryReporter implements Reporter {
  private vitest!: Vitest;

  onInit(vitest: Vitest) {
    this.vitest = vitest;
  }

  onTestRunEnd() {
    // This method is kept for compatibility but the actual summary generation
    // is now handled in onCoverage method
  }

  onCoverage(coverage: any) {
    const coverageDir =
      this.vitest.config.coverage?.reportsDirectory || "./coverage";
    const outputPath = join(coverageDir, "coverage-summary.json");
    const summary = generateV8CoverageSummary(coverage);
    const jsonOutput = JSON.stringify(summary, null, 2);
    writeFileSync(outputPath, jsonOutput);
    console.log(`Coverage summary written to: ${outputPath}`);
  }
}

export default V8JSONSummaryReporter;

export function generateV8CoverageSummary(coverage: any): CoverageSummary {
  // If coverage.data exists, use it (for istanbul-lib-coverage), otherwise use as-is
  const fileCoverages = coverage?.data ? coverage.data : coverage;
  const summary: CoverageSummary = {
    summary: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0, // For v8, this will match statements
    },
    files: [],
  };
  let totalStatements = 0;
  let totalBranches = 0;
  let totalFunctions = 0;
  let totalLines = 0; // For v8, this will match statements
  let totalCoveredStatements = 0;
  let totalCoveredBranches = 0;
  let totalCoveredFunctions = 0;
  let totalCoveredLines = 0; // For v8, this will match covered statements
  for (const [filePath, fileCoverageObj] of Object.entries(
    fileCoverages as Record<string, any>
  )) {
    const fileCoverage = fileCoverageObj?.data || fileCoverageObj;
    if (
      !fileCoverage ||
      !fileCoverage.s ||
      !fileCoverage.f ||
      !fileCoverage.b
    ) {
      continue;
    }
    let fileStatements = 0;
    let fileBranches = 0;
    let fileFunctions = 0;
    let fileLines = 0; // For v8, this will match statements
    let fileCoveredStatements = 0;
    let fileCoveredBranches = 0;
    let fileCoveredFunctions = 0;
    let fileCoveredLines = 0; // For v8, this will match covered statements
    const uncoveredLines: number[] = [];
    // Statements (used as proxy for lines)
    for (const [stmtId, stmtCount] of Object.entries(fileCoverage.s)) {
      fileStatements++;
      fileLines++;
      totalStatements++;
      totalLines++;
      if ((stmtCount as number) > 0) {
        fileCoveredStatements++;
        fileCoveredLines++;
        totalCoveredStatements++;
        totalCoveredLines++;
      } else {
        if (fileCoverage.statementMap && fileCoverage.statementMap[stmtId]) {
          uncoveredLines.push(fileCoverage.statementMap[stmtId].start.line);
        }
      }
    }
    // Functions
    for (const fnCount of Object.values(fileCoverage.f)) {
      fileFunctions++;
      totalFunctions++;
      if ((fnCount as number) > 0) {
        fileCoveredFunctions++;
        totalCoveredFunctions++;
      }
    }
    // Branches (count each branch path individually)
    for (const branchArr of Object.values(fileCoverage.b)) {
      for (const b of branchArr as number[]) {
        fileBranches++;
        totalBranches++;
        if (b > 0) {
          fileCoveredBranches++;
          totalCoveredBranches++;
        }
      }
    }
    // Calculate percentages
    const statementsPercent =
      fileStatements > 0 ? (fileCoveredStatements / fileStatements) * 100 : 100;
    const branchesPercent =
      fileBranches > 0 ? (fileCoveredBranches / fileBranches) * 100 : 100;
    const functionsPercent =
      fileFunctions > 0 ? (fileCoveredFunctions / fileFunctions) * 100 : 100;
    const linesPercent =
      fileLines > 0 ? (fileCoveredLines / fileLines) * 100 : 100;
    // Get relative file path for cleaner output
    const relativePath = fileCoverage.path
      ? fileCoverage.path.replace(process.cwd(), "").replace(/^\/+/, "")
      : filePath.replace(process.cwd(), "").replace(/^\/+/, "");
    summary.files.push({
      file: relativePath,
      statements: Math.round(statementsPercent * 100) / 100,
      branches: Math.round(branchesPercent * 100) / 100,
      functions: Math.round(functionsPercent * 100) / 100,
      lines: Math.round(linesPercent * 100) / 100,
      uncoveredLines: uncoveredLines.length > 0 ? uncoveredLines : undefined,
    });
  }
  // Calculate overall summary percentages
  summary.summary.statements =
    totalStatements > 0
      ? Math.round((totalCoveredStatements / totalStatements) * 10000) / 100
      : 100;
  summary.summary.branches =
    totalBranches > 0
      ? Math.round((totalCoveredBranches / totalBranches) * 10000) / 100
      : 100;
  summary.summary.functions =
    totalFunctions > 0
      ? Math.round((totalCoveredFunctions / totalFunctions) * 10000) / 100
      : 100;
  summary.summary.lines =
    totalLines > 0
      ? Math.round((totalCoveredLines / totalLines) * 10000) / 100
      : 100;
  return summary;
}
