import { useEffect, useState } from "react";
import { Book } from "@/types/book.ts";
import { getBooks } from "@/lib/bookApi";

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getBooks();
                setBooks(data);
            } catch (err) {
                setError("Erreur lors du chargement des livres");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return { books, loading, error };
};
