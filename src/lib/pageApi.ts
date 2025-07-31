import { apiService } from "@/lib/api";
import { Page } from "@/types/page";

export const getPages = async (token: string): Promise<Page[]> => {
  return await apiService.get<Page[]>("/api/page", {
    requireAuth: true,
    token,
  });
};
const BASE_URL = "http://localhost:8081";

export async function getPagesByChapterId(chapterId: number, token?: string) {
  const res = await fetch(`http://localhost:8081/api/page/chapter/${chapterId}`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    mode: "cors", // très important côté navigateur
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur ${res.status} : ${errorText}`);
  }

  return await res.json();
}

export async function deletePage(id: number, token: string): Promise<void> {
  const response = await fetch(`http://localhost:8081/api/page/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text(); // essaye d'extraire un message d'erreur
    throw new Error(`Erreur lors de la suppression : ${errorText || response.statusText}`);
  }
}
const API_BASE_URL = "http://localhost:8081";
export async function getPageById(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/page/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la page");
  }

  return await response.json();
}
export async function updatePage(id: number, data: Partial<Page>, token: string) {
  const res = await fetch(`${BASE_URL}/api/page/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return await res.json();
}
export async function createPage(data: Partial<Page>, token: string): Promise<Page> {
  const response = await fetch(`http://localhost:8081/api/page`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,  // <-- assure-toi que token est correct
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Échec de la création de la page");
  }

  return await response.json();
}
