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
  const auth = useAuth();
  const token = auth.user?.access_token;
  const user = auth.user as {
    preferred_username?: string;
    name?: string;
    email?: string;
  };

  // États pour la pagination, tri, recherche, etc.
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("bookTitle,asc");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = useCallback(async () => {
    if (!auth.isAuthenticated || !token) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

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
      // Si la page est vide et ce n'est pas la première page, on recule d'une page
      if (data.content.length === 0 && page > 0) {
        setPage(page - 1);
      }
    } catch (err) {
      setError("Erreur lors du chargement des livres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, token, page, size, sort, searchQuery]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Ajout d'un livre avec update optimiste
  const addBook = async (bookTitle: string, shelfId: number) => {
    if (!token) throw new Error("No authentication token available");

    const utilisateurLogin =
      user?.preferred_username || user?.name || user?.email || "utilisateur";

    const tempBook: Book = {
      id: Date.now(), // ID temporaire
      bookTitle,
      utilisateurLogin,
      shelfId,
      pageCount: 0,
    };

    setBooks((prev) => [tempBook, ...prev]);

    try {
      const created = await createBook(bookTitle, shelfId, token);
      setBooks((prev) =>
        [created, ...prev.filter((b) => b.id !== tempBook.id)]
      );
      return created;
    } catch (err) {
      setBooks((prev) => prev.filter((b) => b.id !== tempBook.id));
      setError("Erreur lors de la création du livre");
      throw err;
    }
  };

  // Suppression d'un livre avec update optimiste
  const deleteBookById = async (bookId: number) => {
    if (!token) throw new Error("No authentication token available");

    const prevBooks = books;
    setBooks((prev) => prev.filter((b) => b.id !== bookId));

    try {
      await deleteBook(bookId, token);
    } catch (err) {
      setBooks(prevBooks); // rollback si erreur
      setError("Erreur lors de la suppression du livre");
      throw err;
    }
  };

  // Modification d'un livre
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
