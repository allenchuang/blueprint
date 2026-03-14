import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { appConfig } from "@repo/app-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
