import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { appConfig } from "@repo/app-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

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
      <body className={`${inter.className} ${instrumentSerif.variable}`}>{children}</body>
    </html>
  );
}
