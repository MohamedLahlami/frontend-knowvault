import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { summarizeDocument, SummarizeAlgorithm } from "@/lib/aiApi";
import { getChaptersByBookId } from "@/lib/chapterApi";
import { getPagesByChapterId } from "@/lib/pageApi";
import type { Chapter } from "@/types/chapter";
import type { Page } from "@/types/page";
import { useToast } from "@/components/ui/use-toast";
<<<<<<< HEAD
import { Sparkles } from "lucide-react";
=======
>>>>>>> 6f5602025305d99cb6d9bf104e5f4a208d892410

interface SummarizeBookDialogProps {
  bookId: number;
  trigger?: React.ReactNode;
}

export function SummarizeBookDialog({
  bookId,
  trigger,
}: SummarizeBookDialogProps) {
  const { toast } = useToast();
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [documentText, setDocumentText] = useState("");
  const [summary, setSummary] = useState("");
  const [language, setLanguage] = useState("english");
  const [sentences, setSentences] = useState(3);
  const [algorithm, setAlgorithm] = useState<SummarizeAlgorithm>("textrank");

  useEffect(() => {
    if (!open) return;
    const fetchEverything = async () => {
      if (!auth.user) return;
      setLoading(true);
      setSummary("");
      try {
        const loadedChapters = await getChaptersByBookId(
          bookId,
          auth.user.access_token
        );
        // Sort by some natural order if available (assuming id order reflects creation)
        setChapters(loadedChapters);

        // Fetch pages for each chapter in parallel
        const pagesArrays = await Promise.all(
          loadedChapters.map((ch) =>
            getPagesByChapterId(ch.id, auth.user!.access_token)
          )
        );

        // Build aggregated document text
        const parts: string[] = [];
        loadedChapters.forEach((ch, idx) => {
          const pages: Page[] = pagesArrays[idx] || [];
          pages.sort((a, b) => a.pageNumber - b.pageNumber);
          parts.push(`# ${ch.chapterTitle}`);
          pages.forEach((p) => {
            const body =
              (p.markDownContent && p.markDownContent.trim()) ||
              p.content ||
              "";
            if (body) {
              parts.push(body);
            }
          });
        });
        setDocumentText(parts.join("\n\n"));
      } catch (err) {
        console.error(err);
        toast({
          title: "Erreur",
          description: "Impossible de charger le contenu du livre.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEverything();
  }, [open, bookId, auth.user, toast]);

  const canSummarize = useMemo(
    () => documentText.trim().length > 0 && !loading,
    [documentText, loading]
  );

  const handleSummarize = async () => {
    if (!auth.user) return;
    if (!canSummarize) return;
    setLoading(true);
    try {
      const res = await summarizeDocument(
        {
          document: documentText,
          language,
          sentences,
          algorithm,
        },
        auth.user.access_token
      );
      setSummary(res.summary);
      toast({ title: "Résumé généré" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "La synthèse a échoué.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Résumé du livre avec l'IA</DialogTitle>
          <DialogDescription>
            Agrège le contenu de toutes les pages du livre, puis génère un
            résumé.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 space-y-4">
<<<<<<< HEAD
=======
            <p className="text-xs text-muted-foreground">
              input language is set to {language},{" "}
              <button
                type="button"
                className="underline hover:text-foreground"
                onClick={() =>
                  setLanguage(language === "english" ? "french" : "english")
                }
              >
                change to {language === "english" ? "french" : "english"}
              </button>
            </p>
>>>>>>> 6f5602025305d99cb6d9bf104e5f4a208d892410
            <div>
              <Label>Langue</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="french">Français</SelectItem>
                  <SelectItem value="english">Anglais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Algorithme</Label>
              <Select
                value={algorithm}
                onValueChange={(v) => setAlgorithm(v as SummarizeAlgorithm)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir l'algorithme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="textrank">TextRank</SelectItem>
                  <SelectItem value="lexrank">LexRank</SelectItem>
                  <SelectItem value="lsa">LSA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nombre de phrases</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={sentences}
                onChange={(e) =>
                  setSentences(
                    Math.max(1, Math.min(10, Number(e.target.value) || 1))
                  )
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
<<<<<<< HEAD
=======
                variant="outline"
                onClick={handleSummarize}
                disabled={!canSummarize || loading}
              >
                {loading ? "Génération..." : "Résumer"}
              </Button>
              <Button
>>>>>>> 6f5602025305d99cb6d9bf104e5f4a208d892410
                variant="secondary"
                onClick={() => setSummary("")}
                disabled={loading}
              >
                Effacer le résultat
              </Button>
            </div>
          </div>

          <div className="col-span-2 space-y-3">
            <div>
              <Label>Contenu agrégé (aperçu)</Label>
              <Textarea
                value={documentText}
                readOnly
                className="min-h-[160px]"
              />
            </div>
            <div>
              <Label>Résumé</Label>
              <Textarea
                value={summary}
                readOnly
                placeholder="Le résumé apparaîtra ici"
                className="min-h-[160px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
<<<<<<< HEAD
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleSummarize}
            disabled={!canSummarize || loading}
          >
            {loading ? (
              "Génération..."
            ) : (
              <span className="inline-flex items-center">
                <Sparkles className="h-4 w-4 mr-2" /> Résumer avec l'IA
              </span>
            )}
=======
          <Button onClick={handleSummarize} disabled={!canSummarize || loading}>
            {loading ? "Génération..." : "Résumer avec l'IA"}
>>>>>>> 6f5602025305d99cb6d9bf104e5f4a208d892410
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SummarizeBookDialog;
