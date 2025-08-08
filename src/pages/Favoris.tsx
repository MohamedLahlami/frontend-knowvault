import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  FileText,
  ListTree,
  StarOff,
  Eye,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

type Favorite = {
  id: number;
  userId: number;
  pageId: number;
  pageNumber: number;
  chapterTitle: string;
  bookTitle: string;
};

export default function Favoris() {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
const [size, setSize] = useState(10);
const [sort, setSort] = useState("bookTitle,asc");

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        if (!auth.user) {
          setError("Utilisateur non authentifié.");
          setFavorites([]);
          return;
        }

        const res = await axios.get("http://localhost:8081/api/favorites/only", {
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
          },
        });

        setFavorites(res.data as Favorite[]);
        setError(null);
      } catch (err) {
        console.error("Erreur API :", err);
        setError("Erreur lors du chargement des favoris.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [auth.user]);
  const handleRemoveFavorite = async (favoriteId: number) => {
    if (!auth.user) return;
    try {
      await axios.delete(`http://localhost:8081/api/favorites/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
      });
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
    } catch (error) {
      console.error("Erreur lors de la suppression du favori :", error);
    }
  };
  
  const filteredFavorites = favorites.filter((fav) =>
    fav.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.pageNumber.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="p-6 animate-fade-in">
   <div>
          <h1 className="text-3xl font-bold text-foreground">Favoris</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez tous vos favoris <br/>
          </p>
        </div>
      {filteredFavorites.length === 0 ? (
        <div className="text-center text-gray-500">Aucun favori trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((fav) => (
            <Card
              key={fav.id}
              className="relative flex flex-col hover:shadow-lg transition-all duration-200"
            >
              <Badge className="absolute top-4 right-4 bg-blue-200 text-blue-900 font-semibold px-3 py-1 text-base rounded-full z-10 shadow">
                {fav.bookTitle}
              </Badge>

              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="text-primary w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-2xl font-semibold tracking-wide">
                    <span className="mr-2">Page</span>
                    <span>{fav.pageNumber}</span>
                  </CardTitle>
                  <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <ListTree className="w-5 h-5 text-gray-500" />
                    <span className="line-clamp-1">{fav.chapterTitle}</span>
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex justify-end gap-3 pt-0 mt-auto">
              <Button
  variant="outline"
  size="sm"
  className="flex items-center gap-1"
  onClick={() => handleRemoveFavorite(fav.id)} 
>
  <StarOff className="w-4 h-4" />
  Supprimer
</Button>

                <Button size="sm" asChild className="flex items-center gap-1">
                  <Link to={`/page/${fav.pageId}`}>
                    <Eye className="w-4 h-4" />
                    Consulter
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
