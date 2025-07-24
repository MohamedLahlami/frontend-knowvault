export interface Shelf {
    id: number;
    label: string;
    description: string;
    tag: Tag;
    bookCount: number;
    createdAt: string;
    updatedAt: string;
}

export enum Tag {
    JAVA = "JAVA",
    MOBILE = "MOBILE",
    KOTLIN = "KOTLIN",
    DEVOPS = "DEVOPS",
    RUBY = "RUBY",
    JAVASCRIPT = "JAVASCRIPT",
    C_PLUS_PLUS = "C_PLUS_PLUS",
    DESKTOP = "DESKTOP",
    TYPESCRIPT = "TYPESCRIPT",
}