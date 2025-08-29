import { useEffect, useState } from "react";
import { Book } from "@/types/book.ts";
import { getBooks } from "@/lib/bookApi";
import { useAuth } from "react-oidc-context";
import { Shelf } from "@/types/shelf.ts";
import {
    createShelf,
    deleteShelf, getBooksByShelf,
    getShelfById,
    getShelves, getShelvesPublic,
    updateShelf,
} from "@/lib/shelfApi.ts";

export const useShelves = () => {
    const auth = useAuth();
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchShelves = async (pageToFetch = page) => {
        setLoading(true);
        try {
            let data;

            // Si l'utilisateur est connecté, utiliser l'API privée
            if (auth.isAuthenticated && auth.user) {
                data = await getShelves(auth.user.access_token, pageToFetch, 1000);
                setShelves(data.content);
                setTotalPages(data.totalPages);
            } else {
                // Sinon, récupérer les étagères publiques sans token
                const publicShelves = await getShelvesPublic();
                setShelves(publicShelves);
                setTotalPages(1); // pas de pagination côté public
            }

            setError(null);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des étagères");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchShelves(page);
    }, [auth, page, searchTerm]);

    return {
        shelves,
        loading,
        error,
        page,
        setPage,
        totalPages,
        refreshShelves: fetchShelves,
    };
};

export const useCreateShelf = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateShelf = async (
        shelfData: Partial<Shelf> | FormData
    ): Promise<Shelf | null> => {
        if (!auth.isAuthenticated || !auth.user) {
            setError("Utilisateur non authentifié");
            return null;
        }

        setLoading(true);
        try {
            const result = await createShelf(shelfData, auth.user.access_token);
            return result;
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la création de l'étagère");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleCreateShelf, loading, error };
};

export const useDeleteShelf = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteShelf = async (id: number) => {
        if (!auth.isAuthenticated || !auth.user) {
            setError("Utilisateur non authentifié");
            return;
        }

        setLoading(true);
        try {
            await deleteShelf(id, auth.user.access_token);
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la suppression de l'étagère");
        } finally {
            setLoading(false);
        }
    };

    return { handleDeleteShelf, loading, error };
};

export const useGetShelfById = (id: number) => {
    const auth = useAuth();
    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShelf = async () => {
            if (!auth.isAuthenticated || !auth.user) {
                setError("Utilisateur non authentifié");
                setLoading(false);
                return;
            }

            try {
                const data = await getShelfById(id, auth.user.access_token);
                setShelf(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement de l'étagère");
            } finally {
                setLoading(false);
            }
        };

        fetchShelf();
    }, [auth, id]);

    return { shelf, loading, error };
};

export const useEditShelf = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEditShelf = async (
        id: number,
        shelfData: Partial<Shelf> | FormData
    ): Promise<Shelf | null> => {
        if (!auth.isAuthenticated || !auth.user) {
            setError("Utilisateur non authentifié");
            return null;
        }

        setLoading(true);
        try {
            const updatedShelf = await updateShelf(
                id,
                shelfData,
                auth.user.access_token
            );
            return updatedShelf;
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la modification de l'étagère");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleEditShelf, loading, error };
};

export const useBooksByShelf = (shelfId: number) => {
    const auth = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!shelfId) return; // éviter les appels invalides

        const fetchBooks = async () => {
            if (!auth.isAuthenticated || !auth.user) {
                setError("Utilisateur non authentifié");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const data = await getBooksByShelf(shelfId);
                setBooks(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des livres");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [auth, shelfId]);

    return { books, loading, error };
};


