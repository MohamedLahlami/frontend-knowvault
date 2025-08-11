import {Tag} from "@/types/tag.ts";

export interface Shelf {
    id: number;
    label: string;
    description: string;
    tag: Tag;
    bookCount: number;
    createdAt: string;
    updatedAt: string;
}
