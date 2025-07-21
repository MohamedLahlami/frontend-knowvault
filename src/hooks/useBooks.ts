import { useEffect, useState } from "react";
import { Book } from "@/types/book.ts";
import { getBooks } from "@/lib/bookApi";
import { useAuth } from "react-oidc-context";

export const useBooks = () => {
  const auth = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    if (!auth.isAuthenticated || !auth.user) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getBooks(auth.user.access_token);
      setBooks(data);
    } catch (err) {
      setError("Erreur lors du chargement des livres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [auth]);

  return { books, loading, error, refetch: fetchBooks };
};
