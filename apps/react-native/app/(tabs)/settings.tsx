import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { dynamicEnabled } from "@/lib/dynamic";
import { useAuth } from "@/hooks/use-auth";

function AuthSection() {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();

  if (!dynamicEnabled) {
    return (
      <View className="mx-4 mt-6 rounded-lg border border-dashed border-gray-300 p-6">
        <Text className="text-center font-medium">{t("authNotConfigured")}</Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          {t("authNotConfiguredHint")}
        </Text>
      </View>
    );
  }

  const { getDynamicClient } = require("@/lib/dynamic-client");
  const dynamicClient = getDynamicClient();

  if (isLoggedIn && user) {
    return (
      <View className="mx-4 mt-6 items-center rounded-lg border border-gray-200 p-6">
        <Text className="text-sm text-gray-500">{t("loggedInAs")}</Text>
        <Text className="mt-1 font-medium">{user.email}</Text>
        <TouchableOpacity
          className="mt-4 rounded-lg border border-gray-300 px-6 py-3"
          onPress={() => dynamicClient.auth.logout()}
        >
          <Text>{t("logout")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="mx-4 mt-6 items-center">
      <TouchableOpacity
        className="rounded-lg bg-blue-600 px-8 py-4"
        onPress={() => dynamicClient.ui.auth.show()}
      >
        <Text className="font-medium text-white">{t("login")}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">{t("settings")}</Text>
      <AuthSection />
    </View>
  );
}
