"use client";

import axios from "axios";
import { create } from "zustand";

import { clientApi } from "../api/api";
import { FailureResponse } from "../api/failure.response.";
import { SuccessResponse } from "../api/success.response.";
import { MeResponse, MeUserResponse } from "./me.response";

type AuthState = {
    accessToken: string;
    currentUser: MeUserResponse | null;
    setAccessToken: (accessToken: string) => void;
    setCurrentUser: (user: MeUserResponse | null) => void;
    clearAccessToken: () => void;
    clearCurrentUser: () => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: "",
    currentUser: null,
    setAccessToken: (accessToken) => set({ accessToken }),
    setCurrentUser: (currentUser) => set({ currentUser }),
    clearAccessToken: () => set({ accessToken: "" }),
    clearCurrentUser: () => set({ currentUser: null }),
    clearAuth: () => set({ accessToken: "", currentUser: null }),
    isAuthenticated: () => Boolean(get().accessToken.trim()),
}));


export function getAccessToken(): string {
    return useAuthStore.getState().accessToken;
}
export function getCurrentUser(): MeUserResponse | null {
    return useAuthStore.getState().currentUser;
}

export function setAccessToken(newAccessToken: string) {
    useAuthStore.getState().setAccessToken(newAccessToken);
}
export function setCurrentUser(user: MeUserResponse) {
    useAuthStore.getState().setCurrentUser(user);
}

export function clearAccessToken() {
    useAuthStore.getState().clearAccessToken();
}
export function clearCurrentUser() {
    useAuthStore.getState().clearCurrentUser();
}

export function isAuthenticated() {
    return useAuthStore.getState().isAuthenticated(); 
}

export async function getMeClient() {
    try {
        const response = await clientApi.get<SuccessResponse<MeResponse>>("/auth/me");

        setAccessToken(response.data.data.accessToken);
        setCurrentUser(response.data.data.user);
                
    } catch (error) {
        if (axios.isAxiosError<FailureResponse<string>>(error)) {
            console.log(error.response?.data);
        }
    }
}
