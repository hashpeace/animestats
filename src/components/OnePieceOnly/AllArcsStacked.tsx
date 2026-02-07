"use client"
import { onePieceSagasEpisodes } from "@/components/OnePieceOnly/utils"
import { onePieceSagasChapters } from "@/components/OnePieceOnly/utils2"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { EntryType, EpisodeInfos } from "@/types/All"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartConfig = {
	saga1: { label: "East Blue Saga", color: "var(--chart-star1)" },
	saga2: { label: "Alabasta Saga", color: "var(--chart-star2)" },
	saga3: { label: "Sky Island Saga", color: "var(--chart-star3)" },
	saga4: { label: "Water 7 Saga", color: "var(--chart-star4)" },
	saga5: { label: "Thriller Bark Saga", color: "var(--chart-star5)" },
	saga6: { label: "Summit War Saga", color: "var(--chart-star1)" },
	saga7: { label: "Fish-Man Island Saga", color: "var(--chart-star2)" },
	saga8: { label: "Dressrosa Saga", color: "var(--chart-star3)" },
	saga9: { label: "Whole Cake Island Saga", color: "var(--chart-star4)" },
	saga10: { label: "Wano Country Saga", color: "var(--chart-star5)" },
	saga11: { label: "Final Saga", color: "var(--chart-star1)" },
} satisfies ChartConfig

export function AllArcsStacked({ results, entryType }: { results: EpisodeInfos[]; entryType: EntryType }) {
	const totalEpisodes = results.length
	const onePieceSagas = entryType === "anime" ? onePieceSagasEpisodes(results) : onePieceSagasChapters(results)

	const sagaData = onePieceSagas.map(saga => ({
		saga: saga.saga,
		totalEpisodes: saga.story_arcs.reduce((total, arc) => {
			const episodeRanges = arc.episodesOrChapters.split(",").map(range => range.trim())
			return (
				total +
				episodeRanges.reduce((rangeTotal, range) => {
					if (range.includes("—")) {
						const [start, end] = range.split("—").map(ep => Number.parseInt(ep))
						return rangeTotal + (end - start + 1)
					}
					return entryType === "anime" ? rangeTotal + 1 : rangeTotal + (Number.parseInt(range) - Number.parseInt(range) + 1)
				}, 0)
			)
		}, 0),
	}))

	const chartData = [
		{
			rating: "rating",
			...Object.fromEntries(sagaData.map((saga, index) => [`saga${index + 1}`, saga.totalEpisodes])),
		},
	]

	return (
		<ResponsiveContainer width="100%" height={50}>
			<ChartContainer config={chartConfig}>
				<BarChart accessibilityLayer data={chartData} layout="vertical" barSize={50}>
					<CartesianGrid horizontal={false} />
					<YAxis dataKey="rating" type="category" tickLine={false} axisLine={false} tickFormatter={value => `-`} />
					<XAxis
						type="number"
						domain={[0, totalEpisodes]}
						ticks={Array.from({ length: Math.ceil(totalEpisodes / 50) + 1 }, (_, i) => Math.min(i * 50, totalEpisodes))}
						tickFormatter={value => `${value}`}
					/>
					<ChartTooltip content={<ChartTooltipContent />} />
					{sagaData.map((saga, index) => (
						<Bar
							key={index}
							dataKey={`saga${index + 1}`}
							stackId="a"
							fill={`var(--color-saga${index + 1})`}
							radius={index === 0 ? [4, 0, 0, 4] : index === sagaData.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
						/>
					))}
				</BarChart>
			</ChartContainer>
		</ResponsiveContainer>
	)
}
