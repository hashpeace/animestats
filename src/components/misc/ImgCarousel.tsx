import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export function ImgCarousel({
	screenshots,
	className,
	accentColor,
}: {
	screenshots: { src: string }[];
	className: string;
	accentColor: string;
}) {
	const [idx, setIdx] = useState(0);
	const len = screenshots.length;

	const next = useCallback(() => setIdx((i) => (i + 1) % len), [len]);
	const prev = useCallback(() => setIdx((i) => (i - 1 + len) % len), [len]);

	// Auto-advance
	// useEffect(() => {
	//   const t = setInterval(next, 7000);
	//   return () => clearInterval(t);
	// }, [next]);

	return (
		<div className="relative group">
			<div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white">
				<div className={`relative ${className} bg-gray-100 overflow-hidden`}>
					{screenshots.map((s, i) => (
						<div
							key={s.src}
							className="absolute inset-0 transition-all duration-500 ease-in-out"
							style={{
								opacity: i === idx ? 1 : 0,
								transform: i === idx ? "scale(1)" : "scale(1.04)",
							}}
						>
							<Image src={s.src} alt={"image"} fill className="object-cover" />
						</div>
					))}
				</div>
			</div>

			{/* Navigation arrows */}
			<button
				onClick={prev}
				className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
			>
				<ChevronLeft className="w-4 h-4 text-gray-600" />
			</button>
			<button
				onClick={next}
				className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
			>
				<ChevronRight className="w-4 h-4 text-gray-600" />
			</button>

			{/* Dots + caption */}
			<div className="flex items-center justify-center gap-3 mt-4">
				<div className="flex gap-1.5">
					{screenshots.map((_, i) => (
						<button
							key={i}
							onClick={() => setIdx(i)}
							className="w-2 h-2 rounded-full transition-all duration-300"
							style={{
								backgroundColor: i === idx ? accentColor : "#d1d5db",
								transform: i === idx ? "scale(1.3)" : "scale(1)",
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export function TiltScreenshot({ src, alt }: { src: string; alt: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const [style, setStyle] = useState<React.CSSProperties>({});

	function handleMove(e: React.MouseEvent) {
		if (!ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		setStyle({
			transform: `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`,
			transition: "transform 0.1s ease-out",
		});
	}

	function handleLeave() {
		setStyle({
			transform: "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)",
			transition: "transform 0.4s ease-out",
		});
	}

	return (
		<div
			ref={ref}
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
			className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] border border-gray-200/40"
			style={style}
		>
			<div className="relative aspect-[16/11] bg-gray-100">
				<Image src={src} alt={alt} fill className="object-cover" />
			</div>
		</div>
	);
}
