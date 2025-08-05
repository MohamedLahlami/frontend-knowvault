import React, { useEffect, useState } from "react";
import { marked } from "marked";
import { createPage } from "@/lib/pageApi";
import { getBooks } from "@/lib/bookApi";
import { getChaptersByBookId } from "@/lib/chapterApi";

import { Page, PageStatus } from "@/types/page";
import { Book } from "@/types/book";
import { Chapter } from "@/types/chapter";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import MarkdownEditor from "@/components/MarkdownEditor";

interface DashboardPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newPage: Page) => void;
  token: string;
}

export default function DashboardPageModal({
  isOpen,
  onClose,
  onCreated,
  token,
}: DashboardPageModalProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  const [pageNumber, setPageNumber] = useState<number | "">("");
  const [markDownContent, setMarkDownContent] = useState<string>("");
  const [status, setStatus] = useState<PageStatus>(PageStatus.Draft);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les livres
  useEffect(() => {
    if (!isOpen) return;
    const fetchBooks = async () => {
      try {
        const response = await getBooks(token);
        setBooks(response.content); // paginé
      } catch (err) {
        console.error("Erreur lors du chargement des livres :", err);
      }
    };
    fetchBooks();
  }, [isOpen, token]);

  // Charger les chapitres du livre sélectionné
  useEffect(() => {
    if (!selectedBookId || selectedBookId <= 0) {
      setChapters([]); // vide la liste si aucun livre sélectionné ou id invalide
      return;
    }
  
    const fetchChapters = async () => {
      try {
        const response = await getChaptersByBookId(selectedBookId, token);
        setChapters(response);
      } catch (err) {
        console.error("Erreur lors du chargement des chapitres :", err);
        setChapters([]); // vider en cas d'erreur
      }
    };
    fetchChapters();
  }, [selectedBookId, token]);  
  const handleCreate = async () => {
    if (
      pageNumber === "" ||
      !Number.isInteger(pageNumber) ||
      pageNumber <= 0 ||
      !markDownContent.trim() ||
      !selectedChapterId
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const htmlContent = await marked.parse(markDownContent);

      const newPage = await createPage(
        {
          chapterId: selectedChapterId,
          pageNumber,
          content: htmlContent,
          markDownContent,
          status,
        },
        token
      );

      onCreated(newPage);
      onClose();

      // Reset
      setSelectedBookId(null);
      setSelectedChapterId(null);
      setPageNumber("");
      setMarkDownContent("");
      setStatus(PageStatus.Draft);
    } catch (err) {
      console.error("Erreur lors de la création de la page :", err);
      setError("La création de la page a échoué.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle page</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sélection du livre */}
          <div>
            <label className="block font-semibold mb-1">Livre</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={selectedBookId ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedBookId(id);
                setSelectedChapterId(null);
              }}
            >
              <option value="">-- Sélectionnez un livre --</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.bookTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection du chapitre */}
          <div>
            <label className="block font-semibold mb-1">Chapitre</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={selectedChapterId ?? ""}
              onChange={(e) => setSelectedChapterId(Number(e.target.value))}
              disabled={!selectedBookId}
            >
              <option value="">-- Sélectionnez un chapitre --</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.chapterTitle}
                </option>
              ))}
            </select>
          </div>

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

          {/* Markdown Editor */}
          <div>
            <label className="block font-semibold mb-1">Contenu Markdown</label>
            <MarkdownEditor
              initialMarkdown={markDownContent}
              onChange={setMarkDownContent}
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Création..." : "Créer la page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
