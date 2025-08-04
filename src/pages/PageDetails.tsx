import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPageById, getPagesByChapterId, updatePage } from "@/lib/pageApi";
import { Page ,PageStatus} from "@/types/page";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Edit2, Save, X } from "lucide-react";
import { marked } from "marked";
import { useAuth } from "react-oidc-context";
import MarkdownEditor from "@/components/MarkdownEditor";

marked.setOptions({ gfm: true, breaks: true });

export default function PageDetails() {
  const { pageId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState<Page | null>(null);
  const [chapterPages, setChapterPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<PageStatus>(PageStatus.Draft);
  const [markDownContent, setMarkDownContent] = useState<string>("");

  useEffect(() => {
    const fetchPageAndPages = async () => {
      if (!pageId || !auth.user) return;
      setLoading(true);
      setError(null);
      try {
        const pageData = await getPageById(Number(pageId), auth.user.access_token);
        setPage(pageData);
        setMarkDownContent(pageData.markDownContent || "");

        const pagesOfChapter = await getPagesByChapterId(pageData.chapterId, auth.user.access_token);
        pagesOfChapter.sort((a, b) => a.pageNumber - b.pageNumber);
        setChapterPages(pagesOfChapter);
      } catch (err) {
        console.error("Erreur de chargement :", err);
        setError("Impossible de charger cette page.");
      } finally {
        setLoading(false);
      }
    };
    fetchPageAndPages();
  }, [pageId, auth.user]);

  const currentIndex = chapterPages.findIndex(p => p.id === Number(pageId));
  const prevPage = currentIndex > 0 ? chapterPages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < chapterPages.length - 1 ? chapterPages[currentIndex + 1] : null;

  const handleSave = async () => {
    if (!page || !auth.user) return;
    setLoading(true);
    setError(null);

    try {
      const htmlFromMarkdown = await marked.parse(markDownContent);

      await updatePage(
        page.id,
        {
          content: htmlFromMarkdown,
          markDownContent: markDownContent,status: status,
        },
        auth.user.access_token
      );

      setPage({
        ...page,
        content: htmlFromMarkdown,
        markDownContent: markDownContent,
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Erreur de sauvegarde :", err);
      setError("Échec de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!page) return null;
    const html = page.content || "";  console.log("HTML à afficher :", html);  
    return (
      <div
        className="prose max-w-none bg-white p-6 rounded-lg shadow mt-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Chargement de la page...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">{error}</div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Aucune page trouvée.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <Button asChild variant="outline">
        <Link to={`/chapters/${page.chapterId}`}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour au chapitre
        </Link>
      </Button>

      <h1 className="text-4xl font-bold">Page {page.pageNumber}</h1>
      <p className="text-muted-foreground">Statut : {page.status}</p>

      <div className="flex gap-4 my-4">
        <Button
          variant="outline"
          disabled={!prevPage}
          onClick={() => prevPage && navigate(`/page/${prevPage.id}`)}
          className="flex items-center gap-2"
        >
          <ChevronLeft /> Page précédente
        </Button>
        <Button
          variant="outline"
          disabled={!nextPage}
          onClick={() => nextPage && navigate(`/page/${nextPage.id}`)}
          className="flex items-center gap-2"
        >
          Page suivante <ChevronRight />
        </Button>

        {!isEditing && (
          <Button
            variant="secondary"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit2 /> Modifier
          </Button>
        )}
      </div>

      {isEditing && (
        <>
          <MarkdownEditor
            initialMarkdown={markDownContent}
            onChange={setMarkDownContent}
          />
<div>
  <label htmlFor="status" className="block mb-1 font-medium">
    Statut
  </label>
  <select
    id="status"
    className="w-full border px-3 py-2 rounded"
    value={status}
    onChange={(e) => setStatus(e.target.value as Page["status"])}
  >
     <option value="DRAFT">Brouillon</option>
    <option value="PUBLISHED">Publié</option>
    <option value="ARCHIVED">Archivé</option>
  </select>
</div>

          <div className="flex gap-4 mt-4">
            <Button
              variant="secondary"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save /> Sauvegarder
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setMarkDownContent(page.markDownContent || "");
              }}
              className="flex items-center gap-2"
            >
              <X /> Annuler
            </Button>
          </div>
        </>
      )}

      {!isEditing && renderContent()}
    </div>
  );
}
