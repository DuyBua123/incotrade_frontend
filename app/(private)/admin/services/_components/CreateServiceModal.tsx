"use client";

import { KeyboardEvent, SubmitEvent } from "react";
import { LoaderCircle, PlusCircle, X } from "lucide-react";

import useCreateService from "@/feature/service/create-service/create-service.hook";

type CreateServiceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (message: string) => void;
};

export default function CreateServiceModal({
    isOpen,
    onClose,
    onCreated
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

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Escape" && !isSubmitting) {
            onClose();
            resetForm();
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


    if (!isOpen) {
        return null;
    } else {
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
                    aria-labelledby="create-service-title"
                    aria-modal="true"
                    role="dialog"
                    className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-2xl"
                >
                    <div className="flex items-start justify-between gap-4 border-b border-outline-variant/15 px-5 py-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
                            Dịch vụ mới
                        </p>
                        <h3
                            id="create-service-title"
                            className="mt-1 text-xl font-extrabold text-on-surface"
                        >
                            Tạo dịch vụ
                        </h3>
                    </div>
    
                    <button
                        type="button"
                        aria-label="Đóng modal tạo dịch vụ"
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
                                onKeyDown={(event) => 
                                    handleKeyDown(event)
                                }
                                className="w-full rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                                className="min-h-28 w-full resize-y rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                                onKeyDown={(event) => 
                                    handleKeyDown(event)
                                }
                                className="w-full rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                                onKeyDown={(event) => 
                                    handleKeyDown(event)
                                }
                                className="w-full rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
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
    
                        <fieldset className="sm:col-span-2">
                            <legend className="mb-2 text-sm font-semibold text-on-surface-variant">
                                Trạng thái khóa
                            </legend>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5">
                                <input
                                    checked={form.isLock === "false"}
                                    className="h-4 w-4 accent-primary"
                                    name="isLock"
                                    onChange={() => updateField("isLock", "false")}
                                    onKeyDown={(event) => 
                                        handleKeyDown(event)
                                    }
                                    type="radio"
                                />
                                <span className="text-sm font-bold text-on-surface">
                                    Đang hoạt động
                                </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/20 bg-slate-50 px-4 py-3 transition hover:border-primary/25 hover:bg-primary/5">
                                <input
                                    checked={form.isLock === "true"}
                                    className="h-4 w-4 accent-primary"
                                    name="isLock"
                                    onChange={() => updateField("isLock", "true")}
                                    onKeyDown={(event) => 
                                        handleKeyDown(event)
                                    }
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
                            disabled={isSubmitting}
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
                            <PlusCircle size={17} strokeWidth={2.4} aria-hidden="true" />
                        )}
                            Tạo dịch vụ
                        </button>
                    </div>
                    </form>
                </section>
            </div>
        );
    }
}
