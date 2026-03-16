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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="animate-fade-in-up">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
