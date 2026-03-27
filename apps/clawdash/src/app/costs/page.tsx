"use client";

import { useCosts } from "@/hooks/use-costs";
import { formatCost } from "@/lib/utils";
import { DollarSign, TrendingUp } from "lucide-react";

export default function CostsPage() {
  const { data } = useCosts();

  const byModel = data?.byModel || {};
  const byDay = data?.byDay || {};
  const bySession = data?.bySession || [];

  const modelEntries = Object.entries(byModel).sort(([, a], [, b]) => b - a);
  const dayEntries = Object.entries(byDay).sort(([a], [b]) => b.localeCompare(a));
  const maxModelCost = Math.max(...modelEntries.map(([, v]) => v), 1);
  const maxDayCost = Math.max(...dayEntries.map(([, v]) => v), 1);

  return (
    <div className="p-4 md:p-6 space-y-5 md:space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Costs</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Spending breakdown by model, day, and session
        </p>
      </div>

      {/* Summary cards — stack on mobile, row on md+ */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-warning" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Total Spend
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-semibold tracking-tight">
            {formatCost(data?.totalCents || 0)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Models Used
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-semibold tracking-tight">
            {modelEntries.length}
          </p>
        </div>
      </div>

      {/* By model + by day — stack on mobile, 2-col on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[13px] font-semibold">By Model</span>
          </div>
          <div className="p-4 space-y-3">
            {modelEntries.length === 0 ? (
              <p className="text-[13px] text-muted-foreground text-center py-4">
                No cost data available
              </p>
            ) : (
              modelEntries.map(([model, cost]) => (
                <div key={model} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px] gap-2">
                    <span className="truncate">{model}</span>
                    <span className="font-mono shrink-0">
                      {formatCost(cost)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-chart-1 transition-all duration-500"
                      style={{ width: `${(cost / maxModelCost) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[13px] font-semibold">By Day</span>
          </div>
          <div className="p-4 space-y-3">
            {dayEntries.length === 0 ? (
              <p className="text-[13px] text-muted-foreground text-center py-4">
                No daily cost data
              </p>
            ) : (
              dayEntries.slice(0, 14).map(([day, cost]) => (
                <div key={day} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px] gap-2">
                    <span className="font-mono text-muted-foreground shrink-0">
                      {day}
                    </span>
                    <span className="font-mono shrink-0">
                      {formatCost(cost)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-chart-3 transition-all duration-500"
                      style={{ width: `${(cost / maxDayCost) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* By session */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-[13px] font-semibold">By Session</span>
        </div>
        <div className="divide-y divide-border">
          {bySession.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-muted-foreground">
              No session cost data available
            </div>
          ) : (
            bySession.slice(0, 20).map((s) => (
              <div
                key={s.id}
                className="px-4 py-3 flex items-center justify-between gap-3 min-h-[52px]"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[13px] font-mono truncate block">
                    {s.id.slice(0, 20)}
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate block mt-0.5">
                    {s.model}
                  </span>
                </div>
                <span className="text-[13px] font-mono shrink-0">
                  {formatCost(s.costCents)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
