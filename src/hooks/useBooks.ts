import { useEffect, useState } from "react";
import { Book } from "@/types/book.ts";
import { getBooks, createBook } from "@/lib/bookApi";

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

    // Add book with optimistic update
    const addBook = async (bookTitle: string, shelfId: number) => {
        // Optimistically add a temporary book
        const tempBook: Book = {
            id: Date.now(), // Temporary ID
            bookTitle,
            utilisateurId: "optimistic", // Placeholder
            shelfId,
            pageCount: 0,
        };
        setBooks((prev) => [tempBook, ...prev]);
        try {
            const created = await createBook(bookTitle, shelfId);
            setBooks((prev) => [created, ...prev.filter(b => b.id !== tempBook.id)]);
            return created;
        } catch (err) {
            setBooks((prev) => prev.filter(b => b.id !== tempBook.id));
            setError("Erreur lors de la création du livre");
            throw err;
        }
    };

    return { books, loading, error, addBook };
};
