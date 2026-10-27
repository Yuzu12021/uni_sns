
"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Post } from "../types/post";
import { getPosts } from "../services/postService";
import { isPostClosed } from "../utils/postStatus";

// 表示する募集の種類
type StatusFilter = "all" | "open" | "closed";

type PostListProps = {
  keyword: string;
  selectedRole: string;
  sortType: string;
};

export default function PostList({
  keyword,
  selectedRole,
  sortType,
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  // 初期表示は「募集中」
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("open");

  useEffect(() => {
    const fetchPosts = async () => {
      const postData = await getPosts();
      setPosts(postData);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts
    .filter((post) => {
      // キーワード検索
      const keywordMatch =
        post.title.includes(keyword) ||
        post.genre.includes(keyword);

      // 募集職種の絞り込み
      const roleMatch =
        !selectedRole || post.roles.includes(selectedRole);

      // 募集状態の絞り込み
      const closed = isPostClosed(post);

      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "open" && !closed) ||
        (statusFilter === "closed" && closed);

      return keywordMatch && roleMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortType === "deadline") {
        return a.deadline.localeCompare(b.deadline);
      }

      // それ以外は取得時の順序を維持
      return 0;
    });

  const tabs: {
    value: StatusFilter;
    label: string;
  }[] = [
    { value: "all", label: "すべて" },
    { value: "open", label: "募集中" },
    { value: "closed", label: "募集終了" },
  ];

  return (
    <section id="posts" className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-black">募集一覧</h2>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500">
          {filteredPosts.length}件の募集があります
        </span>
      </div>

      {/* 募集状態の切り替え */}
      <div
        role="group"
        aria-label="募集状態で絞り込む"
        className="mb-8 flex flex-wrap gap-2"
      >
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              aria-pressed={isActive}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 募集カード一覧 */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              genre={post.genre}
              roles={post.roles}
              neededCount={post.neededCount}
              deadline={post.deadline}
              status={post.status}
              ownerId={post.ownerId}
              ownerEmail={post.ownerEmail}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-lg font-bold text-slate-700">
            条件に合う募集はありません
          </p>
          <p className="mt-2 text-sm text-slate-500">
            検索条件や表示する募集の種類を変更してみてください。
          </p>
        </div>
      )}
    </section>
  );
}
