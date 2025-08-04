import { apiService } from "@/lib/api";
import { Dashboard } from "@/types/dashboard.ts";

export const getDashboard = async (token: string): Promise<Dashboard> => {
    return await apiService.get<Dashboard>("/api/statistics/dashboard", {
        requireAuth: true,
        token: token,
    });
};
