import {Book} from "@/types/book.ts";
import {Shelf} from "@/types/shelf.ts";
import {Tag} from "@/types/tag.ts";

export interface Dashboard {
    totalShelves: number;
    totalBooks: number;
    totalPages: number;
    recentBooks: Book[];
    topShelves: Shelf[];
    shelfTagStats: Tag[];
    bookTagStats: Tag[];
}
