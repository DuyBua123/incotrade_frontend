import PublicNavbarActions from "@/app/(public)/_components/PublicNavbarActions";
import { getMeServer } from "@/lib/security/auth.server";
import Link from "next/link";

import AvailableServicesBody from "./_components/AvailableServicesBody";

export default async function AvailableServicesPage() {
  const currentUser = await getMeServer();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f9ff_0%,#ffffff_34%,#f7f9ff_100%)] text-on-surface">
      <nav className="sticky top-0 z-50 border-b border-outline-variant/20 bg-white/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-4 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="text-lg font-extrabold text-primary transition hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Incodetrade
          </Link>

          <div className="flex justify-center">
            <Link
              href="/available-services"
              className="rounded-lg bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Dịch vụ
            </Link>
          </div>

          <div className="flex justify-end">
            <PublicNavbarActions
              initialUser={currentUser?.user ? currentUser.user : null}
            />
          </div>
        </div>
      </nav>

      <AvailableServicesBody />
    </main>
  );
}
