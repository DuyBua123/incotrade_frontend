"use client";

import { type KeyboardEvent, type SubmitEvent } from "react";
import { CalendarPlus, LoaderCircle } from "lucide-react";

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
import useCreateStaffSchedule from "@/feature/staff/create-staff-schedule/create-staff-schedule.hook";

type CreateStaffScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (message: string) => void;
  staffId: string;
};

export default function CreateStaffScheduleModal({
  isOpen,
  onClose,
  onCreated,
  staffId,
}: CreateStaffScheduleModalProps) {
  const {
    fieldErrors,
    form,
    formError,
    isSubmitting,
    resetForm,
    submitCreateStaffSchedule,
    updateField,
  } = useCreateStaffSchedule(staffId);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && !isSubmitting) {
      closeModal();
    }
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    onClose();
    resetForm();
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const successMessage = await submitCreateStaffSchedule(event);

    if (successMessage) {
      onCreated(successMessage);
    }
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
      <DialogContent
        className="max-h-[calc(100vh-3rem)] max-w-xl gap-0 overflow-hidden p-0"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader className="border-b border-outline-variant/15 px-5 py-4">
          <DialogDescription className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            Lịch làm việc mới
          </DialogDescription>
          <DialogTitle className="text-xl font-extrabold text-on-surface">
            Tạo lịch làm việc
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5"
        >
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

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-staff-schedule-staff-id">
                Mã nhân viên <span className="text-danger">*</span>
              </Label>
              <div
                id="create-staff-schedule-staff-id"
                aria-invalid={Boolean(fieldErrors.staffId)}
                className="flex min-h-11 items-center rounded-lg border border-outline-variant/20 bg-slate-100 px-4 py-3 text-sm font-bold text-on-surface"
              >
                #{form.staffId}
              </div>
              <FieldError message={fieldErrors.staffId} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-staff-schedule-work-date">
                Ngày làm việc <span className="text-danger">*</span>
              </Label>
              <Input
                id="create-staff-schedule-work-date"
                value={form.workDate}
                onChange={(event) =>
                  updateField("workDate", event.target.value)
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.workDate)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                type="date"
              />
              <FieldError message={fieldErrors.workDate} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="create-staff-schedule-start-time">
                  Giờ bắt đầu <span className="text-danger">*</span>
                </Label>
                <Input
                  id="create-staff-schedule-start-time"
                  value={form.startTime}
                  onChange={(event) => {
                    const time = event.target.value;

                    updateField(
                      "startTime",
                      time.length === 5 ? `${time}:00` : time
                    );
                  }}
                  onKeyDown={handleKeyDown}
                  aria-invalid={Boolean(fieldErrors.startTime)}
                  className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                  type="time"
                  step="60"
                />
                <FieldError message={fieldErrors.startTime} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-staff-schedule-end-time">
                  Giờ kết thúc <span className="text-danger">*</span>
                </Label>
                <Input
                  id="create-staff-schedule-end-time"
                  value={form.endTime}
                  onChange={(event) => {
                    const time = event.target.value;

                    updateField(
                      "endTime",
                      time.length === 5 ? `${time}:00` : time
                    );
                  }}
                  onKeyDown={handleKeyDown}
                  aria-invalid={Boolean(fieldErrors.endTime)}
                  className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                  type="time"
                  step="60"
                />
                <FieldError message={fieldErrors.endTime} />
              </div>
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
                <LoaderCircle
                  className="animate-spin"
                  data-icon="inline-start"
                />
              ) : (
                <CalendarPlus data-icon="inline-start" />
              )}
              Tạo lịch làm việc
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
