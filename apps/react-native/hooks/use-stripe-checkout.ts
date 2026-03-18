import { useState, useCallback } from "react";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const isAvailable = Boolean(stripeKey) && Boolean(API_URL);

  const checkout = useCallback(
    async (amount: number, currency = "usd") => {
      if (!isAvailable) {
        Alert.alert("Not Available", "Stripe is not configured for this environment.");
        return;
      }

      setLoading(true);
      try {
        // Dynamically import to avoid crash if package isn't linked
        const { useStripe } = require("@stripe/stripe-react-native");
        const { initPaymentSheet, presentPaymentSheet } = useStripe();

        const res = await fetch(`${API_URL}/api/stripe/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency }),
        });
        const { clientSecret, customer } = await res.json();

        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          customerId: customer,
          merchantDisplayName: "Mastermind",
          returnURL: "mastermind://stripe-redirect",
        });

        if (initError) {
          Alert.alert("Error", initError.message);
          return;
        }

        const { error: presentError } = await presentPaymentSheet();
        if (presentError) {
          Alert.alert(`Error: ${presentError.code}`, presentError.message);
        } else {
          Alert.alert("Success", "Your payment was successful!");
        }
      } catch (err) {
        Alert.alert("Error", "Something went wrong with payment.");
      } finally {
        setLoading(false);
      }
    },
    [isAvailable]
  );

  return { checkout, loading, isAvailable };
}
