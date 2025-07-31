import { useEffect, useState } from "react";
import { getChapters } from "@/lib/chapterApi";
import { Chapter } from "@/types/chapter";
import { useAuth } from "react-oidc-context";

export function useChapters() {
  const auth = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!auth.isAuthenticated || !auth.user) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      try {
        const data = await getChapters(auth.user.access_token);
       setChapters(data);
      } catch (e) {
        console.error(e);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [auth]);

  return { chapters, loading, error };
}
