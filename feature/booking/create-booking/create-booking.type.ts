export type CreateBookingRequest = {
  serviceId: string;
  staffScheduleId: string;
  startTime: string;
  customerNote?: string | null;
};

export type CreateBookingResponse = {
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
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingFieldErrors = Partial<
  Record<keyof CreateBookingRequest, string>
>;
