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
      className="absolute left-0 top-10 z-50 w-80 max-w-[90vw]"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ProfileCard profile={profile} photoURL={photoURL} />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="mt-3 w-full rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 shadow"
      >
        閉じる
      </button>
    </div>
  );
}