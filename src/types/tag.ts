export type TagType = 'BOOK' | 'SHELF';

export interface Tag {
    id: number;
    label: string;
    tagType: TagType;
    value: number;
}