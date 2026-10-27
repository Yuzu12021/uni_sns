
"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import WorkCard from "../../components/WorkCard";
import { getWorks } from "../../services/workService";
import type { Work } from "../../types/work";

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchWorks = async () => {
      try {
        const workData = await getWorks();

        if (isActive) {
          setWorks(workData);
        }
      } catch (err) {
        console.error("作品一覧の取得に失敗しました:", err);

        if (isActive) {
          setError("作品一覧を取得できませんでした。");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchWorks();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-white px-6 pb-28 pt-12 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold text-indigo-600">
                Portfolio
              </p>

              <h1 className="text-3xl font-black">
                みんなの作品
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                学生が制作した作品や、得意な技術を見つけましょう。
              </p>
            </div>
          </div>

          {isLoading ? (
            <p className="py-12 text-center text-slate-500">
              作品を読み込み中...
            </p>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
            >
              {error}
            </div>
          ) : works.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <p className="text-lg font-bold">
                まだ作品が投稿されていません
              </p>

              <p className="mt-2 text-sm text-slate-500">
                最初の作品を投稿してみましょう。
              </p>
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm font-bold text-slate-500">
                {works.length}件の作品があります
              </p>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {works.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
