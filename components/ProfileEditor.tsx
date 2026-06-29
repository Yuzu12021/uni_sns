"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "../hooks/useAuthUser";
import { getUserProfile, saveUserProfile } from "../services/userService";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

const roleOptions = [
  "プログラマ",
  "2Dグラフィック",
  "3Dグラフィック",
  "サウンド",
  "企画",
  "その他",
];

const seminarOptions=[
  "未設定",
  "赤崎ゼミ",
  "石井ゼミ",
  "岡本ゼミ",
  "恩田ゼミ",
  "柿崎ゼミ",
  "樫村ゼミ",
  "川口ゼミ",
  "河内ゼミ",
  "坂本ゼミ",
  "定平ゼミ",
  "里見ゼミ",
  "須藤ゼミ",
  "寺井ゼミ",
  "土井ゼミ",
  "野上ゼミ",
  "華山ゼミ",
  "春口ゼミ",
  "藤橋ゼミ",
  "宮澤ゼミ",
  "山寺ゼミ",
];

type ProfileEditorProps = {
  onSaved?: () => void;
};

export default function ProfileEditor({ onSaved }: ProfileEditorProps) {
  const { uid, email, photoURL } = useAuthUser();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [grade, setGrade] = useState("");

  const [roles, setRoles] = useState<string[]>([]);
  const [otherRole, setOtherRole] = useState("");

  const [tools, setTools] = useState("");
  const [bio, setBio] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [portfolioUrls, setPortfolioUrls] = useState(["", "", ""]);

  const[seminar,setSeminar]=useState("");
  const[shortBio,setShortBio]=useState("");

  const [message, setMessage] = useState("");

  const [isIconUploading, setIsIconUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) return;

      const data = await getUserProfile(uid);

      if (data) {
        setName(data.name ?? "");
        setNickname(data.nickname ?? "");
        setGrade(data.grade ?? "");
        setRoles(data.roles ?? []);
        setOtherRole(data.otherRole ?? "");
        setTools(data.tools ?? "");
        setBio(data.bio ?? "");
        setSeminar(data.seminar ?? "");
        setShortBio(data.shortBio ?? "");
        setIconUrl(data.iconUrl ?? photoURL ?? "");
        setPortfolioUrls(data.portfolioUrls ?? ["", "", ""]);
      } else {
        setIconUrl(photoURL ?? "");
      }
    };

    fetchProfile();
  }, [uid, photoURL]);

  const toggleRole = (role: string) => {
    setRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role]
    );
  };

  const saveProfile = async () => {
    if (!uid) {
      setMessage("ログインしてください。");
      return;
    }

    await saveUserProfile({
      uid,
      email,
      name,
      nickname,
      grade,
      roles,
      otherRole,
      tools,
      bio,
      iconUrl,
      portfolioUrls,
      seminar,
      shortBio,
    });

    setMessage("プロフィールを保存しました！");
    onSaved?.();
  };

  return (
    <section className="rounded-3xl border bg-white p-6 text-slate-950 shadow-sm">
      <h2 className="mb-5 text-2xl font-black">プロフィール編集</h2>

      <div className="mb-8 flex flex-col gap-5 rounded-3xl bg-slate-50 p-5 sm:flex-row sm:items-center">
        <img
          src={
  iconUrl ||
  photoURL ||
  "https://placehold.jp/150x150.png"
}
          alt="プロフィールアイコン"
          className="h-24 w-24 rounded-full border bg-white object-cover"
        />

        <div>
  <label className="mb-1 block text-sm font-bold">
    アイコン画像
  </label>

  <input
    type="file"
    accept="image/*"
    className="w-full rounded-2xl border px-4 py-3 text-sm"
    disabled={isIconUploading}
    onChange={async (e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("画像ファイルを選択してください。");
        return;
      }

      try {
        setIsIconUploading(true);

        const imageUrl = await uploadImageToCloudinary(file);
        setIconUrl(imageUrl);
      } catch (error) {
        console.error(error);
        alert("アイコン画像のアップロードに失敗しました。");
      } finally {
        setIsIconUploading(false);
      }
    }}
  />

  {isIconUploading && (
    <p className="mt-2 text-sm font-bold text-slate-600">
      アップロード中...
    </p>
  )}

  {iconUrl && (
    <img
      src={iconUrl}
      alt="アイコンプレビュー"
      className="mt-3 h-20 w-20 rounded-full border object-cover"
    />
  )}
</div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold">名前</label>
          <input
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：津川 柚香"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">ニックネーム</label>
          <input
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="例：ゆず"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">学年</label>
          <select
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="">選択してください</option>
            <option value="1年">1年</option>
            <option value="2年">2年</option>
            <option value="3年">3年</option>
            <option value="4年">4年</option>
          </select>
        </div>

        <div>
  <label className="mb-1 block text-sm font-bold">
    所属ゼミ
  </label>

  <select
    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
    value={seminar}
    onChange={(e) => setSeminar(e.target.value)}
  >
    <option value="">選択してください</option>
    {seminarOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>

<div className="md:col-span-2">
  <label className="mb-1 block text-sm font-bold">
    一言
  </label>

  <input
    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
    value={shortBio}
    onChange={(e) => setShortBio(e.target.value)}
    placeholder="例：3Dモデル制作が得意です！"
  />
</div>

        <div>
          <label className="mb-2 block text-sm font-bold">得意分野</label>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  roles.includes(role)
                    ? "bg-slate-950 text-white"
                    : "border bg-white text-slate-700"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {roles.includes("その他") && (
            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
              value={otherRole}
              onChange={(e) => setOtherRole(e.target.value)}
              placeholder="その他の得意分野を入力"
            />
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-bold">使用ツール</label>
          <input
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
            value={tools}
            onChange={(e) => setTools(e.target.value)}
            placeholder="例：Unity, Blender, Figma"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-bold">ポートフォリオURL</label>
          <div className="space-y-3">
            {portfolioUrls.map((url, index) => (
              <input
                key={index}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
                value={url}
                onChange={(e) => {
                  const updated = [...portfolioUrls];
                  updated[index] = e.target.value;
                  setPortfolioUrls(updated);
                }}
                placeholder={`ポートフォリオURL ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-bold">一言・自己紹介</label>
          <textarea
            className="min-h-36 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-slate-400"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="制作したいジャンル、得意なこと、参加したい活動などを書いてください。"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          className="rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800"
          onClick={saveProfile}
        >
          保存する
        </button>

        {message && (
          <p className="text-sm font-bold text-green-600">{message}</p>
        )}
      </div>
    </section>
  );
}