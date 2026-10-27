
"use client";

import AuthGuard from "../components/AuthGuard";
import PostList from "../components/PostList";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeContent() {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") ?? "";
  const selectedRole = searchParams.get("role") ?? "";
  const sortType = searchParams.get("sort") ?? "new";

  return (
    <AuthGuard>
      <main className="min-h-screen bg-white text-slate-950">
        <div className="mx-auto max-w-7xl px-6 pb-28 pt-12">
          <h1 className="mb-6 text-2xl font-bold">
            メンバー募集
          </h1>

          <PostList
            keyword={keyword}
            selectedRole={selectedRole}
            sortType={sortType}
          />
        </div>
      </main>
    </AuthGuard>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  );
}
