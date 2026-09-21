"use client";

import { type KeyboardEvent, type SubmitEvent } from "react";
import { LoaderCircle, Save } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useUpdateService from "@/feature/service/update-service/update-service.hook";

type UpdateServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (message: string) => void;
  serviceId: string | null;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-xs font-bold text-danger">{message}</p>;
}

export default function UpdateServiceModal({
  isOpen,
  onClose,
  onUpdated,
  serviceId,
}: UpdateServiceModalProps) {
  const {
    detailError,
    fieldErrors,
    form,
    formError,
    isLoadingDetail,
    isSubmitting,
    resetForm,
    submitUpdateService,
    updateField,
  } = useUpdateService({ isOpen, serviceId });

  const isFormDisabled = isLoadingDetail || isSubmitting || Boolean(detailError);

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
    const successMessage = await submitUpdateService(event);

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
        className="max-h-[calc(100vh-3rem)] max-w-xl gap-0 overflow-hidden p-0 sm:max-w-4xl"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader className="border-b border-outline-variant/15 px-5 py-4">
          <DialogDescription className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            Cập nhật dịch vụ
          </DialogDescription>
          <DialogTitle className="text-xl font-extrabold text-on-surface">
            Thông tin dịch vụ
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5"
        >
          {isLoadingDetail && (
            <Alert className="mb-5 border-primary/15 bg-primary/5 text-primary">
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              <AlertDescription className="font-bold text-primary">
                Đang tải thông tin dịch vụ...
              </AlertDescription>
            </Alert>
          )}

          {detailError && (
            <Alert
              variant="destructive"
              className="mb-5 border-danger/15 bg-danger/5"
            >
              <AlertDescription className="font-bold text-danger">
                {detailError}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="update-service-name">
                Tên dịch vụ <span className="text-danger">*</span>
              </Label>
              <Input
                id="update-service-name"
                value={form.serviceName}
                onChange={(event) =>
                  updateField("serviceName", event.target.value)
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.serviceName)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                disabled={isFormDisabled}
                placeholder="Nhập tên dịch vụ"
              />
              <FieldError message={fieldErrors.serviceName} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="update-service-description">Mô tả</Label>
              <Textarea
                id="update-service-description"
                value={form.description ?? ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.description)}
                className="min-h-28 resize-y bg-slate-50 font-semibold leading-6 focus-visible:bg-white"
                disabled={isFormDisabled}
                placeholder="Nhập mô tả ngắn cho dịch vụ"
              />
              <FieldError message={fieldErrors.description} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-service-duration">
                Thời lượng (phút) <span className="text-danger">*</span>
              </Label>
              <Input
                id="update-service-duration"
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
                disabled={isFormDisabled}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="60"
                type="text"
              />
              <FieldError message={fieldErrors.durationMinutes} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-service-price">
                Giá (VND) <span className="text-danger">*</span>
              </Label>
              <Input
                id="update-service-price"
                value={form.price}
                onChange={(event) =>
                  updateField("price", event.target.value.replace(/\D/g, ""))
                }
                onKeyDown={handleKeyDown}
                aria-invalid={Boolean(fieldErrors.price)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                disabled={isFormDisabled}
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
                disabled={isFormDisabled}
              >
                <Label
                  htmlFor="update-service-unlocked"
                  className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70"
                >
                  <RadioGroupItem
                    id="update-service-unlocked"
                    value="false"
                  />
                  <span className="font-bold text-on-surface">
                    Đang hoạt động
                  </span>
                </Label>
                <Label
                  htmlFor="update-service-locked"
                  className="flex min-h-12 cursor-pointer rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70"
                >
                  <RadioGroupItem id="update-service-locked" value="true" />
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
            <Button type="submit" disabled={isFormDisabled} className="font-bold">
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
