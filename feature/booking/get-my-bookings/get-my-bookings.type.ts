export const BOOKING_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type MyBooking = {
  id: number;
  bookingCode: string;
  customerId: number;
  serviceId: number;
  staffId: number;
  servedDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus | string;
  customerNote: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetMyBookingsFilters = {
  servedDate: string;
  status: BookingStatus | "";
};
