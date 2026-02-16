"use client";
import { ArrowRight, Calendar, LineChart } from "lucide-react";
import Link from "next/link";
import { HeroCanvas } from "@/components/misc/HeroCanvas";
import { ImgCarousel } from "@/components/misc/ImgCarousel";
import { ScoreMarquee } from "@/components/misc/ScoreMarquee";

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0">
          <HeroCanvas />
        </div>

        <div className="relative mx-auto pt-14 md:pt-24 pointer-events-none">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            {/* <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-blue-600 bg-blue-100/60 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6 border border-blue-200/40">
              <Play className="w-3 h-3 fill-blue-600" />
              Explore anime data like never before
            </div> */}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.08]">
              Anime{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 bg-clip-text text-transparent">
                  Stats
                </span>
              </span>
            </h1>

            <p className="mt-6 text-gray-500 text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
              Dive deep into anime episode ratings from{" "}
              <span className="text-gray-800 font-semibold">MyAnimeList</span>.
              Track trends, discover top-rated episodes, and analyze your
              favorite series like never before.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 pointer-events-auto">
              <Link
                href="/episodes"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                Browse Episode Ratings
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/weekly-rankings"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                Weekly Rankings
              </Link>
            </div>
            {/* <ScoreMarquee /> */}
          </div>
        </div>
      </div>

      {/* ── Feature 1: Episode Ratings ── */}
      <div className="relative py-16">
        <div className="absolute inset-0 pointer-events-none" />

        <div className="relative grid md:grid-cols-5 gap-10 md:gap-14 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
              <LineChart className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase">Episode Ratings</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
              Every episode,{" "}
              <span className="text-blue-600">scored &amp; visualized</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Search any anime series and get a complete breakdown of per-episode
              ratings. See rating trends across seasons, spot the
              community&apos;s favorites, and find hidden gems.
            </p>
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:gap-3 transition-all"
            >
              Try it now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="md:col-span-3">
            {/* <TiltScreenshot
              src="/screenshots/episodes_death_note.png"
              alt="Episode Ratings visualization"
            /> */}
            <ImgCarousel
              key="episodes"
              screenshots={[
                { src: "/screenshots/episodes_death_note.png" },
                { src: "/screenshots/episodes_fma.png" },
              ]}
              className="aspect-[16/11]"
              accentColor="#2563eb"
            />
          </div>
        </div>
      </div>

      {/* ── Feature 2: Weekly Rankings ── */}
      <div className="relative py-16 md:py-24">
        <div className="grid md:grid-cols-5 gap-10 md:gap-14 items-center">
          <div className="md:col-span-3 order-2 md:order-1">
            {/* <TiltScreenshot
              src="/screenshots/episodes_fma.png"
              alt="Weekly Rankings view"
            /> */}
            <ImgCarousel
              key="weekly-rankings"
              screenshots={[
                { src: "/screenshots/weekly_cards.png" },
                { src: "/screenshots/weekly_graph.png" },
              ]}
              accentColor="#059669"
              className="aspect-[16/9]"
            />
          </div>

          <div className="md:col-span-2 order-1 md:order-2">
            <div className="inline-flex items-center gap-2 text-emerald-600 mb-4">
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-bold tracking-widest uppercase">Weekly Rankings</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
              Stay on the{" "}
              <span className="text-emerald-600">season&apos;s pulse</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Follow how each episode performs the week it airs. Track your
              watchlist against the community and discover what&apos;s trending
              this season.
            </p>
            <Link
              href="/weekly-rankings"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all"
            >
              View rankings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── More coming soon ── */}
      <div className="relative py-16 md:py-20 border-t border-gray-100">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 tracking-tight mb-3">
            More features coming soon!
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Stay tuned.
          </p>
        </div>
      </div>
    </div>
  );
}
