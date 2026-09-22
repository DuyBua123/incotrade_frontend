export type CreateStaffScheduleForm = {
  staffId: string;
  workDate: string;
  startTime: string;
  endTime: string;
};

export type CreateStaffScheduleRequest = {
  staffId: string;
  workDate: string;
  startTime: string;
  endTime: string;
};

export type CreateStaffScheduleResponse = {
  id: number;
  staffId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateStaffScheduleFieldErrors = Partial<
  Record<keyof CreateStaffScheduleForm, string>
>;
