"use client";

import { useUsage } from "@/hooks/use-usage";
import { formatNumber } from "@/lib/utils";
import { Gauge } from "lucide-react";

const MODEL_COLORS: Record<string, string> = {
  "anthropic/claude-opus-4-6": "#FF453A",
  "anthropic/claude-sonnet-4": "#FF9F0A",
  "openai/gpt-4o": "#30D158",
  "google/gemini-2.5-pro": "#007AFF",
};

export default function RateLimitsPage() {
  const { data } = useUsage();
  const usage = data?.usage || [];

  return (
    <div className="p-4 md:p-6 space-y-5 md:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Rate Limits</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Token usage against rolling rate limit windows
        </p>
      </div>

      <div className="space-y-3">
        {usage.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-[13px] text-muted-foreground">
            No rate limit data. OpenClaw sessions will appear here when active.
          </div>
        ) : (
          usage.map((u) => {
            const pct = Math.min(
              (u.tokensUsed / u.tokenLimit) * 100,
              100
            );
            const color = MODEL_COLORS[u.model] || "#007AFF";
            const isNear = pct > 80;

            return (
              <div
                key={u.model}
                className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Gauge
                      className="w-4 h-4 shrink-0"
                      style={{ color }}
                    />
                    <span className="text-[13px] font-medium truncate">
                      {u.model}
                    </span>
                  </div>
                  <span
                    className={`text-[12px] font-mono shrink-0 ${
                      isNear ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {formatNumber(u.tokensUsed)} / {formatNumber(u.tokenLimit)}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{Math.round(pct)}% used</span>
                  <span>{u.windowMinutes}min rolling window</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
