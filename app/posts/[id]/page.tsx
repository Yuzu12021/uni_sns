"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import RoleBadge from "../../../components/RoleBadge";
import { useAuthUser } from "../../../hooks/useAuthUser";
import {
  createApplication,
  hasAlreadyApplied,
} from "../../../services/applicationService";
import { getPostById } from "../../../services/postService";
import { Post } from "../../../types/post";
import {
  closePost,
  deletePost,
} from "../../../services/postService";
import PostAuthor from "../../../components/PostAuthor";
import DescriptionRenderer from "../../../components/DescriptionRenderer";
import Link from "next/link";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  const { uid, email } = useAuthUser();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyMessage, setApplyMessage] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const isOwner = post?.ownerId === uid;
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const postData = await getPostById(postId);
      setPost(postData);
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const checkApplied = async () => {
      if (!uid || !postId) return;

      const applied = await hasAlreadyApplied(postId, uid);
      setIsApplied(applied);
    };

    checkApplied();
  }, [postId, uid]);

  const handleApply = async () => {
    if (!post || !uid || !email) {
      setApplyMessage("ログイン情報を確認できませんでした。");
      return;
    }

    if (post.ownerId === uid) {
      setApplyMessage("自分の投稿には応募できません。");
      return;
    }

    const alreadyApplied = await hasAlreadyApplied(postId, uid);

    if (alreadyApplied) {
      setIsApplied(true);
      setApplyMessage("すでに応募済みです。");
      return;
    }

    await createApplication({
      postId,
      postOwnerId: post.ownerId,
      applicantId: uid,
      applicantEmail: email,
    });

    setIsApplied(true);
    setApplyMessage("応募しました！");
  };

  const handleClosePost = async () => {
  if (!post || !isOwner) return;

  await closePost(postId, "manual");

  setPost({
    ...post,
    status: "応募終了",
  });
};

const handleDeletePost = async () => {
  if (!post || !isOwner) return;

  const ok = window.confirm("この投稿を削除しますか？");

  if (!ok) return;

  await deletePost(postId);

  router.push("/");
};

const formatDeleteDate = () => {
  if (!post?.deleteAt) return null;

  const deleteDate = (post.deleteAt as any).toDate();

  const now = new Date();

  const diffTime = deleteDate.getTime() - now.getTime();

  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

  const month = deleteDate.getMonth() + 1;
  const day = deleteDate.getDate();

  return `${month}月${day}日（あと${diffDays}日）`;
};

  if (loading) {
    return (
      <AuthGuard>
        <main className="mx-auto max-w-4xl px-6 py-10">
          <p>読み込み中...</p>
        </main>
      </AuthGuard>
    );
  }

  if (!post) {
    return (
      <AuthGuard>
        <main className="mx-auto max-w-4xl px-6 py-10">
          <p>投稿が見つかりませんでした。</p>
        </main>
      </AuthGuard>
    );
  }
  const deleteDateText = formatDeleteDate();
  return (
    <AuthGuard>
      <main className="mx-auto max-w-4xl px-6 py-10 text-slate-950">
  <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
    <div className="relative aspect-[16/6] bg-gradient-to-br from-slate-900 to-slate-700">
      <span
        className={`absolute left-5 top-5 rounded-full px-4 py-2 text-sm font-bold text-white ${
          post.status === "応募終了"
            ? "bg-red-600"
            : "bg-blue-600"
        }`}
      >
        {post.status}
      </span>

      <div className="absolute inset-0 flex items-center justify-center text-7xl text-white/80">
        🎮
      </div>
    </div>

    <div className="p-6 md:p-8">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
          {post.genre}
        </span>

        {post.roles.map((role) => (
          <RoleBadge key={role} role={role} />
        ))}
      </div>

      <h1 className="mb-4 text-3xl font-bold text-slate-950 leading-tight md:text-4xl">
        {post.title}
      </h1>

      <div className="mb-8 grid gap-3 text-sm font-medium text-slate-600 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          👥 募集人数：{post.neededCount || "未設定"}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          📅 締切：{post.deadline || "未設定"}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          🛠 使用ツール：{post.tools || "未設定"}
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold text-slate-950">
          制作内容
        </h2>

        <DescriptionRenderer content={post.description} />
      </section>

      <section className="mb-8 rounded-2xl bg-slate-50 p-5">
  <h2 className="mb-3 text-lg font-black">投稿者</h2>

  <PostAuthor
    ownerId={post.ownerId}
    ownerEmail={post.ownerEmail}
  />
</section>

      {deleteDateText && (
        <section className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="mb-2 text-lg font-black text-red-700">
            自動削除予定
          </h2>

          <p className="text-sm font-bold text-red-600">
            この投稿は {deleteDateText} に自動的に削除されます。
          </p>
        </section>
      )}

      {isOwner && (
  <section className="mb-8 rounded-2xl border bg-white p-5">
    <h2 className="mb-3 text-lg font-black">
      投稿管理
    </h2>

    <div className="flex flex-wrap gap-3">
      <Link
  href={`/posts/${postId}/edit`}
  className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white"
>
  投稿を編集する
</Link>

<button
  onClick={handleClosePost}
  disabled={post.status === "応募終了"}
  className={`rounded-2xl px-5 py-3 font-bold text-white ${
    post.status === "応募終了"
      ? "bg-slate-400"
      : "bg-amber-500"
  }`}
>
  {post.status === "応募終了" ? "応募終了済み" : "応募を終了する"}
</button>

<button
  onClick={handleDeletePost}
  className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white"
>
  投稿を削除する
</button>
    </div>
  </section>
)}

{!isOwner && (
  <>
    <button
      onClick={handleApply}
      disabled={isApplied || post.status === "応募終了"}
      className={`w-full rounded-2xl px-6 py-4 font-bold text-white ${
        post.status === "応募終了"
          ? "bg-red-400"
          : isApplied
          ? "bg-slate-400"
          : "bg-slate-950 hover:bg-slate-800"
      }`}
    >
      {post.status === "応募終了"
        ? "応募終了"
        : isApplied
        ? "応募済み"
        : "この募集に応募する"}
    </button>

    {applyMessage && (
      <p className="mt-3 text-sm font-bold text-slate-600">
        {applyMessage}
      </p>
    )}
  </>
)}
    </div>
  </section>
</main>
    </AuthGuard>
  );
}