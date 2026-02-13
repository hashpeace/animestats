"use client";
import {
  ArrowRight,
  Calendar,
  Chrome,
  Flag,
  Hourglass,
  LineChart,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Episode Ratings",
    description:
      "Search any anime and visualize episode ratings with interactive charts. Compare episodes, identify peaks and valleys, and discover rating trends throughout a series.",
    href: "/episodes",
    icon: LineChart,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Weekly Rankings",
    description:
      "Track how anime episodes perform each week during a season. See which shows are trending, compare episode scores, and follow your favorites' weekly progress.",
    href: "/weekly-rankings",
    icon: Calendar,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Coming Soon",
    description: "Currently working on some new features. Stay tuned!",
    href: "/",
    icon: Hourglass,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50",
    iconColor: "text-gray-600",
    disabled: true,
  },
  // {
  //   title: "One Piece",
  //   description: "Dedicated analysis for One Piece with pre-loaded data. Explore ratings by saga and arc, from East Blue to the Final Saga, with instant access to 1000+ episodes.",
  //   href: "/onepiece",
  //   icon: Flag,
  //   color: "from-orange-500 to-red-600",
  //   bgColor: "bg-orange-50",
  //   iconColor: "text-orange-600",
  // },
  // {
  //   title: "Browser Extension",
  //   description: "Enhance your MyAnimeList experience with our Chrome extension. View raw episode scores and access detailed stats directly from any MAL anime or manga page.",
  //   href: "/about?tab=extension",
  //   icon: Chrome,
  //   color: "from-purple-500 to-pink-600",
  //   bgColor: "bg-purple-50",
  //   iconColor: "text-purple-600",
  // },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Anime&nbsp;
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Stats
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Dive deep into anime episode ratings from MyAnimeList. Track trends,
          discover top-rated episodes, and analyze your favorite series like
          never before.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className={`group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300 ${feature.disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    {feature.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-400" />
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              {/* Gradient accent on hover */}
              <div
                className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
