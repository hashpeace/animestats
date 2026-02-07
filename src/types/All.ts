export type FetchingMethod = "cheerioParser" | "jikanOnly"

export interface RatingsFetcherProps {
	isOnePieceOnly?: boolean
}

export interface JikanEpisodeInfo {
	mal_id: number
	url: string
	title: string
	title_japanese: string
	title_romanji: string
	aired: string
	score: number
	filler: boolean
	recap: boolean
	forum_url: string
	currentSaga?: string
	currentArc?: string
}

export interface ParserEpisodeInfos {
	episodeNb: number
	nbOfVotes: number
	forumTopicUrl: string
	title?: string
	ratingFiveStars: number
	ratingAllStars: number | undefined
	allRatings: { star: number; rating: number; nbOfVotes: number }[]
}

export type EpisodeInfos = ParserEpisodeInfos & JikanEpisodeInfo

export type RatingDisplayFormat = "1decimal" | "2decimal"

export interface ChartOptions {
	sortBy: "episodeNb" | "ratingFiveStars" | "ratingAllStars"
	visibleRatingInfo: {
		ratingFiveStars?: boolean
		ratingAllStars: boolean
		// ratingAllStarsRounded: boolean;
	}
	hideZeroValues: boolean
	viewMode: "graph" | "table" | "wrapped"
	yAxisDomain: "full" | "closed"
	lineStyle: "bump" | "linear" | "monotone" | "step"
	filterFillerAndRecap: FilterType
	filterBelowScore: {
		score: number | string
		type: "hide" | "highlight" | "remove"
	}
	showTrendLine: boolean
	ratingDisplayFormat: RatingDisplayFormat
}

export type EntryType = "anime" | "manga"

export interface RatingsDisplayProps {
	results: EpisodeInfos[]
	animeInfo?: AnimeInfo | null
	entryType: EntryType
	fetchingMethod: FetchingMethod
	episodeCount?: number | ""
	isOnePieceOnly?: boolean
}

export interface RatingsDisplayOptionsProps {
	options: ChartOptions
	setOptions: React.Dispatch<React.SetStateAction<ChartOptions>>
	hasZeroValues: boolean
	entryType: EntryType
	hasRecapOrFiller: boolean
}

export interface AllRatings {
	star: number
	rating: number
	nbOfVotes: number
}

export interface AnimeInfo {
	mal_id: number
	year: number
	images: {
		webp: {
			image_url: string
		}
	}
	title?: string
	chapters?: number
	titles: Array<{
		type: string
		title: string
	}>
	url: string
	type: string
	episodes: number
	status: string
	aired?: {
		string: string
	}
	published?: {
		string: string
	}
	score: number
	scored_by: number
	rank: number
	popularity: number
	members: number
}

export type ScoreFilterType = "hide" | "highlight" | "remove"
export type FilterType = "hide" | "highlight" | "show" | "remove"
