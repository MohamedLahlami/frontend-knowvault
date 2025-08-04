import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookById } from "@/lib/bookApi";
import { useAuth } from "react-oidc-context";
import { EditBookDialog } from "@/components/BookDialog";
import { Book } from "@/types/book"

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookById(Number(id), auth.user?.access_token);
        setBook(data);
      } catch (err) {
        setError("Erreur lors du chargement du livre.");
      } finally {
        setLoading(false);
      }
    };
    if (id && auth.user?.access_token) fetchBook();
  }, [id, auth.user]);

  const refetchBook = async () => {
    if (id && auth.user?.access_token) {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookById(Number(id), auth.user?.access_token);
        setBook(data);
      } catch (err) {
        setError("Erreur lors du chargement du livre.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Chargement du livre...
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }
  if (!book) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        📚 Livre non trouvé.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{book.bookTitle}</h1>
        <Badge variant="secondary">Étagère : {book.shelfId}</Badge>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-muted-foreground">
            Détails du livre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base text-foreground">{book.description}</p>
          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Auteur:</span>{" "}
              {book.utilisateurLogin}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {book.updatedAt}
            </div>
            <div>
              <span className="font-medium text-foreground">
                Nombre de pages:
              </span>{" "}
              {book.pageCount}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/books">← Retour à la liste</Link>
        </Button>
        <Button variant="default" onClick={() => setEditDialogOpen(true)}>
          Modifier ce livre
        </Button>
        <Button variant="default" asChild>
          <Link to={`/books/${book.id}/chapitres`}>Voir les chapitres</Link>
        </Button>
        <Button variant="default" asChild>
          <Link to={`/shelves/${book.shelfId}`}>Voir l'étagère</Link>
        </Button>
      </div>
      {editDialogOpen && (
        <EditBookDialog
          book={book}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onBookEdited={() => {
            setEditDialogOpen(false);
            refetchBook();
          }}
        />
      )}
    </div>
  );
}
