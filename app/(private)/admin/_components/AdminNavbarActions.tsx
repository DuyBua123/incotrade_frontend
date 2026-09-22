"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Home, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api/api";
import type { SuccessResponse } from "@/lib/api/success.response.";
import type { MeUserResponse } from "@/lib/security/me.response";
import {
  clearAccessToken,
  clearCurrentUser,
  getCurrentUser,
  setCurrentUser,
} from "@/lib/security/auth.store";

type AdminNavbarActionsProps = {
  user: MeUserResponse;
};

export default function AdminNavbarActions({ user }: AdminNavbarActionsProps) {
  const router = useRouter();
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayUser = hasLoggedOut ? null : getCurrentUser() ?? user;

  useEffect(() => {
    if (!getCurrentUser()) {
      setCurrentUser(user);
    }
  }, [user]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await api.post<SuccessResponse<null>>("/auth/logout", undefined, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } finally {
      clearAccessToken();
      clearCurrentUser();
      setHasLoggedOut(true);
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex max-w-[42vw] items-center gap-2 rounded-lg px-3 py-2 text-right transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:max-w-none"
        aria-label="Admin account menu"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-on-surface">
            {displayUser?.fullName || "Admin Incodetrade"}
          </span>

          <span className="block text-xs font-semibold text-on-surface-variant">
            Admin
          </span>
        </span>

        <ChevronDown className="size-4 shrink-0 text-on-surface-variant" aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          className="cursor-pointer px-2 py-2"
          onClick={() => router.push("/")}
        >
          <Home className="size-4" aria-hidden="true" />
          Go to Home
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer px-2 py-2"
          variant="destructive"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          <LogOut className="size-4" aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
