"use client";

import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8f9ff_0%,#ffffff_48%,#f4f7ff_100%)] px-4 py-10">
      <Card className="w-full max-w-[480px] border-outline-variant/25 shadow-xl">
        <CardHeader className="gap-2">
          <CardDescription className="text-sm font-bold text-primary">
            Incodetrade
          </CardDescription>
          <CardTitle className="text-2xl font-extrabold text-on-surface">
            Đăng nhập
          </CardTitle>
          <CardDescription className="leading-6 text-on-surface-variant">
            Vào tài khoản của bạn để tiếp tục quản lý dịch vụ và lịch hẹn.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {formError ? (
              <Alert
                variant="destructive"
                className="border-danger/15 bg-danger/5"
              >
                <AlertDescription className="font-bold text-danger">
                  {formError}
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                placeholder="you@example.com"
              />
              <FieldError id="email-error" message={fieldErrors.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                className="h-11 bg-slate-50 font-semibold focus-visible:bg-white"
                placeholder="Nhập mật khẩu của bạn"
              />
              <FieldError id="password-error" message={fieldErrors.password} />
            </div>

            <div className="space-y-3 pt-1">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-bold"
              >
                {isSubmitting ? (
                  <LoaderCircle
                    className="animate-spin"
                    data-icon="inline-start"
                    aria-hidden="true"
                  />
                ) : null}
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <Link
                href="/"
                aria-disabled={isSubmitting}
                tabIndex={isSubmitting ? -1 : undefined}
                onClick={(event) => {
                  if (isSubmitting) {
                    event.preventDefault();
                  }
                }}
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: `w-full font-bold text-primary ${
                    isSubmitting ? "pointer-events-none opacity-60" : ""
                  }`,
                })}
              >
                Quay về trang chủ
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
