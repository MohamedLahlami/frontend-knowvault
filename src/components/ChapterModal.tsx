import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getBooks } from "@/lib/bookApi";
import { createChapter, updateChapter } from "@/lib/chapterApi";
import { Book } from "@/types/book";

interface ChapterModalProps {
  mode: "create" | "edit";
  chapterId?: number;
  initialTitle?: string;
  initialBookId?: number;
  trigger: React.ReactNode;
  onUpdated: () => void;
  token: string;
}

export function ChapterModal({
  mode,
  chapterId,
  initialTitle = "",
  initialBookId = 0,
  trigger,
  onUpdated,
  token,
}: ChapterModalProps) {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    chapterTitle: initialTitle,
    bookId: String(initialBookId),
  });

  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open) return;
    setError(null); // 🔁 reset previous error
    setForm({
      chapterTitle: initialTitle,
      bookId: String(initialBookId),
    });

    getBooks(token)
      .then((data) => setBooks(data.content))
      .catch(console.error);
  }, [open, token, initialTitle, initialBookId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setError(null); // Reset l'erreur
  
      if (isEdit && chapterId) {
        await updateChapter(chapterId, form.chapterTitle, Number(form.bookId), token);
      } else {
        await createChapter(form.chapterTitle, Number(form.bookId), token);
      }
  
      setOpen(false);
      onUpdated();
  
    } catch (err: unknown) {
      const error = err as { response?: Response };
  
      if (error.response?.status === 409) {
        const text = await error.response.text(); // Lire le corps renvoyé par le backend
        setError(text); // Afficher le message exact ()
      } else {
        setError("Un chapitre avec ce nom existe déjà pour ce livre.");
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier un chapitre" : "Créer un chapitre"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input name="chapterTitle" value={form.chapterTitle} onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm font-medium">Livre associé</label>
            <select
              name="bookId"
              value={form.bookId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Sélectionner un livre --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bookTitle}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium mt-2">{error}</p>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
