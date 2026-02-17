"use client";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import RatingsFetcher from "@/components/RatingsFetcher";

export default function OnePiecePage() {
	return (
		<>
			<div className="flex items-center justify-center gap-2 mb-8">
				<h2 className="text-2xl md:text-3xl font-bold text-foreground">
					Episodes Ratings
				</h2>
				<Link
					href="/about?tab=episodes"
					className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
					title="Learn more about episodes ratings"
				>
					<HelpCircle size={20} />
				</Link>
			</div>
			<Suspense
				fallback={
					<div className="flex justify-center items-center h-32">
						Loading...
					</div>
				}
			>
				<RatingsFetcher />
			</Suspense>
		</>
	);
}
