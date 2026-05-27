import Link from "next/link";
import RoleBadge from "./RoleBadge";
import PostAuthor from "./PostAuthor";
type PostCardProps = {
  id: string;
  title: string;
  genre: string;
  roles: string[];
  neededCount: string;
  deadline: string;
  status: string;
  ownerId: string;
  ownerEmail: string;
};

export default function PostCard({
  id,
  title,
  genre,
  roles,
  neededCount,
  deadline,
  status,
  ownerId,
  ownerEmail,
}: PostCardProps) {
  return (
    <Link href={`/posts/${id}`}>
    <article className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3">
        <PostAuthor ownerId={ownerId} ownerEmail={ownerEmail} />
      </div>
      
      <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-900 to-slate-700">
        <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${
                status === "応募終了" 
                ? "bg-red-600" 
                : "bg-blue-600"
                }`}
             >
                {status}
        </span>

        <div className="absolute inset-0 flex items-center justify-center text-5xl text-white/80">
          🎮
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {genre}
          </span>

          {roles.map((role) => (
  <RoleBadge key={role} role={role} />
))}
        </div>

        <h3 className="min-h-14 text-lg font-black leading-snug">
          {title}
        </h3>

        <div className="mt-5 flex items-center justify-between text-sm font-medium text-slate-600">
          <span>👥 {neededCount}</span>
          <span>📅 {deadline}</span>
        </div>
      </div>
    </article>
    </Link>
  );
}