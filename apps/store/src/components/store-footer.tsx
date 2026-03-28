import { Github, Star } from "lucide-react";
import { appConfig } from "@repo/app-config";

export function StoreFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-base">🧢</span>
            <span>
              <span className="text-foreground font-medium">{appConfig.name}</span>{" "}
              BlueMart
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a
              href="https://github.com/allenchuang/blueprint/blob/allen/os/registry/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Contribute a Package
            </a>
            <a
              href="https://github.com/allenchuang/blueprint"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium transition-all hover:border-yellow-400/60 hover:bg-yellow-50/60 hover:text-yellow-700 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400"
            >
              <Star className="size-3 transition-transform group-hover:scale-110 group-hover:fill-yellow-400 group-hover:text-yellow-400" />
              Star on GitHub
              <Github className="size-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
