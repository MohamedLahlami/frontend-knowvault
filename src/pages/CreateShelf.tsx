import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateShelf } from "@/hooks/useShelves.ts";
import { useTags } from "@/hooks/useTags.ts";
import { useNavigate } from "react-router-dom";
import AlertDialog from "@/components/AlertDialog";
import { BookOpen, Check, FileText, Hash, Loader2, AlertCircle, Plus } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Tag } from "@/types/tag.ts";
import { CreateTagModal } from "@/components/CreateTagModal";
export default function CreateShelf() {
    const { tags: tagValues, loading: loadingTags, error: errorTags, handleCreateShelfTag } = useTags();
    const [label, setLabel] = useState("");
    const [description, setDescription] = useState("<p><br></p>");
    const [tag, setTag] = useState<Tag | null>(null);
    const [success, setSuccess] = useState(false);
    const { handleCreateShelf, loading, error } = useCreateShelf();
    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState<"success" | "error">("success");

    const [modalOpen, setModalOpen] = useState(false);
    const [tagCreationLoading, setTagCreationLoading] = useState(false);

    useEffect(() => {
        if (!loadingTags && tagValues.length > 0 && !tag) {
            setTag(tagValues[0]);
        }
    }, [loadingTags, tagValues, tag]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tag) {
            setAlertMessage("Veuillez sélectionner un tag.");
            setAlertState("error");
            setAlertOpen(true);
            return;
        }

        const createdShelf = await handleCreateShelf({ label, description, tag });

        if (createdShelf) {
            setAlertMessage("Étagère créée avec succès !");
            setAlertState("success");
            setAlertOpen(true);
            setSuccess(true);
        } else if (error) {
            setAlertMessage(error);
            setAlertState("error");
            setAlertOpen(true);
            setTimeout(() => setAlertOpen(false), 4000);
        }
    };

    const handleAlertAnimationEnd = () => {
        if (alertState === "success") {
            navigate("/shelves");
        }
    };

    const handleAddNewTag = async (label: string) => {
        if (tagValues.find((t) => t.label.toLowerCase() === label.toLowerCase())) {
            setAlertMessage("Ce tag existe déjà.");
            setAlertState("error");
            setAlertOpen(true);
            return;
        }

        setTagCreationLoading(true);
        try {
            const newTag = await handleCreateShelfTag(label, "SHELF");
            if (newTag) {
                setTag(newTag);
                setModalOpen(false);
            }
        } catch {
            setAlertMessage("Erreur lors de la création du tag.");
            setAlertState("error");
            setAlertOpen(true);
        } finally {
            setTagCreationLoading(false);
        }
    };

    if (loadingTags)
        return <div className="p-4 text-center">Chargement des tags...</div>;

    if (errorTags)
        return (
            <div className="p-4 text-center text-red-600">
                Erreur lors du chargement des tags : {errorTags}
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border">
                        <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle étagère</h1>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Nom */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Hash size={16} />
                                Nom de l'étagère *
                            </label>
                            <Input
                                type="text"
                                placeholder="Documentation..."
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                disabled={loading}
                                required
                                className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                maxLength={50}
                            />
                            <div className="text-xs text-gray-500">{label.length}/50 caractères</div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText size={16} />
                                Description
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={setDescription}
                                className="bg-white"
                                readOnly={loading}
                            />
                            <div className="text-xs text-gray-500">
                                {description.replace(/<[^>]+>/g, "").length}/200 caractères
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <BookOpen size={16} />
                                Tag
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {tagValues.map((tagValue) => (
                                    <button
                                        key={tagValue.id}
                                        type="button"
                                        onClick={() => setTag(tagValue)}
                                        disabled={loading || loadingTags}
                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                                            tag?.id === tagValue.id
                                                ? "border-gray-800 bg-gray-100 shadow-sm"
                                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        {tagValue.label}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setModalOpen(true)}
                                    disabled={loading || loadingTags}
                                    className="p-3 rounded-lg border-2 text-gray-500 text-xl font-bold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center"
                                    aria-label="Ajouter un nouveau tag"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-12 font-medium border-gray-200 hover:bg-gray-50"
                        disabled={loading}
                        onClick={() => navigate("/shelves")}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !label.trim()}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                Enregistrement...
                            </div>
                        ) : success ? (
                            <div className="flex items-center gap-2">
                                <Check size={18} />
                                Créé !
                            </div>
                        ) : (
                            "Créer l'étagère"
                        )}
                    </Button>
                </div>

                <AlertDialog
                    message={alertMessage}
                    open={alertOpen}
                    state={alertState}
                    onClose={() => setAlertOpen(false)}
                    onAnimationEnd={handleAlertAnimationEnd}
                />
            </div>

            <CreateTagModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleAddNewTag}
                loading={tagCreationLoading}
            />
        </div>
    );
}
