"use client";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const insertText = (before: string, after = "") => {
    onChange(value + before + after);
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
          onClick={() => insertText("![画像説明](https://example.com/image.png)")}
          className="rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-700"
        >
          🖼 Image
        </button>
      </div>

      <textarea
        className="min-h-44 w-full rounded-2xl border px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="どんなゲームを作りたいか、どんな人を募集しているかを書いてください。"
      />

      <p className="mt-2 text-xs font-medium text-slate-600">
        Markdown形式で、太字・斜体・リンク・画像URLに対応しています。
      </p>
    </div>
  );
}