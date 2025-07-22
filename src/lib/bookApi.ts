import { apiService } from "@/lib/api";
import { Book } from "@/types/book.ts";

export const getBooks = async (token: string): Promise<Book[]> => {
  return await apiService.get<Book[]>("/api/book", {
    requireAuth: true,
    token,
  });
};

export const createBook = async (
  bookTitle: string,
  shelfId: number,
  token: string
): Promise<Book> => {
  return await apiService.post<Book>(
    "/api/book",
    {
      bookTitle,
      shelfId,
    },
    {
      requireAuth: true,
      token,
    }
  );
};
