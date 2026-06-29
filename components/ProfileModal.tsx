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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className="w-full max-w-md"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ProfileCard profile={profile} photoURL={photoURL} />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="mt-4 w-full rounded-2xl bg-white px-5 py-3 font-bold text-slate-900"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}