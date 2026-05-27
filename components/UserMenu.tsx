"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { useAuthUser } from "../hooks/useAuthUser";

export default function UserMenu() {
  const router = useRouter();
  const { email } = useAuthUser();

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!email) return null;

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-gray-500">{email}</p>

      <button
        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
        onClick={logout}
      >
        ログアウト
      </button>
    </div>
  );
}