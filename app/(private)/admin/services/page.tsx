"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  RefreshCcw,
  SearchX,
  Unlock,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetServices, {
  GET_SERVICES_DEFAULT_SIZE,
} from "@/feature/service/get-services/get-services.hook";
import type { Service } from "@/feature/service/get-services/get-services.type";
import useSetServiceLocking from "@/feature/service/set-service-locking/set-service-locking.hook";

import CreateServiceModal from "./_components/CreateServiceModal";
import UpdateServiceModal from "./_components/UpdateServiceModal";

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");
  const {
    currentPage,
    errorMessage,
    hasNext,
    hasPrevious,
    isLoading,
    services,
    totalItems,
    totalPages,
    refresh,
    goToPage,
  } = useGetServices();
  const {
    errorMessage: lockErrorMessage,
    isSubmitting: isSettingServiceLock,
    resetError: resetLockError,
    setServiceLocking,
    submittingServiceId,
  } = useSetServiceLocking();

  function handleCreateServiceCreated(message: string) {
    setSuccessMessage(message);
    resetLockError();
    refresh();
    setIsCreateModalOpen(false);
  }

  function handleOpenUpdateModal(serviceId: string | number) {
    setSuccessMessage("");
    resetLockError();
    setSelectedServiceId(String(serviceId));
    setIsUpdateModalOpen(true);
  }

  function handleUpdateServiceUpdated(message: string) {
    setSuccessMessage(message);
    resetLockError();
    refresh();
    setIsUpdateModalOpen(false);
    setSelectedServiceId(null);
  }

  function handleCloseUpdateModal() {
    setIsUpdateModalOpen(false);
    setSelectedServiceId(null);
  }

  async function handleSetServiceLocking(service: Service) {
    const nextIsLocked = !service.isLocked;

    setSuccessMessage("");

    const message = await setServiceLocking({
      serviceId: String(service.id),
      isLocked: nextIsLocked ? "true" : "false",
    });

    if (!message) {
      return;
    }

    setSuccessMessage(message);
    refresh();
  }

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

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setSuccessMessage("");
              resetLockError();
              refresh();
            }}
            disabled={isLoading}
            className="font-bold text-primary"
          >
            <RefreshCcw data-icon="inline-start" />
            Tải lại
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={() => {
              setSuccessMessage("");
              resetLockError();
              setIsCreateModalOpen(true);
            }}
            className="font-bold"
          >
            <PlusCircle data-icon="inline-start" />
            Tạo dịch vụ
          </Button>
        </div>
      </div>

      {successMessage && (
        <Alert className="border-success/20 bg-success/10 text-success">
          <AlertDescription className="font-bold text-success">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {lockErrorMessage && (
        <Alert variant="destructive" className="border-danger/15 bg-danger/5">
          <AlertDescription className="font-bold text-danger">
            {lockErrorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card className="gap-0 py-0">
        <CardHeader className="border-b border-outline-variant/15 py-4">
          <div>
            <CardTitle className="font-extrabold text-on-surface">
              Dịch vụ
            </CardTitle>
            <CardDescription className="mt-1 font-semibold text-on-surface-variant">
              Tổng cộng {totalItems.toLocaleString("vi-VN")} dịch vụ
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
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Mã dịch vụ
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Tên dịch vụ
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Thời lượng
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Giá
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Trạng thái
                </TableHead>
                <TableHead className="px-5 py-4 text-right text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: GET_SERVICES_DEFAULT_SIZE }).map(
                  (_, index) => (
                    <TableRow key={`service-loading-${index}`}>
                      {Array.from({ length: 6 }).map((__, cellIndex) => (
                        <TableCell
                          key={`service-loading-${index}-${cellIndex}`}
                          className="px-5 py-4"
                        >
                          <Skeleton className="h-5 w-full max-w-[180px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                )}

              {!isLoading &&
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className="border-primary/15 bg-primary/5 font-black text-primary"
                      >
                        {service.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <p className="font-bold text-on-surface">
                        {service.serviceName}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="font-semibold text-on-surface-variant">
                        {formatDuration(service.durationMinutes)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="font-extrabold text-on-surface">
                        {formatCurrency(service.price)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={
                          service.isLocked
                            ? "border-slate-200 bg-slate-50 font-black uppercase text-on-surface-variant"
                            : "border-success/20 bg-success/10 font-black uppercase text-success"
                        }
                      >
                        {service.isLocked ? (
                          <Lock aria-hidden="true" />
                        ) : (
                          <Unlock aria-hidden="true" />
                        )}
                        {service.isLocked ? "Đang khóa" : "Đang hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-lg"
                              aria-label={`Mở thao tác dịch vụ ${service.serviceName}`}
                            />
                          }
                        >
                          <MoreHorizontal aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44"
                          sideOffset={8}
                        >
                          <DropdownMenuItem
                            onClick={() => handleOpenUpdateModal(service.id)}
                            className="font-bold"
                          >
                            <Pencil aria-hidden="true" />
                            Cập nhật
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => void handleSetServiceLocking(service)}
                            disabled={isSettingServiceLock}
                            className={
                              service.isLocked
                                ? "font-bold text-success"
                                : "font-bold text-on-surface"
                            }
                          >
                            {submittingServiceId === String(service.id) ? (
                              <LoaderCircle
                                className="animate-spin"
                                aria-hidden="true"
                              />
                            ) : service.isLocked ? (
                              <Unlock aria-hidden="true" /> 
                            ) : (
                              <Lock aria-hidden="true" />
                            )}
                            {submittingServiceId === String(service.id)
                              ? "Đang xử lý"
                              : service.isLocked
                                ? "Mở khóa"
                                : "Khóa"
                            }
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {!isLoading && services.length === 0 && !errorMessage && (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
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
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-outline-variant/15 bg-muted/40 px-5 py-4 sm:flex-row sm:justify-between">
          <p className="text-sm font-semibold text-on-surface-variant">
            Trang {currentPage.toLocaleString("vi-VN")} trong{" "}
            {totalPages.toLocaleString("vi-VN")}
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

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreateServiceCreated}
      />
      <UpdateServiceModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onUpdated={handleUpdateServiceUpdated}
        serviceId={selectedServiceId}
      />
    </div>
  );
}
