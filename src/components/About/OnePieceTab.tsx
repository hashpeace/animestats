import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sword, Map, BarChart3, LineChart, Layers, Table, Target } from "lucide-react"

export default function OnePieceTab() {
	return (
		<div className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Sword className="h-5 w-5 text-blue-500" />
							Pre-Loaded Data
						</CardTitle>
						<CardDescription>
							Instant access to complete One Piece data
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="text-sm text-gray-600 space-y-2">
							<li>• <strong>Complete episode database</strong> with ratings and metadata</li>
							<li>• <strong>Manga chapter data</strong> for comprehensive analysis</li>
							<li>• <strong>Instant loading</strong> - no waiting for API calls</li>
							<li>• <strong>Both anime & manga</strong> analysis modes available</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Map className="h-5 w-5 text-green-500" />
							Saga & Arc Organization
						</CardTitle>
						<CardDescription>
							Structured story progression tracking
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="text-sm text-gray-600 space-y-2">
							<li>• <strong>12 major sagas</strong> from East Blue to Final Saga</li>
							<li>• <strong>Detailed arc breakdown</strong> within each saga</li>
							<li>• <strong>Episode range mapping</strong> for each story arc</li>
							<li>• <strong>Air date tracking</strong> for temporal analysis</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5 text-purple-500" />
						Enhanced Visualizations
					</CardTitle>
					<CardDescription>
						Specialized charts and analysis for One Piece
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<h4 className="font-semibold mb-2 flex items-center gap-2">
								<LineChart className="h-4 w-4" />
								Saga Analysis Charts
							</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Average ratings by saga/arc</li>
								<li>• Saga performance comparisons</li>
								<li>• Timeline-based rating trends</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2 flex items-center gap-2">
								<Layers className="h-4 w-4" />
								Arc Stacking View
							</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Visual arc progression</li>
								<li>• Rating distribution per arc</li>
								<li>• Story momentum analysis</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Table className="h-5 w-5 text-orange-500" />
						Detailed Table View
					</CardTitle>
					<CardDescription>
						Rich metadata display for every episode/chapter
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h4 className="font-semibold mb-2">Additional Columns</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• <strong>Current Saga</strong> - Which major saga each episode belongs to</li>
								<li>• <strong>Current Arc</strong> - Specific story arc for detailed tracking</li>
								<li>• <strong>Enhanced filtering</strong> by saga or arc</li>
								<li>• <strong>Filler identification</strong> with visual indicators</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2">Manga Support</h4>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Switch between anime episodes and manga chapters</li>
								<li>• Chapter-specific rating distributions</li>
								<li>• Cross-reference with anime adaptations</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5 text-red-500" />
						Story Arc Coverage
					</CardTitle>
					<CardDescription>
						Comprehensive coverage of One Piece story progression
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3 text-sm">
						<div>
							<span className="font-semibold text-blue-600">East Blue Saga:</span>
							<span className="ml-2 text-gray-600">Romance Dawn, Orange Town, Syrup Village, Baratie, Arlong Park, Loguetown</span>
						</div>
						<div>
							<span className="font-semibold text-green-600">Alabasta Saga:</span>
							<span className="ml-2 text-gray-600">Reverse Mountain, Whisky Peak, Little Garden, Drum Island, Alabasta</span>
						</div>
						<div>
							<span className="font-semibold text-purple-600">Sky Island Saga:</span>
							<span className="ml-2 text-gray-600">Jaya, Skypiea, G-8</span>
						</div>
						<div>
							<span className="font-semibold text-orange-600">Water 7 Saga:</span>
							<span className="ml-2 text-gray-600">Long Ring Long Land, Water 7, Enies Lobby, Post-Enies Lobby</span>
						</div>
						<div>
							<span className="font-semibold text-red-600">And more...</span>
							<span className="ml-2 text-gray-600">Through Wano Country and into the Final Saga</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
} 