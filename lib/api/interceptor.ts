import { AxiosError } from "axios";

import { api } from "./api";
import { useAuthStore } from "../security/auth.store";
import type RefreshTokenResponse from "../security/refresh-token.response";
import {
  ERROR_CODES,
  type FailureResponse,
} from "./failure.response.";

let refreshPromise: Promise<string> | null = null;

// Refresh access token
function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<RefreshTokenResponse>("/auth/refresh-token")
      .then(({ data }) => {
        const { setAccessToken, setIsAuthenticated } =
          useAuthStore.getState();

        setAccessToken(data.accessToken);
        setIsAuthenticated(true);

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
    const token = useAuthStore.getState().accessToken;

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
        useAuthStore.getState().clearAuthState();
        return Promise.reject(error);
      }

      // Refresh when access token expired
      if (
        !request || 
        status !== 401 ||
        code !== ERROR_CODES.UNAUTHENTICATED_ERROR
      ) {
        return Promise.reject(error);
      }

      // Refresh access token
      const token = await refreshAccessToken();

      // Retry original request
      request.headers.Authorization = `Bearer ${token}`;

      return api(request);
    }
  );
};