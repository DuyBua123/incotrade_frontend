
export type Service = {
  id: number | string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  isLocked: boolean;
};

export type GetServicesRequest = {
  page: number;
  size: number;
};

