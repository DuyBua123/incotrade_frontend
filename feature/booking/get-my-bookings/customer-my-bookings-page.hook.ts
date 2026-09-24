
import type { SubmitEvent } from "react";
import { useState } from "react";

import useGetMyBookings from "./get-my-bookings.hook";
import type { GetMyBookingsFilters } from "./get-my-bookings.type";

export default function useCustomerMyBookingsPage() {
  const getBookingsState = useGetMyBookings();
  const [servedDate, setServedDate] = useState(
    getBookingsState.activeFilters.servedDate
  );
  const [status, setStatus] = useState<GetMyBookingsFilters["status"]>(
    getBookingsState.activeFilters.status
  );

  async function handleFilter(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    await getBookingsState.filter({ servedDate, status });
  }

  async function handleClearFilters() {
    setServedDate("");
    setStatus("");
    await getBookingsState.clearFilters();
  }

  function handleStatusChange(nextStatus: string) {
    setStatus(nextStatus as GetMyBookingsFilters["status"]);
  }

  return {
    ...getBookingsState,
    servedDate,
    status,
    handleClearFilters,
    handleFilter,
    handleStatusChange,
    setServedDate,
  };
}
