"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "../lib/firebase";
import { useAuthUser } from "../hooks/useAuthUser";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, isAllowedUser, user } = useAuthUser();

  useEffect(() => {
    if (loading) return;

    if (!user || !isAllowedUser) {
      signOut(auth);
      router.push("/login");
    }
  }, [loading, user, isAllowedUser, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>ログイン状態を確認中...</p>
      </main>
    );
  }

  if (!user || !isAllowedUser) {
    return null;
  }

  return <>{children}</>;
}