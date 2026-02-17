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

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	if (theme === "dark") {
		root.classList.add("dark");
	} else {
		root.classList.remove("dark");
	}
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

export function ThemeProvider({ children }: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>("light");

	// Hydrate from localStorage and apply to document
	useEffect(() => {
		if (typeof window === "undefined") return;
		const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
		if (saved === "dark" || saved === "light") {
			setThemeState(saved);
			applyTheme(saved);
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
