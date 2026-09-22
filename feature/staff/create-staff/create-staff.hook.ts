import axios from "axios";
import { type SubmitEvent, useState } from "react";

import { api } from "@/lib/api/api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "@/lib/api/failure.response.";
import type { SuccessResponse } from "@/lib/api/success.response.";

import type {
  CreateStaffFieldErrors,
  CreateStaffRequest,
  CreateStaffResponse,
} from "./create-staff.type";

type RawFieldErrors = Partial<Record<string, string>>;

const INITIAL_FORM: CreateStaffRequest = {
  fullName: "",
  email: "",
  isLock: "false",
};

const CREATE_STAFF_ERROR_MESSAGE =
  "Không thể tạo nhân viên lúc này. Vui lòng thử lại sau.";

function normalizeFieldErrors(errors: RawFieldErrors): CreateStaffFieldErrors {
  return {
    fullName: errors.fullName ?? errors.FullName,
    email: errors.email ?? errors.Email,
    isLock: errors.isLock ?? errors.IsLock,
  };
}

function buildRequest(form: CreateStaffRequest): CreateStaffRequest {
  return {
    fullName: form.fullName,
    email: form.email,
    isLock: form.isLock?.trim() ? form.isLock : null,
  };
}

export default function useCreateStaff() {
  const [form, setForm] = useState<CreateStaffRequest>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<CreateStaffFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof CreateStaffRequest, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));

    if (formError) {
      setFormError("");
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setFieldErrors({});
    setFormError("");
  }

  function handleCreateError(error: unknown) {
    if (!axios.isAxiosError<FailureResponse>(error) || !error.response) {
      setFormError(CREATE_STAFF_ERROR_MESSAGE);
      return;
    }

    const failure = error.response.data;

    if (
      failure.code === ERROR_CODES.INPUT_VALIDATION_ERROR &&
      typeof failure.errors === "object" &&
      failure.errors !== null
    ) {
      setFieldErrors(normalizeFieldErrors(failure.errors as RawFieldErrors));
      setFormError(failure.message);
      return;
    }

    setFormError(
      typeof failure.errors === "string"
        ? failure.errors
        : failure.message || CREATE_STAFF_ERROR_MESSAGE
    );
  }

  async function submitCreateStaff(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      const { data } = await api.post<SuccessResponse<CreateStaffResponse>>(
        "/staffs/create-staff",
        buildRequest(form)
      );

      resetForm();

      return data.message;
    } catch (error) {
      handleCreateError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fieldErrors,
    form,
    formError,
    isSubmitting,
    resetForm,
    submitCreateStaff,
    updateField,
  };
}
