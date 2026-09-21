import type { ServiceDetail } from "../get-service/get-service.type";

export type UpdateServiceRequest = {
  serviceId: string;
  serviceName: string;
  description?: string | null;
  durationMinutes: string;
  price: string;
  isLock?: "true" | "false" | null;
};

export type UpdateServiceResponse = ServiceDetail;

export type UpdateServiceFieldErrors = Partial<
  Record<keyof UpdateServiceRequest, string>
>;
