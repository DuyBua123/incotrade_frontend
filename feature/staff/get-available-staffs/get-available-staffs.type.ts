export type WorkSchedule = {
  id: number;
  staffId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export type AvailableStaff = {
  id: number;
  fullName: string;
  email: string;
  isLocked: boolean;
  workSchedules: WorkSchedule[];
  createdAt: string;
  updatedAt: string;
};

export type GetAvailableStaffsRequest = {
  page?: number;
  size?: number;
  searchFullName?: string;
};
