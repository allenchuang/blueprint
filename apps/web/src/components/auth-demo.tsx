"use client";

import { useTranslation } from "react-i18next";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { dynamicEnabled } from "@/lib/dynamic";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { privyEnabled } from "@/lib/privy";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

function DynamicAuthDemoInner() {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const { handleLogOut, setShowAuthFlow } = useDynamicContext();

  if (isLoggedIn && user) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
        <p className="text-sm text-gray-500">{t("loggedInAs")}</p>
        <p className="font-medium">{user.email}</p>
        <Button variant="outline" onClick={handleLogOut}>
          {t("logout")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={() => setShowAuthFlow(true)}>
        {t("login")}
      </Button>
    </div>
  );
}

function PrivyAuthDemoInner() {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const { logout } = usePrivy();
  const { login } = useLogin();

  if (isLoggedIn && user) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
        <p className="text-sm text-gray-500">{t("loggedInAs")}</p>
        <p className="font-medium">{user.email}</p>
        <Button variant="outline" onClick={logout}>
          {t("logout")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={login}>
        {t("login")}
      </Button>
    </div>
  );
}

export function AuthDemo() {
  const { t } = useTranslation();

  if (dynamicEnabled) return <DynamicAuthDemoInner />; // dynamic-auth-render
  if (privyEnabled) return <PrivyAuthDemoInner />; // privy-auth-render

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
      <p className="font-medium">{t("authNotConfigured")}</p>
      <p className="text-sm text-gray-500">{t("authNotConfiguredHint")}</p>
    </div>
  );
}
