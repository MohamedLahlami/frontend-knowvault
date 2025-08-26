import { MoreHorizontal, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useDeleteShelf, useShelves } from "@/hooks/useShelves.ts";
import { useTags } from "@/hooks/useTags.ts";
import { useState } from "react";
import { ShelfCard } from "@/components/ShelfCard";
import { Shelf } from "@/types/shelf.ts";

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
    const [shelfToDelete, setShelfToDelete] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");

    if (loading) return <div className="p-6 text-muted-foreground">Chargement des étagères...</div>;
    if (error) return <div className="p-6 text-red-500">Erreur : {error}</div>;

    const handleEdit = (id: number) => {
        navigate(`/shelves/${id}/edit`);
    };

    const openDeleteDialog = (id: number) => {
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

    const filteredShelves = shelves.filter(shelf => {
        const matchesSearch = shelf.label.toLowerCase().includes(inputValue.toLowerCase()) ||
            shelf.description.toLowerCase().includes(inputValue.toLowerCase());
        const matchesTag = !tagFilter || (shelf.tag && shelf.tag.label === tagFilter);
        return matchesSearch && matchesTag;
    });

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Header */}
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

            {/* Recherche + Tags */}
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
                        tags.map(tag => {
                            const isSelected = tagFilter === tag.label;
                            return (
                                <Button
                                    key={tag.id}
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTagFilter(isSelected ? null : tag.label)}
                                >
                                    {tag.label}
                                </Button>
                            );
                        })}
                </div>
            </div>

            {/* Liste des étagères */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredShelves.map((shelf: Shelf) => (
                    <ShelfCard
                        key={shelf.id}
                        shelf={shelf}
                        onEdit={handleEdit}
                        onDelete={openDeleteDialog}
                        onClick={(id) => navigate(`/shelves/${shelf.id}/books`)}
                    />
                ))}
            </div>

            {filteredShelves.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg font-medium text-foreground mb-2">Aucune étagère trouvée</p>
                    <p className="text-muted-foreground mb-4">
                        Essayez de modifier vos critères de recherche.
                    </p>
                    <Link to="/shelves/new">
                        <Button className="bg-accent hover:bg-accent/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Créer une étagère
                        </Button>
                    </Link>
                </div>
            )}

            {/* Pagination */}
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

            {/* Dialog suppression */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette étagère ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setIsDialogOpen(false); setShelfToDelete(null); }}>
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
