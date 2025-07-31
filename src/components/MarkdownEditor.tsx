// components/MarkdownEditor.tsx
import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";


interface MarkdownEditorProps {
  initialMarkdown: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ initialMarkdown, onChange }: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(initialMarkdown || "");

  useEffect(() => {
    setMarkdown(initialMarkdown || "");
  }, [initialMarkdown]);

  const handleChange = (val: string | undefined) => {
    const value = val || "";
    setMarkdown(value);
    onChange(value);
  };

  return (
    <div data-color-mode="dark" className="w-full">
      <MDEditor
        value={markdown}
        onChange={handleChange}
        height={400}
        extraCommands={[]} // Retire les commandes inutiles (comme couleur, H3, etc.)
        visibleDragbar={false}
      />
    </div>
  );
}
