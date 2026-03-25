import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: t("pricing"),
        }}
      />
      <Tabs.Screen
        name="voice-agent"
        options={{
          title: t("voiceAgent"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
        }}
      />
    </Tabs>
  );
}
