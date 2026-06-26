"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { createPost } from "../../../services/postService";
import RichTextEditor from "../../../components/RichTextEditor";

const roleOptions = [
  "プログラマ",
  "グラフィッカー",
  "サウンド",
  "企画",
  "シナリオ",
  "その他",
];

const countOptions = ["1人", "2人", "3人", "4人", "5人以上"];

export default function NewPostPage() {
  const { uid, email } = useAuthUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tools, setTools] = useState("");
  const [neededCount, setNeededCount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

  const [message, setMessage] = useState("");

  const toggleRole = (role: string) => {
    setRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role]
    );
  };

  const handleCreatePost = async () => {
    if (!uid) {
      setMessage("ログインしてください。");
      return;
    }

    if (!title || !description || !genre || roles.length === 0 || !neededCount) {
      setMessage("タイトル、内容、ジャンル、募集職種、募集人数は必須です。");
      return;
    }

    await createPost({
      title,
      description,
      genre,
      roles,
      tools,
      neededCount,
      deadline,
      ownerId: uid,
      ownerEmail: email,
    });

    router.push("/");
  };

  return (
    <AuthGuard>
      <main className="mx-auto max-w-3xl px-6 py-10 text-slate-950">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold text-slate-700">
            New Post
          </p>
          <h1 className="text-3xl font-bold text-slate-950">
            募集を投稿する
          </h1>
          <p className="mt-2 text-sm text-slate-700">
            一緒に制作するメンバーを募集しましょう。
          </p>
        </div>

        <section className="space-y-5 rounded-3xl border bg-white p-6 text-slate-950 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-800">
              タイトル
            </label>
            <input
              className="w-full rounded-2xl border px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：短編ホラーゲームを一緒に作りたい！"
            />
          </div>

          <div>
  <label className="mb-1 block text-sm font-bold text-slate-800">
    制作内容
  </label>

  <RichTextEditor
    value={description}
    onChange={setDescription}
  />
</div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-800">
              ジャンル
            </label>
            <input
              className="w-full rounded-2xl border px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="例：ホラー、アクション、RPG"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              募集職種
            </label>
            <div className="flex flex-wrap gap-2">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    roles.includes(role)
                      ? "bg-slate-950 text-white"
                      : "border bg-white text-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-800">
              使用ツール
            </label>
            <input
              className="w-full rounded-2xl border px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              placeholder="例：Unity, Blender, Aseprite"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-800">
              募集人数
            </label>
            <select
              className="w-full rounded-2xl border px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
              value={neededCount}
              onChange={(e) => setNeededCount(e.target.value)}
            >
              <option value="">選択してください</option>
              {countOptions.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-slate-800">
              締切
            </label>
            <input
              type="date"
              className="w-full rounded-2xl border px-4 py-3 text-slate-950 outline-none focus:border-slate-400"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <button
            onClick={handleCreatePost}
            className="w-full rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white hover:bg-slate-800"
          >
            投稿する
          </button>

          {message && (
            <p className="text-sm font-bold text-red-600">
              {message}
            </p>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}