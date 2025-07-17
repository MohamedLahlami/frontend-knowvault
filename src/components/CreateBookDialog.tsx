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

// Extend the User type to include OIDC user properties
interface OidcUser {
  preferred_username?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

// Mock shelves (copied from Shelves.tsx)
const shelves = [
  { id: 1, title: "Documentation technique" },
  { id: 2, title: "Guides utilisateur" },
  { id: 3, title: "Procédures internes" },
  { id: 4, title: "Formation" },
  { id: 5, title: "Architecture" },
  { id: 6, title: "Ressources Marketing" },
];

export interface CreateBookDialogProps {
  onBookCreated?: (book: any) => void;
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
  const user = auth.user as OidcUser;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    shelf: shelves[0].title,
    author: user?.preferred_username || user?.name || "Utilisateur",
  });

  // Update author if user changes (keep value if dialog is closed)
  useEffect(() => {
    setForm((f) => ({
      ...f,
      author: user?.preferred_username || user?.name || "Utilisateur",
    }));
    // eslint-disable-next-line
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newBook = {
        id: Date.now(),
        title: form.title,
        description: form.description,
        author: form.author,
        shelf: form.shelf,
        pageCount: 0,
        lastUpdated: "À l'instant",
        color: "bg-blue-100 text-blue-800",
      };
      setLoading(false);
      setOpen(false);
      toast({
        title: "Livre créé",
        description: `Le livre '${form.title}' a été ajouté avec succès.`,
        duration: 3000,
      });
      if (onBookCreated) onBookCreated(newBook);
      // Keep form values (do not reset)
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName} variant={buttonVariant as any}>
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
              value={form.shelf}
              onValueChange={(v) => handleChange("shelf", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une étagère" />
              </SelectTrigger>
              <SelectContent>
                {shelves.map((shelf) => (
                  <SelectItem key={shelf.id} value={shelf.title}>
                    {shelf.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Auteur</label>
            <Input value={form.author} readOnly disabled />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
