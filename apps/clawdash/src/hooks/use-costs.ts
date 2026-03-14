"use client";

import { useQuery } from "@tanstack/react-query";

export interface CostData {
  totalCents: number;
  byModel: Record<string, number>;
  byDay: Record<string, number>;
  bySession: { id: string; model: string; costCents: number }[];
}

export function useCosts() {
  return useQuery<CostData>({
    queryKey: ["costs"],
    queryFn: async () => {
      const res = await fetch("/api/costs");
      return res.json();
    },
    refetchInterval: 15_000,
  });
}
