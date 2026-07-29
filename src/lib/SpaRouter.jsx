import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildHref, normalizePathname } from '@/lib/spaRouterPaths';

const LocationContext = createContext(null);
const ParamsContext = createContext({});
const OutletContext = createContext(null);

const getLocationSnapshot = () => ({
  pathname: normalizePathname(window.location.pathname),
  search: window.location.search || '',
  hash: window.location.hash || '',
  state: window.history.state,
  key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
});

const isModifiedClick = (event) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;

const isExternalHref = (href) => {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
};

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(getLocationSnapshot);

  useEffect(() => {
    const onPopState = () => setLocation(getLocationSnapshot());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to, options = {}) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }

    const href = buildHref(to, window.location.pathname);
    if (isExternalHref(href)) {
      window.location.assign(href);
      return;
    }

    const url = new URL(href, window.location.origin);
    const nextPath = `${url.pathname}${url.search}${url.hash}`;
    const nextState = options.state ?? null;

    if (options.replace) {
      window.history.replaceState(nextState, '', nextPath);
    } else {
      window.history.pushState(nextState, '', nextPath);
    }

    setLocation(getLocationSnapshot());
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

const getRouter = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('Router hooks must be used inside BrowserRouter.');
  return context;
};

export function useLocation() {
  return getRouter().location;
}

export function useNavigate() {
  return getRouter().navigate;
}

export function useParams() {
  return useContext(ParamsContext);
}

export function useSearchParams() {
  const { location, navigate } = getRouter();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const setSearchParams = useCallback((nextInit, options = {}) => {
    const nextParams = nextInit instanceof URLSearchParams
      ? nextInit
      : new URLSearchParams(nextInit);
    const query = nextParams.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}${location.hash}`, {
      replace: options.replace,
      state: options.state,
    });
  }, [location.hash, location.pathname, navigate]);

  return [params, setSearchParams];
}

export function Navigate({ to, replace = false, state = null }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, replace, state, to]);

  return null;
}

export const Link = React.forwardRef(function Link(
  { to, replace = false, state = null, onClick, target, reloadDocument, ...props },
  ref,
) {
  const navigate = useNavigate();
  const href = buildHref(to, window.location.pathname);

  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      reloadDocument ||
      target ||
      isModifiedClick(event) ||
      isExternalHref(href)
    ) {
      return;
    }

    event.preventDefault();
    navigate(href, { replace, state });
  };

  return <a ref={ref} href={href} target={target} onClick={handleClick} {...props} />;
});

export function Outlet() {
  return useContext(OutletContext);
}

export function Route() {
  return null;
}

const toRouteArray = (children) => React.Children.toArray(children).filter(React.isValidElement);

const matchPath = (pattern, pathname) => {
  if (!pattern) return null;
  if (pattern === '*') return { params: {} };

  const normalizedPattern = normalizePathname(pattern);
  const normalizedPath = normalizePathname(pathname);
  const patternSegments = normalizedPattern.split('/').filter(Boolean);
  const pathSegments = normalizedPath.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) return null;

  const params = {};
  for (let i = 0; i < patternSegments.length; i += 1) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];

    if (patternSegment.startsWith(':')) {
      params[patternSegment.slice(1)] = decodeURIComponent(pathSegment);
      continue;
    }

    if (patternSegment !== pathSegment) return null;
  }

  return { params };
};

const renderWithContexts = (element, params, outlet = null) => (
  <ParamsContext.Provider value={params}>
    <OutletContext.Provider value={outlet}>
      {element}
    </OutletContext.Provider>
  </ParamsContext.Provider>
);

const matchRouteElement = (routeElement, pathname) => {
  const { children, element, path } = routeElement.props;

  if (!path) {
    const childMatch = matchRoutes(toRouteArray(children), pathname);
    if (!childMatch) return null;
    return {
      element: renderWithContexts(element, childMatch.params, childMatch.element),
      params: childMatch.params,
    };
  }

  const match = matchPath(path, pathname);
  if (!match) return null;

  return {
    element: renderWithContexts(element, match.params),
    params: match.params,
  };
};

const matchRoutes = (routes, pathname) => {
  for (const route of routes) {
    const match = matchRouteElement(route, pathname);
    if (match) return match;
  }
  return null;
};

export function Routes({ children }) {
  const { location } = getRouter();
  const match = matchRoutes(toRouteArray(children), location.pathname);
  return match?.element ?? null;
}
