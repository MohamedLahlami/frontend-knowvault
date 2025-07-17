import { Book, Plus, Search, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBooks } from "@/hooks/useBooks";

export default function Books() {
    const { books, loading, error } = useBooks();

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Livres</h1>
                    <p className="text-muted-foreground mt-1">
                        Consultez et gérez tous vos livres de documentation
                    </p>
                </div>
                <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau livre
                </Button>
            </div>

            {/* Barre de recherche */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher un livre..." className="pl-10" />
            </div>

            {/* Gestion état chargement / erreur */}
            {loading && <p>Chargement des livres...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Liste des livres */}
            {!loading && !error && (
                <div className="space-y-4">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <Card key={book.id} className="hover:shadow-md transition-all duration-200">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-lg">
                                                <Book className="h-6 w-6 text-primary"/>
                                            </div>
                                            <div className="space-y-2">
                                                <CardTitle className="text-xl">
                                                    <Link
                                                        to={`/books/${book.id}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {book.bookTitle}
                                                    </Link>
                                                </CardTitle>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span>Utilisateur ID: {book.utilisateurId}</span>
                                                    <Badge variant="secondary">
                                                        Étagère #{book.shelfId}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <div className="text-2xl font-bold text-primary">
                                                {book.pageCount}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                page{book.pageCount > 1 ? 's' : ''}
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
                                        <Link to={`/shelves/${book.shelfId}`} className="text-sm text-primary hover:underline">
                                            Voir l'étagère →
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">Aucun livre trouvé</h3>
                            <p className="text-muted-foreground mb-4">
                                Commencez par créer votre premier livre de documentation.
                            </p>
                            <Button className="bg-accent hover:bg-accent/90">
                                <Plus className="h-4 w-4 mr-2" />
                                Créer un livre
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
