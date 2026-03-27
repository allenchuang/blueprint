"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Save, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ConfigPage() {
  const queryClient = useQueryClient();
  const [editValue, setEditValue] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { data, isLoading } = useQuery<{ config: Record<string, unknown> }>({
    queryKey: ["openclaw-config"],
    queryFn: async () => {
      const res = await fetch("/api/openclaw-config");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (config: Record<string, unknown>) => {
      const res = await fetch("/api/openclaw-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      return res.json();
    },
    onSuccess: () => {
      setHasChanges(false);
      setJsonError(null);
      queryClient.invalidateQueries({ queryKey: ["openclaw-config"] });
    },
  });

  useEffect(() => {
    if (data?.config && !hasChanges) {
      setEditValue(JSON.stringify(data.config, null, 2));
    }
  }, [data, hasChanges]);

  function handleChange(value: string) {
    setEditValue(value);
    setHasChanges(true);
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function handleSave() {
    try {
      const parsed = JSON.parse(editValue);
      saveMutation.mutate(parsed);
    } catch {
      setJsonError("Cannot save: invalid JSON");
    }
  }

  function handleRevert() {
    if (data?.config) {
      setEditValue(JSON.stringify(data.config, null, 2));
      setHasChanges(false);
      setJsonError(null);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Config</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          OpenClaw configuration editor
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card flex flex-col min-h-[500px]">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span className="text-[13px] font-mono text-muted-foreground">
              openclaw.json
            </span>
          </div>
          <div className="flex items-center gap-2">
            {jsonError && (
              <div className="flex items-center gap-1.5 text-[11px] text-destructive">
                <AlertTriangle className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{jsonError}</span>
              </div>
            )}
            {saveMutation.isSuccess && !hasChanges && (
              <div className="flex items-center gap-1.5 text-[11px] text-success">
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </div>
            )}
            {hasChanges && (
              <>
                <button
                  onClick={handleRevert}
                  className="flex items-center gap-1.5 px-3 py-1 text-[12px] rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Revert
                </button>
                <button
                  onClick={handleSave}
                  disabled={!!jsonError || saveMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1 text-[12px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3 h-3" />
                  {saveMutation.isPending ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-[13px] text-muted-foreground">
            Loading config...
          </div>
        ) : !data?.config ? (
          <div className="flex-1 flex items-center justify-center text-[13px] text-muted-foreground flex-col gap-2">
            <Settings className="w-8 h-8 opacity-30" />
            <p>
              No config found at <code className="bg-muted px-1 py-0.5 rounded text-[12px]">~/.openclaw/openclaw.json</code>
            </p>
          </div>
        ) : (
          <textarea
            value={editValue}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1 p-4 bg-[oklch(0.12_0_0)] font-mono text-[13px] leading-relaxed resize-none focus:outline-none rounded-b-xl"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
