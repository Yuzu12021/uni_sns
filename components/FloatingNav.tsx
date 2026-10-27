
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchFilterSection from "./SearchFilterSection";

export default function FloatingNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sortType, setSortType] = useState("new");

  // 検索画面を開いたとき、現在のURLの検索条件を読み込む
  function openSearch() {
    setKeyword(searchParams.get("keyword") ?? "");
    setSelectedRole(searchParams.get("role") ?? "");
    setSortType(searchParams.get("sort") ?? "new");
    setIsSearchOpen(true);
  }

  // 検索画面が開いている間は背景をスクロールさせない
  useEffect(() => {
    if (!isSearchOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSearchOpen]);

  // Escキーで検索画面を閉じる
  useEffect(() => {
    if (!isSearchOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // 検索条件をURLに反映してトップページへ移動する
  function applySearch() {
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (selectedRole) params.set("role", selectedRole);
    if (sortType !== "new") params.set("sort", sortType);

    setIsSearchOpen(false);

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  // ページ移動時は検索画面を閉じる
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 全ページ共通の右下固定ナビ */}
      <nav
        aria-label="主要ナビゲーション"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-3"
      >
        <Link
          href="/"
          aria-label="ホーム"
          title="ホーム"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:scale-105 hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="m3 10 9-7 9 7" />
            <path d="M5 9v12h14V9" />
            <path d="M9 21v-7h6v7" />
          </svg>
        </Link>

        <button
          type="button"
          onClick={openSearch}
          aria-label="検索を開く"
          title="検索"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:scale-105 hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </button>

        <Link
          href="/posts/new"
          aria-label="新しい募集を投稿する"
          title="投稿する"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:scale-105 hover:bg-indigo-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
          </svg>
        </Link>
      </nav>

      {/* 全画面検索 */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-title"
          className="fixed inset-0 z-[100] overflow-y-auto bg-white text-slate-950"
        >
          <div className="mx-auto min-h-screen max-w-5xl px-5 pb-12 pt-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 id="search-title" className="text-2xl font-bold">
                募集を検索
              </h2>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="検索画面を閉じる"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <SearchFilterSection
              keyword={keyword}
              setKeyword={setKeyword}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              sortType={sortType}
              setSortType={setSortType}
            />

            <button
              type="button"
              onClick={applySearch}
              className="mt-8 w-full rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white hover:bg-indigo-700"
            >
              この条件で募集を見る
            </button>
          </div>
        </div>
      )}
    </>
  );
}
