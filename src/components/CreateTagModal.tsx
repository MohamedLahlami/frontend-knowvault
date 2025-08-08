import {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateTagModal({
                            open,
                            onClose,
                            onCreate,
                            loading,
                        }: {
    open: boolean;
    onClose: () => void;
    onCreate: (label: string) => Promise<void>;
    loading: boolean;
}) {
    const [newTagInput, setNewTagInput] = useState("");

    useEffect(() => {
        if (!open) setNewTagInput("");
    }, [open]);

    const handleSubmit = async () => {
        if (!newTagInput.trim()) return;
        await onCreate(newTagInput.trim());
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-96"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">Créer un nouveau tag</h2>
                <Input
                    type="text"
                    placeholder="Nom du tag"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    disabled={loading}
                />
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !newTagInput.trim()}>
                        {loading ? "Création..." : "Créer"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
