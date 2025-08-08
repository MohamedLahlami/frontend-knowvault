import React, { useEffect, useState } from "react";
import { useParams, Link} from "react-router-dom";
import { getPagesByChapterId, deletePage } from "@/lib/pageApi";
import { getChapters } from "@/lib/chapterApi";
import { Page } from "@/types/page";
import { Chapter } from "@/types/chapter";
import { useAuth } from "react-oidc-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FavoriteDTO } from "@/types/favorite";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Trash ,Star, StarOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageStatus } from "@/types/page"; 
import CreatePageModal from "@/components/CreatePageModal";
import {  getFavoritesByUser, toggleFavoriteApi,  } from "@/lib/favoriteApi";
export default function Pages() {
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const auth = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const toggleFavorite = async (pageId: number) => {
    if (!auth.user) return;
    try {
      // Appel toggle backend, il retourne soit un DTO (favori créé) soit null (favori supprimé)
      const toggledFavorite = await toggleFavoriteApi(pageId, auth.user.access_token);
      
      if (toggledFavorite) {
        // Favori ajouté => on l'ajoute à la liste frontend
        setFavorites((prev) => [...prev, pageId]);
      } else {
        // Favori supprimé => on le retire de la liste frontend
        setFavorites((prev) => prev.filter((id) => id !== pageId));
      }
    } catch (err) {
      console.error("Erreur lors du toggle favori :", err);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (!auth.user || !id) return;
      try {
        const [chapterList, pageList] = await Promise.all([
          getChapters(auth.user.access_token),
          getPagesByChapterId(Number(id), auth.user.access_token),
        ]);
        const chapterFound = chapterList.find((c) => c.id === Number(id)) ?? null;
        setChapter(chapterFound);
        const sortedPages = pageList.sort((a, b) => a.pageNumber - b.pageNumber);
        setPages(sortedPages);
        const favoritesData: FavoriteDTO[] = await getFavoritesByUser(auth.user.access_token);
        setFavorites(favoritesData.map((f) => f.pageId));        

      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auth.user, id]);

  const handleDelete = async (pageId: number) => {
    if (!auth.user) return;
    try {
      await deletePage(pageId, auth.user.access_token);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  const filteredPages = pages.filter((page) => {
    const q = searchQuery.toLowerCase();
    return (
      page.pageNumber.toString().includes(q) ||
      page.status.toLowerCase().includes(q)
      // Tu peux ajouter ici d'autres champs si nécessaire (ex: contenu ?)
    );
  });  
  const handlePageCreated = (newPage: Page) => {
    setPages((prev) => [...prev, newPage].sort((a, b) => a.pageNumber - b.pageNumber));
  };
  const getStatusColor = (status: PageStatus) => {
    switch (status) {
      case PageStatus.Draft:
        return "bg-red-300 text-red-800";      
      case PageStatus.Published:
        return "bg-green-300 text-green-800";  
      case PageStatus.Archived:
        return "bg-yellow-200 text-yellow-900"; 
      default:
        return "bg-gray-200 text-gray-800";   
    }
    
  };
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pages du chapitre : <span className="text-primary">{chapter?.chapterTitle || "..."}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Consultez et gérez les pages de ce chapitre</p>
        </div>
        
        <Button asChild variant="outline">
          <Link to="/chapters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux chapitres 
          </Link>
        </Button>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-accent hover:bg-accent/90 flex items-center gap-2"
        >
          + Nouvelle page
        </Button>
      </div>
      <div className="max-w-md mb-6">
  <input
    type="text"
    placeholder="Rechercher une page par son numéro ou type ..."
    className="w-full px-4 py-2 border rounded-md shadow-sm"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
      {loading ? (
        <p>Chargement...</p>
      ) : filteredPages.length === 0 ? (
        <p>Aucune page trouvée pour ce chapitre.</p>      
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <Card key={page.id} className="relative flex flex-col hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="text-primary w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <CardTitle className="text-xl">Page {page.pageNumber}</CardTitle>
                  <Badge className={getStatusColor(page.status)}>{page.status}</Badge>
                </div>
                <Button
  variant="ghost"
  size="icon"
  onClick={() => toggleFavorite(page.id)}
  className="absolute top-2 right-2 hover:text-yellow-500"
>
  {favorites.includes(page.id) ? (
    <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />
  ) : (
    <StarOff className="w-5 h-5 text-gray-400" />
  )}
</Button>
              </CardHeader>
              <CardContent className="flex justify-between items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/page/${page.id}`}>Voir le contenu</Link>
                </Button>
                <Button size="sm" onClick={() => handleDelete(page.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreatePageModal
        chapterId={Number(id)}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handlePageCreated}
        token={auth.user?.access_token ?? ""}
      />
    </div>
  );
}
