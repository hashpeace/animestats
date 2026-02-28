import { useMemo, useState } from "react";
import { onePieceSagasEpisodes } from "@/components/OnePieceOnly/manualEpisodesList";
import { onePieceSagasChapters } from "@/components/OnePieceOnly/manualChaptersList";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EntryType, EpisodeInfos } from "@/types/All";
import { cn } from "@/lib/utils";

const SAGA_COLORS = [
	"#22c55e",
	"#3b82f6",
	"#8b5cf6",
	"#06b6d4",
	"#f59e0b",
	"#ef4444",
	"#ec4899",
	"#14b8a6",
	"#84cc16",
	"#f97316",
	"#6366f1",
	"#a855f7",
];

// Break colors for manga
const WB_COLOR = "#fbbf24"; // Weekly Shonen Jump break (weeks 17, 18, 32, 33)
const OB_COLOR = "#f87171"; // Oda break (other weeks)

function getBreakType(
	weekNumber: number,
	entryType: EntryType,
	hasChapters: boolean,
	year?: number,
): "WB" | "OB" | null {
	if (entryType !== "manga") return null;
	// Only apply break colors to weeks with NO chapters
	if (!hasChapters) {
		// Custom WB breaks for specific year-week combinations
		const customWBWeeks: Record<number, number[]> = {
			1997: [50],
			1998: [50],
			1999: [47],
			2016: [50],
			2017: [50],
			2020: [16, 30],
			2021: [29, 31],
		};

		// Check for custom WB weeks for this year
		if (year && customWBWeeks[year]?.includes(weekNumber)) {
			return "WB";
		}

		// Standard WB break: weeks 17, 18, 32, 33 with no chapters
		if ([1, 2, 17, 18, 32, 33, 51, 52, 53].includes(weekNumber)) {
			return "WB";
		}
		// OB break: other weeks with no chapters
		return "OB";
	}
	// Weeks with chapters don't get break colors
	return null;
}

function getWeekStart(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	// Get Monday of the week (Monday = 1, Sunday = 0)
	// If Sunday (0), go back 6 days to get Monday
	// Otherwise, go back (dayOfWeek - 1) days
	const dayOfWeek = d.getDay();
	const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
	d.setDate(d.getDate() - daysToMonday);
	return d;
}

/**
 * Returns the ISO week number for the given date.
 * @param date - The date to get the ISO week number for.
 * @returns The ISO week number.
 */
function getWeekNumber(date: Date): number {
	const tempDate = new Date(date.getTime());
	tempDate.setHours(0, 0, 0, 0);

	// Thursday in current week decides the year.
	tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
	const week1 = new Date(tempDate.getFullYear(), 0, 4);

	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return (
		1 +
		Math.round(
			((tempDate.getTime() - week1.getTime()) / 86400000 -
				3 +
				((week1.getDay() + 6) % 7)) /
			7,
		)
	);
}

function getWeekYear(date: Date): number {
	const tempDate = new Date(date.getTime());
	tempDate.setHours(0, 0, 0, 0);
	// Thursday in current week decides the year (ISO week year)
	tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
	return tempDate.getFullYear();
}

type SagaItem = {
	saga: string;
	story_arcs: { arc: string; episodesOrChapters: string }[];
};

function getSagaForEpisodeNumber(
	episodeNb: number,
	sagas: SagaItem[],
): string | null {
	for (const saga of sagas) {
		for (const arc of saga.story_arcs) {
			const ranges = arc.episodesOrChapters.split(",").map((r) => r.trim());
			for (const range of ranges) {
				if (range.includes("—")) {
					const [start, end] = range
						.split("—")
						.map((s) => Number.parseInt(s, 10));
					if (
						!Number.isNaN(start) &&
						!Number.isNaN(end) &&
						episodeNb >= start &&
						episodeNb <= end
					) {
						return saga.saga;
					}
				} else {
					const n = Number.parseInt(range, 10);
					if (!Number.isNaN(n) && episodeNb === n) return saga.saga;
				}
			}
		}
	}
	return null;
}

function getArcForEpisodeNumber(
	episodeNb: number,
	sagas: SagaItem[],
): string | null {
	for (const saga of sagas) {
		for (const arc of saga.story_arcs) {
			const ranges = arc.episodesOrChapters.split(",").map((r) => r.trim());
			for (const range of ranges) {
				if (range.includes("—")) {
					const [start, end] = range
						.split("—")
						.map((s) => Number.parseInt(s, 10));
					if (
						!Number.isNaN(start) &&
						!Number.isNaN(end) &&
						episodeNb >= start &&
						episodeNb <= end
					) {
						return arc.arc;
					}
				} else {
					const n = Number.parseInt(range, 10);
					if (!Number.isNaN(n) && episodeNb === n) return arc.arc;
				}
			}
		}
	}
	return null;
}

export default function AiringScheduleGrid({
	results,
	entryType,
	isOnePieceOnly,
}: {
	results: EpisodeInfos[];
	entryType: EntryType;
	isOnePieceOnly: boolean;
}) {
	const [bigBoxes, setBigBoxes] = useState(true);
	const [colorBySaga, setColorBySaga] = useState(false);

	const sagas = useMemo(
		() =>
			entryType === "anime"
				? onePieceSagasEpisodes(results)
				: onePieceSagasChapters(results),
		[entryType, results],
	);

	const sagaNameToColor = useMemo(() => {
		const m = new Map<string, string>();
		sagas.forEach((s, i) => {
			m.set(s.saga, SAGA_COLORS[i % SAGA_COLORS.length]);
		});
		return m;
	}, [sagas]);

	const episodeMap = useMemo(() => {
		const m = new Map<number, EpisodeInfos>();
		results.forEach((ep) => {
			if (ep.episodeNb != null) {
				m.set(ep.episodeNb, ep);
			}
		});
		return m;
	}, [results]);

	const weeksByYear = useMemo(() => {
		// Group episodes by year and week number
		const episodesByYearAndWeek = new Map<
			number,
			Map<
				number,
				{
					episodeNumbers: number[];
					weekStart: Date;
					breakType: "WB" | "OB" | null;
				}
			>
		>();

		// Process each episode
		for (const ep of results) {
			const airedDate = new Date(ep.aired);
			if (Number.isNaN(airedDate.getTime())) continue;

			const weekStart = getWeekStart(airedDate);
			// Calculate week number based on the week start (Monday) to ensure consistency
			const weekNumber = getWeekNumber(weekStart);
			// Use the week's year (ISO week year) instead of the date's year
			// This ensures weeks spanning year boundaries are assigned to the correct year
			const year = getWeekYear(weekStart);

			if (!episodesByYearAndWeek.has(year)) {
				episodesByYearAndWeek.set(year, new Map());
			}
			const weeksMap = episodesByYearAndWeek.get(year)!;

			if (!weeksMap.has(weekNumber)) {
				weeksMap.set(weekNumber, {
					episodeNumbers: [],
					weekStart,
					breakType: null,
				});
			}

			if (ep.episodeNb != null) {
				weeksMap.get(weekNumber)!.episodeNumbers.push(ep.episodeNb);
			}
		}

		// Find the first and last chapter weeks (only for manga)
		let firstChapterWeek: { year: number; weekNumber: number } | null = null;
		let lastChapterWeek: { year: number; weekNumber: number } | null = null;

		if (entryType === "manga" && results.length > 0) {
			const validDates = results
				.map((ep) => new Date(ep.aired))
				.filter((d) => !Number.isNaN(d.getTime()));

			if (validDates.length > 0) {
				const firstDate = new Date(
					Math.min(...validDates.map((d) => d.getTime())),
				);
				const lastDate = new Date(
					Math.max(...validDates.map((d) => d.getTime())),
				);
				const firstWeekStart = getWeekStart(firstDate);
				const lastWeekStart = getWeekStart(lastDate);

				firstChapterWeek = {
					year: getWeekYear(firstWeekStart),
					weekNumber: getWeekNumber(firstWeekStart),
				};
				lastChapterWeek = {
					year: getWeekYear(lastWeekStart),
					weekNumber: getWeekNumber(lastWeekStart),
				};
			}
		}

		// Helper function to check if a week is within the chapter range
		const isWeekInChapterRange = (
			year: number,
			weekNumber: number,
		): boolean => {
			if (entryType !== "manga" || !firstChapterWeek || !lastChapterWeek)
				return false;

			// Compare year and week number
			if (year < firstChapterWeek.year || year > lastChapterWeek.year)
				return false;
			if (
				year === firstChapterWeek.year &&
				weekNumber < firstChapterWeek.weekNumber
			)
				return false;
			if (
				year === lastChapterWeek.year &&
				weekNumber > lastChapterWeek.weekNumber
			)
				return false;

			return true;
		};

		// After processing all episodes, calculate break types for weeks with chapters
		episodesByYearAndWeek.forEach((weeksMap, year) => {
			weeksMap.forEach((weekData, weekNumber) => {
				const hasChapters = weekData.episodeNumbers.length > 0;
				// Only apply break colors if week is within the chapter range
				if (isWeekInChapterRange(year, weekNumber)) {
					weekData.breakType = getBreakType(weekNumber, entryType, hasChapters, year);
				} else {
					weekData.breakType = null;
				}
			});
		});

		// Convert to the expected structure
		const years: {
			year: number;
			weeks: {
				weekStart: Date;
				hasEpisode: boolean;
				episodeNumbers: number[];
				weekNumber: number;
				breakType: "WB" | "OB" | null;
			}[];
		}[] = [];

		// Get all years and sort them
		const sortedYears = Array.from(episodesByYearAndWeek.keys()).sort(
			(a, b) => a - b,
		);

		for (const year of sortedYears) {
			const weeksMap = episodesByYearAndWeek.get(year)!;
			const weekNumbers = Array.from(weeksMap.keys()).sort((a, b) => a - b);

			const weeks = weekNumbers.map((weekNumber) => {
				const weekData = weeksMap.get(weekNumber)!;
				weekData.episodeNumbers.sort((a, b) => a - b);
				return {
					weekStart: weekData.weekStart,
					hasEpisode: weekData.episodeNumbers.length > 0,
					episodeNumbers: weekData.episodeNumbers,
					weekNumber,
					breakType: weekData.breakType,
				};
			});

			years.push({ year, weeks });
		}

		return years;
	}, [results, entryType]);

	if (weeksByYear.length === 0) return null;

	const totalWeeks = weeksByYear.reduce((s, y) => s + y.weeks.length, 0);
	const airedWeeks = weeksByYear.reduce(
		(s, y) => s + y.weeks.filter((w) => w.hasEpisode).length,
		0,
	);

	// Find the first and last chapter weeks (only for manga)
	let firstChapterWeek: { year: number; weekNumber: number } | null = null;
	let lastChapterWeek: { year: number; weekNumber: number } | null = null;

	if (entryType === "manga" && results.length > 0) {
		const validDates = results
			.map((ep) => new Date(ep.aired))
			.filter((d) => !Number.isNaN(d.getTime()));

		if (validDates.length > 0) {
			const firstDate = new Date(
				Math.min(...validDates.map((d) => d.getTime())),
			);
			const lastDate = new Date(
				Math.max(...validDates.map((d) => d.getTime())),
			);
			const firstWeekStart = getWeekStart(firstDate);
			const lastWeekStart = getWeekStart(lastDate);

			firstChapterWeek = {
				year: getWeekYear(firstWeekStart),
				weekNumber: getWeekNumber(firstWeekStart),
			};
			lastChapterWeek = {
				year: getWeekYear(lastWeekStart),
				weekNumber: getWeekNumber(lastWeekStart),
			};
		}
	}

	// Helper function to check if a week is within the chapter range
	const isWeekInChapterRange = (year: number, weekNumber: number): boolean => {
		if (entryType !== "manga" || !firstChapterWeek || !lastChapterWeek)
			return false;

		// Compare year and week number
		if (year < firstChapterWeek.year || year > lastChapterWeek.year)
			return false;
		if (
			year === firstChapterWeek.year &&
			weekNumber < firstChapterWeek.weekNumber
		)
			return false;
		if (
			year === lastChapterWeek.year &&
			weekNumber > lastChapterWeek.weekNumber
		)
			return false;

		return true;
	};

	const boxSize = bigBoxes ? "size-8" : "size-[11px]";
	const gapClass = bigBoxes ? "gap-0.5" : "gap-[3px]";
	// Find the maximum week number across all years
	const maxWeeks = Math.max(
		...weeksByYear.flatMap((y) => y.weeks.map((w) => w.weekNumber)),
		1,
	);

	return (
		<TooltipProvider>
			<div className="mt-8">
				<h3 className="text-xl font-semibold mb-4">Weekly Airing Schedule</h3>
				{/* <p className="text-sm text-muted-foreground mb-2">
					{airedWeeks} of {totalWeeks} weeks had{" "}
					{entryType === "anime" ? "an episode air" : "a chapter publish"}
				</p> */}
				<div className="flex flex-wrap gap-4 mb-4">
					<div className="flex flex-col gap-1">
						<label htmlFor="box-size" className="text-sm text-muted-foreground">
							Box size
						</label>
						<Select
							value={bigBoxes ? "true" : "false"}
							onValueChange={(v) => setBigBoxes(v === "true")}
						>
							<SelectTrigger id="box-size">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">Large</SelectItem>
								<SelectItem value="false">Small</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{isOnePieceOnly && (
						<div className="flex flex-col gap-1">
							<label
								htmlFor="color-by-saga"
								className="text-sm text-muted-foreground"
							>
								Color
							</label>
							<Select
								value={colorBySaga ? "saga" : "default"}
								onValueChange={(v) => setColorBySaga(v === "saga")}
							>
								<SelectTrigger id="color-by-saga">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="default">Default</SelectItem>
									<SelectItem value="saga">By saga</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
				<div className="rounded-md border overflow-x-scroll overflow-y-auto" style={{ maxHeight: '80vh' }}>
					<div className="flex flex-col gap-1">
						{/* Table header: week numbers only on the first line */}
						<div className="flex items-center gap-2 sticky top-0 bg-background dark:bg-background z-50 border-b pb-1 mb-1 shadow-sm w-fit">
							<span className="w-10 shrink-0" aria-hidden />
							<div className={`flex ${gapClass}`}>
								{Array.from({ length: maxWeeks }, (_, i) => (
									<span
										key={i}
										className={cn(
											`${boxSize} flex items-center justify-center rounded-[2px] font-medium text-muted-foreground tabular-nums`,
											bigBoxes ? "text-xs" : "text-[8px]",
										)}
									>
										{i + 1}
									</span>
								))}
							</div>
							{/* Summary columns header */}
							{entryType === "manga" && (
								<div className={`flex ${gapClass} ml-2 border-l pl-2`}>
									<span className={`${boxSize} flex items-center justify-center rounded-[2px] text-xs font-medium text-muted-foreground tabular-nums`} title="Total chapters">
										Ch
									</span>
									<span className={`${boxSize} flex items-center justify-center rounded-[2px] text-xs font-medium text-muted-foreground tabular-nums`} title="Oda breaks">
										OB
									</span>
									<span className={`${boxSize} flex items-center justify-center rounded-[2px] text-xs font-medium text-muted-foreground tabular-nums`} title="Shonen Jump breaks">
										WB
									</span>
								</div>
							)}
						</div>
						{weeksByYear.map(({ year, weeks }) => {
							// Create a map of weekNumber to week data for quick lookup
							const weekMap = new Map<number, (typeof weeks)[0]>();
							weeks.forEach((week) => {
								weekMap.set(week.weekNumber, week);
							});

							// Calculate the maximum week number for this year
							const maxWeeksForYear = weeks.length > 0
								? Math.max(...weeks.map((w) => w.weekNumber))
								: 0;

							// Calculate totals for this year
							const totalChapters = weeks.filter((w) => w.hasEpisode).length;

							// Calculate OB and WB breaks - need to check all weeks, including empty ones
							// Check all weeks up to the global maximum, not just maxWeeksForYear
							let totalOB = 0;
							let totalWB = 0;
							for (let weekNum = 1; weekNum <= maxWeeks; weekNum++) {
								const week = weekMap.get(weekNum);
								if (week) {
									// Week exists in data
									if (week.breakType === "OB") totalOB++;
									if (week.breakType === "WB") totalWB++;
								} else {
									// Empty week - check if it should have a break type
									// Only count if within chapter range
									if (entryType === "manga" && isWeekInChapterRange(year, weekNum)) {
										const breakType = getBreakType(weekNum, entryType, false, year);
										if (breakType === "OB") totalOB++;
										if (breakType === "WB") totalWB++;
									}
								}
							}

							return (
								<div key={year} className="flex items-center gap-2">
									<span className="text-xs text-muted-foreground w-10 shrink-0 text-right tabular-nums">
										{year}
									</span>
									<div className={`flex ${gapClass}`}>
										{Array.from({ length: maxWeeks }, (_, i) => {
											const weekNumber = i + 1;
											const week = weekMap.get(weekNumber);

											// For week 53, if this year doesn't have week 53, render empty box
											if (weekNumber === 53 && maxWeeksForYear < 53) {
												return (
													<div
														key={weekNumber}
														className={`${boxSize} rounded-[2px] bg-gray-200 dark:bg-gray-700`}
													/>
												);
											}

											// For manga, check if this week should have a break color even if no episode
											// Empty weeks (no chapters) can be OB breaks, but only if within chapter range
											const breakTypeForWeek =
												entryType === "manga" &&
													isWeekInChapterRange(year, weekNumber)
													? getBreakType(weekNumber, entryType, false, year)
													: null;
											const breakColorForWeek = breakTypeForWeek
												? breakTypeForWeek === "WB"
													? WB_COLOR
													: OB_COLOR
												: null;

											// If no week exists at this position, render an empty box (or break color for manga)
											if (!week) {
												const emptyTooltipContent = breakTypeForWeek ? (
													<ul className="text-sm max-w-[300px]">
														<li className="label">
															No {entryType === "anime" ? "episode" : "chapter"}
														</li>
														<li className="label font-semibold">
															{breakTypeForWeek === "WB"
																? "Weekly Shonen Jump Break"
																: "Oda Break"}
														</li>
													</ul>
												) : (
													<ul className="text-sm max-w-[300px]">
														<li className="label">
															No {entryType === "anime" ? "episode" : "chapter"}
														</li>
													</ul>
												);

												return (
													<Tooltip key={weekNumber}>
														<TooltipTrigger asChild>
															<div
																className={`${boxSize} rounded-[2px] ${breakColorForWeek ? "text-white" : "bg-gray-200 dark:bg-gray-700"}`}
																style={
																	breakColorForWeek
																		? { backgroundColor: breakColorForWeek }
																		: undefined
																}
															/>
														</TooltipTrigger>
														<TooltipContent className="border border-slate-200 dark:border-gray-700 p-3 rounded-md bg-background text-sm max-w-[300px]">
															{emptyTooltipContent}
														</TooltipContent>
													</Tooltip>
												);
											}

											const sagaName =
												week.hasEpisode && week.episodeNumbers.length > 0
													? getSagaForEpisodeNumber(
														week.episodeNumbers[0],
														sagas,
													)
													: null;
											const sagaColor = sagaName
												? (sagaNameToColor.get(sagaName) ?? null)
												: null;

											// Determine box background color
											// For manga, break colors take precedence over saga colors
											let boxBg: string;
											let breakColor: string | null = null;
											if (week.breakType && entryType === "manga") {
												breakColor =
													week.breakType === "WB" ? WB_COLOR : OB_COLOR;
												boxBg = "text-white";
											} else if (!week.hasEpisode) {
												boxBg =
													"bg-gray-200 dark:bg-gray-700 text-muted-foreground";
											} else if (colorBySaga && sagaColor) {
												boxBg = "text-white";
											} else {
												boxBg = "bg-[#919191] text-white";
											}

											const episodes = week.episodeNumbers
												.map((nb) => episodeMap.get(nb))
												.filter((ep): ep is EpisodeInfos => ep != null);

											const tooltipContent = week.hasEpisode ? (
												<ul className="text-sm max-w-[300px]">
													{week.breakType && entryType === "manga" && (
														<li
															key="break-type"
															className="label font-semibold"
														>
															{week.breakType === "WB"
																? "Weekly Shonen Jump Break"
																: "Oda Break"}
														</li>
													)}
													{episodes.map((ep, idx) => {
														const arcName = getArcForEpisodeNumber(
															ep.episodeNb,
															sagas,
														);
														return (
															<>
																{idx > 0 && (
																	<li
																		key={`separator-${idx}`}
																		className="label border-t pt-1 mt-1"
																	/>
																)}
																<li
																	key={`ep-${ep.episodeNb}-num`}
																	className="label"
																>
																	•{" "}
																	{`${entryType === "anime" ? "Episode" : "Chapter"}: ${ep.episodeNb}`}
																	{ep.filler && " (filler)"}
																	{ep.recap && " (recap)"}
																</li>
																{ep.title && (
																	<li
																		key={`ep-${ep.episodeNb}-title`}
																		className="label"
																	>
																		• {`Title: ${ep.title}`}
																	</li>
																)}
																{ep.aired && (
																	<li
																		key={`ep-${ep.episodeNb}-aired`}
																		className="label"
																	>
																		•{" "}
																		{`Aired: ${new Date(ep.aired).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
																	</li>
																)}
																{ep.score != null &&
																	ep.score !== 0 && (
																		<li
																			key={`ep-${ep.episodeNb}-rating`}
																			className="label"
																		>
																			•{" "}
																			{`Score: ${ep.score.toFixed(2)}/5`}
																		</li>
																	)}
																{ep.ratingFiveStars != null && ep.nbOfVotes && (
																	<li
																		key={`ep-${ep.episodeNb}-5star`}
																		className="label"
																	>
																		•{" "}
																		{`5☆ rating: ${ep.ratingFiveStars.toFixed(1)}%`}
																	</li>
																)}
																{ep.nbOfVotes && (
																	<li
																		key={`ep-${ep.episodeNb}-votes`}
																		className="label"
																	>
																		•{" "}
																		{`# of votes: ${ep.nbOfVotes.toLocaleString("en-US")}`}
																	</li>
																)}
																{sagaName && isOnePieceOnly && (
																	<li
																		key={`ep-${ep.episodeNb}-saga`}
																		className="label"
																	>
																		• {`Saga: ${sagaName}`}
																	</li>
																)}
																{arcName && isOnePieceOnly && (
																	<li
																		key={`ep-${ep.episodeNb}-arc`}
																		className="label"
																	>
																		• {`Arc: ${arcName}`}
																	</li>
																)}
															</>
														);
													})}
												</ul>
											) : (
												<ul className="text-sm max-w-[300px]">
													<li className="label">
														No {entryType === "anime" ? "episode" : "chapter"}
													</li>
													{week.breakType && entryType === "manga" && (
														<li className="label font-semibold">
															{week.breakType === "WB"
																? "Weekly Shonen Jump Break"
																: "Oda Break"}
														</li>
													)}
												</ul>
											);

											return (
												<Tooltip key={week.weekStart.getTime()} useTouch={true}>
													<TooltipTrigger asChild>
														<div
															className={`${boxSize} rounded-[2px] flex items-center justify-center text-[10px] font-medium tabular-nums ${boxBg} ${bigBoxes ? "min-w-8" : ""}`}
															style={
																breakColor
																	? { backgroundColor: breakColor }
																	: colorBySaga && week.hasEpisode && sagaColor
																		? { backgroundColor: sagaColor }
																		: undefined
															}
														>
															{bigBoxes && week.episodeNumbers.length > 0 ? (
																week.episodeNumbers.length > 2 ? (
																	`${week.episodeNumbers[0]}-${week.episodeNumbers.at(-1)}`
																) : week.episodeNumbers.length > 1 ? (
																	<>
																		{week.episodeNumbers[0]}
																		<br />
																		{week.episodeNumbers[1]}
																	</>
																) : (
																	week.episodeNumbers[0]
																)
															) : null}
														</div>
													</TooltipTrigger>
													<TooltipContent className="border border-slate-200 dark:border-gray-700 p-3 rounded-md bg-background text-sm max-w-[300px]">
														{tooltipContent}
													</TooltipContent>
												</Tooltip>
											);
										})}
									</div>
									{/* Summary columns */}
									{entryType === "manga" && isOnePieceOnly && (
										<div className={`flex ${gapClass} ml-2 border-l pl-2`}>
											<div className={`${boxSize} flex items-center justify-center rounded-[2px] text-xs font-medium bg-gray-100 dark:bg-gray-800 text-muted-foreground tabular-nums`}>
												{totalChapters}
											</div>
											<div className={`${boxSize} flex items-center justify-center rounded-[2px] text-xs font-medium bg-gray-100 dark:bg-gray-800 text-muted-foreground tabular-nums`}>
												{totalOB}
											</div>
											<div className={`${boxSize} flex items-center justify-center rounded-[2px] text-xs font-medium bg-gray-100 dark:bg-gray-800 text-muted-foreground tabular-nums`}>
												{/* remove 1 for some unknown reason */}
												{totalWB - 1}
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-3 mt-6 text-xs text-muted-foreground">
					{colorBySaga ? (
						<>
							{sagas.map((s) => (
								<div key={s.saga} className="flex items-center gap-1.5">
									<div
										className="size-[11px] rounded-[2px] shrink-0"
										style={{
											backgroundColor: sagaNameToColor.get(s.saga) ?? "#94a3b8",
										}}
									/>
									<span>{s.saga}</span>
								</div>
							))}
							{entryType === "anime" && (
								<div className="flex items-center gap-1.5">
									<div className="size-[11px] rounded-[2px] bg-[#919191]" />
									<span>Special/Recap</span>
								</div>
							)}
							{entryType === "manga" && isOnePieceOnly && (
								<>
									<div className="flex items-center gap-1.5">
										<div
											className="size-[11px] rounded-[2px] shrink-0"
											style={{ backgroundColor: WB_COLOR }}
										/>
										<span>Weekly Shonen Jump Break</span>
									</div>
									<div className="flex items-center gap-1.5">
										<div
											className="size-[11px] rounded-[2px] shrink-0"
											style={{ backgroundColor: OB_COLOR }}
										/>
										<span>Oda Break</span>
									</div>
								</>
							)}
							<div className="flex items-center gap-1.5">
								<div className="size-[11px] rounded-[2px] bg-gray-200 dark:bg-gray-700" />
								<span>No {entryType === "anime" ? "episode" : "chapter"}</span>
							</div>
						</>
					) : (
						<>
							<div className="flex items-center gap-1.5">
								<div className="size-[11px] rounded-[2px] bg-emerald-500 dark:bg-emerald-400" />
								<span>Aired</span>
							</div>
							{entryType === "manga" && isOnePieceOnly && (
								<>
									<div className="flex items-center gap-1.5">
										<div
											className="size-[11px] rounded-[2px] shrink-0"
											style={{ backgroundColor: WB_COLOR }}
										/>
										<span>Weekly Shonen Jump Break</span>
									</div>
									<div className="flex items-center gap-1.5">
										<div
											className="size-[11px] rounded-[2px] shrink-0"
											style={{ backgroundColor: OB_COLOR }}
										/>
										<span>Oda Break</span>
									</div>
								</>
							)}
							<div className="flex items-center gap-1.5">
								<div className="size-[11px] rounded-[2px] bg-gray-200 dark:bg-gray-700" />
								<span>No {entryType === "anime" ? "episode" : "chapter"}</span>
							</div>
						</>
					)}
				</div>
			</div>
		</TooltipProvider>
	);
}
