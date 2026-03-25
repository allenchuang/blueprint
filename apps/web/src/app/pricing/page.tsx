"use client";

import { useState } from "react";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { stripeEnabled } from "@/lib/stripe";
import { useSubscription } from "@/hooks/use-subscription";
import { FEATURES, type FeatureKey } from "@/lib/features";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const FEATURE_KEYS: FeatureKey[] = [
  "basicAnalytics",
  "advancedAnalytics",
  "exportData",
  "prioritySupport",
  "customBranding",
];

function CheckIcon() {
  return (
    <svg className="size-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="size-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PerspectiveGrid() {
  const cols = 20;
  const rows = 12;
  const cellSize = 120;
  const w = cols * cellSize;
  const h = rows * cellSize;
  const hLines = Array.from({ length: rows + 1 }, (_, i) => i * cellSize);
  const vLines = Array.from({ length: cols + 1 }, (_, i) => i * cellSize);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] overflow-hidden"
      style={{ perspective: "800px" }}
    >
      <div className="absolute inset-0 origin-bottom" style={{ transform: "rotateX(55deg)" }}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute -inset-x-[20%] bottom-0 h-full w-[140%]"
        >
          <defs>
            <linearGradient id="gridFadeV2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="35%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="gridMask2">
              <rect width={w} height={h} fill="white" />
              <rect width={w} height={h} fill="url(#gridFadeV2)" />
            </mask>
          </defs>
          <g mask="url(#gridMask2)">
            {hLines.map((y, i) => (
              <line key={`h-${i}`} x1={0} y1={y} x2={w} y2={y} stroke="#3b82f6" strokeWidth="1.2" opacity={0.2} />
            ))}
            {vLines.map((x, i) => (
              <line key={`v-${i}`} x1={x} y1={0} x2={x} y2={h} stroke="#3b82f6" strokeWidth="1.2" opacity={0.2} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { t } = useTranslation();
  const { tier, isLoading } = useSubscription();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  if (!stripeEnabled) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-linear-to-b from-blue-300 via-blue-50/50 to-white dark:from-blue-950 dark:via-gray-900/50 dark:to-gray-950">
        <div className="relative z-10 mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-black/8 dark:border-white/8">
            <svg className="size-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <h1 className={`text-3xl ${instrumentSerif.className}`}>{t("notConfiguredTitle")}</h1>
          <p className="mt-3 text-muted-foreground">{t("notConfiguredMessage")}</p>
          <Link href="/"><Button variant="outline" className="mt-6">{t("backToHome")}</Button></Link>
        </div>
        <PerspectiveGrid />
      </div>
    );
  }

  async function handleSubscribe(priceId: string) {
    setLoadingCheckout(true);
    try {
      const res = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingCheckout(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-linear-to-b from-blue-300 via-blue-50/50 to-white dark:from-blue-950 dark:via-gray-900/50 dark:to-gray-950">
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 sm:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className={`text-5xl sm:text-6xl ${instrumentSerif.className}`}>{t("pageTitle")}</h1>
          <p className={`mt-4 text-xl text-gray-500 dark:text-gray-400 ${instrumentSerif.className}`}>{t("pageSubtitle")}</p>
        </div>

        {/* Pricing cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Free Tier */}
          <div className="relative rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-black/8 dark:border-white/8 p-8 shadow-sm">
            <h2 className={`text-2xl ${instrumentSerif.className}`}>{t("freeTier")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("freeTierDescription")}</p>
            <div className="mt-6">
              <span className={`text-4xl ${instrumentSerif.className}`}>{t("freePrice")}</span>
              <span className="ml-1 text-sm text-muted-foreground">{t("perMonth")}</span>
            </div>
            <div className="mt-8">
              <Button variant="outline" className="w-full" disabled>
                {tier === "free" ? t("currentPlan") : t("freeTier")}
              </Button>
            </div>
            <ul className="mt-8 space-y-3">
              {FEATURE_KEYS.map((feature) => {
                const included = (FEATURES[feature] as readonly string[]).includes("free");
                return (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    {included ? <CheckIcon /> : <LockIcon />}
                    <span className={included ? "" : "text-muted-foreground/60"}>{t(feature)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-2xl bg-white/70 dark:bg-white/8 backdrop-blur-sm border-2 border-primary p-8 shadow-md">
            <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
              {t("proTier")}
            </div>
            <h2 className={`text-2xl ${instrumentSerif.className}`}>{t("proTier")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("proTierDescription")}</p>
            <div className="mt-6">
              <span className={`text-4xl ${instrumentSerif.className}`}>{t("proMonthlyPrice")}</span>
              <span className="ml-1 text-sm text-muted-foreground">{t("perMonth")}</span>
            </div>
            <div className="mt-8">
              {tier === "pro" ? (
                <Button variant="outline" className="w-full">{t("manageBilling")}</Button>
              ) : (
                <Button
                  className="w-full"
                  disabled={loadingCheckout || isLoading}
                  onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? "")}
                >
                  {loadingCheckout ? "..." : t("subscribe")}
                </Button>
              )}
            </div>
            <ul className="mt-8 space-y-3">
              {FEATURE_KEYS.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <CheckIcon />
                  <span>{t(feature)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature gating demo */}
        <div className="mt-10 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-black/8 dark:border-white/8 p-8">
          <h2 className={`text-2xl ${instrumentSerif.className}`}>{t("premiumFeatureDemo")}</h2>
          <div className="mt-4">
            {tier === "pro" ? (
              <div className="rounded-xl bg-emerald-500/10 p-6 text-center">
                <p className="text-lg font-medium text-emerald-700 dark:text-emerald-400">
                  {t("advancedAnalytics")} — {t("included")}
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-black/5 dark:bg-white/5 p-6 text-center">
                <LockIcon />
                <p className="mt-2 text-sm text-muted-foreground">{t("premiumFeatureLocked")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? "")}
                  disabled={loadingCheckout}
                >
                  {t("upgradeRequired")}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/"><Button variant="ghost">{t("backToHome")}</Button></Link>
        </div>
      </div>
      <PerspectiveGrid />
    </div>
  );
}
