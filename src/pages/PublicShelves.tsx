import { useState } from "react";
import { BookOpen, Search, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for public shelves
const publicShelves = [
  {
    id: 1,
    title: "Documentation technique",
    description: "Guides et documentation pour les développeurs - accès public",
    bookCount: 8,
    color: "bg-blue-100 text-blue-800",
    lastUpdated: "Il y a 2 heures",
    isPublic: true,
    views: 156
  },
  {
    id: 2,
    title: "Guides utilisateur",
    description: "Manuels d'utilisation accessibles à tous",
    bookCount: 6,
    color: "bg-green-100 text-green-800",
    lastUpdated: "Hier",
    isPublic: true,
    views: 89
  },
  {
    id: 3,
    title: "Formation publique",
    description: "Matériel de formation ouvert au public",
    bookCount: 12,
    color: "bg-orange-100 text-orange-800",
    lastUpdated: "Il y a 1 semaine",
    isPublic: true,
    views: 203
  },
  {
    id: 4,
    title: "Ressources communautaires",
    description: "Contenus partagés par la communauté",
    bookCount: 4,
    color: "bg-purple-100 text-purple-800",
    lastUpdated: "Il y a 3 jours",
    isPublic: true,
    views: 67
  }
];

export default function PublicShelves() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShelves = publicShelves.filter(shelf =>
    shelf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelf.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Étagères publiques
        </h1>
        <p className="text-muted-foreground">
          Explorez nos collections thématiques de livres et guides accessibles publiquement.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une étagère..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Shelves Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShelves.map((shelf) => (
          <Card key={shelf.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <BookOpen className="h-8 w-8 text-primary" />
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {shelf.bookCount} livre{shelf.bookCount > 1 ? 's' : ''}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{shelf.views}</span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {shelf.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {shelf.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Mis à jour {shelf.lastUpdated}</span>
                <Link 
                  to={`/public-books?shelf=${shelf.id}`}
                  className="text-primary hover:underline font-medium"
                >
                  Explorer →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredShelves.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune étagère trouvée</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
} 