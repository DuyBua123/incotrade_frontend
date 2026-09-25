export type ServiceDetail = {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetServiceRequest = {
  serviceId: string;
};
