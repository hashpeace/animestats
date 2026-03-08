"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import type { TitleLanguage } from "@/lib/displayTitle";

const STORAGE_KEY = "title-language";

interface TitleLanguageContextType {
	titleLanguage: TitleLanguage;
	setTitleLanguage: (value: TitleLanguage) => void;
}

const TitleLanguageContext = createContext<TitleLanguageContextType | undefined>(
	undefined,
);

export function useTitleLanguage() {
	const context = useContext(TitleLanguageContext);
	if (context === undefined) {
		throw new Error("useTitleLanguage must be used within a TitleLanguageProvider");
	}
	return context;
}

interface TitleLanguageProviderProps {
	children: ReactNode;
}

export function TitleLanguageProvider({ children }: TitleLanguageProviderProps) {
	const [titleLanguage, setTitleLanguageState] = useState<TitleLanguage>("english");

	useEffect(() => {
		if (typeof window === "undefined") return;
		const saved = localStorage.getItem(STORAGE_KEY) as TitleLanguage | null;
		if (saved === "english" || saved === "romanji" || saved === "native") {
			setTitleLanguageState(saved);
		}
	}, []);

	const setTitleLanguage = (value: TitleLanguage) => {
		setTitleLanguageState(value);
		if (typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, value);
		}
	};

	return (
		<TitleLanguageContext.Provider value={{ titleLanguage, setTitleLanguage }}>
			{children}
		</TitleLanguageContext.Provider>
	);
}
