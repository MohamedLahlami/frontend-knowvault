import { apiService } from "@/lib/api";
import { Book } from "@/types/book.ts";

export interface PaginatedBooks {
  content: Book[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const getBooks = async (
  token: string,
  page: number = 0,
  size: number = 10,
  sort: string = "bookTitle,asc"
): Promise<PaginatedBooks> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });
  return await apiService.get<PaginatedBooks>(
    `/api/book?${params.toString()}`,
    {
      requireAuth: true,
      token,
    }
  );
};

export const createBook = async (
  bookTitle: string,
  shelfId: number,
  description: string,
  token: string
): Promise<Book> => {
  return await apiService.post<Book>(
    "/api/book",
    {
      bookTitle,
      shelfId,
      description,
    },
    {
      requireAuth: true,
      token,
    }
  );
};

export const deleteBook = async (
  bookId: number,
  token: string
): Promise<void> => {
  await apiService.delete(`/api/book/${bookId}`, {
    requireAuth: true,
    token,
  });
};

export const searchBooks = async (
  token: string,
  q: string,
  page: number = 0,
  size: number = 10,
  sort: string = "bookTitle,asc"
): Promise<PaginatedBooks> => {
  const params = new URLSearchParams({
    q,
    page: page.toString(),
    size: size.toString(),
    sort,
  });
  return await apiService.get<PaginatedBooks>(
    `/api/book/search?${params.toString()}`,
    {
      requireAuth: true,
      token,
    }
  );
};

export const updateBook = async (
  bookId: number,
  bookTitle: string,
  description: string,
  shelfId: number,
  token: string
): Promise<Book> => {
  return await apiService.put<Book>(
    `/api/book/${bookId}`,
    {
      bookTitle,
      description,
      shelfId,
    },
    {
      requireAuth: true,
      token,
    }
  );
};

export const getBookById = async (
  bookId: number,
  token: string
): Promise<Book> => {
  return await apiService.get<Book>(`/api/book/${bookId}`, {
    requireAuth: true,
    token,
  });
};
