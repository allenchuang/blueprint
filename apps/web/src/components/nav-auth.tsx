"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { LogIn, LogOut, User } from "lucide-react";
import { dynamicEnabled } from "@/lib/dynamic";
import { privyEnabled } from "@/lib/privy";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function DynamicNavAuthInner() {
  const { user, isLoggedIn } = useAuth();
  const { handleLogOut, setShowAuthFlow } = useDynamicContext();

  if (isLoggedIn && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center justify-center w-7 h-7 rounded-full bg-sky-500/20 dark:bg-sky-400/20 text-sky-700 dark:text-sky-300 hover:bg-sky-500/30 transition-colors"
            aria-label="User menu"
          >
            <User className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogOut}
            className="gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      size="xs"
      variant="outline"
      onClick={() => setShowAuthFlow(true)}
      className="gap-1.5 h-7 text-xs"
    >
      <LogIn className="h-3 w-3" />
      Login
    </Button>
  );
}

function PrivyNavAuthInner() {
  const { user, isLoggedIn } = useAuth();
  const { logout } = usePrivy();
  const { login } = useLogin();

  if (isLoggedIn && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center justify-center w-7 h-7 rounded-full bg-sky-500/20 dark:bg-sky-400/20 text-sky-700 dark:text-sky-300 hover:bg-sky-500/30 transition-colors"
            aria-label="User menu"
          >
            <User className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={logout}
            className="gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      size="xs"
      variant="outline"
      onClick={login}
      className="gap-1.5 h-7 text-xs"
    >
      <LogIn className="h-3 w-3" />
      Login
    </Button>
  );
}

export function NavAuth() {
  if (dynamicEnabled) return <DynamicNavAuthInner />; // dynamic-auth-render
  if (privyEnabled) return <PrivyNavAuthInner />; // privy-auth-render
  return null;
}
