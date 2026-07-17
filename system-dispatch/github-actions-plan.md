# GitHub Actions Plan

Existing workflows:

- `.github/workflows/build.yml`
- `.github/workflows/playwright.yml`
- `.github/workflows/all-tests.yml`
- `.github/workflows/playwright-store-tests.yml`

Required gates:

1. Install dependencies from the lockfile.
2. Run `npm run build`.
3. Run `npm run lint`.
4. Run the Playwright public/store suite.
5. Upload screenshots and test reports on failure.
6. Never expose repository secrets in logs.
