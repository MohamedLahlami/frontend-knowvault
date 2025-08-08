import { FavoriteDTO } from "@/types/favorite";

const API_BASE_URL ="http://localhost:8081/api";

export const getFavoritesByUser = async (token: string): Promise<FavoriteDTO[]> => {
  const res = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des favoris");
  }

  return await res.json();
};

export async function toggleFavoriteApi(pageId: number, token: string): Promise<FavoriteDTO | null> {
  const response = await fetch(`${API_BASE_URL}/favorites/toggle/${pageId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status === 204) {
    // Pas de contenu => favori supprimé
    return null;
  }
  if (response.ok) {
    // Favori ajouté
    return await response.json();
  }
  throw new Error("Erreur toggle favori");
}

