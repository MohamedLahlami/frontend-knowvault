import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookById } from "@/lib/bookApi";
import { useAuth } from "react-oidc-context";
import { EditBookDialog } from "@/components/BookDialog";
import SummarizeBookDialog from "@/components/SummarizeBookDialog";
import { Book } from "@/types/book";
import { getChaptersByBookId } from "@/lib/chapterApi";
import type { Chapter } from "@/types/chapter";
import { Sparkles } from "lucide-react";

export default function BookDetails() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);

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

  useEffect(() => {
    const fetchChapters = async () => {
      if (!id || !auth.user?.access_token) return;
      setChaptersLoading(true);
      try {
        const data = await getChaptersByBookId(
          Number(id),
          auth.user.access_token
        );
        setChapters(data);
      } catch (err) {
        // Silently ignore here; main error surface is book load
        console.error("Erreur lors du chargement des chapitres", err);
      } finally {
        setChaptersLoading(false);
      }
    };
    fetchChapters();
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

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Chapitres</CardTitle>
        </CardHeader>
        <CardContent>
          {chaptersLoading ? (
            <div className="text-sm text-muted-foreground">
              Chargement des chapitres…
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Aucun chapitre trouvé.
            </div>
          ) : (
            <ul className="space-y-2">
              {chapters.map((ch) => (
                <li key={ch.id} className="text-sm">
                  <Link
                    to={`/chapters/${ch.id}`}
                    className="underline hover:text-foreground"
                  >
                    {ch.chapterTitle}
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
        <SummarizeBookDialog
          bookId={book.id}
          trigger={
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Sparkles className="h-4 w-4 mr-2" /> Résumer avec l'IA
            </Button>
          }
        />
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
