"use client";

import { useCrons } from "@/hooks/use-crons";
import { Clock, Play, CheckCircle2, XCircle } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default function CronPage() {
  const { data } = useCrons();
  const jobs = data?.jobs || [];

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Cron Jobs</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Scheduled tasks and automation
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-muted-foreground flex flex-col items-center gap-3">
            <Clock className="w-8 h-8 opacity-30" />
            <p>No cron jobs configured</p>
            <p className="text-[11px]">
              Add cron jobs to your OpenClaw config to see them here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="px-5 py-4 flex items-center gap-4"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    job.enabled
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {job.enabled ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium">{job.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[12px] font-mono text-muted-foreground">
                      {job.schedule}
                    </span>
                    {job.lastRun && (
                      <span className="text-[11px] text-muted-foreground">
                        Last: {timeAgo(job.lastRun)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      job.enabled ? "bg-success" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        job.enabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
