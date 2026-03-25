import { useQuery } from "@tanstack/react-query";
import { hasFeature, type FeatureKey, type Tier } from "@/lib/features";

interface SubscriptionStatus {
  tier: Tier;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const stripeEnabled = Boolean(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function useSubscriptionQuery() {
  return useQuery<SubscriptionStatus>({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/stripe/subscription-status`);
      if (!res.ok) throw new Error("Failed to fetch subscription status");
      return res.json();
    },
    enabled: stripeEnabled && Boolean(API_URL),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useSubscription() {
  const query = useSubscriptionQuery();

  if (!stripeEnabled) {
    return {
      tier: "free" as Tier,
      isProUser: false,
      hasFeature: (_feature: FeatureKey) => true,
      isLoading: false,
      subscription: null,
    };
  }

  const tier: Tier = query.data?.tier ?? "free";

  return {
    tier,
    isProUser: tier === "pro",
    hasFeature: (feature: FeatureKey) => hasFeature(tier, feature),
    isLoading: query.isLoading,
    subscription: query.data ?? null,
  };
}
