import { Book, Plus, Search, Calendar, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreateBookDialog } from "@/components/BookDialog";
import { EditBookDialog } from "@/components/BookDialog";
import { useBooks } from "@/hooks/useBooks";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useGetShelfById } from "@/hooks/useShelves";
import { Book as BookType } from "@/types/book";

// Component to display shelf label with proper loading state
function ShelfLabel({ shelfId }: { shelfId: number }) {
  const { shelf, loading, error } = useGetShelfById(shelfId);

  if (loading) {
    return <span>Chargement...</span>;
  }

  if (error || !shelf) {
    return <span>Étagère inconnue</span>;
  }

  return <span>{shelf.label}</span>;
}

export default function Books() {
  const {
    books,
    loading,
    error,
    refetchBooks,
    deleteBook,
    page,
    setPage,
    size,
    setSize,
    sort,
    setSort,
    totalPages,
    totalElements,
    searchQuery,
    setSearchQuery,
  } = useBooks();
  const { toast } = useToast();

  const handleBookCreated = () => {
    refetchBooks();
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editBookDialog, setEditBookDialog] = useState<{
    open: boolean;
    book: BookType | null;
  }>({ open: false, book: null });
  // Remove search and setSearch

  // Remove filteredBooks and use books directly

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteBook(confirmDeleteId);
      setConfirmDeleteId(null);
      toast({
        title: "Livre supprimé",
        description: "Le livre a été supprimé avec succès.",
        duration: 3000,
      });
    } catch (err) {
      setDeleteError("Erreur lors de la suppression du livre.");
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le livre.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Show toast for general loading errors
  if (error) {
    toast({
      title: "Erreur",
      description: error,
      variant: "destructive",
    });
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in relative">
      {/* Custom Modal for Delete Confirmation */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6 text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est
              irréversible.
            </p>
            {deleteError && <p className="text-red-500 mb-2">{deleteError}</p>}
            <div className="flex justify-center gap-4">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Book Dialog */}
      {editBookDialog.book && (
        <EditBookDialog
          book={editBookDialog.book}
          open={editBookDialog.open}
          onOpenChange={(open) => setEditBookDialog((v) => ({ ...v, open }))}
          onBookEdited={() => {
            setEditBookDialog({ open: false, book: null });
            refetchBooks();
          }}
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Livres</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez tous vos livres de documentation
          </p>
        </div>
        <CreateBookDialog
          buttonClassName="flex items-center gap-2 bg-accent hover:bg-accent/90"
          buttonVariant="default"
          buttonChildren={
            <>
              <Book className="h-5 w-5" />
              <span>Nouveau livre</span>
            </>
          }
          onBookCreated={handleBookCreated}
        />
      </div>

      {/* Search, page size, and sort controls at the top */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-2">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un livre..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0); // Reset to first page on new search
            }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <label className="text-sm">Taille de page:</label>
          <Select
            value={String(size)}
            onValueChange={(v) => setSize(Number(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <label className="text-sm">Trier par:</label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bookTitle,asc">Titre (A-Z)</SelectItem>
              <SelectItem value="bookTitle,desc">Titre (Z-A)</SelectItem>
              <SelectItem value="createdAt,desc">
                Date de création (récent)
              </SelectItem>
              <SelectItem value="createdAt,asc">
                Date de création (ancien)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Liste des livres */}
      {!loading && !error && (
        <div className="space-y-4">
          {books.length > 0 ? (
            books.map((book) => (
              <Card
                key={book.id}
                className="hover:shadow-md transition-all duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Book className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-xl">
                          <Link
                            to={`/books/${book.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {book.bookTitle}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-sm max-w-2xl">
                          {book.description}
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Auteur: {book.utilisateurLogin}</span>
                          <Badge variant="secondary">
                            Étagère : <ShelfLabel shelfId={book.shelfId} />
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {book.createdAt?.slice(0, 10)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        {book.pageCount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        page{book.pageCount > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/books/${book.id}`}>Consulter</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditBookDialog({ open: true, book })}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirmDeleteId(book.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <Link
                      to={`/shelves/${book.shelfId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Voir l'étagère →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucun livre trouvé
              </h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre premier livre de documentation.
              </p>
              <CreateBookDialog
                buttonClassName="bg-accent hover:bg-accent/90"
                buttonVariant="default"
                buttonChildren={
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un livre
                  </>
                }
                onBookCreated={handleBookCreated}
              />
            </div>
          )}
          {/* Pagination controls and total count at the bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-sm text-muted-foreground">
              {totalElements} livres trouvés
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 0 || loading}
              >
                Précédent
              </button>
              <span className="text-sm">
                Page {page + 1} sur {totalPages}
              </span>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page + 1 >= totalPages || loading}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
