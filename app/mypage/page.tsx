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
import { getApplicationsByOwnerId } from "../../services/applicationService";
import { getChatRoomsByMemberId } from "../../services/chatService";
import { ChatRoom } from "../../types/chat";

export default function MyPage() {
  const { uid, photoURL } = useAuthUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const fetchMyPageData = async () => {
    if (!uid) return;

    const profileData = await getUserProfile(uid);
const postData = await getPostsByOwner(uid);
const applications = await getApplicationsByOwnerId(uid);
const chatData = await getChatRoomsByMemberId(uid);

const counts: Record<string, number> = {};


applications.forEach((application: any) => {
  counts[application.postId] = (counts[application.postId] || 0) + 1;
});

setProfile(profileData);
setMyPosts(postData);
setApplicationCounts(counts);
setChatRooms(chatData);
  };

  useEffect(() => {
    fetchMyPageData();
  }, [uid]);

  return (
    <AuthGuard>
      <main className="mx-auto max-w-6xl px-6 py-10 text-slate-950">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold text-slate-500">My Page</p>
          <h1 className="text-3xl font-bold text-slate-950">マイページ</h1>
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

          <section className="mb-10">
  <div className="mb-5">
    <h2 className="text-2xl font-bold text-slate-950">
      参加中プロジェクト
    </h2>
    <p className="mt-1 text-sm text-slate-700">
      承認された企画のチャット一覧です。
    </p>
  </div>

  {chatRooms.length === 0 ? (
    <div className="rounded-3xl border bg-white p-6 text-sm font-bold text-slate-600">
      参加中のプロジェクトはまだありません。
    </div>
  ) : (
    <div className="space-y-3">
      {chatRooms.map((chat) => (
        <Link
          key={chat.id}
          href={`/chats/${chat.id}`}
          className="block rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500">
                Project Chat
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">
                {chat.postTitle}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-600">
                参加メンバー：{chat.memberIds.length}人
              </p>
            </div>

            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
              開く
            </span>
          </div>
        </Link>
      ))}
    </div>
  )}
</section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">自分の投稿</h2>
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
                  applicationCount={applicationCounts[post.id]||0}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}