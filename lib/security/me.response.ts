export type MeUserResponse = {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

export type MeResponse = {
    accessToken: string;
    user: MeUserResponse;
}