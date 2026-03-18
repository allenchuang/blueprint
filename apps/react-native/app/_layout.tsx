import "../global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { useScreenTracking } from "@/hooks/use-screen-tracking";

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
      urlScheme="mastermind"
    >
      {children}
    </StripeProvider>
  );
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
        <StripeWrapper>
          <AppLayout />
        </StripeWrapper>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
