
import { BookOpen, Plus, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Shelves() {
  const shelves = [
    {
      id: 1,
      title: "Documentation technique",
      description: "Guides et documentation pour les développeurs",
      bookCount: 12,
      color: "bg-blue-100 text-blue-800",
      lastUpdated: "Il y a 2 heures"
    },
    {
      id: 2,
      title: "Guides utilisateur",
      description: "Manuels d'utilisation pour les utilisateurs finaux",
      bookCount: 8,
      color: "bg-green-100 text-green-800",
      lastUpdated: "Hier"
    },
    {
      id: 3,
      title: "Procédures internes",
      description: "Processus et procédures de l'entreprise",
      bookCount: 4,
      color: "bg-purple-100 text-purple-800",
      lastUpdated: "Il y a 3 jours"
    },
    {
      id: 4,
      title: "Formation",
      description: "Matériel de formation et tutoriels",
      bookCount: 15,
      color: "bg-orange-100 text-orange-800",
      lastUpdated: "Il y a 1 semaine"
    },
    {
      id: 5,
      title: "Architecture",
      description: "Documentation sur l'architecture système",
      bookCount: 7,
      color: "bg-red-100 text-red-800",
      lastUpdated: "Il y a 5 jours"
    },
    {
      id: 6,
      title: "Ressources Marketing",
      description: "Contenus et ressources marketing",
      bookCount: 6,
      color: "bg-pink-100 text-pink-800",
      lastUpdated: "Il y a 2 jours"
    }
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Étagères</h1>
          <p className="text-muted-foreground mt-1">
            Organisez vos livres en collections thématiques
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle étagère
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une étagère..."
          className="pl-10"
        />
      </div>

      {/* Grille des étagères */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {shelves.map((shelf) => (
          <Card key={shelf.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${shelf.color}`}>
                  {shelf.bookCount} livre{shelf.bookCount > 1 ? 's' : ''}
                </span>
              </div>
              <CardTitle className="text-xl">
                <Link 
                  to={`/shelves/${shelf.id}`} 
                  className="hover:text-primary transition-colors"
                >
                  {shelf.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-sm">
                {shelf.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Mis à jour {shelf.lastUpdated}</span>
                <Link 
                  to={`/shelves/${shelf.id}`}
                  className="text-primary hover:underline font-medium"
                >
                  Voir plus →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* État vide */}
      {shelves.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucune étagère trouvée
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre première étagère pour organiser vos livres.
          </p>
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Créer une étagère
          </Button>
        </div>
      )}
    </div>
  )
}
