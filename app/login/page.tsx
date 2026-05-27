"use client";

import LoginButton from "../../components/LoginButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <p className="mb-3 text-sm font-semibold text-gray-500">
          学内限定ゲーム制作マッチング
        </p>

        <h1 className="mb-4 text-3xl font-bold">uni_sns</h1>

        <p className="mb-6 text-gray-600">
          学内Googleアカウントでログインしてください。
        </p>

        <LoginButton />
      </section>
    </main>
  );
}