import type React from "react";
import { useMemo, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type AnimeItem,
	type CurrentSeason,
	getEpisodeOfWeekNumber,
} from "@/components/WeeklyRatings";

// Helper function to get the start month of a season
// export const getSeasonStartMonth = (season: string): number => {
// 	switch (season.toLowerCase()) {
// 		case "winter":
// 			return 0 // January
// 		case "spring":
// 			return 3 // April
// 		case "summer":
// 			return 6 // July
// 		case "fall":
// 			return 9 // October
// 		default:
// 			return 0
// 	}
// }

// Helper function to get the week number within the season
const getWeekNumber = (date: Date, seasonStart: Date): number => {
	const diffTime = date.getTime() - seasonStart.getTime(); // Calculate the difference in time
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
	return Math.floor(diffDays / 7) + 1; // Calculate week number (1-based)
};
// const getWeekNumber = (date: Date, seasonStart: Date): number => {
// 	const diffTime = Math.abs(date.getTime() - seasonStart.getTime())
// 	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
// 	return Math.floor(diffDays / 7) + 1
// }

// Fixed array of 30 colors
// biome-ignore format: <explanation>
const fixedColors = [
	"#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
	"#F06292", "#AED581", "#FFD54F", "#4DB6AC", "#7986CB",
	"#9575CD", "#4DD0E1", "#81C784", "#DCE775", "#FFB74D",
	"#F06292", "#BA68C8", "#4FC3F7", "#4DB6AC", "#FFF176",
	"#FF8A65", "#A1887F", "#90A4AE", "#E57373", "#F06292",
	"#BA68C8", "#9575CD", "#7986CB", "#64B5F6", "#4FC3F7"
]

function addDaysToDate(date: Date, days: number): Date {
	const result = new Date(date); // Create a new date object to avoid mutating the original
	result.setDate(result.getDate() + days); // Add the specified number of days
	return result; // Return the new date
}

export const getSeasonStartDate = (
	currentSeason: CurrentSeason,
	weeks: string[],
	firstWeekFall2024: string,
): { startDate: Date; endDate: Date } | null => {
	const DAYS_IN_SEASON_MINUS_ONE = 90;
	const WEEKS_IN_SEASON = 13;
	const SEASONS = ["winter", "spring", "summer", "fall"] as const;

	// Find index of Fall 2024 reference week
	const firstWeekIndex = weeks.findIndex((week) => week === firstWeekFall2024);
	const seasonIndex = SEASONS.indexOf(
		currentSeason.season.toLowerCase() as (typeof SEASONS)[number],
	);

	if (seasonIndex === -1) return null;

	const seasonOffset =
		(currentSeason.year - 2024) * 4 + seasonIndex - SEASONS.indexOf("fall");
	const weekIndex = firstWeekIndex - seasonOffset * WEEKS_IN_SEASON;

	if (weekIndex < 0 || weekIndex >= weeks.length) return null;

	const [startDate] = weeks[weekIndex].split(" - ");

	const seasonStartDate = new Date(startDate);

	return {
		startDate: seasonStartDate,
		endDate: addDaysToDate(seasonStartDate, DAYS_IN_SEASON_MINUS_ONE),
	};
};

// New function to prepare data for the weekly score chart
const prepareWeeklyScoreData = (
	animeList: AnimeItem[],
	currentSeason: CurrentSeason,
	currentWeekIndex: number,
	weeks: string[],
	firstWeekFall2024: string,
) => {
	// const getFirstWeekIndex = (): number => {
	// 	const firstWeekFall2024 = "9/27/2024 - 10/3/2024" // First week of Fall 2024
	// 	return weeks.findIndex(week => week === firstWeekFall2024)
	// }

	// const indexDifferenceFromFirstWeek = getFirstWeekIndex() - currentWeekIndex // Calculate the index difference
	// console.log({ indexDifferenceFromFirstWeek })

	// const getFirstWeekOfSeason = ({ year, season }: { year: number; season: string }): { targetIndex: number; week: string } | null => {
	// 	const seasonOrder = ["winter", "spring", "summer", "fall"]
	// 	const firstWeekFall2024Index = getFirstWeekIndex() // Get the index of the first week of Fall 2024

	// 	// Get the index of the target season
	// 	const targetSeasonIndex = seasonOrder.indexOf(season.toLowerCase())

	// 	if (targetSeasonIndex === -1) return null // Return null if the season is invalid

	// 	// Calculate the difference in seasons
	// 	// Fall 2024 is our reference point, so we need to calculate backwards from there
	// 	const seasonDifference = (year - 2024) * 4 + targetSeasonIndex - seasonOrder.indexOf("fall")

	// 	// Each season is 13 weeks, and we need to go backwards from Fall 2024
	// 	const targetIndex = firstWeekFall2024Index - seasonDifference * 13

	// 	// Ensure the target index is within bounds
	// 	if (targetIndex < 0 || targetIndex >= weeks.length) return null

	// 	return { targetIndex, week: weeks[targetIndex] }
	// }

	// const firstWeekOfSeason = getFirstWeekOfSeason({ year: currentSeason.year, season: currentSeason.season })?.week.split(" - ")[0]
	// const seasonStartDate = new Date(firstWeekOfSeason)
	// const seasonEndDate = new Date(seasonStartDate.getTime() + (91 * 24 * 60 * 60 * 1000)) // 91 is the number of days in a season

	// const FIRST_WEEK_FALL_2024 = "9/27/2024 - 10/3/2024"
	// const DAYS_IN_SEASON = 91
	// const WEEKS_IN_SEASON = 13
	// const SEASONS = ["winter", "spring", "summer", "fall"] as const

	// // Find index of Fall 2024 reference week
	// const firstWeekIndex = weeks.findIndex(week => week === FIRST_WEEK_FALL_2024)

	// Calculate season start date
	const seasonStartDate =
		getSeasonStartDate(currentSeason, weeks, firstWeekFall2024)?.startDate ||
		new Date();
	const seasonEndDate =
		getSeasonStartDate(currentSeason, weeks, firstWeekFall2024)?.endDate ||
		new Date();

	// console.log("seasonStartDate", seasonStartDate)
	// console.log("seasonEndDate", seasonEndDate)

	// const seasonStartDate = getSeasonStartDate(currentSeason, weeks) || new Date()
	// const seasonEndDate = new Date(seasonStartDate.getTime() + (DAYS_IN_SEASON * 24 * 60 * 60 * 1000))

	return animeList.map((anime) => {
		const weeklyScores: { [week: string]: number | null } = {};
		const episodesNumbers: (number | null)[] = Array(13).fill(null); // Initialize an array to hold episode numbers for 13 weeks

		anime.episodeData?.forEach((episode) => {
			const airedDate = new Date(episode.aired);
			if (airedDate >= seasonStartDate && airedDate <= seasonEndDate) {
				const weekNumber = getWeekNumber(airedDate, seasonStartDate);
				weeklyScores[`Week ${weekNumber}`] = episode.score || null;
				// episodesNumbers[weekNumber - 1] = episode.mal_id // Store episode ID at the correct week index (0-based)
				episodesNumbers[weekNumber - 1] = getEpisodeOfWeekNumber(
					anime.episodeData || [],
					episode || null,
				) as number;
			}
		});

		return {
			title: anime.title,
			scores: weeklyScores,
			episodesNumbers: episodesNumbers,
		};
	});
};

const WeeklyScoreChart: React.FC<{
	animeList: AnimeItem[];
	currentSeason: CurrentSeason;
	currentWeekIndex: number;
	weeksFromParent: string[];
	firstWeekFall2024: string;
}> = ({
	animeList,
	currentSeason,
	currentWeekIndex,
	weeksFromParent,
	firstWeekFall2024,
}) => {
		const data = prepareWeeklyScoreData(
			animeList,
			currentSeason,
			currentWeekIndex,
			weeksFromParent,
			firstWeekFall2024,
		);
		const [activeAnime, setActiveAnime] = useState<string | null>(null);
		const [selectedAnime, setSelectedAnime] = useState<string>("all");
		const [connectNulls, setConnectNulls] = useState<boolean>(false);
		const weeks = Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`);
		const chartData = weeks.map((week) => {
			const weekData: { [key: string]: number | string | null } = { week };
			data.forEach((anime) => {
				weekData[anime.title] = anime.scores[week] ?? null;
			});
			return weekData;
		});

		interface TooltipPayload {
			dataKey: string;
			name: string;
			value: number | null;
			payload: {
				week: string;
				[key: string]: number | string | null;
			};
			color: string;
		}

		const CustomTooltip = ({
			active,
			payload,
		}: {
			active?: boolean;
			payload?: TooltipPayload[];
		}) => {
			if (active && payload && payload.length) {
				const week = payload[0].payload.week;
				const weekNumber = Number.parseInt(week.split(" ")[1]);

				return (
					<div className="bg-background border border-border p-2 rounded shadow-sm">
						<p className="font-bold mb-2">{week}</p>
						{payload.map((entry, index) => {
							if (entry.value !== null) {
								const anime = data.find((a) => a.title === entry.name);
								// console.log(anime?.episodesNumbers)
								const episodeNumber = anime?.episodesNumbers?.[weekNumber - 1];
								return (
									<p key={index} className="text-sm">
										<span style={{ color: entry.color }}>{entry.name}</span>:{" "}
										{entry.value}
										{episodeNumber && (
											<span className="text-muted-foreground ml-1">
												(Episode {episodeNumber})
											</span>
										)}
									</p>
								);
							}
							return null;
						})}
					</div>
				);
			}
			return null;
		};

		// const getEpisodeOfWeek = (anime: AnimeItem, weekIndex: number) => {
		// 	const currentWeek = weeks[weekIndex]
		// 	const [startDate, endDate] = currentWeek.split(" - ").map(date => {
		// 		const [month, day, year] = date.split("/")
		// 		const dateObj = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
		// 		dateObj.setUTCHours(0, 0, 0, 0)
		// 		return dateObj
		// 	})
		// 	return anime?.episodeData?.find(ep => {
		// 		if (!ep.aired) return false
		// 		const airedDate = new Date(ep.aired)
		// 		airedDate.setUTCHours(0, 0, 0, 0)
		// 		return airedDate >= startDate && airedDate <= endDate
		// 	})
		// }

		// // Prepare data for the LineChart
		// const chartData = weeks.map((week, index) => {
		// 	const weekData: { [key: string]: number | string } = { week }
		// 	data.forEach(anime => {
		// 		// Use currentWeekIndex to filter scores for the current week
		// 		const episode = getEpisodeOfWeek(anime, currentWeekIndex, weeks) // Get the episode for the current week
		// 		weekData[anime.title] = episode ? episode.score : null // Use episode score if available
		// 	})
		// 	return weekData
		// })

		// const chartData2 = weeks.map(week => {
		// 	const weekData: { [key: string]: number | string } = { week }
		// 	data.forEach((anime, index) => {
		// 		const weekStartDate = new Date(currentSeason.year, getSeasonStartMonth(currentSeason.season), 1);
		// 		weekStartDate.setDate(weekStartDate.getDate() + (index * 7)); // Calculate the start date of the week
		// 		const formattedDate = `${(weekStartDate.getMonth() + 1).toString().padStart(2, '0')}/${weekStartDate.getDate().toString().padStart(2, '0')}/${weekStartDate.getFullYear()}`; // Format as month/day/year
		// 		weekData[anime.title] = anime.scores[week] ?? null; // Keep the week label as is
		// 		weekData[`${anime.title} Date`] = formattedDate; // Add formatted date for each anime
		// 	})
		// 	return weekData
		// })

		const chartConfig: ChartConfig = useMemo(() => {
			const config: ChartConfig = {
				week: {
					label: "Week",
					color: "hsl(var(--chart-1))",
				},
			};
			data.forEach((anime, index) => {
				config[anime.title] = {
					label: anime.title,
					color: fixedColors[index % fixedColors.length],
				};
			});
			return config;
		}, [data]);

		const handleMouseEnter = (o: { dataKey: string | number }) => {
			setActiveAnime(o.dataKey as string);
		};

		const handleMouseLeave = () => {
			setActiveAnime(null);
		};

		const handleSelectChange = (value: string) => {
			setSelectedAnime(value);
		};

		return (
			<div className="mt-10 space-y-4 border-t border-gray-200 pt-6">
				<div className="flex flex-row gap-4 items-center">
					<Select onValueChange={handleSelectChange} defaultValue="all">
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Select anime" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Anime</SelectItem>
							{data.map((anime) => (
								<SelectItem key={anime.title} value={anime.title}>
									{anime.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						onValueChange={(value) => setConnectNulls(value === "true")}
						defaultValue="false"
					>
						<SelectTrigger>
							<SelectValue placeholder="Connect Nulls" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="true">Connect Nulls</SelectItem>
							<SelectItem value="false">Do Not Connect Nulls</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<ChartContainer config={chartConfig} className="max-md:h-[400px] md:min-h-[400px] max-md:aspect-auto!">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={chartData}
							margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="week" />
							<YAxis label={{ value: "Score (/10)", angle: -90, position: "insideLeft", offset: 0 }} domain={["dataMin", "dataMax"]} />
							<Tooltip content={<CustomTooltip />} />
							{data.map((anime, index) => (
								<Line
									key={anime.title}
									type="monotone"
									dataKey={anime.title}
									stroke={fixedColors[index % fixedColors.length]}
									strokeWidth={
										selectedAnime === "all"
											? activeAnime
												? activeAnime === anime.title
													? 4
													: 0.5
												: 2
											: selectedAnime === anime.title
												? 4
												: 0
									}
									dot={
										selectedAnime === "all" || selectedAnime === anime.title
											? { fill: fixedColors[index % fixedColors.length], r: 2 }
											: false
									}
									// dot={false}
									activeDot={{ r: 4 }}
									connectNulls={connectNulls}
								// hide={selectedAnime !== "all" && selectedAnime !== anime.title}
								/>
							))}
							<Legend
								onMouseEnter={(o) =>
									handleMouseEnter(o as { dataKey: string | number })
								}
								onMouseLeave={handleMouseLeave}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</div>
		);
	};

export default WeeklyScoreChart;
