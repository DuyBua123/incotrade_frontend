export type UpdateStaffRequest = {
  staffId: string;
  fullName: string;
  email: string;
  isLock?: "true" | "false" | null;
};

export type UpdateStaffResponse = {
  id: number;
  fullName: string;
  email: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateStaffFieldErrors = Partial<
  Record<keyof UpdateStaffRequest, string>
>;
