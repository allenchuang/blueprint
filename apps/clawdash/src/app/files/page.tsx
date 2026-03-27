"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, FileText, Wrench, Save, RotateCcw } from "lucide-react";

interface KeyFileInfo {
  name: string;
  path: string;
  type: "skill" | "config" | "file";
}

export default function FilesPage() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: filesData } = useQuery<{ files: KeyFileInfo[] }>({
    queryKey: ["key-files"],
    queryFn: async () => {
      const res = await fetch("/api/key-files");
      return res.json();
    },
    refetchInterval: 15_000,
  });

  const { data: fileContent, isLoading } = useQuery<{
    path: string;
    content: string;
  }>({
    queryKey: ["key-file", selectedFile],
    queryFn: async () => {
      const res = await fetch(
        `/api/key-file?path=${encodeURIComponent(selectedFile!)}`
      );
      return res.json();
    },
    enabled: !!selectedFile,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ path, content }: { path: string; content: string }) => {
      const res = await fetch("/api/key-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, content }),
      });
      return res.json();
    },
    onSuccess: () => {
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["key-file", selectedFile] });
    },
  });

  const files = filesData?.files || [];
  const skills = files.filter((f) => f.type === "skill");
  const configs = files.filter((f) => f.type === "config");

  function handleSelect(path: string) {
    setSelectedFile(path);
    setHasChanges(false);
  }

  function handleContentLoad() {
    if (fileContent?.content && !hasChanges) {
      setEditContent(fileContent.content);
    }
  }

  if (fileContent?.content && editContent !== fileContent.content && !hasChanges) {
    handleContentLoad();
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Files</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Workspace files, skills, and configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <div className="rounded-xl border border-border bg-card">
          {configs.length > 0 && (
            <>
              <div className="px-4 py-2.5 flex items-center gap-2 border-b border-border">
                <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  Config Files
                </span>
              </div>
              <div className="divide-y divide-border">
                {configs.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => handleSelect(f.path)}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors text-[13px] ${
                      selectedFile === f.path
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    {f.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {skills.length > 0 && (
            <>
              <div className="px-4 py-2.5 flex items-center gap-2 border-b border-border">
                <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  Skills
                </span>
              </div>
              <div className="divide-y divide-border">
                {skills.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => handleSelect(f.path)}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors text-[13px] ${
                      selectedFile === f.path
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 shrink-0" />
                    {f.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {files.length === 0 && (
            <div className="p-6 text-center text-[13px] text-muted-foreground">
              No workspace files found
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card flex flex-col min-h-[500px]">
          {!selectedFile ? (
            <div className="flex-1 flex items-center justify-center text-[13px] text-muted-foreground">
              Select a file to view and edit
            </div>
          ) : isLoading ? (
            <div className="flex-1 flex items-center justify-center text-[13px] text-muted-foreground">
              Loading...
            </div>
          ) : (
            <>
              <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-[13px] font-mono text-muted-foreground">
                  {selectedFile}
                </span>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <>
                      <button
                        onClick={() => {
                          setEditContent(fileContent?.content || "");
                          setHasChanges(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 text-[12px] rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Revert
                      </button>
                      <button
                        onClick={() =>
                          saveMutation.mutate({
                            path: selectedFile!,
                            content: editContent,
                          })
                        }
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1 text-[12px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-3 h-3" />
                        {saveMutation.isPending ? "Saving..." : "Save"}
                      </button>
                    </>
                  )}
                </div>
              </div>
              <textarea
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  setHasChanges(e.target.value !== fileContent?.content);
                }}
                className="flex-1 p-4 bg-transparent font-mono text-[13px] leading-relaxed resize-none focus:outline-none"
                spellCheck={false}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
