---
name: World MiniApp Integration
overview: Add World MiniKit SDK integration to apps/web with a Cursor rule, provider scaffolding, environment config, safe-area CSS, API routes, and utility hooks so the app is out-of-the-box ready to run as a World Mini App.
todos:
  - id: install-packages
    content: pnpm add @worldcoin/minikit-js @worldcoin/minikit-react in apps/web
    status: completed
  - id: create-rule
    content: Create .cursor/rules/015-world-miniapp.mdc with comprehensive MiniKit guidelines
    status: completed
  - id: sync-rules
    content: Copy rule to .agents/rules/ and .claude/rules/
    status: completed
  - id: create-provider
    content: Create apps/web/src/components/minikit-provider.tsx
    status: completed
  - id: update-layout
    content: Wrap layout.tsx children with WorldMiniKitProvider
    status: completed
  - id: update-css
    content: "Add overscroll-behavior: none to globals.css"
    status: completed
  - id: update-env
    content: Add NEXT_PUBLIC_WORLD_APP_ID and WORLD_APP_DEV_PORTAL_API_KEY to .env.example
    status: completed
  - id: create-hook
    content: Create apps/web/src/hooks/use-minikit.ts convenience hook
    status: completed
  - id: create-api-verify
    content: Create apps/web/src/app/api/minikit/verify/route.ts
    status: completed
  - id: create-api-payment
    content: Create apps/web/src/app/api/minikit/confirm-payment/route.ts
    status: completed
  - id: create-api-nonce
    content: Create apps/web/src/app/api/minikit/nonce/route.ts
    status: completed
  - id: create-api-siwe
    content: Create apps/web/src/app/api/minikit/complete-siwe/route.ts
    status: completed
isProject: false
---

# World Mini App Integration for apps/web

## Context

World Mini Apps are web apps that run inside the World App webview. The [MiniKit SDK](https://docs.world.org/mini-apps/quick-start/installing) (`@worldcoin/minikit-js`) provides a provider and commands for wallet auth, payments, World ID verification, transactions, haptic feedback, sharing, contacts, and permissions. The app at `apps/web` is a Next.js 15 app with shadcn/ui, i18n, and mobile-first patterns already in place -- a strong foundation that needs MiniKit wiring.

---

## 1. Install packages

In `apps/web`, install:

```bash
pnpm add @worldcoin/minikit-js @worldcoin/minikit-react
```

These are the core SDK and the React hooks package (provides `useWaitForTransactionReceipt`, etc.).

---

## 2. Create the Cursor rule: `.cursor/rules/015-world-miniapp.mdc`

A new rule file (synced to `.agents/rules/` and `.claude/rules/` per rule 012) covering:

- MiniKit provider must wrap the app inside `<body>` in `layout.tsx`
- Always guard commands with `MiniKit.isInstalled()` before dispatching
- Use async command pattern (`MiniKit.commandsAsync.*`) over event listeners as default
- All proof/payment verification MUST happen server-side (Next.js API routes in `src/app/api/`)
- Respect `MiniKit.user.optedIntoOptionalAnalytics` -- disable analytics collection when false
- Use `MiniKit.user.username` for display, never raw wallet addresses
- Design guidelines: 24px padding, no footers/sidebars, no `alert()` (unsupported on iOS webview), use `100dvh` not `100vh`, set `overscroll-behavior: none`
- Safe area insets from `MiniKit.deviceProperties.safeAreaInsets` or CSS `env(safe-area-inset-*)`
- Required env vars: `NEXT_PUBLIC_WORLD_APP_ID`, `WORLD_APP_DEV_PORTAL_API_KEY`
- Haptic feedback on important interactions via `MiniKit.commands.sendHapticFeedback()`
- Share contacts returns `username` + `walletAddress` -- always show username
- Notifications require permission request first, then server-side API call
- Quick Action deep links follow schema `https://world.org/mini-app?app_id={app_id}&path={path}`
- File structure: MiniKit hooks in `src/hooks/use-minikit.ts`, API routes under `src/app/api/minikit/`

---

## 3. Scaffold: MiniKit Provider wrapper

Create `[apps/web/src/components/minikit-provider.tsx](apps/web/src/components/minikit-provider.tsx)`:

```tsx
"use client";

import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { ReactNode } from "react";

export function WorldMiniKitProvider({ children }: { children: ReactNode }) {
  return <MiniKitProvider>{children}</MiniKitProvider>;
}
```

---

## 4. Update root layout

Modify `[apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx)` to wrap children with `WorldMiniKitProvider`:

```tsx
<body className={inter.className}>
  <WorldMiniKitProvider>
    <I18nProvider>{children}</I18nProvider>
  </WorldMiniKitProvider>
</body>
```

---

## 5. Add safe-area / webview CSS

Append to `[apps/web/src/app/globals.css](apps/web/src/app/globals.css)`:

```css
html,
body {
  overscroll-behavior: none;
}
```

The viewport meta already includes `viewport-fit=cover` and `user-scalable=false`, which is correct for mini apps.

---

## 6. Add environment variables

Update `[apps/web/.env.example](apps/web/.env.example)` with:

```
# World Mini App
# Get your App ID from https://developer.worldcoin.org
NEXT_PUBLIC_WORLD_APP_ID=app_xxxxxxxxxx
# Developer Portal API key (server-side only, for verify/payment confirmation)
WORLD_APP_DEV_PORTAL_API_KEY=
```

---

## 7. Scaffold: `useMiniKit` hook

Create `[apps/web/src/hooks/use-minikit.ts](apps/web/src/hooks/use-minikit.ts)` -- a convenience hook exposing `isInstalled`, user info, device properties, and launch location from the MiniKit singleton:

```tsx
"use client";

import { MiniKit } from "@worldcoin/minikit-js";

export function useMiniKit() {
  return {
    isInstalled: MiniKit.isInstalled(),
    user: MiniKit.user,
    deviceProperties: MiniKit.deviceProperties,
    launchLocation: MiniKit.launchLocation,
  };
}
```

---

## 8. Scaffold: API route for World ID verification

Create `[apps/web/src/app/api/minikit/verify/route.ts](apps/web/src/app/api/minikit/verify/route.ts)` -- backend route that calls `verifyCloudProof` from the SDK:

```ts
import { NextRequest, NextResponse } from "next/server";
import {
  verifyCloudProof,
  ISuccessResult,
  IVerifyResponse,
} from "@worldcoin/minikit-js";

interface RequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as RequestPayload;
  const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`;
  const verifyRes = (await verifyCloudProof(
    payload,
    appId,
    action,
    signal,
  )) as IVerifyResponse;

  if (verifyRes.success) {
    return NextResponse.json({ verifyRes, status: 200 });
  }
  return NextResponse.json({ verifyRes, status: 400 });
}
```

---

## 9. Scaffold: API route for payment confirmation

Create `[apps/web/src/app/api/minikit/confirm-payment/route.ts](apps/web/src/app/api/minikit/confirm-payment/route.ts)` -- confirms payment via Developer Portal API:

```ts
import { NextRequest, NextResponse } from "next/server";
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";

export async function POST(req: NextRequest) {
  const { payload } = (await req.json()) as {
    payload: MiniAppPaymentSuccessPayload;
  };
  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.NEXT_PUBLIC_WORLD_APP_ID}&type=payment`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.WORLD_APP_DEV_PORTAL_API_KEY}`,
      },
    },
  );
  const transaction = await response.json();

  if (
    transaction.reference === payload.reference &&
    transaction.transaction_status !== "failed"
  ) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false });
}
```

---

## 10. Scaffold: API route for SIWE nonce

Create `[apps/web/src/app/api/minikit/nonce/route.ts](apps/web/src/app/api/minikit/nonce/route.ts)`:

```ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  (await cookies()).set("siwe", nonce, { secure: true });
  return NextResponse.json({ nonce });
}
```

---

## 11. Scaffold: API route for SIWE completion

Create `[apps/web/src/app/api/minikit/complete-siwe/route.ts](apps/web/src/app/api/minikit/complete-siwe/route.ts)`:

```ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  MiniAppWalletAuthSuccessPayload,
  verifySiweMessage,
} from "@worldcoin/minikit-js";

interface RequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export async function POST(req: NextRequest) {
  const { payload, nonce } = (await req.json()) as RequestPayload;
  if (nonce !== (await cookies()).get("siwe")?.value) {
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: "Invalid nonce",
    });
  }
  try {
    const validMessage = await verifySiweMessage(payload, nonce);
    return NextResponse.json({
      status: "success",
      isValid: validMessage.isValid,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "error", isValid: false, message });
  }
}
```

---

## 12. Sync rule to all three directories

Per rule 012, copy the new `.cursor/rules/015-world-miniapp.mdc` to:

- `.agents/rules/015-world-miniapp.mdc`
- `.claude/rules/015-world-miniapp.mdc`

---

## Files changed summary

| Action     | File                                                     |
| ---------- | -------------------------------------------------------- |
| **Create** | `.cursor/rules/015-world-miniapp.mdc`                    |
| **Create** | `.agents/rules/015-world-miniapp.mdc` (copy)             |
| **Create** | `.claude/rules/015-world-miniapp.mdc` (copy)             |
| **Create** | `apps/web/src/components/minikit-provider.tsx`           |
| **Create** | `apps/web/src/hooks/use-minikit.ts`                      |
| **Create** | `apps/web/src/app/api/minikit/verify/route.ts`           |
| **Create** | `apps/web/src/app/api/minikit/confirm-payment/route.ts`  |
| **Create** | `apps/web/src/app/api/minikit/nonce/route.ts`            |
| **Create** | `apps/web/src/app/api/minikit/complete-siwe/route.ts`    |
| **Edit**   | `apps/web/src/app/layout.tsx` (add MiniKitProvider)      |
| **Edit**   | `apps/web/src/app/globals.css` (add overscroll-behavior) |
| **Edit**   | `apps/web/.env.example` (add World env vars)             |
| **Edit**   | `apps/web/package.json` (via pnpm add)                   |
