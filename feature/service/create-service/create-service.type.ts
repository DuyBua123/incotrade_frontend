export type CreateServiceRequest = {
  serviceName: string;
  description?: string | null;
  durationMinutes: string;
  price: string;
  isLock?: "true" | "false" | null;
};

export type CreateServiceResponse = {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceFieldErrors = Partial<
  Record<keyof CreateServiceRequest, string>
>;
