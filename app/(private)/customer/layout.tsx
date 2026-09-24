import type { Metadata } from "next";
import Link from "next/link";

import { requireCustomer } from "@/lib/security/auth.server";

import CustomerNavigation from "./_components/CustomerNavigation";
import CustomerBookingStatusNotifications from "./_components/CustomerBookingStatusNotifications";
import CustomerNavbarActions from "./_components/CustomerNavbarActions";

export const metadata: Metadata = {
  title: "Incodetrade - Khách hàng",
};

export default async function CustomerLayout({
  children,
}: LayoutProps<"/customer">) {
  const user = await requireCustomer();

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <CustomerBookingStatusNotifications />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-outline-variant/20 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-outline-variant/15 px-6">
          <Link
            href="/customer/my-bookings"
            className="text-xl font-extrabold text-primary transition hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Incodetrade
          </Link>
        </div>

        <CustomerNavigation variant="desktop" />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 h-20 border-b border-outline-variant/20 bg-white/90 backdrop-blur">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                Customer Dashboard
              </p>

              <h1 className="mt-1 text-lg font-extrabold text-on-surface">
                Trung tâm lịch hẹn
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <CustomerNavbarActions user={user} />
            </div>
          </div>
        </header>

        <CustomerNavigation variant="mobile" />

        <section className="p-4 sm:p-6 lg:p-8">{children}</section>
      </div>
    </main>
  );
}
