"use client";

import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCcw,
  Search,
  SearchX,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGetAvailableServices, {
  GET_AVAILABLE_SERVICES_DEFAULT_SIZE,
} from "@/feature/service/get-available-services/get-available-services.hook";
import type { AvailableService } from "@/feature/service/get-available-services/get-available-services.type";

import CreateBookingModal from "./CreateBookingModal";
import { ServiceCard, ServiceCardSkeleton } from "./ServiceCard";

export default function AvailableServicesBody() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedService, setSelectedService] =
    useState<AvailableService | null>(null);
  const {
    currentPage,
    errorMessage,
    goToPage,
    hasNext,
    hasPrevious,
    isLoading,
    refresh,
    search,
    services,
    totalItems,
    totalPages,
  } = useGetAvailableServices();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search(searchValue);
  }

  function handleOpenBookingModal(service: AvailableService) {
    setSelectedService(service);
  }

  function handleCloseBookingModal() {
    setSelectedService(null);
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              Get Available Services
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-on-surface sm:text-5xl">
              Chọn dịch vụ phù hợp và bắt đầu đặt lịch.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-on-surface-variant">
              Danh sách chỉ hiển thị các dịch vụ đang mở, kèm thời lượng và chi
              phí để bạn so sánh nhanh trước khi gửi yêu cầu.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="rounded-2xl border border-outline-variant/20 bg-white p-4 shadow-sm"
          >
            <label
              htmlFor="service-search"
              className="text-sm font-bold text-on-surface"
            >
              Tìm theo tên dịch vụ
            </label>
            <div className="mt-3 flex gap-2">
              <Input
                id="service-search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Nhập tên dịch vụ"
                className="h-11 bg-slate-50 px-4 font-semibold"
              />
              <Button
                type="submit"
                size="icon-lg"
                aria-label="Tìm dịch vụ"
                disabled={isLoading}
                className="size-11 shrink-0"
              >
                <Search className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-on-surface">
              Dịch vụ khả dụng
            </h2>
            <p className="mt-1 text-sm font-semibold text-on-surface-variant">
              Tổng cộng {totalItems.toLocaleString("vi-VN")} dịch vụ
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={refresh}
            disabled={isLoading}
            className="h-10 gap-2 font-bold text-primary"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" data-icon="inline-start" />
            ) : (
              <RefreshCcw data-icon="inline-start" />
            )}
            Tải lại
          </Button>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mb-5 border-danger/15 bg-danger/5">
            <AlertDescription className="font-bold text-danger">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoading &&
            Array.from({ length: GET_AVAILABLE_SERVICES_DEFAULT_SIZE }).map(
              (_, index) => (
                <ServiceCardSkeleton key={`available-service-loading-${index}`} />
              )
            )}

          {!isLoading &&
            services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleOpenBookingModal}
              />
            ))}
        </div>

        {!isLoading && services.length === 0 && !errorMessage && (
          <div className="rounded-2xl border border-outline-variant/20 bg-white px-5 py-14 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <SearchX className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-on-surface">
              Chưa có dịch vụ khả dụng
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
              Hệ thống chưa trả về dịch vụ đang mở cho bộ lọc hiện tại.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-outline-variant/20 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-on-surface-variant">
            Trang {currentPage.toLocaleString("vi-VN")} /{" "}
            {totalPages.toLocaleString("vi-VN")}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={isLoading || !hasPrevious}
              className="font-bold"
            >
              <ChevronLeft data-icon="inline-start" />
              Trước
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={isLoading || !hasNext}
              className="font-bold"
            >
              Sau
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      <CreateBookingModal
        isOpen={Boolean(selectedService)}
        onClose={handleCloseBookingModal}
        service={selectedService}
      />
    </>
  );
}
