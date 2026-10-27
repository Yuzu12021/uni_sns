
"use client";

import { useRef, useState } from "react";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "内容を入力してください。",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const imageCount = (
    value.match(/!\[[^\]]*\]\([^)]+\)/g) || []
  ).length;

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

    if (imageCount >= 2) {
      alert("画像は2枚まで挿入できます。");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const imageUrl = await uploadImageToCloudinary(file);

      const altText = window.prompt(
        "画像説明を入力してください（任意）"
      );

      const imageMarkdown =
        `\n![${altText || "画像"}](${imageUrl})\n`;

      onChange(value + imageMarkdown);
    } catch (error) {
      console.error(error);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setIsUploading(false);
      event.target.value = "";
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
          onClick={() =>
            insertText("[リンク名](https://example.com)")
          }
          className="rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-700"
        >
          🔗 Link
        </button>

        <button
          type="button"
          onClick={handleImageButtonClick}
          disabled={isUploading || imageCount >= 2}
          className="rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
        >
          {isUploading
            ? "アップロード中..."
            : `🖼 Image (${imageCount}/2)`}
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
        placeholder={placeholder}
      />

      <p className="mt-2 text-xs font-medium text-slate-600">
        Markdown形式で、太字・斜体・打消し線・リンク・画像に対応しています。
        画像は最大2枚までです。
      </p>
    </div>
  );
}
