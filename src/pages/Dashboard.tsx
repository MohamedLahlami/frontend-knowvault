import { Book, BookOpen, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateBookDialog } from "@/components/CreateBookDialog";

export default function Dashboard() {
  const stats = [
    { title: "Étagères", count: 8, icon: BookOpen, color: "text-blue-600" },
    { title: "Livres", count: 24, icon: Book, color: "text-green-600" },
    { title: "Pages", count: 156, icon: Search, color: "text-purple-600" },
  ];

  const recentBooks = [
    {
      title: "Guide de démarrage React",
      author: "Documentation",
      updatedAt: "Il y a 2 heures",
    },
    {
      title: "Bonnes pratiques JavaScript",
      author: "Équipe Dev",
      updatedAt: "Hier",
    },
    {
      title: "Architecture système",
      author: "Tech Lead",
      updatedAt: "Il y a 3 jours",
    },
  ];

  const recentShelves = [
    {
      title: "Documentation technique",
      bookCount: 12,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Guides utilisateur",
      bookCount: 8,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Procédures",
      bookCount: 4,
      color: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre base de connaissances et documentation
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contenu
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Livres récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Livres récemment modifiés
            </CardTitle>
            <CardDescription>Les derniers contenus mis à jour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBooks.map((book, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <Link
                    to={`/books/${index + 1}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {book.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Par {book.author}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {book.updatedAt}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Étagères populaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Étagères populaires
            </CardTitle>
            <CardDescription>Collections les plus consultées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentShelves.map((shelf, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <Link
                    to={`/shelves/${index + 1}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {shelf.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {shelf.bookCount} livre{shelf.bookCount > 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${shelf.color}`}
                >
                  Populaire
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Créez rapidement du nouveau contenu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              asChild
            >
              <Link to="/shelves/new">
                <BookOpen className="h-6 w-6" />
                <span>Nouvelle étagère</span>
              </Link>
            </Button>
            <CreateBookDialog
              buttonClassName="h-20 flex-col space-y-2 w-full"
              buttonVariant="outline"
              buttonChildren={
                <>
                  <Book className="h-6 w-6" />
                  <span>Nouveau livre</span>
                </>
              }
            />
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              asChild
            >
              <Link to="/pages/new">
                <Plus className="h-6 w-6" />
                <span>Nouvelle page</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
