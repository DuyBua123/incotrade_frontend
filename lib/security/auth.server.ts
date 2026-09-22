import { cookies } from "next/headers";
import { api } from "../api/api";
import { MeResponse } from "./me.response";
import { SuccessResponse } from "../api/success.response.";
import { redirect } from "next/navigation";


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

export async function getAccessTokenServer(): Promise<string | null> {
    const me = await getMeServer();

    return me?.accessToken ?? null;
}

export async function getAuthorizationHeaderServer(): Promise<Record<string, string>> {
    const accessToken = await getAccessTokenServer();

    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

export async function requireAuth() {
    const response = await getMeServer();

    const user = response?.user;

    if (!user) {
        redirect("/login");
    }

    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();

    if (user.role !== "ADMIN") {
        redirect("/403");
    }

    return user;
}

export async function requireCustomer() {
    const user = await requireAuth();
    
    if (user.role !== "CUSTOMER") {
        redirect("/403");
    }

    return user;
}
