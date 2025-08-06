import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPagesByChapterId, deletePage } from "@/lib/pageApi";
import { getChapters } from "@/lib/chapterApi";
import { Page } from "@/types/page";
import { Chapter } from "@/types/chapter";
import { useAuth } from "react-oidc-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Trash,
  MoreVertical,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageStatus } from "@/types/page";
import CreatePageModal from "@/components/CreatePageModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import html2pdf from "html2pdf.js";

export default function Pages() {
  const { id } = useParams();
  const auth = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.user || !id) return;
      try {
        const [chapterList, pageList] = await Promise.all([
          getChapters(auth.user.access_token),
          getPagesByChapterId(Number(id), auth.user.access_token),
        ]);
        const chapterFound =
          chapterList.find((c) => c.id === Number(id)) ?? null;
        setChapter(chapterFound);
        const sortedPages = pageList.sort(
          (a, b) => a.pageNumber - b.pageNumber
        );
        setPages(sortedPages);
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

  const handlePageCreated = (newPage: Page) => {
    setPages((prev) =>
      [...prev, newPage].sort((a, b) => a.pageNumber - b.pageNumber)
    );
  };
  const getStatusColor = (status: PageStatus) => {
    switch (status) {
      case PageStatus.Draft:
        return "bg-red-300 text-red-800"; // lighter red bg, darker red text for contrast
      case PageStatus.Published:
        return "bg-green-300 text-green-800"; // lighter green bg, darker green text
      case PageStatus.Archived:
        return "bg-yellow-200 text-yellow-900"; // very light yellow bg, dark yellow text
      default:
        return "bg-gray-200 text-gray-800"; // soft gray bg with dark gray text
    }
  };

  const handleExportPDF = async (pageId: number) => {
    // Navigate to the page and trigger PDF export
    window.open(`/page/${pageId}?export=pdf`, "_blank");
  };
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pages du chapitre :{" "}
            <span className="text-primary">
              {chapter?.chapterTitle || "..."}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Consultez et gérez les pages de ce chapitre
          </p>
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

      {loading ? (
        <p>Chargement...</p>
      ) : pages.length === 0 ? (
        <p>Aucune page trouvée pour ce chapitre.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="relative flex flex-col hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="flex flex-row items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="text-primary w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <CardTitle className="text-xl">
                    Page {page.pageNumber}
                  </CardTitle>
                  <Badge className={getStatusColor(page.status)}>
                    {page.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/page/${page.id}`}>Voir le contenu</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExportPDF(page.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter en PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 focus:bg-red-600 focus:text-white"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
