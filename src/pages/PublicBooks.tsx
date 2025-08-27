import { Book as BookIcon, Search, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getBooksPublic } from "@/lib/bookApi"; // <-- ton API
import { Book } from "@/types/book";
import {BookCard} from "@/components/BookCard.tsx"; // <-- type de Book

export default function PublicBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooksPublic(); // backend renvoie Book[]
      setBooks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des livres publics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
      (book) =>
          book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Chargement des livres...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <BookIcon className="h-8 w-8 text-primary"/>
          Livres publics
        </h1>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input
              placeholder="Rechercher un livre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
              <BookCard key={book.id} book={book}/>
          ))}
        </div>

        {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
              <h3 className="text-lg font-medium mb-2">Aucun livre trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
        )}
      </div>
  );
}
