"use client";

import { type KeyboardEvent, type SubmitEvent } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import type { Staff } from "@/feature/staff/get-staffs/get-staffs.type";
import useUpdateStaff from "@/feature/staff/update-staff/update-staff.hook";

type UpdateStaffModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (message: string) => void;
  staff: Staff | null;
};

export default function UpdateStaffModal({
  isOpen,
  onClose,
  onUpdated,
  staff,
}: UpdateStaffModalProps) {
  const {
    fieldErrors,
    form,
    formError,
    isSubmitting,
    resetForm,
    submitUpdateStaff,
    updateField,
  } = useUpdateStaff(staff);

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
    const successMessage = await submitUpdateStaff(event);

    if (successMessage) {
      onUpdated(successMessage);
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
            Cập nhật nhân viên
          </DialogDescription>
          <DialogTitle className="text-xl font-extrabold text-on-surface">
            Thông tin nhân viên
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5"
        >
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface-variant">
              Mã nhân viên
            </span>
            <Badge
              variant="outline"
              className="border-primary/15 bg-white font-black text-primary"
            >
              {form.staffId || staff?.id}
            </Badge>
          </div>

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

          <FieldError className="mb-4" message={fieldErrors.staffId} />

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="update-staff-full-name">
                Họ tên nhân viên <span className="text-danger">*</span>
              </Label>
              <Input
                id="update-staff-full-name"
                value={form.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.fullName)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                disabled={isSubmitting}
                placeholder="Nhập họ tên nhân viên"
              />
              <FieldError message={fieldErrors.fullName} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-staff-email">
                Email <span className="text-danger">*</span>
              </Label>
              <Input
                id="update-staff-email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.email)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                disabled={isSubmitting}
                placeholder="nguyenvana@example.com"
                type="email"
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái khóa</Label>
              <RadioGroup
                value={form.isLock ?? "false"}
                onValueChange={(value) => updateField("isLock", String(value))}
                className="grid gap-2 sm:grid-cols-2"
                aria-invalid={Boolean(fieldErrors.isLock)}
                disabled={isSubmitting}
              >
                <Label
                  htmlFor="update-staff-unlocked"
                  className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70"
                >
                  <RadioGroupItem id="update-staff-unlocked" value="false" />
                  <span className="font-bold text-on-surface">
                    Đang hoạt động
                  </span>
                </Label>
                <Label
                  htmlFor="update-staff-locked"
                  className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70"
                >
                  <RadioGroupItem id="update-staff-locked" value="true" />
                  <span className="font-bold text-on-surface">Đang khóa</span>
                </Label>
              </RadioGroup>
              <FieldError message={fieldErrors.isLock} />
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
                <Save data-icon="inline-start" />
              )}
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
