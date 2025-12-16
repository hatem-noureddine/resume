import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

// Copy Playwright Report
const playwrightSrc = path.join(__dirname, '../playwright-report');
const playwrightDest = path.join(reportDir, 'playwright');
if (fs.existsSync(playwrightSrc)) {
    fs.rmSync(playwrightDest, { recursive: true, force: true });
    fs.cpSync(playwrightSrc, playwrightDest, { recursive: true });
}

// Copy Lighthouse Report
const lighthouseSrc = path.join(__dirname, '../.lighthouseci');
const lighthouseDest = path.join(reportDir, 'lighthouse');
if (fs.existsSync(lighthouseSrc)) {
    fs.rmSync(lighthouseDest, { recursive: true, force: true });
    fs.cpSync(lighthouseSrc, lighthouseDest, { recursive: true });
}

// Copy Bundle Analyzer Report (Assuming it ends up in .next/analyze/client.html or we find it)
// logic pending finding the actual file
const analyzeSrc = path.join(__dirname, '../.next/analyze');
const analyzeDest = path.join(reportDir, 'analyze');
if (fs.existsSync(analyzeSrc)) {
    fs.rmSync(analyzeDest, { recursive: true, force: true });
    fs.cpSync(analyzeSrc, analyzeDest, { recursive: true });
}

// Parse Reports
function readJson(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch (e) {
        console.error(`Failed to read ${filePath}:`, e.message);
    }
    return null;
}

const jestData = readJson(path.join(reportDir, 'jest-results.json'));
const playwrightData = readJson(path.join(reportDir, 'playwright-results.json'));
const linksData = readJson(path.join(reportDir, 'links.json'));

// Summary Stats
const jestSummary = jestData ? {
    passed: jestData.numPassedTests,
    failed: jestData.numFailedTests,
    total: jestData.numTotalTests,
    success: jestData.success
} : { passed: 0, failed: 0, total: 0, success: false };

const playwrightSummary = playwrightData ? {
    total: playwrightData.stats?.expected || 0,
    passed: (playwrightData.suites || []).reduce((acc, suite) => acc + (suite.specs || []).filter(s => s.ok).length, 0), // Rough count, better to relay on summary if available
    failed: playwrightData.stats?.unexpected || 0,
    success: (playwrightData.stats?.unexpected || 0) === 0
} : { passed: 0, failed: 0, total: 0, success: false };

const linksSummary = linksData ? {
    broken: linksData.brokenLinks.length,
    total: linksData.totalLinks,
    success: linksData.success
} : { broken: 0, total: 0, success: false };

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CI/CD Verification Report</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; background: #f9fafb; }
        h1 { color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-decoration: none; color: inherit; display: block; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-color: #d1d5db; }
        .card h2 { margin-top: 0; color: #1f2937; font-size: 1.25rem; display: flex; align-items: center; justify-content: space-between; }
        .card p { color: #6b7280; margin: 8px 0 16px; font-size: 0.95rem; }
        .metrics { display: flex; gap: 12px; font-size: 0.875rem; font-weight: 500; }
        .metric { padding: 4px 10px; border-radius: 9999px; background: #f3f4f6; color: #374151; }
        .metric.passed { background: #dcfce7; color: #166534; }
        .metric.failed { background: #fee2e2; color: #991b1b; }
        .status-icon { font-size: 1.5rem; }
        .meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 40px; text-align: center; }
    </style>
</head>
<body>
    <h1>🚀 CI/CD Verification Report</h1>
    <div class="meta">Generated at: ${new Date().toLocaleString()}</div>

    <div class="grid">
        <!-- Jest Unit Tests -->
        <div class="card" style="border-left: 4px solid ${jestSummary.success ? '#22c55e' : '#ef4444'}">
            <h2>
                <span>🧬 Unit Tests</span>
                <span class="status-icon">${jestSummary.success ? '✅' : '❌'}</span>
            </h2>
            <p>Jest tests coverage for components and utilities.</p>
            <div class="metrics">
                <span class="metric passed">${jestSummary.passed} Passed</span>
                ${jestSummary.failed > 0 ? `<span class="metric failed">${jestSummary.failed} Failed</span>` : ''}
                <span class="metric">${jestSummary.total} Total</span>
            </div>
        </div>

        <!-- Playwright E2E -->
        <a href="playwright/index.html" target="_blank" class="card" style="border-left: 4px solid ${playwrightSummary.success ? '#22c55e' : '#ef4444'}">
            <h2>
                <span>🎭 E2E Tests</span>
                <span class="status-icon">${playwrightSummary.success ? '✅' : '❌'}</span>
            </h2>
            <p>Functional & Accessibility tests via Playwright.</p>
            <div class="metrics">
                ${playwrightSummary.failed > 0 ? `<span class="metric failed">${playwrightSummary.failed} Failed</span>` : '<span class="metric passed">Passed</span>'}
            </div>
        </a>

        <!-- Health Checks -->
        <div class="card" style="border-left: 4px solid ${linksSummary.success ? '#22c55e' : '#ef4444'}">
            <h2>
                <span>🔗 Link Health</span>
                <span class="status-icon">${linksSummary.success ? '✅' : '❌'}</span>
            </h2>
            <p>Internal link validation report.</p>
            <div class="metrics">
                ${linksSummary.broken > 0 ? `<span class="metric failed">${linksSummary.broken} Broken</span>` : '<span class="metric passed">All Valid</span>'}
                <span class="metric">${linksSummary.total} Scanned</span>
            </div>
        </div>

        <!-- Lighthouse -->
        <a href="lighthouse/index.html" target="_blank" class="card" style="border-left: 4px solid #3b82f6">
            <h2>
                <span>⚡ Performance</span>
                <span class="status-icon">📊</span>
            </h2>
            <p>Lighthouse performance, SEO, and PWA metrics.</p>
            <div class="metrics">
                <span class="metric">View Report</span>
            </div>
        </a>

        <!-- Bundle Analysis -->
        <a href="analyze/client.html" target="_blank" class="card" style="border-left: 4px solid #a855f7">
            <h2>
                <span>📦 Bundle Size</span>
                <span class="status-icon">🔍</span>
            </h2>
            <p>Next.js production bundle visualization.</p>
            <div class="metrics">
                 <span class="metric">View Analysis</span>
            </div>
        </a>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(reportDir, 'index.html'), html);
console.log('✅ Unified Report generated at reports/index.html');
