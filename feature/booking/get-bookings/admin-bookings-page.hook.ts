
import { SubmitEvent, useState } from "react";

import useCompleteBooking from "@/feature/booking/complete-booking/complete-booking.hook";
import useConfirmBooking from "@/feature/booking/confirm-booking/confirm-booking.hook";

import useGetBookings from "./get-bookings.hook";
import type { Booking, GetBookingsFilters } from "./get-bookings.type";

type BookingStatusAction = "confirm" | "complete";

function getBookingStatusAction(status: string): BookingStatusAction | null {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === "PENDING") {
    return "confirm";
  }

  if (normalizedStatus === "CONFIRMED") {
    return "complete";
  }

  return null;
}

export default function useAdminBookingsPage() {
  const getBookingsState = useGetBookings();
  const {
    confirmBooking,
    errorMessage: confirmErrorMessage,
    isSubmitting: isConfirmingBooking,
    submittingBookingId: confirmingBookingId,
    resetError: resetConfirmError,
  } = useConfirmBooking();
  const {
    completeBooking,
    errorMessage: completeErrorMessage,
    isSubmitting: isCompletingBooking,
    submittingBookingId: completingBookingId,
    resetError: resetCompleteError,
  } = useCompleteBooking();

  const [servedDate, setServedDate] = useState(
    getBookingsState.activeFilters.servedDate
  );
  const [status, setStatus] = useState<GetBookingsFilters["status"]>(
    getBookingsState.activeFilters.status
  );
  const [successMessage, setSuccessMessage] = useState("");

  const actionErrorMessage = confirmErrorMessage || completeErrorMessage;
  const isUpdatingBookingStatus = isConfirmingBooking || isCompletingBooking;
  const submittingBookingId = confirmingBookingId || completingBookingId;

  async function handleFilter(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    resetConfirmError();
    resetCompleteError();
    await getBookingsState.filter({ servedDate, status });
  }

  async function handleClearFilters() {
    setServedDate("");
    setStatus("");
    setSuccessMessage("");
    resetConfirmError();
    resetCompleteError();
    await getBookingsState.clearFilters();
  }

  function handleRefresh() {
    setSuccessMessage("");
    resetConfirmError();
    resetCompleteError();
    getBookingsState.refresh();
  }

  function handleStatusChange(nextStatus: string) {
    setStatus(nextStatus as GetBookingsFilters["status"]);
  }

  async function handleUpdateBookingStatus(booking: Booking) {
    const action = getBookingStatusAction(booking.status);

    if (!action) {
      return;
    }

    setSuccessMessage("");

    const request = {
      bookingId: String(booking.id),
    };
    const message =
      action === "confirm"
        ? await confirmBooking(request)
        : await completeBooking(request);

    if (!message) {
      return;
    }

    setSuccessMessage(message);
    getBookingsState.refresh();
  }

  return {
    ...getBookingsState,
    actionErrorMessage,
    isUpdatingBookingStatus,
    servedDate,
    status,
    submittingBookingId,
    successMessage,
    handleClearFilters,
    handleFilter,
    handleRefresh,
    handleStatusChange,
    handleUpdateBookingStatus,
    setServedDate,
  };
}
