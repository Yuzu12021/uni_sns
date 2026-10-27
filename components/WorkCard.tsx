
import Link from "next/link";
import type { Work } from "../types/work";

type WorkCardProps = {
  work: Work;
};

export default function WorkCard({ work }: WorkCardProps) {
  return (
    <Link
      href={`/works/${work.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <span className="text-4xl">🎮</span>
      </div>

      <h2 className="mb-3 line-clamp-2 text-lg font-bold">
        {work.title}
      </h2>

      <p className="mb-2 text-xs font-bold text-slate-500">
        担当した役割
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {work.roles.map((role) => (
          <span
            key={role}
            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
          >
            {role}
          </span>
        ))}
      </div>

      {work.tools.length > 0 && (
        <>
          <p className="mb-2 text-xs font-bold text-slate-500">
            使用ツール
          </p>

          <div className="flex flex-wrap gap-2">
            {work.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
              >
                #{tool}
              </span>
            ))}
          </div>
        </>
      )}
    </Link>
  );
}
