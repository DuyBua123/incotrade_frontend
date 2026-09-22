export type AvailableService = {
  id: number;
  serviceName: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetAvailableServicesRequest = {
  page?: number;
  size?: number;
  searchName?: string;
};
