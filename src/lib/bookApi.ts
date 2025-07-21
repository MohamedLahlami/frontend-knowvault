import { apiService } from "@/lib/api";
import { Book } from "@/types/book";

export const getBooks = async (token: string): Promise<Book[]> => {
    return await apiService.get<Book[]>("/api/book", {
        requireAuth: true,
        token: token,
    });
};
