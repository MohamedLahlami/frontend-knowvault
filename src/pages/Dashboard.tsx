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
import { CreateBookDialog } from "@/components/BookDialog";
import { useDashboard } from "@/hooks/useDashboard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

export default function Dashboard() {
  const { dashboard, loading, error } = useDashboard();

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

  const shelfTagData = dashboard?.shelfTagStats ?? [];
  const bookTagData = dashboard?.bookTagStats ?? [];

  const stats = [
    {
      title: "Étagères",
      count: dashboard?.totalShelves ?? 0,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Livres",
      count: dashboard?.totalBooks ?? 0,
      icon: Book,
      color: "text-green-600",
    },
    {
      title: "Pages",
      count: dashboard?.totalPages ?? 0,
      icon: Search,
      color: "text-purple-600",
    },
  ];

  if (loading) {
    return <div className="p-6">Chargement du tableau de bord...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erreur : {error}</div>;
  }

  const formatDate = (iso: string) =>
      new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(iso));

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
              {dashboard?.recentBooks.map((book, index) => (
                  <div
                      key={index}
                      className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <Link
                          to={`/books/${book.id}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {book.bookTitle}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Par {book.utilisateurLogin}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                  {formatDate(book.updatedAt)}
                </span>
                  </div>
              ))}
            </CardContent>
          </Card>

          {/* Étagères avec le plus de livres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Étagères avec le plus de livres
              </CardTitle>
              <CardDescription>
                Collections contenant le plus de livres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboard?.topShelves.map((shelf, index) => (
                  <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <Link
                          to={`/shelves/${shelf.id}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {shelf.label}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {shelf.bookCount} livre{shelf.bookCount > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Répartition des Tags d'Étagères (Camembert)
              </CardTitle>
              <CardDescription>
                Distribution des types de tags pour les étagères
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                      data={shelfTagData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      nameKey="label"
                      label
                  >
                    {shelfTagData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Répartition des Tags de Livres (Barres)
              </CardTitle>
              <CardDescription>
                Nombre d'éléments par tag pour les livres
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={bookTagData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="label" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" barSize={20}>
                    {bookTagData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
