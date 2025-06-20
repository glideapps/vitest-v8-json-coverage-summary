# Vitest V8 JSON Coverage Summary

A plugin for [Vitest](https://vitest.dev/) that generates a structured JSON coverage summary from V8 coverage data. This package also includes GitHub Actions for coverage reporting and badge management.

## Features

- ✅ Generates structured JSON coverage summary
- ✅ Supports V8 coverage provider
- ✅ Includes file-level and overall coverage statistics
- ✅ Tracks uncovered lines for detailed analysis
- ✅ Compatible with Vitest 3.0+
- 🚀 **GitHub Actions**: Coverage reporting, badge generation, and badge upload
- 🏷️ **Coverage Badges**: Shields.io compatible badges
- 🔧 **Modular Design**: Separate actions for different use cases

## Installation

```bash
npm install --save-dev vitest-v8-json-coverage-summary
```

## GitHub Actions

This package includes three separate GitHub Actions that can be used independently:

### 1. Coverage Reporter

Creates beautiful coverage reports in pull requests.

```yaml
- name: Report Coverage
  uses: glideapps/vitest-v8-json-coverage-summary/actions/coverage-reporter@v0.0.0-echo
  with:
    coverage-file: "coverage/coverage-summary.json"
    title: "🧪 Test Coverage Report"
    show-files: "true"
    coverage-threshold: "80"
```

### 2. Badge Generator

Generates coverage badges from coverage data.

```yaml
- name: Generate Badges
  uses: glideapps/vitest-v8-json-coverage-summary/actions/badge-generator@v0.0.0-echo
  with:
    coverage-file: "coverage/coverage-summary.json"
    badges-dir: "badges"
```

### 3. Badge Uploader

Uploads badges to GitHub Pages.

```yaml
- name: Upload Badges to GitHub Pages
  uses: glideapps/vitest-v8-json-coverage-summary/actions/badge-uploader@v0.0.0-echo
  with:
    coverage-file: "coverage/coverage-summary.json"
    badges-dir: "badges"
    pages-branch: "gh-pages"
    generate-badges: "true"
```

## Quick Start

### Basic Coverage Reporting

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
      - uses: glideapps/vitest-v8-json-coverage-summary/actions/coverage-reporter@v0.0.0-echo
        with:
          coverage-file: "coverage/coverage-summary.json"
```

### Full Workflow with Badges

```yaml
name: Coverage with Badges
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

permissions:
  pull-requests: write
  contents: write

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
      - uses: glideapps/vitest-v8-json-coverage-summary/actions/coverage-reporter@v0.0.0-echo

  badges:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: coverage
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm test
      - uses: glideapps/vitest-v8-json-coverage-summary/actions/badge-uploader@v0.0.0-echo
        with:
          generate-badges: "true"
```

## Action Reference

### Coverage Reporter

| Input                | Description                                             | Required | Default                          |
| -------------------- | ------------------------------------------------------- | -------- | -------------------------------- |
| `coverage-file`      | Path to the coverage summary JSON file                  | No       | `coverage/coverage-summary.json` |
| `token`              | GitHub token for creating comments                      | No       | `${{ github.token }}`            |
| `title`              | Title for the coverage report comment                   | No       | `📊 Coverage Report`             |
| `show-files`         | Whether to show individual file coverage details        | No       | `true`                           |
| `coverage-threshold` | Minimum coverage percentage to consider as good (0-100) | No       | `80`                             |

### Badge Generator

| Input           | Description                              | Required | Default                          |
| --------------- | ---------------------------------------- | -------- | -------------------------------- |
| `coverage-file` | Path to the coverage summary JSON file   | No       | `coverage/coverage-summary.json` |
| `badges-dir`    | Directory to output the generated badges | No       | `badges`                         |

### Badge Uploader

| Input              | Description                                       | Required | Default                            |
| ------------------ | ------------------------------------------------- | -------- | ---------------------------------- |
| `coverage-file`    | Path to the coverage summary JSON file            | No       | `coverage/coverage-summary.json`   |
| `badges-dir`       | Directory containing the badges to upload         | No       | `badges`                           |
| `pages-branch`     | Branch to upload badges to for GitHub Pages       | No       | `gh-pages`                         |
| `pages-badges-dir` | Directory within the pages branch to store badges | No       | `badges`                           |
| `commit-message`   | Commit message for badge updates                  | No       | `Update coverage badges [skip ci]` |
| `generate-badges`  | Whether to generate badges if they don't exist    | No       | `true`                             |

## Badge URLs

When GitHub Pages is enabled, badges are available at:

```
https://yourusername.github.io/yourrepo/badges/coverage.json
https://yourusername.github.io/yourrepo/badges/statements.json
https://yourusername.github.io/yourrepo/badges/branches.json
https://yourusername.github.io/yourrepo/badges/functions.json
https://yourusername.github.io/yourrepo/badges/lines.json
```

Use in your README.md:

```markdown
![Coverage](https://yourusername.github.io/yourrepo/badges/coverage.json)
```

## Examples

See the `examples/` directory for complete workflow examples:

- `coverage-only.yml` - Only coverage reporting
- `badge-generator-only.yml` - Only badge generation
- `badge-uploader-only.yml` - Only badge upload
- `full-workflow.yml` - Complete workflow with all actions

## Setup

### Configure Vitest

```javascript
// vitest.config.js
export default {
  coverage: {
    provider: "v8",
    reporter: ["json-summary"],
    reportsDirectory: "coverage",
  },
};
```

### Enable GitHub Pages

1. Go to Settings → Pages
2. Set source to "Deploy from a branch"
3. Select `gh-pages` branch
4. Set folder to `/ (root)` or `/badges`

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
