/**
 * Title language preference for anime/manga display.
 * Maps to MAL/Jikan API fields: title_english, title (romanji), title_japanese.
 */
export type TitleLanguage = "english" | "romanji" | "native";

export interface TitleSource {
	title?: string | null;
	title_english?: string | null;
	title_japanese?: string | null;
	titles?: Array<{ type: string; title: string }>;
}

/**
 * Returns the display title for an entry based on the user's language preference.
 * Falls back to titles[] array when direct fields are missing (e.g. from MAL API).
 */
export function getDisplayTitle(
	entry: TitleSource | null | undefined,
	language: TitleLanguage,
): string {
	if (!entry) return "";

	const english =
		entry.title_english ??
		entry.titles?.find((t) => t.type === "English")?.title ??
		"";
	const romanji = entry.title ?? entry.titles?.[0]?.title ?? "";
	const native =
		entry.title_japanese ??
		entry.titles?.find((t) => t.type === "Japanese")?.title ??
		"";

	switch (language) {
		case "english":
			return (english || romanji || native).trim();
		case "romanji":
			return (romanji || english || native).trim();
		case "native":
			return (native || romanji || english).trim();
		default:
			return (romanji || english || native).trim();
	}
}
