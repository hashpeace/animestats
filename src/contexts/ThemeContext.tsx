"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	setTheme: (value: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "theme";

function updateThemeColor(theme: Theme) {
	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (metaThemeColor) {
		metaThemeColor.setAttribute(
			"content",
			theme === "dark" ? "#111111" : "#ffffff",
		);
	}
}

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	if (theme === "dark") {
		root.classList.add("dark");
	} else {
		root.classList.remove("dark");
	}
	updateThemeColor(theme);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

interface ThemeProviderProps {
	children: ReactNode;
}

function getSystemTheme(): Theme {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>("light");

	// Hydrate from localStorage, or system preference on first session
	useEffect(() => {
		if (typeof window === "undefined") return;
		const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
		if (saved === "dark" || saved === "light") {
			setThemeState(saved);
			applyTheme(saved);
		} else {
			const systemTheme = getSystemTheme();
			setThemeState(systemTheme);
			applyTheme(systemTheme);
		}
	}, []);

	const setTheme = (value: Theme) => {
		setThemeState(value);
		if (typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, value);
			applyTheme(value);
		}
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
