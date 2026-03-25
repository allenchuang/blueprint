import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/use-subscription";
import { FEATURES, type FeatureKey } from "@/lib/features";

const stripeEnabled = Boolean(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const FEATURE_KEYS: FeatureKey[] = [
  "basicAnalytics",
  "advancedAnalytics",
  "exportData",
  "prioritySupport",
  "customBranding",
];

export default function PricingScreen() {
  const { t } = useTranslation();
  const { tier, isLoading } = useSubscription();

  if (!stripeEnabled) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-xl font-bold">{t("notConfiguredTitle")}</Text>
        <Text className="mt-2 text-center text-gray-500">
          {t("notConfiguredMessage")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-950">
      <View className="p-6 pt-12">
        <Text className="text-center text-3xl font-bold">{t("pageTitle")}</Text>
        <Text className="mt-2 text-center text-gray-500">{t("pageSubtitle")}</Text>

        {/* Free Tier */}
        <View className="mt-8 rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
          <Text className="text-lg font-semibold">{t("freeTier")}</Text>
          <Text className="mt-1 text-sm text-gray-500">{t("freeTierDescription")}</Text>
          <Text className="mt-4 text-3xl font-bold">
            {t("freePrice")}
            <Text className="text-base font-normal text-gray-500">{t("perMonth")}</Text>
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-xl border border-gray-300 px-6 py-3 dark:border-gray-700"
            disabled
          >
            <Text className="text-center font-medium text-gray-400">
              {tier === "free" ? t("currentPlan") : t("freeTier")}
            </Text>
          </TouchableOpacity>
          <View className="mt-6 space-y-3">
            {FEATURE_KEYS.map((feature) => {
              const included = (FEATURES[feature] as readonly string[]).includes("free");
              return (
                <View key={feature} className="flex-row items-center gap-3 py-1">
                  <Text className={included ? "text-emerald-500" : "text-gray-300"}>
                    {included ? "✓" : "✕"}
                  </Text>
                  <Text className={included ? "text-sm" : "text-sm text-gray-400"}>
                    {t(feature)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Pro Tier */}
        <View className="mt-6 rounded-2xl border-2 border-blue-500 p-6">
          <View className="mb-2 self-start rounded-full bg-blue-500 px-3 py-1">
            <Text className="text-xs font-semibold text-white">{t("proTier")}</Text>
          </View>
          <Text className="text-lg font-semibold">{t("proTier")}</Text>
          <Text className="mt-1 text-sm text-gray-500">{t("proTierDescription")}</Text>
          <Text className="mt-4 text-3xl font-bold">
            {t("proMonthlyPrice")}
            <Text className="text-base font-normal text-gray-500">{t("perMonth")}</Text>
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-xl bg-blue-500 px-6 py-3"
            disabled={isLoading || tier === "pro"}
          >
            <Text className="text-center font-semibold text-white">
              {tier === "pro" ? t("manageBilling") : t("subscribe")}
            </Text>
          </TouchableOpacity>
          <View className="mt-6 space-y-3">
            {FEATURE_KEYS.map((feature) => (
              <View key={feature} className="flex-row items-center gap-3 py-1">
                <Text className="text-emerald-500">✓</Text>
                <Text className="text-sm">{t(feature)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
