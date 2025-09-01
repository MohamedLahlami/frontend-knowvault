import { useEffect, useState, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { getDashboard } from "@/lib/dashboardApi";
import { Dashboard } from "@/types/dashboard";

export const useDashboard = () => {
  const auth = useAuth();

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!auth.isAuthenticated || !auth.user) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getDashboard(auth.user.access_token);
      setDashboard(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données du tableau de bord");
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refreshDashboard: fetchDashboard };
};
