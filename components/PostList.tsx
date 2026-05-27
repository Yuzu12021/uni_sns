"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Post } from "../types/post";
import { getPosts } from "../services/postService";

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

  useEffect(() => {
    const fetchPosts = async () => {
  const postData = await getPosts();
  setPosts(postData);
};

    fetchPosts();
  }, []);

const filteredPosts = posts
  .filter((post) => {
    const now = new Date();

    const isVisible =
  !post.deleteAt ||
  (
    typeof post.deleteAt === "object" &&
    post.deleteAt !== null &&
    "toDate" in post.deleteAt &&
    (post.deleteAt as any).toDate() > now
  );

    const keywordMatch =
      post.title.includes(keyword) ||
      post.genre.includes(keyword);

    const roleMatch =
      !selectedRole || post.roles.includes(selectedRole);

    return isVisible && keywordMatch && roleMatch;
  })
  
  .sort((a, b) => {
    if (sortType === "deadline") {
      return a.deadline.localeCompare(b.deadline);
    }

    return 0;
  });

  return (
    <section id="posts" className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black">募集一覧</h2>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500">
            {filteredPosts.length}件の募集があります
          </span>
        </div>
      </div>

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
    </section>
  );
}