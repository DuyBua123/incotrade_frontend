import axios from "axios";
import { useState } from "react";

import { api } from "@/lib/api/api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "@/lib/api/failure.response.";
import type { SuccessResponse } from "@/lib/api/success.response.";

import type {
  CreateBookingFieldErrors,
  CreateBookingRequest,
  CreateBookingResponse,
} from "./create-booking.type";

type RawFieldErrors = Partial<Record<string, string>>;

const CREATE_BOOKING_ERROR_MESSAGE =
  "Không thể tạo lịch hẹn lúc này. Vui lòng thử lại sau.";

function normalizeFieldErrors(
  errors: RawFieldErrors
): CreateBookingFieldErrors {
  return {
    serviceId: errors.serviceId ?? errors.ServiceId,
    staffScheduleId: errors.staffScheduleId ?? errors.StaffScheduleId,
    startTime: errors.startTime ?? errors.StartTime,
    customerNote: errors.customerNote ?? errors.CustomerNote,
  };
}

function getFailureMessage(failure: FailureResponse) {
  if (typeof failure.errors === "string") {
    return failure.errors;
  }

  return failure.message || CREATE_BOOKING_ERROR_MESSAGE;
}

export default function useCreateBooking() {
  const [fieldErrors, setFieldErrors] = useState<CreateBookingFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetMessages() {
    setFieldErrors({});
    setFormError("");
    setSuccessMessage("");
  }

  function resetFormState() {
    resetMessages();
    setIsSubmitting(false);
  }

  function handleCreateBookingError(error: unknown) {
    if (!axios.isAxiosError<FailureResponse>(error) || !error.response) {
      setFormError(CREATE_BOOKING_ERROR_MESSAGE);
      return;
    }

    const failure = error.response.data;

    if (failure.code === ERROR_CODES.INPUT_VALIDATION_ERROR) {
      setFieldErrors(normalizeFieldErrors(failure.errors as RawFieldErrors));
      setFormError(failure.message);
      return;
    }

    if (failure.code === ERROR_CODES.REFRESH_TOKEN_ERROR) {
      setFormError("Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    setFormError(getFailureMessage(failure));
  }

  async function submitCreateBooking(request: CreateBookingRequest) {
    setIsSubmitting(true);
    resetMessages();

    try {
      const { data } = await api.post<SuccessResponse<CreateBookingResponse>>(
        "/bookings/create-booking",
        request);

      setSuccessMessage(data.message);
      return data;
    } catch (error) {
      handleCreateBookingError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fieldErrors,
    formError,
    isSubmitting,
    successMessage,
    resetFormState,
    resetMessages,
    submitCreateBooking,
  };
}
