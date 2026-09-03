import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const ROOT = resolve('.');
const SRC = join(ROOT, 'src');
const APP = join(SRC, 'App.jsx');
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const walk = (dir) => readdirSync(dir)
  .flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  })
  .filter((file) => SOURCE_EXTENSIONS.has(extname(file)));

const normalize = (value) => {
  const clean = value.split('#')[0].split('?')[0].replace(/\/+$/, '');
  return clean || '/';
};

const appSource = readFileSync(APP, 'utf8');
const routePatterns = [...appSource.matchAll(/<Route\s+path=["']([^"']+)["']/g)]
  .map((match) => normalize(match[1]))
  .filter((route) => route !== '*');

const seenRoutes = new Set();
const duplicateRoutes = [...new Set(routePatterns.filter((route) => {
  if (seenRoutes.has(route)) return true;
  seenRoutes.add(route);
  return false;
}))];

if (duplicateRoutes.length > 0) {
  console.error('Duplicate route declarations found:');
  for (const route of duplicateRoutes.sort()) console.error(`- ${route}`);
  process.exit(1);
}

const matchesRoute = (target) => routePatterns.some((pattern) => {
  if (pattern === target) return true;
  if (pattern.endsWith('/*')) {
    const base = pattern.slice(0, -2);
    return target === base || target.startsWith(`${base}/`);
  }

  const patternParts = pattern.split('/').filter(Boolean);
  const targetParts = target.split('/').filter(Boolean);
  if (patternParts.length !== targetParts.length) return false;
  return patternParts.every((part, index) => part.startsWith(':') || part === targetParts[index]);
});

const literalPatterns = [
  /\b(?:to|href|path|route)\s*[:=]\s*["'](\/[^"'#?]*)[^"']*["']/g,
  /\bnavigate\(\s*["'](\/[^"'#?]*)[^"']*["']/g,
];

const missing = new Map();

for (const file of walk(SRC)) {
  const source = readFileSync(file, 'utf8');
  for (const pattern of literalPatterns) {
    for (const match of source.matchAll(pattern)) {
      const target = normalize(match[1]);
      if (
        target.includes('${') ||
        target.includes(':') ||
        target.includes('*') ||
        target.startsWith('/api/') ||
        /\.[a-z0-9]{2,5}$/i.test(target) ||
        matchesRoute(target)
      ) {
        continue;
      }

      const line = source.slice(0, match.index).split('\n').length;
      const key = `${target}|${relative(ROOT, file)}:${line}`;
      missing.set(key, { target, file: relative(ROOT, file), line });
    }
  }
}

if (missing.size > 0) {
  console.error('Internal route integrity check failed:');
  for (const item of [...missing.values()].sort((a, b) => a.target.localeCompare(b.target))) {
    console.error(`- ${item.target} <- ${item.file}:${item.line}`);
  }
  process.exit(1);
}

console.log(`Internal route integrity verified across ${routePatterns.length} declared routes.`);
