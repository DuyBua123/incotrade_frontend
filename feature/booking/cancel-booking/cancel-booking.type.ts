export type CancelBookingRequest = {
  bookingId: string;
  cancellationReason: string;
};

export type CancelBookingResponse = {
  id: number;
  bookingCode: string;
  customerId: number;
  serviceId: number;
  staffId: number;
  servedDate: string;
  startTime: string;
  endTime: string;
  status: string;
  customerNote: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
};
