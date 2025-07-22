import { apiService } from "@/lib/api";
import {Shelf} from "@/types/shelf.ts";

export const getShelves = async (token: string): Promise<Shelf[]> => {
    return await apiService.get<Shelf[]>("/api/shelf", {
        requireAuth: true,
        token: token,
    });
};
