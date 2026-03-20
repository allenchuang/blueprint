import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { appConfig } from "@repo/app-config";
import { WorldMiniKitProvider } from "@/components/minikit-provider";
import { DynamicAuthProvider } from "@/components/dynamic-provider";
import { PrivyAuthProvider } from "@/components/privy-provider";
import { QueryProvider } from "@/components/query-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavBar } from "@/components/nav-bar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: appConfig.colors.primary,
};

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: appConfig.name,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <TooltipProvider>
            <WorldMiniKitProvider>
              <DynamicAuthProvider>
                <PrivyAuthProvider>
                  <QueryProvider>
                    <I18nProvider>
                      <NavBar />
                      <main className="flex-1">{children}</main>
                    </I18nProvider>
                  </QueryProvider>
                </PrivyAuthProvider>
              </DynamicAuthProvider>
            </WorldMiniKitProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
