"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

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

type PublicNavbarActionsProps = {
  initialUser: MeUserResponse | null;
};

export default function PublicNavbarActions({
  initialUser,
}: PublicNavbarActionsProps) {
  const router = useRouter();
  // const [storedUser, setStoredUser] = useState<MeUserResponse | null>(
  //   getCurrentUser() ?? initialUser
  // );
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = hasLoggedOut ? null : initialUser;

  useEffect(() => {
    if (initialUser && !getCurrentUser()) {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

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
      // setStoredUser(null);
      setHasLoggedOut(true);
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        &#272;&#259;ng nh&#7853;p
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex max-w-[56vw] items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-label="Account menu"
      >
        <span className="truncate">{user.fullName}</span>
        <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          className="cursor-pointer px-2 py-2"
          onClick={() => router.push("/admin")}
        >
          <LayoutDashboard className="size-4" aria-hidden="true" />
          Go to Dashboard
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
