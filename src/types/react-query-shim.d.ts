import type * as React from 'react';

declare module '@tanstack/react-query' {
  export class QueryClient {
    constructor(options?: any);
    invalidateQueries(filters?: any): Promise<void>;
    setQueryData(queryKey: any, updater: any): void;
    getQueryData(queryKey: any): any;
  }

  export const QueryClientProvider: React.ComponentType<any>;

  export function useQuery(options: any): any;
  export function useQueries(options: any): any;
  export function useMutation(options: any): any;
  export function useQueryClient(): QueryClient;
}
