import axios from "axios";
import { useState } from "react";

import { api } from "@/lib/api/api";
import type { FailureResponse } from "@/lib/api/failure.response.";
import type { SuccessResponse } from "@/lib/api/success.response.";

import type {
  ConfirmBookingRequest,
  ConfirmBookingResponse,
} from "./confirm-booking.type";

const CONFIRM_BOOKING_ERROR_MESSAGE =
  "Không thể xác nhận lịch hẹn lúc này. Vui lòng thử lại sau.";

function getFailureMessage(error: unknown) {
  if (axios.isAxiosError<FailureResponse>(error)) {
    const failure = error.response?.data;

    if (typeof failure?.errors === "string") {
      return failure.errors;
    }

    return failure?.message || CONFIRM_BOOKING_ERROR_MESSAGE;
  }

  return CONFIRM_BOOKING_ERROR_MESSAGE;
}

export default function useConfirmBooking() {
  const [errorMessage, setErrorMessage] = useState("");
  const [submittingBookingId, setSubmittingBookingId] = useState<string>("");

  async function confirmBooking(request: ConfirmBookingRequest) {
    setSubmittingBookingId(request.bookingId);
    setErrorMessage("");

    try {
      const { data } = await api.patch<SuccessResponse<ConfirmBookingResponse>>(
        "/bookings/confirm-booking",
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data.message;
    } catch (error) {
      setErrorMessage(getFailureMessage(error));
    } finally {
      setSubmittingBookingId("");
    }
  }

  function resetError() {
    setErrorMessage("");
  }

  return {
    errorMessage,
    isSubmitting: submittingBookingId !== "",
    submittingBookingId,
    confirmBooking,
    resetError,
  };
}
