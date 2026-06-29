"use client";

import ProfileCard from "./ProfileCard";
import { UserProfile } from "../types/user";

type ProfileModalProps = {
  profile: UserProfile;
  photoURL?: string;
  onClose: () => void;
};

export default function ProfileModal({
  profile,
  photoURL,
  onClose,
}: ProfileModalProps) {
  return (
    <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
  onClick={onClose}
>
  <div
    className="w-full max-w-md"
    onClick={(e) => e.stopPropagation()}
  >
    <ProfileCard profile={profile} photoURL={photoURL} />

    <button
      type="button"
      onClick={onClose}
      className="mt-4 w-full rounded-2xl bg-white px-5 py-3 font-bold text-slate-900"
    >
      閉じる
    </button>
  </div>
</div>
  );
}