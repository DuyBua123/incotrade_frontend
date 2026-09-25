"use client";

import { type KeyboardEvent, type SubmitEvent } from "react";
import { LoaderCircle, PlusCircle } from "lucide-react";

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
import useCreateStaff from "@/feature/staff/create-staff/create-staff.hook";

type CreateStaffModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (message: string) => void;
};

export default function CreateStaffModal({
  isOpen,
  onClose,
  onCreated,
}: CreateStaffModalProps) {
  const {
    fieldErrors,
    form,
    formError,
    isSubmitting,
    resetForm,
    submitCreateStaff,
    updateField,
  } = useCreateStaff();

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
    const successMessage = await submitCreateStaff(event);

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
            Nhân viên mới
          </DialogDescription>
          <DialogTitle className="text-xl font-extrabold text-on-surface">
            Tạo nhân viên
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
              <Label htmlFor="create-staff-full-name">
                Họ tên nhân viên <span className="text-danger">*</span>
              </Label>
              <Input
                id="create-staff-full-name"
                value={form.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.fullName)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                placeholder="Nhập họ tên nhân viên"
              />
              <FieldError message={fieldErrors.fullName} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-staff-email">
                Email <span className="text-danger">*</span>
              </Label>
              <Input
                id="create-staff-email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.email)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
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
              >
                <Label
                  htmlFor="create-staff-unlocked"
                  className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5"
                >
                  <RadioGroupItem id="create-staff-unlocked" value="false" />
                  <span className="font-bold text-on-surface">
                    Đang hoạt động
                  </span>
                </Label>
                <Label
                  htmlFor="create-staff-locked"
                  className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5"
                >
                  <RadioGroupItem id="create-staff-locked" value="true" />
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
                <PlusCircle data-icon="inline-start" />
              )}
              Tạo nhân viên
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
