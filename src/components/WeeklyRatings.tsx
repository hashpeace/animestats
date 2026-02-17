import axios from "axios";
import { ChartLine, LoaderCircle, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import WeeklyScoreChart, {
	getSeasonStartDate,
} from "@/components/WeeklyRatings/WeeklyScoreChart";
export interface AnimeItem {
	mal_id: number;
	url: string;
	images: {
		webp: {
			image_url: string;
		};
	};
	image_url: string;
	title: string;
	type: string;
	episodes: number;
	aired: {
		from: string;
	};
	air_date: string;
	score: number;
	season: string;
	year: number;
	members: number;
	episodeData?: Array<{
		mal_id: number;
		title: string;
		aired: string;
		score: number;
		forum_url: string;
		isAiredDateEstimated?: boolean;
	}>;
}

export interface Season {
	year: number;
	seasons: string[];
}
export interface CurrentSeason {
	year: number;
	season: string;
}
export const getEpisodeOfWeekNumber = (
	episodeData: AnimeItem["episodeData"],
	thisWeekEpisode: { mal_id: number } | null,
): string | number => {
	let epOfWeekNb: string | number = "";
	if (episodeData && episodeData.length > 1) {
		// Group episodes by aired date
		const episodeGroups = episodeData.reduce(
			(groups: { [key: string]: number[] }, ep) => {
				const airedDate = ep.aired || "unknown";
				if (!groups[airedDate]) {
					groups[airedDate] = [];
				}
				groups[airedDate].push(ep.mal_id);
				return groups;
			},
			{},
		);

		// Find which group contains the current episode
		const currentEpGroup = Object.entries(episodeGroups).find(([_, epIds]) =>
			epIds.includes(thisWeekEpisode?.mal_id || -1),
		);

		if (currentEpGroup && currentEpGroup[1].length > 1) {
			// If current episode is part of a group with >1 episodes, show range
			const firstEp = Math.min(...currentEpGroup[1]);
			const lastEp = Math.max(...currentEpGroup[1]);
			epOfWeekNb = `${firstEp}-${lastEp}`;
		} else {
			// Otherwise show single episode number
			epOfWeekNb = thisWeekEpisode?.mal_id || "N/A";
		}
	} else {
		epOfWeekNb = thisWeekEpisode?.mal_id || "N/A";
	}
	return epOfWeekNb;
};

export const fourSeasonsOrder = ["winter", "spring", "summer", "fall"];
// export const WEEK_START_MODE: "sunday" | "thursday" = "thursday"
const NUMBER_OF_YEARS_BACK_ALLOWED = 15;

// Utility function to get current anime season based on date
export const getCurrentAnimeSeason = (): CurrentSeason => {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth(); // 0-11
	let seasonIndex: number;
	const year = currentYear;

	if (currentMonth >= 0 && currentMonth <= 2) {
		// January-March: Winter season
		seasonIndex = 0; // winter
	} else if (currentMonth >= 3 && currentMonth <= 5) {
		// April-June: Spring season
		seasonIndex = 1; // spring
	} else if (currentMonth >= 6 && currentMonth <= 8) {
		// July-September: Summer season
		seasonIndex = 2; // summer
	} else if (currentMonth >= 9 && currentMonth <= 11) {
		// September-November: Fall season
		seasonIndex = 3; // fall
	} else {
		seasonIndex = 0; // winter
	}
	// } else {
	// 	// December: Winter season of next year
	// 	seasonIndex = 0 // winter
	// 	year = currentYear + 1
	// }

	return {
		year,
		season: fourSeasonsOrder[seasonIndex],
	};
};

export default function WeeklyRatings() {
	const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [fetchingAnime, setFetchingAnime] = useState(false);
	const [error, setError] = useState("");
	const [currentSeason, setCurrentSeason] = useState<CurrentSeason>(
		getCurrentAnimeSeason(),
	);
	const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
	const [weeks, setWeeks] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<string>("animeScore");
	const [showAdditionalInfo, setShowAdditionalInfo] = useState<string[]>([
		"minimal",
	]);
	const [minScore, setMinScore] = useState<number>(7.5);
	const [minMembers, setMinMembers] = useState<number>(30000);
	const [showMoreDialog, setShowMoreDialog] = useState(false);
	const [weekStartMode, setWeekStartMode] = useState<"sunday" | "friday">(
		"sunday",
	);
	const [animeTypeFilter, setAnimeTypeFilter] = useState<
		"tv" | "tv_and_continuing" | "tv_and_ona"
	>("tv_and_continuing");

	const FIRST_WEEK_FALL_2024 = {
		sunday: "9/29/2024 - 10/5/2024",
		friday: "9/27/2024 - 10/3/2024",
	}[weekStartMode];

	const generateWeeks = () => {
		const weeksArray: string[] = [];

		// Get today's date
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Find the start date for the current week based on weekStartMode
		const currentDay = today.getDay(); // 0 = Sunday, 4 = Thursday

		let currentWeekStart: Date;

		if (weekStartMode === "friday") {
			// Calculate days to go back to reach Friday
			// If today is Saturday (6), Sunday (0), Monday (1), Tuesday (2), Wednesday (3), or Thursday (4),
			// we need to go back to the previous Friday (5)
			// If today is Friday (5), we're already on the start of the week
			const daysToFriday = currentDay >= 5 ? currentDay - 5 : currentDay + 2;
			currentWeekStart = new Date(today);
			currentWeekStart.setDate(today.getDate() - daysToFriday);
		} else {
			// Sunday mode
			// Calculate days to go back to reach Sunday
			// If today is Monday (1) through Saturday (6), go back to the previous Sunday (0)
			// If today is Sunday (0), we're already on the start of the week
			const daysToSunday = currentDay === 0 ? 0 : currentDay;
			currentWeekStart = new Date(today);
			currentWeekStart.setDate(today.getDate() - daysToSunday);
		}

		// Generate weeks starting from current week
		// Generate 260 weeks (5 years worth of weeks)
		for (let i = 0; i < 52 * NUMBER_OF_YEARS_BACK_ALLOWED; i++) {
			const weekStart = new Date(currentWeekStart);
			weekStart.setDate(currentWeekStart.getDate() - i * 7);

			// Skip if week start is after today
			if (weekStart > today) {
				continue;
			}

			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekStart.getDate() + 6); // Add 6 days to get the end of the week

			weeksArray.push(
				`${weekStart.toLocaleDateString("en-US")} - ${weekEnd.toLocaleDateString("en-US")}`,
			);
		}

		setWeeks(weeksArray);
	};

	const handleNextWeek = () => {
		if (currentWeekIndex < weeks.length - 1) {
			setCurrentWeekIndex(currentWeekIndex + 1);
		}
	};

	const handlePreviousWeek = () => {
		if (currentWeekIndex > 0) {
			setCurrentWeekIndex(currentWeekIndex - 1);
		}
	};

	const getFirstWeekIndex = (): number => {
		return weeks.findIndex((week) => week === FIRST_WEEK_FALL_2024);
	};

	// console.log(weeks)

	const getFirstWeekOfSeason = ({
		year,
		season,
	}: {
		year: number;
		season: string;
	}): { targetIndex: number; week: string } | null => {
		// Find the reference week index (first week of Fall 2024)
		const referenceWeekIndex = getFirstWeekIndex();
		if (referenceWeekIndex === -1) {
			console.error("Reference week not found in weeks array");
			return null;
		}

		// Get the index of the target season in the seasons array
		const normalizedSeason = season.toLowerCase();
		const targetSeasonIndex = fourSeasonsOrder.indexOf(normalizedSeason);
		if (targetSeasonIndex === -1) {
			console.error(`Invalid season: ${season}`);
			return null;
		}

		// Fall 2024 is our reference point
		const referenceYear = 2024;
		const referenceSeason = "fall";
		const referenceSeasonIndex = fourSeasonsOrder.indexOf(referenceSeason);

		// Calculate total seasons from Fall 2024 to target season
		// Note: seasons progress as winter->spring->summer->fall within a year
		let totalSeasonsDiff = 0;

		if (year === referenceYear) {
			// Same year - simple difference
			totalSeasonsDiff = targetSeasonIndex - referenceSeasonIndex;
		} else if (year > referenceYear) {
			// Future year
			const yearsAhead = year - referenceYear;
			// From fall 2024 to end of 2024: 4 - 3 = 1 season (winter 2025)
			// Then full years: yearsAhead - 1 years * 4 seasons each
			// Then from start of target year to target season: targetSeasonIndex seasons
			totalSeasonsDiff =
				4 - referenceSeasonIndex + (yearsAhead - 1) * 4 + targetSeasonIndex;
		} else {
			// Past year
			const yearsBack = referenceYear - year;
			// From target season to end of target year: 4 - targetSeasonIndex - 1 seasons
			// Then full years back: yearsBack - 1 years * 4 seasons each
			// Then from start of reference year to reference season: referenceSeasonIndex seasons
			totalSeasonsDiff = -(
				4 -
				targetSeasonIndex -
				1 +
				(yearsBack - 1) * 4 +
				referenceSeasonIndex +
				1
			);
		}

		// Each season is 13 weeks, calculate target index
		// Since weeks array is ordered newest to oldest (index 0 = current week)
		// Moving forward in time means moving to higher indices
		const WEEKS_PER_SEASON = 13;
		const targetIndex =
			referenceWeekIndex - totalSeasonsDiff * WEEKS_PER_SEASON;

		// Validate the result
		if (targetIndex < 0 || targetIndex >= weeks.length) {
			console.warn(
				`Week index out of bounds: ${targetIndex} for ${season} ${year}`,
			);
			return null;
		}

		return { targetIndex, week: weeks[targetIndex] };
	};

	useEffect(() => {
		weeks.length === 0 && generateWeeks();

		// Set current week to the beginning of the season
		setCurrentWeekIndex(getFirstWeekOfSeason(currentSeason)?.targetIndex || 0);
	}, [currentSeason]);

	useEffect(() => {
		generateWeeks();
	}, [weekStartMode]);

	// Effect to handle season availability when year changes
	useEffect(() => {
		const availableSeasons = getAvailableSeasonsForYear(currentSeason.year);
		if (
			availableSeasons.length > 0 &&
			!availableSeasons.includes(currentSeason.season)
		) {
			// If current season is not available for the selected year, set to the latest available season
			setCurrentSeason((prev) => ({
				...prev,
				season: availableSeasons[availableSeasons.length - 1],
			}));
		}
	}, [currentSeason.year]);

	const isCurrentOrPastSeason = (
		year: number,
		season: string | null,
	): boolean => {
		const currentSeasonIndex: number = fourSeasonsOrder.indexOf(
			currentSeason.season.toLowerCase(),
		);
		const givenSeasonIndex: number = season
			? fourSeasonsOrder.indexOf(season.toLowerCase())
			: -1; // Check if season is null

		if (year !== currentSeason.year) {
			return year < currentSeason.year;
		}

		return givenSeasonIndex <= currentSeasonIndex;
	};

	function fillMissingAiredDates(
		episodes: AnimeItem["episodeData"],
	): AnimeItem["episodeData"] {
		return episodes?.map((episode, index, array) => {
			if (episode.aired !== null) {
				return {
					...episode,
					isAiredDateEstimated: false,
				};
			}

			// Find first non-null aired date in the array
			const firstAiredIndex = array.findIndex((ep) => ep.aired !== null);
			if (firstAiredIndex === -1)
				return {
					...episode,
					isAiredDateEstimated: false,
				};

			// If we're before the first aired date
			if (index < firstAiredIndex) {
				const firstAiredDate = array[firstAiredIndex].aired;
				if (!firstAiredDate) return { ...episode, isAiredDateEstimated: false };

				const weeksBack = firstAiredIndex - index;
				const estimatedDate = new Date(
					new Date(firstAiredDate).getTime() -
					weeksBack * 7 * 24 * 60 * 60 * 1000,
				);
				return {
					...episode,
					aired: estimatedDate.toISOString(),
					isAiredDateEstimated: true,
				};
			}

			// Original logic for other cases
			let prevIndex = index - 1;
			let nextIndex = index + 1;

			while (prevIndex >= 0 && array[prevIndex].aired === null) prevIndex--;
			while (nextIndex < array.length && array[nextIndex].aired === null)
				nextIndex++;

			const prevDate =
				prevIndex >= 0 && array[prevIndex].aired
					? new Date(array[prevIndex].aired)
					: null;
			const nextDate =
				nextIndex < array.length && array[nextIndex].aired
					? new Date(array[nextIndex].aired)
					: null;

			let estimatedDate: Date;

			if (prevDate && nextDate) {
				const totalGap = nextDate.getTime() - prevDate.getTime();
				const gapCount = nextIndex - prevIndex;
				const increment = totalGap / gapCount;
				estimatedDate = new Date(
					prevDate.getTime() + increment * (index - prevIndex),
				);
			} else if (prevDate) {
				estimatedDate = new Date(prevDate.getTime() + 7 * 24 * 60 * 60 * 1000);
			} else if (nextDate) {
				estimatedDate = new Date(nextDate.getTime() - 7 * 24 * 60 * 60 * 1000);
			} else {
				return {
					...episode,
					isAiredDateEstimated: false,
				};
			}

			return {
				...episode,
				aired: estimatedDate.toISOString(),
				isAiredDateEstimated: true,
			};
		});
	}

	const fetchAllAnime = async () => {
		setFetchingAnime(true);
		const { year, season } = currentSeason;
		try {
			let allAnime: AnimeItem[] = [];
			let page = 1;
			let hasNextPage = true;

			while (hasNextPage) {
				try {
					let responses = [];
					if (animeTypeFilter === "tv") {
						responses = [
							await axios.get(
								`https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&filter=tv&sfw`,
							),
						];
					} else if (animeTypeFilter === "tv_and_continuing") {
						responses = [
							await axios.get(
								`https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&filter=tv&sfw&continuing`,
							),
						];
					} else {
						responses = [
							await axios.get(
								`https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&filter=tv&sfw&continuing`,
							),
							await axios.get(
								`https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&filter=ona&sfw`,
							),
						];
					}

					const combinedData = responses.flatMap(
						(response) => response.data.data,
					);
					// Filter out duplicates by mal_id
					const uniqueData = combinedData.filter(
						(anime, index, array) =>
							array.findIndex((item) => item.mal_id === anime.mal_id) === index,
					);
					const { pagination } = responses[0].data;
					const filteredData = uniqueData
						.map(
							({
								mal_id,
								url,
								images,
								title,
								type,
								episodes,
								aired,
								score,
								season,
								year,
								members,
							}: AnimeItem) => ({
								mal_id,
								url,
								image_url: images.webp.image_url,
								title,
								type,
								episodes,
								air_date: aired.from,
								score,
								season,
								year,
								members,
							}),
						)
						.filter(
							(anime) =>
								anime.score !== null &&
								(!anime.year ||
									isCurrentOrPastSeason(anime.year, anime.season)) &&
								(anime.year ? anime.year > 1996 : true) &&
								anime.score > minScore &&
								anime.members > minMembers,
						);

					allAnime = [...allAnime, ...filteredData] as AnimeItem[];
					hasNextPage = pagination.has_next_page;
					// hasNextPage = false
					page++;

					// Wait 1.75 seconds every 2 pages, or when there's no next page
					if (page % 1 === 0 || !hasNextPage) {
						await new Promise((resolve) => setTimeout(resolve, 1750));
					}
				} catch (error) {
					console.error("Error fetching anime data:", error);
					setError("Failed to fetch anime data. Please try again later.");
					setFetchingAnime(false);
					break;
				}
			}
			// console.log(allAnime)

			// Fetch episode data for each anime
			const animeWithEpisodes = [];
			const fetchLimit = 2;
			const fetchInterval = 2000; // 2 seconds

			for (let i = 0; i < allAnime.length; i += fetchLimit) {
				const batch = allAnime.slice(i, i + fetchLimit);
				const batchResults = await Promise.all(
					batch
						.map(async (anime) => {
							try {
								const fetchEpisodes = async (page = 1) => {
									const response = await axios.get(
										`https://api.jikan.moe/v4/anime/${anime.mal_id}/episodes?page=${page}`,
									);
									return response.data;
								};

								const initialData = await fetchEpisodes(1);
								let allResults = initialData.data;

								if (initialData.pagination.has_next_page) {
									const lastPage = initialData.pagination.last_visible_page;
									const lastPageData = await fetchEpisodes(lastPage);

									let secondLastPageData = [];
									// @TODO: should it be >1 ? (probably not but check)
									if (lastPage > 2) {
										secondLastPageData = await fetchEpisodes(lastPage - 1);
									}

									allResults = [
										...secondLastPageData.data,
										...lastPageData.data,
									];
								}
								// Fill in missing aired dates
								allResults = fillMissingAiredDates(allResults);
								return { ...anime, episodeData: allResults };
							} catch (error) {
								console.error(
									`Error fetching episodes for ${anime.title}:`,
									error,
								);
							}
						})
						.filter(Boolean), // Remove null entries from the array
				);

				animeWithEpisodes.push(...batchResults);

				if (i + fetchLimit < allAnime.length) {
					await new Promise((resolve) => setTimeout(resolve, fetchInterval));
				}
			}

			// Filter out anime with no episodes or where all episodes have no aired date
			const filteredAnimeList = animeWithEpisodes
				.filter(
					(anime) =>
						anime?.episodeData?.length > 0 &&
						!(anime?.episodeData as AnimeItem["episodeData"])?.every(
							(episode) => episode.aired === null,
						),
				)
				// filter to only show anime with at least 2 episodes aired
				// .filter(anime => anime.episodeData && anime.episodeData?.length >= 2)
				.filter(
					(anime) =>
						anime?.episodeData &&
						anime.episodeData?.filter(
							(ep: { aired: string | null }) => ep.aired,
						).length >= 1,
				) as AnimeItem[];
			setAnimeList(filteredAnimeList);
			setLoading(false);
			setFetchingAnime(false);
		} catch (error) {
			console.error("Error fetching anime data:", error);
			setError("Failed to fetch anime data. Please try again later.");
			setLoading(false);
			setFetchingAnime(false);
		}
	};

	// useEffect(() => {
	// 	if (animeList.length > 0) {
	// 		const seasonStartDate = new Date(currentSeason.year, getSeasonStartMonth(currentSeason.season), 1);
	// 		const seasonEndDate = new Date(currentSeason.year, getSeasonStartMonth(currentSeason.season) + 3, 0);

	// 		const filteredAnimeList = animeList.filter(anime => {
	// 			return anime.episodeData?.data.some(episode => {
	// 				const episodeDate = new Date(episode.aired);
	// 				return episodeDate >= seasonStartDate && episodeDate <= seasonEndDate;
	// 			});
	// 		});

	// 		setAnimeList(filteredAnimeList);
	// 	}
	// }, [currentSeason]);

	// const fetchSeasons = () => {
	// 	const currentDate = new Date()
	// 	const currentYear = currentDate.getFullYear()
	// 	const currentMonth = currentDate.getMonth()
	// 	const allSeasons = []

	// 	for (let year = currentYear; year > currentYear - 4; year--) {
	// 		for (let i = fourSeasonsOrder.length - 1; i >= 0; i--) {
	// 			if (year < currentYear || (year === currentYear && i * 3 <= currentMonth)) {
	// 				allSeasons.push(`${fourSeasonsOrder[i]} ${year}`)
	// 			}
	// 		}
	// 	}

	// 	setSeasons(allSeasons)
	// 	setCurrentSeason({ year: currentYear, season: fourSeasonsOrder[Math.floor(currentMonth / 3)] })
	// }

	// const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
	// 	const [season, year] = event.target.value.split(" ")
	// 	setCurrentSeason({ year: Number.parseInt(year), season: season.toLowerCase() })
	// }

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (error) {
		return <div className="text-red-500 text-center">{error}</div>;
	}

	const getEpisodeOfWeek = (anime: AnimeItem, weekIndex: number) => {
		const currentWeek = weeks[weekIndex];
		if (!currentWeek) return null;
		const [startDate, endDate] = currentWeek.split(" - ").map((date) => {
			const [month, day, year] = date.split("/");
			const dateObj = new Date(
				Date.UTC(Number(year), Number(month) - 1, Number(day)),
			);
			dateObj.setUTCHours(0, 0, 0, 0);
			return dateObj;
		});

		return anime?.episodeData?.find((ep) => {
			if (!ep.aired || ep.score === null) return false;
			const airedDate = new Date(ep.aired);
			airedDate.setUTCHours(0, 0, 0, 0);
			return airedDate >= startDate && airedDate <= endDate; // Include episodes aired on Thursday
		});
	};

	const isEpisodeInCurrentSeason = (episode: { aired: string }) => {
		const episodeDate = new Date(episode.aired);

		// Get the first week of the current season
		const seasonFirstWeek = getFirstWeekOfSeason(currentSeason);
		if (!seasonFirstWeek) return false;

		// Calculate season start date from the first week
		const [startDateStr] = seasonFirstWeek.week.split(" - ");
		const seasonStartDate = new Date(startDateStr);

		// Calculate season end date (13 weeks later)
		const seasonEndDate = new Date(seasonStartDate);
		seasonEndDate.setDate(seasonStartDate.getDate() + 13 * 7 - 1); // 13 weeks minus 1 day

		return episodeDate >= seasonStartDate && episodeDate <= seasonEndDate;
	};

	const getAverageSeasonScore = (anime: AnimeItem) => {
		const seasonEpisodes = anime.episodeData?.filter(
			(episode) => isEpisodeInCurrentSeason(episode) && episode.score !== null,
		);
		return seasonEpisodes && seasonEpisodes.length > 0
			? seasonEpisodes.reduce((sum, episode) => sum + (episode.score || 0), 0) /
			seasonEpisodes.length
			: 0;
	};

	const getAnimeSeasonEpisodesNb = (anime: AnimeItem) => {
		return (
			anime.episodeData?.filter(
				(episode) =>
					isEpisodeInCurrentSeason(episode) && episode.score !== null,
			).length || 0
		);
	};

	const sortAnimeList = (sortBy: string) => {
		return [...animeList].sort((a, b) => {
			const aEpisode = getEpisodeOfWeek(a, currentWeekIndex);
			const bEpisode = getEpisodeOfWeek(b, currentWeekIndex);
			const aEpisodeLastWeek = getEpisodeOfWeek(a, currentWeekIndex + 1);
			const bEpisodeLastWeek = getEpisodeOfWeek(b, currentWeekIndex + 1);

			switch (sortBy) {
				case "members":
					return b.members - a.members;
				case "animeScore":
					return (b.score || 0) - (a.score || 0);
				case "episodeScore":
					return (bEpisode?.score || 0) - (aEpisode?.score || 0);
				case "episodeScoreLastWeek":
					return (
						(bEpisodeLastWeek?.score || 0) - (aEpisodeLastWeek?.score || 0)
					);
				case "averageSeasonScore":
					return getAverageSeasonScore(b) - getAverageSeasonScore(a);
				case "title":
					return a.title.localeCompare(b.title);
				default:
					return 0;
			}
		});
	};

	const sortedAnimeList = sortAnimeList(sortBy);
	const animeListSortedByEpisodeScore = sortAnimeList("episodeScore");
	const animeListSortedByEpisodeScoreLastWeek = sortAnimeList(
		"episodeScoreLastWeek",
	);

	const getCurrentSeasonFromWeek = (week: string) => {
		if (!week) return { season: "unknown", year: "unknown", weekOfSeason: 0 };

		// Parse the week dates
		const [startDateStr] = week.split(" - ");
		const weekDate = new Date(startDateStr);

		// Find the index of this week in our weeks array
		const currentWeekIdx = weeks.findIndex((w) => w === week);
		if (currentWeekIdx === -1) {
			console.error("Week not found in weeks array:", week);
			return { season: "unknown", year: "unknown", weekOfSeason: 0 };
		}

		// Get the reference week index (first week of Fall 2024)
		const referenceWeekIdx = getFirstWeekIndex();
		if (referenceWeekIdx === -1) {
			console.error("Reference week not found in weeks array");
			return { season: "unknown", year: "unknown", weekOfSeason: 0 };
		}

		// Calculate weeks difference from our reference week
		// Note: Since weeks are ordered from newest to oldest, a higher index means
		// we're further in the past from our reference
		const weeksDiff = referenceWeekIdx - currentWeekIdx;

		// Constants
		const WEEKS_PER_SEASON = 13;
		const FALL_SEASON_INDEX = 3; // fall is index 3 in fourSeasonsOrder

		// Calculate which season we're in relative to Fall 2024
		// Divide by WEEKS_PER_SEASON to get how many full seasons we've moved
		const seasonOffset = Math.floor(weeksDiff / WEEKS_PER_SEASON);

		// Base year is 2024 (the year of our reference Fall season)
		const referenceYear = 2024;

		// Calculate year based on seasonOffset
		// Every 4 seasons we move forward/backward one year
		let yearOffset = Math.floor(seasonOffset / 4);
		// Special handling for negative offsets that cross year boundaries
		if (seasonOffset < 0 && seasonOffset % 4 !== 0) {
			yearOffset -= 1;
		}
		const year = referenceYear + yearOffset;

		// Calculate season index
		// Start from FALL_SEASON_INDEX and add the seasonal offset modulo 4
		// For negative offsets, we need to ensure we get a positive result
		let seasonIndex = (FALL_SEASON_INDEX + (seasonOffset % 4)) % 4;
		if (seasonIndex < 0) seasonIndex += 4;

		// Determine season from the index
		const season = fourSeasonsOrder[seasonIndex];

		// Calculate week number within the season (1-13)
		// Get the remainder of weeks from the last complete season
		let weekOfSeason = weeksDiff % WEEKS_PER_SEASON;
		// Convert to 1-based indexing within the season
		if (weekOfSeason < 0) weekOfSeason += WEEKS_PER_SEASON;
		weekOfSeason = weekOfSeason + 1;

		// For winter seasons that start in December, we need to use the following year
		// since Winter 2023 can start in December 2022
		const yearFromDate = weekDate.getFullYear();
		let finalYear = yearFromDate;
		if (season === "winter" && weekDate.getMonth() === 11) {
			// December (month 11)
			finalYear = yearFromDate + 1;
		}

		return {
			season,
			year: finalYear.toString(),
			weekOfSeason,
		};
	};

	const getAvailableSeasonsForYear = (year: number) => {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth();
		const currentSeasonIndex = Math.floor(currentMonth / 3);

		// If the year is in the past, all seasons are available
		if (year < currentYear) {
			return fourSeasonsOrder;
		}

		// If the year is the current year, only show seasons up to and including the current season
		if (year === currentYear) {
			return fourSeasonsOrder.slice(0, currentSeasonIndex + 1);
		}

		// If the year is in the future, no seasons are available (shouldn't happen given year input constraints)
		return [];
	};

	const topEpisodes = [...sortedAnimeList]
		.flatMap(
			(anime) =>
				anime.episodeData?.map((episode) => ({
					...episode,
					animeTitle: anime.title,
					imageUrl: anime.image_url,
				})) || [],
		)
		.filter(
			(episode) => isEpisodeInCurrentSeason(episode) && episode.score !== null,
		)
		.sort((a, b) => (b.score || 0) - (a.score || 0));

	const getTopEpisodes = (count: number) =>
		Array.from(new Set(topEpisodes.slice(0, count))); // Get unique top episodes

	const renderTopEpisodes = (count: number) => {
		const episodes = getTopEpisodes(count);
		return (
			<>
				{episodes.map((episode, index) => (
					<div
						key={`${episode.mal_id}-${index}`}
						className="bg-background shadow-md border border-border rounded-lg flex gap-2 relative"
					>
						<div className="absolute top-0 left-0 bg-gray-700 text-white px-2 py-1 text-xs font-bold rounded-tl-lg rounded-br-lg z-10">
							#{index + 1}
						</div>
						<div className="w-20 h-[130px] relative flex-shrink-0">
							<Image
								src={episode.imageUrl || "/placeholder-anime.jpg"}
								alt={episode.animeTitle}
								className="rounded-lg shadow-md object-cover"
								fill={true}
								sizes="80px"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = "/placeholder-anime.jpg";
								}}
							/>
						</div>
						<div className="flex-1 p-2 overflow-hidden">
							<div className="mb-1">
								<h4
									className="text-[16px] [line-height:20px] font-semibold mb-2 line-clamp-2"
									title={episode.animeTitle}
								>
									{episode.animeTitle}
								</h4>
								<p className="text-xs mb-1 line-clamp-3" title={episode.title}>
									Episode {episode.mal_id}: {episode.title}
								</p>
								<div className="bg-yellow-300 text-black px-2 py-1 text-xs font-bold rounded-tr-lg rounded-bl-lg flex items-center w-fit mb-1">
									<span className="mr-1">★</span>
									{episode.score?.toFixed(2) || "N/A"}/5
								</div>
							</div>
						</div>
					</div>
				))}
			</>
		);
	};

	const seasonAverageAnimesScore = (
		sortedAnimeList.reduce((sum, anime) => sum + (anime.score || 0), 0) /
		sortedAnimeList.length
	).toFixed(2);
	const seasonAverageEpisodesScore = (
		sortedAnimeList.reduce(
			(sum, anime) => sum + (getAverageSeasonScore(anime) || 0),
			0,
		) / sortedAnimeList.length
	).toFixed(2);

	return (
		<div className="">
			<div className="flex items-center gap-2 lg:gap-4 mb-4 flex-wrap">
				<div className="flex flex-col gap-1">
					<Label htmlFor="anime-type-select">Anime Type</Label>
					<Select
						value={animeTypeFilter}
						onValueChange={(value) =>
							setAnimeTypeFilter(value as typeof animeTypeFilter)
						}
					>
						<SelectTrigger id="anime-type-select" className="w-[180px]">
							<SelectValue placeholder="Anime type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="tv">TV Only</SelectItem>
							<SelectItem value="tv_and_continuing">TV + Continuing</SelectItem>
							<SelectItem value="tv_and_ona">TV + ONA</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-1">
					<div className="flex flex-col gap-1">
						<Label htmlFor="season-select">Season</Label>
						<Select
							value={currentSeason.season}
							onValueChange={(value) =>
								setCurrentSeason({ ...currentSeason, season: value })
							}
						>
							<SelectTrigger id="season-select" className="w-[130px]">
								<SelectValue placeholder="Season" />
							</SelectTrigger>
							<SelectContent>
								{getAvailableSeasonsForYear(currentSeason.year).map(
									(season, index) => (
										<SelectItem key={index} value={season}>
											{season.charAt(0).toUpperCase() + season.slice(1)}
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="year-input">Year</Label>
						<Input
							id="year-input"
							type="number"
							min={new Date().getFullYear() - NUMBER_OF_YEARS_BACK_ALLOWED + 1}
							max={new Date().getFullYear()}
							value={currentSeason.year}
							onChange={(e) =>
								setCurrentSeason({
									...currentSeason,
									year: Number(e.target.value) || currentSeason.year,
								})
							}
							className="w-20"
							placeholder="Year"
						/>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<div className="flex flex-col gap-1">
						<Label htmlFor="min-score">Min Score</Label>
						<Input
							id="min-score"
							type="number"
							value={minScore}
							step={0.5}
							onChange={(e) => setMinScore(Number(e.target.value) || 0)}
							className="w-20"
							placeholder="Min Score"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="min-members">Minimum Members</Label>
						<Input
							id="min-members"
							type="number"
							step={5000}
							value={minMembers}
							onChange={(e) => setMinMembers(Number(e.target.value) || 0)}
							className="w-28"
							placeholder="Min Members"
						/>
					</div>
				</div>
				{/* {!animeList || animeList.length === 0 && (
					<div className="flex flex-col gap-1">
						<label htmlFor="week-start-select">Week Starts On</label>
						<select
							id="week-start-select"
							className="px-2 py-[5px] border border-gray-300 rounded-md"
							value={weekStartMode}
							onChange={(e) => setWeekStartMode(e.target.value as "sunday" | "friday")}
						>
							<option value="sunday">Sunday</option>
							<option value="friday">Friday</option>
						</select>
					</div>
				)} */}
			</div>
			<Button
				onClick={fetchAllAnime}
				disabled={fetchingAnime}
				size="lg"
				variant="default"
				className={`mb-4 ${fetchingAnime ? "opacity-50 cursor-not-allowed" : ""}`}
			>
				Start
				{fetchingAnime && (
					<LoaderCircle className="animate-spin size-5 ml-2" />
				)}
			</Button>
			{sortedAnimeList.length > 0 && (
				<>
					<div className="flex gap-2 flex-wrap mb-4 ">
						{/* Dropdown for sorting */}
						<div className="flex flex-col gap-1">
							<Label htmlFor="sort-select">Sort By</Label>
							<Select
								value={sortBy}
								onValueChange={(value) => setSortBy(value)}
							>
								<SelectTrigger id="sort-select" className="w-[220px]">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Episodes</SelectLabel>
										<SelectItem value="episodeScore">
											Current week's episode score
										</SelectItem>
										<SelectItem value="averageSeasonScore">
											Season's avg episodes score
										</SelectItem>
									</SelectGroup>
									<SelectGroup>
										<SelectLabel>Anime</SelectLabel>
										<SelectItem value="animeScore">Score</SelectItem>
										<SelectItem value="members">Members</SelectItem>
										<SelectItem value="title">Title (a-z)</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="info-select">Display Info</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="w-[150px] justify-start capitalize"
									>
										{showAdditionalInfo[0] || "Select option"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<DropdownMenuCheckboxItem
										checked={showAdditionalInfo[0] === "minimal"}
										onCheckedChange={(checked) => {
											setShowAdditionalInfo(checked ? ["minimal"] : []);
										}}
									>
										Minimal
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={showAdditionalInfo[0] === "episode"}
										onCheckedChange={(checked) => {
											setShowAdditionalInfo(checked ? ["episode"] : []);
										}}
									>
										Episode
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={showAdditionalInfo[0] === "scoring"}
										onCheckedChange={(checked) => {
											setShowAdditionalInfo(checked ? ["scoring"] : []);
										}}
									>
										Scoring
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={showAdditionalInfo[0] === "full"}
										onCheckedChange={(checked) => {
											setShowAdditionalInfo(checked ? ["full"] : []);
										}}
									>
										Full
									</DropdownMenuCheckboxItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					{/* Week Navigation */}
					<div className="flex items-center mb-4 gap-2">
						<button
							onClick={handleNextWeek}
							disabled={currentWeekIndex === weeks.length - 1}
							className="px-2 md:px-4 py-1 md:py-2 text-sm font-medium bg-background text-foreground border border-border rounded-md shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							← <span className="max-sm:hidden">Prev Week</span>
						</button>
						<span className="px-2 md:px-4 py-1 md:py-2 text-sm font-medium bg-background text-foreground border border-border rounded-md">
							Week{" "}
							{getCurrentSeasonFromWeek(weeks[currentWeekIndex]).weekOfSeason}{" "}
							of {getCurrentSeasonFromWeek(weeks[currentWeekIndex]).season}{" "}
							{getCurrentSeasonFromWeek(weeks[currentWeekIndex]).year} (
							{weeks[currentWeekIndex]})
						</span>
						<button
							onClick={handlePreviousWeek}
							disabled={currentWeekIndex === 0}
							className="px-2 md:px-4 py-1 md:py-2 text-sm font-medium bg-background text-foreground border border-border rounded-md shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span className="max-sm:hidden">Next Week</span> →
						</button>
					</div>
					<hr className="my-4" />
					<p className="text-sm text-gray-600 mb-4">
						{sortedAnimeList.length} animes found
					</p>
				</>
			)}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...sortedAnimeList].map((anime) => {
					const thisWeekEpisode = getEpisodeOfWeek(anime, currentWeekIndex);
					const thisWeekRanking =
						animeListSortedByEpisodeScore.findIndex(
							(a) => a.mal_id === anime.mal_id,
						) + 1;
					const lastWeekRanking =
						animeListSortedByEpisodeScoreLastWeek.findIndex(
							(a) => a.mal_id === anime.mal_id,
						) + 1;

					const overallRanking =
						[...sortedAnimeList]
							.sort((a, b) => (b.score || 0) - (a.score || 0))
							.findIndex((a) => a.mal_id === anime.mal_id) + 1;

					const averageSeasonScore = getAverageSeasonScore(anime);

					const seasonRanking =
						[...sortedAnimeList]
							.sort(
								(a, b) => getAverageSeasonScore(b) - getAverageSeasonScore(a),
							)
							.findIndex((a) => a.mal_id === anime.mal_id) + 1;

					// const sameAiredDate = anime.episodeData?.every(ep =>
					// 	ep.aired === anime.episodeData?.[0].aired
					// );
					// let epOfWeekNb: string | number = ""
					// if (sameAiredDate && anime.episodeData && anime.episodeData?.length > 1) {
					// 	const firstEp = Math.min(...anime.episodeData.map(ep => ep.mal_id));
					// 	const lastEp = Math.max(...anime.episodeData.map(ep => ep.mal_id));
					// 	epOfWeekNb = `${firstEp}-${lastEp}`;
					// } else {
					// 	epOfWeekNb = thisWeekEpisode?.mal_id || "N/A";
					// }

					// Group episodes by aired date (for anime with multiple episodes aired on the same day)
					// let epOfWeekNb: string | number = ""
					// if (anime.episodeData && anime.episodeData.length > 1) {
					// 	// Group episodes by aired date
					// 	const episodeGroups = anime.episodeData.reduce((groups: { [key: string]: number[] }, ep) => {
					// 		const airedDate = ep.aired || "unknown"
					// 		if (!groups[airedDate]) {
					// 			groups[airedDate] = []
					// 		}
					// 		groups[airedDate].push(ep.mal_id)
					// 		return groups
					// 	}, {})

					// 	// Find which group contains the current episode
					// 	const currentEpGroup = Object.entries(episodeGroups).find(([_, epIds]) => epIds.includes(thisWeekEpisode?.mal_id || -1))

					// 	if (currentEpGroup && currentEpGroup[1].length > 2) {
					// 		// If current episode is part of a group with >2 episodes, show range
					// 		const firstEp = Math.min(...currentEpGroup[1])
					// 		const lastEp = Math.max(...currentEpGroup[1])
					// 		epOfWeekNb = `${firstEp}-${lastEp}`
					// 	} else {
					// 		// Otherwise show single episode number
					// 		epOfWeekNb = thisWeekEpisode?.mal_id || "N/A"
					// 	}
					// } else {
					// 	epOfWeekNb = thisWeekEpisode?.mal_id || "N/A"
					// }

					const epOfWeekNb = getEpisodeOfWeekNumber(
						anime.episodeData || [],
						thisWeekEpisode || null,
					);
					// const epOfWeekNb = getEpisodeOfWeekNumber(animeList || [], thisWeekEpisode || null)

					return (
						<div
							key={anime.mal_id}
							className="bg-background border border-border rounded-lg flex flex-col relative"
						>
							{thisWeekEpisode && (
								<div className="absolute top-0 left-0 bg-foreground text-background px-2 py-1 text-xs font-bold rounded-tl-lg rounded-br-lg z-10">
									<span className="mr-1">EP</span>
									{epOfWeekNb}
								</div>
							)}
							<div className="flex gap-2">
								<div className="w-20 h-[130px] relative">
									<Image
										src={anime.image_url}
										alt={anime.title}
										className="rounded-lg object-cover"
										fill={true}
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									/>
								</div>
								<div className="flex-1 p-2">
									<div>
										<h4 className="text-[17px] [line-height:22px] font-semibold mb-2 flex items-center gap-2">
											<Link
												href={anime.url}
												className="hover:underline line-clamp-2"
												title={anime.title}
											>
												{anime.title}
											</Link>

											<a
												target="_blank"
												rel="noreferrer"
												href={`/episodes?animeId=${anime.mal_id}`}
												className="text-blue-600 hover:text-blue-800"
											>
												<ChartLine className="size-5" />
											</a>
										</h4>
										{thisWeekEpisode ? (
											<>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="bg-yellow-300 text-black px-2 py-1 text-xs font-bold rounded-tr-lg rounded-bl-lg flex items-center w-fit mb-1">
															<span className="mr-1">★</span>
															{thisWeekEpisode.score || "N/A"}/5
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p>Episode score</p>
													</TooltipContent>
												</Tooltip>
												<div className="flex items-center">
													<Tooltip>
														<TooltipTrigger asChild>
															<div className="bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-tr-lg rounded-bl-lg flex items-center">
																<Trophy className="size-3 mr-1" />{" "}
																{thisWeekRanking}
															</div>
														</TooltipTrigger>
														<TooltipContent>
															<p>Ranking out of all episodes this week</p>
														</TooltipContent>
													</Tooltip>
													{lastWeekRanking && thisWeekEpisode.mal_id !== 1 && (
														<Tooltip>
															<TooltipTrigger asChild>
																<span
																	className={`ml-2 ${lastWeekRanking > thisWeekRanking
																		? "text-green-500"
																		: lastWeekRanking < thisWeekRanking
																			? "text-red-500"
																			: "text-yellow-500"
																		}`}
																>
																	{lastWeekRanking > thisWeekRanking
																		? "↑"
																		: lastWeekRanking < thisWeekRanking
																			? "↓"
																			: "="}
																	{Math.abs(lastWeekRanking - thisWeekRanking)}
																</span>
															</TooltipTrigger>
															<TooltipContent>
																<p>Ranking compared to last week</p>
															</TooltipContent>
														</Tooltip>
													)}
												</div>
												{thisWeekEpisode.isAiredDateEstimated && (
													<p className="text-sm italic">Aired date estimated</p>
												)}
											</>
										) : (
											<p className="text-sm italic">
												No episode aired this week.
											</p>
										)}
									</div>
								</div>
							</div>
							{!showAdditionalInfo.includes("minimal") && (
								<div
									className={`mt-3 ${!thisWeekEpisode && showAdditionalInfo.includes("episode") ? "" : "p-2"} bg-background rounded-b-md text-sm`}
								>
									{thisWeekEpisode &&
										(showAdditionalInfo.includes("episode") ||
											showAdditionalInfo.includes("full")) && (
											<div>
												{showAdditionalInfo.includes("full") && (
													<h5 className="font-semibold mb-1 text-foreground">
														Episode Info
													</h5>
												)}
												<ul className="space-y-1 text-foreground list-disc list-inside">
													<li>
														<span className="font-medium">Title:</span>{" "}
														{thisWeekEpisode.forum_url ? (
															<a
																href={`${thisWeekEpisode.forum_url}&pollresults=1`}
																target="_blank"
																rel="noopener noreferrer"
																className="inline items-center text-blue-600 hover:text-blue-800"
															>
																{thisWeekEpisode.title || "N/A"}
															</a>
														) : (
															thisWeekEpisode.title || "N/A"
														)}
													</li>
													<li>
														<span className="font-medium">Aired:</span>{" "}
														{new Date(thisWeekEpisode.aired).toLocaleDateString(
															"en-US",
															{ month: "long", day: "numeric" },
														) || "N/A"}
													</li>
												</ul>
											</div>
										)}
									{showAdditionalInfo.includes("full") && (
										<div>
											{thisWeekEpisode && (
												<div className="border-t border-gray-300 my-2" />
											)}
											<h5 className="font-semibold mb-1 text-foreground">
												Anime Info
											</h5>
											<ul className="list-disc list-inside text-foreground">
												<li>
													<span className="font-medium">Episodes:</span>{" "}
													{anime.episodes || "N/A"}
												</li>
												<li>
													<span className="font-medium">Score:</span>{" "}
													{anime.score || "N/A"}
												</li>
												<li>
													<span className="font-medium">Members:</span>{" "}
													{anime.members.toLocaleString()}
												</li>
											</ul>
										</div>
									)}

									{(showAdditionalInfo.includes("scoring") ||
										showAdditionalInfo.includes("full")) && (
											<div>
												{showAdditionalInfo.includes("full") && (
													<div className="border-t border-gray-300 my-2" />
												)}
												{showAdditionalInfo.includes("full") && (
													<h5 className="font-semibold mb-1 text-foreground">
														Scoring
													</h5>
												)}
												{averageSeasonScore !== null && (
													<div className="flex items-center gap-2 mb-2">
														<div className="bg-yellow-300 text-black px-2 py-1 text-xs font-bold rounded-lg flex items-center">
															<span className="mr-1">★</span>
															{/* {(averageSeasonScore * 2).toFixed(2)}/10 */}
															{averageSeasonScore.toFixed(2)}/5
														</div>
														<span className="text-sm text-foreground">
															Average episodes score for season
															<br />({getAnimeSeasonEpisodesNb(anime)} episodes)
														</span>
														<span className="text-sm font-semibold text-blue-600">
															#{seasonRanking}
														</span>
													</div>
												)}
												<div className="flex items-center gap-2">
													<div className="bg-green-300 text-black px-2 py-1 text-xs font-bold rounded-lg flex items-center">
														<span className="mr-1">★</span>
														{anime.score?.toFixed(2) || "N/A"}/10
													</div>
													<span className="text-sm text-foreground">
														Anime Score
													</span>
													<span className="text-sm font-semibold text-blue-600">
														#{overallRanking}
													</span>
												</div>
											</div>
										)}
								</div>
							)}
						</div>
					);
				})}
			</div>
			{sortedAnimeList.length > 0 && (
				<div className="flex flex-col gap-2 border border-border rounded-lg p-2 md:p-3 w-fit mt-8">
					<h3 className="text-base font-semibold">Season Average</h3>
					{seasonAverageEpisodesScore !== null && (
						<div className="flex items-center gap-2">
							<div className="bg-yellow-300 text-black px-2 py-1 text-xs font-bold rounded-lg flex items-center">
								<span className="mr-1">★</span>
								{seasonAverageEpisodesScore}/5
							</div>
							<span className="text-sm text-muted-foreground">
								Episode Scores
							</span>
						</div>
					)}
					<div className="flex items-center gap-2">
						<div className="bg-green-300 text-black px-2 py-1 text-xs font-bold rounded-lg flex items-center">
							<span className="mr-1">★</span>
							{seasonAverageAnimesScore}/10
						</div>
						<span className="text-sm text-muted-foreground">Anime Scores</span>
					</div>
				</div>
			)}
			{/* Add the Weekly Score Chart */}
			{sortedAnimeList.length > 0 && (
				<WeeklyScoreChart
					animeList={animeList}
					currentSeason={currentSeason}
					currentWeekIndex={currentWeekIndex}
					weeksFromParent={weeks}
					firstWeekFall2024={FIRST_WEEK_FALL_2024}
				/>
			)}

			{sortedAnimeList.length > 0 && (
				<div className="my-6">
					<h3 className="text-xl font-semibold mb-3">
						Highest Scored Episodes This Season
					</h3>
					<div className="grid max-[500px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{renderTopEpisodes(4)}
					</div>
					<Button onClick={() => setShowMoreDialog(true)} className="mt-4" variant="outline">
						View More
					</Button>
					<Dialog open={showMoreDialog} onOpenChange={setShowMoreDialog}>
						<DialogContent className="max-w-none h-[90vh] max-md:p-2">
							<DialogHeader>
								<DialogTitle>Highest Scored Episodes This Season</DialogTitle>
							</DialogHeader>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
								{renderTopEpisodes(20)}
							</div>
						</DialogContent>
					</Dialog>
				</div>
			)}
		</div>
	);
}
