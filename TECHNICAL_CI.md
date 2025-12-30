# CI/CD & Technical Documentation

## 🚀 CI Pipeline (`npm run verify`)

The project uses a unified verification wrapper to ensure code quality.

### Steps:
1.  **Clean**: Removes old artifacts.
2.  **Lint**: Runs `eslint` to check code quality.
3.  **Analyze**: Builds the application and analyzes bundle size with Webpack.
4.  **Prepare Static**: Copies build output to `final_out` for testing.
5.  **E2E Tests**: Runs Playwright functional tests.
    *   **Note**: Uses `serve` (explicit devDependency) to host the static build locally, preventing CI hangs caused by interactive `npx` prompts.
6.  **Health Check**: Runs `scripts/check-links.mjs` to validate internal integrity (broken links).
7.  **Lighthouse**: Runs Google Lighthouse CI for performance audits.
8.  **Report**: Generates `reports/index.html`.

## 🛠 Tools Configured

- **SonarQube**: `sonar-project.properties` is configured for analysis. Add `SONAR_TOKEN` to GitHub Secrets to enable.
- **Link Checker**: Custom script to validate all internal links in the exported site.
- **Lighthouse CI**: Performance, SEO, and Accessibility checks.
- **Playwright**: Functional E2E testing.
