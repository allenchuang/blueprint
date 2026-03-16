"use client";

import { useQuery } from "@tanstack/react-query";

export interface SystemHealth {
  cpu: { usage: number; cores: number; model: string };
  memory: { total: number; used: number; free: number; usagePercent: number };
  disk: { filesystem: string; size: string; used: string; available: string; usePercent: number; mount: string }[];
  uptime: number;
  hostname: string;
  platform: string;
}

export function useSystemHealth() {
  return useQuery<SystemHealth>({
    queryKey: ["system-health"],
    queryFn: async () => {
      const res = await fetch("/api/system");
      return res.json();
    },
    refetchInterval: 5_000,
  });
}
