---
name: feature-gating
description: Feature gating and paywall patterns for subscription-based access control. Use when implementing, reviewing, or modifying feature gates, tier checks, upgrade prompts, or subscription-based access control in web or mobile apps.
---

This skill guides implementation of feature gating tied to subscription tiers. It covers the tier config, server middleware, client hooks, UI patterns, and common pitfalls.

## Tier Architecture

Define tiers and feature access in `lib/features.ts` (shared across web and mobile):

```typescript
export type Tier = "free" | "pro";

export const FEATURES = {
  basicAnalytics: ["free", "pro"],
  advancedAnalytics: ["pro"],
  exportData: ["pro"],
  prioritySupport: ["pro"],
  customBranding: ["pro"],
} as const;

export function hasFeature(tier: Tier, feature: FeatureKey): boolean {
  return FEATURES[feature].includes(tier);
}
```

To add a new tier (e.g., "enterprise"), add it to the `Tier` type and update the `FEATURES` map. No other code changes needed.

## Server Middleware Pattern (Fastify)

```typescript
async function requireTier(tier: Tier) {
  return async (request, reply) => {
    const userTier = await getUserTier(request.userId);
    if (!tierMeetRequirement(userTier, tier)) {
      return reply.status(403).send({
        error: "upgrade_required",
        requiredTier: tier,
      });
    }
  };
}

// Usage in route:
app.get("/api/analytics/advanced", {
  preHandler: [authenticate, requireTier("pro")],
}, handler);
```

## Client Hook Pattern

```typescript
const { tier, isProUser, hasFeature } = useSubscription();
```

- Returns `{ tier: "free", hasFeature: () => true }` when Stripe is unconfigured (no env vars)
- Uses React Query with `staleTime: 60_000` and `refetchOnWindowFocus: true`
- Query key: `["subscription-status"]`

## UI Component Patterns

### FeatureGate wrapper
```tsx
function FeatureGate({ feature, children, fallback }) {
  const { hasFeature } = useSubscription();
  return hasFeature(feature) ? children : (fallback ?? <UpgradePrompt />);
}
```

### Soft gate (lock icon overlay)
Show the feature with a lock icon and "Upgrade to Pro" badge. Clicking opens the pricing page.

### Hard gate (hidden)
Completely hide the feature for free-tier users. Use `hasFeature()` in the parent component.

### Upgrade prompt
Link to `/pricing` with a compelling message about what the user unlocks.

## Common Pitfalls

- **Never gate solely on the client** — always verify server-side for protected resources
- **Handle grace periods** — when `cancelAtPeriodEnd` is true, the user retains access until `currentPeriodEnd`
- **Cache with short TTL** — subscription status should refetch on focus, not be stale for minutes
- **Default to unlocked** — when Stripe is unconfigured or the query fails, don't lock users out
- **Don't block the app** — if subscription check is loading, show the app in free-tier mode, don't show a loading spinner

## Testing Feature Gates

Mock subscription status in tests:

```typescript
jest.mock("@/hooks/use-subscription", () => ({
  useSubscription: () => ({
    tier: "pro",
    isProUser: true,
    hasFeature: () => true,
    isLoading: false,
    subscription: { status: "active" },
  }),
}));
```
