import { AllArcsStacked } from "@/components/OnePieceOnly/AllArcsStacked"
import { SagaAndArcsRatings } from "@/components/OnePieceOnly/SagaAndArcsRatings"
import { onePieceSagasEpisodes } from "@/components/OnePieceOnly/utils"
import { onePieceSagasChapters } from "@/components/OnePieceOnly/utils2"
import { Button } from "@/components/ui/button"
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AnimeInfo, ChartOptions, EntryType, EpisodeInfos } from "@/types/All"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"

export const chartConfig = {
	ratingFiveStars: {
		label: "ratingFiveStars",
		color: "hsl(var(--chart-1))",
	},
	ratingAllStars: {
		label: "ratingAllStars",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig

export default function RatingsDisplayAdditionalGraph({
	results,
	animeId,
	options,
	isOnePieceOnly,
	entryType,
}: { results: EpisodeInfos[]; animeId: AnimeInfo["mal_id"]; options: ChartOptions; isOnePieceOnly?: boolean; entryType: EntryType }) {
	const [showAdditionalGraph, setShowAdditionalGraph] = useState(false)
	const [sortBy, setSortBy] = useState<"score" | "year">("year") // Updated state for sorting

	const averageScoresByYear = results.reduce(
		(acc, episode) => {
			const year = new Date(episode.aired).getFullYear()
			if (acc[year]) {
				acc[year].lastAirDate = episode.aired
				acc[year].episodeRange = `${acc[year].episodeRange.split("-")[0]}-${episode.episodeNb}`
				// const [start, end] = acc[year].episodeRange.split("-").map(Number);
				// acc[year].episodeRange = `${start}-${Math.max(end, episode.episodeNb)}`;
			} else {
				acc[year] = {
					totalScore: 0,
					count: 0,
					firstAirDate: episode.aired,
					lastAirDate: episode.aired,
					episodeRange: `${episode.episodeNb}-${episode.episodeNb}`,
				}
			}
			acc[year].totalScore += episode.score
			acc[year].count += 1
			return acc
		},
		{} as Record<
			number,
			{
				totalScore: number
				count: number
				firstAirDate: string
				lastAirDate: string
				episodeRange: string
			}
		>,
	)

	const onePieceSagas = entryType === "anime" ? onePieceSagasEpisodes(results) : onePieceSagasChapters(results)

	const sortedAverageScores = Object.entries(averageScoresByYear)
		.map(([year, { totalScore, count, firstAirDate, lastAirDate, episodeRange }]) => {
			const currentYear = Number(year)
			const currentSagas = onePieceSagas.filter(saga => {
				const sagaStartYear = saga.minAiredDate ? new Date(saga.minAiredDate).getFullYear() : 0
				const sagaEndYear = saga.maxAiredDate ? new Date(saga.maxAiredDate).getFullYear() : 0
				return currentYear >= sagaStartYear && currentYear <= sagaEndYear
			})

			const currentArcs = currentSagas.flatMap(saga =>
				saga.story_arcs.filter(arc => {
					const arcStartYear = arc.minAiredDate ? new Date(arc.minAiredDate).getFullYear() : 0
					const arcEndYear = arc.maxAiredDate ? new Date(arc.maxAiredDate).getFullYear() : 0
					return currentYear >= arcStartYear && currentYear <= arcEndYear
				}),
			)

			return {
				year: currentYear,
				averageScore: Number((totalScore / count).toFixed(2)),
				count,
				airDate: `${new Date(firstAirDate).toLocaleDateString()} - ${new Date(lastAirDate).toLocaleDateString()}`,
				episodeRange,
				...(isOnePieceOnly && {
					currentSagas: currentSagas.map(saga => ({
						saga: saga.saga,
						arcs: saga.story_arcs.filter(arc => currentArcs.some(currentArc => currentArc.arc === arc.arc)).map(arc => arc.arc),
					})),
				}),
			}
		})
		.sort((a, b) => {
			if (sortBy === "score") {
				return b.averageScore - a.averageScore
			}
			return a.year - b.year // Sort by year if selected
		})

	const handleShowAdditionalGraph = () => {
		setShowAdditionalGraph(prev => !prev) // Toggle graph visibility
	}

	// New function to handle sorting option change
	const handleSortChange = (option: "score" | "year") => {
		setSortBy(option)
	}

	const formatRating = (rating: number | undefined, format: "1decimal" | "2decimal"): string => {
		if (rating === undefined || rating === 0) return "-"
		const outOf10 = rating / 10
		return format === "1decimal" ? outOf10.toFixed(1) : outOf10.toFixed(2)
	}


	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const CustomTooltip = ({ active, payload, label }: { active: boolean | undefined; payload: any; label: string | boolean }) => {
		if (active && payload && payload.length) {
			return (
				<div className="border border-slate-200 p-2 rounded-md bg-white">
					<p className="label">{`Year: ${label}`}</p>
					<p className="label">{`Average ratings: ${formatRating(payload[0].payload.averageScore * 20, options.ratingDisplayFormat)}/10`}</p>
					<p className="label">{`Number of ${entryType === "anime" ? "episodes" : "chapters"}: ${payload[0].payload.count}`}</p>
					<p className="label">{`${entryType === "anime" ? "Episodes" : "Chapters"}: ${payload[0].payload.episodeRange}`}</p>
					<p className="label">{`Aired dates: ${payload[0].payload.airDate}`}</p>
					{isOnePieceOnly && (
						<p className="label">{`Current saga(s): ${payload[0].payload.currentSagas.map((saga: { saga: string }) => saga.saga).join(", ")}`}</p>
					)}
					{isOnePieceOnly && (
						<p className="label">{`Current arc(s): ${payload[0].payload.currentSagas.map((saga: { arcs: string[] }) => saga.arcs).join(", ")}`}</p>
					)}
				</div>
			)
		}

		return null
	}

	return (
		<>
			{!isOnePieceOnly && (
				<Button onClick={handleShowAdditionalGraph} className="mb-4 p-2 bg-blue-500 text-white rounded flex items-center gap-2 mt-6">
					{showAdditionalGraph ? (
						<>
							Hide graph
							<ChevronUp className="size-4" />
						</>
					) : (
						<>
							Show graph of average ratings by year
							<ChevronDown className="size-4" />
						</>
					)}
				</Button>
			)}

			{(showAdditionalGraph || isOnePieceOnly) && (
				<div className="mt-6">
					{isOnePieceOnly && (
						<>
							<SagaAndArcsRatings results={results} entryType={entryType} />
							<AllArcsStacked results={results} entryType={entryType} />
						</>
					)}
					{/* -- Average score by year -- */}
					<h3 className="text-xl font-semibold mt-5 mb-3">Average ratings by year</h3>
					{/* Option panel */}
					<div className="flex flex-col">
						<label htmlFor="sort-select">Sort by</label>
						<Select
							value={sortBy}
							onValueChange={value => {
								handleSortChange(value as "score" | "year")
							}}
						>
							<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
								<SelectValue placeholder="Select a sort option" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="year">Year</SelectItem>
								<SelectItem value="score">Ratings</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{/* Graph */}
					<ChartContainer config={chartConfig}>
						<LineChart accessibilityLayer data={sortedAverageScores} margin={{ top: 20, left: 12, right: 12, bottom: 20 }}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} label={{ value: "Year", position: "bottom", offset: 10 }} />
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								ticks={(() => {
									const minScore = Math.min(...sortedAverageScores.map(item => item.averageScore))
									const maxScore = Math.max(...sortedAverageScores.map(item => item.averageScore))
									const roundedMin = Math.floor(minScore * 20) / 20
									const roundedMax = Math.ceil(maxScore * 20) / 20
									return Array.from(
										{ length: Math.floor((roundedMax - roundedMin) / 0.05) + 1 },
										(_, i) => Math.round((roundedMin + i * 0.05) * 100) / 100,
									)
								})()}
								tickFormatter={value => (value * 2).toFixed(1)}
								label={{ value: "Average Score (/10)", angle: -90, position: "insideLeft", offset: 0 }}
								domain={["dataMin-0.01", "dataMax+0.01"]}
							/>
							<ChartTooltip content={<CustomTooltip active payload label />} />
							{/* <Tooltip /> */}
							<Line
								dataKey="averageScore"
								type="monotone"
								stroke="var(--color-ratingAllStars)"
								strokeWidth={2}
								dot={{ fill: "var(--color-ratingAllStars)" }}
								activeDot={{ r: 6 }}
							>
								<LabelList position="top" offset={12} className="fill-foreground" fontSize={12} formatter={(value: number) => formatRating(value * 20, options.ratingDisplayFormat)} />
							</Line>
						</LineChart>
					</ChartContainer>

					{/* -- Number of episodes by year -- */}
					<h3 className="text-xl font-semibold mt-5 mb-3">Number of {entryType === "anime" ? "episodes" : "chapters"} by year</h3>
					<ChartContainer config={chartConfig}>
						<LineChart accessibilityLayer data={sortedAverageScores} margin={{ top: 20, left: 12, right: 12, bottom: 20 }}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} label={{ value: "Year", position: "bottom", offset: 10 }} />
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								label={{ value: `Number of ${entryType === "anime" ? "episodes" : "chapters"}`, angle: -90, position: "insideLeft", offset: 0 }}
								domain={[20, 50]}
							/>
							<ChartTooltip content={<CustomTooltip active payload label />} />
							{/* <Tooltip /> */}
							<Line
								dataKey="count"
								type="monotone"
								stroke="var(--color-ratingAllStars)"
								strokeWidth={2}
								dot={{ fill: "var(--color-ratingAllStars)" }}
								activeDot={{ r: 6 }}
							>
								<LabelList position="top" offset={12} className="fill-foreground" fontSize={12} formatter={(value: number) => value.toString()} />
							</Line>
						</LineChart>
					</ChartContainer>
				</div>
			)}
		</>
	)
}
