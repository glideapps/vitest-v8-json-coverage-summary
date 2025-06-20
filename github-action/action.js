const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function getCoverageEmoji(percentage, threshold) {
  if (percentage >= threshold) return "🟢";
  if (percentage >= threshold * 0.8) return "🟡";
  return "🔴";
}

function formatPercentage(value) {
  return `${value.toFixed(1)}%`;
}

function getBadgeColor(coverage) {
  if (coverage >= 90) return "brightgreen";
  if (coverage >= 80) return "green";
  if (coverage >= 70) return "yellow";
  if (coverage >= 60) return "orange";
  return "red";
}

function generateCoverageBadge(coverage) {
  const avgCoverage =
    (coverage.summary.statements +
      coverage.summary.branches +
      coverage.summary.functions +
      coverage.summary.lines) /
    4;

  const color = getBadgeColor(avgCoverage);
  const message = `${avgCoverage.toFixed(1)}%`;

  return {
    schemaVersion: 1,
    label: "coverage",
    message: message,
    color: color,
  };
}

function createBadgesDirectory(coverage) {
  try {
    // Create badges directory
    const badgesDir = path.join(process.cwd(), "badges");
    if (!fs.existsSync(badgesDir)) {
      fs.mkdirSync(badgesDir, { recursive: true });
    }

    // Generate coverage badge
    const badgeData = generateCoverageBadge(coverage);
    const badgePath = path.join(badgesDir, "coverage.json");

    fs.writeFileSync(badgePath, JSON.stringify(badgeData, null, 2));
    core.info(`Created coverage badge at ${badgePath}`);

    // Also create individual metric badges
    const metrics = [
      { key: "statements", label: "statements" },
      { key: "branches", label: "branches" },
      { key: "functions", label: "functions" },
      { key: "lines", label: "lines" },
    ];

    metrics.forEach((metric) => {
      const value = coverage.summary[metric.key];
      const color = getBadgeColor(value);
      const badgeData = {
        schemaVersion: 1,
        label: metric.label,
        message: `${value.toFixed(1)}%`,
        color: color,
      };

      const metricBadgePath = path.join(badgesDir, `${metric.key}.json`);
      fs.writeFileSync(metricBadgePath, JSON.stringify(badgeData, null, 2));
      core.info(`Created ${metric.label} badge at ${metricBadgePath}`);
    });
  } catch (error) {
    core.warning(`Failed to create badges: ${error.message}`);
  }
}

async function uploadBadgesToPages(token, pagesBranch, pagesBadgesDir) {
  try {
    const context = github.context;
    const octokit = github.getOctokit(token);

    // Configure git
    execSync('git config --local user.email "action@github.com"', {
      stdio: "inherit",
    });
    execSync('git config --local user.name "GitHub Action"', {
      stdio: "inherit",
    });

    // Check if the pages branch exists
    try {
      await octokit.rest.repos.getBranch({
        owner: context.repo.owner,
        repo: context.repo.repo,
        branch: pagesBranch,
      });
    } catch (error) {
      if (error.status === 404) {
        // Branch doesn't exist, create it from the default branch (usually main)
        core.info(`Creating ${pagesBranch} branch from default branch`);

        // Get the default branch
        const { data: repoData } = await octokit.rest.repos.get({
          owner: context.repo.owner,
          repo: context.repo.repo,
        });

        const defaultBranch = repoData.default_branch;
        core.info(`Using default branch: ${defaultBranch}`);

        const { data: defaultBranchData } = await octokit.rest.repos.getBranch({
          owner: context.repo.owner,
          repo: context.repo.repo,
          branch: defaultBranch,
        });

        await octokit.rest.git.createRef({
          owner: context.repo.owner,
          repo: context.repo.repo,
          ref: `refs/heads/${pagesBranch}`,
          sha: defaultBranchData.commit.sha,
        });

        core.info(
          `Successfully created ${pagesBranch} branch from ${defaultBranch}`
        );
      } else {
        throw error;
      }
    }

    // Checkout the pages branch
    execSync(`git fetch origin ${pagesBranch}`, { stdio: "inherit" });
    execSync(`git checkout ${pagesBranch}`, { stdio: "inherit" });

    // Create the badges directory in the pages branch
    const pagesBadgesPath = path.join(process.cwd(), pagesBadgesDir);
    if (!fs.existsSync(pagesBadgesPath)) {
      fs.mkdirSync(pagesBadgesPath, { recursive: true });
    }

    // Copy badges from the local badges directory
    const localBadgesPath = path.join(process.cwd(), "badges");
    if (fs.existsSync(localBadgesPath)) {
      const files = fs.readdirSync(localBadgesPath);
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          const sourcePath = path.join(localBadgesPath, file);
          const destPath = path.join(pagesBadgesPath, file);
          fs.copyFileSync(sourcePath, destPath);
          core.info(`Copied ${file} to ${destPath}`);
        }
      });
    }

    // Check if there are changes to commit
    try {
      execSync("git add .", { stdio: "inherit" });
      execSync("git diff --cached --quiet", { stdio: "pipe" });
      core.info("No changes to commit");
      return;
    } catch (error) {
      // There are changes to commit
    }

    // Commit and push changes
    execSync('git commit -m "Update coverage badges"', { stdio: "inherit" });
    execSync(`git push origin ${pagesBranch}`, { stdio: "inherit" });
    core.info(`Successfully uploaded badges to ${pagesBranch} branch`);
  } catch (error) {
    core.warning(`Failed to upload badges to GitHub Pages: ${error.message}`);
  }
}

function generateCoverageComment(coverage, title, showFiles, threshold) {
  const { summary, files } = coverage;
  let comment = `## ${title}\n\n`;
  // Summary section
  comment += "### 📈 Coverage Summary\n\n";
  comment += "| Metric | Coverage | Status |\n";
  comment += "|--------|----------|--------|\n";
  comment += `| **Statements** | ${formatPercentage(
    summary.statements
  )} | ${getCoverageEmoji(summary.statements, threshold)} |\n`;
  comment += `| **Branches** | ${formatPercentage(
    summary.branches
  )} | ${getCoverageEmoji(summary.branches, threshold)} |\n`;
  comment += `| **Functions** | ${formatPercentage(
    summary.functions
  )} | ${getCoverageEmoji(summary.functions, threshold)} |\n`;
  comment += `| **Lines** | ${formatPercentage(
    summary.lines
  )} | ${getCoverageEmoji(summary.lines, threshold)} |\n\n`;
  // Overall status
  const avgCoverage =
    (summary.statements +
      summary.branches +
      summary.functions +
      summary.lines) /
    4;
  const overallEmoji = getCoverageEmoji(avgCoverage, threshold);
  comment += `**Overall Coverage: ${formatPercentage(
    avgCoverage
  )} ${overallEmoji}**\n\n`;
  if (showFiles && files.length > 0) {
    comment += "### 📁 File Details\n\n";
    comment += "| File | Statements | Branches | Functions | Lines |\n";
    comment += "|------|------------|----------|-----------|-------|\n";
    files.forEach((file) => {
      const filePath = file.file
        .replace(process.cwd(), "")
        .replace(/^[\/\\]/, "");
      comment += `| \`${filePath}\` | ${formatPercentage(
        file.statements
      )} | ${formatPercentage(file.branches)} | ${formatPercentage(
        file.functions
      )} | ${formatPercentage(file.lines)} |\n`;
    });
  }
  comment +=
    "\n---\n*Generated by [@glideapps/vitest-v8-json-coverage-summary](https://github.com/glideapps/vitest-v8-json-coverage-summary)*";
  return comment;
}

async function run() {
  try {
    const coverageFile =
      core.getInput("coverage-file", { required: false }) ||
      "coverage/coverage-summary.json";
    const token =
      core.getInput("token", { required: false }) || process.env.GITHUB_TOKEN;
    const title =
      core.getInput("title", { required: false }) || "📊 Coverage Report";
    const showFiles =
      core.getInput("show-files", { required: false }) === "true";
    const threshold = parseInt(
      core.getInput("coverage-threshold", { required: false }) || "80",
      10
    );
    const makeBadges =
      core.getInput("make-badges", { required: false }) === "true";
    const shouldUploadBadges =
      core.getInput("upload-badges-to-pages", { required: false }) === "true";
    const pagesBranch =
      core.getInput("pages-branch", { required: false }) || "gh-pages";
    const pagesBadgesDir =
      core.getInput("pages-badges-dir", { required: false }) || "badges";

    if (!token) {
      core.setFailed("GitHub token is required");
      return;
    }

    // Check if we're in a pull request
    const context = github.context;
    if (context.eventName !== "pull_request") {
      core.info("Not a pull request, skipping coverage comment");
      return;
    }

    // Read coverage file
    const coverageFilePath = path.resolve(coverageFile);
    if (!fs.existsSync(coverageFilePath)) {
      core.setFailed(
        `coverage-summary.json file not found at path ${coverageFilePath}. Did you forget to add the reporter in your vitest.config.js?`
      );
      return;
    }
    const coverageData = JSON.parse(fs.readFileSync(coverageFilePath, "utf8"));

    // Generate badges if enabled
    if (makeBadges) {
      createBadgesDirectory(coverageData);

      // Upload badges to GitHub Pages if enabled
      if (shouldUploadBadges) {
        await uploadBadgesToPages(token, pagesBranch, pagesBadgesDir);
      }
    }

    // Generate comment
    const comment = generateCoverageComment(
      coverageData,
      title,
      showFiles,
      threshold
    );

    // Create GitHub client
    const octokit = github.getOctokit(token);

    // Find existing comment
    const { data: comments } = await octokit.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    });

    const existingComment = comments.find(
      (comment) =>
        comment.user?.type === "Bot" &&
        comment.body?.includes(
          "Generated by [@glideapps/vitest-coverage-tools]"
        )
    );

    if (existingComment) {
      // Update existing comment
      await octokit.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: existingComment.id,
        body: comment,
      });
      core.info("Updated existing coverage comment");
    } else {
      // Create new comment
      await octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: comment,
      });
      core.info("Created new coverage comment");
    }
  } catch (error) {
    core.setFailed(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

run();

// Export functions for testing
module.exports = {
  getCoverageEmoji,
  formatPercentage,
  getBadgeColor,
  generateCoverageBadge,
  createBadgesDirectory,
  uploadBadgesToPages,
  generateCoverageComment,
};
//# sourceMappingURL=action.js.map
