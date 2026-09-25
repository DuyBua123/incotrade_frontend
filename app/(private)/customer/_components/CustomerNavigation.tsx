"use client";

import Link from "next/link";
import { CalendarCheck, Home } from "lucide-react";
import { usePathname } from "next/navigation";

const customerNavigation = [
  {
    label: "Lịch hẹn của tôi",
    href: "/customer/my-bookings",
    icon: CalendarCheck,
  },
  {
    label: "Dịch vụ",
    href: "/available-services",
    icon: Home,
  },
];

type Props = {
  variant: "desktop" | "mobile";
};

export default function CustomerNavigation({ variant }: Props) {
  const pathname = usePathname();
  const isDesktop = variant === "desktop";

  return (
    <nav
      className={
        isDesktop
          ? "flex-1 space-y-2 px-4 py-5"
          : "border-b border-outline-variant/15 bg-white px-4 py-3 lg:hidden"
      }
      aria-label={
        isDesktop ? "Customer navigation" : "Mobile customer navigation"
      }
    >
      {isDesktop && (
        <p className="px-3 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant/65">
          Customer
        </p>
      )}

      <div className={isDesktop ? "space-y-2" : "flex gap-2 overflow-x-auto"}>
        {customerNavigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                isDesktop
                  ? "min-h-12 px-3 py-3"
                  : "shrink-0 rounded-lg px-3 py-2"
              } ${
                isActive
                  ? "bg-blue-50 text-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-slate-50 hover:text-primary"
              }`}
            >
              <span
                className={`flex shrink-0 items-center justify-center rounded-lg ${
                  isDesktop ? "h-9 w-9" : "h-7 w-7"
                } ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-on-surface-variant"
                }`}
                aria-hidden="true"
              >
                <Icon
                  size={isDesktop ? 18 : 15}
                  strokeWidth={isDesktop ? 2.3 : 2.4}
                />
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
