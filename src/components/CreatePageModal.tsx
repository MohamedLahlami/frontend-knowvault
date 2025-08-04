import React, { useState } from "react";
import { createPage } from "@/lib/pageApi";
import { Page, PageStatus } from "@/types/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import MarkdownEditor from "@/components/MarkdownEditor"; // ton éditeur markdown custom
import { marked } from "marked";

interface CreatePageModalProps {
  chapterId: number;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newPage: Page) => void;
  token: string;
}

export default function CreatePageModal({
  chapterId,
  isOpen,
  onClose,
  onCreated,
  token,
}: CreatePageModalProps) {
  const [pageNumber, setPageNumber] = useState<number | "">("");
  const [markDownContent, setMarkDownContent] = useState<string>("");
  const [status, setStatus] = useState<PageStatus>(PageStatus.Draft);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (
      pageNumber === "" ||
      !Number.isInteger(pageNumber) ||
      pageNumber <= 0 ||
      !markDownContent.trim()
    ) {
      setError(
        "Le numéro de page doit être un entier positif et le contenu Markdown est obligatoire."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const htmlContent = await marked.parse(markDownContent);

      const newPage = await createPage(
        {
          chapterId,
          pageNumber,
          content: htmlContent,
          markDownContent,
          status,
        },
        token
      );

      onCreated(newPage);

      setPageNumber("");
      setMarkDownContent("");
      setStatus(PageStatus.Draft);

      onClose();
    } catch (err) {
      console.error("Erreur création page:", err);
      setError("Erreur lors de la création de la page.");
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
          {/* Numéro de page */}
          <div>
            <label htmlFor="pageNumber" className="block font-semibold mb-1">
              Numéro de page
            </label>
            <input
              type="number"
              id="pageNumber"
              className="w-full rounded border px-3 py-2"
              value={pageNumber}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") setPageNumber("");
                else setPageNumber(Number(val));
              }}
              min={1}
              step={1}
            />
          </div>

          {/* Sélecteur status */}
          <div>
            <label htmlFor="status" className="block font-semibold mb-1">
              Statut
            </label>
            <select
              id="status"
              className="w-full rounded border px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as PageStatus)}
            >
              <option value={PageStatus.Draft}>Brouillon</option>
              <option value={PageStatus.Published}>Publié</option>
              <option value={PageStatus.Archived}>Archivé</option>
            </select>
          </div>

          {/* Editeur Markdown */}
          <div>
            <label className="block font-semibold mb-1">Contenu Markdown</label>
            <MarkdownEditor
              initialMarkdown={markDownContent}
              onChange={setMarkDownContent}
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
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
