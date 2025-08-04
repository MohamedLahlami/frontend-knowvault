export interface Book {
    id: number;
    bookTitle: string;
    utilisateurLogin: string;
    shelfId: number;
    pageCount: number;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
}