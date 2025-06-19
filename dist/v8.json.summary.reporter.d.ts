import type { Reporter, Vitest } from "vitest/node";
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
declare class V8JSONSummaryReporter implements Reporter {
    private vitest;
    onInit(vitest: Vitest): void;
    onTestRunEnd(): void;
    onCoverage(coverage: any): void;
}
export default V8JSONSummaryReporter;
export declare function generateV8CoverageSummary(coverage: any): CoverageSummary;
//# sourceMappingURL=v8.json.summary.reporter.d.ts.map