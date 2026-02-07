"use client"
import RatingsFetcher from "@/components/RatingsFetcher"
import { Suspense } from "react"
import Link from "next/link"
import { HelpCircle } from "lucide-react"

export default function OnePiecePage() {

	return (
		<>
			<div className="flex items-center justify-center gap-2 mb-8">
				<h2 className="text-2xl md:text-3xl font-bold text-gray-800">One Piece Ratings and Detailed Stats</h2>
				<Link
					href="/about?tab=onepiece"
					className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
					title="Learn more about One Piece ratings"
				>
					<HelpCircle size={20} />
				</Link>
			</div>
			<Suspense fallback={<div className="flex justify-center items-center h-32">Loading...</div>}>
				<RatingsFetcher isOnePieceOnly />
			</Suspense>
		</>
	)
}
