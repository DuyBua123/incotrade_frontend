"use client";

import { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { api } from "./api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "./failure.response.";
import RefreshTokenResponse from "../security/refresh-token.response";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken
} from "../security/auth.store";
import { SuccessResponse } from "./success.response.";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;
let isClientInterceptorSetup = false;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<SuccessResponse<RefreshTokenResponse>>("/auth/refresh-token")
      .then(({ data }) => {
        return data.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export const setupClientInterceptors = (): void => {
  if (isClientInterceptorSetup) {
    return;
  }
  
  isClientInterceptorSetup = true;

  api.interceptors.request.use((config) => {
    const token = getAccessToken();    
        
    if (token) {
      console.log(token);
      
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError<FailureResponse<string>>) => {
      const request = error.config as RetriableRequestConfig | undefined;
      const status = error.response?.status;
      const code = error.response?.data?.code;

      if (
        status === 401 &&
        code === ERROR_CODES.REFRESH_TOKEN_ERROR
      ) {
        clearAccessToken();
        return Promise.reject(error);
      }

      if (
        !request ||
        request._retry ||
        status !== 401 ||
        code !== ERROR_CODES.UNAUTHENTICATED_ERROR
      ) {
        
        return Promise.reject(error);
      }

      request._retry = true;

      const token = await refreshAccessToken();
      
      setAccessToken(token);

      request.headers.Authorization = `Bearer ${token}`;

      return api(request);
    }
  );
};
