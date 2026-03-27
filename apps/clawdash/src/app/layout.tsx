import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { appConfig } from "@repo/app-config";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/app-sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: `ClawDash — ${appConfig.name}`,
  description: "OpenClaw agent diagnostics dashboard",
  icons: { icon: "/favicon.svg" },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased overflow-x-hidden`}
      >
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
              {/* Mobile top header — shows app name, hidden on desktop */}
              <div className="md:hidden flex items-center gap-2.5 h-12 px-4 border-b border-border bg-sidebar sticky top-0 z-10">
                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-xs">
                  🦞
                </div>
                <span className="text-sm font-semibold tracking-tight">ClawDash</span>
              </div>
              {/* Bottom padding on mobile so content clears the tab bar */}
              <div className="animate-fade-in-up pb-16 md:pb-0">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
