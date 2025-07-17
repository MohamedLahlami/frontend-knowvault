import { apiService } from "@/lib/api";
import {Book} from "@/types/book.ts";

export const getBooks = async (): Promise<Book[]> => {
    return await apiService.get<Book[]>("/api/book", {
        requireAuth: false // change à true si l'endpoint est sécurisé
    });
};
