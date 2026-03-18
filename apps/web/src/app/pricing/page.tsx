"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { stripeEnabled } from "@/lib/stripe";
import { useSubscription } from "@/hooks/use-subscription";
import { FEATURES, type FeatureKey } from "@/lib/features";

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

export default function PricingPage() {
  const { t } = useTranslation();
  const { tier, isLoading } = useSubscription();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  if (!stripeEnabled) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t("notConfiguredTitle")}</h1>
          <p className="mt-3 text-muted-foreground">{t("notConfiguredMessage")}</p>
          <Link href="/">
            <Button variant="outline" className="mt-6">
              {t("backToHome")}
            </Button>
          </Link>
        </div>
      </main>
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
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoadingCheckout(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("pageTitle")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("pageSubtitle")}</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {/* Free Tier */}
          <div className="relative rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-semibold">{t("freeTier")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("freeTierDescription")}</p>
            <div className="mt-6">
              <span className="text-4xl font-bold tracking-tight">{t("freePrice")}</span>
              <span className="text-muted-foreground">{t("perMonth")}</span>
            </div>
            <div className="mt-8">
              {tier === "free" ? (
                <Button variant="outline" className="w-full" disabled>
                  {t("currentPlan")}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  {t("freeTier")}
                </Button>
              )}
            </div>
            <ul className="mt-8 space-y-3">
              {FEATURE_KEYS.map((feature) => {
                const included = (FEATURES[feature] as readonly string[]).includes("free");
                return (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    {included ? <CheckIcon /> : <LockIcon />}
                    <span className={included ? "" : "text-muted-foreground/60"}>
                      {t(feature)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-md">
            <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
              {t("proTier")}
            </div>
            <h2 className="text-xl font-semibold">{t("proTier")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("proTierDescription")}</p>
            <div className="mt-6">
              <span className="text-4xl font-bold tracking-tight">{t("proMonthlyPrice")}</span>
              <span className="text-muted-foreground">{t("perMonth")}</span>
            </div>
            <div className="mt-8">
              {tier === "pro" ? (
                <Button variant="outline" className="w-full">
                  {t("manageBilling")}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  disabled={loadingCheckout || isLoading}
                  onClick={() =>
                    handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? "")
                  }
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
        <div className="mt-16 rounded-2xl border bg-card p-8">
          <h2 className="text-xl font-semibold">{t("premiumFeatureDemo")}</h2>
          <div className="mt-4">
            {tier === "pro" ? (
              <div className="rounded-xl bg-emerald-500/10 p-6 text-center">
                <p className="text-lg font-medium text-emerald-700 dark:text-emerald-400">
                  {t("advancedAnalytics")} — {t("included")}
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-muted p-6 text-center">
                <LockIcon />
                <p className="mt-2 text-sm text-muted-foreground">{t("premiumFeatureLocked")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? "")
                  }
                  disabled={loadingCheckout}
                >
                  {t("upgradeRequired")}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost">{t("backToHome")}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
