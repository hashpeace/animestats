# Anime Stats

Dive deep into anime episode ratings from MyAnimeList. Track trends, discover top-rated episodes, and analyze your favorite series like never before.

## Features

- **Episode Ratings** — Search, view per-episode ratings with interactive line charts and tables
- **Multiple Data Sources** — MyAnimeList (via Jikan API + forum scraping) and IMDb
- **Two Fetching Modes** — Simple (Jikan API only) or Detailed (scrapes MAL forum polls for 5-star breakdowns)
- **Weekly Rankings** — Track currently airing anime, compare episode scores across a season
<!-- - **One Piece Page** — Dedicated view with saga/arc breakdowns and static data for 1100+ episodes -->
- **Display Options** — Graph, table, and wrapped views with customizable chart styles, Y-axis domains, trend lines, and filters (filler/recap episodes, score thresholds)
- **Dark Mode** — Light/dark theme toggle with localStorage persistence
- **Responsive** — Mobile-friendly UI

## Tech Stack

- **Framework** — [Next.js](https://nextjs.org/)
- **Styling** — [Tailwind CSS](https://tailwindcss.com/) 4
- **UI Components** — [Shadcn](https://ui.shadcn.com/)
- **Charts** — [Recharts](https://recharts.org/)
- **Tables** — [TanStack Table](https://tanstack.com/table)
- **Data Fetching** — Axios, [Cheerio](https://cheerio.js.org/) (HTML scraping)
- **Analytics** — [PostHog](https://posthog.com/)

## Getting Started

### Prerequisites

- Node.js 20+
- yarn, npm, or pnpm

### Install

```bash
yarn install
```

### Development

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
yarn build
yarn start
```

### Lint

```bash
yarn lint
```

## Data Sources & APIs

| Source | Usage | Auth Required |
|--------|-------|---------------|
| [Jikan API](https://jikan.moe/) | Anime/manga info, episode data, ratings | No |
| MyAnimeList (scraping) | Forum poll results for detailed rating breakdowns | No |
| [IMDb API](https://imdbapi.dev/) | Alternative episode ratings | No |

## License

MIT
