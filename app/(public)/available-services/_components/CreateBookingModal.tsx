"use client";

import { SubmitEvent, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  Send,
  UserRound,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useCreateBooking from "@/feature/booking/create-booking/create-booking.hook";
import useGetAvailableStaffs from "@/feature/staff/get-available-staffs/get-available-staffs.hook";
import type {
  AvailableStaff,
  WorkSchedule,
} from "@/feature/staff/get-available-staffs/get-available-staffs.type";
import type { AvailableService } from "@/feature/service/get-available-services/get-available-services.type";

type CreateBookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  service: AvailableService | null;
};

function formatWorkSchedule(schedule: WorkSchedule) {
  return `${schedule.workDate} • ${schedule.startTime.slice(0, 5)} - ${schedule.endTime.slice(0, 5)}`;
}

function normalizeStartTime(value: string) {
  const timeValue = value.includes("T") ? value.split("T")[1] : value;
  const [hour = "", minute = "", second = "00"] = timeValue.split(":");

  if (!hour || !minute) {
    return value;
  }

  return `${hour}:${minute}:${second || "00"}`;
}

export default function CreateBookingModal({
  isOpen,
  onClose,
  service,
}: CreateBookingModalProps) {
  const [startTime, setStartTime] = useState("");
  const [staffSearchValue, setStaffSearchValue] = useState("");
  const [hasOpenedStaffPicker, setHasOpenedStaffPicker] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<AvailableStaff | null>(null);
  const [selectedStaffSchedules, setSelectedStaffSchedules] = useState<WorkSchedule[]>([]);
  const [selectedWorkScheduleId, setSelectedWorkScheduleId] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const {
    fieldErrors,
    formError,
    isSubmitting,
    successMessage,
    resetFormState,
    resetMessages,
    submitCreateBooking,
  } = useCreateBooking();
  
  const {
    currentPage,
    totalItems,
    totalPages,
    hasNext,
    hasPrevious,
    errorMessage,
    isLoading,
    staffs,
    getAvailableStaffs,
    reset,
  } = useGetAvailableStaffs();


  useEffect(() => {

    const searchStaffTimeout = setTimeout(() => {      
      void getAvailableStaffs({
        page: 1,
        searchFullName: staffSearchValue,
      });
    }, 550);

    return () => clearTimeout(searchStaffTimeout);
  }, [staffSearchValue, getAvailableStaffs]);

  function resetForm() {
    setStartTime("");
    setStaffSearchValue("");
    setHasOpenedStaffPicker(false);
    setSelectedStaff(null);
    setSelectedStaffSchedules([]);
    setSelectedWorkScheduleId("");
    setCustomerNote("");
    resetFormState();
    reset();
  }

  function closeModal() {
    onClose();
    resetForm();
  }

  function handleStaffInputFocus() {
    setHasOpenedStaffPicker(true);
    resetMessages();
  }

  function handleSelectStaff(staff: AvailableStaff) {
    setSelectedStaff(staff);
    setSelectedWorkScheduleId("");
    setStaffSearchValue(staff.fullName);
    setSelectedStaffSchedules(staff.workSchedules);
    resetMessages();
  }

  function handleStaffPageChange(page: number) {
    void getAvailableStaffs({
      page,
      searchFullName: staffSearchValue,
    });
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!service) {
      return;
    }

    const response = await submitCreateBooking({
      serviceId: String(service.id),
      staffScheduleId: selectedWorkScheduleId,
      startTime: normalizeStartTime(startTime),
      customerNote: customerNote.trim() ? customerNote.trim() : null,
    });

    if (!response) {
      return;
    }

    setStartTime("");
    setSelectedStaff(null);
    setSelectedStaffSchedules([]);
    setSelectedWorkScheduleId("");
    setCustomerNote("");
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent className="max-h-[calc(100vh-3rem)] max-w-xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-outline-variant/15 px-5 py-4">
          <DialogDescription className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            Đặt lịch dịch vụ
          </DialogDescription>
          <DialogTitle className="text-xl font-extrabold text-on-surface">
            {service?.serviceName ?? "Tạo lịch hẹn"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5"
        >
          {successMessage && (
            <Alert className="mb-5 border-success/20 bg-success/10 text-success">
              <AlertDescription className="font-bold text-success">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {formError && (
            <Alert
              variant="destructive"
              className="mb-5 border-danger/15 bg-danger/5"
            >
              <AlertDescription className="font-bold text-danger">
                {formError}
              </AlertDescription>
            </Alert>
          )}

          <FieldError message={fieldErrors.serviceId} className="mb-4" />

          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="create-booking-start-time">
                  Thời gian bắt đầu
                </Label>
                <Input
                  id="create-booking-start-time"
                  type="time"
                  step="1"
                  value={startTime}
                  onChange={(event) => {
                    setStartTime(event.target.value);
                    resetMessages();
                  }}
                  aria-invalid={Boolean(fieldErrors.startTime)}
                  className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                />
                <FieldError message={fieldErrors.startTime} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-booking-staff">
                  Nhân viên khả dụng
                </Label>
                <div className="relative">
                  <Input
                    id="create-booking-staff"
                    value={staffSearchValue}
                    onFocus={handleStaffInputFocus}
                    onClick={handleStaffInputFocus}
                    onChange={(event) => {
                      setStaffSearchValue(event.target.value);
                      setSelectedStaff(null);
                      setSelectedStaffSchedules([]);
                      setSelectedWorkScheduleId("");
                      setHasOpenedStaffPicker(true);
                      resetMessages();
                    }}
                    placeholder="Tìm theo họ tên"
                    className="h-11 bg-slate-50 pl-10 font-semibold focus-visible:bg-white"
                  />
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {hasOpenedStaffPicker && (
              <div className="rounded-xl border border-outline-variant/20 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-on-surface-variant">
                    {totalItems.toLocaleString("vi-VN")} nhân viên
                  </p>
                  {isLoading && (
                    <LoaderCircle
                      className="size-4 animate-spin text-primary"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {errorMessage && (
                  <Alert
                    variant="destructive"
                    className="mb-3 border-danger/15 bg-danger/5"
                  >
                    <AlertDescription className="font-bold text-danger">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid max-h-52 gap-2 overflow-y-auto pr-1">
                  {!isLoading &&
                    staffs.map((staff) => (
                      <button
                        key={staff.id}
                        type="button"
                        onClick={() => handleSelectStaff(staff)}
                        className={
                          selectedStaff?.id === staff.id
                            ? "rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-left transition"
                            : "rounded-lg border border-outline-variant/20 bg-white px-3 py-2 text-left transition hover:border-primary/25 hover:bg-primary/5"
                        }
                      >
                        <span className="flex items-center gap-2 font-extrabold text-on-surface">
                          <UserRound className="size-4 text-primary" />
                          {staff.fullName}
                        </span>
                        <span className="mt-1 block text-xs font-semibold text-on-surface-variant">
                          {staff.email} • {staff.workSchedules.length} lịch làm
                          việc
                        </span>
                      </button>
                    ))}

                  {!isLoading && staffs.length === 0 && !errorMessage && (
                    <div className="rounded-lg border border-dashed border-outline-variant/30 bg-white px-3 py-5 text-center text-sm font-semibold text-on-surface-variant">
                      Không tìm thấy nhân viên khả dụng.
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-outline-variant/20 pt-3">
                  <p className="text-xs font-bold text-on-surface-variant">
                    Trang {currentPage.toLocaleString("vi-VN")} /{" "}
                    {totalPages.toLocaleString("vi-VN")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleStaffPageChange(currentPage - 1)}
                      disabled={isLoading || !hasPrevious}
                      className="font-bold"
                    >
                      <ChevronLeft data-icon="inline-start" />
                      Trước
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleStaffPageChange(currentPage + 1)}
                      disabled={isLoading || !hasNext}
                      className="font-bold"
                    >
                      Sau
                      <ChevronRight data-icon="inline-end" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedStaff && (
              <div className="space-y-2">
                <Label>Lịch làm việc của {selectedStaff.fullName}</Label>
                {selectedStaffSchedules.length > 0 ? (
                  <RadioGroup
                    value={selectedWorkScheduleId}
                    onValueChange={(value) => {
                      setSelectedWorkScheduleId(String(value));
                      resetMessages();
                    }}
                    className="grid gap-2"
                    aria-invalid={Boolean(fieldErrors.staffScheduleId)}
                  >
                    {selectedStaffSchedules.map((schedule) => (
                      <Label
                        key={schedule.id}
                        htmlFor={`work-schedule-${schedule.id}`}
                        className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5"
                      >
                        <RadioGroupItem
                          id={`work-schedule-${schedule.id}`}
                          value={String(schedule.id)}
                        />
                        <span className="font-bold text-on-surface">
                          {formatWorkSchedule(schedule)}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="rounded-lg border border-dashed border-outline-variant/30 bg-slate-50 px-4 py-5 text-sm font-semibold text-on-surface-variant">
                    Nhân viên này chưa có lịch làm việc khả dụng.
                  </div>
                )}
                <FieldError message={fieldErrors.staffScheduleId} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="create-booking-customer-note">
                Ghi chú khách hàng
              </Label>
              <Textarea
                id="create-booking-customer-note"
                value={customerNote}
                onChange={(event) => {
                  setCustomerNote(event.target.value);
                  resetMessages();
                }}
                maxLength={255}
                aria-invalid={Boolean(fieldErrors.customerNote)}
                placeholder="Nhập yêu cầu hoặc ghi chú thêm"
                className="min-h-28 resize-y bg-slate-50 font-semibold leading-6 focus-visible:bg-white"
              />
              <FieldError message={fieldErrors.customerNote} />
              <p className="text-xs font-semibold text-on-surface-variant">
                {customerNote.length.toLocaleString("vi-VN")} / 255
              </p>
            </div>
          </div>

          <DialogFooter className="mx-0 mb-0 mt-6 rounded-none border-t border-outline-variant/15 bg-muted/40 p-0 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
              className="font-bold"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="font-bold">
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" data-icon="inline-start" />
              ) : (
                <Send data-icon="inline-start" />
              )}
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
