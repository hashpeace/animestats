"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import WeeklyTab from "@/components/About/WeeklyTab"
import EpisodesTab from "@/components/About/EpisodesTab"
import OnePieceTab from "@/components/About/OnePieceTab"
import ExtensionTab from "@/components/About/ExtensionTab"

function AboutPageContent() {
	const searchParams = useSearchParams()
	const [activeTab, setActiveTab] = useState<"episodes" | "weekly" | "onepiece" | "extension">("episodes")

	useEffect(() => {
		const tabParam = searchParams.get("tab")
		if (tabParam && ["episodes", "weekly", "onepiece", "extension"].includes(tabParam)) {
			setActiveTab(tabParam as "episodes" | "weekly" | "onepiece" | "extension")
		}
	}, [searchParams])

	return (
		<>
			<div className="text-center mb-8">
				<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">About Anime Stats</h2>
				<p className="text-lg text-gray-600 max-w-2xl mx-auto">
					Track and analyze anime episode ratings from MyAnimeList with detailed insights and rankings.
				</p>
			</div>

			{/* Tab Navigation */}
			<div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
				<button
					onClick={() => setActiveTab("episodes")}
					className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "episodes"
						? "bg-white text-blue-600 shadow-sm"
						: "text-gray-600 hover:text-gray-900"
						}`}
				>
					Episodes Ratings
				</button>
				<button
					onClick={() => setActiveTab("weekly")}
					className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "weekly"
						? "bg-white text-blue-600 shadow-sm"
						: "text-gray-600 hover:text-gray-900"
						}`}
				>
					Weekly Rankings
				</button>
				{/* <button
					onClick={() => setActiveTab("onepiece")}
					className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "onepiece"
						? "bg-white text-blue-600 shadow-sm"
						: "text-gray-600 hover:text-gray-900"
						}`}
				>
					One Piece
				</button> */}
				{/* <button
					onClick={() => setActiveTab("extension")}
					className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "extension"
						? "bg-white text-blue-600 shadow-sm"
						: "text-gray-600 hover:text-gray-900"
						}`}
				>
					Browser Extension
				</button> */}
			</div>

			{/* Weekly Ratings Tab */}
			{activeTab === "weekly" && <WeeklyTab />}

			{/* episodes Anime Analysis Tab */}
			{activeTab === "episodes" && <EpisodesTab />}

			{/* One Piece Focus Tab */}
			{activeTab === "onepiece" && <OnePieceTab />}

			{/* Browser Extension Tab */}
			{activeTab === "extension" && <ExtensionTab />}
		</>
	)
}

export default function AboutPage() {
	return (
		<Suspense fallback={<div className="flex justify-center items-center h-32">Loading...</div>}>
			<AboutPageContent />
		</Suspense>
	)
} 