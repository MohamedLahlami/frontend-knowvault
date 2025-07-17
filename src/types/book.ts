export interface Book {
    id: number;
    bookTitle: string;
    utilisateurId: string; // UUID → string
    shelfId: number;
    pageCount: number;
}