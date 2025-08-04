// src/hooks/usePages.ts
import { useEffect, useState } from "react";
import { getPages } from "@/lib/pageApi";
import { Page } from "@/types/page";
import { useAuth } from "react-oidc-context";

export function usePages() {
  const auth = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      if (!auth.isAuthenticated || !auth.user) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      try {
        const data = await getPages(auth.user.access_token);
        setPages(data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des pages");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [auth]);

  return { pages, loading, error };
}
