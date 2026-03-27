"use client";

import { useLiveFeed } from "@/hooks/use-live-feed";
import { Radio, Pause, Play, Trash2 } from "lucide-react";

export default function LiveFeedPage() {
  const { messages, connected, paused, togglePause, clear } = useLiveFeed();

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Live Feed</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Real-time message stream from OpenClaw gateway
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                connected ? "bg-success animate-pulse" : "bg-destructive"
              }`}
            />
            {connected ? "Connected" : "Disconnected"}
          </div>
          <button
            onClick={togglePause}
            className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 text-[12px] rounded-lg bg-muted hover:bg-muted/80 transition-colors min-h-[44px] md:min-h-0"
          >
            {paused ? (
              <Play className="w-3 h-3" />
            ) : (
              <Pause className="w-3 h-3" />
            )}
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={clear}
            className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 text-[12px] rounded-lg bg-muted hover:bg-muted/80 transition-colors min-h-[44px] md:min-h-0"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card min-h-[500px] max-h-[calc(100vh-200px)] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-[13px] text-muted-foreground gap-3">
            <Radio className="w-8 h-8 opacity-30" />
            <p>
              {connected
                ? "Waiting for messages..."
                : "Connecting to gateway..."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="px-4 py-3 animate-slide-in-bottom"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-primary/15 text-primary">
                    {msg.type}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre className="text-[12px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap break-all">
                  {typeof msg.data === "string"
                    ? msg.data
                    : JSON.stringify(msg.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
