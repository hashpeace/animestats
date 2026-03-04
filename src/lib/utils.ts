import { ChartConfig } from "@/components/ui/chart";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const isProduction = process.env.NODE_ENV === "production"

export const chartConfig = {
	ratingFiveStars: {
		label: "ratingFiveStars",
		color: "hsl(var(--chart-2))",
	},
	ratingAllStars: {
		label: "ratingAllStars",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;