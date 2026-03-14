"use client";

import { useQuery } from "@tanstack/react-query";

export interface MemoryFileInfo {
  name: string;
  path: string;
  size: number;
  modifiedAt: string;
}

export function useMemoryFiles() {
  return useQuery<{ files: MemoryFileInfo[] }>({
    queryKey: ["memory-files"],
    queryFn: async () => {
      const res = await fetch("/api/memory-files");
      return res.json();
    },
    refetchInterval: 10_000,
  });
}

export function useMemoryFile(path: string | null) {
  return useQuery<{ path: string; content: string }>({
    queryKey: ["memory-file", path],
    queryFn: async () => {
      const res = await fetch(`/api/memory-file?path=${encodeURIComponent(path!)}`);
      return res.json();
    },
    enabled: !!path,
  });
}
