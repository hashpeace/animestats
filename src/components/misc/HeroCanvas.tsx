"use client";
import { useCallback, useEffect, useRef } from "react";

const POINT_COUNT = 32;

export function HeroCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseRef = useRef({ x: -1, y: -1, inside: false, moved: false });
	const pointsRef = useRef<number[]>([]);
	const targetPointsRef = useRef<number[]>([]);
	const sizeRef = useRef({ w: 0, h: 0 });

	// Initialize points once
	if (pointsRef.current.length === 0) {
		for (let i = 0; i < POINT_COUNT; i++) {
			const v = 0.3 + Math.random() * 0.4;
			pointsRef.current.push(v);
			targetPointsRef.current.push(v);
		}
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let raf: number;

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			sizeRef.current = { w: rect.width, h: rect.height };
		};
		resize();
		window.addEventListener("resize", resize);

		const loop = () => {
			const { w, h } = sizeRef.current;
			if (w === 0) { raf = requestAnimationFrame(loop); return; }
			ctx.clearRect(0, 0, w, h);

			const mouse = mouseRef.current;
			const segW = w / (POINT_COUNT - 1);
			const graphBottom = h * 0.88;
			const graphTop = h * 0.18;
			const graphH = graphBottom - graphTop;

			// Mouse influence: only apply when mouse is actively moving
			if (mouse.inside && mouse.moved) {
				mouse.moved = false;
				const normalY = 1 - Math.max(0, Math.min(1, (mouse.y - graphTop) / graphH));
				const mouseIdx = mouse.x / segW;
				for (let i = 0; i < POINT_COUNT; i++) {
					const dist = Math.abs(i - mouseIdx);
					if (dist < 6) {
						const influence = (1 - dist / 6) * 0.4;
						targetPointsRef.current[i] =
							normalY * influence + targetPointsRef.current[i] * (1 - influence);
					}
				}
			}

			// Continuous ambient drift — targets wander across the full 0–10 range
			for (let i = 0; i < POINT_COUNT; i++) {
				targetPointsRef.current[i] += (Math.random() - 0.5) * 0.018;
				targetPointsRef.current[i] = Math.max(0.0, Math.min(1.0, targetPointsRef.current[i]));
			}

			// Keep neighbors within 0.15 of each other (1.5 points on 0-10 scale)
			for (let i = 1; i < POINT_COUNT; i++) {
				const diff = targetPointsRef.current[i] - targetPointsRef.current[i - 1];
				if (Math.abs(diff) > 0.15) {
					targetPointsRef.current[i] = targetPointsRef.current[i - 1] + Math.sign(diff) * 0.15;
				}
			}

			// Slow ease — points glide gradually toward targets
			for (let i = 0; i < POINT_COUNT; i++) {
				pointsRef.current[i] += (targetPointsRef.current[i] - pointsRef.current[i]) * 0.015;
			}

			// Compute point positions
			const pts: { x: number; y: number }[] = [];
			for (let i = 0; i < POINT_COUNT; i++) {
				pts.push({
					x: i * segW,
					y: graphBottom - pointsRef.current[i] * graphH,
				});
			}

			// Grid lines
			ctx.strokeStyle = "rgba(0,0,0,0.025)";
			ctx.lineWidth = 1;
			for (let i = 0; i <= 5; i++) {
				const y = graphTop + (graphH * i) / 5;
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(w, y);
				ctx.stroke();
			}

			// Filled area under curve
			const gradient = ctx.createLinearGradient(0, graphTop, 0, graphBottom);
			gradient.addColorStop(0, "rgba(99,102,241,0.06)");
			gradient.addColorStop(1, "rgba(99,102,241,0.01)");
			ctx.beginPath();
			ctx.moveTo(pts[0].x, graphBottom);
			for (let i = 0; i < pts.length; i++) {
				if (i === 0) {
					ctx.lineTo(pts[i].x, pts[i].y);
				} else {
					// Smooth curve using cubic bezier
					const prev = pts[i - 1];
					const cpx = (prev.x + pts[i].x) / 2;
					ctx.bezierCurveTo(cpx, prev.y, cpx, pts[i].y, pts[i].x, pts[i].y);
				}
			}
			ctx.lineTo(pts[pts.length - 1].x, graphBottom);
			ctx.closePath();
			ctx.fillStyle = gradient;
			ctx.fill();

			// Main curve line
			ctx.beginPath();
			for (let i = 0; i < pts.length; i++) {
				if (i === 0) {
					ctx.moveTo(pts[i].x, pts[i].y);
				} else {
					const prev = pts[i - 1];
					const cpx = (prev.x + pts[i].x) / 2;
					ctx.bezierCurveTo(cpx, prev.y, cpx, pts[i].y, pts[i].x, pts[i].y);
				}
			}
			ctx.strokeStyle = "rgba(99,102,241,0.18)";
			ctx.lineWidth = 2.5;
			ctx.stroke();

			// Dots at each point
			for (let i = 0; i < pts.length; i++) {
				const hoverDist = mouse.inside
					? Math.sqrt((mouse.x - pts[i].x) ** 2 + (mouse.y - pts[i].y) ** 2)
					: 999;
				const isClose = hoverDist < 50;
				const dotR = isClose ? 3.5 : 1.8;
				const dotAlpha = isClose ? 0.4 : 0.1;

				ctx.beginPath();
				ctx.arc(pts[i].x, pts[i].y, dotR, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(99,102,241,${dotAlpha})`;
				ctx.fill();
			}

			// Tooltip on nearest point
			if (mouse.inside) {
				let nearestIdx = 0;
				let nearestDist = Infinity;
				for (let i = 0; i < pts.length; i++) {
					const d = Math.abs(mouse.x - pts[i].x);
					if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
				}

				if (nearestDist < segW * 1.5) {
					const p = pts[nearestIdx];
					const val = pointsRef.current[nearestIdx];
					const label = (val * 10).toFixed(2);

					// Vertical guide line
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(p.x, graphBottom);
					ctx.strokeStyle = "rgba(99,102,241,0.08)";
					ctx.lineWidth = 1;
					ctx.setLineDash([3, 3]);
					ctx.stroke();
					ctx.setLineDash([]);

					// Highlight dot
					ctx.beginPath();
					ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
					ctx.fillStyle = "rgba(99,102,241,0.25)";
					ctx.fill();
					ctx.beginPath();
					ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
					ctx.fillStyle = "rgba(99,102,241,0.5)";
					ctx.fill();

					// Tooltip pill
					const ty = p.y - 22;
					ctx.font = "700 11px system-ui, sans-serif";
					ctx.textAlign = "center";
					const tw = ctx.measureText(label).width + 14;
					const th = 20;

					ctx.fillStyle = "rgba(255,255,255,0.92)";
					ctx.beginPath();
					ctx.roundRect(p.x - tw / 2, ty - th / 2, tw, th, 5);
					ctx.fill();
					ctx.strokeStyle = "rgba(99,102,241,0.15)";
					ctx.lineWidth = 1;
					ctx.stroke();

					ctx.fillStyle = "#4f46e5";
					ctx.textBaseline = "middle";
					ctx.fillText(label, p.x, ty);
				}
			}

			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, []);

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		mouseRef.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			inside: true,
			moved: true,
		};
	}, []);

	const handleMouseLeave = useCallback(() => {
		mouseRef.current.inside = false;
		mouseRef.current.moved = false;
		// Gently drift back to random values
		for (let i = 0; i < POINT_COUNT; i++) {
			targetPointsRef.current[i] = 0.3 + Math.random() * 0.4;
		}
	}, []);

	const handleClick = useCallback(() => {
		for (let i = 0; i < POINT_COUNT; i++) {
			targetPointsRef.current[i] = 0.15 + Math.random() * 0.7;
		}
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full"
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
		/>
	);
}