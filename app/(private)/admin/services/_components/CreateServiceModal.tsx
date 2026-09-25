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
import { Textarea } from "@/components/ui/textarea";
import useCreateService from "@/feature/service/create-service/create-service.hook";

type CreateServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (message: string) => void;
};

export default function CreateServiceModal({
  isOpen,
  onClose,
  onCreated,
}: CreateServiceModalProps) {
  const {
    fieldErrors,
    form,
    formError,
    isSubmitting,
    submitCreateService,
    resetForm,
    updateField,
  } = useCreateService();

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
    const successMessage = await submitCreateService(event);

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
        className="max-h-[calc(100vh-3rem)] max-w-xl gap-0 overflow-hidden p-0 sm:max-w-4xl"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader className="border-b border-outline-variant/15 px-5 py-4">
          <DialogDescription className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            Dịch vụ mới
          </DialogDescription>
          <DialogTitle className="text-xl font-extrabold text-on-surface">
            Tạo dịch vụ
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="create-service-name">
                Tên dịch vụ <span className="text-danger">*</span>
              </Label>
              <Input
                id="create-service-name"
                value={form.serviceName}
                onChange={(event) =>
                  updateField("serviceName", event.target.value)
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.serviceName)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                placeholder="Nhập tên dịch vụ"
              />
              <FieldError message={fieldErrors.serviceName} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="create-service-description">Mô tả</Label>
              <Textarea
                id="create-service-description"
                value={form.description ?? ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.description)}
                className="min-h-28 resize-y bg-slate-50 font-semibold leading-6 focus-visible:bg-white"
                placeholder="Nhập mô tả ngắn cho dịch vụ"
              />
              <FieldError message={fieldErrors.description} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-service-duration">
                Thời lượng (phút) <span className="text-danger">*</span>
              </Label>
              <Input
                id="create-service-duration"
                value={form.durationMinutes}
                onChange={(event) =>
                  updateField(
                    "durationMinutes",
                    event.target.value.replace(/\D/g, "")
                  )
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.durationMinutes)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="60"
                type="text"
              />
              <FieldError message={fieldErrors.durationMinutes} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-service-price">
                Giá (VND) <span className="text-danger">*</span>
              </Label>
              <Input
                id="create-service-price"
                value={form.price}
                onChange={(event) =>
                  updateField("price", event.target.value.replace(/\D/g, ""))
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.price)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="150000"
                type="text"
              />
              <FieldError message={fieldErrors.price} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Trạng thái khóa</Label>
              <RadioGroup
                value={form.isLock ?? "false"}
                onValueChange={(value) => updateField("isLock", String(value))}
                className="grid gap-2 sm:grid-cols-2"
                aria-invalid={Boolean(fieldErrors.isLock)}
              >
                <Label
                  htmlFor="create-service-unlocked"
                  className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5"
                >
                  <RadioGroupItem
                    id="create-service-unlocked"
                    value="false"
                  />
                  <span className="font-bold text-on-surface">
                    Đang hoạt động
                  </span>
                </Label>
                <Label
                  htmlFor="create-service-locked"
                  className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5"
                >
                  <RadioGroupItem id="create-service-locked" value="true" />
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
              Tạo dịch vụ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
