import Link from "next/link";
import { UserProfile } from "../types/user";

type ProfileCardProps = {
  profile: UserProfile;
  photoURL?: string;
};

export default function ProfileCard({ profile, photoURL }: ProfileCardProps) {
  const displayName = profile.nickname || profile.name || "未設定ユーザー";

  const icon =
    profile.iconUrl ||
    photoURL ||
    "https://placehold.jp/150x150.png";

  return (
    <div className="w-full max-w-md rounded-3xl border bg-white p-6 text-slate-950 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={icon}
          alt="プロフィールアイコン"
          className="h-20 w-20 rounded-full border bg-white object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            {displayName}
          </h2>

          <p className="mt-1 text-sm font-bold text-slate-700">
            {profile.grade || "学年未設定"}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-700">
            {profile.seminar || "所属ゼミ未設定"}
          </p>
        </div>
      </div>

      {profile.shortBio && (
        <p className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-700">
          {profile.shortBio}
        </p>
      )}

      <Link
        href={`/users/${profile.uid}`}
        className="mt-5 block rounded-2xl bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white hover:bg-slate-800"
      >
        ユーザーページへ
      </Link>
    </div>
  );
}