"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollText, RefreshCw } from "lucide-react";

const SERVICES = ["openclaw", "agent-dashboard", "node"];

export default function LogsPage() {
  const [service, setService] = useState("openclaw");
  const [lines, setLines] = useState(100);

  const { data, refetch, isLoading } = useQuery<{
    service: string;
    lines: string[];
    platform: string;
  }>({
    queryKey: ["logs", service, lines],
    queryFn: async () => {
      const res = await fetch(
        `/api/logs?service=${service}&lines=${lines}`
      );
      return res.json();
    },
    refetchInterval: 10_000,
  });

  const logLines = data?.lines || [];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Logs</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          System logs for OpenClaw services
        </p>
      </div>

      {/* Controls — wrap on mobile */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted overflow-x-auto">
          {SERVICES.map((s) => (
            <button
              key={s}
              onClick={() => setService(s)}
              className={`px-3 py-1.5 md:py-1 text-[12px] rounded-md transition-colors whitespace-nowrap min-h-[36px] md:min-h-0 ${
                service === s
                  ? "bg-background text-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={lines}
          onChange={(e) => setLines(Number(e.target.value))}
          className="h-10 md:h-8 px-2 rounded-lg bg-muted text-[12px] border-none focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value={50}>50 lines</option>
          <option value={100}>100 lines</option>
          <option value={250}>250 lines</option>
          <option value={500}>500 lines</option>
        </select>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 text-[12px] rounded-lg bg-muted hover:bg-muted/80 transition-colors min-h-[44px] md:min-h-0"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-muted-foreground" />
          <span className="text-[13px] font-semibold">{service}</span>
          <span className="text-[11px] text-muted-foreground">
            ({logLines.length} lines · {data?.platform || "unknown"})
          </span>
        </div>
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto p-3 md:p-4 bg-[oklch(0.12_0_0)]">
          {logLines.length === 0 ? (
            <p className="text-[13px] text-muted-foreground text-center py-8">
              No logs available for this service
            </p>
          ) : (
            <pre className="text-[11px] md:text-[12px] font-mono leading-relaxed text-muted-foreground whitespace-pre-wrap break-all">
              {logLines.join("\n")}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
