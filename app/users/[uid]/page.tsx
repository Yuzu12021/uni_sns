
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AuthGuard from "../../../components/AuthGuard";
import FullProfile from "../../../components/FullProfile";
import WorkCard from "../../../components/WorkCard";

import { useAuthUser } from "../../../hooks/useAuthUser";
import { getUserProfile } from "../../../services/userService";
import { getWorksByOwner } from "../../../services/workService";

import type { UserProfile } from "../../../types/user";
import type { Work } from "../../../types/work";

export default function PublicUserPage() {
  const params = useParams<{ uid: string }>();
  const userId = params.uid;

  const { uid: currentUserId } = useAuthUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function fetchUserData() {
      try {
        setIsLoading(true);
        setError("");

        const [profileData, workData] = await Promise.all([
          getUserProfile(userId),
          getWorksByOwner(userId),
        ]);

        if (!isActive) return;

        setProfile(profileData);
        setWorks(workData);
      } catch (err) {
        console.error(
          "公開プロフィールの取得に失敗しました:",
          err
        );

        if (isActive) {
          setError(
            "プロフィールを取得できませんでした。"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    if (userId) {
      fetchUserData();
    }

    return () => {
      isActive = false;
    };
  }, [userId]);

  const isMyProfile = currentUserId === userId;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-white px-6 pb-28 pt-10 text-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold text-indigo-600">
                Student Profile
              </p>

              <h1 className="text-3xl font-black">
                学生プロフィール
              </h1>
            </div>

            {isMyProfile && (
              <Link
                href="/mypage"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
              >
                マイページへ
              </Link>
            )}
          </div>

          {isLoading ? (
            <p className="py-12 text-center text-slate-500">
              プロフィールを読み込み中...
            </p>
          ) : error ? (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          ) : !profile ? (
            <div className="rounded-2xl border p-8 text-center text-slate-500">
              プロフィールが見つかりませんでした。
            </div>
          ) : (
            <>
              <FullProfile profile={profile} />

              <section className="mt-12">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      制作した作品
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      この学生が投稿した作品一覧です。
                    </p>
                  </div>

                  {isMyProfile && (
                    <Link
                      href="/works/new"
                      className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold transition hover:bg-slate-50"
                    >
                      作品を投稿する
                    </Link>
                  )}
                </div>

                {works.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                    まだ作品が投稿されていません。
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {works.map((work) => (
                      <WorkCard
                        key={work.id}
                        work={work}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
