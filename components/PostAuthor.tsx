"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";
import { UserProfile } from "../types/user";

type PostAuthorProps = {
  ownerId: string;
  ownerEmail: string;
  onOpenProfile?: (profile: UserProfile) => void;
};

export default function PostAuthor({
  ownerId,
  ownerEmail,
  onOpenProfile,
}: PostAuthorProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!ownerId) return;

      const data = await getUserProfile(ownerId);
      setProfile(data);
    };

    fetchProfile();
  }, [ownerId]);

  const displayName =
    profile?.nickname || profile?.name || ownerEmail || "投稿者";

  const iconUrl =
    profile?.iconUrl || "https://placehold.jp/150x150.png";

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (profile && onOpenProfile) {
          onOpenProfile(profile);
        }
      }}
      className="flex items-center gap-2 text-left"
    >
      <img
        src={iconUrl}
        alt="投稿者アイコン"
        className="h-8 w-8 rounded-full border object-cover"
      />

      <span className="truncate text-xs font-bold text-slate-500">
        {displayName}
      </span>
    </button>
  );
}