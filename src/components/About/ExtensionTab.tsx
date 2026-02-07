import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, ExternalLink, BarChart3, Star, Settings, MousePointer, Filter, Target, Users, TrendingUp, Search, Zap } from "lucide-react"

export default function ExtensionTab() {
	return (
		<div className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Chrome className="h-5 w-5 text-blue-500" />
							MAL Score Replacer Extension
						</CardTitle>
						<CardDescription>
							Transform your MyAnimeList browsing experience
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">
							A Chrome extension that enhances MyAnimeList with detailed episode ratings and statistics.
							View raw episode scores and get instant access to comprehensive data visualizations.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ExternalLink className="h-5 w-5 text-green-500" />
							Seamless Integration
						</CardTitle>
						<CardDescription>
							Clean, minimal UI that works perfectly with MAL's design
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">
							The extension integrates seamlessly with both anime and manga list pages,
							adding helpful features without disrupting your normal browsing experience.
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5 text-purple-500" />
						Key Features
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold text-lg mb-3">Enhanced Episode Ratings</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-center gap-2">
									<Star className="h-4 w-4 text-yellow-500" />
									<span>View raw episode scores instead of formatted averages</span>
								</li>
								<li className="flex items-center gap-2">
									<Settings className="h-4 w-4 text-blue-500" />
									<span>Toggle between original MAL scores and raw data</span>
								</li>
								<li className="flex items-center gap-2">
									<MousePointer className="h-4 w-4 text-green-500" />
									<span>Works on episode pages for precise data viewing</span>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-lg mb-3">Quick Stats Access</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-center gap-2">
									<BarChart3 className="h-4 w-4 text-purple-500" />
									<span>Chart icons next to anime/manga titles</span>
								</li>
								<li className="flex items-center gap-2">
									<ExternalLink className="h-4 w-4 text-indigo-500" />
									<span>Direct links to detailed episode ratings</span>
								</li>
								<li className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-orange-500" />
									<span>Instant access to comprehensive visualizations</span>
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
						Smart Filtering
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<p className="text-sm text-gray-600">
							The extension intelligently determines when to show additional features based on content type.
						</p>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold mb-2">Automatic Detection</h4>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• <strong>Series Only:</strong> Shows for anime/manga with 2+ episodes/chapters</li>
									<li>• <strong>Movie Exclusion:</strong> Automatically skips single-episode content</li>
									<li>• <strong>Smart Icons:</strong> Chart icons only appear when relevant</li>
									<li>• <strong>Clean Interface:</strong> No clutter on inappropriate pages</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold mb-2">Content Support</h4>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• <strong>Anime Series:</strong> TV shows, OVAs with multiple episodes</li>
									<li>• <strong>Manga Series:</strong> Ongoing and completed manga with multiple chapters</li>
									<li>• <strong>Episode Pages:</strong> Enhanced viewing on individual episode pages</li>
									<li>• <strong>List Pages:</strong> Quick access icons on your anime/manga lists</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5 text-red-500" />
						Perfect For
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-3 gap-6">
						<div>
							<h4 className="font-semibold mb-2 flex items-center gap-2">
								<Users className="h-4 w-4" />
								Enthusiasts
							</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Anime/manga enthusiasts seeking deeper insights</li>
								<li>• Users who want comprehensive data at their fingertips</li>
								<li>• Anyone curious about detailed episode statistics</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2 flex items-center gap-2">
								<TrendingUp className="h-4 w-4" />
								Analysts
							</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Tracking series progression and quality trends</li>
								<li>• Comparing episode performance across seasons</li>
								<li>• Analyzing rating patterns and viewer reception</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2 flex items-center gap-2">
								<Search className="h-4 w-4" />
								Researchers
							</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Content researchers and data analysts</li>
								<li>• Users building custom watchlists based on quality</li>
								<li>• Anyone studying anime/manga rating patterns</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Chrome className="h-5 w-5 text-green-500" />
						Installation & Usage
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<h4 className="font-semibold text-blue-800 mb-2">Available Now</h4>
							<p className="text-sm text-blue-700">
								MAL Score Replacer is available as a Chrome extension. Install it to enhance your MyAnimeList browsing experience today!
							</p>
						</div>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold mb-2">How to Use</h4>
								<ol className="space-y-1 text-sm text-gray-600">
									<li><strong>1.</strong> Install the Chrome extension</li>
									<li><strong>2.</strong> Visit any MyAnimeList anime or manga page</li>
									<li><strong>3.</strong> Look for chart icons next to titles</li>
									<li><strong>4.</strong> Click icons for detailed episode ratings</li>
									<li><strong>5.</strong> Toggle raw scores on episode pages</li>
								</ol>
							</div>
							<div>
								<h4 className="font-semibold mb-2">Browser Support</h4>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• <strong>Chrome:</strong> Full support with all features</li>
									<li>• <strong>Edge:</strong> Compatible via Chrome Web Store</li>
									<li>• <strong>Other Browsers:</strong> May work with Chrome extension support</li>
									<li>• <strong>Updates:</strong> Automatic updates via Chrome Web Store</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
} 