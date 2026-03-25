"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { CreditCard } from "lucide-react"; // stripe-nav-icon
import { Mic } from "lucide-react"; // elevenlabs-nav-icon
import { appConfig } from "@repo/app-config";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "home", icon: <Home className="h-4 w-4" /> },
  {
    href: "/pricing",
    labelKey: "pricing",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    href: "/voice-agent",
    labelKey: "voiceAgent",
    icon: <Mic className="h-4 w-4" />,
  },
];

export function AppSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-3">
        <span className="text-sm font-semibold">{appConfig.name}</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("features")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
