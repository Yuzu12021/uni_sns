"use client";

import Link from "next/link";
import { useState } from "react";
import UserMenu from "./UserMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-black">
          uni_sns
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-bold hover:underline">
            ホーム
          </Link>
          <Link href="/profile" className="text-sm font-bold hover:underline">
            プロフィール
          </Link>
          <Link href="/mypage" className="text-sm font-bold hover:underline">
          マイページ
          </Link>
          <UserMenu />
        </nav>

        <button
          className="rounded-xl border px-3 py-2 text-sm font-bold md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className="rounded-xl bg-slate-100 px-4 py-3 font-bold"
              onClick={() => setIsOpen(false)}
            >
              ホーム
            </Link>

            <Link
              href="/profile"
              className="rounded-xl bg-slate-100 px-4 py-3 font-bold"
              onClick={() => setIsOpen(false)}
            >
              プロフィール
            </Link>
            <Link
            href="/mypage"
            className="rounded-xl bg-slate-100 px-4 py-3 font-bold"
            onClick={() => setIsOpen(false)}
            >
                マイページ
            </Link>
            <div className="rounded-xl bg-slate-50 p-3">
              <UserMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}