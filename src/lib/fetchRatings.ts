import type { AllRatings, EpisodeInfos, ParserEpisodeInfos } from "@/types/All"
import axios from "axios"
import * as cheerio from "cheerio"

const calculateAverageRating = (ratings: EpisodeInfos["allRatings"]) => {
	let totalVotes = 0
	let totalScore = 0

	ratings.forEach(({ star, nbOfVotes }) => {
		totalVotes += nbOfVotes
		totalScore += star * nbOfVotes
	})

	return totalVotes > 0 ? totalScore / totalVotes : 0
}

export async function fetchRatings(animeId: string, episodeCount?: number, type = "anime") {
	const forumUrl = `https://myanimelist.net/forum/?${type}id=${animeId}&topic=episode`
	const forumUrlProxy = `https://corsproxy.io/?${encodeURIComponent(forumUrl)}`
	console.log("Fetching initial pages:", forumUrl)

	const forumResponse = await axios.get(forumUrlProxy)

	if (!forumResponse.data) {
		throw new Error("No data received from the forum request")
	}

	const $forum = cheerio.load(forumResponse.data)

	const pollLinks: { forumTopicUrl: string; episodeNb: number }[] = []

	const span = $forum("span.di-ib")
	const pagesText = span.first().text().trim()
	const pageCount = Number.parseInt(pagesText.match(/\((\d+)\)/)?.[1] || "1")

	// const limitedPageCount = episodeCount ? Math.min(pageCount, Math.ceil(episodeCount / 50)) + 1 : pageCount
	const limitedPageCount = episodeCount ? Math.min(pageCount, Math.ceil(episodeCount / 50)) : pageCount

	for (let page = 1; page <= limitedPageCount; page++) {
		const pageUrl = `${forumUrl}&show=${(page - 1) * 50}`
		const pageUrlProxy = `https://corsproxy.io/?${encodeURIComponent(pageUrl)}`
		const pageResponse = await axios.get(pageUrlProxy)
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
				pollLinks.push({ forumTopicUrl: `https://myanimelist.net${episodeDiscussionLink}&pollresults=1`, episodeNb })
			}
		})
	}

	console.log(`Found ${pollLinks.length} poll links`)

	const limitedPollLinks = episodeCount ? pollLinks.slice(0, episodeCount) : pollLinks

	const episodesStats: ParserEpisodeInfos[] = []

	for (const { forumTopicUrl: pollUrl, episodeNb } of limitedPollLinks) {
		console.log(`Fetching poll for episode ${episodeNb}:`, pollUrl)
		const pollUrlProxy = `https://corsproxy.io/?${encodeURIComponent(pollUrl)}`

		const pollResponse = await axios.get(pollUrlProxy)
		// const pollResponse = await axios.get(pollUrlProxy)

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
				nbOfVotes: Number.parseFloat(nbOfVotes.replace(/,/g, "")),
			})
		}

		const averageRating = calculateAverageRating(allRatings)

		if (!Number.isNaN(allRatings[0].rating)) {
			episodesStats.push({
				episodeNb,
				ratingFiveStars: allRatings.find(r => r.star === 5)?.rating || 0,
				ratingAllStars: Number.parseFloat(((Math.round(averageRating * 100) / 100) * 20).toFixed(1)),
				nbOfVotes: allRatings.reduce((sum, rating) => sum + rating.nbOfVotes, 0),
				forumTopicUrl: pollUrl,
				allRatings,
			})
		}
	}

	return episodesStats
}
