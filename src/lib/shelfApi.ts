import { apiService } from "@/lib/api";
import {Shelf} from "@/types/shelf.ts";
import {PaginatedResponse} from "@/types/pagination.ts";

export const getShelves = async (
    token: string,
    page: number = 0,
    size: number = 6
): Promise<PaginatedResponse<Shelf>> => {
    return await apiService.get<PaginatedResponse<Shelf>>(
        `/api/shelf/paginated?page=${page}&size=${size}`,
        {
            requireAuth: true,
            token: token,
        }
    );
};

export const createShelf = async (shelfData: Partial<Shelf>, token: string): Promise<Shelf> => {
    return await apiService.post<Shelf>("/api/shelf", shelfData, {
        requireAuth: true,
        token: token,
    });
};

export const deleteShelf = async (id: number, token: string): Promise<void> => {
    await apiService.delete(`/api/shelf/${id}`, {
        requireAuth: true,
        token: token,
    });
};

export const updateShelf = async (
    id: number,
    shelfData: Partial<Shelf>,
    token: string
): Promise<Shelf> => {
    return await apiService.put<Shelf>(`/api/shelf/${id}`, shelfData, {
        requireAuth: true,
        token: token,
    });
};

export const getShelfById = async (id: number, token: string): Promise<Shelf> => {
    return await apiService.get<Shelf>(`/api/shelf/${id}`, {
        requireAuth: true,
        token: token,
    });
};
