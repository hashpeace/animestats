import { useState } from "react";
import {
	CartesianGrid,
	LabelList,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import { onePieceSagasEpisodes } from "@/components/OnePieceOnly/utils";
import { onePieceSagasChapters } from "@/components/OnePieceOnly/utils2";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { EntryType, EpisodeInfos } from "@/types/All";

const chartConfig = {
	averageScore: {
		label: "Average Score",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

export function SagaAndArcsRatings({
	results,
	entryType,
}: {
	results: EpisodeInfos[];
	entryType: EntryType;
}) {
	const [mode, setMode] = useState<"saga" | "arc">("arc");
	const [filterFiller, setFilterFiller] = useState<boolean>(true);
	const [hideFillerAndRecapFromAverage, setHideFillerAndRecapFromAverage] =
		useState<boolean>(true);
	const [sortBy, setSortBy] = useState<"rating" | "chronological">(
		"chronological",
	);

	const calculateAverageScore = (episodes: EpisodeInfos[]) => {
		const filteredEpisodes = hideFillerAndRecapFromAverage
			? episodes.filter((episode) => !episode.filler && !episode.recap && episode.score !== null)
			: episodes;
		return (
			filteredEpisodes.reduce((sum, episode) => sum + episode.score, 0) /
			filteredEpisodes.length
		);
	};
	const onePieceSagas =
		entryType === "anime"
			? onePieceSagasEpisodes(results)
			: onePieceSagasChapters(results);

	const sagaData = onePieceSagas.map((saga) => {
		const sagaEpisodes = results.filter(
			(episode) =>
				(saga.minAiredDate ? episode.aired >= saga.minAiredDate : true) &&
				(saga.maxAiredDate ? episode.aired <= saga.maxAiredDate : true),
		);
		const averageScore = calculateAverageScore(sagaEpisodes);

		return {
			saga: saga.saga,
			averageScore: Number(averageScore.toFixed(2)),
			episodeCount: sagaEpisodes.length,
			airDateRange: `${new Date(saga.minAiredDate || "").toLocaleDateString()} - ${new Date(saga.maxAiredDate || "").toLocaleDateString()}`,
			episodeRange: `${saga.story_arcs[0]?.episodesOrChapters.split("—")[0]}-${saga.story_arcs[saga.story_arcs.length - 1]?.episodesOrChapters.split("—").pop()}`,
			arcs: saga.story_arcs.map((arc) => arc.arc).join(", "),
		};
	});
	const arcData = onePieceSagas.flatMap((saga) =>
		saga.story_arcs.map((arc) => {
			// const arcEpisodes = results.filter(episode => {
			// 	const episodeRanges = arc.episodesOrChapters.split(",").map(range => range.trim())
			// 	return episodeRanges.some(range => {
			// 		if (range.includes("—")) {
			// 			const [start, end] = range.split("—").map(Number)
			// 			return episode.episodeNb >= start && episode.episodeNb <= end
			// 		}
			// 		return episode.episodeNb === Number(range)
			// 	})
			// })
			// const arcChapters = results.filter(episode => {
			// 	const episodeRanges = arc.episodesOrChapters.split(",").map(range => range.trim())
			// 	return episodeRanges.some(range => {
			// 		const [start, end] = range.split("—").map(Number)
			// 		return episode.episodeNb >= start && episode.episodeNb <= end
			// 	})
			// })
			// const arcEpisodesOrChapters = entryType === "anime" ? arcEpisodes : arcChapters
			const arcEpisodesOrChapters = results.filter((episode) => {
				const episodeRanges = arc.episodesOrChapters
					.split(",")
					.map((range) => range.trim());
				return episodeRanges.some((range) => {
					if (range.includes("—")) {
						const [start, end] = range.split("—").map(Number);
						return episode.episodeNb >= start && episode.episodeNb <= end;
					}
					return entryType === "anime"
						? episode.episodeNb === Number(range)
						: episode.episodeNb >= Number(range) &&
						episode.episodeNb <= Number(range);
				});
			});
			const averageScore = calculateAverageScore(arcEpisodesOrChapters);

			return {
				arc: arc.arc,
				saga: saga.saga,
				averageScore: Number(averageScore.toFixed(2)),
				episodeCount: arcEpisodesOrChapters.length,
				episodeCountWithoutFillerAndRecap: arcEpisodesOrChapters.filter(episode => (episode.filler || episode.recap)).length,
				airDateRange: `${new Date(arc.minAiredDate || "").toLocaleDateString()} - ${new Date(arc.maxAiredDate || "").toLocaleDateString()}`,
				episodeRange: arc.episodesOrChapters,
				filler:
					arcEpisodesOrChapters.length > 0 &&
					arcEpisodesOrChapters.every((episode) => episode.filler),
			};
		}),
	);

	const filteredData =
		mode === "saga"
			? sagaData
			: arcData.filter((item) => !filterFiller || !item.filler);

	const sortedData = [...filteredData].sort((a, b) => {
		if (sortBy === "rating") {
			return b.averageScore - a.averageScore;
		}
		return 0; // Keep original order for chronological sorting
	});

	const CustomTooltip = ({
		active,
		payload,
		label,
	}: {
		active?: boolean;
		payload?: any[];
		label?: string;
	}) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<ul className="border border-slate-200 dark:border-gray-700 p-2 rounded-md bg-background text-sm max-w-[300px]">
					<li className="label">
						•{" "}
						{`${mode === "saga" ? "Saga" : "Arc"}: ${label} ${data.filler ? "(Filler)" : ""}`}
					</li>
					{mode === "saga" && (
						<li className="label">• {`Arcs: ${data.arcs}`}</li>
					)}
					{mode === "arc" && (
						<li className="label">• {`Saga: ${data.saga}`}</li>
					)}
					<li className="label">
						• {`Average rating: ${data.averageScore}/5`}
					</li>
					<li className="label">
						•{" "}
						{`Number of ${entryType === "anime" ? "episodes" : "chapters"}: ${data.episodeCount}`}
						{data.episodeCountWithoutFillerAndRecap !== data.episodeCount && data.episodeCountWithoutFillerAndRecap > 0 && ` (${data.episodeCountWithoutFillerAndRecap} are filler/recap)`}
					</li>
					<li className="label">
						•{" "}
						{`${entryType === "anime" ? "Episodes" : "Chapters"}: ${data.episodeRange}`}
					</li>
					<li className="label">• {`Aired dates: ${data.airDateRange}`}</li>
				</ul>
			);
		}
		return null;
	};

	return (
		<>
			<h3 className="text-xl font-semibold mt-5 mb-3">
				Average score by {mode === "saga" ? "saga" : "arc"}
			</h3>
			<div className="flex gap-4 mb-4 flex-wrap">
				<div className="flex flex-col">
					<label htmlFor="mode-select">Mode</label>
					<Select
						value={mode}
						onValueChange={(value: "saga" | "arc") => setMode(value)}
					>
						<SelectTrigger className="w-[140px]  focus:ring-offset-1 focus:ring-2 bg-white">
							<SelectValue placeholder="Select mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="arc">Arc</SelectItem>
							<SelectItem value="saga">Saga</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col">
					<label htmlFor="sort-select">Sort by</label>
					<Select
						value={sortBy}
						onValueChange={(value: "rating" | "chronological") =>
							setSortBy(value)
						}
					>
						<SelectTrigger className="w-[140px]  focus:ring-offset-1 focus:ring-2 bg-white">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="chronological">
								{mode === "saga" ? "Saga" : "Arc"}
							</SelectItem>
							<SelectItem value="rating">Score</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{mode === "arc" && entryType === "anime" && (
					<div className="flex flex-col">
						<label htmlFor="filter-filler">Show filler arcs?</label>
						<Select
							value={filterFiller ? "true" : "false"}
							onValueChange={(value) => {
								setFilterFiller(value === "true");
								// also set hide filler from average to the opposite of filter filler
								setHideFillerAndRecapFromAverage(value === "true");
							}}
						>
							<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
								<SelectValue placeholder="Filter filler" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">No</SelectItem>
								<SelectItem value="false">Yes</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
				{entryType === "anime" && (
					<div className="flex flex-col">
						<label htmlFor="hide-filler-from-average">
							Count fillers in avg score?
						</label>
						<Select
							value={hideFillerAndRecapFromAverage ? "true" : "false"}
							onValueChange={(value) =>
								setHideFillerAndRecapFromAverage(value === "true")
							}
						>
							<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
								<SelectValue placeholder="Filler in average" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">No</SelectItem>
								<SelectItem value="false">Yes</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			</div>
			<ChartContainer config={chartConfig}>
				<LineChart
					data={sortedData}
					margin={{ top: 20, left: 20, right: 20, bottom: 60 }}
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey={mode === "saga" ? "saga" : "arc"}
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						angle={-45}
						textAnchor="end"
						height={80}
						interval={0}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						domain={[4, 4.8]}
						// ticks={[4, 4.5, 4.8]}
						label={{
							value: "Average Score (/5)",
							angle: -90,
							position: "insideLeft",
							offset: 0,
						}}
					/>
					<ChartTooltip content={<CustomTooltip />} />
					<Line
						type="monotone"
						dataKey="averageScore"
						stroke="hsl(var(--chart-3))"
						strokeWidth={2}
						// dot={{ fill: "hsl(var(--chart-3))" }}
						dot={(props) => {
							const isFiller = props.payload.filler;
							return (
								<circle
									cx={props.cx}
									cy={props.cy}
									r={4}
									fill={
										isFiller ? "hsl(var(--destructive))" : "hsl(var(--chart-3))"
									}
								/>
							);
						}}
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						activeDot={(props: any) => {
							const isFiller = props.payload.filler;
							return (
								<circle
									cx={props.cx}
									cy={props.cy}
									r={6}
									fill={
										isFiller ? "hsl(var(--destructive))" : "hsl(var(--chart-3))"
									}
								/>
							);
						}}
					>
						<LabelList
							position="top"
							offset={12}
							className="fill-foreground"
							fontSize={12}
						/>
					</Line>
				</LineChart>
			</ChartContainer>
		</>
	);
}
