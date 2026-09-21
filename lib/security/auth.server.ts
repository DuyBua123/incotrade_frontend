import { cookies } from "next/headers";
import { api } from "../api/api";
import { MeResponse } from "./me.response";
import { SuccessResponse } from "../api/success.response.";


export async function getMeServer(): Promise<MeResponse | null> {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) return null;        

        const response = await api.get<SuccessResponse<MeResponse>>("/auth/me", {
            headers: {
                Cookie: `refreshToken=${refreshToken}`,
            },
        });        

        return response.data.data;
    } catch {
        return null;
    }
}