"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";

const ALLOWED_DOMAIN = "@b.shobi-u.ac.jp";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAllowedUser, setIsAllowedUser] = useState(false);
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !currentUser.email) {
        setUser(null);
        setEmail("");
        setUid("");
        setIsAllowedUser(false);
        setLoading(false);
        setPhotoURL("");
        return;
      }

      const allowed = currentUser.email.endsWith(ALLOWED_DOMAIN);

      setUser(currentUser);
      setEmail(currentUser.email);
      setUid(currentUser.uid);
      setIsAllowedUser(allowed);
      setLoading(false);
      setPhotoURL(currentUser.photoURL ?? "");
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    email,
    uid,
    loading,
    isAllowedUser,
    photoURL,
  };
}