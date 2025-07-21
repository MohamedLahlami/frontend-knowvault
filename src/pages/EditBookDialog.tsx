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

  // Charger les données du livre et les étagères à l'ouverture du modal
  useEffect(() => {
    if (open) {
      // Charger les infos du livre
      axios.get<Book>(`http://localhost:8081/api/books/${bookId}`).then((res) => {
        setBook(res.data);
        setForm({
          bookTitle: res.data.bookTitle,
          shelfId: String(res.data.shelfId),
        });
      });

      // Charger les étagères
      axios.get<Shelf[]>("http://localhost:8081/api/shelf").then((res) => {
        setShelves(res.data);
      });
    }
  }, [open, bookId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axios.put(`http://localhost:8081/api/books/${bookId}`, {
      bookTitle: form.bookTitle,
      shelfId: Number(form.shelfId), // convertir en number
    });
    setOpen(false);
    window.location.reload(); // ou déclencher une mise à jour via props
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
            <Input name="bookTitle" value={form.bookTitle} onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm font-medium">Étagère</label>
            <select
              name="shelfId"
              value={form.shelfId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Sélectionner une étagère --</option>
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
