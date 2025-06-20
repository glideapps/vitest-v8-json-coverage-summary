const fs = require("fs");
const path = require("path");

// Badge generation functions (copied from action.js for testing)
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
    console.log(`Created coverage badge at ${badgePath}`);

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
      console.log(`Created ${metric.label} badge at ${metricBadgePath}`);
    });
  } catch (error) {
    console.error(`Failed to create badges: ${error.message}`);
  }
}

// Read the coverage data
const coverageData = JSON.parse(
  fs.readFileSync("./coverage/coverage-summary.json", "utf8")
);

console.log("Testing badge generation...");
console.log("Coverage data:", JSON.stringify(coverageData.summary, null, 2));

// Test badge generation
createBadgesDirectory(coverageData);

// Check if badges were created
const badgesDir = path.join(process.cwd(), "badges");
if (fs.existsSync(badgesDir)) {
  console.log("\n✅ Badges directory created successfully!");

  const files = fs.readdirSync(badgesDir);
  console.log("Generated badge files:");
  files.forEach((file) => {
    const content = JSON.parse(
      fs.readFileSync(path.join(badgesDir, file), "utf8")
    );
    console.log(`  - ${file}: ${content.message} (${content.color})`);
  });
} else {
  console.log("\n❌ Badges directory was not created");
}
