import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteChapter, getChapters } from "@/lib/chapterApi";
import { getBookById } from "@/lib/bookApi";
import { useAuth } from "react-oidc-context";
import { Chapter } from "@/types/chapter";
import { Book } from "@/types/book";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTree, Trash, Plus, Search} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChapterModal } from "@/components/ChapterModal";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ChaptersByBook() {
  const { id } = useParams(); // id du livre
  const auth = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.user || !id) return;
      setLoading(true);
      try {
        // Récupérer le livre
        const bookData = await getBookById(Number(id), auth.user.access_token);
        setBook(bookData);

        // Récupérer tous les chapitres
        const allChapters = await getChapters(auth.user.access_token);

        // Filtrer ceux du livre en question
        const filteredChapters = allChapters.filter(ch => ch.bookId === Number(id));
        setChapters(filteredChapters);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, auth.user]);

  const filteredChapters = chapters.filter((chapter) =>
    chapter.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setSelectedChapterId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedChapterId || !auth.user) return;

    try {
      await deleteChapter(selectedChapterId, auth.user.access_token);
      setChapters((prev) => prev.filter((c) => c.id !== selectedChapterId));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    } finally {
      setOpenDialog(false);
      setSelectedChapterId(null);
    }
  };

  if (loading) {
    return <p className="p-6">Chargement...</p>;
  }

  if (!book) {
    return <p className="p-6 text-center text-red-500">Livre non trouvé</p>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chapitres de {book.bookTitle}</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez les chapitres du livre sélectionné
          </p>
        </div>
        <ChapterModal
          mode="create"
          token={auth.user.access_token}
          initialBookId={book.id}
          onUpdated={async () => {
            if (!auth.user) return;
            const updated = await getChapters(auth.user.access_token);
            setChapters(updated.filter(ch => ch.bookId === book.id));
          }}
          trigger={
            <Button className="flex items-center gap-2 bg-accent hover:bg-accent/90">
              <Plus className="h-5 w-5" />
              <span>Nouveau chapitre</span>
            </Button>
          }
        />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un chapitre..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map((chapter) => (
          <Card
            key={chapter.id}
            className="hover:shadow-md transition-all duration-200 h-full flex flex-col relative"
          >
            <CardHeader className="flex-grow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ListTree className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-4">
                  <CardTitle className="text-xxl">
                    <Link
                      to={`/chapters/${chapter.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {chapter.chapterTitle}
                    </Link>
                  </CardTitle>
                  <Badge variant="outline" className="text-primary">
                    {book.bookTitle}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to={`/chapters/${chapter.id}`}>
                  Consulter les pages
                </Link>
              </Button>

              <ChapterModal
                mode="edit"
                token={auth.user.access_token}
                chapterId={chapter.id}
                initialTitle={chapter.chapterTitle}
                initialBookId={chapter.bookId}
                onUpdated={async () => {
                  if (!auth.user) return;
                  const updated = await getChapters(auth.user.access_token);
                  setChapters(updated.filter(ch => ch.bookId === book.id));
                }}
                trigger={
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                }
              />

              <Button
                variant="outline"
                size="sm"
                className="px-3"
                onClick={() => handleDelete(chapter.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce chapitre ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {chapters.length === 0 && (
        <div className="text-center py-12">
          <ListTree className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucun chapitre trouvé pour ce livre
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre premier chapitre.
          </p>
          <ChapterModal
            mode="create"
            token={auth.user.access_token}
            initialBookId={book.id}
            onUpdated={async () => {
              if (!auth.user) return;
              const updated = await getChapters(auth.user.access_token);
              setChapters(updated.filter(ch => ch.bookId === book.id));
            }}
            trigger={
              <Button className="flex items-center gap-2 bg-accent hover:bg-accent/90">
                <Plus className="h-5 w-5" />
                <span>Nouveau chapitre</span>
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
