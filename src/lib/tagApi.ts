import { apiService } from "@/lib/api";
import { Tag } from "@/types/tag";


export const getShelfTags = async (token: string): Promise<Tag[]> => {
    return await apiService.get<Tag[]>("/api/tag/shelves", {
        requireAuth: true,
        token,
    });
};

export const getBookTags = async (token: string): Promise<Tag[]> => {
    return await apiService.get<Tag[]>("/api/tag/books", {
        requireAuth: true,
        token,
    });
};

export async function createTag(tag: { label: string; type: string }, token: string): Promise<Tag> {
    return await apiService.post<Tag>("/api/tag", tag, {
        requireAuth: true,
        token: token,
    });
}
