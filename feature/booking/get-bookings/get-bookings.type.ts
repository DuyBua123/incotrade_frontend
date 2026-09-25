export const BOOKING_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type BookingStatus = (typeof BOOKING_STATUS_VALUES)[number];

export type Booking = {
  id: number;
  bookingCode: string;
  customerId: number;
  customerFullName: string;
  serviceName: string;
  staffFullName: string;
  servedDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus | string;
  customerNote: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetBookingsFilters = {
  servedDate: string;
  status: BookingStatus | "";
};
