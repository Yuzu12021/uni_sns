import Link from "next/link";

export default function HeroSection() {
  return (
    <section
  className="relative min-h-[520px] overflow-hidden bg-cover bg-center md:min-h-[430px]"
  style={{ backgroundImage: "url('/images/hero-bg.png')" }}
>
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/20 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[360px] max-w-7xl flex-col justify-center px-6 py-12 md:min-h-[430px]">

        <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
          一緒に、
          <br />
          ゲームをつくろう。
        </h1>

        <p className="mb-8 max-w-xl text-sm font-medium leading-7 text-slate-700 md:text-base">
          企画・プログラマ・グラフィッカー・サウンドなど、
          得意を活かしてチーム制作を始めよう。
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="#posts"
            className="rounded-2xl bg-slate-950 px-7 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            🔍 募集を探す
          </Link>

          <Link
            href="/posts/new"
            className="rounded-2xl bg-white/90 px-7 py-3 font-bold text-slate-950 shadow-lg backdrop-blur transition hover:-translate-y-0.5"
          >
            ✎ 募集を投稿する
          </Link>
        </div>
      </div>
    </section>
  );
}