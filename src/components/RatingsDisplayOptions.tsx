import { Settings2Icon } from "lucide-react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type {
	ChartOptions,
	FilterType,
	RatingDisplayFormat,
	RatingsDisplayOptionsProps,
	ScoreFilterType,
} from "@/types/All";

export default function RatingsDisplayOptions({
	resultsLength,
	options,
	setOptions,
	hasZeroValues,
	hasRecapOrFiller,
	entryType,
	dataSource,
}: RatingsDisplayOptionsProps) {
	const handleRatingInfoVisibilityChange = (
		ratingInfo: keyof ChartOptions["visibleRatingInfo"],
	) => {
		setOptions((prevOptions) => ({
			...prevOptions,
			visibleRatingInfo: {
				...prevOptions.visibleRatingInfo,
				[ratingInfo]: !prevOptions.visibleRatingInfo[ratingInfo],
			},
		}));
	};

	const [scoreInput, setScoreInput] = useState<string>("");
	const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(max-width: 768px)");

		const handleChange = (event: MediaQueryListEvent) => {
			setIsMobile(event.matches);
		};

		setIsMobile(mediaQuery.matches);
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	const handleScoreFilter = (scoreStr: string) => {
		const score = Number.parseFloat(scoreStr);
		if (Number.isNaN(score) || score < 0 || score > 10) {
			setOptions((prev) => ({
				...prev,
				filterBelowScore: { score: 0, type: "hide" },
			}));
			return;
		}
		// Store as percentage (multiply by 10) for internal comparison
		const scoreAsPercentage = score * 10;
		setOptions((prev) => ({
			...prev,
			filterBelowScore: {
				score: scoreAsPercentage,
				type: options.filterBelowScore?.type || "hide",
			},
		}));
		posthog.capture("option_panel_event", {
			option: "hide_below_score",
			value: score,
		});
	};

	return (
		// <div className="border-b border-gray-200 pb-4">
		<div className="pb-6 pt-2">
			<div className="flex gap-3 items-start flex-wrap">
				<div className="flex flex-col">
					<Label htmlFor="sort-select" className="mr-2">
						View mode
					</Label>
					<Select
						value={options.viewMode}
						onValueChange={(value) => {
							setOptions({
								...options,
								viewMode: value as "graph" | "table" | "wrapped",
							});
							posthog.capture("option_panel_event", {
								option: "view_mode",
								value: value,
							});
						}}
					>
						<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
							<SelectValue placeholder="Select a sort option" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="graph">Graph</SelectItem>
							<SelectItem value="table">Table</SelectItem>
							<SelectItem value="wrapped">Cards</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col">
					<Label htmlFor="sort-select">Sort by</Label>
					<Select
						value={options.sortBy}
						onValueChange={(value) => {
							setOptions({
								...options,
								sortBy: value as ChartOptions["sortBy"],
							});
							posthog.capture("option_panel_event", {
								option: "sort_by",
								value: value,
							});
						}}
					>
						<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
							<SelectValue placeholder="Select a sort option" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="episodeNb">
								{entryType === "anime" ? "Episode" : "Chapter"}
							</SelectItem>
							{options.visibleRatingInfo.ratingAllStars && (
								<SelectItem value="ratingAllStars">Rating</SelectItem>
							)}
							{options.visibleRatingInfo.ratingFiveStars && (
								<SelectItem value="ratingFiveStars">
									Five stars ratings only
								</SelectItem>
							)}
							{/* {options.visibleRatingInfo.ratingAllStarsRounded && <SelectItem value="ratingAllStarsRounded">Average ratings (rounded)</SelectItem>} */}
						</SelectContent>
					</Select>
				</div>

				<Button
					variant="outline"
					onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
					className="self-end"
				>
					<Settings2Icon className="size-4 mr-1" />
					{showAdvancedOptions ? "Less options" : "More options"}
				</Button>
			</div>
			{showAdvancedOptions && (
				<div className="flex gap-3 items-start flex-wrap mt-4">
					{options.viewMode === "graph" && (
						<>
							<div className="flex flex-col">
								<Label htmlFor="yAxisDomain-select">Vertical zoom</Label>
								<Select
									value={options.yAxisDomain}
									onValueChange={(value) => {
										setOptions({
											...options,
											yAxisDomain: value as ChartOptions["yAxisDomain"],
										});
										posthog.capture("option_panel_event", {
											option: "y_axis_domain",
											value: value,
										});
									}}
								>
									<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
										<SelectValue placeholder="Select a sort option" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="closed">Recommended</SelectItem>
										<SelectItem value="full">Full</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{resultsLength > 20 && (isMobile || resultsLength >= 40) && (
								<div className="flex flex-col">
									<Label htmlFor="horizontalZoom-select">Horizontal zoom</Label>
									<Select
										value={options.horizontalZoom ?? "automatic"}
										onValueChange={(value: "fit" | "automatic" | "extended") => {
											setOptions({
												...options,
												horizontalZoom: value,
											});
											posthog.capture("option_panel_event", {
												option: "vertical_zoom",
												value: value,
											});
										}}
									>
										<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
											<SelectValue placeholder="Horizontal zoom" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="fit">Fit</SelectItem>
											<SelectItem value="automatic">Automatic</SelectItem>
											<SelectItem value="extended">Extended</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
							<div className="flex flex-col">
								<Label htmlFor="lineStyle-select">Line style</Label>
								<Select
									value={options.lineStyle}
									onValueChange={(value) => {
										setOptions({
											...options,
											lineStyle: value as ChartOptions["lineStyle"],
										});
										posthog.capture("option_panel_event", {
											option: "line_style",
											value: value,
										});
									}}
								>
									<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
										<SelectValue placeholder="Select a line style" />
									</SelectTrigger>
									<SelectContent>
										{["bump", "linear", "monotone", "step"].map((style) => (
											<SelectItem key={style} value={style}>
												{style}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</>
					)}
					{dataSource === "mal" && (
						<div className="flex flex-col">
							<Label htmlFor="rating-format-select">Rating precision</Label>
							<Select
								value={options.ratingDisplayFormat}
								onValueChange={(value: RatingDisplayFormat) => {
									setOptions({ ...options, ratingDisplayFormat: value });
									posthog.capture("option_panel_event", {
										option: "rating_display_format",
										value: value,
									});
								}}
							>
								<SelectTrigger className="w-[140px] focus:ring-offset-1 focus:ring-2 bg-white">
									<SelectValue placeholder="Rating format" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1decimal">1 decimal</SelectItem>
									<SelectItem value="2decimal">2 decimals</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
					<div className="flex flex-col">
						<Label htmlFor="score-filter">
							Filter {entryType === "anime" ? "episodes" : "chapters"} below rating
						</Label>
						<div className="flex gap-1">
							<Select
								value={options.filterBelowScore?.type || "hide"}
								onValueChange={(value: ScoreFilterType) => {
									setOptions((prevOptions) => ({
										...prevOptions,
										filterBelowScore: {
											score: prevOptions.filterBelowScore?.score || 0,
											type: value,
										},
									}));
									posthog.capture("option_panel_event", {
										option: "score_filter_type",
										value: value,
									});
								}}
							>
								<SelectTrigger className="w-[100px] focus:ring-offset-1 focus:ring-2 bg-white">
									<SelectValue placeholder="Filter type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="highlight">Highlight</SelectItem>
									<SelectItem value="hide">Hide</SelectItem>
									<SelectItem value="remove">Remove</SelectItem>
								</SelectContent>
							</Select>
							<input
								id="score-filter"
								type="number"
								min="0"
								max="10"
								step="0.1"
								className="w-[61px] dark:bg-muted px-2 py-1 rounded border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								value={
									scoreInput ||
									(options.filterBelowScore?.score
										? (Number(options.filterBelowScore.score) / 10).toString()
										: "")
								}
								onChange={(e) => setScoreInput(e.target.value)}
								placeholder="0-10"
							/>
							<Button
								variant="outline"
								onClick={() => handleScoreFilter(scoreInput)}
							>
								Apply
							</Button>
						</div>
					</div>
					{(
						Object.keys(options.visibleRatingInfo) as Array<
							keyof ChartOptions["visibleRatingInfo"]
						>
					).length > 1 &&
						options.viewMode !== "wrapped" && (
							<div className="flex flex-col">
								<Label htmlFor="rating-info-select">
									Show {options.viewMode === "graph" ? "lines" : "columns"}
								</Label>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="text-left font-normal justify-start"
										>
											Select
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										{(
											Object.keys(options.visibleRatingInfo) as Array<
												keyof ChartOptions["visibleRatingInfo"]
											>
										).map((ratingInfo) => (
											<DropdownMenuCheckboxItem
												key={ratingInfo}
												checked={options.visibleRatingInfo[ratingInfo]}
												onCheckedChange={() => {
													handleRatingInfoVisibilityChange(ratingInfo);
													posthog.capture("option_panel_event", {
														option: "visible_rating_info",
														value: ratingInfo,
													});
												}}
												onSelect={(e) => e.preventDefault()}
											>
												{(() => {
													switch (ratingInfo) {
														case "ratingAllStars":
															return "Rating";
														case "ratingFiveStars":
															return "Five stars ratings only";
														// case 'ratingAllStarsRounded':
														// 	return 'Average ratings (rounded)';
														default:
															return ratingInfo;
													}
												})()}
											</DropdownMenuCheckboxItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					{hasRecapOrFiller && (
						<div className="flex flex-col">
							<Label htmlFor="filler-recap-select">
								Filler and recap{" "}
								{entryType === "anime" ? "episodes" : "chapters"}
							</Label>
							<Select
								value={options.filterFillerAndRecap}
								onValueChange={(value: FilterType) => {
									setOptions((prevOptions) => ({
										...prevOptions,
										filterFillerAndRecap: value,
									}));
									posthog.capture("option_panel_event", {
										option: "filler_and_recap_display",
										value: value,
									});
								}}
							>
								<SelectTrigger className="w-[110px] focus:ring-offset-1 focus:ring-2 bg-white">
									<SelectValue placeholder="Filter type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="show">Show</SelectItem>
									<SelectItem value="highlight">Highlight</SelectItem>
									<SelectItem value="hide">Hide</SelectItem>
									<SelectItem value="remove">Remove</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
					{options.viewMode === "graph" && (
						<div className="flex items-center mt-4 gap-2">
							<Switch
								id="showTrendLine"
								checked={options.showTrendLine}
								onCheckedChange={() => {
									setOptions((prevOptions) => ({
										...prevOptions,
										showTrendLine: !prevOptions.showTrendLine,
									}));
									posthog.capture("option_panel_event", {
										option: "show_trend_line",
										value: !options.showTrendLine,
									});
								}}
							/>
							<Label
								htmlFor="showTrendLine"
								className="text-sm font-medium leading-none"
							>
								Show trendline
							</Label>
						</div>
					)}
					{hasZeroValues && (
						<div className="flex items-center mt-4 gap-2">
							{/* TODO: Add a tooltip to explain that this will hide the average rating. Currently it hides the rating of the episodes, updates the average rating (and hides the episodes from the table ??). */}
							<Switch
								id="hideZeroValues"
								checked={options.hideZeroValues}
								onCheckedChange={() => {
									setOptions((prevOptions) => ({
										...prevOptions,
										hideZeroValues: !prevOptions.hideZeroValues,
									}));
									posthog.capture("option_panel_event", {
										option: "hide_zero_values",
										value: !options.hideZeroValues,
									});
								}}
							/>
							<Label
								htmlFor="hideZeroValues"
								className="text-sm font-medium leading-none"
							>
								Hide zero values
							</Label>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
