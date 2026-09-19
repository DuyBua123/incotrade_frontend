import axios from "axios";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api/api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "@/lib/api/failure.response.";
import { setAccessToken, setCurrentUser } from "@/lib/security/auth.store";

import type {
  LoginFieldErrors,
  LoginRequest,
  LoginResponse,
} from "./login.type";

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
      setFormError("Unable to sign in right now. Please try again.");
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
      failure.code === ERROR_CODES.INVALID_CREDENTIAL_ERROR &&
      typeof failure.errors === "string"
    ) {
      setFormError(failure.errors);
      return;
    }

    setFormError(failure.message || "Unable to sign in right now. Please try again.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      const { data } = await api.post<LoginResponse>("/auth/login", form);

      setAccessToken(data.accessToken);
      setCurrentUser(data.user);
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
