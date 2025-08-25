export interface CommentDTO {
  id: number;
  text: string;
  createdAt: string; // LocalDateTime string from backend
  utilisateurLogin: string;
  pageId: number;
}

export interface PaginatedComments {
  content: CommentDTO[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
