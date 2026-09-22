"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  RefreshCcw,
  SearchX,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetStaffSchedules, {
  GET_STAFF_SCHEDULES_DEFAULT_SIZE,
} from "@/feature/staff/get-staff-schedules/get-staff-schedules.hook";

type StaffSchedulesPageClientProps = {
  staffId: string;
};

export default function StaffSchedulesPageClient({
  staffId,
}: StaffSchedulesPageClientProps) {
  const {
    currentPage,
    errorMessage,
    goToPage,
    hasNext,
    hasPrevious,
    isLoading,
    pageSize,
    refresh,
    schedules,
    totalItems,
    totalPages,
  } = useGetStaffSchedules(staffId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/admin/staffs" />}
            className="mb-4 w-fit font-bold text-primary"
          >
            <ArrowLeft data-icon="inline-start" />
            Quay lại
          </Button>

          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Quản lý lịch làm việc
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-on-surface">
            Lịch làm việc của nhân viên #{staffId}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Theo dõi ngày làm việc, giờ bắt đầu và giờ kết thúc của nhân viên
            theo thứ tự lịch làm việc.
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

      <Card className="gap-0 py-0">
        <CardHeader className="border-b border-outline-variant/15 py-4">
          <div>
            <CardTitle className="font-extrabold text-on-surface">
              Lịch làm việc
            </CardTitle>
            <CardDescription className="mt-1 font-semibold text-on-surface-variant">
              Tổng cộng {totalItems.toLocaleString("vi-VN")} lịch làm việc
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
            <Alert
              variant="destructive"
              className="border-danger/15 bg-danger/5"
            >
              <AlertDescription className="font-bold text-danger">
                {errorMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="px-0">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Mã lịch làm việc
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Ngày làm việc
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Giờ bắt đầu
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Giờ kết thúc
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: GET_STAFF_SCHEDULES_DEFAULT_SIZE }).map(
                  (_, rowIndex) => (
                    <TableRow key={`staff-schedule-loading-${rowIndex}`}>
                      {Array.from({ length: 4 }).map((__, cellIndex) => (
                        <TableCell
                          key={`staff-schedule-loading-${rowIndex}-${cellIndex}`}
                          className="px-5 py-4"
                        >
                          <Skeleton className="h-5 w-full max-w-[180px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                )}

              {!isLoading &&
                schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className="border-primary/15 bg-primary/5 font-black text-primary"
                      >
                        {schedule.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 font-bold text-on-surface">
                        <CalendarDays
                          size={16}
                          strokeWidth={2.3}
                          className="text-primary"
                          aria-hidden="true"
                        />
                        {schedule.workDate}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 font-semibold text-on-surface-variant">
                        <Clock3
                          size={16}
                          strokeWidth={2.3}
                          className="text-primary-teal"
                          aria-hidden="true"
                        />
                        {schedule.startTime}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 font-semibold text-on-surface-variant">
                        <Clock3
                          size={16}
                          strokeWidth={2.3}
                          className="text-primary-indigo"
                          aria-hidden="true"
                        />
                        {schedule.endTime}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {!isLoading && schedules.length === 0 && !errorMessage && (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <SearchX size={24} strokeWidth={2.4} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-on-surface">
                Chưa có lịch làm việc
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
                Hệ thống chưa trả về lịch làm việc nào cho nhân viên này.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-outline-variant/15 bg-muted/40 px-5 py-4 sm:flex-row sm:justify-between">
          <p className="text-sm font-semibold text-on-surface-variant">
            Hiển thị {pageSize.toLocaleString("vi-VN")} lịch làm việc mỗi trang
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
