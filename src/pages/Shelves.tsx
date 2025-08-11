import { MoreHorizontal, BookOpen, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDeleteShelf, useShelves } from "@/hooks/useShelves.ts";
import { useTags } from "@/hooks/useTags.ts";
import { useState } from "react";

export default function Shelves() {
    const pageSize = 6;
    const {
        shelves,
        loading,
        error,
        page,
        setPage,
        totalPages,
        refreshShelves,
        tagFilter,
        setTagFilter,
    } = useShelves();

    const { tags, loading: tagsLoading, error: tagsError } = useTags();

    const { handleDeleteShelf, loading: deleting } = useDeleteShelf();
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [shelfToDelete, setShelfToDelete] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");


    if (loading) return <div className="p-6 text-muted-foreground">Chargement des étagères...</div>;
    if (error) return <div className="p-6 text-red-500">Erreur : {error}</div>;

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(iso));

    const toggleMenu = (id: number) => setMenuOpenId((current) => (current === id ? null : id));
    const closeMenu = () => setMenuOpenId(null);

    const handleEdit = (id: number) => {
        closeMenu();
        navigate(`/shelves/${id}/edit`);
    };

    const openDeleteDialog = (id: number) => {
        closeMenu();
        setShelfToDelete(id);
        setIsDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (shelfToDelete !== null) {
            await handleDeleteShelf(shelfToDelete);
            setIsDialogOpen(false);
            setShelfToDelete(null);

            if (refreshShelves) {
                await refreshShelves();
            } else {
                setPage((p) => p);
            }

            if (shelves.length === 1 && page > 0) {
                setPage(page - 1);
            }
        }
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Étagères</h1>
                    <p className="text-muted-foreground mt-1">Organisez vos livres en collections thématiques</p>
                </div>
                <Link to="/shelves/new">
                    <Button className="bg-accent hover:bg-accent/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle étagère
                    </Button>
                </Link>
            </div>

            {/* Barre recherche + tags */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Rechercher une étagère"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border p-2 rounded min-w-[200px] flex-grow max-w-sm"
                />

                <div className="flex flex-wrap gap-2">
                    {tagsLoading && <span className="text-muted-foreground">Chargement des tags...</span>}
                    {tagsError && <span className="text-red-500">{tagsError}</span>}
                    {!tagsLoading &&
                        tags.map((tag) => {
                            const isSelected = tagFilter === tag.label;
                            return (
                                <Button
                                    key={tag.id}
                                    variant={isSelected ? "default" : "outline"}
                                    className={isSelected ? "text-white" : "text-muted-foreground"}
                                >
                                    {tag.label}
                                </Button>
                            );
                        })}
                </div>
            </div>

            {/* Liste des étagères */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {shelves.map((shelf) => (
                    <Card key={shelf.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <BookOpen className="h-8 w-8 text-primary" />
                                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                    {shelf.bookCount} livre{shelf.bookCount > 1 ? "s" : ""}
                  </span>
                                    {shelf.tag && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {typeof shelf.tag === "string" ? shelf.tag : shelf.tag.label}
                    </span>
                                    )}
                                    <div className="relative ml-2">
                                        <button
                                            onClick={() => toggleMenu(shelf.id)}
                                            className="p-1 rounded hover:bg-gray-200"
                                            aria-label="Actions"
                                            type="button"
                                        >
                                            <MoreHorizontal className="h-5 w-5 text-gray-600" />
                                        </button>
                                        {menuOpenId === shelf.id && (
                                            <div
                                                className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10"
                                                onMouseLeave={closeMenu}
                                            >
                                                <button
                                                    onClick={() => handleEdit(shelf.id)}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => openDeleteDialog(shelf.id)}
                                                    className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <CardTitle className="text-xl">
                                <Link to={`/shelves/${shelf.id}`} className="hover:text-primary transition-colors">
                                    {shelf.label}
                                </Link>
                            </CardTitle>
                            <CardDescription
                                className="text-sm prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: shelf.description }}
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Mis à jour {formatDate(shelf.updatedAt)}</span>
                                <Link to={`/shelves/${shelf.id}`} className="text-primary hover:underline font-medium">
                                    Voir plus →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {shelves.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Aucune étagère trouvée</h3>
                    <p className="text-muted-foreground mb-4">
                        Commencez par créer votre première étagère pour organiser vos livres.
                    </p>
                    <Button className="bg-accent hover:bg-accent/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Créer une étagère
                    </Button>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-6">
                    <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
                        Précédent
                    </Button>
                    <span className="text-sm text-muted-foreground">
            Page {page + 1} sur {totalPages}
          </span>
                    <Button variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                        Suivant
                    </Button>
                </div>
            )}

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette étagère ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setIsDialogOpen(false);
                                setShelfToDelete(null);
                            }}
                        >
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete} disabled={deleting}>
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
