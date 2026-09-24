import axios from "axios";
import { useState } from "react";

import { api } from "@/lib/api/api";
import type { FailureResponse } from "@/lib/api/failure.response.";
import type { SuccessResponse } from "@/lib/api/success.response.";

import type {
  CompleteBookingRequest,
  CompleteBookingResponse,
} from "./complete-booking.type";

const COMPLETE_BOOKING_ERROR_MESSAGE =
  "Không thể hoàn thành lịch hẹn lúc này. Vui lòng thử lại sau.";

function getFailureMessage(error: unknown) {
  if (axios.isAxiosError<FailureResponse>(error)) {
    const failure = error.response?.data;

    if (typeof failure?.errors === "string") {
      return failure.errors;
    }

    return failure?.message || COMPLETE_BOOKING_ERROR_MESSAGE;
  }

  return COMPLETE_BOOKING_ERROR_MESSAGE;
}

export default function useCompleteBooking() {
  const [errorMessage, setErrorMessage] = useState("");
  const [submittingBookingId, setSubmittingBookingId] = useState<string>("");

  async function completeBooking(request: CompleteBookingRequest) {
    setSubmittingBookingId(request.bookingId);
    setErrorMessage("");

    try {
      const { data } = await api.patch<
        SuccessResponse<CompleteBookingResponse>
      >("/bookings/complete-booking", request, {
        headers: {
          "Content-Type": "application/json",
        },
      });

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
    completeBooking,
    resetError,
  };
}
