import { Book, Plus, Search, Calendar } from "lucide-react";
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
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

// Mock shelves (copied from Shelves.tsx)
const shelves = [
  { id: 1, title: "Documentation technique" },
  { id: 2, title: "Guides utilisateur" },
  { id: 3, title: "Procédures internes" },
  { id: 4, title: "Formation" },
  { id: 5, title: "Architecture" },
  { id: 6, title: "Ressources Marketing" },
];

// Extend the User type to include OIDC user properties
interface OidcUser {
  name?: string;
  email?: string;
  [key: string]: any;
}

export default function Books() {
  const auth = useAuth();
  const user = auth.user as OidcUser;
  const { toast } = useToast();
  // Move books to state
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Guide de démarrage React",
      description: "Introduction complète au développement avec React",
      author: "Équipe Documentation",
      shelf: "Documentation technique",
      pageCount: 24,
      lastUpdated: "Il y a 2 heures",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      title: "Bonnes pratiques JavaScript",
      description: "Conventions et bonnes pratiques pour JavaScript moderne",
      author: "Équipe Dev",
      shelf: "Documentation technique",
      pageCount: 18,
      lastUpdated: "Hier",
      color: "bg-green-100 text-green-800",
    },
    {
      id: 3,
      title: "Manuel utilisateur CRM",
      description: "Guide complet d'utilisation du système CRM",
      author: "Support Client",
      shelf: "Guides utilisateur",
      pageCount: 32,
      lastUpdated: "Il y a 3 jours",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: 4,
      title: "Procédure d'onboarding",
      description: "Processus d'intégration des nouveaux employés",
      author: "RH",
      shelf: "Procédures internes",
      pageCount: 12,
      lastUpdated: "Il y a 1 semaine",
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: 5,
      title: "Architecture microservices",
      description: "Guide d'architecture pour les microservices",
      author: "Tech Lead",
      shelf: "Architecture",
      pageCount: 28,
      lastUpdated: "Il y a 5 jours",
      color: "bg-red-100 text-red-800",
    },
    {
      id: 6,
      title: "Formation TypeScript",
      description: "Cours complet sur TypeScript pour débutants",
      author: "Formateur",
      shelf: "Formation",
      pageCount: 45,
      lastUpdated: "Il y a 2 jours",
      color: "bg-pink-100 text-pink-800",
    },
  ]);

  // Dialog and form state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    shelf: shelves[0].title,
    author: user?.name || "Utilisateur",
  });
  const [loading, setLoading] = useState(false);

  // Update author if user changes (keep value if dialog is closed)
  React.useEffect(() => {
    setForm((f) => ({
      ...f,
      author: user?.name || "Utilisateur",
    }));
    // eslint-disable-next-line
  }, [user]);

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBooks((prev) => [
        {
          id: prev.length + 1,
          title: form.title,
          description: form.description,
          author: form.author,
          shelf: form.shelf,
          pageCount: 0, // page management not implemented
          lastUpdated: "À l'instant",
          color: "bg-blue-100 text-blue-800", // default color, could be improved
        },
        ...prev,
      ]);
      setLoading(false);
      setOpen(false);
      toast({
        title: "Livre créé",
        description: `Le livre '${form.title}' a été ajouté avec succès.`,
        duration: 3000,
      });
      // Keep form values (do not reset)
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Livres</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez tous vos livres de documentation
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau livre
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
                <label className="block text-sm font-medium mb-1">
                  Étagère
                </label>
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
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un livre..." className="pl-10" />
      </div>

      {/* Liste des livres */}
      <div className="space-y-4">
        {books.map((book) => (
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
                        {book.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm max-w-2xl">
                      {book.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Par {book.author}</span>
                      <Badge variant="secondary" className={book.color}>
                        {book.shelf}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {book.lastUpdated}
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
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/books/${book.id}/edit`}>Modifier</Link>
                  </Button>
                </div>
                <Link
                  to={`/shelves/${book.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Voir l'étagère →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* État vide */}
      {books.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucun livre trouvé
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre premier livre de documentation.
          </p>
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Créer un livre
          </Button>
        </div>
      )}
      <Toaster />
    </div>
  );
}
