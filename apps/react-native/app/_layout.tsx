import "../global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { useScreenTracking } from "@/hooks/use-screen-tracking";
import { elevenlabsEnabled } from "@/lib/elevenlabs";
import { dynamicEnabled } from "@/lib/dynamic";
import { privyEnabled, PRIVY_APP_ID, PRIVY_CLIENT_ID } from "@/lib/privy";

const queryClient = new QueryClient();

const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const merchantId = process.env.EXPO_PUBLIC_MERCHANT_IDENTIFIER;

function StripeWrapper({ children }: { children: React.ReactNode }) {
  if (!stripeKey) return <>{children}</>;

  const { StripeProvider } = require("@stripe/stripe-react-native");
  return (
    <StripeProvider
      publishableKey={stripeKey}
      merchantIdentifier={merchantId}
      urlScheme="blueprint"
    >
      {children}
    </StripeProvider>
  );
}

function DynamicWrapper({ children }: { children: React.ReactNode }) {
  if (!dynamicEnabled) return <>{children}</>;

  const { DynamicWebView } = require("@dynamic-labs/react-native-extension");
  const { getDynamicClient } = require("@/lib/dynamic-client");
  const dynamicClient = getDynamicClient();
  return (
    <>
      {children}
      <DynamicWebView client={dynamicClient} />
    </>
  );
}

function PrivyWrapper({ children }: { children: React.ReactNode }) {
  if (!privyEnabled) return <>{children}</>;

  const { PrivyProvider } = require("@privy-io/expo");
  return (
    <PrivyProvider appId={PRIVY_APP_ID} clientId={PRIVY_CLIENT_ID || undefined}>
      {children}
    </PrivyProvider>
  );
}

function ElevenLabsWrapper({ children }: { children: React.ReactNode }) {
  if (!elevenlabsEnabled) return <>{children}</>;

  const { ElevenLabsProvider } = require("@elevenlabs/react-native");
  return <ElevenLabsProvider>{children}</ElevenLabsProvider>;
}

function AppLayout() {
  useScreenTracking();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <DynamicWrapper>
          <PrivyWrapper>
            <StripeWrapper>
              <ElevenLabsWrapper>
                <AppLayout />
              </ElevenLabsWrapper>
            </StripeWrapper>
          </PrivyWrapper>
        </DynamicWrapper>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
