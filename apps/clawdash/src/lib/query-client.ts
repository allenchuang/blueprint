"use client";

import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5_000,
          gcTime: 30_000,
          refetchOnWindowFocus: true,
          retry: 1,
        },
      },
    });
  }
  return queryClient;
}
