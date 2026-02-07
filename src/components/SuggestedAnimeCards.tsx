"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AnimeInfo } from "@/types/All";

type FilterType = "airing" | "bypopularity";

interface JikanResponse {
	data: AnimeInfo[];
}

export default function SuggestedAnimeCards() {
	const [animeList, setAnimeList] = useState<AnimeInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<FilterType>("airing");

	useEffect(() => {
		const fetchTopAnime = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`https://api.jikan.moe/v4/top/anime?type=tv&filter=${filter}&limit=7`,
				);
				if (!response.ok) {
					throw new Error("Failed to fetch anime data");
				}
				const data: JikanResponse = await response.json();
				setAnimeList(data.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchTopAnime();
	}, [filter]);

	return (
		<div className="space-y-4 mt-24">
			{/* Header with title and toggle */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-xl font-bold text-gray-900 dark:text-white">
					{/* {filter === "airing" ? "Top Airing Anime" : "Most Popular Anime"} */}
					Suggestions
				</h2>
				<div className="flex items-center gap-2">
					<span
						className={`text-sm ${filter === "airing" ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
					>
						Top Airing
					</span>
					<button
						type="button"
						role="switch"
						aria-checked={filter === "bypopularity"}
						onClick={() =>
							setFilter(filter === "airing" ? "bypopularity" : "airing")
						}
						className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${filter === "bypopularity"
							? "bg-blue-600"
							: "bg-gray-200 dark:bg-gray-600"
							}`}
					>
						<span
							className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${filter === "bypopularity" ? "translate-x-5" : "translate-x-0"
								}`}
						/>
					</button>
					<span
						className={`text-sm ${filter === "bypopularity" ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
					>
						Popular
					</span>
				</div>
			</div>

			{/* Loading state skeleton */}
			{loading ? (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
						>
							<div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
								<div className="absolute right-2 top-2 h-6 w-10 rounded bg-gray-300 dark:bg-gray-600" />
							</div>
							<div className="p-3">
								<div className="space-y-2">
									<div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
									<div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : error ? (
				<div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
					Error: {error}
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{animeList
						.filter((anime) => anime.members > 20000)
						.slice(0, 5)
						.map((anime) => (
							<Link
								key={anime.mal_id}
								href={`/episodes?animeId=${anime.mal_id}`}
								className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
							>
								<div className="relative aspect-[3/4] w-full overflow-hidden">
									<Image
										src={anime.images.webp.image_url}
										alt={anime.title || ""}
										fill
										className="object-cover transition-transform group-hover:scale-105"
										sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
									/>
									{anime.score && (
										<div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-sm font-bold text-yellow-400">
											★ {anime.score.toFixed(2)}
										</div>
									)}
								</div>
								<div className="p-3">
									<h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
										{anime.title}
									</h3>
									{/* <span className="text-xs text-gray-500">
										({anime.type}
										{anime.year ? `, ${anime.year}` : ""})
									</span>
									<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
										{anime.episodes ? `${anime.episodes} eps` : "Ongoing"}
									</p> */}
								</div>
							</Link>
						))}
				</div>
			)}
		</div>
	);
}
