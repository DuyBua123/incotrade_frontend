
let accessToken: string = "";


export function getAccessToken(): string {
    return accessToken;
}

export function setAccessToken(accessToken: string) {
    accessToken = accessToken;
}

export function clearAccessToken() {
    accessToken = "";
} 