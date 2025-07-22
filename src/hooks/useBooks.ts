import { useEffect, useState, useCallback } from "react";
import { Book } from "@/types/book.ts";
import { getBooks, createBook } from "@/lib/bookApi";
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

  const fetchBooks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getBooks(token);
      setBooks(data);
    } catch (err) {
      setError("Erreur lors du chargement des livres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Add book with optimistic update
  const addBook = async (bookTitle: string, shelfId: number) => {
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
    };
    setBooks((prev) => [tempBook, ...prev]);
    try {
      const created = await createBook(bookTitle, shelfId, token);
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

  return { books, loading, error, addBook, refetchBooks: fetchBooks };
};
