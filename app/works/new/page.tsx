
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthGuard from "../../../components/AuthGuard";
import RichTextEditor from "../../../components/RichTextEditor";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { createWork } from "../../../services/workService";
import { parseTags } from "../../../utils/tagUtils";

const roleOptions = [
  "プログラマ",
  "グラフィッカー",
  "サウンド",
  "企画",
  "シナリオ",
  "その他",
];

export default function NewWorkPage() {
  const router = useRouter();
  const { uid, email } = useAuthUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [tools, setTools] = useState("");
  const [workUrl, setWorkUrl] = useState("");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleRole = (role: string) => {
    setRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role]
    );
  };

  const handleCreateWork = async () => {
    if (isSubmitting) return;

    if (!uid) {
      setMessage("ログインしてください。");
      return;
    }

    if (!title.trim() || !description.trim() || roles.length === 0) {
      setMessage("作品タイトル、作品説明、担当役割は必須です。");
      return;
    }

    const imageCount = (
      description.match(/!\[[^\]]*\]\([^)]+\)/g) || []
    ).length;

    if (imageCount > 2) {
      setMessage("画像は2枚までです。");
      return;
    }

    // URLが入力されている場合は形式を確認
    if (workUrl.trim()) {
      try {
        const url = new URL(workUrl.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        setMessage("作品URLは https:// から始まる形式で入力してください。");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const workId = await createWork({
        title: title.trim(),
        description,
        roles,
        tools: parseTags(tools),
        workUrl: workUrl.trim(),
        ownerId: uid,
        ownerEmail: email ?? "",
      });

      // 詳細画面はまだないので、いったん作品投稿画面から移動する
      router.push("/");
      console.log("作成した作品ID:", workId);
    } catch (error) {
      console.error("作品投稿エラー:", error);
      setMessage("作品の投稿に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <main className="mx-auto max-w-3xl px-6 py-10 text-slate-950">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold text-slate-700">
            New Work
          </p>

          <h1 className="text-3xl font-bold">
            作品を投稿する
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            自分の作品や制作スキルを紹介しましょう。
          </p>
        </div>

        <section className="space-y-6 rounded-3xl border bg-white p-6 shadow-sm">
          {/* 作品タイトル */}
          <div>
            <label
              htmlFor="work-title"
              className="mb-1 block text-sm font-bold"
            >
              作品タイトル（必須）
            </label>

            <input
              id="work-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：Unityで制作した2Dアクションゲーム"
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-400"
            />
          </div>

          {/* 作品説明 */}
          <div>
            <p className="mb-1 text-sm font-bold">
              作品説明（必須）
            </p>

            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="作品の内容、工夫した点、自分が担当した部分などを書いてください。"
            />
          </div>

          {/* 担当役割 */}
          <div>
            <p className="mb-2 text-sm font-bold">
              担当した役割（必須）
            </p>

            <div className="flex flex-wrap gap-2">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  aria-pressed={roles.includes(role)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    roles.includes(role)
                      ? "bg-indigo-600 text-white"
                      : "border bg-white text-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* 使用ツール */}
          <div>
            <label
              htmlFor="work-tools"
              className="mb-1 block text-sm font-bold"
            >
              使用ツール
            </label>

            <input
              id="work-tools"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              placeholder="例：Unity, C#, Aseprite"
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-400"
            />

            <p className="mt-2 text-xs text-slate-500">
              「,」または「、」で区切って入力できます。
            </p>

            {parseTags(tools).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {parseTags(tools).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 作品URL */}
          <div>
            <label
              htmlFor="work-url"
              className="mb-1 block text-sm font-bold"
            >
              作品URL（任意）
            </label>

            <input
              id="work-url"
              type="url"
              value={workUrl}
              onChange={(e) => setWorkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-400"
            />

            <p className="mt-2 text-xs text-slate-500">
              GitHub、作品公開ページ、紹介動画などのURLを入力できます。
            </p>
          </div>

          {/* 投稿ボタン */}
          <button
            type="button"
            onClick={handleCreateWork}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "投稿中..." : "作品を投稿する"}
          </button>

          {message && (
            <p role="alert" className="text-sm font-bold text-red-600">
              {message}
            </p>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}
