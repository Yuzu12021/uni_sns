"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";
import FullProfile from "../../../components/FullProfile";
import { getUserProfile } from "../../../services/userService";
import { UserProfile } from "../../../types/user";

export default function UserPage() {
  const params = useParams();
  const uid = params.uid as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) return;

      const data = await getUserProfile(uid);

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [uid]);

  if (loading) {
    return (
      <AuthGuard>
        <main className="mx-auto max-w-5xl px-6 py-10 text-slate-950">
          <p className="text-sm font-bold text-slate-600">読み込み中...</p>
        </main>
      </AuthGuard>
    );
  }

  if (!profile) {
    return (
      <AuthGuard>
        <main className="mx-auto max-w-5xl px-6 py-10 text-slate-950">
          <section className="rounded-3xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">
              ユーザーが見つかりませんでした
            </h1>
          </section>
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="mx-auto max-w-5xl px-6 py-10 text-slate-950">
        <FullProfile profile={profile} />

        <section className="mt-10 rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            過去作品
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-600">
            作品投稿機能は今後追加予定です。
          </p>
        </section>
      </main>
    </AuthGuard>
  );
}