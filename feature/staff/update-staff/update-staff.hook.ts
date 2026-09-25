import axios from "axios";
import { type SubmitEvent, useState } from "react";

import { clientApi } from "@/lib/api/api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "@/lib/api/failure.response.";
import type { SuccessResponse } from "@/lib/api/success.response.";

import type { Staff } from "../get-staffs/get-staffs.type";
import type {
  UpdateStaffFieldErrors,
  UpdateStaffRequest,
  UpdateStaffResponse,
} from "./update-staff.type";

type RawFieldErrors = Partial<Record<string, string>>;

const INITIAL_FORM: UpdateStaffRequest = {
  staffId: "",
  fullName: "",
  email: "",
  isLock: "false",
};

const UPDATE_STAFF_ERROR_MESSAGE =
  "Không thể cập nhật nhân viên lúc này. Vui lòng thử lại sau.";

function normalizeFieldErrors(errors: RawFieldErrors): UpdateStaffFieldErrors {
  return {
    staffId: errors.staffId ?? errors.StaffId,
    fullName: errors.fullName ?? errors.FullName,
    email: errors.email ?? errors.Email,
    isLock: errors.isLock ?? errors.IsLock,
  };
}

function buildFormFromStaff(staff: Staff): UpdateStaffRequest {
  return {
    staffId: String(staff.id),
    fullName: staff.fullName,
    email: staff.email,
    isLock: staff.isLocked ? "true" : "false",
  };
}

function buildRequest(form: UpdateStaffRequest): UpdateStaffRequest {
  return {
    staffId: form.staffId,
    fullName: form.fullName,
    email: form.email,
    isLock: form.isLock?.trim() ? form.isLock : null,
  };
}


export default function useUpdateStaff(staff: Staff | null) {
  const [form, setForm] = useState<UpdateStaffRequest>(() =>
    staff ? buildFormFromStaff(staff) : INITIAL_FORM
  );
  const [fieldErrors, setFieldErrors] = useState<UpdateStaffFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof UpdateStaffRequest, value: string) {
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

  function handleUpdateError(error: unknown) {
    if (!axios.isAxiosError<FailureResponse>(error) || !error.response) {
      setFormError(UPDATE_STAFF_ERROR_MESSAGE);
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
        : failure.message || UPDATE_STAFF_ERROR_MESSAGE
    );
  }

  async function submitUpdateStaff(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      const { data } = await clientApi.put<SuccessResponse<UpdateStaffResponse>>(
        "/staffs/update-staff",
        buildRequest(form)
      );

      resetForm();

      return data.message;
    } catch (error) {
      handleUpdateError(error);
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
    submitUpdateStaff,
    updateField,
  };
}
