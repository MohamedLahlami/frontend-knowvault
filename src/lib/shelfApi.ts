import api, { apiService } from "@/lib/api";
import {Shelf} from "@/types/shelf.ts";
import {PaginatedResponse} from "@/types/pagination.ts";
import {Book} from "@/types/book.ts";

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

export const createShelf = async (shelfData: Partial<Shelf> | FormData, token: string): Promise<Shelf> => {
    const isFormData = shelfData instanceof FormData;
    return await apiService.post<Shelf>(
        "/api/shelf",
        shelfData,
        {
            requireAuth: true,
            token: token,
            headers: isFormData ? {} : undefined // pas de Content-Type si FormData
        }
    );
};

export const deleteShelf = async (id: number, token: string): Promise<void> => {
    await apiService.delete(`/api/shelf/${id}`, {
        requireAuth: true,
        token: token,
    });
};

export const updateShelf = async (
    id: number,
    shelfData: Partial<Shelf> | FormData,
    token: string
): Promise<Shelf> => {
    const isFormData = shelfData instanceof FormData;
    return await apiService.put<Shelf>(
        `/api/shelf/${id}`,
        shelfData,
        {
            requireAuth: true,
            token: token,
            headers: isFormData ? {} : undefined
        }
    );
};

export const getShelfById = async (id: number): Promise<Shelf> => {
    return await apiService.get<Shelf>(`/api/shelf/${id}`);
};

export const getBooksByShelf = async (id: number): Promise<Book[]> => {
    return await apiService.get<Book[]>(`/api/shelf/${id}/books`);
};

export const getShelvesPublic = async () => {
    const res = await apiService.get("/api/shelf/public");
    return res;
};