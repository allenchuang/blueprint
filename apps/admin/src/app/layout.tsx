import type { Metadata } from "next";
import { appConfig } from "@repo/app-config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${appConfig.name} Admin`,
  description: `${appConfig.name} Admin Panel`,
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always dark — macOS native aesthetic
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
