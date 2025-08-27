import { useEffect, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { ShelfCard } from "@/components/ShelfCard";
import { Input } from "@/components/ui/input";
import { Shelf } from "@/types/shelf";
import { getShelvesPublic } from "@/lib/shelfApi.ts";
import { useNavigate } from "react-router-dom";

export default function PublicShelves() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchShelves = async () => {
    setLoading(true);
    try {
      const data = await getShelvesPublic(); // backend renvoie un Shelf[]
      setShelves(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des étagères publiques");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelves();
  }, []);

  const filteredShelves = shelves.filter(
      (shelf: Shelf) =>
          shelf.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shelf.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Chargement des étagères...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Étagères publiques
          </h1>
          <p className="text-muted-foreground">
            Explorez nos collections thématiques accessibles publiquement.
          </p>
        </div>

        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Rechercher une étagère..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredShelves.map((shelf: Shelf) => (
              <ShelfCard
                  key={shelf.id}
                  shelf={shelf}
                  onClick={() => navigate(`/public-shelf/${shelf.id}`)}
              />
          ))}
        </div>

        {filteredShelves.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune étagère publique trouvée</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
            </div>
        )}
      </div>
  );
}
