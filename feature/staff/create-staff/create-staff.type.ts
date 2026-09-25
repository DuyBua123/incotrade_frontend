export type CreateStaffRequest = {
  fullName: string;
  email: string;
  isLock?: "true" | "false" | null;
};

export type CreateStaffResponse = {
  id: number;
  fullName: string;
  email: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateStaffFieldErrors = Partial<
  Record<keyof CreateStaffRequest, string>
>;
