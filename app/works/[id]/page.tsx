
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import AuthGuard from "../../../components/AuthGuard";
import { getWorkById } from "../../../services/workService";
import type { Work } from "../../../types/work";

export default function WorkDetailPage() {
  const params = useParams<{ id: string }>();
  const workId = params.id;

  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function fetchWork() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getWorkById(workId);

        if (isActive) {
          setWork(data);
        }
      } catch (err) {
        console.error("作品の取得に失敗しました:", err);

        if (isActive) {
          setError("作品を取得できませんでした。");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchWork();

    return () => {
      isActive = false;
    };
  }, [workId]);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-white px-6 pb-28 pt-10 text-slate-950">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/works"
            className="mb-8 inline-block text-sm font-bold text-indigo-600 hover:underline"
          >
            ← 作品一覧に戻る
          </Link>

          {isLoading ? (
            <p className="py-12 text-center text-slate-500">
              作品を読み込み中...
            </p>
          ) : error ? (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          ) : !work ? (
            <p className="py-12 text-center text-slate-500">
              作品が見つかりませんでした。
            </p>
          ) : (
            <article>
              <p className="mb-2 text-sm font-bold text-indigo-600">
                Portfolio
              </p>

              <h1 className="mb-6 text-3xl font-black">
                {work.title}
              </h1>

              <div className="mb-8 space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div>
                  <h2 className="mb-2 text-sm font-bold text-slate-600">
                    担当した役割
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {work.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {work.tools.length > 0 && (
                  <div>
                    <h2 className="mb-2 text-sm font-bold text-slate-600">
                      使用ツール
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {work.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700"
                        >
                          #{tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-bold">
                  作品紹介
                </h2>

                <div className="space-y-4 break-words rounded-2xl border border-slate-200 p-6 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:h-auto [&_a]:text-indigo-600 [&_a]:underline">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {work.description}
                  </ReactMarkdown>
                </div>
              </section>

              {work.workUrl && (
                <section className="rounded-2xl border border-slate-200 p-6">
                  <h2 className="mb-3 text-lg font-bold">
                    作品リンク
                  </h2>

                  <a
                    href={work.workUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-bold text-indigo-600 underline"
                  >
                    {work.workUrl}
                  </a>
                </section>
              )}
            </article>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
