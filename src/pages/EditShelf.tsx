import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AlertDialog from "@/components/AlertDialog";
import { BookOpen, Check, FileText, Hash, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEditShelf, useGetShelfById } from "@/hooks/useShelves.ts";
import { useTags } from "@/hooks/useTags.ts";
import { Tag } from "@/types/tag.ts";
import {CreateTagModal} from "@/components/CreateTagModal.tsx";

export default function EditShelf() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { shelf, loading: loadingShelf, error: fetchError } = useGetShelfById(Number(id));
    const { handleEditShelf, loading: loadingEdit, error: errorEdit } = useEditShelf();

    const {
        tags: tagValues,
        loading: loadingTags,
        error: errorTags,
        handleCreateShelfTag,
    } = useTags();

    const [label, setLabel] = useState("");
    const [description, setDescription] = useState("<p><br></p>");
    const [tag, setTag] = useState<Tag | null>(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState<"success" | "error">("success");

    const [modalOpen, setModalOpen] = useState(false);
    const [tagCreationLoading, setTagCreationLoading] = useState(false);

    useEffect(() => {
        if (shelf) {
            setLabel(shelf.label);
            setDescription(shelf.description || "<p><br></p>");
        }
    }, [shelf]);

    useEffect(() => {
        if (!loadingTags && tagValues.length > 0) {
            if (shelf && shelf.tag) {
                const foundTag = tagValues.find((t) => t.id === shelf.tag.id);
                setTag(foundTag ?? tagValues[0]);
            } else {
                setTag(tagValues[0]);
            }
        }
    }, [loadingTags, tagValues, shelf]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tag) {
            setAlertMessage("Veuillez sélectionner un tag.");
            setAlertState("error");
            setAlertOpen(true);
            return;
        }

        const updatedShelf = await handleEditShelf(Number(id), {
            label,
            description,
            tag,
        });

        if (updatedShelf) {
            setAlertMessage("Étagère mise à jour avec succès !");
            setAlertState("success");
            setAlertOpen(true);
        } else if (errorEdit) {
            setAlertMessage(errorEdit);
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

    if (loadingShelf || loadingTags)
        return <div className="p-6 text-center">Chargement en cours...</div>;
    if (fetchError)
        return <div className="p-6 text-red-600 text-center">Erreur : {fetchError}</div>;
    if (errorTags)
        return <div className="p-6 text-red-600 text-center">Erreur tags : {errorTags}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border">
                        <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Modifier l'étagère</h1>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
                    {/* Nom */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Hash size={16} />
                            Nom de l'étagère *
                        </label>
                        <Input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            disabled={loadingEdit}
                            required
                            className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                            readOnly={loadingEdit}
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
                                    disabled={loadingEdit}
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
                                disabled={loadingEdit}
                                className="p-3 rounded-lg border-2 text-gray-500 text-xl font-bold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center"
                                aria-label="Ajouter un nouveau tag"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t flex gap-4">
                    <Button
                        variant="outline"
                        className="flex-1 h-12 border-gray-200"
                        onClick={() => navigate("/shelves")}
                        disabled={loadingEdit}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loadingEdit || !label.trim()}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    >
                        {loadingEdit ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                Mise à jour...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Check size={18} />
                                Sauvegarder
                            </div>
                        )}
                    </Button>
                </div>

                {/* Alert */}
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
