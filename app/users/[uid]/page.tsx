"use client";

import { useParams } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";

export default function UserPage() {
  const params = useParams();
  const uid = params.uid as string;

  return (
    <AuthGuard>
      <main className="mx-auto max-w-4xl px-6 py-10 text-slate-950">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-600">User Page</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            ユーザーページ
          </h1>

          <p className="mt-4 text-sm font-medium text-slate-700">
            uid：{uid}
          </p>
        </section>
      </main>
    </AuthGuard>
  );
}