import { useState } from "react";
import { Book, Search, Eye, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for public books
const publicBooks = [
  {
    id: 1,
    title: "Guide d'introduction à KnowVault",
    description: "Un guide complet pour découvrir toutes les fonctionnalités de KnowVault.",
    author: "Équipe KnowVault",
    lastUpdated: "Il y a 2 jours",
    tags: ["Guide", "Introduction", "Documentation"],
    isPublic: true,
    views: 245,
    cover: "/api/placeholder/200/300"
  },
  {
    id: 2,
    title: "Documentation technique",
    description: "Documentation technique détaillée pour les développeurs.",
    author: "Équipe technique",
    lastUpdated: "Il y a 1 semaine",
    tags: ["Technique", "API", "Développement"],
    isPublic: true,
    views: 156,
    cover: "/api/placeholder/200/300"
  },
  {
    id: 3,
    title: "Manuel utilisateur",
    description: "Manuel complet d'utilisation de la plateforme les IAMs.",
    author: "Support KnowVault",
    lastUpdated: "Il y a 3 jours",
    tags: ["Manuel", "Utilisateur", "Guide"],
    isPublic: true,
    views: 89,
    cover: "/api/placeholder/200/300"
  }
];

export default function PublicBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredBooks = publicBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || book.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(publicBooks.flatMap(book => book.tags)));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Book className="h-8 w-8 text-primary" />
          Bibliothèque publique
        </h1>
        <p className="text-muted-foreground">
          Explorez notre collection de livres et guides disponibles publiquement.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher des livres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            Tous
          </Button>
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                <Book className="h-12 w-12 text-primary/40" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {book.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {book.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {book.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{book.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  <span>{book.views} vues</span>
                </div>
              </div>
              
              <Button className="w-full" variant="outline">
                <Book className="h-4 w-4 mr-2" />
                Lire
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun livre trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
} 