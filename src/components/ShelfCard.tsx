import { Eye, Calendar, MoreHorizontal, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Link, useNavigate} from "react-router-dom";
import { Shelf } from "@/types/shelf.ts";
import { useState } from "react";

interface ShelfCardProps {
    shelf: Shelf;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onClick?: (id: number) => void;
}

export function ShelfCard({ shelf, onEdit, onDelete, onClick }: ShelfCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate(); // <-- Obligatoire

    // ensuite tu peux l'utiliser
    const handleShelfClick = (id: number) => {
        navigate(`/shelves/${id}/books`);
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen((prev) => !prev);
    };

    const handleEditClick = () => {
        setMenuOpen(false);
        onEdit?.(shelf.id);
    };

    const handleDeleteClick = () => {
        setMenuOpen(false);
        onDelete?.(shelf.id);
    };

    return (
        <div className="relative group">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => {
                      if (onClick) {
                          onClick(shelf.id);
                      } else {
                          handleShelfClick(shelf.id);
                      }
                  }}>
                <CardHeader className="pb-4">
                    <div className="aspect-[4/3] rounded-lg mb-4 overflow-hidden relative">
                        {shelf.imageName ? (
                            <img
                                src={`http://localhost:8081/api/files/${shelf.imageName}`}
                                alt={shelf.label}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:from-primary/20 group-hover:to-primary/10">
                                <Book className="h-12 w-12 text-primary/40 animate-pulse" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        <Link to={`/shelves/${shelf.id}`}>{shelf.label}</Link>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{shelf.description}</p>

                    <div className="flex flex-wrap gap-1">
                        {shelf.tag && <Badge variant="secondary" className="text-xs">{shelf.tag.label}</Badge>}
                        <Badge variant="secondary" className="text-xs">{shelf.bookCount} livre{shelf.bookCount > 1 ? "s" : ""}</Badge>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>Mis à jour {new Date(shelf.updatedAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            <span>{shelf.views} vues</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {(onEdit || onDelete) && (
                <div className="absolute top-2 right-2">
                    <button
                        className="p-1 rounded hover:bg-gray-200"
                        onClick={toggleMenu}
                        aria-label="Actions"
                    >
                        <MoreHorizontal className="h-5 w-5 text-gray-600" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                            {onEdit && (
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={handleEditClick}
                                >
                                    Modifier
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                                    onClick={handleDeleteClick}
                                >
                                    Supprimer
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
