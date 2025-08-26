import { apiService } from "@/lib/api";
import { PaginatedComments, CommentDTO } from "@/types/comment";

const BASE = "/api/comment";

export async function getCommentsByPageId(
  pageId: number,
  token: string,
  page: number = 0,
  size: number = 20,
  sort: string = "createdAt,desc"
): Promise<PaginatedComments> {
  const query = `?pageId=${pageId}&page=${page}&size=${size}&sort=${encodeURIComponent(
    sort
  )}`;
  return apiService.get<PaginatedComments>(`${BASE}${query}`, {
    requireAuth: true,
    token,
  });
}

export async function createComment(
  data: { text: string; pageId: number },
  token: string
): Promise<CommentDTO> {
  return apiService.post<CommentDTO>(BASE, data, { requireAuth: true, token });
}

export async function deleteComment(id: number, token: string): Promise<void> {
  await apiService.delete<void>(`${BASE}/${id}`, { requireAuth: true, token });
}
