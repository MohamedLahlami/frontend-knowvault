import React, { useState } from "react";
import ReactQuill from "react-quill";
import ReactMde from "react-mde";
import { marked } from "marked";
import "react-quill/dist/quill.snow.css";
import "react-mde/lib/styles/css/react-mde-all.css";

import { createPage } from "@/lib/pageApi";
import { useAuth } from "react-oidc-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Page, PageStatus } from "@/types/page";

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: number;
  onPageCreated: (newPage: Page) => void;
}

export default function PageModal({ isOpen, onClose, chapterId, onPageCreated }: PageModalProps) {
  const auth = useAuth();

  const [editorType, setEditorType] = useState<"quill" | "markdown">("quill");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!auth.user) return;
    setLoading(true);
    setError(null);

    try {
      const htmlToSave =
        editorType === "quill" ? htmlContent : await marked.parse(markdownContent);

      const markdownToSave = editorType === "markdown" ? markdownContent : "";

      const newPage = await createPage(
        {
          pageNumber,
          chapterId,
          content: htmlToSave,
          markDownContent: markdownToSave,
          status: PageStatus.Draft,

        },
        auth.user.access_token
      );

      onPageCreated(newPage);
      onClose();
      // Reset form
      setHtmlContent("");
      setMarkdownContent("");
      setPageNumber(1);
    } catch (err) {
      console.error("Erreur création :", err);
      setError("Échec de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle page</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="pageNumber">Numéro de page</Label>
            <Input
              id="pageNumber"
              type="number"
              value={pageNumber}
              onChange={(e) => setPageNumber(parseInt(e.target.value))}
              min={1}
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant={editorType === "quill" ? "default" : "outline"}
              onClick={() => setEditorType("quill")}
            >
              Éditeur visuel
            </Button>
            <Button
              variant={editorType === "markdown" ? "default" : "outline"}
              onClick={() => setEditorType("markdown")}
            >
              Éditeur Markdown
            </Button>
          </div>

          {editorType === "quill" ? (
            <ReactQuill theme="snow" value={htmlContent} onChange={setHtmlContent} />
          ) : (
            <ReactMde
              value={markdownContent}
              onChange={setMarkdownContent}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(marked.parse(markdown))
              }
            />
          )}

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Création..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
