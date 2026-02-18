import { useMemo } from "react";
import type { EntryType, EpisodeInfos } from "@/types/All";

function getWeekStart(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() - d.getDay());
	return d;
}

export default function AiringScheduleGrid({
	results,
	entryType,
}: {
	results: EpisodeInfos[];
	entryType: EntryType;
}) {
	const weeksByYear = useMemo(() => {
		const validDates = results
			.map((ep) => new Date(ep.aired))
			.filter((d) => !Number.isNaN(d.getTime()));

		if (validDates.length === 0) return [];

		const airedWeeks = new Set(
			results
				.map((ep) => {
					const d = new Date(ep.aired);
					if (Number.isNaN(d.getTime())) return null;
					return getWeekStart(d).getTime();
				})
				.filter((t): t is number => t !== null),
		);

		const minDate = getWeekStart(
			new Date(Math.min(...validDates.map((d) => d.getTime()))),
		);
		const maxDate = getWeekStart(
			new Date(Math.max(...validDates.map((d) => d.getTime()))),
		);

		const years: {
			year: number;
			weeks: { weekStart: Date; hasEpisode: boolean }[];
		}[] = [];

		const cursor = new Date(minDate);
		let currentYear = cursor.getFullYear();
		let currentWeeks: { weekStart: Date; hasEpisode: boolean }[] = [];

		while (cursor <= maxDate) {
			const year = cursor.getFullYear();
			if (year !== currentYear) {
				years.push({ year: currentYear, weeks: currentWeeks });
				currentYear = year;
				currentWeeks = [];
			}
			currentWeeks.push({
				weekStart: new Date(cursor),
				hasEpisode: airedWeeks.has(cursor.getTime()),
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

	return (
		<div className="mt-8">
			<h3 className="text-xl font-semibold mb-1">Airing schedule</h3>
			<p className="text-sm text-muted-foreground mb-4">
				{airedWeeks} of {totalWeeks} weeks had{" "}
				{entryType === "anime" ? "an episode" : "a chapter"} air
			</p>
			<div className="flex flex-col gap-3">
				{weeksByYear.map(({ year, weeks }) => (
					<div key={year} className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground w-10 shrink-0 text-right tabular-nums">
							{year}
						</span>
						<div className="flex flex-wrap gap-[3px]">
							{weeks.map((week) => (
								<div
									key={week.weekStart.getTime()}
									className={`size-[11px] rounded-[2px] ${
										week.hasEpisode
											? "bg-emerald-500 dark:bg-emerald-400"
											: "bg-gray-200 dark:bg-gray-700"
									}`}
									title={`Week of ${week.weekStart.toLocaleDateString()}${week.hasEpisode ? " — aired" : ""}`}
								/>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
				<div className="flex items-center gap-1.5">
					<div className="size-[11px] rounded-[2px] bg-emerald-500 dark:bg-emerald-400" />
					<span>Aired</span>
				</div>
				<div className="flex items-center gap-1.5">
					<div className="size-[11px] rounded-[2px] bg-gray-200 dark:bg-gray-700" />
					<span>No {entryType === "anime" ? "episode" : "chapter"}</span>
				</div>
			</div>
		</div>
	);
}
