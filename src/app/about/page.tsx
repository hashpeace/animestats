"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import EpisodesTab from "@/components/About/EpisodesTab";
import ExtensionTab from "@/components/About/ExtensionTab";
import OnePieceTab from "@/components/About/OnePieceTab";
import WeeklyTab from "@/components/About/WeeklyTab";

function AboutPageContent() {
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState<
		"episodes" | "weekly" | "onepiece" | "extension"
	>("episodes");

	useEffect(() => {
		const tabParam = searchParams.get("tab");
		if (
			tabParam &&
			["episodes", "weekly", "onepiece", "extension"].includes(tabParam)
		) {
			setActiveTab(
				tabParam as "episodes" | "weekly" | "onepiece" | "extension",
			);
		}
	}, [searchParams]);

	return (
		<>
			<div className="text-center mb-8">
				<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
					About Anime Stats
				</h2>
				<p className="text-lg text-gray-600 max-w-2xl mx-auto">
					Track and analyze anime episode ratings from MyAnimeList with detailed
					insights and rankings.
				</p>
			</div>

			{/* Tab Navigation */}
			<div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8 max-w-[400px]">
				<button
					onClick={() => setActiveTab("episodes")}
					className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors
						${activeTab === "episodes"
							? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
							: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
						}`}
				>
					Episodes Ratings
				</button>
				<button
					onClick={() => setActiveTab("weekly")}
					className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors
						${activeTab === "weekly"
							? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
							: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
						}`}
				>
					Weekly Rankings
				</button>
				{/* <button
					onClick={() => setActiveTab("onepiece")}
					className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "onepiece"
						? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
							: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
						}`}
				>
					One Piece
				</button> */}
				{/* <button
					onClick={() => setActiveTab("extension")}
					className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "extension"
						? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
							: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
						}`}
				>
					Browser Extension
				</button> */}
			</div>

			{activeTab === "weekly" && <WeeklyTab />}
			{activeTab === "episodes" && <EpisodesTab />}
			{activeTab === "onepiece" && <OnePieceTab />}
			{activeTab === "extension" && <ExtensionTab />}
		</>
	);
}

export default function AboutPage() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center h-32">Loading...</div>
			}
		>
			<AboutPageContent />
		</Suspense>
	);
}
