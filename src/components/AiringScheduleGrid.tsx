import { useMemo, useState } from "react";
import { onePieceSagasEpisodes } from "@/components/OnePieceOnly/utils";
import { onePieceSagasChapters } from "@/components/OnePieceOnly/utils2";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { EntryType, EpisodeInfos } from "@/types/All";

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

function getWeekStart(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() - d.getDay());
	return d;
}

type SagaItem = { saga: string; story_arcs: { episodesOrChapters: string }[] };

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

export default function AiringScheduleGrid({
	results,
	entryType,
}: {
	results: EpisodeInfos[];
	entryType: EntryType;
}) {
	const [bigBoxes, setBigBoxes] = useState(false);
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

	const weeksByYear = useMemo(() => {
		const validDates = results
			.map((ep) => new Date(ep.aired))
			.filter((d) => !Number.isNaN(d.getTime()));

		if (validDates.length === 0) return [];

		const minDate = getWeekStart(
			new Date(Math.min(...validDates.map((d) => d.getTime()))),
		);
		const maxDate = getWeekStart(
			new Date(Math.max(...validDates.map((d) => d.getTime()))),
		);

		const years: {
			year: number;
			weeks: {
				weekStart: Date;
				hasEpisode: boolean;
				episodeNumbers: number[];
			}[];
		}[] = [];

		const cursor = new Date(minDate);
		let currentYear = cursor.getFullYear();
		let currentWeeks: {
			weekStart: Date;
			hasEpisode: boolean;
			episodeNumbers: number[];
		}[] = [];

		while (cursor <= maxDate) {
			const year = cursor.getFullYear();
			if (year !== currentYear) {
				years.push({ year: currentYear, weeks: currentWeeks });
				currentYear = year;
				currentWeeks = [];
			}
			const weekStartTime = cursor.getTime();
			const weekEnd = new Date(cursor);
			weekEnd.setDate(weekEnd.getDate() + 6);
			weekEnd.setHours(23, 59, 59, 999);
			const episodesInWeek = results.filter((ep) => {
				const d = new Date(ep.aired);
				if (Number.isNaN(d.getTime())) return false;
				return d >= cursor && d <= weekEnd;
			});
			const episodeNumbers = episodesInWeek
				.map((ep) => ep.episodeNb)
				.filter((n): n is number => n != null)
				.sort((a, b) => a - b);

			currentWeeks.push({
				weekStart: new Date(cursor),
				hasEpisode: episodeNumbers.length > 0,
				episodeNumbers,
			});
			cursor.setDate(cursor.getDate() + 7);
		}
		if (currentWeeks.length > 0) {
			years.push({ year: currentYear, weeks: currentWeeks });
		}

		return years;
	}, [results]);

	if (weeksByYear.length === 0) return null;

	const totalWeeks = weeksByYear.reduce((s, y) => s + y.weeks.length, 0);
	const airedWeeks = weeksByYear.reduce(
		(s, y) => s + y.weeks.filter((w) => w.hasEpisode).length,
		0,
	);

	const boxSize = bigBoxes ? "size-8" : "size-[11px]";
	const gapClass = bigBoxes ? "gap-0.5" : "gap-[3px]";
	const maxWeeks = Math.max(...weeksByYear.map((y) => y.weeks.length), 1);

	return (
		<div className="mt-8">
			<h3 className="text-xl font-semibold mb-1">Airing schedule</h3>
			<p className="text-sm text-muted-foreground mb-2">
				{airedWeeks} of {totalWeeks} weeks had{" "}
				{entryType === "anime" ? "an episode" : "a chapter"} air
			</p>
			<div className="flex flex-wrap gap-4 mb-4">
				<div className="flex flex-col gap-1">
					<label htmlFor="box-size" className="text-sm text-muted-foreground">
						Box size
					</label>
					<Select
						value={bigBoxes ? "true" : "false"}
						onValueChange={(v) => setBigBoxes(v === "true")}
					>
						<SelectTrigger id="box-size" className="w-[200px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="false">Small</SelectItem>
							<SelectItem value="true">Large (with ep./ch. number)</SelectItem>
						</SelectContent>
					</Select>
				</div>
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
						<SelectTrigger id="color-by-saga" className="w-[200px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="default">Aired / No episode</SelectItem>
							<SelectItem value="saga">By saga</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="flex flex-col gap-3">
				{/* Table header: week numbers only on the first line */}
				<div className="flex items-center gap-2">
					<span className="w-10 shrink-0" aria-hidden />
					<div className={`flex ${gapClass}`}>
						{Array.from({ length: maxWeeks }, (_, i) => (
							<span
								key={i}
								className={`${boxSize} flex items-center justify-center rounded-[2px] text-xs font-medium text-muted-foreground tabular-nums`}
							>
								{i + 1}
							</span>
						))}
					</div>
				</div>
				{weeksByYear.map(({ year, weeks }) => (
					<div key={year} className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground w-10 shrink-0 text-right tabular-nums">
							{year}
						</span>
						<div className={`flex ${gapClass}`}>
							{weeks.map((week) => {
								const sagaName =
									week.hasEpisode && week.episodeNumbers.length > 0
										? getSagaForEpisodeNumber(week.episodeNumbers[0], sagas)
										: null;
								const sagaColor = sagaName
									? (sagaNameToColor.get(sagaName) ?? null)
									: null;
								const boxBg = !week.hasEpisode
									? "bg-gray-200 dark:bg-gray-700 text-muted-foreground"
									: colorBySaga && sagaColor
										? "text-white"
										: "bg-[#919191] text-white";
								return (
									<div
										key={week.weekStart.getTime()}
										className={`${boxSize} rounded-[2px] flex items-center justify-center text-[10px] font-medium tabular-nums ${boxBg} ${bigBoxes ? "min-w-8" : ""}`}
										style={
											colorBySaga && week.hasEpisode && sagaColor
												? { backgroundColor: sagaColor }
												: undefined
										}
										title={`Week of ${week.weekStart.toLocaleDateString()}${week.hasEpisode ? ` — ${sagaName ? `${sagaName}, ` : ""}${entryType === "anime" ? "Ep" : "Ch"} ${week.episodeNumbers.join(", ")}` : ""}`}
									>
										{bigBoxes && week.episodeNumbers.length > 0
											? week.episodeNumbers.length > 2
												? `${week.episodeNumbers[0]}-${week.episodeNumbers.at(-1)}`
												: week.episodeNumbers.length > 1
													? (
														<>
															{week.episodeNumbers[0]}
															<br />
															{week.episodeNumbers[1]}
														</>
													)
													: week.episodeNumbers[0]
											: null}
									</div>
								);
							})}
						</div>
					</div>
				))}
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
						<div className="flex items-center gap-1.5">
							<div className="size-[11px] rounded-[2px] bg-gray-200 dark:bg-gray-700" />
							<span>No {entryType === "anime" ? "episode" : "chapter"}</span>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
