import { useParams } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { useBooksByShelf, useGetShelfById } from "@/hooks/useShelves.ts";

export default function ShelfDetails() {
    const { id } = useParams<{ id: string }>();
    const shelfId = Number(id);

    const { shelf, loading: shelfLoading, error: shelfError } = useGetShelfById(shelfId);
    const { books, loading: booksLoading, error: booksError } = useBooksByShelf(shelfId);

    if (shelfLoading || booksLoading) return <div className="p-6">Chargement...</div>;
    if (shelfError) return <div className="p-6 text-red-500">{shelfError}</div>;
    if (!shelf) return <div className="p-6">Étagère introuvable</div>;
    if (booksError) return <div className="p-6 text-red-500">{booksError}</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{shelf.label}</h1>
            <p className="text-muted-foreground">{shelf.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
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
