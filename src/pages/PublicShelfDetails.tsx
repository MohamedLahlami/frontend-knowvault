import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { getShelfById, getBooksByShelf } from "@/lib/shelfApi.ts";
import { Shelf } from "@/types/shelf";
import { Book } from "@/types/book";

export default function PublicShelfDetails() {
    const { id } = useParams<{ id: string }>();
    const shelfId = Number(id);

    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShelfAndBooks = async () => {
            setLoading(true);
            try {
                // Récupérer les infos de l'étagère
                const shelfData = await getShelfById(shelfId);
                setShelf(shelfData);

                // Récupérer les livres de l'étagère
                const booksData = await getBooksByShelf(shelfId);
                setBooks(booksData);

                setError(null);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement de l'étagère ou des livres");
            } finally {
                setLoading(false);
            }
        };

        fetchShelfAndBooks();
    }, [shelfId]);

    if (loading) return <div className="p-6">Chargement...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!shelf) return <div className="p-6">Étagère introuvable</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{shelf.label}</h1>
            <p className="text-muted-foreground">{shelf.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>

            {books.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    Aucun livre dans cette étagère
                </div>
            )}
        </div>
    );
}
