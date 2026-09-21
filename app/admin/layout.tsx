import Link from "next/link";
import { redirect } from "next/navigation";

import AdminNavigation from "./_components/AdminNavigation";
import { getMeServer } from "@/lib/security/auth.server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Incodetrade - Quản trị viên"
};


export default async function AdminLayout({children}: LayoutProps<"/admin">) {
  const currentUser = await getMeServer();

  // Authentication guard
  if (!currentUser) {
    redirect("/login");
  }

  const fullName = currentUser.fullName || "Admin Incodetrade";
  

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-outline-variant/20 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-outline-variant/15 px-6">
          <Link
            href="/admin"
            className="text-xl font-extrabold text-primary transition hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Incodetrade
          </Link>
        </div>

        <AdminNavigation variant="desktop" />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 h-20 border-b border-outline-variant/20 bg-white/90 backdrop-blur">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                Admin Dashboard
              </p>

              <h1 className="mt-1 text-lg font-extrabold text-on-surface">
                Quản trị hệ thống
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="max-w-[42vw] text-right sm:max-w-none">
                <p className="truncate text-sm font-bold text-on-surface">
                  {fullName}
                </p>

                <p className="text-xs font-semibold text-on-surface-variant">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        <AdminNavigation variant="mobile" />

        <section className="p-4 sm:p-6 lg:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}