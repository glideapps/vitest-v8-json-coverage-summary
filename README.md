# Vitest V8 JSON Coverage Summary

A plugin for [Vitest](https://vitest.dev/) that generates a structured JSON coverage summary from V8 coverage data. This reporter creates a `coverage-summary.json` file with detailed coverage information for statements, branches, functions, and lines.

## Features

- ✅ Generates structured JSON coverage summary
- ✅ Supports V8 coverage provider
- ✅ Includes file-level and overall coverage statistics
- ✅ Tracks uncovered lines for detailed analysis
- ✅ Compatible with Vitest 3.0+
- 🚀 **NEW**: GitHub Action for automatic PR coverage reporting
- 🏷️ **NEW**: Automatic coverage badge generation for GitHub Pages
- 🚀 **NEW**: Automatic upload of badges to GitHub Pages
- 🔧 **NEW**: Pure YAML implementation - no JavaScript complexity

## Installation

```bash
npm install --save-dev vitest-v8-json-coverage-summary
```

## GitHub Action

This package also includes a GitHub Action that automatically creates beautiful coverage reports in pull requests and uploads coverage badges to GitHub Pages. Built with pure YAML and shell commands for maximum reliability.

### Quick Start

```yaml
name: Coverage Report
on:
  pull_request:
    branches: [main]

permissions:
  pull-requests: write

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm test
      - uses: glideapps/vitest-v8-json-coverage-summary@v1
        with:
          make-badges: "true"
          upload-badges-to-pages: "true"
```

The action will automatically:

- Create coverage reports in pull request comments
- Generate coverage badges
- Upload badges to the `gh-pages` branch for GitHub Pages

**Built with pure YAML and shell commands** - no JavaScript complexity, no module system issues, no permission headaches!

For detailed documentation, see [ACTION_README.md](ACTION_README.md).

## Usage

### Basic Setup

Add the reporter to your Vitest configuration:

```javascript
// vitest.config.js
import { defineConfig } from "vitest/config";
import V8JSONSummaryReporter from "vitest-v8-json-coverage-summary";

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
```

### TypeScript Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import V8JSONSummaryReporter from "vitest-v8-json-coverage-summary";

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
```

## Output Format

The reporter generates a `coverage-summary.json` file in your coverage directory with the following structure:

```json
{
  "summary": {
    "statements": 85.5,
    "branches": 72.3,
    "functions": 90.1,
    "lines": 85.5
  },
  "files": [
    {
      "file": "src/example.js",
      "statements": 95.2,
      "branches": 80.0,
      "functions": 100.0,
      "lines": 95.2,
      "uncoveredLines": [15, 23, 45]
    }
  ]
}
```

### Coverage Metrics

- **statements**: Percentage of statements covered
- **branches**: Percentage of branch paths covered
- **functions**: Percentage of functions covered
- **lines**: Percentage of lines covered (matches statements for V8)
- **uncoveredLines**: Array of line numbers that are not covered (optional)

## API Reference

### V8JSONSummaryReporter

The main reporter class that implements Vitest's Reporter interface.

#### Methods

- `onInit(vitest: Vitest)`: Called when the reporter is initialized
- `onCoverage(coverage: any)`: Called when coverage data is available
- `onTestRunEnd()`: Called when the test run ends (kept for compatibility)

### generateV8CoverageSummary(coverage: any): CoverageSummary

Utility function that processes V8 coverage data and returns a structured summary.

## Configuration Options

The reporter uses the coverage configuration from your Vitest config:

- `coverage.reportsDirectory`: Directory where the summary file will be written (default: `./coverage`)
- `coverage.provider`: Must be set to `'v8'` for this reporter to work

## Example Output

After running your tests with coverage, you'll find a `coverage-summary.json` file that looks like this:

```json
{
  "summary": {
    "statements": 87.5,
    "branches": 75.0,
    "functions": 92.3,
    "lines": 87.5
  },
  "files": [
    {
      "file": "src/utils.js",
      "statements": 100.0,
      "branches": 100.0,
      "functions": 100.0,
      "lines": 100.0
    },
    {
      "file": "src/main.js",
      "statements": 75.0,
      "branches": 50.0,
      "functions": 85.7,
      "lines": 75.0,
      "uncoveredLines": [12, 15, 23]
    }
  ]
}
```

## Integration Examples

### With CI/CD

```yaml
# GitHub Actions example
- name: Run tests with coverage
  run: npm test

- name: Upload coverage summary
  uses: actions/upload-artifact@v3
  with:
    name: coverage-summary
    path: coverage/coverage-summary.json
```

### With Coverage Badges

You can use the generated JSON to create coverage badges or integrate with coverage reporting services.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0

- Initial release
- V8 coverage support
- JSON summary generation
- File-level and overall coverage statistics
