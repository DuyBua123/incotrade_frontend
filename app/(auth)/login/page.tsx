"use client";

import Link from "next/link";
import useLogin from "@/feature/auth/login/login.hook";

export default function LoginPage() {
  const {
    fieldErrors,
    form,
    formError,
    handleSubmit,
    isSubmitting,
    updateField,
  } = useLogin();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8f9ff_0%,#ffffff_48%,#f4f7ff_100%)] px-4 py-10 text-on-surface">
      <section className="w-full max-w-[420px] rounded-lg border border-outline-variant/25 bg-white px-6 py-7 shadow-[0_18px_45px_rgba(8,20,70,0.10)] sm:px-8 sm:py-8">
        <div>
          <p className="text-sm font-bold text-primary">Incodetrade</p>
          <h1 className="mt-3 text-2xl font-extrabold text-on-surface">Đăng nhập</h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Vào tài khoản của bạn để tiếp tục quản lý dịch vụ và lịch hẹn.
          </p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          {formError ? (
            <p
              role="alert"
              className="rounded-lg border border-danger/25 bg-danger/5 px-4 py-3 text-sm font-semibold leading-6 text-danger"
            >
              {formError}
            </p>
          ) : null}

          <div>
            <label htmlFor="email" className="text-sm font-semibold text-on-surface">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-outline-variant/45 bg-white px-4 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/55 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-on-surface-variant/60"
              placeholder="you@example.com"
            />
            {fieldErrors.email ? (
              <p id="email-error" className="mt-2 text-sm font-medium text-danger">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-on-surface">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-outline-variant/45 bg-white px-4 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/55 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-on-surface-variant/60"
              placeholder="Nhập mật khẩu của bạn"
            />
            {fieldErrors.password ? (
              <p id="password-error" className="mt-2 text-sm font-medium text-danger">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-primary/55"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <Link
            href="/"
            aria-disabled={isSubmitting}
            tabIndex={isSubmitting ? -1 : undefined}
            onClick={(event) => {
              if (isSubmitting) {
                event.preventDefault();
              }
            }}
            className={`flex h-12 w-full items-center justify-center rounded-lg border border-outline-variant/40 bg-white px-4 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 ${
              isSubmitting ? "pointer-events-none opacity-60" : ""
            }`}
          >
            Quay về trang chủ
          </Link>
        </form>
      </section>
    </main>
  );
}
