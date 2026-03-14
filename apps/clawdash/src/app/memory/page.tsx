"use client";

import { useState } from "react";
import { useMemoryFiles, useMemoryFile } from "@/hooks/use-memory-files";
import { formatBytes, timeAgo } from "@/lib/utils";
import { Brain, FileText, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MemoryPage() {
  const { data: filesData } = useMemoryFiles();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const { data: fileData, isLoading } = useMemoryFile(selectedPath);

  const files = filesData?.files || [];

  return (
    <div className="p-6 space-y-5 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Memory</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Agent memory and workspace files
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="rounded-xl border border-border bg-card">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-[13px] font-semibold">Files</span>
          </div>
          <div className="divide-y divide-border">
            {files.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-muted-foreground">
                No memory files found
              </div>
            ) : (
              files.map((f) => (
                <button
                  key={f.path}
                  onClick={() => setSelectedPath(f.path)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                    selectedPath === f.path
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">
                      {f.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatBytes(f.size)} · {timeAgo(f.modifiedAt)}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card min-h-[500px]">
          {!selectedPath ? (
            <div className="flex items-center justify-center h-full text-[13px] text-muted-foreground">
              Select a file to view its contents
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full text-[13px] text-muted-foreground">
              Loading...
            </div>
          ) : (
            <div className="p-5">
              <div className="prose prose-sm prose-invert max-w-none text-[13px] leading-relaxed [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-[14px] [&_h3]:font-semibold [&_code]:text-[12px] [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-3">
                <ReactMarkdown>{fileData?.content || ""}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
