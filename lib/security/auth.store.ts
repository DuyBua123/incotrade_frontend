import { MeUserResponse } from "./me.response";


let accessToken: string = "";
let currentUser: MeUserResponse | null = null;


export function getAccessToken(): string {
    return accessToken;
}
export function getCurrentUser(): MeUserResponse {
    return currentUser!;
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