import { useEffect, useState } from "react";
import { ListTree, Plus, Search, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Chapter } from "@/types/chapter";
import { Book } from "@/types/book";
import { useAuth } from "react-oidc-context";
import { getChapters, deleteChapter } from "@/lib/chapterApi";
import { getBooks } from "@/lib/bookApi";
import { getPages } from "@/lib/pageApi";
import { Page } from "@/types/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChapterModal } from "@/components/ChapterModal";

export default function Chapters() {
  const auth = useAuth();
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.user) return;
      try {
        const [chaptersData, booksData, pagesData] = await Promise.all([
          getChapters(auth.user.access_token),
          getBooks(auth.user.access_token),
          getPages(auth.user.access_token),
        ]);
        setChapters(chaptersData);
        setBooks(booksData.content);
        setPages(pagesData);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.user]);

  if (loading) {
    return <p className="p-6">Chargement...</p>;
  }
  const filteredChapters = chapters.filter((chapter) =>
    chapter.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const chaptersByBook = books
    .map((book) => {
      const bookChapters = filteredChapters.filter(
        (ch) => ch.bookId === book.id
      );
      return bookChapters.length > 0 ? { book, chapters: bookChapters } : null;
    })
    .filter(
      (item): item is { book: Book; chapters: Chapter[] } => item !== null
    );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chapitres</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez tous vos chapitres de documentation
          </p>
        </div>
        <ChapterModal
          mode="create"
          token={auth.user.access_token}
          onUpdated={async () => {
            if (!auth.user) return;
            const updated = await getChapters(auth.user.access_token);
            setChapters(updated);
          }}
          trigger={
            <Button className="flex items-center gap-2 bg-accent hover:bg-accent/90">
              <Plus className="h-5 w-5" />
              <span>Nouveau chapitre</span>
            </Button>
          }
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un chapitre..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Affichage groupé par livre */}
      {chaptersByBook.map(({ book, chapters }) => (
        <div key={book.id} className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">
            <br />
            {book.bookTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => {
              const pageCount = pages.filter(
                (p) => p.chapterId === chapter.id
              ).length;

              return (
                <Card
                  key={chapter.id}
                  className="hover:shadow-md transition-all duration-200 h-full flex flex-col relative"
                >
                  <div className="absolute top-5 right-8 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow">
                    {pageCount} pages
                  </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
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
                        const updated = await getChapters(
                          auth.user.access_token
                        );
                        setChapters(updated);
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
              );
            })}
          </div>
        </div>
      ))}

      {/* Dialog de confirmation */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              <br />
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

      {/* Message si aucun chapitre */}
      {chapters.length === 0 && (
        <div className="text-center py-12">
          <ListTree className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucun chapitre trouvé
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre premier chapitre.
          </p>
          <ChapterModal
            mode="create"
            token={auth.user.access_token}
            onUpdated={async () => {
              if (!auth.user) return;
              const updated = await getChapters(auth.user.access_token);
              setChapters(updated);
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
