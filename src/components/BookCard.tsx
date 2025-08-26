import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Book } from "@/types/book.ts";

interface BookCardProps {
    book: Book;
    to?: string; // chemin pour aller voir le détail du livre
}

export function BookCard({ book, to }: BookCardProps) {
    return (
        <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
                <div className="flex items-start justify-between">
                    {/* Icône par défaut, car ton type Book n’a pas d’image */}
                    <BookOpen className="h-8 w-8 text-primary" />

                    <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="text-xs">
                            {book.pageCount} pages
                        </Badge>
                    </div>
                </div>

                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {book.bookTitle}
                </CardTitle>

                {book.description && (
                    <CardDescription className="text-sm line-clamp-2">
                        {book.description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Par {book.utilisateurLogin}</span>
                    {to && (
                        <Link
                            to={to}
                            className="text-primary hover:underline font-medium"
                        >
                            Lire →
                        </Link>
                    )}
                </div>

                {book.updatedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Mis à jour le {new Date(book.updatedAt).toLocaleDateString()}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
