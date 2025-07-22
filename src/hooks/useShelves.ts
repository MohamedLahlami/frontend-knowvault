import { useEffect, useState } from "react";
import { Book } from "@/types/book.ts";
import { getBooks } from "@/lib/bookApi";
import { useAuth } from "react-oidc-context";
import {Shelf} from "@/types/shelf.ts";
import {getShelves} from "@/lib/shelfApi.ts";

export const useShelves = () => {
    const auth = useAuth();
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShelves = async () => {
            if (!auth.isAuthenticated || !auth.user) {
                setError("Utilisateur non authentifié");
                setLoading(false);
                return;
            }

            try {
                const data = await getShelves(auth.user.access_token);
                setShelves(data);
            } catch (err) {
                setError("Erreur lors du chargement des livres");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShelves();
    }, [auth]);

    return { shelves, loading, error };
};
