import type { ServiceDetail } from "../get-service/get-service.type";

export type SetServiceLockingRequest = {
  serviceId: string;
  isLocked: "true" | "false";
};

export type SetServiceLockingResponse = ServiceDetail;
