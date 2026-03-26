import Link from "next/link";
import { Github, Star } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blueprint OS. Built in public.
          </p>
          <Link
            href="https://github.com/allenchuang/blueprint"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-yellow-400/60 hover:bg-yellow-50/60 hover:text-yellow-700 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400"
          >
            <Star className="size-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:fill-yellow-400 group-hover:text-yellow-400" />
            Star us on GitHub
            <Github className="size-3.5 opacity-60" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
