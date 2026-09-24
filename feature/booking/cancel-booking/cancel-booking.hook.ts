import axios from "axios";
import { useState } from "react";

import { clientApi } from "@/lib/api/api";
import type { FailureResponse } from "@/lib/api/failure.response.";
import type { SuccessResponse } from "@/lib/api/success.response.";

import type {
  CancelBookingRequest,
  CancelBookingResponse,
} from "./cancel-booking.type";

const CANCEL_BOOKING_ERROR_MESSAGE =
  "Không thể hủy lịch hẹn lúc này. Vui lòng thử lại sau.";

function getFailureMessage(error: unknown) {
  if (axios.isAxiosError<FailureResponse>(error)) {
    const failure = error.response?.data;

    if (typeof failure?.errors === "string") {
      return failure.errors;
    }

    if (failure?.errors && typeof failure.errors === "object") {
      return Object.values(failure.errors).filter(Boolean).join(" ");
    }

    return failure?.message || CANCEL_BOOKING_ERROR_MESSAGE;
  }

  return CANCEL_BOOKING_ERROR_MESSAGE;
}

export default function useCancelBooking() {
  const [errorMessage, setErrorMessage] = useState("");
  const [submittingBookingId, setSubmittingBookingId] = useState<string>("");

  async function cancelBooking(request: CancelBookingRequest) {
    setSubmittingBookingId(request.bookingId);
    setErrorMessage("");

    try {
      const { data } = await clientApi.patch<SuccessResponse<CancelBookingResponse>>(
        "/bookings/cancel-booking",
        request
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
    cancelBooking,
    resetError,
  };
}
