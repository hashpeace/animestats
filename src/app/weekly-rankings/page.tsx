"use client"
import WeeklyRatings from "@/components/WeeklyRatings"
import Link from "next/link"
import { HelpCircle } from "lucide-react"

export default function WeeklyRatingsPage() {
	return (
		<>
			<div className="flex items-center justify-center gap-2 mb-8">
				<h2 className="text-2xl md:text-3xl font-bold text-gray-800">Weekly Rankings</h2>
				<Link
					href="/about?tab=weekly"
					className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
					title="Learn more about weekly rankings"
				>
					<HelpCircle size={20} />
				</Link>
			</div>
			<WeeklyRatings />
		</>
	)
}
