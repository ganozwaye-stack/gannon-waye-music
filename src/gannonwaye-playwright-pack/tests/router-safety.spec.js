const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

test('SPA router path helper blocks protocol-relative and backslash redirect targets', async () => {
  const helperUrl = pathToFileURL(
    path.resolve(__dirname, '../../../src/lib/spaRouterPaths.js')
  ).href;
  const { buildHref, sanitizePathTarget } = await import(helperUrl);

  expect(sanitizePathTarget('//evil.example/path')).toBe('/');
  expect(sanitizePathTarget('\\\\evil.example\\path')).toBe('/');
  expect(buildHref({ pathname: '//evil.example', search: 'x=1' }, '/store')).toBe('/?x=1');
  expect(buildHref({ pathname: '/store', search: 'cart=1', hash: 'top' }, '/')).toBe('/store?cart=1#top');
});
