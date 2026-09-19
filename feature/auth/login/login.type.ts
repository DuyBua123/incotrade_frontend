export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  user: LoginUserResponse;
};

export type LoginFieldErrors = Partial<Record<keyof LoginRequest, string>>;
