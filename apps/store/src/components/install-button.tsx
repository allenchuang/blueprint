"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstallButtonProps {
  command: string;
  className?: string;
}

export function InstallButton({ command, className }: InstallButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3",
        "bg-primary text-primary-foreground font-semibold text-sm",
        "transition-all hover:bg-primary/90 active:scale-[0.98]",
        copied && "bg-emerald-500 hover:bg-emerald-500",
        className,
      )}
    >
      {copied ? (
        <>
          <Check size={16} />
          Copied!
        </>
      ) : (
        <>
          <Terminal size={16} />
          Copy Install Command
        </>
      )}
    </button>
  );
}
