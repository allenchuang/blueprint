import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
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
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const OG_TITLE = "Blueprint OS — Full-stack developer OS";
const OG_DESCRIPTION =
  "Build and ship apps faster with Blueprint OS. Next.js 15, Fastify, Drizzle, Expo, Remotion, and an AI assistant built in.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: appConfig.colors.primary,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/allenchuang/blueprint"),
  title: OG_TITLE,
  description: OG_DESCRIPTION,
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
  openGraph: {
    type: "website",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "https://github.com/allenchuang/blueprint",
    siteName: "Blueprint OS",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Blueprint OS — Full-stack developer OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: ["/og.png"],
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
      <body className={`${inter.className} ${instrumentSerif.variable}`}>
        <ThemeProvider>
          <TooltipProvider>
            <WorldMiniKitProvider>
              <DynamicAuthProvider>
                <PrivyAuthProvider>
                  <QueryProvider>
                    <I18nProvider>
                      <div className="flex min-h-screen flex-col">
                        <NavBar />
                        <main className="flex-1">{children}</main>
                        <SiteFooter />
                      </div>
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
