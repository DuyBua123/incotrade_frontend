"use client";

import { BriefcaseBusiness, CalendarCheck, UsersRound } from "lucide-react";


const dashboardStats = [
  {
    label: "Dịch vụ",
    value: "24",
    icon: BriefcaseBusiness,
    color: "bg-service-cyan/10 text-service-cyan",
  },
  {
    label: "Staff",
    value: "12",
    icon: UsersRound,
    color: "bg-primary-teal/10 text-primary-teal",
  },
  {
    label: "Booking hôm nay",
    value: "36",
    icon: CalendarCheck,
    color: "bg-primary/10 text-primary",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Tổng quan</p>
          <h2 className="mt-2 text-2xl font-extrabold text-on-surface">Admin Dashboard</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                <Icon size={24} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-on-surface-variant/70">
                  {item.label}
                </p>
                <p className="mt-1 text-3xl font-extrabold leading-tight text-on-surface">{item.value}</p>
              </div>
            </article>
          );
        })}
      </div>

      <section className="rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-on-surface">Khu vực quản trị</p>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              Chọn một mục trong sidebar để quản lý dịch vụ, staff hoặc booking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
