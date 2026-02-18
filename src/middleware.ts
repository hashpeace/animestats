import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	if (
		request.nextUrl.pathname === "/episodes" &&
		request.nextUrl.searchParams.get("animeId") === "21"
	) {
		return NextResponse.redirect(
			new URL("/onepiece?redirected=true", request.url),
			308,
		);
	}
}

export const config = {
	matcher: "/episodes",
};
