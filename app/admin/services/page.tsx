"use client";

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  RefreshCcw,
  SearchX,
  Sparkles,
  Unlock,
} from "lucide-react";

import useGetServices, {
  GET_SERVICES_DEFAULT_SIZE,
} from "@/feature/service/get-services/get-services.hook";

function formatDuration(minutes: number) {
  return `${minutes.toLocaleString("vi-VN")} phút`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminServicesPage() {
  const {
    currentPage,
    errorMessage,
    goToPage,
    hasNext,
    hasPrevious,
    isLoading,
    refresh,
    services,
    totalItems,
    totalPages,
  } = useGetServices();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Quản lý dịch vụ
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-on-surface">
            Danh sách dịch vụ
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Theo dõi mã dịch vụ, thời lượng, giá và trạng thái đang hoạt động
            của từng dịch vụ trong hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/35 bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-sm transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw size={17} strokeWidth={2.4} aria-hidden="true" />
          Tải lại
        </button>
      </div>


      <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-outline-variant/15 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-extrabold text-on-surface">
              Dịch vụ
            </h3>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-primary">
            Trang {currentPage.toLocaleString("vi-VN")} /{" "}
            {totalPages.toLocaleString("vi-VN")}
          </span>
        </div>

        {errorMessage && (
          <div className="border-b border-danger/15 bg-danger/5 px-5 py-4">
            <p className="text-sm font-bold text-danger">{errorMessage}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-separate border-spacing-0 bg-white text-left">
            <thead>
              <tr>
                <th className="border-b border-outline-variant/15 px-5 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                  Mã dịch vụ
                </th>
                <th className="border-b border-outline-variant/15 px-5 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                  Tên dịch vụ
                </th>
                <th className="border-b border-outline-variant/15 px-5 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                  Thời lượng
                </th>
                <th className="border-b border-outline-variant/15 px-5 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                  Giá
                </th>
                <th className="border-b border-outline-variant/15 px-5 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading &&
                Array.from({ length: GET_SERVICES_DEFAULT_SIZE }).map((_, index) => (
                  <tr key={`service-loading-${index}`}>
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <td
                        key={`service-loading-${index}-${cellIndex}`}
                        className="border-b border-outline-variant/10 px-5 py-4"
                      >
                        <div className="h-5 w-full max-w-[180px] animate-pulse rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading &&
                services.map((service) => (
                  <tr
                    key={service.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="border-b border-outline-variant/10 px-5 py-4">
                      <span className="inline-flex rounded-full bg-primary/5 px-3 py-1 text-xs font-black text-primary">
                        {service.id}
                      </span>
                    </td>
                    <td className="border-b border-outline-variant/10 px-5 py-4">
                      <p className="font-bold text-on-surface">
                        {service.serviceName}
                      </p>
                    </td>
                    <td className="border-b border-outline-variant/10 px-5 py-4">
                      <span className="text-sm font-semibold text-on-surface-variant">
                        {formatDuration(service.durationMinutes)}
                      </span>
                    </td>
                    <td className="border-b border-outline-variant/10 px-5 py-4">
                      <span className="text-sm font-extrabold text-on-surface">
                        {formatCurrency(service.price)}
                      </span>
                    </td>
                    <td className="border-b border-outline-variant/10 px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${
                          service.isLocked
                            ? "border-slate-200 bg-slate-50 text-on-surface-variant"
                            : "border-success/20 bg-success/10 text-success"
                        }`}
                      >
                        {service.isLocked ? (
                          <Lock size={12} strokeWidth={2.6} aria-hidden="true" />
                        ) : (
                          <Unlock
                            size={12}
                            strokeWidth={2.6}
                            aria-hidden="true"
                          />
                        )}
                        {service.isLocked ? "Đang khóa" : "Đang hoạt động"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!isLoading && services.length === 0 && !errorMessage && (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-on-surface-variant">
              <SearchX size={24} strokeWidth={2.4} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-on-surface">
              Chưa có dịch vụ
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
              Hệ thống chưa trả về dịch vụ nào cho trang hiện tại.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-outline-variant/15 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-on-surface-variant">
            Trang {currentPage.toLocaleString("vi-VN")} trong{" "}
            {totalPages.toLocaleString("vi-VN")}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void goToPage(currentPage - 1)}
              disabled={isLoading || !hasPrevious}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm font-bold text-on-surface-variant transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={17} strokeWidth={2.4} aria-hidden="true" />
              Trước
            </button>
            <button
              type="button"
              onClick={() => void goToPage(currentPage + 1)}
              disabled={isLoading || !hasNext}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant/30 bg-white px-3 py-2 text-sm font-bold text-on-surface-variant transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
              <ChevronRight size={17} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
