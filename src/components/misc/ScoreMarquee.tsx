export function ScoreMarquee() {
	const scores = [
		{ name: "Steins;Gate ep.22", score: "9.68" },
		{ name: "AoT S3 ep.17", score: "9.87" },
		{ name: "FMAB ep.63", score: "9.72" },
		{ name: "HxH ep.131", score: "9.81" },
		{ name: "Gintama ep.305", score: "9.75" },
		{ name: "Code Geass ep.25", score: "9.64" },
		{ name: "Mob Psycho ep.12", score: "9.55" },
		{ name: "Vinland S2 ep.24", score: "9.61" },
	];

	// Duplicate for seamless loop
	const items = [...scores, ...scores];

	return (
		<div className="relative overflow-hidden py-4">
			{/* Fade edges */}
			<div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10" />
			<div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10" />

			<div className="flex gap-3 animate-[marquee_30s_linear_infinite] w-max">
				{items.map((item, i) => (
					<div
						key={i}
						className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 whitespace-nowrap"
					>
						<span className="text-sm text-gray-600 font-medium">{item.name}</span>
						<span className="text-sm font-bold text-blue-600 tabular-nums">{item.score}</span>
					</div>
				))}
			</div>

			<style jsx>{`
		  @keyframes marquee {
			0% { transform: translateX(0); }
			100% { transform: translateX(-50%); }
		  }
		`}</style>
		</div>
	);
}