"use client";

import type { SubmitEvent } from "react";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetBookings, {
  GET_BOOKINGS_DEFAULT_SIZE,
} from "@/feature/booking/get-bookings/get-bookings.hook";
import {
  BOOKING_STATUS_VALUES,
  type BookingStatus,
  type GetBookingsFilters,
} from "@/feature/booking/get-bookings/get-bookings.type";

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

function getStatusLabel(status: string) {
  const normalizedStatus = status.toUpperCase() as BookingStatus;

  return STATUS_LABELS[normalizedStatus] ?? status;
}

function getStatusBadgeClassName(status: string) {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === "CONFIRMED") {
    return "border-booking-green/20 bg-booking-green/10 text-booking-green";
  }

  if (normalizedStatus === "COMPLETED") {
    return "border-success/20 bg-success/10 text-success";
  }

  if (normalizedStatus === "CANCELLED") {
    return "border-danger/20 bg-danger/10 text-danger";
  }

  return "border-warning/25 bg-warning/10 text-amber-700";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

function getBookingNote(
  customerNote: string | null,
  cancellationReason: string | null
) {
  if (cancellationReason) {
    return cancellationReason;
  }

  if (customerNote) {
    return customerNote;
  }

  return "Không có ghi chú";
}


export default function AdminBookingsPage() {
  const {
    activeFilters,
    bookings,
    currentPage,
    errorMessage,
    hasNext,
    hasPrevious,
    isLoading,
    pageSize,
    totalItems,
    totalPages,
    clearFilters,
    filter,
    goToPage,
    refresh,
  } = useGetBookings();
  const [servedDate, setServedDate] = useState(activeFilters.servedDate);
  const [status, setStatus] = useState<GetBookingsFilters["status"]>(activeFilters.status);

  async function handleFilter(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    await filter({ servedDate, status });
  }

  async function handleClearFilters() {
    setServedDate("");
    setStatus("");
    await clearFilters();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Quản lý Booking
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-on-surface">
            Quản lý lịch hẹn
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Theo dõi toàn bộ lịch hẹn theo khách hàng, dịch vụ, nhân viên phụ
            trách, thời gian phục vụ và trạng thái xử lý.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={refresh}
          disabled={isLoading}
          className="font-bold text-primary"
        >
          <RefreshCcw data-icon="inline-start" />
          Tải lại
        </Button>
      </div>

      

      <Card>
        <CardHeader className="pb-3">
          <div>
            <CardTitle className="flex items-center gap-2 font-extrabold text-on-surface">
              <SlidersHorizontal
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Bộ lọc
            </CardTitle>
            <CardDescription className="mt-1 font-semibold text-on-surface-variant">
              Lọc lịch hẹn theo ngày phục vụ hoặc trạng thái.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(event) => void handleFilter(event)}
            className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_auto]"
          >
            <div>
              <label
                htmlFor="admin-booking-served-date"
                className="mb-2 block text-sm font-semibold text-on-surface-variant"
              >
                Ngày phục vụ
              </label>
              <Input
                id="admin-booking-served-date"
                type="date"
                value={servedDate}
                onChange={(event) => setServedDate(event.target.value)}
                className="h-11 bg-slate-50 px-4 text-sm font-semibold"
              />
            </div>

            <div>
              <label
                htmlFor="admin-booking-status"
                className="mb-2 block text-sm font-semibold text-on-surface-variant"
              >
                Trạng thái
              </label>
              <select
                id="admin-booking-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as GetBookingsFilters["status"])
                }
                className="h-11 w-full rounded-lg border border-input bg-slate-50 px-4 text-sm font-semibold text-on-surface outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
              >
                <option value="">Tất cả trạng thái</option>
                {BOOKING_STATUS_VALUES.map((statusValue) => (
                  <option key={statusValue} value={statusValue}>
                    {STATUS_LABELS[statusValue]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="flex-1 font-bold lg:flex-none"
              >
                <Search data-icon="inline-start" />
                Lọc
              </Button>

              {(servedDate || status) && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => void handleClearFilters()}
                  disabled={isLoading}
                  className="font-bold"
                >
                  <X data-icon="inline-start" />
                  Xóa lọc
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b border-outline-variant/15 py-4">
          <div>
            <CardTitle className="font-extrabold text-on-surface">
              Danh sách lịch hẹn
            </CardTitle>
            <CardDescription className="mt-1 font-semibold text-on-surface-variant">
              Tổng cộng {totalItems.toLocaleString("vi-VN")} lịch hẹn
            </CardDescription>
          </div>

          <CardAction>
            <Badge
              variant="outline"
              className="h-auto border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-primary"
            >
              Trang {currentPage.toLocaleString("vi-VN")} /{" "}
              {totalPages.toLocaleString("vi-VN")}
            </Badge>
          </CardAction>
        </CardHeader>

        {errorMessage && (
          <div className="border-b border-danger/15 px-4 py-4">
            <Alert variant="destructive" className="border-danger/15 bg-danger/5">
              <AlertDescription className="font-bold text-danger">
                {errorMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="px-0">
          <Table className="min-w-[1320px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Mã booking
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Khách hàng
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Ngày phục vụ
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Thời gian
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Dịch vụ
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Staff
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Trạng thái
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Ghi chú
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: GET_BOOKINGS_DEFAULT_SIZE }).map(
                  (_, rowIndex) => (
                    <TableRow key={`admin-booking-loading-${rowIndex}`}>
                      {Array.from({ length: 8 }).map((__, cellIndex) => (
                        <TableCell
                          key={`admin-booking-loading-${rowIndex}-${cellIndex}`}
                          className="px-5 py-4"
                        >
                          <Skeleton className="h-5 w-full max-w-[180px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                )}

              {!isLoading &&
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="px-5 py-4">
                      <div className="max-w-[220px] truncate font-mono text-xs font-black text-primary">
                        {booking.bookingCode}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div>
                        <p className="font-bold text-on-surface">
                          {booking.customerFullName}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-on-surface-variant">
                          ID {booking.customerId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="font-bold text-on-surface">
                        {formatDate(booking.servedDate)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="font-semibold text-on-surface-variant">
                        {formatTime(booking.startTime)} -{" "}
                        {formatTime(booking.endTime)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className="border-service-cyan/15 bg-service-cyan/10 font-black text-service-cyan"
                      >
                        {booking.serviceName}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className="border-primary-teal/15 bg-primary-teal/10 font-black text-primary-teal"
                      >
                        {booking.staffFullName}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`font-black uppercase ${getStatusBadgeClassName(
                          booking.status
                        )}`}
                      >
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="max-w-[260px] truncate text-sm font-semibold text-on-surface-variant">
                        {getBookingNote(
                          booking.customerNote,
                          booking.cancellationReason
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {!isLoading && bookings.length === 0 && !errorMessage && (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <SearchX size={24} strokeWidth={2.4} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-on-surface">
                Chưa có lịch hẹn
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
                Hệ thống chưa trả về lịch hẹn nào cho bộ lọc hoặc trang hiện
                tại.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-outline-variant/15 bg-muted/40 px-5 py-4 sm:flex-row sm:justify-between">
          <p className="text-sm font-semibold text-on-surface-variant">
            Hiển thị {pageSize.toLocaleString("vi-VN")} lịch hẹn mỗi trang
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void goToPage(currentPage - 1)}
              disabled={isLoading || !hasPrevious}
              className="font-bold"
            >
              <ChevronLeft data-icon="inline-start" />
              Trước
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void goToPage(currentPage + 1)}
              disabled={isLoading || !hasNext}
              className="font-bold"
            >
              Sau
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
