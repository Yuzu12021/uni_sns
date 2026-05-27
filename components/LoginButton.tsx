"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";

const ALLOWED_DOMAIN = "@b.shobi-u.ac.jp";

export default function LoginButton() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        setUserEmail(null);
        setLoading(false);
        return;
      }

      if (!user.email.endsWith(ALLOWED_DOMAIN)) {
        await signOut(auth);
        setUserEmail(null);
        setErrorMessage("このサービスは学内Googleアカウント限定です。");
        setLoading(false);
        return;
      }

      setUserEmail(user.email);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setErrorMessage("");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;

      if (!email) {
        setErrorMessage("メールアドレスを取得できませんでした。");
        await signOut(auth);
        return;
      }

      if (!email.endsWith(ALLOWED_DOMAIN)) {
        setErrorMessage("このサービスは学内Googleアカウント限定です。");
        await signOut(auth);
        setUserEmail(null);
        return;
      }

      setUserEmail(email);
      router.push("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("ログインに失敗しました。");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserEmail(null);
    setErrorMessage("");
    router.push("/login");
  };

  if (loading) {
    return <p className="text-sm text-gray-500">ログイン状態を確認中...</p>;
  }

  return (
    <div className="flex items-center gap-3">
      {userEmail ? (
        <>
          <p className="text-sm text-gray-600">{userEmail}</p>
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={logout}
          >
            ログアウト
          </button>
        </>
      ) : (
        <button
          className="rounded-lg bg-black px-5 py-3 text-white"
          onClick={login}
        >
          Googleでログイン
        </button>
      )}

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}