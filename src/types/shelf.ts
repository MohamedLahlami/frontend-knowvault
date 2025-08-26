import {Tag} from "@/types/tag.ts";

export interface Shelf {
    id: number;
    label: string;
    description: string;
    tag: Tag;
    bookCount: number;
    views?: number;
    imageName?: string;
    createdAt: string;
    updatedAt: string;
}
