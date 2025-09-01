import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import {
  createComment,
  deleteComment,
  getCommentsByPageId,
} from "@/lib/commentApi";
import { CommentDTO } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

type CommentsPanelProps = {
  pageId: number;
  isOpen: boolean;
  onClose: () => void;
  pageTitle?: string;
  onCountChange?: (count: number) => void;
};

const PAGE_SIZE = 20;

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  pageId,
  isOpen,
  onClose,
  onCountChange,
}) => {
  const auth = useAuth();
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  interface AuthUser {
    preferred_username?: string;
    access_token: string;
    // add other properties as needed
  }

  const preferredUsername: string | undefined = (auth.user as AuthUser)
    ?.preferred_username;

  const canDelete = (c: CommentDTO) =>
    preferredUsername && c.utilisateurLogin === preferredUsername;

  const loadPage = async (reset = false) => {
    if (!auth.user) return;
    setLoading(true);
    try {
      const nextPage = reset ? 0 : page;
      const res = await getCommentsByPageId(
        pageId,
        auth.user.access_token,
        nextPage,
        PAGE_SIZE,
        "createdAt,desc"
      );
      const newItems = res.content;
      setComments((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(!res.last);
      setPage(reset ? 1 : nextPage + 1);
      if (onCountChange) onCountChange(res.totalElements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setComments([]);
    setPage(0);
    setHasMore(true);
    loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pageId, auth.user]);

  const handleSubmit = async () => {
    if (!auth.user) return;
    const text = input.trim();
    if (!text) return;
    setLoading(true);
    try {
      const created = await createComment(
        { text, pageId },
        auth.user.access_token
      );
      setInput("");
      setComments((prev) => [created, ...prev]);
      // focus back
      inputRef.current?.focus();
      if (onCountChange)
        onCountChange(((prevCount) => {
          // if parent provided a state setter directly, we can't read previous here.
          // So just recompute as current list length after optimistic add.
          return comments.length + 1;
        }) as unknown as number);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!auth.user) return;
    const prev = comments;
    setComments(prev.filter((c) => c.id !== id));
    try {
      await deleteComment(id, auth.user.access_token);
      if (onCountChange) onCountChange(comments.length - 1);
    } catch (e) {
      // revert on failure
      setComments(prev);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-background border-l z-50 flex flex-col"
      data-exclude-from-pdf
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-semibold">Commentaires</div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Fermer
        </Button>
      </div>
      <div className="p-3 border-b">
        <Input
          ref={inputRef}
          placeholder="Ajouter un commentaire..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {comments.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>@{c.utilisateurLogin}</span>
                <span>{formatRelativeTime(c.createdAt)}</span>
              </div>
              <div className="mt-2 whitespace-pre-wrap break-words text-sm">
                {c.text}
              </div>
              {canDelete(c) && (
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {!comments.length && !loading && (
          <div className="text-center text-sm text-muted-foreground py-8">
            Aucun commentaire
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center py-3">
            <Button variant="outline" size="sm" onClick={() => loadPage()}>
              Charger plus
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPanel;
