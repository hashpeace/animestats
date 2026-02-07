import { performance } from "node:perf_hooks"
import type { AllRatings, EpisodeInfos, ParserEpisodeInfos } from "@/types/All"
import axios from "axios"
import * as cheerio from "cheerio"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	const calculateAverageRating = (ratings: EpisodeInfos["allRatings"]) => {
		let totalVotes = 0
		let totalScore = 0

		ratings.forEach(({ star, nbOfVotes }) => {
			totalVotes += nbOfVotes // Sum of all votes
			totalScore += star * nbOfVotes // Weighted score based on star rating
		})

		return totalVotes > 0 ? totalScore / totalVotes : 0 // Calculate average
	}

	const fetchParams = {
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
		},
	}

	try {
		const { searchParams } = new URL(request.url)
		const animeId = searchParams.get("animeId")
		const episodeCount = searchParams.get("episodeCount")
		const type = searchParams.get("type") || "anime"
		const forumUrl = `https://myanimelist.net/forum/?${type}id=${animeId}&topic=episode`
		console.log("Fetching initial pages:", forumUrl)

		const forumResponse = await axios.get(forumUrl, fetchParams)

		if (!forumResponse.data) {
			console.error("No data received from the forum request")
			return NextResponse.json({ error: "No data received from the forum request" }, { status: 500 })
		}

		const $forum = cheerio.load(forumResponse.data)

		const pollLinks: { forumTopicUrl: string; episodeNb: number }[] = []
		const fetchTimes: number[] = []
		const sampleSize = 2 // Number of episodes to sample for average fetch time

		const span = $forum("span.di-ib")
		const pagesText = span.first().text().trim()
		const pageCount = Number.parseInt(pagesText.match(/\((\d+)\)/)?.[1] || "1")
		const limitedPageCount = episodeCount ? Math.min(pageCount, Math.ceil(Number.parseInt(episodeCount) / 50)) : pageCount

		for (let page = 1; page <= limitedPageCount; page++) {
			const pageUrl = `${forumUrl}&show=${(page - 1) * 50}`
			// console.log("pageUrl", pageUrl)
			const pageResponse = await axios.get(pageUrl, fetchParams)
			if (!pageResponse.data) {
				console.error(`No data received for page ${page}`)
				continue
			}

			const $forumNextPage = cheerio.load(pageResponse.data)

			$forumNextPage('tr[id^="topicRow"]').each((_, row) => {
				const episodeDiscussionLink = $forum(row).find("td:nth-child(2) a").attr("href")
				const episodeDiscussionText = $forum(row).find("td:nth-child(2) a").first().text()
				const episodeMatch = episodeDiscussionText.match(/(?:Episode|Chapter)\s+(\d+)(?:\s+Discussion)?/i)
				if (episodeMatch?.[1]) {
					const episodeNb = Number.parseInt(episodeMatch[1], 10)
					// console.log("episode", episode)
					pollLinks.push({ forumTopicUrl: `https://myanimelist.net${episodeDiscussionLink}&pollresults=1`, episodeNb })
				}
			})
		}

		console.log(`Found ${pollLinks.length} poll links`)

		// Calculate average fetch time for a sample of episodes
		for (let i = 0; i < Math.min(sampleSize, pollLinks.length); i++) {
			const { forumTopicUrl } = pollLinks[i]
			const startTime = performance.now()
			await axios.get(forumTopicUrl, fetchParams)
			const endTime = performance.now()
			fetchTimes.push(endTime - startTime)
		}

		// Limit the number of episodes if episodeCount is provided
		const limitedPollLinks = episodeCount ? pollLinks.slice(0, Number.parseInt(episodeCount)) : pollLinks

		const averageFetchTime = fetchTimes.reduce((a, b) => a + b, 0) / fetchTimes.length
		const estimatedTotalTime = (averageFetchTime * limitedPollLinks.length) / 1000 // in seconds

		// Send the estimated time immediately
		const stream = new TransformStream()
		const writer = stream.writable.getWriter()
		const encoder = new TextEncoder()

		writer.write(encoder.encode(JSON.stringify({ estimatedTotalTime: Number.parseFloat(estimatedTotalTime.toFixed(2)) })))

		// Start processing episodes
		const processEpisodes = async () => {
			const episodesStats: ParserEpisodeInfos[] = []

			for (let i = 0; i < limitedPollLinks.length; i++) {
				// if (i > 0 && i % 4 === 0 && isProduction) {
				// 	await new Promise(resolve => setTimeout(resolve, 5000)) // Wait for 5 seconds every 4 iterations (on prod only, to avoid Vercel rate limiting)
				// }

				const { forumTopicUrl: pollUrl, episodeNb } = limitedPollLinks[i]
				console.log(`Fetching poll for episode ${episodeNb}:`, pollUrl)

				const pollResponse = await axios.get(pollUrl, fetchParams)

				if (!pollResponse.data) {
					console.error(`No data received from poll for episode ${episodeNb}`)
					continue
				}

				const $poll = cheerio.load(pollResponse.data)

				const allRatings: AllRatings[] = []
				for (let i = 0; i <= 5 - 1; i++) {
					const option = $poll(".topic-poll-result .topic-poll-option").eq(i)
					const rating = option.find(".ratio").text().trim()
					const nbOfVotes = option.find(".number").text().trim()

					allRatings.push({
						star: 5 - i,
						rating: Number.parseFloat(rating),
						nbOfVotes: Number.parseFloat(nbOfVotes.replace(/,/g, "")), // Remove commas and convert to number
					})
				}
				// console.log("allRatings", allRatings)
				// console.log("ratings", ratings)

				const averageRating = calculateAverageRating(allRatings)
				//   console.log(`The average rating is: ${averageRating}`);
				if (Number.isNaN(allRatings[0].rating)) {
					// console.log(`Invalid rating found for episode ${episode}: "${ratings[0].rating}"`)
				} else {
					// Assuming episodesList is not needed anymore, we don't fetch it and hence we don't have episodeInfo
					episodesStats.push({
						episodeNb,
						ratingFiveStars: allRatings.find(r => r.star === 5)?.rating || 0,
						ratingAllStars: Number.parseFloat(((Math.round(averageRating * 100) / 100) * 20).toFixed(1)), // Return the transformed entry as a number (on a scale of 100)
						// ratingAllStars: parseFloat((Math.round(averageRating * 100) / 100).toFixed(2)), // Return the transformed entry as a number (on a scale of 5)
						// ratingAllStarsRounded: parseFloat(averageRating.toFixed(1))*20 || undefined,
						nbOfVotes: allRatings.reduce((sum, rating) => sum + rating.nbOfVotes, 0),
						forumTopicUrl: pollUrl,
						allRatings,
					})
				}
			}

			// Write the final results
			writer.write(encoder.encode(JSON.stringify({ episodesStats })))
			writer.close()
		}

		// Start processing episodes without waiting for it to finish
		processEpisodes()

		// Return the stream immediately
		return new NextResponse(stream.readable, {
			headers: { "Content-Type": "application/json" },
		})
	} catch (error) {
		// console.error("Detailed error:", error)
		if (axios.isAxiosError(error)) {
			console.error("Axios error details:", error.response?.data.statusMessage)
		}
		return NextResponse.json({ error: "An error occurred while fetching data.", details: error }, { status: 500 })
		// return NextResponse.json({ error: "An error occurred while fetching data.", details: error.response?.data.statusMessage }, { status: 500 })
	}
}
