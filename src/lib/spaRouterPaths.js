export const normalizePathname = (pathname) => {
  if (!pathname) return '/';
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return clean.length > 1 ? clean.replace(/\/+$/, '') : clean;
};

export const sanitizePathTarget = (target) => {
  const text = String(target ?? '/').trim();
  if (!text) return '/';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(text)) return text;
  const normalized = text.replace(/\\/g, '/');
  if (normalized.startsWith('//')) return '/';
  return normalized;
};

export const buildHref = (to, currentPathname = '/') => {
  if (typeof to === 'string') return sanitizePathTarget(to);
  if (!to || typeof to !== 'object') return '/';
  const pathname = sanitizePathTarget(to.pathname || currentPathname || '/');
  const search = to.search ? (String(to.search).startsWith('?') ? String(to.search) : `?${to.search}`) : '';
  const hash = to.hash ? (String(to.hash).startsWith('#') ? String(to.hash) : `#${to.hash}`) : '';
  return `${pathname}${search}${hash}`;
};
