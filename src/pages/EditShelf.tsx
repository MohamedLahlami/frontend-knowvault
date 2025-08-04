import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "@/types/shelf";
import AlertDialog from "@/components/AlertDialog";
import { BookOpen, Check, FileText, Hash, Loader2 } from "lucide-react";
import {useEditShelf, useGetShelfById} from "@/hooks/useShelves.ts";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function EditShelf() {
    const { id } = useParams();
    const navigate = useNavigate();
    const tagValues = Object.values(Tag) as Tag[];
    const { shelf, loading: loadingShelf, error: fetchError } = useGetShelfById(Number(id));
    const { handleEditShelf, loading, error } = useEditShelf();
    const [label, setLabel] = useState("");
    const [description, setDescription] = useState("<p><br></p>");
    const [tag, setTag] = useState<Tag>(tagValues[0]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState<"success" | "error">("success");

    useEffect(() => {
        if (shelf) {
            setLabel(shelf.label);
            setDescription(shelf.description || "");
            setTag(shelf.tag);
        }
    }, [shelf]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedShelf = await handleEditShelf(Number(id), {
            label,
            description,
            tag,
        });

        if (updatedShelf) {
            setAlertMessage("Étagère mise à jour avec succès !");
            setAlertState("success");
            setAlertOpen(true);
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

    if (loadingShelf) return <div className="p-6">Chargement en cours...</div>;
    if (fetchError) return <div className="p-6 text-red-500">Erreur : {fetchError}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border">
                        <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Modifier l'étagère
                    </h1>
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
                            disabled={loading}
                            required
                            className="h-12 text-base border-gray-200"
                        />
                        <div className="text-xs text-gray-500">{label.length}/50 caractères</div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <FileText size={16}/>
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
                            {description.replace(/<[^>]+>/g, "").length}/100 caractères
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <BookOpen size={16}/>
                            Tag
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {tagValues.map((tagValue) => (
                                <button
                                    key={tagValue}
                                    type="button"
                                    onClick={() => setTag(tagValue)}
                                    disabled={loading}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium ${
                                        tag === tagValue
                                            ? "border-gray-800 bg-gray-100"
                                            : "bg-white border-gray-200 text-gray-600"
                                    }`}
                                >
                                    {tagValue}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t flex gap-4">
                    <Button
                        variant="outline"
                        className="flex-1 h-12 border-gray-200"
                        onClick={() => navigate("/shelves")}
                        disabled={loading}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !label.trim()}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    >
                        {loading ? (
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
        </div>
    );
}
