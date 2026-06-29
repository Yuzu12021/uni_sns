import { UserProfile } from "../types/user";
import RoleBadge from "./RoleBadge";

type FullProfileProps = {
  profile: UserProfile;
  photoURL?: string;
};

export default function FullProfile({ profile, photoURL }: FullProfileProps) {
  const displayName = profile.nickname || profile.name || "未設定ユーザー";

  const icon =
    profile.iconUrl || photoURL || "https://placehold.jp/150x150.png";

  return (
    <section className="rounded-3xl border bg-white p-6 text-slate-950 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          src={icon}
          alt="プロフィールアイコン"
          className="h-28 w-28 rounded-full border bg-white object-cover"
        />

        <div>
          <p className="mb-2 text-sm font-bold text-slate-600">
            User Profile
          </p>

          <h1 className="text-3xl font-bold text-slate-950">
            {displayName}
          </h1>

          <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-slate-700">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {profile.grade || "学年未設定"}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1">
              {profile.seminar || "所属ゼミ未設定"}
            </span>
          </div>
        </div>
      </div>

      {profile.shortBio && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-500">一言</p>
          <p className="mt-2 whitespace-pre-wrap text-slate-800">
            {profile.shortBio}
          </p>
        </div>
      )}

      {profile.bio && (
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            自己紹介
          </h2>
          <p className="whitespace-pre-wrap leading-8 text-slate-700">
            {profile.bio}
          </p>
        </div>
      )}

      {profile.roles?.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            得意分野
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.roles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
          </div>
        </div>
      )}

      {profile.tools && (
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            使用ツール
          </h2>
          <p className="rounded-2xl bg-slate-50 p-4 text-slate-700">
            {profile.tools}
          </p>
        </div>
      )}

      {profile.portfolioUrls?.filter(Boolean).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-bold text-slate-950">
            ポートフォリオ
          </h2>

          <div className="space-y-2">
            {profile.portfolioUrls
              .filter(Boolean)
              .map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 underline"
                >
                  {url}
                </a>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}