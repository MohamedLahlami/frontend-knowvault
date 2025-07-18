export interface Page {
    id: number;
    pageNumber: number;
    content: string;
    markDownContent: string;
    status: PageStatus;
    chapterId: number;
}

export enum PageStatus {
    Draft = "Draft",
    Published = "Published",
    Archived = "Archived",
}