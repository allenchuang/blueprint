"use client";

import { useQuery } from "@tanstack/react-query";

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  lastRun?: string;
  command?: string;
}

export function useCrons() {
  return useQuery<{ jobs: CronJob[] }>({
    queryKey: ["crons"],
    queryFn: async () => {
      const res = await fetch("/api/crons");
      return res.json();
    },
    refetchInterval: 15_000,
  });
}
