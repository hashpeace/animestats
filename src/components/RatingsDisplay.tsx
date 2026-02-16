import { ChevronDown, ExternalLink, InfoIcon, LoaderCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
	CartesianGrid,
	LabelList,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";
import { AllStarsRatingStacked } from "@/components/AllStarsRatingStacked";
import { onePieceSagasEpisodes } from "@/components/OnePieceOnly/utils";
import { onePieceSagasChapters } from "@/components/OnePieceOnly/utils2";
import RatingsDisplayAdditionalGraph from "@/components/RatingsDisplayAdditionalGraph";
import RatingsDisplayOptions from "@/components/RatingsDisplayOptions";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, isProduction } from "@/lib/utils";
import type {
	AnimeInfo,
	ChartOptions,
	EpisodeInfos,
	RatingsDisplayProps,
} from "@/types/All";

// Rating tier colors for wrapped view (based on percentage 0-100, displayed as /10)
// When using 1 decimal, we round the displayed value and use that for tier calculation
const getRatingTier = (
	rating: number | undefined,
	format: "1decimal" | "2decimal" = "2decimal",
) => {
	if (rating === undefined || rating === 0)
		return { label: "Unrated", color: "#6b7280", textColor: "#ffffff" };

	// Round based on display format to match what user sees
	const outOf10 = rating / 10;
	const roundedValue =
		format === "1decimal"
			? Math.round(outOf10 * 10) / 10 // Round to 1 decimal (e.g., 9.25 → 9.3)
			: Math.round(outOf10 * 100) / 100; // Round to 2 decimals (e.g., 9.256 → 9.26)

	// Compare using the rounded /10 value
	if (roundedValue >= 9.7)
		return { label: "Masterpiece", color: "#008a92", textColor: "#ffffff" };
	if (roundedValue >= 9)
		return { label: "Awesome", color: "#166534", textColor: "#ffffff" };
	if (roundedValue >= 8)
		return { label: "Great", color: "#22c55e", textColor: "#4e4444" };
	if (roundedValue >= 7.5)
		return { label: "Good", color: "#F4D03F", textColor: "#4e4444" };
	if (roundedValue >= 6)
		return { label: "Regular", color: "#F39C13", textColor: "#4e4444" };
	if (roundedValue >= 4)
		return { label: "Bad", color: "#ef4444", textColor: "#ffffff" };
	if (roundedValue === 0 || roundedValue === null)
		return { label: "Unrated", color: "#6b7280", textColor: "#ffffff" };
	return { label: "Garbage", color: "#a855f7", textColor: "#ffffff" };
};

// Format rating from percentage to /10 scale
const formatRating = (
	rating: number | undefined,
	format: "1decimal" | "2decimal",
): string => {
	if (rating === undefined || rating === 0) return "-";
	const outOf10 = rating / 10;
	return format === "1decimal" ? outOf10.toFixed(1) : outOf10.toFixed(2);
};

const ratingTierLegend = [
	{ label: "Masterpiece", color: "#008a92", threshold: 9.7 },
	{ label: "Awesome", color: "#166534", threshold: 9 },
	{ label: "Great", color: "#22c55e", threshold: 8 },
	{ label: "Good", color: "#F4D03F", threshold: 7.5 },
	{ label: "Regular", color: "#F39C13", threshold: 6 },
	{ label: "Bad", color: "#ef4444", threshold: 4 },
	{ label: "Garbage", color: "#a855f7", threshold: 0 },
];

export const chartConfig = {
	ratingFiveStars: {
		label: "ratingFiveStars",
		color: "hsl(var(--chart-1))",
	},
	ratingAllStars: {
		label: "ratingAllStars",
		color: "hsl(var(--chart-3))",
	},
	// ratingAllStarsRounded: {
	// 	label: "ratingAllStarsRounded",
	// 	color: "hsl(var(--chart-2))",
	// },
} satisfies ChartConfig;

export default function RatingsDisplay({
	results,
	animeInfo,
	entryType = "anime",
	fetchingMethod,
	episodeCount,
	dataSource,
	isOnePieceOnly,
}: RatingsDisplayProps) {
	const isLongAnime = results.length > 80;
	const entryTitle = animeInfo?.titles.find((title) => title.type === "Default")?.title ?? animeInfo?.title ?? "";
	const nbOfTicks =
		results.length > 1000
			? 50
			: results.length >= 500
				? 20
				: results.length > 250
					? 10
					: 5;

	const [options, setOptions] = useState<ChartOptions>({
		sortBy: "episodeNb",
		visibleRatingInfo: {
			ratingAllStars: true,
			...(fetchingMethod === "cheerioParser" && { ratingFiveStars: false }),
			// ratingAllStarsRounded: false,
		},
		hideZeroValues: true,
		viewMode: "graph",
		yAxisDomain: "closed",
		lineStyle: "monotone",
		filterFillerAndRecap: "show",
		filterBelowScore: { score: "", type: "highlight" },
		showTrendLine: false,
		ratingDisplayFormat: dataSource === "mal" ? "2decimal" : "1decimal",
	});

	const sortedResults = useMemo(() => {
		let sorted = [...results].sort((a, b) =>
			options.sortBy === "ratingFiveStars"
				? b.ratingFiveStars - a.ratingFiveStars
				: options.sortBy === "ratingAllStars"
					? (b.ratingAllStars ?? 0) - (a.ratingAllStars ?? 0)
					: a.episodeNb - b.episodeNb,
		);

		sorted = sorted
			.filter((result) => {
				if (
					options.filterFillerAndRecap === "remove" &&
					(result.filler || result.recap)
				) {
					return false;
				}
				return options.filterBelowScore.type === "remove"
					? result.ratingAllStars !== undefined &&
					result.ratingAllStars > Number(options.filterBelowScore.score)
					: true;
			})
			.map((result) => {
				let currentSaga = "";
				let currentArc = "";
				if (isOnePieceOnly) {
					setOptions((prevOptions) => ({
						...prevOptions,
						viewMode: "wrapped",
					}));
					const sagas =
						entryType === "manga"
							? onePieceSagasChapters(results)
							: onePieceSagasEpisodes(results);
					for (const saga of sagas) {
						for (const arc of saga.story_arcs) {
							const ranges = arc.episodesOrChapters
								.split(",")
								.map((range) => range.trim());
							for (const range of ranges) {
								let start: number;
								let end: number;
								if (range.includes("-") || range.includes("—")) {
									[start, end] = range.split(/[-—]/).map(Number);
								} else {
									start = end = Number(range);
								}
								if (result.episodeNb >= start && result.episodeNb <= end) {
									currentSaga = saga.saga;
									currentArc = arc.arc;
									break;
								}
							}
							if (currentArc) break;
						}
						if (currentSaga) break;
					}
				}

				const shouldHide =
					options.filterBelowScore !== undefined &&
					options.filterBelowScore.type === "hide" &&
					((result.ratingAllStars !== undefined &&
						result.ratingAllStars < Number(options.filterBelowScore.score)) ||
						(result.ratingFiveStars !== undefined &&
							result.ratingFiveStars < Number(options.filterBelowScore.score)));

				return {
					...result,
					ratingFiveStars:
						(options.hideZeroValues && result.ratingFiveStars === 0) ||
							(options.filterFillerAndRecap === "hide" &&
								(result.filler || result.recap)) ||
							shouldHide
							? undefined
							: result.ratingFiveStars,
					ratingAllStars:
						(options.hideZeroValues && result.ratingAllStars === 0) ||
							(options.filterFillerAndRecap === "hide" &&
								(result.filler || result.recap)) ||
							shouldHide
							? undefined
							: result.ratingAllStars,
					currentSaga,
					currentArc,
				};
			}) as EpisodeInfos[];

		return sorted;
	}, [
		results,
		options.sortBy,
		options.hideZeroValues,
		options.filterFillerAndRecap,
		options.filterBelowScore,
		animeInfo?.mal_id,
	]);

	// Helper to round rating based on display format (returns value in /10 scale)
	const roundRating = (
		rating: number | undefined,
		format: "1decimal" | "2decimal",
	): number | undefined => {
		if (rating === undefined || rating === 0) return undefined;
		const outOf10 = rating / 10;
		return format === "1decimal"
			? Math.round(outOf10 * 10) / 10
			: Math.round(outOf10 * 100) / 100;
	};

	// Transform data to use rounded /10 values for the chart (and keep percentage for five stars)
	const chartData = useMemo(() => {
		return sortedResults.map((item) => ({
			...item,
			// Store rounded /10 values for chart display
			ratingAllStarsChart: roundRating(
				item.ratingAllStars,
				options.ratingDisplayFormat,
			),
			// Keep five stars as percentage for right Y-axis
			ratingFiveStarsChart:
				item.ratingFiveStars === 0 ? undefined : item.ratingFiveStars,
		}));
	}, [sortedResults, options.ratingDisplayFormat]);

	// Calculate moving average for trendline
	const trendLineData = useMemo(() => {
		if (!options.showTrendLine || options.sortBy !== "episodeNb")
			return chartData;

		// Window size is proportional to data length (roughly 10-15% of total)
		const windowSize = Math.max(
			3,
			Math.min(Math.ceil(chartData.length * 0.1), 20),
		);

		return chartData.map((item, index) => {
			// Calculate weighted moving average centered around current point
			const halfWindow = Math.floor(windowSize / 2);
			const start = Math.max(0, index - halfWindow);
			const end = Math.min(chartData.length - 1, index + halfWindow);

			let sum = 0;
			let count = 0;

			for (let i = start; i <= end; i++) {
				const value = chartData[i].ratingAllStarsChart;
				if (value !== undefined && value !== 0) {
					// Weight: higher weight for points closer to center
					const distance = Math.abs(i - index);
					const weight = 1 - (distance / (halfWindow + 1)) * 0.5;
					sum += value * weight;
					count += weight;
				}
			}

			return {
				...item,
				trendValue: count > 0 ? sum / count : undefined,
			};
		});
	}, [chartData, options.showTrendLine, options.sortBy]);

	// Show the number of episodes/chapters that were filtered out in a toast
	useEffect(() => {
		if (
			options.filterBelowScore.type === "highlight" &&
			options.filterBelowScore.score !== ""
		) {
			toast.info(
				`Filtered ${sortedResults.filter((result) => result.ratingAllStars !== undefined && result.ratingAllStars < Number(options.filterBelowScore.score)).length} out of ${results.length} ${entryType === "anime" ? "episodes" : "chapters"}`,
			);
		} else if (options.filterBelowScore.type === "hide") {
			toast.info(
				`Hidden ${sortedResults.filter((result) => result.ratingAllStars === undefined).length} out of ${results.length} ${entryType === "anime" ? "episodes" : "chapters"}`,
			);
		} else if (options.filterBelowScore.type === "remove") {
			toast.info(
				`Removed ${results.length - sortedResults.length} out of ${results.length} ${entryType === "anime" ? "episodes" : "chapters"}`,
			);
		}
	}, [
		sortedResults,
		entryType,
		options.filterBelowScore.type,
		results.length,
		options.filterBelowScore.score,
	]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const CustomTooltip = ({
		active,
		payload,
		label,
	}: {
		active: boolean | undefined;
		payload: any;
		label: string | boolean;
	}) => {
		if (active && payload && payload.length) {
			const ratingValue = payload[0].payload.ratingAllStarsChart;
			const fiveStarsValue = payload[0].payload.ratingFiveStarsChart;
			const formatValue = (val: number | undefined) =>
				val !== undefined
					? options.ratingDisplayFormat === "1decimal"
						? val.toFixed(1)
						: val.toFixed(2)
					: "-";

			return (
				<div className="border border-slate-200 p-2 rounded-md bg-white text-sm">
					<p className="label">
						{`${entryType === "anime" ? "Episode" : "Chapter"}: ${label}`}
						{payload[0].payload.filler && " (filler)"}
						{payload[0].payload.recap && " (recap)"}
					</p>
					{fetchingMethod === "cheerioParser" &&
						payload[0].payload.nbOfVotes && (
							<p className="label">{`# of votes: ${payload[0].payload.nbOfVotes.toLocaleString("en-US")}`}</p>
						)}
					{ratingValue && options.visibleRatingInfo.ratingAllStars && (
						<p className="label">{`Rating: ${formatValue(ratingValue)}/10`}</p>
					)}
					{fetchingMethod === "cheerioParser" &&
						options.visibleRatingInfo.ratingFiveStars &&
						fiveStarsValue && (
							<p className="label">{`5☆ rating: ${fiveStarsValue.toFixed(1)}%`}</p>
						)}
					{payload[0].payload.title && (
						<p className="label">{`Title: ${payload[0].payload.title}`}</p>
					)}
					{payload[0].payload.aired && (
						<p className="label">{`Aired: ${new Date(payload[0].payload.aired).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}</p>
					)}
					{payload[0].payload.currentSaga && (
						<p className="label">{`Saga: ${payload[0].payload.currentSaga}`}</p>
					)}
					{payload[0].payload.currentArc && (
						<p className="label">{`Arc: ${payload[0].payload.currentArc}`}</p>
					)}
				</div>
			);
		}

		return null;
	};

	const handleTableClickSort = (sortBy: ChartOptions["sortBy"]) => {
		setOptions((prevOptions) => ({
			...prevOptions,
			sortBy: prevOptions.sortBy === sortBy ? "episodeNb" : sortBy,
		}));
	};

	const hasRecapOrFiller = () => results.some((result) => result.recap || result.filler);

	const hasZeroValues = (type: "ratingFiveStars" | "ratingAllStars" | "all") =>
		results.some((r) =>
			type === "all"
				? !r.ratingFiveStars || !r.ratingAllStars
				: type === "ratingFiveStars"
					? !r.ratingFiveStars
					: !r.ratingAllStars,
		);

	const calculateAverage = (key: "ratingFiveStars" | "ratingAllStars") => {
		const filteredResults = sortedResults.filter((result) =>
			options.filterFillerAndRecap === "hide"
				? result[key] !== undefined
				: true,
		);
		return filteredResults.length > 0
			? (
				filteredResults.reduce(
					(sum, result) => sum + (result[key] as number),
					0,
				) / filteredResults.length
			).toFixed(1)
			: "0";
	};

	const [avgRatingFiveStars, avgRatingAllStars] = [
		"ratingFiveStars",
		"ratingAllStars",
	].map((key) => calculateAverage(key as "ratingFiveStars" | "ratingAllStars"));

	const handleShare = async () => {
		if (!animeInfo?.mal_id) return;

		const currentUrl = window.location.href;
		const shareUrl = currentUrl.includes("?")
			? currentUrl.replace(/animeId=\d+/, `animeId=${animeInfo.mal_id}`)
			: `${currentUrl}?animeId=${animeInfo.mal_id}`;

		const shareData = {
			text: `Check out the episode ratings for ${entryTitle}`,
			url: shareUrl,
		};

		// Try native sharing first (only on mobile/tablet devices)
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			);
		if (
			isMobile &&
			navigator.share &&
			navigator.canShare &&
			navigator.canShare(shareData)
		) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				if ((err as Error).name !== "AbortError") {
					console.error("Failed to share:", err);
					// Fall back to clipboard
					await copyToClipboard(shareUrl);
				}
			}
		} else {
			// Fall back to clipboard copying
			await copyToClipboard(shareUrl);
		}
	};

	const copyToClipboard = async (url: string) => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Successfully copied!", {
				description: "You can now share the ratings for this anime.",
			});
		} catch (err) {
			console.error("Failed to copy:", err);
			toast.error("Failed to copy", {
				description: "Failed to copy to clipboard. Please try again.",
			});
		}
	};

	const entryStats =
		!animeInfo
			? []
			: (dataSource as string) === "imdb"
				? [
					{ label: "Episodes", value: animeInfo.episodes },
					{ label: "Aired", value: animeInfo.aired?.string || animeInfo.year || "-" },
					{
						label: "Score",
						value: `${animeInfo.score} (${animeInfo.scored_by?.toLocaleString("en-US") || "-"} users)`,
					},
				]
				: [
					{ label: "Type", value: animeInfo.type },
					{
						label: entryType === "anime" ? "Episodes" : "Chapters",
						value:
							entryType === "anime"
								? animeInfo.episodes
								: animeInfo.chapters || "-",
					},
					{ label: "Status", value: animeInfo.status },
					{
						label: "Aired",
						value:
							entryType === "anime"
								? animeInfo.aired?.string || "-"
								: animeInfo.published?.string || "-",
					},
					{
						label: "Score",
						value: `${animeInfo.score} (${animeInfo.scored_by?.toLocaleString("en-US") || "-"} users)`,
					},
					{ label: "Rank", value: `#${animeInfo.rank}` },
					{ label: "Popularity", value: `#${animeInfo.popularity}` },
					{ label: "Members", value: animeInfo.members.toLocaleString("en-US") },
				];

	return (
		<>
			{animeInfo && (
				<div className="mb-4 p-2 sm:p-4 border border-gray-200 rounded-lg w-fit bg-gray-50/50">
					{/* <div className="flex flex-col sm:flex-row items-start"> */}
					<div className="flex flex-row items-start gap-4 max-md:mb-4">
						{animeInfo.images?.webp?.image_url && (
							<Image
								src={animeInfo.images.webp?.image_url}
								alt={
									entryTitle || "Entry cover"
								}
								width={130}
								height={180}
								className="rounded-lg shadow-md flex-none max-md:w-[100px] max-md:h-[140px]"
							/>
						)}
						<div className="flex-grow w-full">
							<div className="flex items-center gap-2 mb-2">
								<h2 className="text-xl font-bold">
									<a
										href={animeInfo.url}
										target="_blank"
										rel="noopener noreferrer"
										className="hover:underline"
									>
										{entryTitle}
									</a>
								</h2>
								{entryType === "anime" && (
									<button
										onClick={handleShare}
										className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
										title="Share this page"
									>
										<Share2 size={16} />
									</button>
								)}
							</div>
							<div className={cn("grid gap-2 text-sm max-md:hidden", dataSource === "mal" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
								{entryStats.map(({ label, value }) => (
									<p key={label}>
										<span className="font-semibold">{label}:</span> {value}
									</p>
								))}
							</div>
						</div>
					</div>
					<div className={cn("grid gap-2 text-sm md:hidden", dataSource === "mal" ? "max-[400px]:grid-cols-1 grid-cols-2 max-[380px]:grid-rows-2" : "grid-cols-1")}>
						{entryStats.map(({ label, value }) => (
							<p key={label}>
								<span className="font-semibold">{label}:</span> {value}
							</p>
						))}
					</div>
				</div>
			)}
			<RatingsDisplayOptions
				options={options}
				setOptions={setOptions}
				hasZeroValues={hasZeroValues("all")}
				hasRecapOrFiller={hasRecapOrFiller()}
				entryType={entryType}
				dataSource={dataSource}
			/>
			{options.viewMode === "wrapped" ? (
				<div>
					{/* Legend - only show tiers present in results */}
					<TooltipProvider>
						<div className="flex flex-wrap gap-4 mb-6">
							{ratingTierLegend.filter((tier) => {
								return sortedResults.some((result) => {
									const resultTier = getRatingTier(result.ratingAllStars, options.ratingDisplayFormat);
									return resultTier.label === tier.label;
								});
							}).map((tier) => {
								const thresholdText = tier.label === "Garbage"
									? "< 4.0"
									: `≥ ${tier.threshold.toFixed(1)}`;
								return (
									<Tooltip key={tier.label}>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-2">
												<div
													className="w-3 h-3 rounded-full"
													style={{ backgroundColor: tier.color }}
												/>
												<span className="text-sm text-gray-600">{tier.label}</span>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Score: {thresholdText}</p>
										</TooltipContent>
									</Tooltip>
								);
							})}
						</div>
					</TooltipProvider>

					{/* Cards Grid */}
					<TooltipProvider delayDuration={100}>
						<div className="flex flex-wrap gap-2">
							{sortedResults.map((result) => {
								const rating = result.ratingAllStars;
								const tier = getRatingTier(rating, options.ratingDisplayFormat);
								const displayRating = formatRating(
									rating,
									options.ratingDisplayFormat,
								);
								const isFillerOrRecap = result.filler || result.recap;

								return (
									<Tooltip key={result.episodeNb}>
										<TooltipTrigger asChild>
											<div
												className={cn(
													"relative w-[92px] h-[52px] p-2 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg",
													isFillerOrRecap &&
													options.filterFillerAndRecap === "highlight" &&
													"ring-2 ring-red-500",
												)}
												style={{ backgroundColor: tier.color }}
											>
												<span
													className="text-[14px] font-medium opacity-80 w-full text-left"
													style={{ color: tier.textColor }}
												>
													{entryType === "anime" ? "E" : "Ch"}
													{result.episodeNb}
												</span>
												<span
													className="text-2xl font-bold w-full text-right"
													style={{ color: tier.textColor }}
												>
													{displayRating}
												</span>
											</div>
										</TooltipTrigger>
										<TooltipContent className="max-w-[280px]">
											<div className="block">
												<span>
													{entryType === "anime" ? "Episode" : "Chapter"}{" "}
													{result.episodeNb}
												</span>
												{result.title && (
													<span className="text-sm">
														{" - "} {result.title}
													</span>
												)}
												{isFillerOrRecap && (
													<span className="text-xs text-muted-foreground">
														{" "}
														(Filler/Recap)
													</span>
												)}
											</div>
											{result.aired && (
												<span className="text-xs text-muted-foreground">
													Aired:{" "}
													{new Date(result.aired).toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
													})}
												</span>
											)}
										</TooltipContent>
									</Tooltip>
								);
							})}
						</div>
					</TooltipProvider>
				</div>
			) : options.viewMode === "graph" ? (
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={trendLineData}
						margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="episodeNb"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							domain={[0, results[results.length - 1].episodeNb]}
							ticks={
								isLongAnime && !episodeCount
									? [
										1,
										...Array.from(
											{
												length: Math.ceil(
													results[results.length - 1].episodeNb / nbOfTicks,
												),
											},
											(_, i) =>
												Math.min(
													(i + 1) * nbOfTicks,
													results[results.length - 1].episodeNb,
												),
										),
									]
									: undefined
							}
							label={{
								value: entryType === "anime" ? "Episode" : "Chapter",
								position: "bottom",
								offset: 10,
							}}
						/>
						<YAxis
							yAxisId="left"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) =>
								options.yAxisDomain === "full"
									? value.toFixed(0)
									: options.ratingDisplayFormat === "1decimal"
										? value.toFixed(1)
										: value.toFixed(2)
							}
							label={{
								value: "Rating (/10)",
								angle: -90,
								position: "insideLeft",
								offset: 0,
							}}
							domain={
								options.yAxisDomain === "full"
									? [0, 10]
									: ["dataMin-0.05", "dataMax+0.05"]
							}
						/>
						{options.visibleRatingInfo.ratingFiveStars && (
							<YAxis
								yAxisId="right"
								orientation="right"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => `${value.toFixed(0)}%`}
								label={{
									value: "5☆ Rating (%)",
									angle: 90,
									position: "insideRight",
									offset: 0,
								}}
								domain={
									options.yAxisDomain === "full"
										? [0, 100]
										: ["dataMin-0.05", "dataMax+0.05"]
								}
							/>
						)}
						<ChartTooltip content={<CustomTooltip active payload label />} />
						{!hasZeroValues("ratingFiveStars") &&
							options.visibleRatingInfo.ratingFiveStars && (
								<ReferenceLine
									yAxisId="right"
									y={Number(avgRatingFiveStars)}
									stroke="var(--color-ratingFiveStars)"
									strokeDasharray="3 3"
								/>
							)}
						{!hasZeroValues("ratingAllStars") &&
							options.visibleRatingInfo.ratingAllStars && (
								<ReferenceLine
									yAxisId="left"
									y={Number(avgRatingAllStars) / 10}
									stroke="var(--color-ratingAllStars)"
									strokeDasharray="3 3"
								/>
							)}
						{options.filterBelowScore.type === "highlight" &&
							options.filterBelowScore.score && (
								<ReferenceLine
									yAxisId="left"
									y={Number(options.filterBelowScore.score) / 10}
									stroke="#fb923c"
									strokeDasharray="3 3"
									label={`Below ${formatRating(Number(options.filterBelowScore.score), options.ratingDisplayFormat)}/10`}
								/>
							)}
						{/* {!hasZeroValues("ratingFiveStars") && options.visibleRatingInfo.ratingFiveStars && <ReferenceLine y={avgRatingFiveStars} stroke="var(--color-ratingFiveStars)" strokeDasharray="3 3" label={`Average: ${avgRatingFiveStars}%`} />}
						{!hasZeroValues("ratingAllStarsRounded") && options.visibleRatingInfo.ratingAllStars && <ReferenceLine y={avgRatingAllStars} stroke="var(--color-ratingAllStars)" strokeDasharray="3 3" label={`Average: ${avgRatingAllStars}%`} />} */}
						{options.showTrendLine && options.sortBy === "episodeNb" && (
							<Line
								yAxisId="left"
								dataKey="trendValue"
								type="monotone"
								stroke="rgba(200, 200, 200, 0.9)"
								strokeWidth={3}
								dot={false}
								activeDot={false}
								connectNulls
							/>
						)}
						{options.visibleRatingInfo.ratingAllStars && (
							<Line
								yAxisId="left"
								dataKey="ratingAllStarsChart"
								type={options.lineStyle}
								stroke="var(--color-ratingAllStars)"
								strokeWidth={2}
								dot={(props) => {
									const isFillerOrRecap =
										props.payload.filler || props.payload.recap;
									const filterThreshold =
										Number(options.filterBelowScore.score) / 10;
									const isBelowScoreAndHighlighted =
										props.payload.ratingAllStarsChart !== undefined &&
										props.payload.ratingAllStarsChart < filterThreshold &&
										options.filterBelowScore.type === "highlight";
									const isHighlightedFiller =
										isFillerOrRecap &&
										options.filterFillerAndRecap === "highlight";

									return (
										<circle
											key={`dot-${props.payload.episodeNb}`}
											cx={props.cx}
											cy={props.cy}
											r={4}
											fill={
												isHighlightedFiller
													? "#ef4444"
													: isBelowScoreAndHighlighted
														? "#fb923c"
														: "hsl(var(--chart-3))"
											}
										/>
									);
								}}
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								activeDot={(props: any) => {
									const isFillerOrRecap =
										props.payload.filler || props.payload.recap;
									const filterThreshold =
										Number(options.filterBelowScore.score) / 10;
									const isBelowScoreAndHighlighted =
										props.payload.ratingAllStarsChart !== undefined &&
										props.payload.ratingAllStarsChart < filterThreshold &&
										options.filterBelowScore.type === "highlight";
									return (
										<circle
											key={`active-dot-${props.payload.episodeNb}`}
											cx={props.cx}
											cy={props.cy}
											r={6}
											fill={
												isFillerOrRecap &&
													options.filterFillerAndRecap === "highlight"
													? "#ef4444"
													: isBelowScoreAndHighlighted
														? "#fb923c"
														: "hsl(var(--chart-3))"
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
									formatter={(value: number) =>
										options.ratingDisplayFormat === "1decimal"
											? value.toFixed(1)
											: value.toFixed(2)
									}
								/>
							</Line>
						)}
						{options.visibleRatingInfo.ratingFiveStars && (
							<Line
								yAxisId="right"
								dataKey="ratingFiveStarsChart"
								type={options.lineStyle}
								stroke="var(--color-ratingFiveStars)"
								strokeWidth={2}
								dot={{ fill: "var(--color-ratingFiveStars)" }}
								activeDot={{ r: 6 }}
							>
								<LabelList
									position="top"
									offset={12}
									className="fill-foreground"
									fontSize={12}
									formatter={(value: number) => `${value.toFixed(1)}%`}
								/>
							</Line>
						)}
						{/* {options.visibleRatingInfo.ratingAllStarsRounded && (
							<Line
								dataKey="ratingAllStarsRounded"
								type="monotone"
								stroke="var(--color-ratingAllStarsRounded)"
								strokeWidth={2}
								dot={{ fill: "var(--color-ratingAllStarsRounded)" }}
								activeDot={{ r: 6 }}
							>
								<LabelList
									position="bottom"
									offset={12}
									className="fill-foreground"
									fontSize={12}
								/>
							</Line>
						)} */}
					</LineChart>
				</ChartContainer>
			) : (
				<>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead
									className="md:min-w-[90px] md:max-w-[100px] xl:min-w-[55px] xl:max-w-[55px] cursor-pointer hover:text-gray-700"
									onClick={() => handleTableClickSort("episodeNb")}
								>
									{entryType === "anime" ? "Episode" : "Chapter"}
									{options.sortBy === "episodeNb" && (
										<ChevronDown className="inline-block ml-1" size={16} />
									)}
								</TableHead>
								{options.visibleRatingInfo.ratingAllStars && (
									<TableHead
										className="max-w-[100px] cursor-pointer hover:text-gray-700"
										onClick={() => handleTableClickSort("ratingAllStars")}
									>
										Rating (/10)
										{options.sortBy === "ratingAllStars" && (
											<ChevronDown className="inline-block ml-1" size={16} />
										)}
									</TableHead>
								)}
								{options.visibleRatingInfo.ratingFiveStars && (
									<TableHead
										className="max-w-[100px] cursor-pointer hover:text-gray-700"
										onClick={() => handleTableClickSort("ratingFiveStars")}
									>
										5☆ rating (%)
										{options.sortBy === "ratingFiveStars" && (
											<ChevronDown className="inline-block ml-1" size={16} />
										)}
									</TableHead>
								)}
								{/* {options.visibleRatingInfo.ratingAllStarsRounded && (
									<TableHead className="max-w-[100px] cursor-pointer" onClick={() => handleTableClickSort('ratingAllStarsRounded')}>
										Score rounded (%)
										{options.sortBy === 'ratingAllStarsRounded' && <ChevronDown className="inline-block ml-1" size={16} />}
									</TableHead>
								)} */}
								{fetchingMethod === "cheerioParser" && (
									<TableHead># of votes</TableHead>
								)}
								<TableHead>Title</TableHead>
								<TableHead>Aired</TableHead>
								{isOnePieceOnly && !isProduction && <TableHead>Saga</TableHead>}
								{isOnePieceOnly && !isProduction && <TableHead>Arc</TableHead>}
								<TableHead className="max-w-[60px]">Forum URL</TableHead>
								{(fetchingMethod === "cheerioParser" ||
									(isOnePieceOnly && entryType === "manga")) && (
										<TableHead className="min-w-[200px]">Ratings distribution</TableHead>
									)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedResults.map((result) => {
								const isBelowScoreAndHighlighted =
									result.ratingAllStars !== undefined &&
									result.ratingAllStars <
									Number(options.filterBelowScore.score) &&
									options.filterBelowScore.type === "highlight";
								const isFillerOrRecap = result.filler || result.recap;
								const ratingCellClasses = cn(
									isFillerOrRecap &&
									options.filterFillerAndRecap === "highlight" &&
									"text-red-500",
									isBelowScoreAndHighlighted && "text-orange-400",
								);

								return (
									<TableRow key={result.episodeNb}>
										<TableCell>{result.episodeNb}</TableCell>
										{options.visibleRatingInfo.ratingAllStars && (
											<TableCell className={ratingCellClasses}>
												{formatRating(
													result.ratingAllStars,
													options.ratingDisplayFormat,
												)}
											</TableCell>
										)}
										{options.visibleRatingInfo.ratingFiveStars && (
											<TableCell className={ratingCellClasses}>
												{result.ratingFiveStars !== undefined &&
													result.ratingFiveStars !== 0
													? `${result.ratingFiveStars.toFixed(1)}%`
													: "-"}
											</TableCell>
										)}
										{/* {options.visibleRatingInfo.ratingAllStarsRounded && <TableCell>{result.ratingAllStarsRounded !== undefined ? result.ratingAllStarsRounded : '-'}</TableCell>} */}
										{fetchingMethod === "cheerioParser" && (
											<TableCell>
												{result.nbOfVotes !== undefined
													? result.nbOfVotes.toLocaleString("en-US")
													: "-"}
											</TableCell>
										)}
										<TableCell className="max-w-[200px]">
											{result.title || "-"}
											{result.filler && (
												<span className="ml-2 text-xs font-semibold text-red-500">
													(Filler)
												</span>
											)}
											{result.recap && (
												<span className="ml-2 text-xs font-semibold text-blue-500">
													(Recap)
												</span>
											)}
										</TableCell>
										<TableCell>
											{result.aired
												? new Date(result.aired).toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})
												: "-"}
										</TableCell>
										{isOnePieceOnly && !isProduction && (
											<>
												<TableCell>{result.currentSaga || "-"}</TableCell>
												<TableCell>{result.currentArc || "-"}</TableCell>
											</>
										)}
										<TableCell>
											{result.forumTopicUrl !== undefined ? (
												<a
													href={result.forumTopicUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="hover:text-blue-500"
												>
													<ExternalLink size={16} />
												</a>
											) : (
												"-"
											)}
										</TableCell>
										{(fetchingMethod === "cheerioParser" ||
											(isOnePieceOnly && entryType === "manga")) && (
												<TableCell>
													{result.allRatings ? (
														<AllStarsRatingStacked ratings={result.allRatings} />
													) : (
														<div className="flex justify-center items-center mt-4">
															<LoaderCircle className="animate-spin size-8 text-blue-500" />
															<span className="ml-2 text-blue-500">
																Loading...
															</span>
														</div>
													)}
												</TableCell>
											)}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</>
			)}
			<div className="max-2xl:mt-7">
				<dl className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-[600px]">
					{[
						{
							type: options.visibleRatingInfo.ratingAllStars,
							label: `Average ${entryType === "anime" ? "episodes" : "chapters"} ratings`,
							value: avgRatingAllStars,
							key: "ratingAllStars",
						},
						// { type: options.visibleRatingInfo.ratingAllStarsRounded, label: "Scores (rounded)", value: avgRatingAllStarsRounded, key: "ratingAllStarsRounded" }
						{
							type: options.visibleRatingInfo.ratingFiveStars,
							label: "Average 5☆ ratings only",
							value: avgRatingFiveStars,
							key: "ratingFiveStars",
							isPercentage: true,
						},
					].map(
						(item) =>
							item.type && (
								<div key={item.key} className="rounded-lg bg-white p-3 shadow">
									<dt className="text-sm font-medium text-gray-500">
										{item.label}
									</dt>
									<div className="flex items-center gap-2">
										<dd className="mt-1 text-md font-semibold tracking-tight text-gray-900">
											{item.isPercentage
												? `${Number(item.value).toFixed(1)}%`
												: `${formatRating(Number(item.value), options.ratingDisplayFormat)}/10`}
										</dd>
										{hasZeroValues(item.key as "ratingFiveStars" | "ratingAllStars" | "all") && (
											<div className="flex items-center mt-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<InfoIcon className="size-4 text-red-500" />
													</TooltipTrigger>
													<TooltipContent side="top">
														<span>
															Can&apos;t calculate exact average, because some episodes
															are not rated. But for the available episodes, that is the average.
														</span>
													</TooltipContent>
												</Tooltip>
											</div>
										)}
									</div>
								</div>
							),
					)}
				</dl>
				{isLongAnime && (
					<RatingsDisplayAdditionalGraph
						results={results}
						animeId={animeInfo?.mal_id || 0}
						isOnePieceOnly={isOnePieceOnly}
						entryType={entryType}
						options={options}
					/>
				)}
			</div>
		</>
	);
}
