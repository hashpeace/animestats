"use client";
import { LoaderCircle, Search } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"; // Import the useSearchParams hook and useRouter
import posthog from "posthog-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLatestOnePieceEpisodes, LAST_STATIC_OP_EPISODE, onePieceEpisodes } from "@/components/OnePieceOnly/utils";
import { fetchLatestOnePieceChapters, onePieceChapters } from "@/components/OnePieceOnly/utils2";
import RatingsDisplay from "@/components/RatingsDisplay";
import SuggestedAnimeCards from "@/components/SuggestedAnimeCards";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFetchingMethodContext } from "@/contexts/FetchingMethodContext";
import { fetchRatings } from "@/lib/fetchRatings";
import { isProduction } from "@/lib/utils";
import type {
	AnimeInfo,
	EpisodeInfos,
	FetchingMethod,
	ParserEpisodeInfos,
	RatingsDisplayProps,
	RatingsFetcherProps,
} from "@/types/All";

export default function RatingsFetcher({
	isOnePieceOnly = false,
}: RatingsFetcherProps) {
	const [results, setResults] = useState<ParserEpisodeInfos[] | EpisodeInfos[]>(
		[],
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [animeInput, setAnimeInput] = useState("");
	const [animeInputForApi, setAnimeInputForApi] = useState("");
	const [episodeCount, setEpisodeCount] = useState<number | "">("");
	const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
	const [timeLeft, setTimeLeft] = useState<number | null>(null);
	const { fetchingMethod, setFetchingMethod } = useFetchingMethodContext();
	const [entryType, setEntryType] = useState<"anime" | "manga">("anime");
	const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);
	const [searchresults, setSearchResults] = useState<
		{
			title: string;
			url: string;
			image: string;
			type: string;
			year: number;
			imdbId?: string;
		}[]
	>([]);
	const [dataSource, setDataSource] = useState<"mal" | "imdb">("mal");
	const [seasonPickerOpen, setSeasonPickerOpen] = useState(false);
	const [pendingImdbData, setPendingImdbData] = useState<{
		imdbId: string;
		titleData: Record<string, unknown>;
		seasons: Array<{ season: string; episodeCount: number }>;
	} | null>(null);
	const [shouldFetchSearchResults, setShouldFetchSearchResults] =
		useState(true);
	const [debouncedQuery, setDebouncedQuery] = useState(""); // State for debounced query

	// const cheerioParsingMethod = isProduction ? "axios" : "api-route";
	const cheerioParsingMethod = "axios"
	const inputRef = useRef(null); // Ref for the input element
	const searchresultRef = useRef(null); // Ref for the input element
	const initialInputValue = useRef(animeInput); // Store the initial input value

	const extractAnimeInfoFromUrl = (
		input: string,
	): { animeId: string; entryTypeFromUrl: "anime" | "manga" } => {
		if (input.startsWith("http")) {
			const animeMatch = input.match(/\/anime\/(\d+)\/(.+)/);
			const mangaMatch = input.match(/\/manga\/(\d+)\/(.+)/);
			return {
				animeId: animeMatch ? animeMatch[1] : mangaMatch ? mangaMatch[1] : "",
				entryTypeFromUrl: mangaMatch ? "manga" : "anime",
			};
		}
		return { animeId: "", entryTypeFromUrl: "anime" };
	};

	const { animeId, entryTypeFromUrl } =
		extractAnimeInfoFromUrl(animeInputForApi);

	const searchParams = useSearchParams();
	const animeIdFromQuery = searchParams.get("animeId");
	const imdbIdFromQuery = searchParams.get("imdbId");
	const sourceFromQuery = searchParams.get("source");
	const router = useRouter();

	// Set the entry type from the URL
	useEffect(() => {
		setEntryType(entryTypeFromUrl);
	}, [entryTypeFromUrl]);

	// Set entryType to "anime" when fetchingMethod is "jikanOnly" (jikanOnly only supports anime)
	useEffect(() => {
		if (fetchingMethod === "jikanOnly") {
			setEntryType("anime");
		}
	}, [fetchingMethod]);

	const removeFocusFromInput = () => {
		if (inputRef.current) {
			const inputElement = inputRef.current as HTMLInputElement;
			if (inputElement && inputElement.tagName === "INPUT") {
				inputElement.blur();
			}
		}
	};

	const clearAnimeIdFromUrl = () => {
		if (animeIdFromQuery || imdbIdFromQuery) {
			const currentUrl = new URL(window.location.href);
			currentUrl.searchParams.delete("animeId");
			currentUrl.searchParams.delete("imdbId");
			currentUrl.searchParams.delete("source");
			router.replace(currentUrl.pathname + currentUrl.search, {
				scroll: false,
			});
		}
	};

	useEffect(() => {
		const fetchOnePieceJikanData = async () => {
			const animeId = entryType === "anime" ? 21 : 13;
			const animeInfoResponse = await fetch(
				`https://api.jikan.moe/v4/${entryType}/${animeId}`,
			);
			if (!animeInfoResponse.ok) {
				throw new Error("Failed to fetch anime info");
			}
			const animeInfoData = await animeInfoResponse.json();
			setAnimeInfo(animeInfoData.data);
		};

		if (isOnePieceOnly) {
			if (entryType === "anime") {
				setEntryType("anime");
				setResults(onePieceEpisodes as EpisodeInfos[]);
				if (onePieceEpisodes.length <= LAST_STATIC_OP_EPISODE) {
					fetchLatestOnePieceEpisodes().then((newResults) => {
						setResults(newResults);
					});
				}
			} else {
				setEntryType("manga");
				setResults(onePieceChapters as EpisodeInfos[]);
				fetchLatestOnePieceChapters().then((results) => {
					setResults(results);
				});
			}
			fetchOnePieceJikanData();
		}
	}, [entryType, isOnePieceOnly]);

	const IMDB_API_BASE = "https://api.imdbapi.dev";

	const fetchImdbEpisodesForSeason = useCallback(
		async (
			imdbId: string,
			season: string,
			titleData: Record<string, unknown>,
			hasMultipleSeasons: boolean,
		) => {
			setLoading(true);
			setError("");
			try {
				const baseTitle = (titleData.primaryTitle as string) ?? "";
				const title = hasMultipleSeasons
					? `${baseTitle} - Season ${season}`
					: baseTitle;

				const animeInfoMapped: AnimeInfo = {
					mal_id: 0,
					year: (titleData.startYear as number) ?? 0,
					images: {
						webp: {
							image_url:
								(titleData.primaryImage as { url?: string })?.url ?? "",
						},
					},
					title,
					titles: [],
					url: `https://www.imdb.com/title/${imdbId}/`,
					type: "TV",
					episodes: 0,
					status: "Finished Airing",
					score:
						(titleData.rating as { aggregateRating?: number })
							?.aggregateRating ?? 0,
					scored_by:
						(titleData.rating as { voteCount?: number })?.voteCount ?? 0,
					rank: 0,
					popularity: 0,
					members: (titleData.rating as { voteCount?: number })?.voteCount ?? 0,
				};
				setAnimeInfo(animeInfoMapped);

				let allEpisodes: Array<{
					episodeNumber: number;
					title: string;
					releaseDate?: { year: number; month: number; day: number };
					rating?: { aggregateRating: number; voteCount: number };
				}> = [];
				let nextPageToken: string | undefined;

				const fetchEpisodesPage = async (pageToken?: string) => {
					const params = new URLSearchParams();
					params.set("season", season);
					if (pageToken) params.set("pageToken", pageToken);
					const res = await fetch(
						`${IMDB_API_BASE}/titles/${imdbId}/episodes?${params}`,
					);
					return res.json();
				};

				do {
					const epData = await fetchEpisodesPage(nextPageToken);
					allEpisodes = allEpisodes.concat(epData.episodes || []);
					nextPageToken = epData.nextPageToken;
					if (nextPageToken) {
						await new Promise((r) => setTimeout(r, 300));
					}
				} while (nextPageToken);

				animeInfoMapped.episodes = allEpisodes.length;
				setAnimeInfo({ ...animeInfoMapped });

				const newResults: EpisodeInfos[] = allEpisodes
					.filter((ep) => ep.rating?.aggregateRating != null)
					.map((ep) => {
						const rating = ep.rating!.aggregateRating;
						const ratingPct = rating * 10;
						const aired = ep.releaseDate
							? new Date(
								ep.releaseDate.year,
								ep.releaseDate.month - 1,
								ep.releaseDate.day ?? 1,
							).toISOString()
							: "";
						return {
							mal_id: ep.episodeNumber,
							url: "",
							title: ep.title,
							title_japanese: "",
							title_romanji: "",
							aired,
							score: rating / 2,
							filler: false,
							recap: false,
							forum_url: "",
							episodeNb: ep.episodeNumber,
							nbOfVotes: ep.rating?.voteCount ?? 0,
							forumTopicUrl: "",
							ratingFiveStars: Number.parseFloat(ratingPct.toFixed(2)),
							ratingAllStars: Number.parseFloat(ratingPct.toFixed(2)),
							allRatings: [],
						};
					});

				setResults(newResults);
				if (newResults.length === 0) {
					setError("No episodes found for this season");
				}
			} catch (err) {
				console.error("Error fetching IMDb episodes:", err);
				setError("An error occurred while fetching episodes.");
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const fetchImdbData = useCallback(
		async (imdbId: string) => {
			setLoading(true);
			setError("");
			setResults([]);
			setAnimeInfo(null);
			setSearchResults([]);
			removeFocusFromInput();

			try {
				const [titleRes, seasonsRes] = await Promise.all([
					fetch(`${IMDB_API_BASE}/titles/${imdbId}`),
					fetch(`${IMDB_API_BASE}/titles/${imdbId}/seasons`),
				]);

				if (!titleRes.ok) throw new Error("Failed to fetch IMDb title");

				const titleData = await titleRes.json();
				const seasonsData = await seasonsRes.json();
				const seasons: Array<{ season: string; episodeCount: number }> =
					seasonsData.seasons ?? [];

				const selectableSeasons = seasons.filter((s) => s.season !== "unknown");

				if (selectableSeasons.length > 1) {
					setPendingImdbData({ imdbId, titleData, seasons: selectableSeasons });
					setSeasonPickerOpen(true);
					setLoading(false);
					return;
				}

				const seasonToUse =
					selectableSeasons.length === 1
						? selectableSeasons[0].season
						: (seasons[0]?.season ?? "1");
				const hasMultipleSeasons = selectableSeasons.length > 1;
				await fetchImdbEpisodesForSeason(
					imdbId,
					seasonToUse,
					titleData,
					hasMultipleSeasons,
				);
			} catch (err) {
				console.error("Error fetching IMDb data:", err);
				setError("An error occurred while fetching IMDb data.");
				setLoading(false);
			}
		},
		[fetchImdbEpisodesForSeason],
	);

	// Fetch data from Jikan (and Cheerio parser if enabled)
	const fetchData = async (overrideUrl?: string) => {
		const imdbMatch = (overrideUrl || animeInputForApi || "").match(
			/imdb\.com\/title\/(tt\d+)/i,
		);
		const imdbIdToFetch = imdbMatch?.[1];

		if (imdbIdToFetch) {
			await fetchImdbData(imdbIdToFetch);
			return;
		}

		const { animeId: fetchAnimeId, entryTypeFromUrl: fetchEntryType } =
			overrideUrl
				? extractAnimeInfoFromUrl(overrideUrl)
				: { animeId, entryTypeFromUrl: entryType };
		const currentEntryType = overrideUrl ? fetchEntryType : entryType;

		setLoading(true);
		setError("");
		setResults([]);
		setEstimatedTime(null);
		setTimeLeft(null);
		setAnimeInfo(null);
		setSearchResults([]);
		removeFocusFromInput();

		if (!fetchAnimeId) {
			setError("Input is empty.");
			setLoading(false);
			return;
		}

		try {
			let allResults: EpisodeInfos[] = [];
			let currentPage = 1;
			let lastVisiblePage = 1;

			let fetches = 0;
			const fetchLimit = 2;
			const fetchInterval = 2200; // 2.2 seconds (even if limit is at 1sec, to make sure)
			let startFetchTime = Date.now();

			// Fetch anime info
			const animeInfoResponse = await fetch(
				`https://api.jikan.moe/v4/${currentEntryType}/${fetchAnimeId}`,
			);
			if (!animeInfoResponse.ok) {
				throw new Error("Failed to fetch anime info");
			}
			const animeInfoData = await animeInfoResponse.json();
			setAnimeInfo(animeInfoData.data);

			// Fetch episodes/ratings infos from Jikan
			const fetchJikanData = async () => {
				do {
					if (fetches >= fetchLimit) {
						await new Promise((resolve) =>
							setTimeout(
								resolve,
								fetchInterval - (Date.now() - startFetchTime),
							),
						);
						fetches = 0;
						startFetchTime = Date.now();
					}

					const response = await fetch(
						`https://api.jikan.moe/v4/anime/${fetchAnimeId}/episodes?page=${currentPage}`,
					);
					if (!response.ok) {
						throw new Error("Failed to fetch data from Jikan");
					}

					const data = await response.json();
					allResults = allResults.concat(data.data);
					lastVisiblePage = data.pagination.last_visible_page;
					currentPage++;
					fetches++;
				} while (currentPage <= lastVisiblePage);

				const newResults = allResults
					// .filter(ep => ep.score !== null && ep.aired !== null)
					.filter((ep) => ep.score !== null)
					.map((ep) => ({
						...ep,
						episodeNb: ep.mal_id,
						ratingFiveStars: Number.parseFloat((ep.score * 20).toFixed(2)),
						forumTopicUrl: `${ep.forum_url}&pollresults=1`,
						title: ep.title,
						ratingAllStars: Number.parseFloat((ep.score * 20).toFixed(2)),
					}));

				setResults(newResults);

				if (currentEntryType === "anime" && newResults?.length === 0) {
					setError("No episodes found for this anime");
				}
			};

			// Fetch episodes/ratings infos from Cheerio parser (route api)
			const fetchCheerioDataRouteApi = async () => {
				const response = await fetch(
					`/api/fetch-ratings-cheerio?animeId=${fetchAnimeId}&type=${currentEntryType}&episodeCount=${episodeCount}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch data from Cheerio parser");
				}

				const reader = response.body?.getReader();
				if (!reader) {
					throw new Error("Unable to read response from Cheerio parser");
				}

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = new TextDecoder().decode(value);
					const data = JSON.parse(chunk);

					if (data.estimatedTotalTime) {
						setEstimatedTime(data.estimatedTotalTime);
						setTimeLeft(data.estimatedTotalTime);
					}

					if (data.episodesStats) {
						setResults((prevResults) => {
							if (prevResults.length === 0) {
								return data.episodesStats;
							}
							const updatedResults = prevResults.map((result) => {
								const updatedEpisode = data.episodesStats.find(
									(ep: EpisodeInfos) => ep.episodeNb === result.episodeNb,
								);
								return updatedEpisode
									? { ...result, ...updatedEpisode }
									: result;
							});
							// Add any new episodes from data.episodesStats (cheerio) that are not in prevResults (jikan) (for ex if an ep has a topic forum but no episode listed)
							data.episodesStats.forEach((ep: EpisodeInfos) => {
								if (
									!updatedResults.some(
										(result) => result.episodeNb === ep.episodeNb,
									)
								) {
									updatedResults.push(ep);
								}
							});
							return updatedResults;
						});
						setLoading(false);
					}
				}
			};

			// Or fetch episodes/ratings infos from Cheerio parser (axios)
			const fetchCheerioDataAxios = async () => {
				const response = await fetchRatings(
					fetchAnimeId,
					episodeCount || undefined,
					currentEntryType,
				);

				if (response) {
					setResults((prevResults) => {
						if (prevResults.length === 0) {
							return response;
						}
						const updatedResults = prevResults.map((result) => {
							const updatedEpisode = response.find(
								(ep: ParserEpisodeInfos) => ep.episodeNb === result.episodeNb,
							);
							return updatedEpisode ? { ...result, ...updatedEpisode } : result;
						});
						// Add any new episodes from data.episodesStats (cheerio) that are not in prevResults (jikan) (for ex if an ep has a topic forum but no episode listed)
						response.forEach((ep: ParserEpisodeInfos) => {
							if (
								!updatedResults.some(
									(result) => result.episodeNb === ep.episodeNb,
								)
							) {
								updatedResults.push(ep);
							}
						});
						return updatedResults;
					});
					setLoading(false);
				} else {
					setLoading(false);
				}
			};

			const fetchCheerioData =
				cheerioParsingMethod === "api-route"
					? fetchCheerioDataRouteApi
					: fetchCheerioDataAxios;

			// Fetch Jikan data only if no episode count is specified (we could improve it by fetching only the #episodeCount number of episodes with Jikan api)
			if (currentEntryType === "anime" && !episodeCount) await fetchJikanData();

			if (fetchingMethod === "cheerioParser") {
				fetchCheerioData().catch((error) => {
					console.error("Error fetching Cheerio data:", error);
					setError("An error occurred while fetching detailed ratings.");
				});
			} else {
				setLoading(false);
			}
		} catch (err) {
			setError("An error occurred while fetching data.");
			console.error(err);
			setLoading(false);
		}
	};

	// If an animeId param is found, set it and fetch data
	useEffect(() => {
		if (animeIdFromQuery && sourceFromQuery !== "imdb") {
			setDataSource("mal");
			setAnimeInputForApi(
				`https://myanimelist.net/anime/${animeIdFromQuery}/animeName`,
			);
			setAnimeInput("");
			setTimeout(() => {
				animeId === animeIdFromQuery && fetchData();
			}, 500);
		}
	}, [animeIdFromQuery, animeId, sourceFromQuery]);

	// If imdbId and source=imdb are in URL, fetch from IMDb
	useEffect(() => {
		if (imdbIdFromQuery && sourceFromQuery === "imdb") {
			setDataSource("imdb");
			setAnimeInput("");
			setAnimeInputForApi("");
			fetchImdbData(imdbIdFromQuery);
		}
	}, [imdbIdFromQuery, sourceFromQuery, fetchImdbData]);

	// Update time left every second if loading
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (
			cheerioParsingMethod === "api-route" &&
			loading &&
			estimatedTime !== null &&
			timeLeft !== null &&
			timeLeft > 0
		) {
			timer = setInterval(() => {
				setTimeLeft((prevTimeLeft) => {
					if (prevTimeLeft === null || prevTimeLeft <= 0) {
						clearInterval(timer);
						return 0;
					}
					return prevTimeLeft - 1;
				});
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [loading, estimatedTime, timeLeft, cheerioParsingMethod]);

	// Fetch searchresults only if the user has started typing
	useEffect(() => {
		const handler = setTimeout(() => {
			if (animeInput !== initialInputValue.current) {
				// Check if user has started typing
				setDebouncedQuery(animeInput); // Update debounced query after delay
			}
		}, 500); // 500ms delay

		return () => {
			clearTimeout(handler); // Cleanup timeout on unmount or input change
		};
	}, [animeInput, animeInputForApi]); // Dependency on animeInput and animeInputForApi

	const fetchSearchResults = useCallback(
		async (query: string) => {
			if (!shouldFetchSearchResults) return;
			if (query.length < 3) {
				setSearchResults([]);
				setShouldFetchSearchResults(false);
				return;
			}
			try {
				if (dataSource === "imdb") {
					const response = await fetch(
						`${IMDB_API_BASE}/search/titles?query=${encodeURIComponent(query)}`,
					);
					const data = await response.json();
					const titles = (data.titles || []).filter(
						(t: { type: string }) =>
							t.type === "tvSeries" ||
							t.type === "tvMiniSeries" ||
							t.type === "tvShort",
					);
					setSearchResults(
						titles
							.slice(0, 5)
							.map(
								(t: {
									id: string;
									primaryTitle: string;
									primaryImage?: { url: string };
									type: string;
									startYear?: number;
								}) => ({
									title: t.primaryTitle,
									url: `https://www.imdb.com/title/${t.id}/`,
									image: t.primaryImage?.url ?? "",
									type: t.type,
									year: t.startYear ?? 0,
									imdbId: t.id,
								}),
							),
					);
				} else {
					const animeTypes = ["TV", "OVA", "Special", "ONA"];
					const animeStatuses = ["Currently Airing", "Finished Airing"];
					const mangaStatuses = ["Publishing", "Finished"];
					const response = await fetch(
						`https://api.jikan.moe/v4/${entryType}?q=${query}&limit=10&sfw`,
					);
					const data = await response.json();
					setSearchResults(
						data.data
							.filter((anime: AnimeInfo) =>
								entryType === "anime"
									? animeTypes.includes(anime.type) &&
									animeStatuses.includes(anime.status) &&
									anime.episodes !== 1
									: mangaStatuses.includes(anime.status) &&
									anime.chapters !== 1,
							)
							.slice(0, 5)
							.map((anime: AnimeInfo) => ({
								title: anime.title,
								url: anime.url,
								image: anime.images.webp.image_url,
								type: anime.type,
								year: anime.year,
							})),
					);
				}
			} catch (error) {
				console.error("Error fetching searchresults:", error);
			}
		},
		[shouldFetchSearchResults, entryType, dataSource],
	);

	useEffect(() => {
		if (debouncedQuery) {
			fetchSearchResults(debouncedQuery);
		}
	}, [debouncedQuery]);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				inputRef.current &&
				!(inputRef.current as HTMLDivElement).contains(event.target as Node)
			) {
				setSearchResults([]); // Hide searchresults if clicked outside the input or searchresults list
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	return (
		<div>
			{!isOnePieceOnly && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						fetchData();
						posthog.capture("fetch_data", {
							animeId: animeId,
							animeTitle: animeInput,
							entryType: entryType,
							episodeCount: episodeCount,
							fetchingMethod: fetchingMethod,
							cheerioParsingMethod: cheerioParsingMethod,
						});
					}}
					className="flex flex-col max-w-[700px] mx-auto mb-6 overflow-visible"
				>
					<div
						className="relative flex max-sm:flex-col gap-2 overflow-visible"
						ref={inputRef}
					>
						<Select
							value={dataSource}
							onValueChange={(value: "mal" | "imdb") => {
								setDataSource(value);
								setAnimeInput("");
								setAnimeInputForApi("");
								setSearchResults([]);
							}}
						>
							<SelectTrigger size="lg">
								<SelectValue placeholder="Source" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="mal">MyAnimeList</SelectItem>
								<SelectItem value="imdb">IMDb</SelectItem>
							</SelectContent>
						</Select>
						{dataSource === "mal" && fetchingMethod === "cheerioParser" && (
							<Select
								value={entryType}
								onValueChange={(value: RatingsDisplayProps["entryType"]) => {
									setEntryType(value);
									setAnimeInput("");
									setAnimeInputForApi("");
								}}
							>
								<SelectTrigger size="lg">
									<SelectValue placeholder="Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="anime">Anime</SelectItem>
									<SelectItem value="manga">Manga</SelectItem>
								</SelectContent>
							</Select>
						)}
						<div className="grow relative overflow-visible">
							<input
								type="text"
								id="animeInput"
								value={animeInput}
								className="block w-full px-4 py-[7px] pr-10 text-gray-900 bg-white dark:bg-muted dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-hidden focus:ring-1 focus:ring-foreground focus:border-foreground"
								onChange={(e) => {
									setAnimeInput(e.target.value);
									setShouldFetchSearchResults(true);
									// Clear animeId from URL when user starts typing a new search
									clearAnimeIdFromUrl();
								}}
								onPaste={(e) => {
									const pastedValue = e.clipboardData.getData("text");
									setAnimeInputForApi(pastedValue); // Set animeInputForApi on paste
									// Clear animeId from URL when user pastes a new URL
									clearAnimeIdFromUrl();
								}}
								autoComplete="off"
								autoFocus
								onKeyDown={(e) => {
									const searchresultsList =
										searchresultRef.current as HTMLUListElement | null;
									if (e.key === "ArrowDown" || e.key === "ArrowUp") {
										e.preventDefault();
										if (searchresultsList) {
											const activeItem =
												searchresultsList.querySelector(".active");
											const items = Array.from(searchresultsList.children);
											const index = items.indexOf(activeItem as Element);
											const newIndex =
												e.key === "ArrowDown"
													? (index + 1) % items.length
													: (index - 1 + items.length) % items.length;
											if (items[newIndex]) {
												items[newIndex].classList.add("active");
												if (activeItem) {
													activeItem.classList.remove("active");
												}
											}
										}
									} else if (e.key === "Enter") {
										const activeItem =
											searchresultsList?.querySelector(".active");
										if (activeItem) {
											e.preventDefault(); // Prevent form submission, we'll fetch manually
											const searchresult = searchresults.find(
												(_, index) =>
													index ===
													Array.from(
														activeItem.parentElement?.children || [],
													).indexOf(activeItem),
											);
											if (searchresult) {
												setAnimeInput(searchresult.title);
												setAnimeInputForApi(searchresult.url);
												setSearchResults([]);
												setShouldFetchSearchResults(false);
												clearAnimeIdFromUrl();
												fetchData(searchresult.url);
												posthog.capture("fetch_data", {
													animeId: extractAnimeInfoFromUrl(searchresult.url)
														.animeId,
													animeTitle: searchresult.title,
													entryType: entryType,
													episodeCount: episodeCount,
													fetchingMethod: fetchingMethod,
													cheerioParsingMethod: cheerioParsingMethod,
												});
											}
										}
									}
								}}
								placeholder={
									dataSource === "imdb"
										? "Search anime on IMDb..."
										: `Search any ${entryType} or paste link from MAL`
								}
							/>
							<button
								type="submit"
								disabled={loading}
								className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-blue-500 transition-colors disabled:opacity-50"
							>
								<Search />
							</button>
							{searchresults.length > 0 && (
								<ul
									className="absolute z-10 w-full bg-background border border-gray-300 dark:border-gray-700 rounded-md mt-1 top-full left-0"
									ref={searchresultRef}
								>
									{/* <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto" ref={searchresultRef}></ul> */}
									{searchresults.map((searchresult, index) => (
										// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
										<li
											key={index}
											className={`px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2 ${index === 0 ? "active" : ""}`}
											onClick={() => {
												setAnimeInput(searchresult.title);
												setAnimeInputForApi(searchresult.url);
												setSearchResults([]);
												setShouldFetchSearchResults(false);
												clearAnimeIdFromUrl();
												fetchData(searchresult.url);
												posthog.capture("fetch_data", {
													animeId: extractAnimeInfoFromUrl(searchresult.url)
														.animeId,
													animeTitle: searchresult.title,
													entryType: entryType,
													episodeCount: episodeCount,
													fetchingMethod: fetchingMethod,
													cheerioParsingMethod: cheerioParsingMethod,
												});
											}}
										>
											<Image
												src={searchresult.image || "/placeholder-anime.jpg"}
												alt={searchresult.title}
												className="object-cover rounded-sm w-12 h-16"
												width={40}
												height={40}
												onError={(e) => {
													const target = e.target as HTMLImageElement;
													target.src = "/placeholder-anime.jpg";
												}}
											/>
											<div className="flex flex-col gap-1">
												<span className="line-clamp-2">
													{searchresult.title}
												</span>
												<span className="text-xs text-gray-500">
													({searchresult.type}
													{searchresult.year ? `, ${searchresult.year}` : ""})
												</span>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
					{/* {fetchingMethod === "cheerioParser" && !isProduction && (
						<div className="flex items-start flex-col justify-start mt-2">
							<label htmlFor="episodeCount" className="block text-sm font-medium text-gray-700 mb-1">
								Number of {entryType === "anime" ? "episodes" : "chapters"} to fetch (optional):
							</label>
							<input
								type="number"
								id="episodeCount"
								value={episodeCount}
								onChange={e => setEpisodeCount(e.target.value ? Number.parseInt(e.target.value) : "")}
								className="block w-full px-4 py-[5px] text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Leave empty for all"
							/>
						</div>
					)} */}
					{error && <p className="mt-4 text-red-500">{error}</p>}
					{error === "No episodes found for this anime" && (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<p
							className="mt-4 text-blue-500 cursor-pointer hover:underline"
							onClick={() => {
								setFetchingMethod("cheerioParser");
								fetchData();
								setError("");
							}}
						>
							Want to try another method? Click here
						</p>
					)}
					{/* {loading && (fetchingMethod === "jikanOnly" || cheerioParsingMethod === "axios") && ( */}
					{loading && (
						<div className="flex justify-center items-center mt-4">
							<LoaderCircle className="animate-spin size-8 text-blue-500" />
							<span className="ml-2 text-blue-500">Loading...</span>
						</div>
					)}
					{loading &&
						fetchingMethod === "cheerioParser" &&
						cheerioParsingMethod === "api-route" && (
							<>
								<p className="mt-4 text-blue-500">
									Estimated time remaining to fetch detailed ratings info:{" "}
									{estimatedTime !== null && timeLeft !== null ? (
										timeLeft > 0 ? (
											`${Math.round(timeLeft)}s`
										) : (
											"Taking a bit more time..."
										)
									) : (
										<span className="animate-pulse">...</span>
									)}
								</p>
								<Progress
									value={
										estimatedTime !== null && timeLeft !== null
											? ((estimatedTime - timeLeft) / estimatedTime) * 100
											: undefined
									}
									// className="w-full mt-2 *:bg-red-600"
									className="w-full mt-2"
								/>
							</>
						)}
				</form>
			)}
			{isOnePieceOnly && (
				<Select
					value={entryType}
					onValueChange={(value: RatingsDisplayProps["entryType"]) =>
						setEntryType(value)
					}
				>
					<SelectTrigger className="w-[100px] mr-1 h-10 focus:ring-offset-1 focus:ring-2 bg-white mb-4">
						<SelectValue placeholder="Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="anime">Anime</SelectItem>
						<SelectItem value="manga">Manga</SelectItem>
					</SelectContent>
				</Select>
			)}
			{results.length === 0 &&
				!loading &&
				dataSource === "mal" &&
				!isOnePieceOnly && <SuggestedAnimeCards />}
			{results.length > 0 && (
				<RatingsDisplay
					results={results as EpisodeInfos[]}
					entryType={entryType}
					animeInfo={animeInfo}
					fetchingMethod={fetchingMethod}
					episodeCount={episodeCount}
					dataSource={dataSource}
					isOnePieceOnly={isOnePieceOnly}
				/>
			)}

			<Dialog
				open={seasonPickerOpen}
				onOpenChange={(open) => {
					setSeasonPickerOpen(open);
					if (!open) setPendingImdbData(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Select season</DialogTitle>
					</DialogHeader>
					{pendingImdbData && (
						<div className="flex flex-col gap-2 mt-2">
							<p className="text-sm text-gray-600">
								{pendingImdbData.titleData.primaryTitle as string} has multiple
								seasons. Which one do you want to view?
							</p>
							<div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
								{pendingImdbData.seasons.map((s) => (
									<button
										key={s.season}
										type="button"
										className="w-full text-left px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
										onClick={() => {
											fetchImdbEpisodesForSeason(
												pendingImdbData!.imdbId,
												s.season,
												pendingImdbData!.titleData,
												true, // hasMultipleSeasons is always true here since we're in the picker
											);
											setSeasonPickerOpen(false);
											setPendingImdbData(null);
										}}
									>
										<span className="font-medium">Season {s.season}</span>
										<span className="ml-2 text-sm text-gray-500">
											({s.episodeCount} episodes)
										</span>
									</button>
								))}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
