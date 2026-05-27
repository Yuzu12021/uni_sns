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
    <div className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={icon}
          alt="プロフィールアイコン"
          className="h-20 w-20 rounded-full border bg-white object-cover"
        />

        <div>
          <h2 className="text-2xl font-black">{displayName}</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">
            {profile.grade || "学年未設定"}
          </p>
        </div>
      </div>

      {profile.bio && (
        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {profile.bio}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {profile.roles?.map((role) => (
          <span
            key={role}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
          >
            {role}
          </span>
        ))}

        {profile.otherRole && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {profile.otherRole}
          </span>
        )}
      </div>

      {profile.tools && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="mb-1 text-xs font-bold text-slate-400">使用ツール</p>
          <p className="text-sm font-bold text-slate-700">{profile.tools}</p>
        </div>
      )}

      {profile.portfolioUrls?.some((url) => url) && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold text-slate-400">
            ポートフォリオ
          </p>

          <div className="space-y-2">
            {profile.portfolioUrls
              .filter((url) => url)
              .map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate rounded-2xl border px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50"
                >
                  {url}
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}