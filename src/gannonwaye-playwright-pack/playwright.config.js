// @ts-check
 

/**
 * DEPRECATED — this config is intentionally inert.
 *
 * The real config is `/playwright.config.js` at the repository root.
 *
 * Two configs plus two package.json files meant Playwright resolved differently
 * depending on which directory you happened to be standing in. That is what caused
 * "conflicting Playwright installs". One config, one install, one place to run it.
 *
 * Run from the repo root:
 *   npm install
 *   npm run test:e2e:install     # one time, fetches the matching browser binary
 *   npm run test:e2e             # local dev server
 *   npm run test:e2e:live        # against https://gannonwaye.com
 */

throw new Error(
  [
    '',
    'This Playwright config is deprecated and must not be used.',
    '',
    'Run the suite from the REPOSITORY ROOT instead:',
    '',
    '    npm install',
    '    npm run test:e2e:install     # one time',
    '    npm run test:e2e',
    '',
    'The root config is /playwright.config.js. Running from inside this folder,',
    'or with a bare `npx playwright test`, is what caused the conflicting installs.',
    '',
  ].join('\n')
);
