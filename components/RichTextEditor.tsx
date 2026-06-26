"use client";

import { useRef, useState } from "react";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const insertText = (text: string) => {
    onChange(value + text);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }

    try {
      setIsUploading(true);

      const imageUrl = await uploadImageToCloudinary(file);

      const altText = window.prompt(
        "画像説明を入力してください（任意）"
      );

      insertText(`\n![${altText || "画像"}](${imageUrl})\n`);

      event.target.value = "";
    } catch (error) {
      console.error(error);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2 rounded-2xl border bg-slate-50 p-2">
        <button
          type="button"
          onClick={() => insertText("**太字**")}
          className="rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-700"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => insertText("*斜体*")}
          className="rounded-xl border bg-white px-3 py-2 text-sm italic text-slate-700"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => insertText("~~打消し線~~")}
          className="rounded-xl border bg-white px-3 py-2 text-sm line-through text-slate-700"
        >
          S
        </button>

        <button
          type="button"
          onClick={() => insertText("[リンク名](https://example.com)")}
          className="rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-700"
        >
          🔗 Link
        </button>

        <button
          type="button"
          onClick={handleImageButtonClick}
          disabled={isUploading}
          className="rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
        >
          {isUploading ? "アップロード中..." : "🖼 Image"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <textarea
        className="min-h-44 w-full rounded-2xl border px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="どんなゲームを作りたいか、どんな人を募集しているかを書いてください。"
      />

      <p className="mt-2 text-xs font-medium text-slate-600">
        Markdown形式で、太字・斜体・打消し線・リンク・画像に対応しています。
      </p>
    </div>
  );
}