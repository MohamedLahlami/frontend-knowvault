// src/hooks/useShelves.tsx
import { useEffect, useState } from "react";
import axios from "axios";

export interface Shelf {
  id: number;
  label: string;
  description: string;
  tag: string;
}

export const useShelves = () => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Shelf[]>("/api/shelf")
      .then((res) => {
        setShelves(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des étagères");
        setLoading(false);
      });
  }, []);

  return { shelves, loading, error };
};
