
export const ERROR_CODES = {
  INPUT_VALIDATION_ERROR: "INPUT_VALIDATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  INVALID_CREDENTIAL_ERROR: "INVALID_CREDENTIAL_ERROR",
  FORBIDDEN_ERROR: "FORBIDDEN_ERROR",
  UNAUTHENTICATED_ERROR: "UNAUTHENTICATED_ERROR",
  REFRESH_TOKEN_ERROR: "REFRESH_TOKEN_ERROR",
  SERVER_ERROR: "SERVER_ERROR"
} as const;

export interface FailureResponse<T = Partial<Record<string, string>> | string> {
  message: string;
  code: string;
  errors: T;
  timestamp: string;
}