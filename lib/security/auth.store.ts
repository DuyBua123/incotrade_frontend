
import axios from "axios";
import { api } from "../api/api";
import { FailureResponse } from "../api/failure.response.";
import { SuccessResponse } from "../api/success.response.";
import { MeResponse, MeUserResponse } from "./me.response";


let accessToken: string = "";
let currentUser: MeUserResponse | null = null;


export function getAccessToken(): string {
    return accessToken;
}
export function getCurrentUser(): MeUserResponse | null {
    return currentUser;
}

export function setAccessToken(newAccessToken: string) {
    accessToken = newAccessToken;
}
export function setCurrentUser(user: MeUserResponse) {
    currentUser = user;
}

export function clearAccessToken() {
    accessToken = "";
}
export function clearCurrentUser() {
    currentUser = null;
}

export function isAuthenticated() {
    return Boolean(accessToken.trim()); 
}

export async function getMeClient() {
    try {
        const response = await api.get<SuccessResponse<MeResponse>>("/auth/me");

        setAccessToken(response.data.data.accessToken);
        setCurrentUser(response.data.data.user);
                
    } catch (error) {
        if (axios.isAxiosError<FailureResponse<string>>(error)) {
            console.log(error.response?.data);
        }
    }
}
