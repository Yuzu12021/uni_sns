"use client";

import { useParams } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  return (
    <AuthGuard>
      <main className="mx-auto max-w-4xl px-6 py-10 text-slate-950">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-bold text-slate-600">
            Project Chat
          </p>

          <h1 className="text-3xl font-bold text-slate-950">
            チャット画面
          </h1>

          <p className="mt-4 text-sm font-medium text-slate-700">
            chatId：{chatId}
          </p>
        </section>
      </main>
    </AuthGuard>
  );
}