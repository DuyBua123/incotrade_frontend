"use client";

import axios from "axios";
import { type SubmitEvent, useMemo, useState } from "react";

import { clientApi } from "@/lib/api/api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "@/lib/api/failure.response.";
import type { SuccessResponse } from "@/lib/api/success.response.";

import type {
  CreateStaffScheduleFieldErrors,
  CreateStaffScheduleForm,
  CreateStaffScheduleRequest,
  CreateStaffScheduleResponse,
} from "./create-staff-schedule.type";

type RawFieldErrors = Partial<Record<string, string>>;

const CREATE_STAFF_SCHEDULE_ERROR_MESSAGE =
  "Không thể tạo lịch làm việc lúc này. Vui lòng thử lại sau.";

function createInitialForm(staffId: string): CreateStaffScheduleForm {
  return {
    staffId,
    workDate: "",
    startTime: "",
    endTime: "",
  };
}

function normalizeFieldErrors(
  errors: RawFieldErrors
): CreateStaffScheduleFieldErrors {
  return {
    staffId: errors.staffId ?? errors.StaffId,
    workDate: errors.workDate ?? errors.WorkDate,
    startTime: errors.startTime ?? errors.StartTime,
    endTime: errors.endTime ?? errors.EndTime,
  };
}

function buildRequest(
  form: CreateStaffScheduleForm
): CreateStaffScheduleRequest {
  return {
    staffId: form.staffId,
    workDate: form.workDate,
    startTime: form.startTime,
    endTime: form.endTime,
  };
}

export default function useCreateStaffSchedule(staffId: string) {
  const initialForm = useMemo(() => createInitialForm(staffId), [staffId]);
  const [form, setForm] = useState<CreateStaffScheduleForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<CreateStaffScheduleFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof CreateStaffScheduleForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: null }));

    if (formError) {
      setFormError("");
    }
  }

  function resetForm() {
    setForm(initialForm);
    setFieldErrors({});
    setFormError("");
  }

  function handleCreateError(error: unknown) {
    if (!axios.isAxiosError<FailureResponse>(error) || !error.response) {
      setFormError(CREATE_STAFF_SCHEDULE_ERROR_MESSAGE);
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
        : failure.message || CREATE_STAFF_SCHEDULE_ERROR_MESSAGE
    );
  }

  async function submitCreateStaffSchedule(
    event: SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      const { data } = await clientApi.post<
        SuccessResponse<CreateStaffScheduleResponse>
      >("/staffs/create-staff-schedule", buildRequest(form));

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
    submitCreateStaffSchedule,
    updateField,
  };
}
