import { useEffect, useState, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { Tag } from "@/types/tag.ts";
import { getShelfTags, createTag } from "@/lib/tagApi.ts";

export const useTags = () => {
  const auth = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTags = useCallback(
    async (pageToFetch = page) => {
      if (!auth.isAuthenticated || !auth.user) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getShelfTags(
          auth.user.access_token /*, pageToFetch, size? */
        );
        setTags(data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des tags");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [auth.isAuthenticated, auth.user, page]
  );

  useEffect(() => {
    fetchTags(page);
  }, [fetchTags, page]);

  const handleCreateShelfTag = async (
    label: string,
    type: "SHELF"
  ): Promise<Tag | null> => {
    if (!auth.isAuthenticated || !auth.user) {
      setError("Utilisateur non authentifié");
      return null;
    }

    setLoading(true);
    try {
      const newTag = await createTag({ label, type }, auth.user.access_token);
      setTags((prev) => [...prev, newTag]);
      setError(null);
      return newTag;
    } catch (err) {
      setError("Erreur lors de la création du tag");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    tags,
    loading,
    error,
    page,
    setPage,
    totalPages,
    refreshTags: fetchTags,
    handleCreateShelfTag,
  };
};
