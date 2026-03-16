"use client";

import { useQuery } from "@tanstack/react-query";

export interface UsageInfo {
  model: string;
  tokensUsed: number;
  tokenLimit: number;
  windowMinutes: number;
}

export function useUsage() {
  return useQuery<{ usage: UsageInfo[] }>({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await fetch("/api/usage");
      return res.json();
    },
    refetchInterval: 10_000,
  });
}
