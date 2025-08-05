// chapterApi.ts
import { Chapter } from "@/types/chapter";
import { apiService } from "@/lib/api"; 
export async function getChapters(token: string): Promise<Chapter[]> {
  return await apiService.get<Chapter[]>("/api/chapter", {
    requireAuth: true,
    token,
  });
}

export async function deleteChapter(id: number, token: string): Promise<void> {
  return await apiService.delete(`/api/chapter/${id}`, {
    requireAuth: true,
    token,
  });
}

export async function updateChapter(
  id: number,
  title: string,
  bookId: number,
  token: string
): Promise<void> {
  await apiService.put(`/api/chapter/${id}`, {
    chapterTitle: title,
    bookId: bookId,
  }, {
    requireAuth: true,
    token: token,
  });
}
export const getChaptersByBookId = async (
  bookId: number,
  token: string
): Promise<Chapter[]> => {
  return await apiService.get<Chapter[]>(
    `/api/chapter/book/${bookId}/chapters`,  // <-- corriger ici
    {
      requireAuth: true,
      token,
    }
  );
}

export async function createChapter(title: string, bookId: number, token: string): Promise<Chapter> {
  const response = await apiService.post<Chapter>(
    "/api/chapter",
    { chapterTitle: title, bookId },
    { requireAuth: true, token }
  );

  return response; 
}