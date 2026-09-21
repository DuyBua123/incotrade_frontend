"use client";

import { KeyboardEvent, SubmitEvent } from "react";
import { LoaderCircle, Save, X } from "lucide-react";

import useUpdateService from "@/feature/service/update-service/update-service.hook";

type UpdateServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (message: string) => void;
  serviceId: string | null;
};

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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <section
        aria-labelledby="update-service-title"
        aria-modal="true"
        role="dialog"
        className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/15 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
              Cập nhật dịch vụ
            </p>
            <h3
              id="update-service-title"
              className="mt-1 text-xl font-extrabold text-on-surface"
            >
              Thông tin dịch vụ
            </h3>
          </div>

          <button
            type="button"
            aria-label="Đóng modal cập nhật dịch vụ"
            onClick={closeModal}
            disabled={isSubmitting}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-on-surface-variant transition hover:bg-slate-100 hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5"
        >
          {isLoadingDetail && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-bold text-primary">
              <LoaderCircle
                className="animate-spin"
                size={17}
                strokeWidth={2.4}
                aria-hidden="true"
              />
              Đang tải thông tin dịch vụ...
            </div>
          )}

          {detailError && (
            <div className="mb-5 rounded-xl border border-danger/15 bg-danger/5 px-4 py-3 text-sm font-bold text-danger">
              {detailError}
            </div>
          )}

          {formError && (
            <div className="mb-5 rounded-xl border border-danger/15 bg-danger/5 px-4 py-3 text-sm font-bold text-danger">
              {formError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">
                Tên dịch vụ <span className="text-danger">*</span>
              </span>
              <input
                value={form.serviceName}
                onChange={(event) =>
                  updateField("serviceName", event.target.value)
                }
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isFormDisabled}
                placeholder="Nhập tên dịch vụ"
              />
              {fieldErrors.serviceName && (
                <span className="mt-1.5 block text-xs font-bold text-danger">
                  {fieldErrors.serviceName}
                </span>
              )}
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">
                Mô tả
              </span>
              <textarea
                value={form.description ?? ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                onKeyDown={handleKeyDown}
                className="min-h-28 w-full resize-y rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isFormDisabled}
                placeholder="Nhập mô tả ngắn cho dịch vụ"
              />
              {fieldErrors.description && (
                <span className="mt-1.5 block text-xs font-bold text-danger">
                  {fieldErrors.description}
                </span>
              )}
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">
                Thời lượng (phút) <span className="text-danger">*</span>
              </span>
              <input
                value={form.durationMinutes}
                onChange={(event) =>
                  updateField(
                    "durationMinutes",
                    event.target.value.replace(/\D/g, "")
                  )
                }
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isFormDisabled}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="60"
                type="text"
              />
              {fieldErrors.durationMinutes && (
                <span className="mt-1.5 block text-xs font-bold text-danger">
                  {fieldErrors.durationMinutes}
                </span>
              )}
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-on-surface-variant">
                Giá (VND) <span className="text-danger">*</span>
              </span>
              <input
                value={form.price}
                onChange={(event) =>
                  updateField("price", event.target.value.replace(/\D/g, ""))
                }
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isFormDisabled}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="150000"
                type="text"
              />
              {fieldErrors.price && (
                <span className="mt-1.5 block text-xs font-bold text-danger">
                  {fieldErrors.price}
                </span>
              )}
            </label>

            <fieldset className="sm:col-span-2" disabled={isFormDisabled}>
              <legend className="mb-2 text-sm font-semibold text-on-surface-variant">
                Trạng thái khóa
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70">
                  <input
                    checked={form.isLock === "false"}
                    className="h-4 w-4 accent-primary"
                    name="updateIsLock"
                    onChange={() => updateField("isLock", "false")}
                    onKeyDown={handleKeyDown}
                    type="radio"
                  />
                  <span className="text-sm font-bold text-on-surface">
                    Đang hoạt động
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70">
                  <input
                    checked={form.isLock === "true"}
                    className="h-4 w-4 accent-primary"
                    name="updateIsLock"
                    onChange={() => updateField("isLock", "true")}
                    onKeyDown={handleKeyDown}
                    type="radio"
                  />
                  <span className="text-sm font-bold text-on-surface">
                    Đang khóa
                  </span>
                </label>
              </div>
              {fieldErrors.isLock && (
                <span className="mt-1.5 block text-xs font-bold text-danger">
                  {fieldErrors.isLock}
                </span>
              )}
            </fieldset>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-outline-variant/15 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/35 bg-white px-4 py-2.5 text-sm font-bold text-on-surface-variant transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isFormDisabled}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoaderCircle
                  className="animate-spin"
                  size={17}
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              ) : (
                <Save size={17} strokeWidth={2.4} aria-hidden="true" />
              )}
              Cập nhật
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
