"use client";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Tổng quan</p>
          <h2 className="mt-2 text-2xl font-extrabold text-on-surface">Admin Dashboard</h2>
        </div>
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
