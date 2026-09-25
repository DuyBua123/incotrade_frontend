
import type { FormEvent } from "react";
import { useState } from "react";

import useCancelBooking from "@/feature/booking/cancel-booking/cancel-booking.hook";

import useGetMyBookings from "./get-my-bookings.hook";
import type { GetMyBookingsFilters, MyBooking } from "./get-my-bookings.type";

const CANCELLATION_REASON_MAX_LENGTH = 255;

export default function useCustomerMyBookingsPage() {
  const getBookingsState = useGetMyBookings();
  const {
    cancelBooking,
    errorMessage: cancelBookingErrorMessage,
    isSubmitting: isCancellingBooking,
    submittingBookingId: cancellingBookingId,
    resetError: resetCancelBookingError,
  } = useCancelBooking();
  const [servedDate, setServedDate] = useState(
    getBookingsState.activeFilters.servedDate
  );
  const [status, setStatus] = useState<GetMyBookingsFilters["status"]>(
    getBookingsState.activeFilters.status
  );
  const [bookingToCancel, setBookingToCancel] = useState<MyBooking | null>(
    null
  );
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationReasonError, setCancellationReasonError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    resetCancelBookingError();
    await getBookingsState.filter({ servedDate, status });
  }

  async function handleClearFilters() {
    setServedDate("");
    setStatus("");
    setSuccessMessage("");
    resetCancelBookingError();
    await getBookingsState.clearFilters();
  }

  function handleRefresh() {
    setSuccessMessage("");
    resetCancelBookingError();
    void getBookingsState.refresh();
  }

  function handleStatusChange(nextStatus: string) {
    setStatus(nextStatus as GetMyBookingsFilters["status"]);
  }

  function openCancelBookingDialog(booking: MyBooking) {
    setBookingToCancel(booking);
    setCancellationReason("");
    setCancellationReasonError("");
    setSuccessMessage("");
    resetCancelBookingError();
  }

  function closeCancelBookingDialog() {
    if (isCancellingBooking) {
      return;
    }

    setBookingToCancel(null);
    setCancellationReason("");
    setCancellationReasonError("");
  }

  async function handleCancelBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!bookingToCancel) {
      return;
    }

    const trimmedReason = cancellationReason.trim();

    if (!trimmedReason) {
      setCancellationReasonError("Vui lòng nhập lý do hủy lịch hẹn.");
      return;
    }

    if (trimmedReason.length > CANCELLATION_REASON_MAX_LENGTH) {
      setCancellationReasonError(
        "Lý do hủy lịch hẹn không được vượt quá 255 ký tự."
      );
      return;
    }

    setCancellationReasonError("");
    setSuccessMessage("");

    const message = await cancelBooking({
      bookingId: String(bookingToCancel.id),
      cancellationReason: trimmedReason,
    });

    if (!message) {
      return;
    }

    setSuccessMessage(message);
    setBookingToCancel(null);
    setCancellationReason("");
    await getBookingsState.refresh();
  }

  return {
    ...getBookingsState,
    actionErrorMessage: cancelBookingErrorMessage,
    bookingToCancel,
    cancellationReason,
    cancellationReasonError,
    cancellingBookingId,
    isCancellingBooking,
    servedDate,
    status,
    successMessage,
    closeCancelBookingDialog,
    handleCancelBooking,
    handleClearFilters,
    handleFilter,
    handleRefresh,
    handleStatusChange,
    openCancelBookingDialog,
    setCancellationReason,
    setServedDate,
  };
}
