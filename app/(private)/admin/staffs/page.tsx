"use client";

import { SubmitEvent, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  PlusCircle,
  RefreshCcw,
  Search,
  SearchX,
  Unlock,
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
import useGetStaffs, {
  GET_STAFFS_DEFAULT_SIZE,
} from "@/feature/staff/get-staffs/get-staffs.hook";

import CreateStaffModal from "./_components/CreateStaffModal";

export default function AdminStaffsPage() {

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    currentPage,
    errorMessage,
    hasNext,
    hasPrevious,
    isLoading,
    pageSize,
    staffs,
    totalItems,
    totalPages,
    goToPage,
    refresh,
    search,
  } = useGetStaffs(searchValue);

  async function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    await search(searchValue);
  }

  async function handleClearSearch() {
    setSearchValue("");
    setSuccessMessage("");
    await search("");
  }

  function handleCreateStaffCreated(message: string) {
    setSuccessMessage(message);
    refresh();
    setIsCreateModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Quản lý nhân viên
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-on-surface">
            Danh sách nhân viên
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Theo dõi mã nhân viên, thông tin liên hệ và trạng thái tài
            khoản của từng nhân viên trong hệ thống.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setSuccessMessage("");
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
              setIsCreateModalOpen(true);
            }}
            className="font-bold"
          >
            <PlusCircle data-icon="inline-start" />
            Tạo nhân viên
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

      <Card>
        <CardHeader className="pb-3">
          <div>
            <CardTitle className="font-extrabold text-on-surface">
              Bộ lọc
            </CardTitle>
            <CardDescription className="mt-1 font-semibold text-on-surface-variant">
              Tìm nhân viên theo họ tên.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => void handleSearch(event)}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                size={18}
                aria-hidden="true"
              />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Nhập tên nhân viên"
                className="h-11 bg-slate-50 pl-10 pr-10 text-sm font-semibold"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 rounded-md p-1 text-on-surface-variant transition hover:bg-slate-100 hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  aria-label="Xóa nội dung tìm kiếm"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="flex-1 font-bold sm:flex-none"
              >
                <Search data-icon="inline-start" />
                Tìm kiếm
              </Button>
              {searchValue && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => void handleClearSearch()}
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
              Nhân viên
            </CardTitle>
            <CardDescription className="mt-1 font-semibold text-on-surface-variant">
              Tổng cộng {totalItems.toLocaleString("vi-VN")} nhân viên
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
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Mã nhân viên
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Tên nhân viên
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Email
                </TableHead>
                <TableHead className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: GET_STAFFS_DEFAULT_SIZE }).map(
                  (_, rowIndex) => (
                    <TableRow key={`staff-loading-${rowIndex}`}>
                      {Array.from({ length: 5 }).map((__, cellIndex) => (
                        <TableCell
                          key={`staff-loading-${rowIndex}-${cellIndex}`}
                          className="px-5 py-4"
                        >
                          <Skeleton className="h-5 w-full max-w-[180px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                )}

              {!isLoading &&
                staffs.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className="border-primary/15 bg-primary/5 font-black text-primary"
                      >
                        {staff.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <p className="font-bold text-on-surface">
                        {staff.fullName}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="font-semibold text-on-surface-variant">
                        {staff.email}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={
                          staff.isLocked
                            ? "border-slate-200 bg-slate-50 font-black uppercase text-on-surface-variant"
                            : "border-success/20 bg-success/10 font-black uppercase text-success"
                        }
                      >
                        {staff.isLocked ? (
                          <Lock aria-hidden="true" />
                        ) : (
                          <Unlock aria-hidden="true" />
                        )}
                        {staff.isLocked ? "Đang khóa" : "Đang hoạt động"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {!isLoading && staffs.length === 0 && !errorMessage && (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <SearchX size={24} strokeWidth={2.4} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-on-surface">
                Không có nhân viên
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
                Hệ thống chưa trả về nhân viên nào cho bộ lọc hoặc trang hiện tại.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-outline-variant/15 bg-muted/40 px-5 py-4 sm:flex-row sm:justify-between">
          <p className="text-sm font-semibold text-on-surface-variant">
            Hiển thị {pageSize.toLocaleString("vi-VN")} nhân viên mỗi trang
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

      <CreateStaffModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreateStaffCreated}
      />
    </div>
  );
}
