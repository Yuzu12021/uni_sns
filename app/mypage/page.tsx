"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import PostCard from "../../components/PostCard";
import ProfileCard from "../../components/ProfileCard";
import ProfileEditor from "../../components/ProfileEditor";
import { useAuthUser } from "../../hooks/useAuthUser";
import { getPostsByOwner } from "../../services/postService";
import { getUserProfile } from "../../services/userService";
import { Post } from "../../types/post";
import { UserProfile } from "../../types/user";

export default function MyPage() {
  const { uid, photoURL } = useAuthUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchMyPageData = async () => {
    if (!uid) return;

    const profileData = await getUserProfile(uid);
    const postData = await getPostsByOwner(uid);

    setProfile(profileData);
    setMyPosts(postData);
  };

  useEffect(() => {
    fetchMyPageData();
  }, [uid]);

  return (
    <AuthGuard>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold text-slate-500">My Page</p>
          <h1 className="text-3xl font-black">マイページ</h1>
        </div>

        <section className="mb-10 grid gap-6 lg:grid-cols-[380px_1fr]">
          <div>
            {profile ? (
              <ProfileCard profile={profile} photoURL={photoURL} />
            ) : (
              <div className="rounded-3xl border bg-white p-6 text-slate-500">
                プロフィールが未設定です。
              </div>
            )}

            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="mt-4 w-full rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white"
            >
              {isEditing ? "編集を閉じる" : "プロフィールを編集する"}
            </button>
          </div>

          {isEditing && (
            <ProfileEditor
              onSaved={() => {
                fetchMyPageData();
                setIsEditing(false);
              }}
            />
          )}
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">自分の投稿</h2>
              <p className="mt-1 text-sm text-slate-500">
                あなたが作成した募集投稿です。
              </p>
            </div>

            <Link
              href="/posts/new"
              className="rounded-2xl border px-5 py-3 text-sm font-bold"
            >
              新規投稿
            </Link>
          </div>

          {myPosts.length === 0 ? (
            <div className="rounded-3xl border bg-white p-8 text-center text-slate-500">
              まだ投稿がありません。
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myPosts.map((post) => (
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
          )}
        </section>
      </main>
    </AuthGuard>
  );
}