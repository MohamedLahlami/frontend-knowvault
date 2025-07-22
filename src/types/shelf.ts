export interface Shelf {
    id: number;
    label: string;
    description: string;
    tag: Tag;
    bookCount: number;
}

export enum Tag {
    JAVA = "Java",
    MOBILE = "Mobile",
    KOTLIN = "Kotlin",
    DEVOPS = "Devops",
    RUBY = "Ruby",
    JAVASCRIPT = "Javascript",
    C_PLUS_PLUS = "C++",
    DESKTOP = "Desktop",
    TYPESCRIPT = "Typescript",
}