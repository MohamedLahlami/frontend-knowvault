import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Tag} from "@/types/shelf.ts";
import {useCreateShelf} from "@/hooks/useShelves.ts";
import {useNavigate} from "react-router-dom";
import AlertDialog from "@/components/AlertDialog";
import {BookOpen, Check, FileText, Hash, Loader2} from "lucide-react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';


export default function CreateShelf() {
    const tagValues = Object.values(Tag) as Tag[];

    const [label, setLabel] = useState("");
    const [description, setDescription] = useState("<p><br></p>");
    const [tag, setTag] = useState<Tag>(tagValues[0] as Tag);
    const [success, setSuccess] = useState(false);
    const { handleCreateShelf, loading, error } = useCreateShelf();
    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState<"success" | "error">("success");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const createdShelf = await handleCreateShelf({ label, description, tag });

        if (createdShelf) {
            setAlertMessage("Étagère créée avec succès !");
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
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
            {/* Header avec navigation */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border">
                        <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Créer une nouvelle étagère
                    </h1>
                </div>
            </div>

            {/* Carte principale avec hauteur fixe et scroll interne */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                {/* Contenu principal avec scroll */}
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Champ nom */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Hash size={16}/>
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
                            />
                            <div className="text-xs text-gray-500">
                                {label.length}/50 caractères
                            </div>
                        </div>

                        {/* Champ description */}
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
                                {description.replace(/<[^>]+>/g, "").length}/200 caractères
                            </div>
                        </div>

                        {/* Sélecteur de tag amélioré */}
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
                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                                            tag === tagValue
                                                ? "border-gray-800 bg-gray-100 shadow-sm"
                                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        {tagValue}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message d'erreur */}
                        {error && (
                            <div
                                className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                <AlertCircle size={18}/>
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {/* Message de succès */}
                        {success && (
                            <div
                                className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                                <Check size={18}/>
                                <span className="text-sm font-medium">
                                    Étagère créée avec succès !
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-12 font-medium border-gray-200 hover:bg-gray-50"
                        disabled={loading}
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
        </div>
    );
}