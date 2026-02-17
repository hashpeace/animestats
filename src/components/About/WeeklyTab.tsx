import {
	BarChart3,
	Calendar,
	Clock,
	Filter,
	Star,
	TrendingUp,
	Trophy,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function WeeklyTab() {
	return (
		<div className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5 text-blue-500" />
							Weekly Episode Tracking
						</CardTitle>
						<CardDescription>
							Monitor anime episode ratings as they air each week
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">
							Our app tracks when episodes air and fetches their ratings from
							MyAnimeList, allowing you to see how each episode performs week by
							week during the anime season.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-green-500" />
							Season Analytics
						</CardTitle>
						<CardDescription>
							Get insights into seasonal anime performance
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">
							View average episode scores, anime rankings, and track how series
							perform throughout their seasonal run with comprehensive
							statistics.
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5 text-purple-500" />
						How Weekly Ratings Work
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold text-lg mb-3">
								Data Collection Process
							</h3>
							<ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
								<li>
									Select an anime season and year to analyze
								</li>
								<li>
									Fetch all anime from that season via MyAnimeList API
								</li>
								<li>
									Retrieve detailed episode data and air dates for each anime.
								</li>
								<li>
									Generate weekly rankings based on episode ratings.
								</li>
							</ol>
						</div>
						<div>
							<h3 className="font-semibold text-lg mb-3">Weekly Analysis</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-blue-500" />
									<span>
										Episodes are matched to weeks based on their air dates
									</span>
								</li>
								<li className="flex items-center gap-2">
									<Star className="h-4 w-4 text-yellow-500" />
									<span>Ratings are fetched from MyAnimeList user reviews</span>
								</li>
								<li className="flex items-center gap-2">
									<Trophy className="h-4 w-4 text-orange-500" />
									<span>Rankings update based on episode performance</span>
								</li>
								<li className="flex items-center gap-2">
									<TrendingUp className="h-4 w-4 text-green-500" />
									<span>Season averages are calculated automatically</span>
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5 text-indigo-500" />
						Features & Controls
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-3 gap-6">
						<div>
							<h4 className="font-semibold mb-2">Filtering Options</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>
									• <strong>Anime Type:</strong> TV, TV + Continuing, TV + ONA
								</li>
								<li>
									• <strong>Season & Year:</strong> Select any past anime season
								</li>
								<li>
									• <strong>Min Score:</strong> Filter by minimum episode rating
								</li>
								<li>
									• <strong>Min Members:</strong> Filter by anime popularity
								</li>
								<li>
									• <strong>Week Start:</strong> Choose Sunday or Friday start
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Sorting Methods</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>
									• <strong>Episode Score:</strong> Current week's episode
									rating
								</li>
								<li>
									• <strong>Members:</strong> Total anime member count
								</li>
								<li>
									• <strong>Anime Score:</strong> Overall anime rating
								</li>
								<li>
									• <strong>Average Season Score:</strong> Mean episode rating
								</li>
								<li>
									• <strong>Title:</strong> Alphabetical order
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Navigation</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>
									• <strong>Week Navigation:</strong> Browse through season
									weeks
								</li>
								<li>
									• <strong>Episode Cards:</strong> View detailed episode info
								</li>
								<li>
									• <strong>Rankings:</strong> See position changes
								</li>
								<li>
									• <strong>Season Stats:</strong> Overall performance metrics
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className="mt-8">
				<CardHeader>
					<CardTitle>Technical Notes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-foreground space-y-2">
						<p>
							<strong>Data Source:</strong> All anime and episode data is
							fetched from the official MyAnimeList (MAL) API.
						</p>
						<p>
							<strong>Episode Filtering:</strong> Episodes with 0 ratings are
							automatically filtered out to ensure accurate rankings.
						</p>
						<p>
							<strong>Air Date Matching:</strong> Episodes are matched to weeks
							based on their official air dates from MyAnimeList.
						</p>
						<p>
							<strong>Season Calculation:</strong> The app automatically detects
							the current anime season based on the current date: Winter
							(Dec-Feb), Spring (Mar-May), Summer (Jun-Aug), Fall (Sep-Nov).
						</p>
						<p>
							<strong>URL Support:</strong> Direct MyAnimeList URLs are parsed
							to extract anime IDs for instant data loading.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
