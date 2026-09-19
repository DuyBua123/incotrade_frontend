import { AxiosError } from "axios";

import { api } from "./api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "./failure.response.";
import { clearAccessToken, getAccessToken, setAccessToken } from "../security/auth.store";
import RefreshTokenResponse from "../security/refresh-token.response";

let refreshPromise: Promise<string> | null = null;

// Refresh access token
function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<RefreshTokenResponse>("/auth/refresh-token")
      .then(({ data }) => {

        setAccessToken(data.accessToken);

        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export const setupInterceptors = (): void => {
  // Attach access token
  api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // Handle authentication errors
  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError<FailureResponse<string>>) => {
      const request = error.config;
      const status = error.response?.status;
      const code = error.response?.data?.code;

      // Invalid/Expired refresh token => logout
      if (
        status === 401 &&
        code === ERROR_CODES.REFRESH_TOKEN_ERROR
      ) {
        clearAccessToken();
        return Promise.reject(error);
      }

      // Reject when there is other error code (INPUT_VALIDATION, NOT_FOUND, FOBBIDEN, SERVER_ERROR, ...)
      if (
        !request || 
        status !== 401 ||
        code !== ERROR_CODES.UNAUTHENTICATED_ERROR
      ) {
        return Promise.reject(error);
      }

      // Refresh when access token expired
      const token = await refreshAccessToken();

      // Retry original request
      request.headers.Authorization = `Bearer ${token}`;

      return api(request);
    }
  );
};