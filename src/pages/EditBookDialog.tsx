import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "@/types/book";
import { Shelf } from "@/types/shelf";

export function EditBookDialog({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    bookTitle: "",
    shelfId: "",
  });

   useEffect(() => {
    if (open) {
      axios
        .get<Book>(`http://localhost:8081/api/book/${bookId}`)
        .then((res) => {
          const bookData = res.data;
          setBook(bookData);
          setForm({
            bookTitle: bookData.bookTitle || "",
            shelfId: String(bookData.shelfId || ""),
          });
        })
        .catch((err) => {
          console.error("Erreur lors du chargement du livre :", err);
        });

      axios
        .get<Shelf[]>("http://localhost:8081/api/shelf")
        .then((res) => {
          setShelves(res.data);
        })
        .catch((err) => {
          console.error("Erreur lors du chargement des étagères :", err);
        });
    }
  }, [open, bookId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await axios.put(`http://localhost:8081/api/book/${bookId}`, payload);
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Modifier
        </Button>
      </DialogTrigger>
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
