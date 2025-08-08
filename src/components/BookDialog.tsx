import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { useShelves } from "@/hooks/useShelves";
import { Book } from "@/types/book";
import { Shelf } from "@/types/shelf";

// Extend the User type to include OIDC user properties
interface OidcUser {
  preferred_username?: string;
  name?: string;
  email?: string;
  access_token?: string;
}

export interface CreateBookDialogProps {
  onBookCreated?: (book: Book) => void;
  buttonClassName?: string;
  buttonVariant?: string;
  buttonChildren?: React.ReactNode;
}

export function CreateBookDialog({
  onBookCreated,
  buttonClassName,
  buttonVariant,
  buttonChildren,
}: CreateBookDialogProps) {
  const auth = useAuth();
  const user = auth.user as unknown as OidcUser;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addBook } = useBooks();
  const {
    shelves,
    loading: shelvesLoading,
    error: shelvesError,
  } = useShelves();

  const [form, setForm] = useState({
    title: "",
    description: "",
    shelfId: "",
    author: user?.preferred_username || user?.name || "Utilisateur",
  });

  // Update author if user changes (keep value if dialog is closed)
  useEffect(() => {
    setForm((f) => ({
      ...f,
      author: user?.preferred_username || user?.name || "Utilisateur",
    }));
  }, [user]);

  // Set default shelf when shelves are loaded
  useEffect(() => {
    if (shelves.length > 0 && !form.shelfId) {
      setForm((f) => ({ ...f, shelfId: String(shelves[0].id) }));
    }
  }, [shelves, form.shelfId]);

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const shelfId = Number(form.shelfId);
      if (!shelfId) throw new Error("Étagère invalide");

      const createdBook = await addBook(form.title, shelfId, form.description);
      setLoading(false);
      setOpen(false);
      toast({
        title: "Livre créé",
        description: `Le livre '${form.title}' a été ajouté avec succès.`,
        duration: 3000,
      });
      if (onBookCreated) onBookCreated(createdBook);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible de créer le livre.",
        variant: "destructive",
      });
    }
  };

  // Show error toast for shelves loading errors
  useEffect(() => {
    if (shelvesError) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les étagères.",
        variant: "destructive",
      });
    }
  }, [shelvesError, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={buttonClassName}
          variant={
            buttonVariant as
              | "default"
              | "destructive"
              | "outline"
              | "secondary"
              | "ghost"
              | "link"
          }
        >
          {buttonChildren || (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau livre
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau livre</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter un livre à votre
            documentation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              placeholder="Titre du livre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              placeholder="Description du livre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Étagère</label>
            <Select
              value={form.shelfId}
              onValueChange={(v) => handleChange("shelfId", v)}
              disabled={shelvesLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    shelvesLoading ? "Chargement..." : "Choisir une étagère"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {shelves.map((shelf) => (
                  <SelectItem key={shelf.id} value={String(shelf.id)}>
                    {shelf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {shelvesError && (
              <p className="text-sm text-red-500 mt-1">
                Erreur lors du chargement des étagères
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Auteur</label>
            <Input value={form.author} readOnly disabled />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || shelvesLoading}
              className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50"
            >
              {loading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export interface EditBookDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookEdited?: (book: Book) => void;
}

export function EditBookDialog({
  book,
  open,
  onOpenChange,
  onBookEdited,
}: EditBookDialogProps) {
  const { editBook } = useBooks();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const {
    shelves,
    loading: shelvesLoading,
    error: shelvesError,
  } = useShelves();

  const [form, setForm] = useState({
    title: book.bookTitle,
    description: book.description || "",
    shelfId: String(book.shelfId),
  });

  useEffect(() => {
    setForm({
      title: book.bookTitle,
      description: book.description || "",
      shelfId: String(book.shelfId),
    });
  }, [book]);

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const shelfId = Number(form.shelfId);
      const updatedBook = await editBook(
        book.id,
        form.title,
        form.description,
        shelfId
      );
      setLoading(false);
      onOpenChange(false);
      toast({
        title: "Livre modifié",
        description: `Le livre '${form.title}' a été modifié avec succès.`,
        duration: 3000,
      });
      if (onBookEdited) onBookEdited(updatedBook);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le livre.",
        variant: "destructive",
      });
    }
  };

  // Show error toast for shelves loading errors
  useEffect(() => {
    if (shelvesError) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les étagères.",
        variant: "destructive",
      });
    }
  }, [shelvesError, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le livre</DialogTitle>
          <DialogDescription>
            Modifiez les informations du livre.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              placeholder="Titre du livre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              placeholder="Description du livre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Étagère</label>
            <Select
              value={form.shelfId}
              onValueChange={(v) => handleChange("shelfId", v)}
              disabled={shelvesLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    shelvesLoading ? "Chargement..." : "Choisir une étagère"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {shelves.map((shelf) => (
                  <SelectItem key={shelf.id} value={String(shelf.id)}>
                    {shelf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {shelvesError && (
              <p className="text-sm text-red-500 mt-1">
                Erreur lors du chargement des étagères
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || shelvesLoading}
              className="w-full"
            >
              {loading ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
