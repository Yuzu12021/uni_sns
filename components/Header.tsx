"use client";

import Link from "next/link";
import { useState } from "react";
import UserMenu from "./UserMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white text-slate-950">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
    <Link href="/" className="text-xl font-bold text-slate-950">
      uni_sns
    </Link>

    <nav className="hidden items-center gap-6 md:flex">
      <Link href="/" className="text-sm font-bold text-slate-950 hover:underline">
        ホーム
      </Link>
      <Link href="/profile" className="text-sm font-bold text-slate-950 hover:underline">
        プロフィール
      </Link>
      <Link href="/mypage" className="text-sm font-bold text-slate-950 hover:underline">
        マイページ
      </Link>
      <UserMenu />
    </nav>

    <button
      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-950 md:hidden"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      ☰
    </button>
  </div>

      {isOpen && (
  <div className="border-t bg-white px-4 py-4 text-slate-950 md:hidden">
    <nav className="flex flex-col gap-3">
      <Link
        href="/"
        className="rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-950"
        onClick={() => setIsOpen(false)}
      >
        ホーム
      </Link>

      <Link
        href="/profile"
        className="rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-950"
        onClick={() => setIsOpen(false)}
      >
        プロフィール
      </Link>

      <Link
        href="/mypage"
        className="rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-950"
        onClick={() => setIsOpen(false)}
      >
        マイページ
      </Link>

      <div className="rounded-xl bg-slate-50 p-3 text-slate-950">
        <UserMenu />
      </div>
    </nav>
  </div>
)}
    </header>
  );
}