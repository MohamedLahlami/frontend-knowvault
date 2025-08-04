import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { Shelf } from "@/types/shelf";
import { Book as BookType } from "@/types/book";

interface EditBookDialogProps {
  book: BookType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookEdited: () => void;
}

export function EditBookDialog({
  book,
  open,
  onOpenChange,
  onBookEdited,
}: EditBookDialogProps) {
  const [shelves, setShelves] = useState<Shelf[]>([]);

  const [form, setForm] = useState({
    bookTitle: book.bookTitle || "",
    shelfId: String(book.shelfId || ""),
  });

  useEffect(() => {
    if (open) {
      // On initialise le formulaire avec les données du livre
      setForm({
        bookTitle: book.bookTitle || "",
        shelfId: String(book.shelfId || ""),
      });

      // On charge les étagères
      axios
        .get<Shelf[]>("http://localhost:8081/api/shelf")
        .then((res) => {
          setShelves(res.data);
        })
        .catch((err) => {
          console.error("Erreur lors du chargement des étagères :", err);
        });
    }
  }, [open, book]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.bookTitle.trim()) {
      alert("Le titre du livre est requis.");
      return;
    }

    const payload: { bookTitle: string; shelfId?: number } = {
      bookTitle: form.bookTitle,
    };

    if (form.shelfId) {
      payload.shelfId = Number(form.shelfId);
    }

    try {
      await axios.put(`http://localhost:8081/api/book/${book.id}`, payload);
      onOpenChange(false);
      onBookEdited();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le livre</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input
              name="bookTitle"
              value={form.bookTitle}
              onChange={handleChange}
              placeholder="Titre du livre"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Étagère</label>
            <select
              name="shelfId"
              value={form.shelfId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Garder l'étagère actuelle --</option>
              {shelves.map((shelf) => (
                <option key={shelf.id} value={shelf.id}>
                  {shelf.label}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleSave} className="w-full">
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
