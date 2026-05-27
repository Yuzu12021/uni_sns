"use client";

type SearchFilterSectionProps = {
  keyword: string;
  setKeyword: (value: string) => void;

  selectedRole: string;
  setSelectedRole: (value: string) => void;

  sortType: string;
  setSortType: (value: string) => void;
};

const roleCategories = [
  { label: "プログラマ", icon: "⌘", color: "bg-blue-50 text-blue-600" },
  { label: "グラフィッカー", icon: "✎", color: "bg-pink-50 text-pink-600" },
  { label: "サウンド", icon: "♪", color: "bg-purple-50 text-purple-600" },
  { label: "企画", icon: "♢", color: "bg-orange-50 text-orange-600" },
  { label: "シナリオ", icon: "▣", color: "bg-green-50 text-green-600" },
  { label: "その他", icon: "…", color: "bg-gray-100 text-gray-600" },
];

export default function SearchFilterSection({
  keyword,
  setKeyword,
  selectedRole,
  setSelectedRole,
  sortType,
  setSortType,
}: SearchFilterSectionProps) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-xl md:p-5">
      <div className="grid gap-3 md:grid-cols-[1.5fr_0.8fr_0.7fr]">
        <input
  className="rounded-2xl border px-5 py-4 text-sm outline-none focus:border-slate-400"
  placeholder="キーワードで検索（タイトル・内容・ツールなど）"
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
/>

        <select className="rounded-2xl border px-5 py-4 text-sm font-bold">
          <option>ジャンル すべて</option>
          <option>ホラー</option>
          <option>アクション</option>
          <option>RPG</option>
          <option>パズル</option>
          <option>SF</option>
        </select>

        <select
  className="rounded-2xl border px-5 py-4 text-sm font-bold"
  value={sortType}
  onChange={(e) => setSortType(e.target.value)}
>
  <option value="new">新着順</option>
  <option value="deadline">締切が近い順</option>
</select>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        
        <button
  onClick={() => setSelectedRole("")}
  className={`rounded-2xl px-4 py-5 text-center font-bold shadow-sm transition hover:-translate-y-0.5 ${
    selectedRole === ""
      ? "bg-slate-950 text-white"
      : "bg-slate-100 text-slate-600"
  }`}
>
  <div className="mb-2 text-2xl">✦</div>
  <div className="text-sm">すべて</div>
</button>
        {roleCategories.map((role) => (
          <button
            key={role.label}
            onClick={() =>
                setSelectedRole(
                    selectedRole === role.label ? "" : role.label
                )
            }
            className={`rounded-2xl px-4 py-5 text-center font-bold shadow-sm transition hover:-translate-y-0.5 ${
                selectedRole === role.label
                ? "bg-slate-950 text-white"
                : role.color
                }`}
                >

            <div className="mb-2 text-2xl">{role.icon}</div>
            <div className="text-sm">{role.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}