"use client"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { AllRatings } from "@/types/All"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartConfig = {
	star1: { label: "1 star", color: "var(--chart-star1)" },
	star2: { label: "2 stars", color: "var(--chart-star2)" },
	star3: { label: "3 stars", color: "var(--chart-star3)" },
	star4: { label: "4 stars", color: "var(--chart-star4)" },
	star5: { label: "5 stars", color: "var(--chart-star5)" },
} satisfies ChartConfig

export function AllStarsRatingStacked({ ratings }: { ratings: AllRatings[] }) {
	const chartData = [
		{
			rating: "rating",
			...Object.fromEntries(ratings.map(r => [`star${r.star}`, r.rating])),
		},
	]
	return (
		<ResponsiveContainer width="100%" height={30}>
			<ChartContainer config={chartConfig} className="[&_.recharts-tooltip-wrapper]:z-10">
				<BarChart accessibilityLayer data={chartData} layout="vertical" barSize={20}>
					<CartesianGrid horizontal={false} />
					<YAxis dataKey="rating" type="category" tickLine={false} axisLine={false} hide />
					<XAxis type="number" hide domain={[0, 100]} />
					<ChartTooltip content={
						<ChartTooltipContent
							hideLabel
							indicator={Object.keys(chartConfig).length > 1 ? "dot" : "line"}
							valueFormatter={(value) => `${value}%`}
						/>
					} />
					<Bar dataKey="star5" stackId="a" fill="var(--color-star5)" radius={[4, 0, 0, 4]} />
					<Bar dataKey="star4" stackId="a" fill="var(--color-star4)" radius={[0, 0, 0, 0]} />
					<Bar dataKey="star3" stackId="a" fill="var(--color-star3)" radius={[0, 0, 0, 0]} />
					<Bar dataKey="star2" stackId="a" fill="var(--color-star2)" radius={[0, 0, 0, 0]} />
					<Bar dataKey="star1" stackId="a" fill="var(--color-star1)" radius={[0, 4, 4, 0]} />
				</BarChart>
			</ChartContainer>
		</ResponsiveContainer>
	)
}
