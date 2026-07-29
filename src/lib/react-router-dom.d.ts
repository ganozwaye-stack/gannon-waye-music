declare module 'react-router-dom' {
  import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';

  type To = string | {
    pathname?: string;
    search?: string;
    hash?: string;
  };

  export interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
  }

  export interface NavigateOptions {
    replace?: boolean;
    state?: unknown;
  }

  export function BrowserRouter(props: { children?: ReactNode }): ReactElement | null;
  export function Routes(props: { children?: ReactNode }): ReactElement | null;
  export function Route(props: { path?: string; element?: ReactElement | null; children?: ReactNode }): ReactElement | null;
  export function Navigate(props: { to: To; replace?: boolean; state?: unknown }): null;
  export function Outlet(): ReactElement | null;
  export function useLocation(): Location;
  export function useNavigate(): (to: To | number, options?: NavigateOptions) => void;
  export function useParams(): Record<string, string>;
  export function useSearchParams(): [URLSearchParams, (nextInit: URLSearchParams | Record<string, string>, options?: NavigateOptions) => void];
  export function Link(props: AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: To;
    replace?: boolean;
    state?: unknown;
    reloadDocument?: boolean;
  }): ReactElement | null;
}
