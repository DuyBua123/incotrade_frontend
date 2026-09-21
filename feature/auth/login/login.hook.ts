import axios from "axios";
import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api/api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "@/lib/api/failure.response.";
import { getAccessToken, setAccessToken, setCurrentUser } from "@/lib/security/auth.store";

import type {
  LoginFieldErrors,
  LoginRequest,
  LoginResponse,
} from "./login.type";
import { SuccessResponse } from "@/lib/api/success.response.";

type RawFieldErrors = Partial<Record<string, string>>;

function normalizeFieldErrors(errors: RawFieldErrors): LoginFieldErrors {
  return {
    email: errors.email ?? errors.Email,
    password: errors.password ?? errors.Password,
  };
}

export default function useLogin() {
  const router = useRouter();
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof LoginRequest, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));

    if (formError) {
      setFormError("");
    }
  }

  function handleLoginError(error: unknown) {
    if (!axios.isAxiosError<FailureResponse>(error) || !error.response) {
      setFormError("Không thể đăng nhập lúc này. Vui lòng thử lại sau.");
      return;
    }

    const failure = error.response.data;

    if (
      failure.code === ERROR_CODES.INPUT_VALIDATION_ERROR
    ) {
      setFieldErrors(normalizeFieldErrors(failure.errors as RawFieldErrors));
      return;
    }

    if (
      failure.code === ERROR_CODES.INVALID_CREDENTIAL_ERROR
    ) {
      setFormError(failure.errors as string);
      return;
    }

    setFormError(failure.message || "Không thể đăng nhập lúc này. Vui lòng thử lại sau.");
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      const { data } = await api.post<SuccessResponse<LoginResponse>>("/auth/login", form);      

      setAccessToken(data.data.accessToken);
      setCurrentUser(data.data.user);      
      router.push("/");
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fieldErrors,
    formError,
    form,
    isSubmitting,
    handleSubmit,
    updateField,
  };
}
