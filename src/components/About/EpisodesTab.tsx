import { CardStackIcon } from "@radix-ui/react-icons";
import {
	BarChart3,
	Calendar,
	Clock,
	Filter,
	LayoutGrid,
	LineChart,
	Search,
	Sliders,
	Star,
	Table,
	Target,
	Trophy,
	Users,
	Zap,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function EpisodesTab() {
	return (
		<div className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Search className="h-5 w-5 text-blue-500" />
							Anime Search & URL Input
						</CardTitle>
						<CardDescription>
							Search for any anime or paste a MyAnimeList URL
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">
							Simply search for an anime by name or paste a direct MyAnimeList
							URL to instantly load detailed episode rating data and
							visualizations for that specific series.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<LineChart className="h-5 w-5 text-green-500" />
							Episode Rating Visualization
						</CardTitle>
						<CardDescription>
							Interactive graphs showing episode performance trends
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">
							View how each episode performed with detailed line graphs that
							show rating trends, peaks, and valleys throughout the series run
							with precise data points.
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sliders className="h-5 w-5 text-purple-500" />
						Analysis Features
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold text-lg mb-3">View Modes</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-center gap-2">
									<LineChart className="h-4 w-4 text-blue-500" />
									<span>
										<strong>Graph View:</strong> Interactive line chart showing
										episode ratings over time
									</span>
								</li>
								<li className="flex items-center gap-2">
									<Table className="h-4 w-4 text-green-500" />
									<span>
										<strong>Table View:</strong> Detailed tabular data with
										sorting capabilities
									</span>
								</li>
								<li className="flex items-center gap-2">
									<LayoutGrid className="h-4 w-4 text-purple-500" />
									<span>
										<strong>Cards View:</strong> Big cards with emphasis on
										rating
									</span>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-lg mb-3">
								Customization Options
							</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-yellow-500" />
									<span>
										<strong>Vertical Zoom:</strong> Adjust the rating scale for
										better visibility
									</span>
								</li>
								<li className="flex items-center gap-2">
									<Target className="h-4 w-4 text-red-500" />
									<span>
										<strong>Line Style:</strong> Change graph appearance
										(monotone, colored, etc.)
									</span>
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5 text-orange-500" />
						Data Fetching Modes
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold text-lg mb-3">
								Simple Mode (Jikan API)
							</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-green-500" />
									<span>
										<strong>Fast:</strong> Quick data retrieval using official
										Jikan API
									</span>
								</li>
								<li className="flex items-center gap-2">
									<Star className="h-4 w-4 text-yellow-500" />
									<span>
										<strong>Basic Ratings:</strong> Episode scores and basic
										information
									</span>
								</li>
								<li className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-blue-500" />
									<span>
										<strong>Anime Only:</strong> Limited to anime series
										analysis
									</span>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-lg mb-3">
								Detailed Mode (Direct MAL Parsing)
							</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-red-500" />
									<span>
										<strong>Slower:</strong> Processing time increases with
										episode count
									</span>
								</li>
								<li className="flex items-center gap-2">
									<BarChart3 className="h-4 w-4 text-purple-500" />
									<span>
										<strong>Score Distribution:</strong> 1-5 star rating
										breakdown in table view
									</span>
								</li>
								<li className="flex items-center gap-2">
									<Search className="h-4 w-4 text-indigo-500" />
									<span>
										<strong>Manga Support:</strong> Analyze manga chapters and
										ratings
									</span>
								</li>
								<li className="flex items-center gap-2">
									<Trophy className="h-4 w-4 text-orange-500" />
									<span>
										<strong>Enhanced Data:</strong> More detailed statistics and
										vote counts
									</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
						<p className="text-sm text-yellow-800">
							<strong>Performance Note:</strong> Detailed mode directly scrapes
							MyAnimeList pages for comprehensive data. While this provides
							richer information including score distributions and manga
							support, it requires more time to process, especially for series
							with many episodes or chapters.
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5 text-indigo-500" />
						Advanced Filtering & Controls
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold mb-2">Display Controls</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>
									• <strong>Vertical Zoom:</strong> Recommended or Full range
								</li>
								<li>
									• <strong>Line Style:</strong> Monotone, bump, linear or step
								</li>
								<li>
									• <strong>Page Width:</strong> Normal or full-width layout
								</li>
								<li>
									• <strong>Data Points:</strong> Show/hide individual episode
									markers
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Episode Filtering</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>
									• <strong>Rating Threshold:</strong> Filter episodes below a
									certain rating
								</li>
								<li>
									• <strong>Highlight Mode:</strong> Emphasize high or low-rated
									episodes
								</li>
								<li>
									• <strong>Range Selection:</strong> Custom rating range (0-10)
								</li>
								<li>
									• <strong>Apply Button:</strong> Instantly update filters
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5 text-cyan-500" />
						Understanding the Data
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h4 className="font-semibold mb-2">Anime Information Display</h4>
							<div className="bg-gray-50 p-4 rounded-lg text-sm">
								<p className="mb-2">Each anime analysis shows:</p>
								<ul className="list-disc list-inside space-y-1 text-gray-600">
									<li>
										<strong>Basic Info:</strong> Title, type, episodes count,
										status
									</li>
									<li>
										<strong>Ratings:</strong> Overall score, popularity rank,
										member count
									</li>
									<li>
										<strong>Timeline:</strong> Airing dates and duration
									</li>
									<li>
										<strong>Episode Data:</strong> Individual episode ratings
										and trends
									</li>
								</ul>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Rating Scale Conversion</h4>
							<div className="bg-blue-50 p-4 rounded-lg text-sm border border-blue-200 mb-4">
								<p className="text-blue-800 mb-2">
									<strong>1-10 Scale:</strong> We convert MyAnimeList's original
									1-5 stars to a 1-10 scale.
								</p>
								<p className="text-blue-700">
									You can choose to display the ratings with 1 decimal or 2
									decimals (e.g. 8.5 or 8.54)
								</p>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Graph Interpretation</h4>
							<div className="bg-gray-50 p-4 rounded-lg text-sm">
								<ul className="list-disc list-inside space-y-1 text-gray-600">
									<li>
										<strong>X-Axis:</strong> Episode number progression
									</li>
									<li>
										<strong>Y-Axis:</strong> Episode rating (1-10 scale,
										converted from MAL's 1-5 star)
									</li>
									<li>
										<strong>Data Points:</strong> Individual episode ratings
										with hover details
									</li>
									<li>
										<strong>Trendline:</strong> Overall series rating
										progression
									</li>
									<li>
										<strong>Dotted Line:</strong> Ratings reference
									</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
