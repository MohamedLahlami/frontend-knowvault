import { useEffect, useState, useCallback } from "react";
import { Book } from "@/types/book.ts";
import {
  getBooks,
  createBook,
  deleteBook,
  PaginatedBooks,
  searchBooks,
  updateBook,
} from "@/lib/bookApi";
import { useAuth } from "react-oidc-context";

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const token = auth.user?.access_token;
  const user = auth.user as {
    preferred_username?: string;
    name?: string;
    email?: string;
  };

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("bookTitle,asc");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      let data: PaginatedBooks;
      if (searchQuery.trim() !== "") {
        data = await searchBooks(token, searchQuery, page, size, sort);
      } else {
        data = await getBooks(token, page, size, sort);
      }
      setBooks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      // If current page is now empty and not first, go to previous page
      if (data.content.length === 0 && page > 0) {
        setPage(page - 1);
      }
    } catch (err) {
      setError("Erreur lors du chargement des livres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, page, size, sort, searchQuery]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Add book with optimistic update
  const addBook = async (
    bookTitle: string,
    shelfId: number,
    description: string
  ) => {
    if (!token) throw new Error("No authentication token available");
    // Use user info for utilisateurId
    const utilisateurLogin =
      user?.preferred_username || user?.name || user?.email || "utilisateur";
    const tempBook: Book = {
      id: Date.now(), // Temporary ID
      bookTitle,
      utilisateurLogin,
      shelfId,
      pageCount: 0,
      description,
    };
    setBooks((prev) => [tempBook, ...prev]);
    try {
      const created = await createBook(bookTitle, shelfId, description, token);
      setBooks((prev) => [
        created,
        ...prev.filter((b) => b.id !== tempBook.id),
      ]);
      return created;
    } catch (err) {
      setBooks((prev) => prev.filter((b) => b.id !== tempBook.id));
      setError("Erreur lors de la création du livre");
      throw err;
    }
  };

  // Delete book with optimistic update
  const deleteBookById = async (bookId: number) => {
    if (!token) throw new Error("No authentication token available");
    // Optimistically remove the book from the list
    const prevBooks = books;
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    try {
      await deleteBook(bookId, token);
    } catch (err) {
      setBooks(prevBooks); // Rollback on error
      setError("Erreur lors de la suppression du livre");
      throw err;
    }
  };

  // Edit book
  const editBook = async (
    bookId: number,
    bookTitle: string,
    description: string,
    shelfId: number
  ) => {
    if (!token) throw new Error("No authentication token available");
    try {
      const updated = await updateBook(
        bookId,
        bookTitle,
        description,
        shelfId,
        token
      );
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      return updated;
    } catch (err) {
      setError("Erreur lors de la modification du livre");
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    addBook,
    editBook,
    deleteBook: deleteBookById,
    refetchBooks: fetchBooks,
    page,
    setPage,
    size,
    setSize,
    sort,
    setSort,
    totalPages,
    totalElements,
    searchQuery,
    setSearchQuery,
  };
};
