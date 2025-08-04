import React, { useEffect, useState } from "react";
import { marked } from "marked";
import { createPage } from "@/lib/pageApi";
import { Book } from "@/types/book";
import { Chapter } from "@/types/chapter";
import { Page, PageStatus } from "@/types/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useAuth } from "react-oidc-context";
import { getBooks } from "@/lib/bookApi";
import { getChaptersByBookId } from "@/lib/chapterApi"; 
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (page: Page) => void;
}

export default function DashboardCreatePageModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const auth = useAuth();
  const token = auth.user?.access_token ?? "";

  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [bookId, setBookId] = useState<number | "">("");
  const [chapterId, setChapterId] = useState<number | "">("");
  const [pageNumber, setPageNumber] = useState<number | "">("");
  const [markDownContent, setMarkDownContent] = useState("");
  const [status, setStatus] = useState<PageStatus>(PageStatus.Draft);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les livres
  useEffect(() => {
    if (!isOpen || !token) return;

    setError(null);

    getBooks(token)
      .then((data) => {
        setBooks(data.content ?? []);
      })
      .catch((err) => {
        console.error("Erreur chargement livres:", err);
        setBooks([]);
        setError("Erreur lors du chargement des livres");
      });
  }, [isOpen, token]);

  ///Charger les chapitres
  useEffect(() => {
    if (!bookId || !token) {
      setChapters([]);
      return;
    }

    getChaptersByBookId(bookId, token)
      .then((data) => {
        setChapters(data ?? []);
      })
      .catch((err) => {
        console.error("Erreur chargement chapitres :", err);
        setChapters([]);
      });
  }, [bookId, token]);

  const handleCreate = async () => {
    if (!bookId || !chapterId || !pageNumber || !markDownContent.trim()) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const html = await marked.parse(markDownContent);

      const page = await createPage(
        {
          chapterId,
          pageNumber,
          content: html,
          markDownContent,
          status,
        },
        token
      );

      onCreated(page);
      onClose();
      resetForm();
    } catch (err) {
      console.error("Erreur création page:", err);
      setError("Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBookId("");
    setChapterId("");
    setPageNumber("");
    setMarkDownContent("");
    setStatus(PageStatus.Draft);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nouvelle page</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sélection Livre */}
          <div>
            <label className="font-semibold block mb-1">Livre</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={bookId}
              onChange={(e) => {
                const val = e.target.value;
                setBookId(val === "" ? "" : Number(val));
                setChapterId(""); // reset chapitre sélectionné
              }}
            >
              <option value="">Sélectionner un livre</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.bookTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection Chapitre */}
          {bookId && (
            <div>
              <label className="font-semibold block mb-1">Chapitre</label>
              <select
                className="w-full rounded border px-3 py-2"
                value={chapterId}
                onChange={(e) => setChapterId(Number(e.target.value))}
              >
                <option value="">Sélectionner un chapitre</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.chapterTitle}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Numéro de page */}
          <div>
            <label className="block font-semibold mb-1">Numéro de page</label>
            <input
              type="number"
              className="w-full rounded border px-3 py-2"
              value={pageNumber}
              onChange={(e) =>
                setPageNumber(e.target.value === "" ? "" : Number(e.target.value))
              }
              min={1}
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block font-semibold mb-1">Statut</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as PageStatus)}
            >
              <option value={PageStatus.Draft}>Brouillon</option>
              <option value={PageStatus.Published}>Publié</option>
              <option value={PageStatus.Archived}>Archivé</option>
            </select>
          </div>

          {/* Éditeur Markdown */}
          <div>
            <label className="block font-semibold mb-1">Contenu</label>
            <MarkdownEditor
              initialMarkdown={markDownContent}
              onChange={setMarkDownContent}
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}
        </div>

        <DialogFooter className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
