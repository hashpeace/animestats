import type { EpisodeInfos, ParserEpisodeInfos } from "@/types/All"

// Using this to get chapter titles https://listfist.com/list-of-one-piece-manga-chapters

export const onePieceSagasChapters = (results: EpisodeInfos[]) => {
	const totalChapters = results.length
	const chapterMap = Object.fromEntries(results.map(ep => [ep.episodeNb, ep.aired]))

	return [
		{
			saga: "East Blue",
			story_arcs: [
				{ arc: "Romance Dawn", episodesOrChapters: "1—7", volumes: "1" },
				{ arc: "Orange Town", episodesOrChapters: "8—21", volumes: "1—3" },
				{ arc: "Syrup Village", episodesOrChapters: "22—41", volumes: "3—5" },
				{ arc: "Baratie", episodesOrChapters: "42—68", volumes: "5—8" },
				{ arc: "Arlong Park", episodesOrChapters: "69—95", volumes: "8—11" },
				{ arc: "Loguetown", episodesOrChapters: "96—100", volumes: "11—12" }
			],
		},
		{
			saga: "Arabasta",
			story_arcs: [
				{ arc: "Reverse Mountain", episodesOrChapters: "101—105", volumes: "12" },
				{ arc: "Whisky Peak", episodesOrChapters: "106—114", volumes: "12—13" },
				{ arc: "Little Garden", episodesOrChapters: "115—129", volumes: "13—15" },
				{ arc: "Drum Island", episodesOrChapters: "130—154", volumes: "15—17" },
				{ arc: "Alabasta", episodesOrChapters: "155—217", volumes: "17—24" }
			],
		},
		{
			saga: "Sky Island",
			story_arcs: [
				{ arc: "Jaya", episodesOrChapters: "218—236", volumes: "24—25" },
				{ arc: "Skypiea", episodesOrChapters: "237—302", volumes: "26—32" }
			],
		},
		{
			saga: "Water 7",
			story_arcs: [
				{ arc: "Long Ring Long Land", episodesOrChapters: "303—321", volumes: "32—34" },
				{ arc: "Water 7", episodesOrChapters: "322—374", volumes: "34—39" },
				{ arc: "Enies Lobby", episodesOrChapters: "375—430", volumes: "39—44" },
				{ arc: "Post-Enies Lobby", episodesOrChapters: "431—441", volumes: "45—46" }
			],
		},
		{
			saga: "Thriller Bark",
			story_arcs: [
				{ arc: "Thriller Bark", episodesOrChapters: "442—489", volumes: "46—50" }
			],
		},
		{
			saga: "Summit War",
			story_arcs: [
				{ arc: "Sabaody Archipelago", episodesOrChapters: "490—513", volumes: "50—53" },
				{ arc: "Amazon Lily", episodesOrChapters: "514—524", volumes: "53—54" },
				{ arc: "Impel Down", episodesOrChapters: "525—549", volumes: "54—56" },
				{ arc: "Marineford", episodesOrChapters: "550—580", volumes: "56—59" },
				{ arc: "Post-War", episodesOrChapters: "581—597", volumes: "59—61" }
			]
		},
		{
			saga: "Fish-Man Island",
			story_arcs: [
				{ arc: "Return-Sabaody", episodesOrChapters: "598—602", volumes: "61" },
				{ arc: "Fish-Man Island", episodesOrChapters: "603—653", volumes: "61—66" }
			],
		},
		{
			saga: "Dressrosa",
			story_arcs: [
				{ arc: "Punk Hazard", episodesOrChapters: "654—699", volumes: "66—70" },
				{ arc: "Dressrosa", episodesOrChapters: "700—801", volumes: "70—80" }
			],
		},
		{
			saga: "Whole Cake Island",
			story_arcs: [
				{ arc: "Zou", episodesOrChapters: "802—824", volumes: "80—82" },
				{ arc: "Whole Cake Island", episodesOrChapters: "825—902", volumes: "82—90" },
				{ arc: "Levely", episodesOrChapters: "903—908", volumes: "90" }
			],
		},
		{
			saga: "Wano Country",
			story_arcs: [
				{ arc: "Wano Country", episodesOrChapters: "909—1057", volumes: "90—105" }
			],
		},
		{
			saga: "Final",
			story_arcs: [
				{ arc: "Egghead", episodesOrChapters: "1058—1125", volumes: "105—111" },
				{ arc: "Elbaph", episodesOrChapters: `1126—${totalChapters}`, volumes: "111—Current" }
			]
		}
	].map(saga => {
		const updatedStoryArcs = saga.story_arcs.map(arc => {
			const chapterRanges = arc.episodesOrChapters.split(",").map(range => range.trim())
			const airedDates = chapterRanges.flatMap(range => {
				const [start, end] = range.split("—").map(ep => Number.parseInt(ep))
				return Array.from({ length: end - start + 1 }, (_, i) => chapterMap[start + i])
			})

			const validAiredDates = airedDates.map(date => new Date(date)).filter(date => !Number.isNaN(date.getTime()))

			return {
				...arc,
				minAiredDate:
					validAiredDates.length > 0 ? new Date(Math.min(...validAiredDates.map(date => date.getTime()))).toISOString().split("T")[0] : null,
				maxAiredDate:
					validAiredDates.length > 0 ? new Date(Math.max(...validAiredDates.map(date => date.getTime()))).toISOString().split("T")[0] : null,
			}
		})

		const sagaAiredDates = updatedStoryArcs.flatMap(arc => [arc.minAiredDate, arc.maxAiredDate])
		const validDates = sagaAiredDates.filter(date => date !== null && !Number.isNaN(new Date(date).getTime()))

		return {
			...saga,
			story_arcs: updatedStoryArcs,
			minAiredDate: validDates.length > 0 ? new Date(Math.min(...validDates.filter(date => date !== null).map(date => new Date(date).getTime()))).toISOString().split("T")[0] : undefined,
			maxAiredDate: validDates.length > 0 ? new Date(Math.max(...validDates.filter(date => date !== null).map(date => new Date(date).getTime()))).toISOString().split("T")[0] : undefined,
		}
	})
}

export const onePieceChapters = [
	{
		"episodeNb": 1,
		"ratingFiveStars": 41.9,
		"ratingAllStars": 80,
		"nbOfVotes": 1503,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=128096&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 41.9, "nbOfVotes": 630 },
			{ "star": 4, "rating": 38.2, "nbOfVotes": 574 },
			{ "star": 3, "rating": 7, "nbOfVotes": 105 },
			{ "star": 2, "rating": 3.9, "nbOfVotes": 58 },
			{ "star": 1, "rating": 9, "nbOfVotes": 136 }
		],
		"title": "Romance Dawn - The Dawn of the Adventure",
		"aired": "1997-07-19T00:00:00+00:00",
		"score": 4
	},
	{
		"episodeNb": 2,
		"ratingFiveStars": 44.7,
		"ratingAllStars": 84.8,
		"nbOfVotes": 409,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152498&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 44.7, "nbOfVotes": 183 },
			{ "star": 4, "rating": 41.8, "nbOfVotes": 171 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 35 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 12 },
			{ "star": 1, "rating": 2, "nbOfVotes": 8 }
		],
		"title": "That Guy, \"Straw Hat Luffy\"",
		"aired": "1997-07-28T00:00:00+00:00",
		"score": 4.24
	},
	{
		"episodeNb": 3,
		"ratingFiveStars": 46.6,
		"ratingAllStars": 85.4,
		"nbOfVotes": 234,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152500&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 46.6, "nbOfVotes": 109 },
			{ "star": 4, "rating": 40.2, "nbOfVotes": 94 },
			{ "star": 3, "rating": 9, "nbOfVotes": 21 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 6 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 4 }
		],
		"title": "Introducing \"Pirate Hunter Zoro\"",
		"aired": "1997-08-04T00:00:00+00:00",
		"score": 4.2700000000000005
	},
	{
		"episodeNb": 4,
		"ratingFiveStars": 49.2,
		"ratingAllStars": 84.4,
		"nbOfVotes": 197,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152501&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.2, "nbOfVotes": 97 },
			{ "star": 4, "rating": 34.5, "nbOfVotes": 68 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 17 },
			{ "star": 2, "rating": 4.1, "nbOfVotes": 8 },
			{ "star": 1, "rating": 3.6, "nbOfVotes": 7 }
		],
		"title": "Marine Captain \"Axe-Hand Morgan\"",
		"aired": "1997-08-11T00:00:00+00:00",
		"score": 4.220000000000001
	},
	{
		"episodeNb": 5,
		"ratingFiveStars": 48.7,
		"ratingAllStars": 85.8,
		"nbOfVotes": 191,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152505&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 48.7, "nbOfVotes": 93 },
			{ "star": 4, "rating": 38.7, "nbOfVotes": 74 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 15 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 5 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 4 }
		],
		"title": "Pirate King and Master Swordsman",
		"aired": "1997-08-25T00:00:00+00:00",
		"score": 4.29
	},
	{
		"episodeNb": 6,
		"ratingFiveStars": 46.8,
		"ratingAllStars": 85.8,
		"nbOfVotes": 154,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152507&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 46.8, "nbOfVotes": 72 },
			{ "star": 4, "rating": 41.6, "nbOfVotes": 64 },
			{ "star": 3, "rating": 6.5, "nbOfVotes": 10 },
			{ "star": 2, "rating": 3.9, "nbOfVotes": 6 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 2 }
		],
		"title": "The First Crew Member",
		"aired": "1997-09-01T00:00:00+00:00",
		"score": 4.29
	},
	{
		"episodeNb": 7,
		"ratingFiveStars": 49.7,
		"ratingAllStars": 86,
		"nbOfVotes": 171,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152509&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.7, "nbOfVotes": 85 },
			{ "star": 4, "rating": 38, "nbOfVotes": 65 },
			{ "star": 3, "rating": 7.6, "nbOfVotes": 13 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 4 }
		],
		"title": "Friends",
		"aired": "1997-09-08T00:00:00+00:00",
		"score": 4.3
	},
	{
		"episodeNb": 8,
		"ratingFiveStars": 43.2,
		"ratingAllStars": 84.6,
		"nbOfVotes": 213,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152511&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 43.2, "nbOfVotes": 92 },
			{ "star": 4, "rating": 41.8, "nbOfVotes": 89 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 22 },
			{ "star": 2, "rating": 4.2, "nbOfVotes": 9 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Introducing Nami",
		"aired": "1997-09-13T00:00:00+00:00",
		"score": 4.2299999999999995
	},
	{
		"episodeNb": 9,
		"ratingFiveStars": 45.4,
		"ratingAllStars": 86.2,
		"nbOfVotes": 163,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152514&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 45.4, "nbOfVotes": 74 },
			{ "star": 4, "rating": 42.9, "nbOfVotes": 70 },
			{ "star": 3, "rating": 9.2, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "The Devil Girl",
		"aired": "1997-09-22T00:00:00+00:00",
		"score": 4.3100000000000005
	},
	{
		"episodeNb": 10,
		"ratingFiveStars": 28.5,
		"ratingAllStars": 81.2,
		"nbOfVotes": 1069,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152516&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 28.5, "nbOfVotes": 305 },
			{ "star": 4, "rating": 56.7, "nbOfVotes": 606 },
			{ "star": 3, "rating": 7.7, "nbOfVotes": 82 },
			{ "star": 2, "rating": 6.1, "nbOfVotes": 65 },
			{ "star": 1, "rating": 1, "nbOfVotes": 11 }
		],
		"title": "The Incident at the Bar",
		"aired": "1997-09-29T00:00:00+00:00",
		"score": 4.0600000000000005
	},
	{
		"episodeNb": 11,
		"ratingFiveStars": 25.2,
		"ratingAllStars": 80,
		"nbOfVotes": 453,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152517&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 25.2, "nbOfVotes": 114 },
			{ "star": 4, "rating": 59.6, "nbOfVotes": 270 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 36 },
			{ "star": 2, "rating": 4.2, "nbOfVotes": 19 },
			{ "star": 1, "rating": 3.1, "nbOfVotes": 14 }
		],
		"title": "Take Flight",
		"aired": "1997-10-06T00:00:00+00:00",
		"score": 4
	},
	{
		"episodeNb": 12,
		"ratingFiveStars": 49.6,
		"ratingAllStars": 88,
		"nbOfVotes": 119,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152518&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.6, "nbOfVotes": 59 },
			{ "star": 4, "rating": 42.9, "nbOfVotes": 51 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Dog",
		"aired": "1997-10-13T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 13,
		"ratingFiveStars": 58.3,
		"ratingAllStars": 88,
		"nbOfVotes": 120,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152519&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.3, "nbOfVotes": 70 },
			{ "star": 4, "rating": 27.5, "nbOfVotes": 33 },
			{ "star": 3, "rating": 10.8, "nbOfVotes": 13 },
			{ "star": 2, "rating": 2.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Treasure",
		"aired": "1997-10-20T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 14,
		"ratingFiveStars": 44.6,
		"ratingAllStars": 86.8,
		"nbOfVotes": 92,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152522&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 44.6, "nbOfVotes": 41 },
			{ "star": 4, "rating": 45.7, "nbOfVotes": 42 },
			{ "star": 3, "rating": 8.7, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Reckless!!",
		"aired": "1997-10-27T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 15,
		"ratingFiveStars": 51,
		"ratingAllStars": 86.8,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152523&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51, "nbOfVotes": 52 },
			{ "star": 4, "rating": 38.2, "nbOfVotes": 39 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 6 },
			{ "star": 2, "rating": 3.9, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Gong",
		"aired": "1997-11-01T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 16,
		"ratingFiveStars": 50,
		"ratingAllStars": 86.6,
		"nbOfVotes": 92,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152525&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50, "nbOfVotes": 46 },
			{ "star": 4, "rating": 34.8, "nbOfVotes": 32 },
			{ "star": 3, "rating": 14.1, "nbOfVotes": 13 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Versus!! The Buggy Pirate Crew",
		"aired": "1997-11-10T00:00:00+00:00",
		"score": 4.33
	},
	{
		"episodeNb": 17,
		"ratingFiveStars": 53.5,
		"ratingAllStars": 87,
		"nbOfVotes": 129,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152526&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.5, "nbOfVotes": 69 },
			{ "star": 4, "rating": 32.6, "nbOfVotes": 42 },
			{ "star": 3, "rating": 10.1, "nbOfVotes": 13 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Character",
		"aired": "1997-11-17T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 18,
		"ratingFiveStars": 52.2,
		"ratingAllStars": 88.2,
		"nbOfVotes": 92,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152528&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52.2, "nbOfVotes": 48 },
			{ "star": 4, "rating": 40.2, "nbOfVotes": 37 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 3.3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate \"Buggy the Clown\"",
		"aired": "1997-11-22T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 19,
		"ratingFiveStars": 50.6,
		"ratingAllStars": 87.4,
		"nbOfVotes": 83,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152529&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50.6, "nbOfVotes": 42 },
			{ "star": 4, "rating": 38.6, "nbOfVotes": 32 },
			{ "star": 3, "rating": 8.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Devil Fruit",
		"aired": "1997-12-01T00:00:00+00:00",
		"score": 4.37
	},
	{
		"episodeNb": 20,
		"ratingFiveStars": 57.8,
		"ratingAllStars": 89,
		"nbOfVotes": 109,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152530&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.8, "nbOfVotes": 63 },
			{ "star": 4, "rating": 33, "nbOfVotes": 36 },
			{ "star": 3, "rating": 6.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "A Thief's Philosophy",
		"aired": "1997-12-08T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 21,
		"ratingFiveStars": 50.4,
		"ratingAllStars": 86.6,
		"nbOfVotes": 129,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152531&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50.4, "nbOfVotes": 65 },
			{ "star": 4, "rating": 36.4, "nbOfVotes": 47 },
			{ "star": 3, "rating": 10.1, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Town",
		"aired": "1997-12-22T00:00:00+00:00",
		"score": 4.33
	},
	{
		"episodeNb": 22,
		"ratingFiveStars": 49.2,
		"ratingAllStars": 85,
		"nbOfVotes": 118,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152753&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.2, "nbOfVotes": 58 },
			{ "star": 4, "rating": 31.4, "nbOfVotes": 37 },
			{ "star": 3, "rating": 16.1, "nbOfVotes": 19 },
			{ "star": 2, "rating": 2.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "You're the Rare Breed",
		"aired": "1998-01-05T00:00:00+00:00",
		"score": 4.25
	},
	{
		"episodeNb": 23,
		"ratingFiveStars": 43.7,
		"ratingAllStars": 85,
		"nbOfVotes": 103,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152762&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 43.7, "nbOfVotes": 45 },
			{ "star": 4, "rating": 40.8, "nbOfVotes": 42 },
			{ "star": 3, "rating": 13.6, "nbOfVotes": 14 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Captain Usopp Appears",
		"aired": "1998-01-12T00:00:00+00:00",
		"score": 4.25
	},
	{
		"episodeNb": 24,
		"ratingFiveStars": 45.4,
		"ratingAllStars": 85.8,
		"nbOfVotes": 97,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152766&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 45.4, "nbOfVotes": 44 },
			{ "star": 4, "rating": 41.2, "nbOfVotes": 40 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Things That Can't Be Faked",
		"aired": "1998-01-19T00:00:00+00:00",
		"score": 4.29
	},
	{
		"episodeNb": 25,
		"ratingFiveStars": 52.9,
		"ratingAllStars": 87.8,
		"nbOfVotes": 104,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152772&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52.9, "nbOfVotes": 55 },
			{ "star": 4, "rating": 35.6, "nbOfVotes": 37 },
			{ "star": 3, "rating": 9.6, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "800 Lies",
		"aired": "1998-01-26T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 26,
		"ratingFiveStars": 45.2,
		"ratingAllStars": 84.8,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152773&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 45.2, "nbOfVotes": 52 },
			{ "star": 4, "rating": 39.1, "nbOfVotes": 45 },
			{ "star": 3, "rating": 11.3, "nbOfVotes": 13 },
			{ "star": 2, "rating": 3.5, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Captain Kuro's Plan",
		"aired": "1998-02-02T00:00:00+00:00",
		"score": 4.24
	},
	{
		"episodeNb": 27,
		"ratingFiveStars": 51.2,
		"ratingAllStars": 85.8,
		"nbOfVotes": 84,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152785&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.2, "nbOfVotes": 43 },
			{ "star": 4, "rating": 32.1, "nbOfVotes": 27 },
			{ "star": 3, "rating": 10.7, "nbOfVotes": 9 },
			{ "star": 2, "rating": 6, "nbOfVotes": 5 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Plan",
		"aired": "1998-02-09T00:00:00+00:00",
		"score": 4.29
	},
	{
		"episodeNb": 28,
		"ratingFiveStars": 51.3,
		"ratingAllStars": 88.6,
		"nbOfVotes": 80,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153113&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.3, "nbOfVotes": 41 },
			{ "star": 4, "rating": 40, "nbOfVotes": 32 },
			{ "star": 3, "rating": 8.8, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Crescent Moon",
		"aired": "1998-02-16T00:00:00+00:00",
		"score": 4.43
	},
	{
		"episodeNb": 29,
		"ratingFiveStars": 57.1,
		"ratingAllStars": 89,
		"nbOfVotes": 77,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153116&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.1, "nbOfVotes": 44 },
			{ "star": 4, "rating": 32.5, "nbOfVotes": 25 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Hill Road",
		"aired": "1998-02-23T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 30,
		"ratingFiveStars": 51.4,
		"ratingAllStars": 87.6,
		"nbOfVotes": 111,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153130&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.4, "nbOfVotes": 57 },
			{ "star": 4, "rating": 38.7, "nbOfVotes": 43 },
			{ "star": 3, "rating": 7.2, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Great!!!",
		"aired": "1998-03-02T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 31,
		"ratingFiveStars": 50.7,
		"ratingAllStars": 87.6,
		"nbOfVotes": 69,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153147&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50.7, "nbOfVotes": 35 },
			{ "star": 4, "rating": 37.7, "nbOfVotes": 26 },
			{ "star": 3, "rating": 10.1, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Truth",
		"aired": "1998-03-09T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 32,
		"ratingFiveStars": 45.6,
		"ratingAllStars": 86.2,
		"nbOfVotes": 90,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153150&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 45.6, "nbOfVotes": 41 },
			{ "star": 4, "rating": 42.2, "nbOfVotes": 38 },
			{ "star": 3, "rating": 10, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Disaster",
		"aired": "1998-03-16T00:00:00+00:00",
		"score": 4.3100000000000005
	},
	{
		"episodeNb": 33,
		"ratingFiveStars": 61.1,
		"ratingAllStars": 89.4,
		"nbOfVotes": 72,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153158&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.1, "nbOfVotes": 44 },
			{ "star": 4, "rating": 27.8, "nbOfVotes": 20 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Silent Man",
		"aired": "1998-03-23T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 34,
		"ratingFiveStars": 62.3,
		"ratingAllStars": 90.4,
		"nbOfVotes": 69,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153161&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.3, "nbOfVotes": 43 },
			{ "star": 4, "rating": 29, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Klahadore the Butler",
		"aired": "1998-03-30T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 35,
		"ratingFiveStars": 57.4,
		"ratingAllStars": 89.4,
		"nbOfVotes": 101,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153168&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.4, "nbOfVotes": 58 },
			{ "star": 4, "rating": 32.7, "nbOfVotes": 33 },
			{ "star": 3, "rating": 8.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Neo Hill Road",
		"aired": "1998-04-06T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 36,
		"ratingFiveStars": 55.1,
		"ratingAllStars": 89.8,
		"nbOfVotes": 69,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153535&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.1, "nbOfVotes": 38 },
			{ "star": 4, "rating": 39.1, "nbOfVotes": 27 },
			{ "star": 3, "rating": 5.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Follow Them!!",
		"aired": "1998-04-13T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 37,
		"ratingFiveStars": 58.8,
		"ratingAllStars": 89,
		"nbOfVotes": 80,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153611&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.8, "nbOfVotes": 47 },
			{ "star": 4, "rating": 31.3, "nbOfVotes": 25 },
			{ "star": 3, "rating": 7.5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 1 }
		],
		"title": "The Pirate, \"Kuro of a Hundred Plans\"",
		"aired": "1998-04-20T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 38,
		"ratingFiveStars": 62.9,
		"ratingAllStars": 90.2,
		"nbOfVotes": 70,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=156904&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.9, "nbOfVotes": 44 },
			{ "star": 4, "rating": 27.1, "nbOfVotes": 19 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Crew",
		"aired": "1998-04-27T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 39,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 92,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=156905&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 38 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "For Whom the Bell Tolls",
		"aired": "1998-05-11T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 40,
		"ratingFiveStars": 64.7,
		"ratingAllStars": 89.4,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=156907&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.7, "nbOfVotes": 66 },
			{ "star": 4, "rating": 25.5, "nbOfVotes": 26 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 3 }
		],
		"title": "The Usopp Pirates",
		"aired": "1998-05-18T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 41,
		"ratingFiveStars": 67.2,
		"ratingAllStars": 91.8,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=156909&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.2, "nbOfVotes": 78 },
			{ "star": 4, "rating": 25.9, "nbOfVotes": 30 },
			{ "star": 3, "rating": 6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "To the Sea",
		"aired": "1998-05-25T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 42,
		"ratingFiveStars": 39,
		"ratingAllStars": 84.2,
		"nbOfVotes": 77,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=156911&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 39, "nbOfVotes": 30 },
			{ "star": 4, "rating": 45.5, "nbOfVotes": 35 },
			{ "star": 3, "rating": 13, "nbOfVotes": 10 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Yosaku and Johnny",
		"aired": "1998-06-01T00:00:00+00:00",
		"score": 4.21
	},
	{
		"episodeNb": 43,
		"ratingFiveStars": 64.8,
		"ratingAllStars": 90.6,
		"nbOfVotes": 88,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=157140&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.8, "nbOfVotes": 57 },
			{ "star": 4, "rating": 25, "nbOfVotes": 22 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Introducing Sanji",
		"aired": "1998-06-08T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 44,
		"ratingFiveStars": 56.6,
		"ratingAllStars": 88.4,
		"nbOfVotes": 122,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=157154&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.6, "nbOfVotes": 69 },
			{ "star": 4, "rating": 35.2, "nbOfVotes": 43 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 3.3, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Three Cooks",
		"aired": "1998-06-15T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 45,
		"ratingFiveStars": 53.3,
		"ratingAllStars": 86.2,
		"nbOfVotes": 90,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=157164&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.3, "nbOfVotes": 48 },
			{ "star": 4, "rating": 31.1, "nbOfVotes": 28 },
			{ "star": 3, "rating": 10, "nbOfVotes": 9 },
			{ "star": 2, "rating": 4.4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Before the Storm",
		"aired": "1998-06-22T00:00:00+00:00",
		"score": 4.3100000000000005
	},
	{
		"episodeNb": 46,
		"ratingFiveStars": 55.4,
		"ratingAllStars": 89.8,
		"nbOfVotes": 74,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=157168&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.4, "nbOfVotes": 41 },
			{ "star": 4, "rating": 37.8, "nbOfVotes": 28 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "An Uninvited Guest",
		"aired": "1998-06-29T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 47,
		"ratingFiveStars": 54.5,
		"ratingAllStars": 87.8,
		"nbOfVotes": 77,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=157170&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.5, "nbOfVotes": 42 },
			{ "star": 4, "rating": 31.2, "nbOfVotes": 24 },
			{ "star": 3, "rating": 13, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Fleet Admiral \"Don Krieg\"",
		"aired": "1998-07-06T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 48,
		"ratingFiveStars": 51.6,
		"ratingAllStars": 87.2,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=157173&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.6, "nbOfVotes": 33 },
			{ "star": 4, "rating": 34.4, "nbOfVotes": 22 },
			{ "star": 3, "rating": 12.5, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Leave That Path Alone",
		"aired": "1998-07-13T00:00:00+00:00",
		"score": 4.36
	},
	{
		"episodeNb": 49,
		"ratingFiveStars": 53.8,
		"ratingAllStars": 89,
		"nbOfVotes": 65,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244937&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.8, "nbOfVotes": 35 },
			{ "star": 4, "rating": 36.9, "nbOfVotes": 24 },
			{ "star": 3, "rating": 9.2, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Storm",
		"aired": "1998-07-18T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 50,
		"ratingFiveStars": 60.2,
		"ratingAllStars": 91.2,
		"nbOfVotes": 93,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244938&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.2, "nbOfVotes": 56 },
			{ "star": 4, "rating": 35.5, "nbOfVotes": 33 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Every One is a Road",
		"aired": "1998-07-27T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 51,
		"ratingFiveStars": 70.7,
		"ratingAllStars": 93,
		"nbOfVotes": 82,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244939&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.7, "nbOfVotes": 58 },
			{ "star": 4, "rating": 24.4, "nbOfVotes": 20 },
			{ "star": 3, "rating": 3.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Roronoa Zoro Falls Into the Sea",
		"aired": "1998-08-03T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 52,
		"ratingFiveStars": 70.8,
		"ratingAllStars": 92.8,
		"nbOfVotes": 96,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244940&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.8, "nbOfVotes": 68 },
			{ "star": 4, "rating": 24, "nbOfVotes": 23 },
			{ "star": 3, "rating": 4.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "The Oath",
		"aired": "1998-08-10T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 53,
		"ratingFiveStars": 56.6,
		"ratingAllStars": 88,
		"nbOfVotes": 99,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244941&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.6, "nbOfVotes": 56 },
			{ "star": 4, "rating": 31.3, "nbOfVotes": 31 },
			{ "star": 3, "rating": 8.1, "nbOfVotes": 8 },
			{ "star": 2, "rating": 4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sabagashira No. 1",
		"aired": "1998-08-24T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 54,
		"ratingFiveStars": 46.1,
		"ratingAllStars": 85.6,
		"nbOfVotes": 76,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244947&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 46.1, "nbOfVotes": 35 },
			{ "star": 4, "rating": 38.2, "nbOfVotes": 29 },
			{ "star": 3, "rating": 13.2, "nbOfVotes": 10 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pearl-san",
		"aired": "1998-08-31T00:00:00+00:00",
		"score": 4.279999999999999
	},
	{
		"episodeNb": 55,
		"ratingFiveStars": 51.6,
		"ratingAllStars": 87.6,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244948&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.6, "nbOfVotes": 33 },
			{ "star": 4, "rating": 37.5, "nbOfVotes": 24 },
			{ "star": 3, "rating": 7.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Jungle Blood",
		"aired": "1998-09-07T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 56,
		"ratingFiveStars": 50,
		"ratingAllStars": 88,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244950&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50, "nbOfVotes": 29 },
			{ "star": 4, "rating": 39.7, "nbOfVotes": 23 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "No Way",
		"aired": "1998-09-14T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 57,
		"ratingFiveStars": 61.5,
		"ratingAllStars": 90.4,
		"nbOfVotes": 52,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244951&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.5, "nbOfVotes": 32 },
			{ "star": 4, "rating": 30.8, "nbOfVotes": 16 },
			{ "star": 3, "rating": 5.8, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Because of Dreams",
		"aired": "1998-09-21T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 58,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 93,
		"nbOfVotes": 77,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244952&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 55 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 18 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Old Fart",
		"aired": "1998-09-28T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 59,
		"ratingFiveStars": 56.4,
		"ratingAllStars": 88,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244953&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.4, "nbOfVotes": 31 },
			{ "star": 4, "rating": 30.9, "nbOfVotes": 17 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 5 },
			{ "star": 2, "rating": 3.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Obligation",
		"aired": "1998-10-05T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 60,
		"ratingFiveStars": 43.6,
		"ratingAllStars": 86.2,
		"nbOfVotes": 101,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244954&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 43.6, "nbOfVotes": 44 },
			{ "star": 4, "rating": 45.5, "nbOfVotes": 46 },
			{ "star": 3, "rating": 8.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Between Right and Wrong",
		"aired": "1998-10-12T00:00:00+00:00",
		"score": 4.3100000000000005
	},
	{
		"episodeNb": 61,
		"ratingFiveStars": 51.7,
		"ratingAllStars": 87.6,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244956&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.7, "nbOfVotes": 31 },
			{ "star": 4, "rating": 38.3, "nbOfVotes": 23 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 1 }
		],
		"title": "Demon",
		"aired": "1998-10-19T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 62,
		"ratingFiveStars": 48.8,
		"ratingAllStars": 87.4,
		"nbOfVotes": 84,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244957&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 48.8, "nbOfVotes": 41 },
			{ "star": 4, "rating": 44, "nbOfVotes": 37 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "M-H-5",
		"aired": "1998-10-26T00:00:00+00:00",
		"score": 4.37
	},
	{
		"episodeNb": 63,
		"ratingFiveStars": 51.7,
		"ratingAllStars": 88.4,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=250655&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.7, "nbOfVotes": 31 },
			{ "star": 4, "rating": 38.3, "nbOfVotes": 23 },
			{ "star": 3, "rating": 10, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I Ain't Gonna Die",
		"aired": "1998-11-02T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 64,
		"ratingFiveStars": 47.3,
		"ratingAllStars": 87,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=250658&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 47.3, "nbOfVotes": 26 },
			{ "star": 4, "rating": 41.8, "nbOfVotes": 23 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Giant Battle Spear",
		"aired": "1998-11-09T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 65,
		"ratingFiveStars": 52.2,
		"ratingAllStars": 88,
		"nbOfVotes": 67,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=256095&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52.2, "nbOfVotes": 35 },
			{ "star": 4, "rating": 37.3, "nbOfVotes": 25 },
			{ "star": 3, "rating": 9, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Prepare",
		"aired": "1998-11-16T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 66,
		"ratingFiveStars": 54.5,
		"ratingAllStars": 88.2,
		"nbOfVotes": 66,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=256096&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.5, "nbOfVotes": 36 },
			{ "star": 4, "rating": 36.4, "nbOfVotes": 24 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 4.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Spear Is Stifled",
		"aired": "1998-11-21T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 67,
		"ratingFiveStars": 59.1,
		"ratingAllStars": 88.4,
		"nbOfVotes": 66,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=256106&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.1, "nbOfVotes": 39 },
			{ "star": 4, "rating": 30.3, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3, "nbOfVotes": 2 }
		],
		"title": "Soup",
		"aired": "1998-11-30T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 68,
		"ratingFiveStars": 70,
		"ratingAllStars": 92.4,
		"nbOfVotes": 100,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=256110&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70, "nbOfVotes": 70 },
			{ "star": 4, "rating": 23, "nbOfVotes": 23 },
			{ "star": 3, "rating": 6, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Fourth Person",
		"aired": "1998-12-07T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 69,
		"ratingFiveStars": 56.8,
		"ratingAllStars": 87,
		"nbOfVotes": 74,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=260707&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.8, "nbOfVotes": 42 },
			{ "star": 4, "rating": 27, "nbOfVotes": 20 },
			{ "star": 3, "rating": 12.2, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "Arlong Park",
		"aired": "1998-12-19T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 70,
		"ratingFiveStars": 44,
		"ratingAllStars": 83.6,
		"nbOfVotes": 91,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261955&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 44, "nbOfVotes": 40 },
			{ "star": 4, "rating": 39.6, "nbOfVotes": 36 },
			{ "star": 3, "rating": 9.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 3.3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 3.3, "nbOfVotes": 3 }
		],
		"title": "Usopp's Great Manly Adventure",
		"aired": "1999-01-04T00:00:00+00:00",
		"score": 4.18
	},
	{
		"episodeNb": 71,
		"ratingFiveStars": 57.3,
		"ratingAllStars": 89.6,
		"nbOfVotes": 96,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261957&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.3, "nbOfVotes": 55 },
			{ "star": 4, "rating": 35.4, "nbOfVotes": 34 },
			{ "star": 3, "rating": 5.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "King of the Beasts",
		"aired": "1999-01-11T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 72,
		"ratingFiveStars": 54.2,
		"ratingAllStars": 88.4,
		"nbOfVotes": 72,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=280118&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.2, "nbOfVotes": 39 },
			{ "star": 4, "rating": 36.1, "nbOfVotes": 26 },
			{ "star": 3, "rating": 6.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 2.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Appropriate",
		"aired": "1999-01-18T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 73,
		"ratingFiveStars": 54.2,
		"ratingAllStars": 89.2,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261975&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.2, "nbOfVotes": 32 },
			{ "star": 4, "rating": 37.3, "nbOfVotes": 22 },
			{ "star": 3, "rating": 8.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Monster from the \"Grand Line\"",
		"aired": "1999-01-25T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 74,
		"ratingFiveStars": 56.6,
		"ratingAllStars": 89,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261978&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.6, "nbOfVotes": 30 },
			{ "star": 4, "rating": 34, "nbOfVotes": 18 },
			{ "star": 3, "rating": 7.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Business",
		"aired": "1999-02-01T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 75,
		"ratingFiveStars": 51.6,
		"ratingAllStars": 86.6,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261980&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.6, "nbOfVotes": 33 },
			{ "star": 4, "rating": 32.8, "nbOfVotes": 21 },
			{ "star": 3, "rating": 12.5, "nbOfVotes": 8 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sea Charts and Fishman",
		"aired": "1999-02-08T00:00:00+00:00",
		"score": 4.33
	},
	{
		"episodeNb": 76,
		"ratingFiveStars": 51.7,
		"ratingAllStars": 85.4,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261982&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.7, "nbOfVotes": 31 },
			{ "star": 4, "rating": 30, "nbOfVotes": 18 },
			{ "star": 3, "rating": 11.7, "nbOfVotes": 7 },
			{ "star": 2, "rating": 6.7, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sleep",
		"aired": "1999-02-15T00:00:00+00:00",
		"score": 4.2700000000000005
	},
	{
		"episodeNb": 77,
		"ratingFiveStars": 56.9,
		"ratingAllStars": 88.6,
		"nbOfVotes": 65,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261983&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.9, "nbOfVotes": 37 },
			{ "star": 4, "rating": 32.3, "nbOfVotes": 21 },
			{ "star": 3, "rating": 7.7, "nbOfVotes": 5 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "One Step of the Dream",
		"aired": "1999-02-22T00:00:00+00:00",
		"score": 4.43
	},
	{
		"episodeNb": 78,
		"ratingFiveStars": 70.7,
		"ratingAllStars": 90.4,
		"nbOfVotes": 75,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261984&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.7, "nbOfVotes": 53 },
			{ "star": 4, "rating": 18.7, "nbOfVotes": 14 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 4, "nbOfVotes": 3 }
		],
		"title": "Bell-mère-san",
		"aired": "1999-03-01T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 79,
		"ratingFiveStars": 70.1,
		"ratingAllStars": 92,
		"nbOfVotes": 67,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261985&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.1, "nbOfVotes": 47 },
			{ "star": 4, "rating": 22.4, "nbOfVotes": 15 },
			{ "star": 3, "rating": 6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 1 }
		],
		"title": "Survive",
		"aired": "1999-03-08T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 80,
		"ratingFiveStars": 54.1,
		"ratingAllStars": 88.4,
		"nbOfVotes": 85,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261986&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.1, "nbOfVotes": 46 },
			{ "star": 4, "rating": 36.5, "nbOfVotes": 31 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "A Crime Is a Crime",
		"aired": "1999-03-15T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 81,
		"ratingFiveStars": 80.4,
		"ratingAllStars": 95.4,
		"nbOfVotes": 143,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=261987&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.4, "nbOfVotes": 115 },
			{ "star": 4, "rating": 16.1, "nbOfVotes": 23 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Tears",
		"aired": "1999-03-20T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 82,
		"ratingFiveStars": 59.7,
		"ratingAllStars": 90,
		"nbOfVotes": 72,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262071&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.7, "nbOfVotes": 43 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 24 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "OK, Let's Stand Up!",
		"aired": "1999-03-29T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 83,
		"ratingFiveStars": 59.6,
		"ratingAllStars": 90.2,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262072&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.6, "nbOfVotes": 34 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 19 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy In Black",
		"aired": "1999-04-05T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 84,
		"ratingFiveStars": 63.8,
		"ratingAllStars": 92,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262073&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.8, "nbOfVotes": 37 },
			{ "star": 4, "rating": 32.8, "nbOfVotes": 19 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Zombie",
		"aired": "1999-04-12T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 85,
		"ratingFiveStars": 64.2,
		"ratingAllStars": 91.4,
		"nbOfVotes": 67,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262075&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.2, "nbOfVotes": 43 },
			{ "star": 4, "rating": 31.3, "nbOfVotes": 21 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Three-Sword Style vs. Six-Sword Style",
		"aired": "1999-04-19T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 86,
		"ratingFiveStars": 64.9,
		"ratingAllStars": 91.2,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262076&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.9, "nbOfVotes": 37 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 8.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Chivalry vs. Fishman Karate",
		"aired": "1999-04-26T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 87,
		"ratingFiveStars": 53.3,
		"ratingAllStars": 86.4,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262078&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.3, "nbOfVotes": 32 },
			{ "star": 4, "rating": 30, "nbOfVotes": 18 },
			{ "star": 3, "rating": 13.3, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 1 }
		],
		"title": "It's Over!!",
		"aired": "1999-05-10T00:00:00+00:00",
		"score": 4.32
	},
	{
		"episodeNb": 88,
		"ratingFiveStars": 63.3,
		"ratingAllStars": 91,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262079&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.3, "nbOfVotes": 31 },
			{ "star": 4, "rating": 28.6, "nbOfVotes": 14 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Die!!!",
		"aired": "1999-05-17T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 89,
		"ratingFiveStars": 62.1,
		"ratingAllStars": 90.4,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262080&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.1, "nbOfVotes": 36 },
			{ "star": 4, "rating": 27.6, "nbOfVotes": 16 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Switch",
		"aired": "1999-05-24T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 90,
		"ratingFiveStars": 48.6,
		"ratingAllStars": 85.6,
		"nbOfVotes": 105,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262081&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 48.6, "nbOfVotes": 51 },
			{ "star": 4, "rating": 40, "nbOfVotes": 42 },
			{ "star": 3, "rating": 4.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 3.8, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 3 }
		],
		"title": "What Can You Do?",
		"aired": "1999-05-31T00:00:00+00:00",
		"score": 4.279999999999999
	},
	{
		"episodeNb": 91,
		"ratingFiveStars": 49.2,
		"ratingAllStars": 86.2,
		"nbOfVotes": 61,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262086&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.2, "nbOfVotes": 30 },
			{ "star": 4, "rating": 36.1, "nbOfVotes": 22 },
			{ "star": 3, "rating": 11.5, "nbOfVotes": 7 },
			{ "star": 2, "rating": 3.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Darts",
		"aired": "1999-06-07T00:00:00+00:00",
		"score": 4.3100000000000005
	},
	{
		"episodeNb": 92,
		"ratingFiveStars": 70,
		"ratingAllStars": 91.6,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262087&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70, "nbOfVotes": 42 },
			{ "star": 4, "rating": 20, "nbOfVotes": 12 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Paradise",
		"aired": "1999-06-14T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 93,
		"ratingFiveStars": 73,
		"ratingAllStars": 91.8,
		"nbOfVotes": 63,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262088&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73, "nbOfVotes": 46 },
			{ "star": 4, "rating": 19, "nbOfVotes": 12 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 2 },
			{ "star": 2, "rating": 3.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 1 }
		],
		"title": "Going Down",
		"aired": "1999-06-21T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 94,
		"ratingFiveStars": 71.6,
		"ratingAllStars": 93.4,
		"nbOfVotes": 67,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262089&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.6, "nbOfVotes": 48 },
			{ "star": 4, "rating": 23.9, "nbOfVotes": 16 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Second Person",
		"aired": "1999-06-28T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 95,
		"ratingFiveStars": 68.5,
		"ratingAllStars": 91.2,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=120001&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.5, "nbOfVotes": 74 },
			{ "star": 4, "rating": 22.2, "nbOfVotes": 24 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Spin, Pinwheel, Spin",
		"aired": "1999-07-05T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 96,
		"ratingFiveStars": 64.5,
		"ratingAllStars": 91.8,
		"nbOfVotes": 76,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=120335&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.5, "nbOfVotes": 49 },
			{ "star": 4, "rating": 32.9, "nbOfVotes": 25 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 1 }
		],
		"title": "Greatest Evil of the East",
		"aired": "1999-07-12T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 97,
		"ratingFiveStars": 58.7,
		"ratingAllStars": 89.6,
		"nbOfVotes": 63,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262091&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.7, "nbOfVotes": 37 },
			{ "star": 4, "rating": 30.2, "nbOfVotes": 19 },
			{ "star": 3, "rating": 11.1, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sandai Kitetsu",
		"aired": "1999-07-19T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 98,
		"ratingFiveStars": 61.3,
		"ratingAllStars": 90,
		"nbOfVotes": 62,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262098&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.3, "nbOfVotes": 38 },
			{ "star": 4, "rating": 30.6, "nbOfVotes": 19 },
			{ "star": 3, "rating": 6.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 1 }
		],
		"title": "Dark Clouds",
		"aired": "1999-07-26T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 99,
		"ratingFiveStars": 73.4,
		"ratingAllStars": 93.6,
		"nbOfVotes": 94,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=120338&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.4, "nbOfVotes": 69 },
			{ "star": 4, "rating": 22.3, "nbOfVotes": 21 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy Died",
		"aired": "1999-08-02T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 100,
		"ratingFiveStars": 51.1,
		"ratingAllStars": 87,
		"nbOfVotes": 274,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=129412&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.1, "nbOfVotes": 140 },
			{ "star": 4, "rating": 38.3, "nbOfVotes": 105 },
			{ "star": 3, "rating": 6.2, "nbOfVotes": 17 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 8 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 4 }
		],
		"title": "The Legend Has Begun",
		"aired": "1999-08-09T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 101,
		"ratingFiveStars": 43.5,
		"ratingAllStars": 85.8,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262102&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 43.5, "nbOfVotes": 47 },
			{ "star": 4, "rating": 43.5, "nbOfVotes": 47 },
			{ "star": 3, "rating": 12, "nbOfVotes": 13 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Reverse Mountain",
		"aired": "1999-08-23T00:00:00+00:00",
		"score": 4.29
	},
	{
		"episodeNb": 102,
		"ratingFiveStars": 39.3,
		"ratingAllStars": 85.2,
		"nbOfVotes": 89,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262105&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 39.3, "nbOfVotes": 35 },
			{ "star": 4, "rating": 49.4, "nbOfVotes": 44 },
			{ "star": 3, "rating": 9, "nbOfVotes": 8 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "And now, the Grand Line",
		"aired": "1999-08-30T00:00:00+00:00",
		"score": 4.26
	},
	{
		"episodeNb": 103,
		"ratingFiveStars": 47.2,
		"ratingAllStars": 85.6,
		"nbOfVotes": 89,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262107&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 47.2, "nbOfVotes": 42 },
			{ "star": 4, "rating": 37.1, "nbOfVotes": 33 },
			{ "star": 3, "rating": 13.5, "nbOfVotes": 12 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Whale",
		"aired": "1999-09-06T00:00:00+00:00",
		"score": 4.279999999999999
	},
	{
		"episodeNb": 104,
		"ratingFiveStars": 47.1,
		"ratingAllStars": 87.2,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262108&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 47.1, "nbOfVotes": 48 },
			{ "star": 4, "rating": 43.1, "nbOfVotes": 44 },
			{ "star": 3, "rating": 8.8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Cape Promise",
		"aired": "1999-09-13T00:00:00+00:00",
		"score": 4.36
	},
	{
		"episodeNb": 105,
		"ratingFiveStars": 31.4,
		"ratingAllStars": 82.2,
		"nbOfVotes": 207,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262109&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 31.4, "nbOfVotes": 65 },
			{ "star": 4, "rating": 53.6, "nbOfVotes": 111 },
			{ "star": 3, "rating": 10.1, "nbOfVotes": 21 },
			{ "star": 2, "rating": 4.3, "nbOfVotes": 9 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Log Pose",
		"aired": "1999-09-20T00:00:00+00:00",
		"score": 4.11
	},
	{
		"episodeNb": 106,
		"ratingFiveStars": 25.4,
		"ratingAllStars": 81.2,
		"nbOfVotes": 236,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262111&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 25.4, "nbOfVotes": 60 },
			{ "star": 4, "rating": 59.7, "nbOfVotes": 141 },
			{ "star": 3, "rating": 11, "nbOfVotes": 26 },
			{ "star": 2, "rating": 3.4, "nbOfVotes": 8 },
			{ "star": 1, "rating": 0.4, "nbOfVotes": 1 }
		],
		"title": "The Town of Celebration",
		"aired": "1999-09-27T00:00:00+00:00",
		"score": 4.0600000000000005
	},
	{
		"episodeNb": 107,
		"ratingFiveStars": 30.4,
		"ratingAllStars": 84.4,
		"nbOfVotes": 227,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=130742&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 30.4, "nbOfVotes": 69 },
			{ "star": 4, "rating": 62.6, "nbOfVotes": 142 },
			{ "star": 3, "rating": 5.7, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Moonlight and Gravestones",
		"aired": "1999-10-04T00:00:00+00:00",
		"score": 4.220000000000001
	},
	{
		"episodeNb": 108,
		"ratingFiveStars": 31.8,
		"ratingAllStars": 80.8,
		"nbOfVotes": 264,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=130743&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 31.8, "nbOfVotes": 84 },
			{ "star": 4, "rating": 52.7, "nbOfVotes": 139 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 12 },
			{ "star": 2, "rating": 9.5, "nbOfVotes": 25 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 4 }
		],
		"title": "100 Bounty Hunters",
		"aired": "1999-10-09T00:00:00+00:00",
		"score": 4.04
	},
	{
		"episodeNb": 109,
		"ratingFiveStars": 24.9,
		"ratingAllStars": 78,
		"nbOfVotes": 185,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262121&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 24.9, "nbOfVotes": 46 },
			{ "star": 4, "rating": 53, "nbOfVotes": 98 },
			{ "star": 3, "rating": 11.9, "nbOfVotes": 22 },
			{ "star": 2, "rating": 7.6, "nbOfVotes": 14 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 5 }
		],
		"title": "Responsibility Problem",
		"aired": "1999-10-18T00:00:00+00:00",
		"score": 3.9
	},
	{
		"episodeNb": 110,
		"ratingFiveStars": 25,
		"ratingAllStars": 77.4,
		"nbOfVotes": 276,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262123&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 25, "nbOfVotes": 69 },
			{ "star": 4, "rating": 50.4, "nbOfVotes": 139 },
			{ "star": 3, "rating": 13.4, "nbOfVotes": 37 },
			{ "star": 2, "rating": 9.1, "nbOfVotes": 25 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 6 }
		],
		"title": "The Night Will Not End",
		"aired": "1999-10-25T00:00:00+00:00",
		"score": 3.87
	},
	{
		"episodeNb": 111,
		"ratingFiveStars": 21.8,
		"ratingAllStars": 80.4,
		"nbOfVotes": 220,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262124&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 21.8, "nbOfVotes": 48 },
			{ "star": 4, "rating": 64.1, "nbOfVotes": 141 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 20 },
			{ "star": 2, "rating": 4.5, "nbOfVotes": 10 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Secret Criminal Syndicate",
		"aired": "1999-11-01T00:00:00+00:00",
		"score": 4.0200000000000005
	},
	{
		"episodeNb": 112,
		"ratingFiveStars": 34.6,
		"ratingAllStars": 84,
		"nbOfVotes": 162,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262125&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 34.6, "nbOfVotes": 56 },
			{ "star": 4, "rating": 53.7, "nbOfVotes": 87 },
			{ "star": 3, "rating": 10.5, "nbOfVotes": 17 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 2 }
		],
		"title": "Luffy vs. Zoro",
		"aired": "1999-11-08T00:00:00+00:00",
		"score": 4.2
	},
	{
		"episodeNb": 113,
		"ratingFiveStars": 54.9,
		"ratingAllStars": 87.8,
		"nbOfVotes": 71,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=154510&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.9, "nbOfVotes": 39 },
			{ "star": 4, "rating": 33.8, "nbOfVotes": 24 },
			{ "star": 3, "rating": 7, "nbOfVotes": 5 },
			{ "star": 2, "rating": 4.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "It's Okay!!!",
		"aired": "1999-11-15T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 114,
		"ratingFiveStars": 54.8,
		"ratingAllStars": 88,
		"nbOfVotes": 62,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262128&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.8, "nbOfVotes": 34 },
			{ "star": 4, "rating": 33.9, "nbOfVotes": 21 },
			{ "star": 3, "rating": 8.1, "nbOfVotes": 5 },
			{ "star": 2, "rating": 3.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Route",
		"aired": "1999-11-22T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 115,
		"ratingFiveStars": 59.2,
		"ratingAllStars": 89.2,
		"nbOfVotes": 71,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262131&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.2, "nbOfVotes": 42 },
			{ "star": 4, "rating": 32.4, "nbOfVotes": 23 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "Adventure in Little Garden",
		"aired": "1999-12-06T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 116,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 92,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262133&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 37 },
			{ "star": 4, "rating": 25.5, "nbOfVotes": 14 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Huge",
		"aired": "1999-12-13T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 117,
		"ratingFiveStars": 58.9,
		"ratingAllStars": 90.4,
		"nbOfVotes": 73,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262135&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.9, "nbOfVotes": 43 },
			{ "star": 4, "rating": 34.2, "nbOfVotes": 25 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Dorry and Brogy",
		"aired": "1999-12-20T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 118,
		"ratingFiveStars": 50,
		"ratingAllStars": 87.4,
		"nbOfVotes": 62,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262137&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50, "nbOfVotes": 31 },
			{ "star": 4, "rating": 38.7, "nbOfVotes": 24 },
			{ "star": 3, "rating": 9.7, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Someone's Here",
		"aired": "2000-01-03T00:00:00+00:00",
		"score": 4.37
	},
	{
		"episodeNb": 119,
		"ratingFiveStars": 53.8,
		"ratingAllStars": 87.6,
		"nbOfVotes": 52,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262138&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.8, "nbOfVotes": 28 },
			{ "star": 4, "rating": 34.6, "nbOfVotes": 18 },
			{ "star": 3, "rating": 9.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 1 }
		],
		"title": "Makeshift",
		"aired": "2000-01-17T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 120,
		"ratingFiveStars": 60.7,
		"ratingAllStars": 90,
		"nbOfVotes": 56,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262143&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.7, "nbOfVotes": 34 },
			{ "star": 4, "rating": 30.4, "nbOfVotes": 17 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Red Ogre Cried",
		"aired": "2000-01-24T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 121,
		"ratingFiveStars": 49.1,
		"ratingAllStars": 86.6,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262144&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.1, "nbOfVotes": 27 },
			{ "star": 4, "rating": 34.5, "nbOfVotes": 19 },
			{ "star": 3, "rating": 16.4, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I Knew",
		"aired": "2000-01-31T00:00:00+00:00",
		"score": 4.33
	},
	{
		"episodeNb": 122,
		"ratingFiveStars": 65.2,
		"ratingAllStars": 90.8,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262145&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.2, "nbOfVotes": 30 },
			{ "star": 4, "rating": 28.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 1 }
		],
		"title": "A Corpse Won't Help",
		"aired": "2000-02-07T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 123,
		"ratingFiveStars": 58.1,
		"ratingAllStars": 90.2,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262147&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.1, "nbOfVotes": 25 },
			{ "star": 4, "rating": 34.9, "nbOfVotes": 15 },
			{ "star": 3, "rating": 7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy vs. Mr. 3",
		"aired": "2000-02-14T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 124,
		"ratingFiveStars": 52,
		"ratingAllStars": 87.2,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262150&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52, "nbOfVotes": 26 },
			{ "star": 4, "rating": 32, "nbOfVotes": 16 },
			{ "star": 3, "rating": 16, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Damn Good Tea",
		"aired": "2000-02-21T00:00:00+00:00",
		"score": 4.36
	},
	{
		"episodeNb": 125,
		"ratingFiveStars": 61.5,
		"ratingAllStars": 89.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262151&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.5, "nbOfVotes": 24 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 10 },
			{ "star": 3, "rating": 12.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Candle Champion",
		"aired": "2000-02-28T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 126,
		"ratingFiveStars": 63.5,
		"ratingAllStars": 91.2,
		"nbOfVotes": 63,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262153&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.5, "nbOfVotes": 40 },
			{ "star": 4, "rating": 28.6, "nbOfVotes": 18 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Instinct",
		"aired": "2000-03-06T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 127,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 88.8,
		"nbOfVotes": 48,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262155&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 30 },
			{ "star": 4, "rating": 20.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 14.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Den Den Mushi",
		"aired": "2000-03-13T00:00:00+00:00",
		"score": 4.4399999999999995
	},
	{
		"episodeNb": 128,
		"ratingFiveStars": 60.5,
		"ratingAllStars": 89.8,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262157&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.5, "nbOfVotes": 26 },
			{ "star": 4, "rating": 30.2, "nbOfVotes": 13 },
			{ "star": 3, "rating": 7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pride (Pirate Flag)",
		"aired": "2000-03-18T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 129,
		"ratingFiveStars": 64.9,
		"ratingAllStars": 90.8,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262158&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.9, "nbOfVotes": 37 },
			{ "star": 4, "rating": 24.6, "nbOfVotes": 14 },
			{ "star": 3, "rating": 10.5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Straight Ahead!!!",
		"aired": "2000-03-27T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 130,
		"ratingFiveStars": 61.8,
		"ratingAllStars": 89.8,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262160&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.8, "nbOfVotes": 34 },
			{ "star": 4, "rating": 25.5, "nbOfVotes": 14 },
			{ "star": 3, "rating": 12.7, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Maximum Speed",
		"aired": "2000-04-03T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 131,
		"ratingFiveStars": 56.5,
		"ratingAllStars": 88.2,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262659&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.5, "nbOfVotes": 26 },
			{ "star": 4, "rating": 28.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 15.2, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Tin Plate Wapol",
		"aired": "2000-04-10T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 132,
		"ratingFiveStars": 63.2,
		"ratingAllStars": 90.6,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262661&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.2, "nbOfVotes": 24 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 10.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "See?",
		"aired": "2000-04-17T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 133,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 91.8,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262665&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 33 },
			{ "star": 4, "rating": 24.5, "nbOfVotes": 12 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure in the Country Without a Name",
		"aired": "2000-04-24T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 134,
		"ratingFiveStars": 60.4,
		"ratingAllStars": 89.8,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262674&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.4, "nbOfVotes": 32 },
			{ "star": 4, "rating": 30.2, "nbOfVotes": 16 },
			{ "star": 3, "rating": 7.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Dr. Kureha",
		"aired": "2000-05-08T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 135,
		"ratingFiveStars": 54.3,
		"ratingAllStars": 86.6,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262675&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.3, "nbOfVotes": 25 },
			{ "star": 4, "rating": 30.4, "nbOfVotes": 14 },
			{ "star": 3, "rating": 8.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 6.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Lapahn",
		"aired": "2000-05-15T00:00:00+00:00",
		"score": 4.33
	},
	{
		"episodeNb": 136,
		"ratingFiveStars": 54.5,
		"ratingAllStars": 88.4,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262677&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.5, "nbOfVotes": 30 },
			{ "star": 4, "rating": 32.7, "nbOfVotes": 18 },
			{ "star": 3, "rating": 12.7, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Man Called Dalton",
		"aired": "2000-05-22T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 137,
		"ratingFiveStars": 55.6,
		"ratingAllStars": 89.4,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262681&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.6, "nbOfVotes": 25 },
			{ "star": 4, "rating": 35.6, "nbOfVotes": 16 },
			{ "star": 3, "rating": 8.9, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Avalanche",
		"aired": "2000-05-29T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 138,
		"ratingFiveStars": 70.6,
		"ratingAllStars": 92.6,
		"nbOfVotes": 51,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262682&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.6, "nbOfVotes": 36 },
			{ "star": 4, "rating": 21.6, "nbOfVotes": 11 },
			{ "star": 3, "rating": 7.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Summit",
		"aired": "2000-06-05T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 139,
		"ratingFiveStars": 69.4,
		"ratingAllStars": 92.2,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262685&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.4, "nbOfVotes": 34 },
			{ "star": 4, "rating": 22.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Introducing Tony Tony Chopper",
		"aired": "2000-06-12T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 140,
		"ratingFiveStars": 59.3,
		"ratingAllStars": 90.2,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262689&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.3, "nbOfVotes": 35 },
			{ "star": 4, "rating": 33.9, "nbOfVotes": 20 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Castle of Snow",
		"aired": "2000-06-19T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 141,
		"ratingFiveStars": 68.5,
		"ratingAllStars": 92.6,
		"nbOfVotes": 54,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262692&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.5, "nbOfVotes": 37 },
			{ "star": 4, "rating": 25.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Quack Doctor",
		"aired": "2000-06-26T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 142,
		"ratingFiveStars": 70.7,
		"ratingAllStars": 91,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262694&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.7, "nbOfVotes": 41 },
			{ "star": 4, "rating": 13.8, "nbOfVotes": 8 },
			{ "star": 3, "rating": 15.5, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Skull, Crossbone and Sakura",
		"aired": "2000-07-03T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 143,
		"ratingFiveStars": 77.4,
		"ratingAllStars": 92.8,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262697&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.4, "nbOfVotes": 41 },
			{ "star": 4, "rating": 13.2, "nbOfVotes": 7 },
			{ "star": 3, "rating": 7.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 1 }
		],
		"title": "Unskilled",
		"aired": "2000-07-10T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 144,
		"ratingFiveStars": 78.2,
		"ratingAllStars": 94.2,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262699&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.2, "nbOfVotes": 43 },
			{ "star": 4, "rating": 14.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Snow Story",
		"aired": "2000-07-17T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 145,
		"ratingFiveStars": 72.6,
		"ratingAllStars": 92.6,
		"nbOfVotes": 84,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262701&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.6, "nbOfVotes": 61 },
			{ "star": 4, "rating": 21.4, "nbOfVotes": 18 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 3.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Inherited Will",
		"aired": "2000-07-24T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 146,
		"ratingFiveStars": 60.3,
		"ratingAllStars": 90,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262704&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.3, "nbOfVotes": 35 },
			{ "star": 4, "rating": 29.3, "nbOfVotes": 17 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Battle of National Defense",
		"aired": "2000-07-31T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 147,
		"ratingFiveStars": 55.6,
		"ratingAllStars": 87.2,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262707&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.6, "nbOfVotes": 25 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 4.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 1 }
		],
		"title": "Downright Lie",
		"aired": "2000-08-07T00:00:00+00:00",
		"score": 4.36
	},
	{
		"episodeNb": 148,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 93.4,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262709&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 35 },
			{ "star": 4, "rating": 24.5, "nbOfVotes": 12 },
			{ "star": 3, "rating": 4.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "You Can't Destroy It",
		"aired": "2000-08-21T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 149,
		"ratingFiveStars": 61.5,
		"ratingAllStars": 90.2,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262710&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.5, "nbOfVotes": 24 },
			{ "star": 4, "rating": 28.2, "nbOfVotes": 11 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rumble!!",
		"aired": "2000-08-28T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 150,
		"ratingFiveStars": 53.2,
		"ratingAllStars": 87,
		"nbOfVotes": 62,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262711&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.2, "nbOfVotes": 33 },
			{ "star": 4, "rating": 30.6, "nbOfVotes": 19 },
			{ "star": 3, "rating": 14.5, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Royal Drum Crown 7-Shot Bliking Cannon",
		"aired": "2000-09-04T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 151,
		"ratingFiveStars": 69.6,
		"ratingAllStars": 92.2,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262713&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.6, "nbOfVotes": 32 },
			{ "star": 4, "rating": 21.7, "nbOfVotes": 10 },
			{ "star": 3, "rating": 8.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Drum Skies",
		"aired": "2000-09-11T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 152,
		"ratingFiveStars": 67.9,
		"ratingAllStars": 92.8,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262716&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.9, "nbOfVotes": 36 },
			{ "star": 4, "rating": 28.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Full Moon",
		"aired": "2000-09-18T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 153,
		"ratingFiveStars": 81,
		"ratingAllStars": 95.8,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262717&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81, "nbOfVotes": 47 },
			{ "star": 4, "rating": 17.2, "nbOfVotes": 10 },
			{ "star": 3, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Hiluluk's Sakura",
		"aired": "2000-09-25T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 154,
		"ratingFiveStars": 67.2,
		"ratingAllStars": 89.6,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262718&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.2, "nbOfVotes": 43 },
			{ "star": 4, "rating": 21.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.1, "nbOfVotes": 2 }
		],
		"title": "To Alabasta",
		"aired": "2000-10-02T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 155,
		"ratingFiveStars": 54.1,
		"ratingAllStars": 89,
		"nbOfVotes": 74,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262720&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.1, "nbOfVotes": 40 },
			{ "star": 4, "rating": 39.2, "nbOfVotes": 29 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "Sir Crocodile the \"Pirate\"",
		"aired": "2000-10-07T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 156,
		"ratingFiveStars": 63.3,
		"ratingAllStars": 90.6,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262721&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.3, "nbOfVotes": 31 },
			{ "star": 4, "rating": 28.6, "nbOfVotes": 14 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Okama Weather",
		"aired": "2000-10-16T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 157,
		"ratingFiveStars": 70,
		"ratingAllStars": 92.8,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262722&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70, "nbOfVotes": 35 },
			{ "star": 4, "rating": 24, "nbOfVotes": 12 },
			{ "star": 3, "rating": 6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Introducing Ace",
		"aired": "2000-10-23T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 158,
		"ratingFiveStars": 72.3,
		"ratingAllStars": 93.6,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262723&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.3, "nbOfVotes": 34 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Arriving in Alabasta",
		"aired": "2000-10-30T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 159,
		"ratingFiveStars": 71.9,
		"ratingAllStars": 93.6,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262724&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.9, "nbOfVotes": 41 },
			{ "star": 4, "rating": 24.6, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Come On",
		"aired": "2000-11-06T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 160,
		"ratingFiveStars": 56.7,
		"ratingAllStars": 89.4,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262725&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.7, "nbOfVotes": 34 },
			{ "star": 4, "rating": 35, "nbOfVotes": 21 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Spiders Cafe, 8 o'clock",
		"aired": "2000-11-13T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 161,
		"ratingFiveStars": 62,
		"ratingAllStars": 89.6,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262727&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62, "nbOfVotes": 31 },
			{ "star": 4, "rating": 28, "nbOfVotes": 14 },
			{ "star": 3, "rating": 8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2, "nbOfVotes": 1 }
		],
		"title": "The Green Town, Erumalu",
		"aired": "2000-11-20T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 162,
		"ratingFiveStars": 63.8,
		"ratingAllStars": 90.6,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262729&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.8, "nbOfVotes": 37 },
			{ "star": 4, "rating": 27.6, "nbOfVotes": 16 },
			{ "star": 3, "rating": 6.9, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure in the Kingdom of Sand",
		"aired": "2000-11-27T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 163,
		"ratingFiveStars": 60,
		"ratingAllStars": 89.4,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262730&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60, "nbOfVotes": 27 },
			{ "star": 4, "rating": 26.7, "nbOfVotes": 12 },
			{ "star": 3, "rating": 13.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Yuba, the Rebel Town",
		"aired": "2000-12-04T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 164,
		"ratingFiveStars": 56.6,
		"ratingAllStars": 89,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262731&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.6, "nbOfVotes": 30 },
			{ "star": 4, "rating": 35.8, "nbOfVotes": 19 },
			{ "star": 3, "rating": 5.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 1 }
		],
		"title": "I Love This Country",
		"aired": "2000-12-11T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 165,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 90,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262732&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 25 },
			{ "star": 4, "rating": 25, "nbOfVotes": 10 },
			{ "star": 3, "rating": 12.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Plan: Utopia",
		"aired": "2000-12-18T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 166,
		"ratingFiveStars": 64.6,
		"ratingAllStars": 89,
		"nbOfVotes": 82,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262733&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.6, "nbOfVotes": 53 },
			{ "star": 4, "rating": 23.2, "nbOfVotes": 19 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 5 },
			{ "star": 2, "rating": 4.9, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "Luffy vs. Vivi",
		"aired": "2001-01-04T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 167,
		"ratingFiveStars": 64.4,
		"ratingAllStars": 90.6,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262736&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.4, "nbOfVotes": 38 },
			{ "star": 4, "rating": 27.1, "nbOfVotes": 16 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 3.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Battlefront",
		"aired": "2001-01-15T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 168,
		"ratingFiveStars": 64.6,
		"ratingAllStars": 91.6,
		"nbOfVotes": 48,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262737&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.6, "nbOfVotes": 31 },
			{ "star": 4, "rating": 29.2, "nbOfVotes": 14 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rainbase, Town of Dreams",
		"aired": "2001-01-22T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 169,
		"ratingFiveStars": 68.9,
		"ratingAllStars": 92.8,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262738&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.9, "nbOfVotes": 31 },
			{ "star": 4, "rating": 26.7, "nbOfVotes": 12 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Strongest Warrior in the Kingdom",
		"aired": "2001-01-29T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 170,
		"ratingFiveStars": 61,
		"ratingAllStars": 89.4,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262740&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61, "nbOfVotes": 36 },
			{ "star": 4, "rating": 28.8, "nbOfVotes": 17 },
			{ "star": 3, "rating": 8.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 1 }
		],
		"title": "It Begins",
		"aired": "2001-02-05T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 171,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 92.2,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262741&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 31 },
			{ "star": 4, "rating": 26.1, "nbOfVotes": 12 },
			{ "star": 3, "rating": 6.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Kohza, Leader of the Rebellion",
		"aired": "2001-02-10T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 172,
		"ratingFiveStars": 54.3,
		"ratingAllStars": 88.6,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262743&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.3, "nbOfVotes": 25 },
			{ "star": 4, "rating": 34.8, "nbOfVotes": 16 },
			{ "star": 3, "rating": 10.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rebellion",
		"aired": "2001-02-26T00:00:00+00:00",
		"score": 4.43
	},
	{
		"episodeNb": 173,
		"ratingFiveStars": 74.5,
		"ratingAllStars": 92,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262744&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.5, "nbOfVotes": 35 },
			{ "star": 4, "rating": 14.9, "nbOfVotes": 7 },
			{ "star": 3, "rating": 8.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 1 }
		],
		"title": "Bananadile",
		"aired": "2001-03-05T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 174,
		"ratingFiveStars": 71.1,
		"ratingAllStars": 92.8,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262745&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.1, "nbOfVotes": 32 },
			{ "star": 4, "rating": 22.2, "nbOfVotes": 10 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Mr. Prince",
		"aired": "2001-03-12T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 175,
		"ratingFiveStars": 71.2,
		"ratingAllStars": 92.6,
		"nbOfVotes": 52,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262746&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.2, "nbOfVotes": 37 },
			{ "star": 4, "rating": 23.1, "nbOfVotes": 12 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Liberation",
		"aired": "2001-03-19T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 176,
		"ratingFiveStars": 70.2,
		"ratingAllStars": 91.6,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262747&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.2, "nbOfVotes": 40 },
			{ "star": 4, "rating": 22.8, "nbOfVotes": 13 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 1 }
		],
		"title": "Rush!!",
		"aired": "2001-03-26T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 177,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 92.6,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262916&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 29 },
			{ "star": 4, "rating": 27.9, "nbOfVotes": 12 },
			{ "star": 3, "rating": 4.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "30,000,000 vs. 81,000,000",
		"aired": "2001-04-02T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 178,
		"ratingFiveStars": 82,
		"ratingAllStars": 94.4,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=155878&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82, "nbOfVotes": 41 },
			{ "star": 4, "rating": 12, "nbOfVotes": 6 },
			{ "star": 3, "rating": 4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2, "nbOfVotes": 1 }
		],
		"title": "Level G.L.",
		"aired": "2001-04-09T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 179,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 90.4,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262918&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 28 },
			{ "star": 4, "rating": 21.4, "nbOfVotes": 9 },
			{ "star": 3, "rating": 9.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The End Will Be in Alubarna",
		"aired": "2001-04-16T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 180,
		"ratingFiveStars": 65.5,
		"ratingAllStars": 86.8,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262926&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.5, "nbOfVotes": 38 },
			{ "star": 4, "rating": 15.5, "nbOfVotes": 9 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 5.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 3.4, "nbOfVotes": 2 }
		],
		"title": "Alabasta Animal Kingdom",
		"aired": "2001-04-23T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 181,
		"ratingFiveStars": 70.2,
		"ratingAllStars": 92.8,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262928&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.2, "nbOfVotes": 33 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 6.4, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Super Spot-Billed Duck Quiz",
		"aired": "2001-05-07T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 182,
		"ratingFiveStars": 72.2,
		"ratingAllStars": 92.8,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262929&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.2, "nbOfVotes": 26 },
			{ "star": 4, "rating": 19.4, "nbOfVotes": 7 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Roar",
		"aired": "2001-05-14T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 183,
		"ratingFiveStars": 67.6,
		"ratingAllStars": 91.2,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262931&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.6, "nbOfVotes": 23 },
			{ "star": 4, "rating": 20.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 11.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Commander Carue",
		"aired": "2001-05-21T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 184,
		"ratingFiveStars": 69.8,
		"ratingAllStars": 92.6,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262934&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.8, "nbOfVotes": 30 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Molehill 4th St.",
		"aired": "2001-05-28T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 185,
		"ratingFiveStars": 61.9,
		"ratingAllStars": 89.6,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262935&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.9, "nbOfVotes": 26 },
			{ "star": 4, "rating": 26.2, "nbOfVotes": 11 },
			{ "star": 3, "rating": 9.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Wow, That's Nice",
		"aired": "2001-06-04T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 186,
		"ratingFiveStars": 70.5,
		"ratingAllStars": 92.4,
		"nbOfVotes": 61,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262936&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.5, "nbOfVotes": 43 },
			{ "star": 4, "rating": 21.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "4",
		"aired": "2001-06-11T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 187,
		"ratingFiveStars": 68.3,
		"ratingAllStars": 92.6,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262938&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.3, "nbOfVotes": 28 },
			{ "star": 4, "rating": 26.8, "nbOfVotes": 11 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Even Match",
		"aired": "2001-06-18T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 188,
		"ratingFiveStars": 57.1,
		"ratingAllStars": 90,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262939&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.1, "nbOfVotes": 24 },
			{ "star": 4, "rating": 38.1, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Okama Kenpo",
		"aired": "2001-06-25T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 189,
		"ratingFiveStars": 63.2,
		"ratingAllStars": 90.6,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262941&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.2, "nbOfVotes": 24 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 10.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "2",
		"aired": "2001-07-02T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 190,
		"ratingFiveStars": 55.4,
		"ratingAllStars": 88.6,
		"nbOfVotes": 56,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262942&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.4, "nbOfVotes": 31 },
			{ "star": 4, "rating": 35.7, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 1 }
		],
		"title": "Clima Tact",
		"aired": "2001-07-09T00:00:00+00:00",
		"score": 4.43
	},
	{
		"episodeNb": 191,
		"ratingFiveStars": 68.9,
		"ratingAllStars": 92,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262944&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.9, "nbOfVotes": 31 },
			{ "star": 4, "rating": 24.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Woman Who Controls the Weather",
		"aired": "2001-07-16T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 192,
		"ratingFiveStars": 65.1,
		"ratingAllStars": 90.6,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153444&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.1, "nbOfVotes": 28 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 11 },
			{ "star": 3, "rating": 7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Whirlwind Warning",
		"aired": "2001-07-23T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 193,
		"ratingFiveStars": 64.3,
		"ratingAllStars": 90,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153449&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.3, "nbOfVotes": 27 },
			{ "star": 4, "rating": 23.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 9.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ideal Nation",
		"aired": "2001-07-30T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 194,
		"ratingFiveStars": 69.2,
		"ratingAllStars": 89.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153450&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.2, "nbOfVotes": 27 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 7 },
			{ "star": 3, "rating": 7.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 1 }
		],
		"title": "Cut Through Steel",
		"aired": "2001-08-06T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 195,
		"ratingFiveStars": 78.7,
		"ratingAllStars": 93.4,
		"nbOfVotes": 61,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=153451&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.7, "nbOfVotes": 48 },
			{ "star": 4, "rating": 14.8, "nbOfVotes": 9 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 1 }
		],
		"title": "Mr. Bushido",
		"aired": "2001-08-20T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 196,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 90,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262946&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 24 },
			{ "star": 4, "rating": 16.7, "nbOfVotes": 6 },
			{ "star": 3, "rating": 16.7, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "1",
		"aired": "2001-08-27T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 197,
		"ratingFiveStars": 72.5,
		"ratingAllStars": 93,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262947&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.5, "nbOfVotes": 29 },
			{ "star": 4, "rating": 20, "nbOfVotes": 8 },
			{ "star": 3, "rating": 7.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Leaders",
		"aired": "2001-09-03T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 198,
		"ratingFiveStars": 68.9,
		"ratingAllStars": 93.4,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262948&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.9, "nbOfVotes": 31 },
			{ "star": 4, "rating": 28.9, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "4:15 p.m.",
		"aired": "2001-09-10T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 199,
		"ratingFiveStars": 74,
		"ratingAllStars": 93.6,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=154768&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74, "nbOfVotes": 37 },
			{ "star": 4, "rating": 22, "nbOfVotes": 11 },
			{ "star": 3, "rating": 2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Hope!!",
		"aired": "2001-09-17T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 200,
		"ratingFiveStars": 62.1,
		"ratingAllStars": 90.6,
		"nbOfVotes": 66,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=154893&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.1, "nbOfVotes": 41 },
			{ "star": 4, "rating": 28.8, "nbOfVotes": 19 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Water Luffy",
		"aired": "2001-09-22T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 201,
		"ratingFiveStars": 68.6,
		"ratingAllStars": 92.2,
		"nbOfVotes": 51,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=154895&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.6, "nbOfVotes": 35 },
			{ "star": 4, "rating": 25.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 2 },
			{ "star": 2, "rating": 2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Nico Robin",
		"aired": "2001-10-01T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 202,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 91.8,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=154897&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 31 },
			{ "star": 4, "rating": 23.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 8.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Royal Crypt",
		"aired": "2001-10-06T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 203,
		"ratingFiveStars": 68.3,
		"ratingAllStars": 91.2,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=154899&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.3, "nbOfVotes": 28 },
			{ "star": 4, "rating": 19.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 12.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Crocish",
		"aired": "2001-10-15T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 204,
		"ratingFiveStars": 70.7,
		"ratingAllStars": 91.2,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262951&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.7, "nbOfVotes": 29 },
			{ "star": 4, "rating": 19.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 1 }
		],
		"title": "Red",
		"aired": "2001-10-22T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 205,
		"ratingFiveStars": 67.9,
		"ratingAllStars": 91.4,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262952&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.9, "nbOfVotes": 36 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 12 },
			{ "star": 3, "rating": 7.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Suna Suna Clan's Secret Base",
		"aired": "2001-10-29T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 206,
		"ratingFiveStars": 73.2,
		"ratingAllStars": 92.2,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262954&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.2, "nbOfVotes": 30 },
			{ "star": 4, "rating": 19.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 1 }
		],
		"title": "Ignition",
		"aired": "2001-11-05T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 207,
		"ratingFiveStars": 64.1,
		"ratingAllStars": 90.2,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262955&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.1, "nbOfVotes": 25 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 10 },
			{ "star": 3, "rating": 7.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Nightmare",
		"aired": "2001-11-12T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 208,
		"ratingFiveStars": 76.7,
		"ratingAllStars": 94,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=155130&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.7, "nbOfVotes": 46 },
			{ "star": 4, "rating": 18.3, "nbOfVotes": 11 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Guardian Spirits",
		"aired": "2001-11-19T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 209,
		"ratingFiveStars": 81.8,
		"ratingAllStars": 95.2,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262956&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.8, "nbOfVotes": 27 },
			{ "star": 4, "rating": 12.1, "nbOfVotes": 4 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I Will Surpass You",
		"aired": "2001-11-26T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 210,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 91.2,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262958&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 29 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "0",
		"aired": "2001-12-03T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 211,
		"ratingFiveStars": 74.5,
		"ratingAllStars": 93.2,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=160613&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.5, "nbOfVotes": 35 },
			{ "star": 4, "rating": 21.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 1 }
		],
		"title": "King",
		"aired": "2001-12-10T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 212,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 93.8,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262960&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 35 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Some Justice",
		"aired": "2001-12-17T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 213,
		"ratingFiveStars": 76,
		"ratingAllStars": 93.6,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262962&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76, "nbOfVotes": 38 },
			{ "star": 4, "rating": 16, "nbOfVotes": 8 },
			{ "star": 3, "rating": 8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "VIP",
		"aired": "2001-12-28T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 214,
		"ratingFiveStars": 73,
		"ratingAllStars": 93.6,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262963&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73, "nbOfVotes": 27 },
			{ "star": 4, "rating": 21.6, "nbOfVotes": 8 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Plan to Escape from the Kingdom of Sand",
		"aired": "2002-01-07T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 215,
		"ratingFiveStars": 68.2,
		"ratingAllStars": 93.2,
		"nbOfVotes": 44,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=160828&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.2, "nbOfVotes": 30 },
			{ "star": 4, "rating": 29.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Last Waltz",
		"aired": "2002-01-21T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 216,
		"ratingFiveStars": 79.7,
		"ratingAllStars": 93.8,
		"nbOfVotes": 123,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=160832&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.7, "nbOfVotes": 98 },
			{ "star": 4, "rating": 14.6, "nbOfVotes": 18 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Vivi's Adventure",
		"aired": "2002-01-28T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 217,
		"ratingFiveStars": 60.6,
		"ratingAllStars": 87.8,
		"nbOfVotes": 66,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=160862&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.6, "nbOfVotes": 40 },
			{ "star": 4, "rating": 24.2, "nbOfVotes": 16 },
			{ "star": 3, "rating": 10.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 1 }
		],
		"title": "Stowaway",
		"aired": "2002-02-04T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 218,
		"ratingFiveStars": 69.4,
		"ratingAllStars": 90.4,
		"nbOfVotes": 62,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262969&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.4, "nbOfVotes": 43 },
			{ "star": 4, "rating": 16.1, "nbOfVotes": 10 },
			{ "star": 3, "rating": 12.9, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 1 }
		],
		"title": "Why the Log Pose is Spherical",
		"aired": "2002-02-18T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 219,
		"ratingFiveStars": 61.4,
		"ratingAllStars": 87.8,
		"nbOfVotes": 44,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262974&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.4, "nbOfVotes": 27 },
			{ "star": 4, "rating": 18.2, "nbOfVotes": 8 },
			{ "star": 3, "rating": 18.2, "nbOfVotes": 8 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Salvage King Masira",
		"aired": "2002-02-25T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 220,
		"ratingFiveStars": 51,
		"ratingAllStars": 87,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262975&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51, "nbOfVotes": 25 },
			{ "star": 4, "rating": 34.7, "nbOfVotes": 17 },
			{ "star": 3, "rating": 12.2, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sea Floor Stroll",
		"aired": "2002-03-04T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 221,
		"ratingFiveStars": 68.8,
		"ratingAllStars": 91.2,
		"nbOfVotes": 48,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262977&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.8, "nbOfVotes": 33 },
			{ "star": 4, "rating": 20.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Monsters",
		"aired": "2002-03-11T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 222,
		"ratingFiveStars": 60.4,
		"ratingAllStars": 90.6,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=158083&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.4, "nbOfVotes": 32 },
			{ "star": 4, "rating": 32.1, "nbOfVotes": 17 },
			{ "star": 3, "rating": 7.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Big-Time Rookies",
		"aired": "2002-03-18T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 223,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 90.2,
		"nbOfVotes": 51,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262979&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 34 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 10 },
			{ "star": 3, "rating": 11.8, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I Promise Not to Fight Within This Town",
		"aired": "2002-03-25T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 224,
		"ratingFiveStars": 66,
		"ratingAllStars": 91.2,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262980&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66, "nbOfVotes": 33 },
			{ "star": 4, "rating": 24, "nbOfVotes": 12 },
			{ "star": 3, "rating": 10, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Never Dream",
		"aired": "2002-04-01T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 225,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 93.8,
		"nbOfVotes": 54,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262981&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 42 },
			{ "star": 4, "rating": 13, "nbOfVotes": 7 },
			{ "star": 3, "rating": 9.3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "A Man's Dream",
		"aired": "2002-04-08T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 226,
		"ratingFiveStars": 49.2,
		"ratingAllStars": 85.4,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262982&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.2, "nbOfVotes": 29 },
			{ "star": 4, "rating": 32.2, "nbOfVotes": 19 },
			{ "star": 3, "rating": 15.3, "nbOfVotes": 9 },
			{ "star": 2, "rating": 3.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Shoujou King of the Ocean Floor Searches",
		"aired": "2002-04-15T00:00:00+00:00",
		"score": 4.2700000000000005
	},
	{
		"episodeNb": 227,
		"ratingFiveStars": 54.3,
		"ratingAllStars": 84.8,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262993&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.3, "nbOfVotes": 25 },
			{ "star": 4, "rating": 23.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 15.2, "nbOfVotes": 7 },
			{ "star": 2, "rating": 4.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 1 }
		],
		"title": "Noland the Liar",
		"aired": "2002-04-22T00:00:00+00:00",
		"score": 4.24
	},
	{
		"episodeNb": 228,
		"ratingFiveStars": 58.5,
		"ratingAllStars": 86.8,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262995&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.5, "nbOfVotes": 24 },
			{ "star": 4, "rating": 22, "nbOfVotes": 9 },
			{ "star": 3, "rating": 14.6, "nbOfVotes": 6 },
			{ "star": 2, "rating": 4.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Last Boss of the Allied Saruyama Forces, Montblanc Cricket",
		"aired": "2002-04-27T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 229,
		"ratingFiveStars": 51.3,
		"ratingAllStars": 87.6,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262997&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.3, "nbOfVotes": 20 },
			{ "star": 4, "rating": 35.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 12.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Let's Eat",
		"aired": "2002-05-13T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 230,
		"ratingFiveStars": 59.2,
		"ratingAllStars": 86.6,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262998&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.2, "nbOfVotes": 29 },
			{ "star": 4, "rating": 20.4, "nbOfVotes": 10 },
			{ "star": 3, "rating": 14.3, "nbOfVotes": 7 },
			{ "star": 2, "rating": 6.1, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Find the South Bird!!",
		"aired": "2002-05-20T00:00:00+00:00",
		"score": 4.33
	},
	{
		"episodeNb": 231,
		"ratingFiveStars": 53.8,
		"ratingAllStars": 88.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=262999&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.8, "nbOfVotes": 21 },
			{ "star": 4, "rating": 35.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Bellamy the Hyena",
		"aired": "2002-05-27T00:00:00+00:00",
		"score": 4.4399999999999995
	},
	{
		"episodeNb": 232,
		"ratingFiveStars": 73.5,
		"ratingAllStars": 92.2,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=130237&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.5, "nbOfVotes": 36 },
			{ "star": 4, "rating": 16.3, "nbOfVotes": 8 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Hundred Million Man",
		"aired": "2002-06-03T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 233,
		"ratingFiveStars": 79.6,
		"ratingAllStars": 93,
		"nbOfVotes": 54,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=130493&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.6, "nbOfVotes": 43 },
			{ "star": 4, "rating": 13, "nbOfVotes": 7 },
			{ "star": 3, "rating": 3.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3.7, "nbOfVotes": 2 }
		],
		"title": "The Highest Authority in the World",
		"aired": "2002-06-10T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 234,
		"ratingFiveStars": 82,
		"ratingAllStars": 95.8,
		"nbOfVotes": 61,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=130494&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82, "nbOfVotes": 50 },
			{ "star": 4, "rating": 14.8, "nbOfVotes": 9 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Please Be Sure to Remember It",
		"aired": "2002-06-17T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 235,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 90,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263002&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 25 },
			{ "star": 4, "rating": 25, "nbOfVotes": 10 },
			{ "star": 3, "rating": 12.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Knock Up Stream",
		"aired": "2002-06-24T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 236,
		"ratingFiveStars": 61.7,
		"ratingAllStars": 91.4,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263003&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.7, "nbOfVotes": 37 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 20 },
			{ "star": 3, "rating": 5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Ship Goes Into the Sky",
		"aired": "2002-07-01T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 237,
		"ratingFiveStars": 70.5,
		"ratingAllStars": 92.8,
		"nbOfVotes": 44,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=161875&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.5, "nbOfVotes": 31 },
			{ "star": 4, "rating": 22.7, "nbOfVotes": 10 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "In the Sky",
		"aired": "2002-07-08T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 238,
		"ratingFiveStars": 63.3,
		"ratingAllStars": 89.8,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263005&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.3, "nbOfVotes": 31 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 4.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Heaven's Gate",
		"aired": "2002-07-15T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 239,
		"ratingFiveStars": 65.9,
		"ratingAllStars": 90.8,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263007&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.9, "nbOfVotes": 27 },
			{ "star": 4, "rating": 24.4, "nbOfVotes": 10 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Angel Beach",
		"aired": "2002-07-22T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 240,
		"ratingFiveStars": 55.8,
		"ratingAllStars": 89.6,
		"nbOfVotes": 52,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263009&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.8, "nbOfVotes": 29 },
			{ "star": 4, "rating": 38.5, "nbOfVotes": 20 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Dial Energy",
		"aired": "2002-07-29T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 241,
		"ratingFiveStars": 65,
		"ratingAllStars": 90,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263010&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65, "nbOfVotes": 26 },
			{ "star": 4, "rating": 22.5, "nbOfVotes": 9 },
			{ "star": 3, "rating": 10, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Judgement of Heaven",
		"aired": "2002-08-05T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 242,
		"ratingFiveStars": 55.9,
		"ratingAllStars": 87.6,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263011&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.9, "nbOfVotes": 19 },
			{ "star": 4, "rating": 32.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 8.8, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 1 }
		],
		"title": "Class-2 Criminals",
		"aired": "2002-08-12T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 243,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 90.6,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263012&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 25 },
			{ "star": 4, "rating": 27.5, "nbOfVotes": 11 },
			{ "star": 3, "rating": 10, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ordeals",
		"aired": "2002-08-26T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 244,
		"ratingFiveStars": 79.5,
		"ratingAllStars": 94.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263013&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.5, "nbOfVotes": 31 },
			{ "star": 4, "rating": 15.4, "nbOfVotes": 6 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "SOS",
		"aired": "2002-09-02T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 245,
		"ratingFiveStars": 69.8,
		"ratingAllStars": 92.6,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263014&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.8, "nbOfVotes": 30 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure on God's Island",
		"aired": "2002-09-09T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 246,
		"ratingFiveStars": 64,
		"ratingAllStars": 91.2,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263016&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64, "nbOfVotes": 32 },
			{ "star": 4, "rating": 28, "nbOfVotes": 14 },
			{ "star": 3, "rating": 8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Satori, Priest of the Wandering Forest",
		"aired": "2002-09-14T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 247,
		"ratingFiveStars": 63.4,
		"ratingAllStars": 90.2,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=200117&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.4, "nbOfVotes": 26 },
			{ "star": 4, "rating": 26.8, "nbOfVotes": 11 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ordeal of Balls",
		"aired": "2002-09-22T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 248,
		"ratingFiveStars": 64.9,
		"ratingAllStars": 91.4,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263105&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.9, "nbOfVotes": 24 },
			{ "star": 4, "rating": 27, "nbOfVotes": 10 },
			{ "star": 3, "rating": 8.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Former God vs. Priest",
		"aired": "2002-10-07T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 249,
		"ratingFiveStars": 59,
		"ratingAllStars": 88.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263107&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59, "nbOfVotes": 23 },
			{ "star": 4, "rating": 28.2, "nbOfVotes": 11 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Hidden Cloud Village",
		"aired": "2002-10-12T00:00:00+00:00",
		"score": 4.4399999999999995
	},
	{
		"episodeNb": 250,
		"ratingFiveStars": 59.3,
		"ratingAllStars": 86.4,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263108&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.3, "nbOfVotes": 35 },
			{ "star": 4, "rating": 25.4, "nbOfVotes": 15 },
			{ "star": 3, "rating": 8.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 5.1, "nbOfVotes": 3 }
		],
		"title": "Ball Dragon",
		"aired": "2002-10-21T00:00:00+00:00",
		"score": 4.32
	},
	{
		"episodeNb": 251,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 90,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263109&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 31 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 7 },
			{ "star": 3, "rating": 17.4, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Overture",
		"aired": "2002-10-28T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 252,
		"ratingFiveStars": 68.6,
		"ratingAllStars": 92,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263117&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.6, "nbOfVotes": 24 },
			{ "star": 4, "rating": 22.9, "nbOfVotes": 8 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Junction",
		"aired": "2002-11-02T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 253,
		"ratingFiveStars": 73.8,
		"ratingAllStars": 94.2,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=200148&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.8, "nbOfVotes": 31 },
			{ "star": 4, "rating": 23.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Vearth",
		"aired": "2002-11-11T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 254,
		"ratingFiveStars": 52.6,
		"ratingAllStars": 87.8,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263120&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52.6, "nbOfVotes": 20 },
			{ "star": 4, "rating": 36.8, "nbOfVotes": 14 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Aubade",
		"aired": "2002-11-18T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 255,
		"ratingFiveStars": 59.4,
		"ratingAllStars": 90.6,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=200149&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.4, "nbOfVotes": 38 },
			{ "star": 4, "rating": 34.4, "nbOfVotes": 22 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Anaconda and the Search Team",
		"aired": "2002-11-25T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 256,
		"ratingFiveStars": 60.9,
		"ratingAllStars": 88.2,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=201486&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.9, "nbOfVotes": 28 },
			{ "star": 4, "rating": 23.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 13, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 1 }
		],
		"title": "Wiper the \"Berserker\"",
		"aired": "2002-12-02T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 257,
		"ratingFiveStars": 53.8,
		"ratingAllStars": 88.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263121&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.8, "nbOfVotes": 21 },
			{ "star": 4, "rating": 35.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Dial Battle",
		"aired": "2002-12-09T00:00:00+00:00",
		"score": 4.4399999999999995
	},
	{
		"episodeNb": 258,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 91.2,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263122&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 26 },
			{ "star": 4, "rating": 23.1, "nbOfVotes": 9 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Several Ways South",
		"aired": "2002-12-16T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 259,
		"ratingFiveStars": 65.9,
		"ratingAllStars": 91.4,
		"nbOfVotes": 44,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263123&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.9, "nbOfVotes": 29 },
			{ "star": 4, "rating": 25, "nbOfVotes": 11 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Zoro the Pirate vs. Braham the Warrior",
		"aired": "2002-12-30T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 260,
		"ratingFiveStars": 48.9,
		"ratingAllStars": 86.8,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263124&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 48.9, "nbOfVotes": 23 },
			{ "star": 4, "rating": 38.3, "nbOfVotes": 18 },
			{ "star": 3, "rating": 10.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy the Pirate vs. Wiper the Berserker",
		"aired": "2003-01-06T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 261,
		"ratingFiveStars": 62.2,
		"ratingAllStars": 88.2,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263127&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.2, "nbOfVotes": 23 },
			{ "star": 4, "rating": 21.6, "nbOfVotes": 8 },
			{ "star": 3, "rating": 13.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 1 }
		],
		"title": "Genbo the Warrior vs. Yama the Head Holy Guard",
		"aired": "2003-01-20T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 262,
		"ratingFiveStars": 64.9,
		"ratingAllStars": 90.8,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263128&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.9, "nbOfVotes": 24 },
			{ "star": 4, "rating": 24.3, "nbOfVotes": 9 },
			{ "star": 3, "rating": 10.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Chopper the Pirate vs. Gedatsu the Priest",
		"aired": "2003-01-27T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 263,
		"ratingFiveStars": 55.6,
		"ratingAllStars": 87.8,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263130&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.6, "nbOfVotes": 20 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 12 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 5.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Nami the Pirate and the Weird Knight vs. the Holy Guard Second-in-Command Hotori and Kotori",
		"aired": "2003-02-03T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 264,
		"ratingFiveStars": 56.6,
		"ratingAllStars": 89,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263131&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.6, "nbOfVotes": 30 },
			{ "star": 4, "rating": 32.1, "nbOfVotes": 17 },
			{ "star": 3, "rating": 11.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Kamakiri the Warrior vs. God Enel",
		"aired": "2003-02-10T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 265,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 90.4,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263136&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 31 },
			{ "star": 4, "rating": 17.4, "nbOfVotes": 8 },
			{ "star": 3, "rating": 15.2, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Robin the Pirate vs. Yama the Head Holy Warrior",
		"aired": "2003-02-17T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 266,
		"ratingFiveStars": 56.8,
		"ratingAllStars": 89.8,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263145&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.8, "nbOfVotes": 21 },
			{ "star": 4, "rating": 35.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 8.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Chopper the Pirate vs. Ohm the Priest",
		"aired": "2003-02-24T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 267,
		"ratingFiveStars": 71.8,
		"ratingAllStars": 93.4,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263146&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.8, "nbOfVotes": 28 },
			{ "star": 4, "rating": 23.1, "nbOfVotes": 9 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "March",
		"aired": "2003-03-03T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 268,
		"ratingFiveStars": 64.9,
		"ratingAllStars": 90.8,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263150&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.9, "nbOfVotes": 24 },
			{ "star": 4, "rating": 24.3, "nbOfVotes": 9 },
			{ "star": 3, "rating": 10.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Suite",
		"aired": "2003-03-10T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 269,
		"ratingFiveStars": 67.6,
		"ratingAllStars": 93.6,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263152&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.6, "nbOfVotes": 23 },
			{ "star": 4, "rating": 32.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Concerto",
		"aired": "2003-03-17T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 270,
		"ratingFiveStars": 69.2,
		"ratingAllStars": 90.2,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263153&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.2, "nbOfVotes": 27 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 7 },
			{ "star": 3, "rating": 7.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 5.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Serenade",
		"aired": "2003-03-31T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 271,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 92,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263155&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 25 },
			{ "star": 4, "rating": 20, "nbOfVotes": 7 },
			{ "star": 3, "rating": 5.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Zoro the Pirate vs. Ohm the Priest",
		"aired": "2003-04-07T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 272,
		"ratingFiveStars": 62.2,
		"ratingAllStars": 89.2,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263157&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.2, "nbOfVotes": 23 },
			{ "star": 4, "rating": 27, "nbOfVotes": 10 },
			{ "star": 3, "rating": 8.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 1 }
		],
		"title": "Play",
		"aired": "2003-04-14T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 273,
		"ratingFiveStars": 65.1,
		"ratingAllStars": 91.2,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263158&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.1, "nbOfVotes": 28 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 11 },
			{ "star": 3, "rating": 9.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Quintet",
		"aired": "2003-04-21T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 274,
		"ratingFiveStars": 70.6,
		"ratingAllStars": 94.2,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263159&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.6, "nbOfVotes": 24 },
			{ "star": 4, "rating": 29.4, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Oratorio",
		"aired": "2003-04-28T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 275,
		"ratingFiveStars": 66.1,
		"ratingAllStars": 89.8,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263161&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.1, "nbOfVotes": 39 },
			{ "star": 4, "rating": 23.7, "nbOfVotes": 14 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 3.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 1 }
		],
		"title": "Divina Commedia",
		"aired": "2003-05-12T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 276,
		"ratingFiveStars": 55.3,
		"ratingAllStars": 87.4,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263164&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.3, "nbOfVotes": 21 },
			{ "star": 4, "rating": 31.6, "nbOfVotes": 12 },
			{ "star": 3, "rating": 10.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 1 }
		],
		"title": "Shandia Rhythm",
		"aired": "2003-05-19T00:00:00+00:00",
		"score": 4.37
	},
	{
		"episodeNb": 277,
		"ratingFiveStars": 71,
		"ratingAllStars": 91.6,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263166&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71, "nbOfVotes": 22 },
			{ "star": 4, "rating": 16.1, "nbOfVotes": 5 },
			{ "star": 3, "rating": 12.9, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Maxim",
		"aired": "2003-05-26T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 278,
		"ratingFiveStars": 73,
		"ratingAllStars": 94,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263167&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73, "nbOfVotes": 27 },
			{ "star": 4, "rating": 24.3, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Conis",
		"aired": "2003-06-02T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 279,
		"ratingFiveStars": 92.2,
		"ratingAllStars": 98,
		"nbOfVotes": 51,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263168&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 92.2, "nbOfVotes": 47 },
			{ "star": 4, "rating": 5.9, "nbOfVotes": 3 },
			{ "star": 3, "rating": 2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy the Pirate vs. God Enel",
		"aired": "2003-06-09T00:00:00+00:00",
		"score": 4.9
	},
	{
		"episodeNb": 280,
		"ratingFiveStars": 78.6,
		"ratingAllStars": 95.8,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263169&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.6, "nbOfVotes": 33 },
			{ "star": 4, "rating": 21.4, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Surfacing",
		"aired": "2003-06-16T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 281,
		"ratingFiveStars": 80.5,
		"ratingAllStars": 96,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263170&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.5, "nbOfVotes": 33 },
			{ "star": 4, "rating": 19.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Deathpiea",
		"aired": "2003-06-23T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 282,
		"ratingFiveStars": 63.9,
		"ratingAllStars": 92.2,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263171&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.9, "nbOfVotes": 23 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 12 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Desire",
		"aired": "2003-06-30T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 283,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 91.4,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263172&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 25 },
			{ "star": 4, "rating": 17.1, "nbOfVotes": 6 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Operation Love Rescue: Front Line",
		"aired": "2003-07-07T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 284,
		"ratingFiveStars": 71.8,
		"ratingAllStars": 93.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263173&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.8, "nbOfVotes": 28 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Thanks",
		"aired": "2003-07-14T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 285,
		"ratingFiveStars": 71.7,
		"ratingAllStars": 92.8,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263175&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.7, "nbOfVotes": 38 },
			{ "star": 4, "rating": 24.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 1 }
		],
		"title": "Capriccio",
		"aired": "2003-07-19T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 286,
		"ratingFiveStars": 60.5,
		"ratingAllStars": 89.4,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263178&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.5, "nbOfVotes": 23 },
			{ "star": 4, "rating": 28.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Monster of Shandora",
		"aired": "2003-07-28T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 287,
		"ratingFiveStars": 63.4,
		"ratingAllStars": 88.8,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263179&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.4, "nbOfVotes": 26 },
			{ "star": 4, "rating": 22, "nbOfVotes": 9 },
			{ "star": 3, "rating": 12.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 1 }
		],
		"title": "Godkiller",
		"aired": "2003-08-11T00:00:00+00:00",
		"score": 4.4399999999999995
	},
	{
		"episodeNb": 288,
		"ratingFiveStars": 57.9,
		"ratingAllStars": 87.4,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263180&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.9, "nbOfVotes": 22 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 10.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 5.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Curse",
		"aired": "2003-08-25T00:00:00+00:00",
		"score": 4.37
	},
	{
		"episodeNb": 289,
		"ratingFiveStars": 73.7,
		"ratingAllStars": 92.2,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=162339&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.7, "nbOfVotes": 28 },
			{ "star": 4, "rating": 18.4, "nbOfVotes": 7 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 1 }
		],
		"title": "Full Moon",
		"aired": "2003-09-01T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 290,
		"ratingFiveStars": 63.9,
		"ratingAllStars": 90,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263181&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.9, "nbOfVotes": 23 },
			{ "star": 4, "rating": 22.2, "nbOfVotes": 8 },
			{ "star": 3, "rating": 13.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Light of Shandora",
		"aired": "2003-09-08T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 291,
		"ratingFiveStars": 81.6,
		"ratingAllStars": 94.8,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263182&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.6, "nbOfVotes": 31 },
			{ "star": 4, "rating": 13.2, "nbOfVotes": 5 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I'm Right Here",
		"aired": "2003-09-13T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 292,
		"ratingFiveStars": 89.1,
		"ratingAllStars": 97.4,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=207556&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.1, "nbOfVotes": 41 },
			{ "star": 4, "rating": 8.7, "nbOfVotes": 4 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Meeting a Broken Moon Through the Clouds",
		"aired": "2003-09-22T00:00:00+00:00",
		"score": 4.87
	},
	{
		"episodeNb": 293,
		"ratingFiveStars": 71,
		"ratingAllStars": 93,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263183&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71, "nbOfVotes": 22 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 6.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Bolero",
		"aired": "2003-09-29T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 294,
		"ratingFiveStars": 69.7,
		"ratingAllStars": 92.8,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263184&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.7, "nbOfVotes": 23 },
			{ "star": 4, "rating": 24.2, "nbOfVotes": 8 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Raigoh",
		"aired": "2003-10-06T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 295,
		"ratingFiveStars": 65.1,
		"ratingAllStars": 92,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263185&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.1, "nbOfVotes": 28 },
			{ "star": 4, "rating": 30.2, "nbOfVotes": 13 },
			{ "star": 3, "rating": 4.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Giant Jack",
		"aired": "2003-10-11T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 296,
		"ratingFiveStars": 70.6,
		"ratingAllStars": 91.2,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263186&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.6, "nbOfVotes": 24 },
			{ "star": 4, "rating": 20.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 5.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "High-Altitude Situation",
		"aired": "2003-10-20T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 297,
		"ratingFiveStars": 74.4,
		"ratingAllStars": 92.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=207598&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.4, "nbOfVotes": 29 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 7 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Praises of the Earth",
		"aired": "2003-10-27T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 298,
		"ratingFiveStars": 84.6,
		"ratingAllStars": 96.4,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=207603&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.6, "nbOfVotes": 33 },
			{ "star": 4, "rating": 12.8, "nbOfVotes": 5 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Love Song",
		"aired": "2003-11-01T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 299,
		"ratingFiveStars": 89.3,
		"ratingAllStars": 97.2,
		"nbOfVotes": 56,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=207683&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.3, "nbOfVotes": 50 },
			{ "star": 4, "rating": 7.1, "nbOfVotes": 4 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Fantasia",
		"aired": "2003-11-10T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 300,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 91.4,
		"nbOfVotes": 75,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=207687&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 50 },
			{ "star": 4, "rating": 28, "nbOfVotes": 21 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 1 }
		],
		"title": "Symphony",
		"aired": "2003-11-22T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 301,
		"ratingFiveStars": 66,
		"ratingAllStars": 90.2,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=207692&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66, "nbOfVotes": 35 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 12 },
			{ "star": 3, "rating": 9.4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 1 }
		],
		"title": "I Was Here",
		"aired": "2003-12-01T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 302,
		"ratingFiveStars": 76.9,
		"ratingAllStars": 93.8,
		"nbOfVotes": 65,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=207695&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.9, "nbOfVotes": 50 },
			{ "star": 4, "rating": 18.5, "nbOfVotes": 12 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Finale",
		"aired": "2003-12-08T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 303,
		"ratingFiveStars": 59,
		"ratingAllStars": 90.4,
		"nbOfVotes": 61,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=208169&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59, "nbOfVotes": 36 },
			{ "star": 4, "rating": 34.4, "nbOfVotes": 21 },
			{ "star": 3, "rating": 6.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rich Pirates",
		"aired": "2003-12-15T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 304,
		"ratingFiveStars": 57.1,
		"ratingAllStars": 88.6,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263191&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.1, "nbOfVotes": 24 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 14 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 1 }
		],
		"title": "Adventure on a Long Island",
		"aired": "2003-12-22T00:00:00+00:00",
		"score": 4.43
	},
	{
		"episodeNb": 305,
		"ratingFiveStars": 51.6,
		"ratingAllStars": 86.8,
		"nbOfVotes": 62,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263192&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.6, "nbOfVotes": 32 },
			{ "star": 4, "rating": 33.9, "nbOfVotes": 21 },
			{ "star": 3, "rating": 11.3, "nbOfVotes": 7 },
			{ "star": 2, "rating": 3.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Foxy the Silver Fox",
		"aired": "2004-01-05T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 306,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 90,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=208908&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 25 },
			{ "star": 4, "rating": 25, "nbOfVotes": 10 },
			{ "star": 3, "rating": 12.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Donut Race!!",
		"aired": "2004-01-19T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 307,
		"ratingFiveStars": 42.4,
		"ratingAllStars": 81.8,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263194&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 42.4, "nbOfVotes": 14 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 11 },
			{ "star": 3, "rating": 15.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 9.1, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ready, Donuts!!",
		"aired": "2004-01-26T00:00:00+00:00",
		"score": 4.09
	},
	{
		"episodeNb": 308,
		"ratingFiveStars": 51.5,
		"ratingAllStars": 83,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263199&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 51.5, "nbOfVotes": 17 },
			{ "star": 4, "rating": 24.2, "nbOfVotes": 8 },
			{ "star": 3, "rating": 15.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 6.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 3, "nbOfVotes": 1 }
		],
		"title": "The Grand Interference Plan",
		"aired": "2004-02-02T00:00:00+00:00",
		"score": 4.15
	},
	{
		"episodeNb": 309,
		"ratingFiveStars": 43.8,
		"ratingAllStars": 83.8,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263201&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 43.8, "nbOfVotes": 14 },
			{ "star": 4, "rating": 34.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 18.8, "nbOfVotes": 6 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Groggy Monsters",
		"aired": "2004-02-09T00:00:00+00:00",
		"score": 4.1899999999999995
	},
	{
		"episodeNb": 310,
		"ratingFiveStars": 38.5,
		"ratingAllStars": 81.6,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263202&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 38.5, "nbOfVotes": 15 },
			{ "star": 4, "rating": 38.5, "nbOfVotes": 15 },
			{ "star": 3, "rating": 17.9, "nbOfVotes": 7 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 1 }
		],
		"title": "Groggy Ring!!",
		"aired": "2004-02-16T00:00:00+00:00",
		"score": 4.08
	},
	{
		"episodeNb": 311,
		"ratingFiveStars": 44.4,
		"ratingAllStars": 80,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263203&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 44.4, "nbOfVotes": 16 },
			{ "star": 4, "rating": 30.6, "nbOfVotes": 11 },
			{ "star": 3, "rating": 13.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 2.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 8.3, "nbOfVotes": 3 }
		],
		"title": "Rough Game",
		"aired": "2004-02-23T00:00:00+00:00",
		"score": 4
	},
	{
		"episodeNb": 312,
		"ratingFiveStars": 60,
		"ratingAllStars": 91.4,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263204&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60, "nbOfVotes": 21 },
			{ "star": 4, "rating": 37.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Goal!!",
		"aired": "2004-03-01T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 313,
		"ratingFiveStars": 44.1,
		"ratingAllStars": 83.6,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=209216&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 44.1, "nbOfVotes": 15 },
			{ "star": 4, "rating": 35.3, "nbOfVotes": 12 },
			{ "star": 3, "rating": 17.6, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 1 }
		],
		"title": "Main Event",
		"aired": "2004-03-08T00:00:00+00:00",
		"score": 4.18
	},
	{
		"episodeNb": 314,
		"ratingFiveStars": 33.3,
		"ratingAllStars": 78.6,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=209230&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 33.3, "nbOfVotes": 10 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 30, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3.3, "nbOfVotes": 1 }
		],
		"title": "Combat!!!",
		"aired": "2004-03-15T00:00:00+00:00",
		"score": 3.9299999999999997
	},
	{
		"episodeNb": 315,
		"ratingFiveStars": 54.3,
		"ratingAllStars": 84.6,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=209235&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.3, "nbOfVotes": 19 },
			{ "star": 4, "rating": 22.9, "nbOfVotes": 8 },
			{ "star": 3, "rating": 17.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 1 }
		],
		"title": "Secret Room",
		"aired": "2004-03-22T00:00:00+00:00",
		"score": 4.2299999999999995
	},
	{
		"episodeNb": 316,
		"ratingFiveStars": 42.9,
		"ratingAllStars": 82.8,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=209236&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 42.9, "nbOfVotes": 18 },
			{ "star": 4, "rating": 40.5, "nbOfVotes": 17 },
			{ "star": 3, "rating": 9.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 4.8, "nbOfVotes": 2 }
		],
		"title": "Brother Soul",
		"aired": "2004-03-29T00:00:00+00:00",
		"score": 4.14
	},
	{
		"episodeNb": 317,
		"ratingFiveStars": 54.5,
		"ratingAllStars": 88.4,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263209&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.5, "nbOfVotes": 18 },
			{ "star": 4, "rating": 39.4, "nbOfVotes": 13 },
			{ "star": 3, "rating": 3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3, "nbOfVotes": 1 }
		],
		"title": "K.O.",
		"aired": "2004-04-12T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 318,
		"ratingFiveStars": 60,
		"ratingAllStars": 91.4,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263211&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60, "nbOfVotes": 21 },
			{ "star": 4, "rating": 37.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Closure",
		"aired": "2004-04-19T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 319,
		"ratingFiveStars": 70.6,
		"ratingAllStars": 94.2,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263213&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.6, "nbOfVotes": 24 },
			{ "star": 4, "rating": 29.4, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Marine Headquarters \"Admiral\" Aokiji",
		"aired": "2004-04-26T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 320,
		"ratingFiveStars": 84.8,
		"ratingAllStars": 97,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263215&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.8, "nbOfVotes": 39 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Greatest Power",
		"aired": "2004-05-10T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 321,
		"ratingFiveStars": 72.3,
		"ratingAllStars": 92.8,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263216&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.3, "nbOfVotes": 34 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 1 }
		],
		"title": "One-on-One",
		"aired": "2004-05-17T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 322,
		"ratingFiveStars": 50,
		"ratingAllStars": 85.4,
		"nbOfVotes": 52,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263221&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50, "nbOfVotes": 26 },
			{ "star": 4, "rating": 36.5, "nbOfVotes": 19 },
			{ "star": 3, "rating": 7.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.8, "nbOfVotes": 2 }
		],
		"title": "Puffing Tom",
		"aired": "2004-05-24T00:00:00+00:00",
		"score": 4.2700000000000005
	},
	{
		"episodeNb": 323,
		"ratingFiveStars": 54.3,
		"ratingAllStars": 89.2,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263223&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.3, "nbOfVotes": 19 },
			{ "star": 4, "rating": 37.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Water Metropolis, Water 7",
		"aired": "2004-05-31T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 324,
		"ratingFiveStars": 54.5,
		"ratingAllStars": 88.2,
		"nbOfVotes": 44,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263225&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.5, "nbOfVotes": 24 },
			{ "star": 4, "rating": 36.4, "nbOfVotes": 16 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 1 }
		],
		"title": "Adventure in the City of Water",
		"aired": "2004-06-07T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 325,
		"ratingFiveStars": 71,
		"ratingAllStars": 93.6,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263226&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71, "nbOfVotes": 22 },
			{ "star": 4, "rating": 25.8, "nbOfVotes": 8 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Franky Family",
		"aired": "2004-06-14T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 326,
		"ratingFiveStars": 77.4,
		"ratingAllStars": 93,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263227&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.4, "nbOfVotes": 24 },
			{ "star": 4, "rating": 12.9, "nbOfVotes": 4 },
			{ "star": 3, "rating": 6.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 3.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Iceburg-san",
		"aired": "2004-06-21T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 327,
		"ratingFiveStars": 61.7,
		"ratingAllStars": 90.6,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263228&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.7, "nbOfVotes": 29 },
			{ "star": 4, "rating": 31.9, "nbOfVotes": 15 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Shipyard Island, Construction Dock No. 1",
		"aired": "2004-06-28T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 328,
		"ratingFiveStars": 69.2,
		"ratingAllStars": 91.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=209571&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.2, "nbOfVotes": 27 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 5.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Pirate Kidnapping Incident",
		"aired": "2004-07-12T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 329,
		"ratingFiveStars": 71.7,
		"ratingAllStars": 94.4,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=209591&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.7, "nbOfVotes": 33 },
			{ "star": 4, "rating": 28.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "My Name is \"Franky\"",
		"aired": "2004-07-17T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 330,
		"ratingFiveStars": 82.2,
		"ratingAllStars": 96.4,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=209592&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.2, "nbOfVotes": 37 },
			{ "star": 4, "rating": 17.8, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I've Decided",
		"aired": "2004-07-26T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 331,
		"ratingFiveStars": 84.7,
		"ratingAllStars": 96.6,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263230&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.7, "nbOfVotes": 50 },
			{ "star": 4, "rating": 13.6, "nbOfVotes": 8 },
			{ "star": 3, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "A Big Quarrel",
		"aired": "2004-08-02T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 332,
		"ratingFiveStars": 88.1,
		"ratingAllStars": 96.2,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263232&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.1, "nbOfVotes": 37 },
			{ "star": 4, "rating": 7.1, "nbOfVotes": 3 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy vs. Usopp",
		"aired": "2004-08-09T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 333,
		"ratingFiveStars": 93.3,
		"ratingAllStars": 98.6,
		"nbOfVotes": 75,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263233&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 93.3, "nbOfVotes": 70 },
			{ "star": 4, "rating": 6.7, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Captain",
		"aired": "2004-08-23T00:00:00+00:00",
		"score": 4.93
	},
	{
		"episodeNb": 334,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 91.4,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263234&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 20 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 7 },
			{ "star": 3, "rating": 10, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Case of the Sealed Room",
		"aired": "2004-08-30T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 335,
		"ratingFiveStars": 77.4,
		"ratingAllStars": 95.4,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263235&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.4, "nbOfVotes": 24 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Warning",
		"aired": "2004-09-06T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 336,
		"ratingFiveStars": 72.5,
		"ratingAllStars": 93.6,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263236&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.5, "nbOfVotes": 29 },
			{ "star": 4, "rating": 25, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy vs. Franky",
		"aired": "2004-09-13T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 337,
		"ratingFiveStars": 75,
		"ratingAllStars": 93.8,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263241&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 27 },
			{ "star": 4, "rating": 19.4, "nbOfVotes": 7 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Bodyguards of the \"Water Metropolis\"",
		"aired": "2004-09-18T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 338,
		"ratingFiveStars": 75.8,
		"ratingAllStars": 94.6,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263242&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.8, "nbOfVotes": 25 },
			{ "star": 4, "rating": 21.2, "nbOfVotes": 7 },
			{ "star": 3, "rating": 3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Coup de Vent",
		"aired": "2004-09-27T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 339,
		"ratingFiveStars": 67.6,
		"ratingAllStars": 93,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263243&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.6, "nbOfVotes": 23 },
			{ "star": 4, "rating": 29.4, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rumors",
		"aired": "2004-10-04T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 340,
		"ratingFiveStars": 81,
		"ratingAllStars": 95.2,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263245&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81, "nbOfVotes": 34 },
			{ "star": 4, "rating": 14.3, "nbOfVotes": 6 },
			{ "star": 3, "rating": 4.8, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Woman Who Brings Darkness",
		"aired": "2004-10-09T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 341,
		"ratingFiveStars": 63.9,
		"ratingAllStars": 92.2,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263246&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.9, "nbOfVotes": 23 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 12 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Devil",
		"aired": "2004-10-18T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 342,
		"ratingFiveStars": 72.7,
		"ratingAllStars": 94.6,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263247&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.7, "nbOfVotes": 24 },
			{ "star": 4, "rating": 27.3, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Messengers of Darkness",
		"aired": "2004-10-25T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 343,
		"ratingFiveStars": 77.4,
		"ratingAllStars": 94.8,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263248&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.4, "nbOfVotes": 24 },
			{ "star": 4, "rating": 19.4, "nbOfVotes": 6 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Cipher Pol No. 9",
		"aired": "2004-11-01T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 344,
		"ratingFiveStars": 86.7,
		"ratingAllStars": 97.4,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263250&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.7, "nbOfVotes": 26 },
			{ "star": 4, "rating": 13.3, "nbOfVotes": 4 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Opposing Powers",
		"aired": "2004-11-08T00:00:00+00:00",
		"score": 4.87
	},
	{
		"episodeNb": 345,
		"ratingFiveStars": 92.2,
		"ratingAllStars": 98.4,
		"nbOfVotes": 51,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263251&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 92.2, "nbOfVotes": 47 },
			{ "star": 4, "rating": 7.8, "nbOfVotes": 4 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Concealed",
		"aired": "2004-11-15T00:00:00+00:00",
		"score": 4.92
	},
	{
		"episodeNb": 346,
		"ratingFiveStars": 86.3,
		"ratingAllStars": 96,
		"nbOfVotes": 51,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263252&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.3, "nbOfVotes": 44 },
			{ "star": 4, "rating": 11.8, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2, "nbOfVotes": 1 }
		],
		"title": "The 9th Justice",
		"aired": "2004-11-29T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 347,
		"ratingFiveStars": 83.9,
		"ratingAllStars": 96.8,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263253&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.9, "nbOfVotes": 26 },
			{ "star": 4, "rating": 16.1, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rokushiki",
		"aired": "2004-12-06T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 348,
		"ratingFiveStars": 76.7,
		"ratingAllStars": 93.4,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263255&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.7, "nbOfVotes": 23 },
			{ "star": 4, "rating": 20, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3.3, "nbOfVotes": 1 }
		],
		"title": "Combat Power",
		"aired": "2004-12-13T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 349,
		"ratingFiveStars": 78.4,
		"ratingAllStars": 92.4,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263256&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.4, "nbOfVotes": 29 },
			{ "star": 4, "rating": 16.2, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 5.4, "nbOfVotes": 2 }
		],
		"title": "One Citizen",
		"aired": "2004-12-20T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 350,
		"ratingFiveStars": 68.4,
		"ratingAllStars": 93.2,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263257&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.4, "nbOfVotes": 26 },
			{ "star": 4, "rating": 28.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Warehouse Under the Bridge",
		"aired": "2005-01-03T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 351,
		"ratingFiveStars": 80.5,
		"ratingAllStars": 96,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263258&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.5, "nbOfVotes": 33 },
			{ "star": 4, "rating": 19.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Klabautermann",
		"aired": "2005-01-17T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 352,
		"ratingFiveStars": 83.3,
		"ratingAllStars": 96.6,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263260&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.3, "nbOfVotes": 25 },
			{ "star": 4, "rating": 16.7, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Tom's Workers",
		"aired": "2005-01-24T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 353,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 92.2,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263262&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 24 },
			{ "star": 4, "rating": 27.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Legendary Shipwright",
		"aired": "2005-01-31T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 354,
		"ratingFiveStars": 69.7,
		"ratingAllStars": 93.4,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263263&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.7, "nbOfVotes": 23 },
			{ "star": 4, "rating": 27.3, "nbOfVotes": 9 },
			{ "star": 3, "rating": 3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sea Train",
		"aired": "2005-02-07T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 355,
		"ratingFiveStars": 63.9,
		"ratingAllStars": 91.6,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263264&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.9, "nbOfVotes": 23 },
			{ "star": 4, "rating": 30.6, "nbOfVotes": 11 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Spandam",
		"aired": "2005-02-14T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 356,
		"ratingFiveStars": 78.1,
		"ratingAllStars": 95,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263265&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.1, "nbOfVotes": 25 },
			{ "star": 4, "rating": 18.8, "nbOfVotes": 6 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Tom-san",
		"aired": "2005-02-28T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 357,
		"ratingFiveStars": 78.3,
		"ratingAllStars": 95.2,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263268&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.3, "nbOfVotes": 36 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Cutty Flam",
		"aired": "2005-03-07T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 358,
		"ratingFiveStars": 69.4,
		"ratingAllStars": 93.4,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263271&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.4, "nbOfVotes": 25 },
			{ "star": 4, "rating": 27.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Revival",
		"aired": "2005-03-14T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 359,
		"ratingFiveStars": 84.2,
		"ratingAllStars": 95.2,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263272&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.2, "nbOfVotes": 32 },
			{ "star": 4, "rating": 13.2, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 1 }
		],
		"title": "Bingo",
		"aired": "2005-03-19T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 360,
		"ratingFiveStars": 75,
		"ratingAllStars": 94.4,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263273&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 30 },
			{ "star": 4, "rating": 22.5, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Departing Soon",
		"aired": "2005-03-28T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 361,
		"ratingFiveStars": 72.2,
		"ratingAllStars": 94.4,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263275&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.2, "nbOfVotes": 26 },
			{ "star": 4, "rating": 27.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "P.S.",
		"aired": "2005-04-04T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 362,
		"ratingFiveStars": 57.6,
		"ratingAllStars": 91.6,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263276&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.6, "nbOfVotes": 19 },
			{ "star": 4, "rating": 42.4, "nbOfVotes": 14 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ebb Tide",
		"aired": "2005-04-11T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 363,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 95.6,
		"nbOfVotes": 27,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263278&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 21 },
			{ "star": 4, "rating": 22.2, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Aqua Laguna",
		"aired": "2005-04-18T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 364,
		"ratingFiveStars": 70,
		"ratingAllStars": 93.4,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263279&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70, "nbOfVotes": 21 },
			{ "star": 4, "rating": 26.7, "nbOfVotes": 8 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Kokoro",
		"aired": "2005-04-25T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 365,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 93.4,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263280&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 20 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rocketman!!",
		"aired": "2005-05-09T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 366,
		"ratingFiveStars": 69.7,
		"ratingAllStars": 94,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263281&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.7, "nbOfVotes": 23 },
			{ "star": 4, "rating": 30.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sortie!!",
		"aired": "2005-05-16T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 367,
		"ratingFiveStars": 68,
		"ratingAllStars": 91.6,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263282&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68, "nbOfVotes": 34 },
			{ "star": 4, "rating": 26, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sogeking",
		"aired": "2005-05-23T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 368,
		"ratingFiveStars": 61.8,
		"ratingAllStars": 91.8,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=168495&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.8, "nbOfVotes": 21 },
			{ "star": 4, "rating": 35.3, "nbOfVotes": 12 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sea Train Battle Game",
		"aired": "2005-05-30T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 369,
		"ratingFiveStars": 57.6,
		"ratingAllStars": 89,
		"nbOfVotes": 33,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263285&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.6, "nbOfVotes": 19 },
			{ "star": 4, "rating": 30.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 12.1, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ramen Kenpo",
		"aired": "2005-06-06T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 370,
		"ratingFiveStars": 75,
		"ratingAllStars": 93.4,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263287&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 27 },
			{ "star": 4, "rating": 22.2, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.8, "nbOfVotes": 1 }
		],
		"title": "You're Not Alone",
		"aired": "2005-06-13T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 371,
		"ratingFiveStars": 78.1,
		"ratingAllStars": 93.2,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263288&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.1, "nbOfVotes": 25 },
			{ "star": 4, "rating": 15.6, "nbOfVotes": 5 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3.1, "nbOfVotes": 1 }
		],
		"title": "The Admirable Captain T-Bone",
		"aired": "2005-06-20T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 372,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 93.6,
		"nbOfVotes": 28,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263289&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 20 },
			{ "star": 4, "rating": 25, "nbOfVotes": 7 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Parage",
		"aired": "2005-06-27T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 373,
		"ratingFiveStars": 81.5,
		"ratingAllStars": 96.2,
		"nbOfVotes": 27,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263290&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.5, "nbOfVotes": 22 },
			{ "star": 4, "rating": 18.5, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Necessary Evil",
		"aired": "2005-07-04T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 374,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 91,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263292&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 30 },
			{ "star": 4, "rating": 19, "nbOfVotes": 8 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 7.1, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Struggle",
		"aired": "2005-07-16T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 375,
		"ratingFiveStars": 65.7,
		"ratingAllStars": 89.8,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263294&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.7, "nbOfVotes": 23 },
			{ "star": 4, "rating": 25.7, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 1 }
		],
		"title": "The Superhumans of Enies Lobby",
		"aired": "2005-07-25T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 376,
		"ratingFiveStars": 70.3,
		"ratingAllStars": 93.6,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263295&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.3, "nbOfVotes": 26 },
			{ "star": 4, "rating": 27, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Got It!!!",
		"aired": "2005-08-01T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 377,
		"ratingFiveStars": 73,
		"ratingAllStars": 93.6,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263296&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73, "nbOfVotes": 27 },
			{ "star": 4, "rating": 24.3, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Great Battle on the Judiciary Island!!",
		"aired": "2005-08-08T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 378,
		"ratingFiveStars": 65.7,
		"ratingAllStars": 90.2,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263397&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.7, "nbOfVotes": 23 },
			{ "star": 4, "rating": 28.6, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 1 }
		],
		"title": "Damage Report",
		"aired": "2005-08-22T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 379,
		"ratingFiveStars": 75.7,
		"ratingAllStars": 92.4,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263399&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.7, "nbOfVotes": 28 },
			{ "star": 4, "rating": 16.2, "nbOfVotes": 6 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 1 }
		],
		"title": "Dōriki",
		"aired": "2005-08-29T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 380,
		"ratingFiveStars": 62.9,
		"ratingAllStars": 91.4,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263400&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.9, "nbOfVotes": 22 },
			{ "star": 4, "rating": 31.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 5.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Express to Enies Lobby Main Island",
		"aired": "2005-09-05T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 381,
		"ratingFiveStars": 67.6,
		"ratingAllStars": 91.2,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263401&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.6, "nbOfVotes": 23 },
			{ "star": 4, "rating": 23.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 2 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Fired",
		"aired": "2005-09-12T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 382,
		"ratingFiveStars": 72.2,
		"ratingAllStars": 93.8,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263403&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.2, "nbOfVotes": 26 },
			{ "star": 4, "rating": 25, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Demon's Hideout",
		"aired": "2005-09-17T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 383,
		"ratingFiveStars": 75.9,
		"ratingAllStars": 95.2,
		"nbOfVotes": 29,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263404&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.9, "nbOfVotes": 22 },
			{ "star": 4, "rating": 24.1, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy vs. Blueno",
		"aired": "2005-09-26T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 384,
		"ratingFiveStars": 80,
		"ratingAllStars": 95.4,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263405&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 28 },
			{ "star": 4, "rating": 17.1, "nbOfVotes": 6 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Raise the Counterattack Signal",
		"aired": "2005-10-03T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 385,
		"ratingFiveStars": 75,
		"ratingAllStars": 95,
		"nbOfVotes": 28,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263406&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 21 },
			{ "star": 4, "rating": 25, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "There Is a Way",
		"aired": "2005-10-08T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 386,
		"ratingFiveStars": 78.6,
		"ratingAllStars": 95,
		"nbOfVotes": 28,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263407&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.6, "nbOfVotes": 22 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 5 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Unprecedented",
		"aired": "2005-10-17T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 387,
		"ratingFiveStars": 84.8,
		"ratingAllStars": 97,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263409&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.8, "nbOfVotes": 39 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gear",
		"aired": "2005-10-31T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 388,
		"ratingFiveStars": 80,
		"ratingAllStars": 94.6,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263410&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 36 },
			{ "star": 4, "rating": 13.3, "nbOfVotes": 6 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gear Second",
		"aired": "2005-11-07T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 389,
		"ratingFiveStars": 82.5,
		"ratingAllStars": 96,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263413&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.5, "nbOfVotes": 33 },
			{ "star": 4, "rating": 15, "nbOfVotes": 6 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Respond",
		"aired": "2005-11-14T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 390,
		"ratingFiveStars": 89.6,
		"ratingAllStars": 98,
		"nbOfVotes": 48,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263414&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.6, "nbOfVotes": 43 },
			{ "star": 4, "rating": 10.4, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Return Fire",
		"aired": "2005-11-21T00:00:00+00:00",
		"score": 4.9
	},
	{
		"episodeNb": 391,
		"ratingFiveStars": 76.5,
		"ratingAllStars": 94.2,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263415&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.5, "nbOfVotes": 26 },
			{ "star": 4, "rating": 20.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Girl Called \"Devil\"",
		"aired": "2005-11-28T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 392,
		"ratingFiveStars": 78.4,
		"ratingAllStars": 95.6,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263420&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.4, "nbOfVotes": 29 },
			{ "star": 4, "rating": 21.6, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Dereshi",
		"aired": "2005-12-12T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 393,
		"ratingFiveStars": 78.6,
		"ratingAllStars": 95.8,
		"nbOfVotes": 28,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263425&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.6, "nbOfVotes": 22 },
			{ "star": 4, "rating": 21.4, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Olvia",
		"aired": "2005-12-19T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 394,
		"ratingFiveStars": 87.5,
		"ratingAllStars": 97.6,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263426&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.5, "nbOfVotes": 28 },
			{ "star": 4, "rating": 12.5, "nbOfVotes": 4 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Demons of Ohara",
		"aired": "2005-12-26T00:00:00+00:00",
		"score": 4.88
	},
	{
		"episodeNb": 395,
		"ratingFiveStars": 88.4,
		"ratingAllStars": 96.8,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263427&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.4, "nbOfVotes": 38 },
			{ "star": 4, "rating": 9.3, "nbOfVotes": 4 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ohara vs. the World Government",
		"aired": "2006-01-07T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 396,
		"ratingFiveStars": 82.9,
		"ratingAllStars": 94.8,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263428&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.9, "nbOfVotes": 29 },
			{ "star": 4, "rating": 11.4, "nbOfVotes": 4 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Saul",
		"aired": "2006-01-23T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 397,
		"ratingFiveStars": 92.5,
		"ratingAllStars": 98.4,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=200573&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 92.5, "nbOfVotes": 49 },
			{ "star": 4, "rating": 7.5, "nbOfVotes": 4 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "In Order to Reach the Future",
		"aired": "2006-01-30T00:00:00+00:00",
		"score": 4.92
	},
	{
		"episodeNb": 398,
		"ratingFiveStars": 94.8,
		"ratingAllStars": 99,
		"nbOfVotes": 97,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=211099&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 94.8, "nbOfVotes": 92 },
			{ "star": 4, "rating": 5.2, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Declaration of War",
		"aired": "2006-02-06T00:00:00+00:00",
		"score": 4.95
	},
	{
		"episodeNb": 399,
		"ratingFiveStars": 83,
		"ratingAllStars": 95.8,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263430&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83, "nbOfVotes": 44 },
			{ "star": 4, "rating": 15.1, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Jump into the Waterfall!!",
		"aired": "2006-02-13T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 400,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 91.4,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263431&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 33 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 4.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Releasing Key",
		"aired": "2006-02-20T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 401,
		"ratingFiveStars": 75.7,
		"ratingAllStars": 93.6,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263432&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.7, "nbOfVotes": 28 },
			{ "star": 4, "rating": 18.9, "nbOfVotes": 7 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirates vs. CP9",
		"aired": "2006-02-27T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 402,
		"ratingFiveStars": 75.7,
		"ratingAllStars": 94,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263435&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.7, "nbOfVotes": 28 },
			{ "star": 4, "rating": 21.6, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "No. 2 Handcuffs",
		"aired": "2006-03-06T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 403,
		"ratingFiveStars": 83.8,
		"ratingAllStars": 96.2,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263436&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.8, "nbOfVotes": 31 },
			{ "star": 4, "rating": 13.5, "nbOfVotes": 5 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Mr. Chivalry",
		"aired": "2006-03-13T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 404,
		"ratingFiveStars": 74.3,
		"ratingAllStars": 94.8,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263437&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.3, "nbOfVotes": 26 },
			{ "star": 4, "rating": 25.7, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Franky vs. Fukuro",
		"aired": "2006-03-20T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 405,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 92.6,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263438&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 20 },
			{ "star": 4, "rating": 37.5, "nbOfVotes": 12 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Power",
		"aired": "2006-03-27T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 406,
		"ratingFiveStars": 67.7,
		"ratingAllStars": 93,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263439&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.7, "nbOfVotes": 21 },
			{ "star": 4, "rating": 29, "nbOfVotes": 9 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Seimei Kikan",
		"aired": "2006-04-10T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 407,
		"ratingFiveStars": 85.3,
		"ratingAllStars": 97,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263440&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.3, "nbOfVotes": 29 },
			{ "star": 4, "rating": 14.7, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Monster",
		"aired": "2006-04-17T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 408,
		"ratingFiveStars": 75,
		"ratingAllStars": 94.4,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263441&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 24 },
			{ "star": 4, "rating": 21.9, "nbOfVotes": 7 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Monster vs. Kumadori",
		"aired": "2006-04-24T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 409,
		"ratingFiveStars": 68.4,
		"ratingAllStars": 90.6,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263442&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.4, "nbOfVotes": 39 },
			{ "star": 4, "rating": 22.8, "nbOfVotes": 13 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 3.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 1 }
		],
		"title": "Emergency Bad News Broadcast",
		"aired": "2006-05-08T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 410,
		"ratingFiveStars": 72.1,
		"ratingAllStars": 93,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263447&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.1, "nbOfVotes": 31 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 11 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 1 }
		],
		"title": "Nami Becomes Huge",
		"aired": "2006-05-15T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 411,
		"ratingFiveStars": 70,
		"ratingAllStars": 92,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263449&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70, "nbOfVotes": 21 },
			{ "star": 4, "rating": 20, "nbOfVotes": 6 },
			{ "star": 3, "rating": 10, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Nami vs. Kalifa",
		"aired": "2006-05-22T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 412,
		"ratingFiveStars": 75.9,
		"ratingAllStars": 94.4,
		"nbOfVotes": 29,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263451&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.9, "nbOfVotes": 22 },
			{ "star": 4, "rating": 20.7, "nbOfVotes": 6 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Chance Has Ended",
		"aired": "2006-05-29T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 413,
		"ratingFiveStars": 78.1,
		"ratingAllStars": 95.6,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263454&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.1, "nbOfVotes": 25 },
			{ "star": 4, "rating": 21.9, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Hunter",
		"aired": "2006-06-05T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 414,
		"ratingFiveStars": 81.3,
		"ratingAllStars": 96.2,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263455&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.3, "nbOfVotes": 26 },
			{ "star": 4, "rating": 18.8, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sanji vs. Jabra",
		"aired": "2006-06-12T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 415,
		"ratingFiveStars": 76.2,
		"ratingAllStars": 92.8,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263456&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.2, "nbOfVotes": 32 },
			{ "star": 4, "rating": 16.7, "nbOfVotes": 7 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 4.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Heat Up",
		"aired": "2006-06-19T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 416,
		"ratingFiveStars": 72.4,
		"ratingAllStars": 94.4,
		"nbOfVotes": 29,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263458&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.4, "nbOfVotes": 21 },
			{ "star": 4, "rating": 27.6, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Zoro vs. Kaku",
		"aired": "2006-06-26T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 417,
		"ratingFiveStars": 84.6,
		"ratingAllStars": 96.4,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=211394&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.6, "nbOfVotes": 33 },
			{ "star": 4, "rating": 12.8, "nbOfVotes": 5 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Asura",
		"aired": "2006-07-03T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 418,
		"ratingFiveStars": 79.4,
		"ratingAllStars": 95.2,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263460&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.4, "nbOfVotes": 27 },
			{ "star": 4, "rating": 17.6, "nbOfVotes": 6 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy vs. Rob Lucci",
		"aired": "2006-07-10T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 419,
		"ratingFiveStars": 88.9,
		"ratingAllStars": 96,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263461&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.9, "nbOfVotes": 40 },
			{ "star": 4, "rating": 6.7, "nbOfVotes": 3 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 4.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Legendary Hero",
		"aired": "2006-07-15T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 420,
		"ratingFiveStars": 75,
		"ratingAllStars": 95,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263462&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 24 },
			{ "star": 4, "rating": 25, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Buster Call",
		"aired": "2006-07-24T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 421,
		"ratingFiveStars": 80,
		"ratingAllStars": 96,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263463&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 24 },
			{ "star": 4, "rating": 20, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gear Third",
		"aired": "2006-07-31T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 422,
		"ratingFiveStars": 84,
		"ratingAllStars": 96.8,
		"nbOfVotes": 25,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263464&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84, "nbOfVotes": 21 },
			{ "star": 4, "rating": 16, "nbOfVotes": 4 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rob Lucci",
		"aired": "2006-08-07T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 423,
		"ratingFiveStars": 80,
		"ratingAllStars": 96,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263465&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 24 },
			{ "star": 4, "rating": 20, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Mermaid Legend",
		"aired": "2006-08-21T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 424,
		"ratingFiveStars": 78.1,
		"ratingAllStars": 95,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263467&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.1, "nbOfVotes": 25 },
			{ "star": 4, "rating": 18.8, "nbOfVotes": 6 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Escape Ship",
		"aired": "2006-08-28T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 425,
		"ratingFiveStars": 75,
		"ratingAllStars": 95,
		"nbOfVotes": 28,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263468&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 21 },
			{ "star": 4, "rating": 25, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Struggle on the Bridge",
		"aired": "2006-09-04T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 426,
		"ratingFiveStars": 76.9,
		"ratingAllStars": 94.6,
		"nbOfVotes": 26,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263469&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.9, "nbOfVotes": 20 },
			{ "star": 4, "rating": 19.2, "nbOfVotes": 5 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "A Ship Waiting for Wind",
		"aired": "2006-09-11T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 427,
		"ratingFiveStars": 94.7,
		"ratingAllStars": 99,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263471&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 94.7, "nbOfVotes": 36 },
			{ "star": 4, "rating": 5.3, "nbOfVotes": 2 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "It's Not Like It's Hell Here",
		"aired": "2006-09-16T00:00:00+00:00",
		"score": 4.95
	},
	{
		"episodeNb": 428,
		"ratingFiveStars": 87.8,
		"ratingAllStars": 97,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263473&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.8, "nbOfVotes": 36 },
			{ "star": 4, "rating": 9.8, "nbOfVotes": 4 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Let's Return",
		"aired": "2006-09-25T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 429,
		"ratingFiveStars": 74.4,
		"ratingAllStars": 94.4,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263477&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.4, "nbOfVotes": 29 },
			{ "star": 4, "rating": 23.1, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Complete Defeat",
		"aired": "2006-10-02T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 430,
		"ratingFiveStars": 93.2,
		"ratingAllStars": 98.2,
		"nbOfVotes": 161,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=46493&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 93.2, "nbOfVotes": 150 },
			{ "star": 4, "rating": 5.6, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Falling Snow of Reminiscence",
		"aired": "2006-10-07T00:00:00+00:00",
		"score": 4.91
	},
	{
		"episodeNb": 431,
		"ratingFiveStars": 70.2,
		"ratingAllStars": 93.2,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263479&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.2, "nbOfVotes": 33 },
			{ "star": 4, "rating": 27.7, "nbOfVotes": 13 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Fist of Love",
		"aired": "2006-10-23T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 432,
		"ratingFiveStars": 85.7,
		"ratingAllStars": 96.8,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263480&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.7, "nbOfVotes": 42 },
			{ "star": 4, "rating": 12.2, "nbOfVotes": 6 },
			{ "star": 3, "rating": 2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Jack in the Box",
		"aired": "2006-10-30T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 433,
		"ratingFiveStars": 83.7,
		"ratingAllStars": 96.8,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263481&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.7, "nbOfVotes": 36 },
			{ "star": 4, "rating": 16.3, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Name of that Sea is",
		"aired": "2006-11-06T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 434,
		"ratingFiveStars": 76,
		"ratingAllStars": 95.2,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263482&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76, "nbOfVotes": 38 },
			{ "star": 4, "rating": 24, "nbOfVotes": 12 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Whitebeard and Redhair",
		"aired": "2006-11-13T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 435,
		"ratingFiveStars": 74,
		"ratingAllStars": 92.8,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263484&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74, "nbOfVotes": 37 },
			{ "star": 4, "rating": 22, "nbOfVotes": 11 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2, "nbOfVotes": 1 }
		],
		"title": "Understanding Your Feelings",
		"aired": "2006-11-20T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 436,
		"ratingFiveStars": 73.7,
		"ratingAllStars": 94.2,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263486&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.7, "nbOfVotes": 28 },
			{ "star": 4, "rating": 23.7, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pants from Frankyhouse",
		"aired": "2006-12-04T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 437,
		"ratingFiveStars": 80,
		"ratingAllStars": 95.2,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263488&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 36 },
			{ "star": 4, "rating": 15.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Naked But Great",
		"aired": "2006-12-11T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 438,
		"ratingFiveStars": 76.1,
		"ratingAllStars": 94.4,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263490&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.1, "nbOfVotes": 35 },
			{ "star": 4, "rating": 21.7, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pride",
		"aired": "2006-12-18T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 439,
		"ratingFiveStars": 80,
		"ratingAllStars": 95,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263491&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 32 },
			{ "star": 4, "rating": 15, "nbOfVotes": 6 },
			{ "star": 3, "rating": 5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Third and the Seventh",
		"aired": "2006-12-25T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 440,
		"ratingFiveStars": 70.8,
		"ratingAllStars": 93.4,
		"nbOfVotes": 72,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263492&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.8, "nbOfVotes": 51 },
			{ "star": 4, "rating": 26.4, "nbOfVotes": 19 },
			{ "star": 3, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Fire Fist vs. Blackbeard",
		"aired": "2007-01-06T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 441,
		"ratingFiveStars": 76.4,
		"ratingAllStars": 95,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263493&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.4, "nbOfVotes": 42 },
			{ "star": 4, "rating": 21.8, "nbOfVotes": 12 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Duel on Banaro Island",
		"aired": "2007-01-22T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 442,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 91.2,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263494&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 30 },
			{ "star": 4, "rating": 24.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure in the Demon Sea",
		"aired": "2007-01-29T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 443,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 90.8,
		"nbOfVotes": 48,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263495&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 30 },
			{ "star": 4, "rating": 31.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 4.2, "nbOfVotes": 2 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Thriller Bark",
		"aired": "2007-02-05T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 444,
		"ratingFiveStars": 59.1,
		"ratingAllStars": 90.4,
		"nbOfVotes": 44,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263496&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.1, "nbOfVotes": 26 },
			{ "star": 4, "rating": 34.1, "nbOfVotes": 15 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure on the Ghost Island",
		"aired": "2007-02-10T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 445,
		"ratingFiveStars": 73.7,
		"ratingAllStars": 94.8,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263498&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.7, "nbOfVotes": 28 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Zombie",
		"aired": "2007-02-19T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 446,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 90,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263499&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 20 },
			{ "star": 4, "rating": 31.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3.1, "nbOfVotes": 1 }
		],
		"title": "Doctor Hogback",
		"aired": "2007-02-26T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 447,
		"ratingFiveStars": 60,
		"ratingAllStars": 90.6,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263500&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60, "nbOfVotes": 18 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Surprise Zombie",
		"aired": "2007-03-05T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 448,
		"ratingFiveStars": 68.6,
		"ratingAllStars": 92,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263501&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.6, "nbOfVotes": 24 },
			{ "star": 4, "rating": 28.6, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 1 }
		],
		"title": "Moriah",
		"aired": "2007-03-12T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 449,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 92.6,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263502&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 31 },
			{ "star": 4, "rating": 28.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Mysterious Four of Thriller Bark",
		"aired": "2007-03-26T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 450,
		"ratingFiveStars": 55.3,
		"ratingAllStars": 90.6,
		"nbOfVotes": 47,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263503&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.3, "nbOfVotes": 26 },
			{ "star": 4, "rating": 42.6, "nbOfVotes": 20 },
			{ "star": 3, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "General Zombie Night",
		"aired": "2007-04-02T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 451,
		"ratingFiveStars": 59.4,
		"ratingAllStars": 90.6,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263504&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.4, "nbOfVotes": 19 },
			{ "star": 4, "rating": 34.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Perona's Wonder Garden",
		"aired": "2007-04-09T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 452,
		"ratingFiveStars": 61.8,
		"ratingAllStars": 91.2,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263505&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.8, "nbOfVotes": 21 },
			{ "star": 4, "rating": 32.4, "nbOfVotes": 11 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Jigorou of the Wind",
		"aired": "2007-04-16T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 453,
		"ratingFiveStars": 60,
		"ratingAllStars": 90.6,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263506&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60, "nbOfVotes": 18 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Cloudy With a Small Chance of Bone",
		"aired": "2007-04-23T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 454,
		"ratingFiveStars": 56.7,
		"ratingAllStars": 90.6,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263507&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.7, "nbOfVotes": 17 },
			{ "star": 4, "rating": 40, "nbOfVotes": 12 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Humming",
		"aired": "2007-04-28T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 455,
		"ratingFiveStars": 68.4,
		"ratingAllStars": 92.2,
		"nbOfVotes": 38,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263508&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.4, "nbOfVotes": 26 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Royal Shichibukai, Gekko Moriah",
		"aired": "2007-05-14T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 456,
		"ratingFiveStars": 71,
		"ratingAllStars": 91.6,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263509&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71, "nbOfVotes": 22 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 6.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Demon from the Frozen Land",
		"aired": "2007-05-21T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 457,
		"ratingFiveStars": 58.3,
		"ratingAllStars": 89.2,
		"nbOfVotes": 24,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263511&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.3, "nbOfVotes": 14 },
			{ "star": 4, "rating": 37.5, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 4.2, "nbOfVotes": 1 }
		],
		"title": "Meeeeeaaaaaat!!!",
		"aired": "2007-05-28T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 458,
		"ratingFiveStars": 69.4,
		"ratingAllStars": 92.2,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263513&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.4, "nbOfVotes": 25 },
			{ "star": 4, "rating": 22.2, "nbOfVotes": 8 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Not the Afro",
		"aired": "2007-06-04T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 459,
		"ratingFiveStars": 79.7,
		"ratingAllStars": 96,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=3491&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.7, "nbOfVotes": 51 },
			{ "star": 4, "rating": 20.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Being Dead Isn't an Apology",
		"aired": "2007-06-11T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 460,
		"ratingFiveStars": 61.4,
		"ratingAllStars": 89,
		"nbOfVotes": 44,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263516&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.4, "nbOfVotes": 27 },
			{ "star": 4, "rating": 27.3, "nbOfVotes": 12 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 3 },
			{ "star": 2, "rating": 4.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Get Back Before Dawn!!",
		"aired": "2007-06-25T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 461,
		"ratingFiveStars": 71.9,
		"ratingAllStars": 94.4,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263517&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.9, "nbOfVotes": 23 },
			{ "star": 4, "rating": 28.1, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ghost Buster",
		"aired": "2007-07-02T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 462,
		"ratingFiveStars": 64.5,
		"ratingAllStars": 92.2,
		"nbOfVotes": 31,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=196292&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.5, "nbOfVotes": 20 },
			{ "star": 4, "rating": 32.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Oars' Adventure",
		"aired": "2007-07-09T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 463,
		"ratingFiveStars": 72.2,
		"ratingAllStars": 94.4,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263518&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.2, "nbOfVotes": 26 },
			{ "star": 4, "rating": 27.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Sanji vs. Mysterious Absalom",
		"aired": "2007-07-14T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 464,
		"ratingFiveStars": 61.1,
		"ratingAllStars": 84.4,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263519&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.1, "nbOfVotes": 22 },
			{ "star": 4, "rating": 25, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 11.1, "nbOfVotes": 4 }
		],
		"title": "Sanji's Dream",
		"aired": "2007-07-23T00:00:00+00:00",
		"score": 4.220000000000001
	},
	{
		"episodeNb": 465,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 92,
		"nbOfVotes": 30,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263520&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 20 },
			{ "star": 4, "rating": 26.7, "nbOfVotes": 8 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Usopp vs. Princess Perona",
		"aired": "2007-07-30T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 466,
		"ratingFiveStars": 88.2,
		"ratingAllStars": 97,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=197703&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.2, "nbOfVotes": 30 },
			{ "star": 4, "rating": 8.8, "nbOfVotes": 3 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Conclusion",
		"aired": "2007-08-06T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 467,
		"ratingFiveStars": 72.2,
		"ratingAllStars": 94.4,
		"nbOfVotes": 36,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=4074&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.2, "nbOfVotes": 26 },
			{ "star": 4, "rating": 27.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Zoro vs. Samurai Ryuma",
		"aired": "2007-08-20T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 468,
		"ratingFiveStars": 72,
		"ratingAllStars": 94.4,
		"nbOfVotes": 25,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=4193&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72, "nbOfVotes": 18 },
			{ "star": 4, "rating": 28, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Chopper vs. Mysterious Hogback",
		"aired": "2007-08-27T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 469,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 93.6,
		"nbOfVotes": 28,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=4408&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 20 },
			{ "star": 4, "rating": 25, "nbOfVotes": 7 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Show Yourselves, Straw Hat Crew!!!",
		"aired": "2007-09-03T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 470,
		"ratingFiveStars": 63.5,
		"ratingAllStars": 91.2,
		"nbOfVotes": 52,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=4647&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.5, "nbOfVotes": 33 },
			{ "star": 4, "rating": 30.8, "nbOfVotes": 16 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Oars vs. the Straw Hat Crew",
		"aired": "2007-09-10T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 471,
		"ratingFiveStars": 73.5,
		"ratingAllStars": 93,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=5193&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.5, "nbOfVotes": 25 },
			{ "star": 4, "rating": 20.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "My Friend",
		"aired": "2007-09-22T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 472,
		"ratingFiveStars": 79.5,
		"ratingAllStars": 95.8,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=5468&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.5, "nbOfVotes": 31 },
			{ "star": 4, "rating": 20.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Down",
		"aired": "2007-10-01T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 473,
		"ratingFiveStars": 76.5,
		"ratingAllStars": 94.8,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=5720&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.5, "nbOfVotes": 26 },
			{ "star": 4, "rating": 20.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Royal Shichibukai, Bartholomew Kuma Appears",
		"aired": "2007-10-06T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 474,
		"ratingFiveStars": 76.9,
		"ratingAllStars": 91.2,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=5998&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.9, "nbOfVotes": 30 },
			{ "star": 4, "rating": 15.4, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 5.1, "nbOfVotes": 2 }
		],
		"title": "Gotta Do It!!!",
		"aired": "2007-10-15T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 475,
		"ratingFiveStars": 82.1,
		"ratingAllStars": 96.4,
		"nbOfVotes": 28,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=6292&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.1, "nbOfVotes": 23 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Forest Pirates",
		"aired": "2007-10-22T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 476,
		"ratingFiveStars": 85.3,
		"ratingAllStars": 97,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=6589&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.3, "nbOfVotes": 29 },
			{ "star": 4, "rating": 14.7, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Nightmare Luffy",
		"aired": "2007-10-29T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 477,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 92.6,
		"nbOfVotes": 27,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=6894&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 21 },
			{ "star": 4, "rating": 11.1, "nbOfVotes": 3 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 3.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "3/8",
		"aired": "2007-11-05T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 478,
		"ratingFiveStars": 88.6,
		"ratingAllStars": 95.4,
		"nbOfVotes": 35,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=7182&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.6, "nbOfVotes": 31 },
			{ "star": 4, "rating": 5.7, "nbOfVotes": 2 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 1 }
		],
		"title": "Luffy vs. Luffy",
		"aired": "2007-11-12T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 479,
		"ratingFiveStars": 81.1,
		"ratingAllStars": 94.6,
		"nbOfVotes": 37,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=7518&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.1, "nbOfVotes": 30 },
			{ "star": 4, "rating": 16.2, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 1 }
		],
		"title": "Warrior of Hope",
		"aired": "2007-11-19T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 480,
		"ratingFiveStars": 85,
		"ratingAllStars": 96.6,
		"nbOfVotes": 40,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=8248&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85, "nbOfVotes": 34 },
			{ "star": 4, "rating": 12.5, "nbOfVotes": 5 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ambush Attack",
		"aired": "2007-12-03T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 481,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 91,
		"nbOfVotes": 42,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=8649&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 28 },
			{ "star": 4, "rating": 26.2, "nbOfVotes": 11 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 4.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Shadow's Asgard",
		"aired": "2007-12-10T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 482,
		"ratingFiveStars": 71.8,
		"ratingAllStars": 92.4,
		"nbOfVotes": 39,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=9106&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.8, "nbOfVotes": 28 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 7 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Morning Comes",
		"aired": "2007-12-17T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 483,
		"ratingFiveStars": 73.2,
		"ratingAllStars": 94.2,
		"nbOfVotes": 41,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=9581&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.2, "nbOfVotes": 30 },
			{ "star": 4, "rating": 24.4, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "End of the Dream",
		"aired": "2007-12-25T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 484,
		"ratingFiveStars": 84,
		"ratingAllStars": 96.8,
		"nbOfVotes": 50,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=10026&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84, "nbOfVotes": 42 },
			{ "star": 4, "rating": 16, "nbOfVotes": 8 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Squish",
		"aired": "2008-01-04T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 485,
		"ratingFiveStars": 94.2,
		"ratingAllStars": 98.4,
		"nbOfVotes": 121,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=11414&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 94.2, "nbOfVotes": 114 },
			{ "star": 4, "rating": 5, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Straw Hat Crew - Pirate Hunter Zoro",
		"aired": "2008-01-21T00:00:00+00:00",
		"score": 4.92
	},
	{
		"episodeNb": 486,
		"ratingFiveStars": 69.6,
		"ratingAllStars": 92.6,
		"nbOfVotes": 46,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=11892&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.6, "nbOfVotes": 32 },
			{ "star": 4, "rating": 23.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 6.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Piano",
		"aired": "2008-01-28T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 487,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 92.2,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=12389&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 33 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "That Song",
		"aired": "2008-02-04T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 488,
		"ratingFiveStars": 86.2,
		"ratingAllStars": 97.2,
		"nbOfVotes": 65,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=12955&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.2, "nbOfVotes": 56 },
			{ "star": 4, "rating": 13.8, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Song of Life",
		"aired": "2008-02-09T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 489,
		"ratingFiveStars": 68.3,
		"ratingAllStars": 90.4,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=14246&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.3, "nbOfVotes": 41 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.3, "nbOfVotes": 2 }
		],
		"title": "The Eighth",
		"aired": "2008-02-25T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 490,
		"ratingFiveStars": 61.4,
		"ratingAllStars": 89.4,
		"nbOfVotes": 70,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=14964&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.4, "nbOfVotes": 43 },
			{ "star": 4, "rating": 28.6, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "Arriving Once Again",
		"aired": "2008-03-03T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 491,
		"ratingFiveStars": 59.4,
		"ratingAllStars": 90.6,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=15736&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.4, "nbOfVotes": 38 },
			{ "star": 4, "rating": 34.4, "nbOfVotes": 22 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Flying Fish Riders",
		"aired": "2008-03-10T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 492,
		"ratingFiveStars": 61.4,
		"ratingAllStars": 91.6,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=16394&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.4, "nbOfVotes": 35 },
			{ "star": 4, "rating": 35.1, "nbOfVotes": 20 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Iron Mask Duval",
		"aired": "2008-03-17T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 493,
		"ratingFiveStars": 62.2,
		"ratingAllStars": 91.6,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=17233&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.2, "nbOfVotes": 28 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "You Know",
		"aired": "2008-03-24T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 494,
		"ratingFiveStars": 88.6,
		"ratingAllStars": 97.4,
		"nbOfVotes": 79,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=18076&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.6, "nbOfVotes": 70 },
			{ "star": 4, "rating": 10.1, "nbOfVotes": 8 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Duval's Tragedy",
		"aired": "2008-03-31T00:00:00+00:00",
		"score": 4.87
	},
	{
		"episodeNb": 495,
		"ratingFiveStars": 66,
		"ratingAllStars": 93.2,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=18881&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66, "nbOfVotes": 35 },
			{ "star": 4, "rating": 34, "nbOfVotes": 18 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gaon Cannon",
		"aired": "2008-04-07T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 496,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 92.2,
		"nbOfVotes": 51,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=20360&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 34 },
			{ "star": 4, "rating": 27.5, "nbOfVotes": 14 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Yarukiman Mangrove",
		"aired": "2008-04-14T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 497,
		"ratingFiveStars": 70.4,
		"ratingAllStars": 93.4,
		"nbOfVotes": 54,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=21701&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.4, "nbOfVotes": 38 },
			{ "star": 4, "rating": 25.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure on the Archipelago of Dancing Soap Bubbles",
		"aired": "2008-04-21T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 498,
		"ratingFiveStars": 82.5,
		"ratingAllStars": 96.2,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=22655&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.5, "nbOfVotes": 47 },
			{ "star": 4, "rating": 15.8, "nbOfVotes": 9 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The 11 Supernovas",
		"aired": "2008-04-28T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 499,
		"ratingFiveStars": 81.1,
		"ratingAllStars": 95.4,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=25051&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.1, "nbOfVotes": 43 },
			{ "star": 4, "rating": 17, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sabaody Park",
		"aired": "2008-05-19T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 500,
		"ratingFiveStars": 71.2,
		"ratingAllStars": 92.2,
		"nbOfVotes": 111,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=25852&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.2, "nbOfVotes": 79 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 26 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "Embers of History",
		"aired": "2008-05-26T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 501,
		"ratingFiveStars": 84.1,
		"ratingAllStars": 96.6,
		"nbOfVotes": 63,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=26989&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.1, "nbOfVotes": 53 },
			{ "star": 4, "rating": 14.3, "nbOfVotes": 9 },
			{ "star": 3, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "A World Beginning to Swell",
		"aired": "2008-06-02T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 502,
		"ratingFiveStars": 89.6,
		"ratingAllStars": 97.4,
		"nbOfVotes": 106,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=27988&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.6, "nbOfVotes": 95 },
			{ "star": 4, "rating": 8.5, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Celestial Dragon Incident",
		"aired": "2008-06-09T00:00:00+00:00",
		"score": 4.87
	},
	{
		"episodeNb": 503,
		"ratingFiveStars": 81.6,
		"ratingAllStars": 96,
		"nbOfVotes": 76,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=29168&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.6, "nbOfVotes": 62 },
			{ "star": 4, "rating": 17.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "An Island in Chaos",
		"aired": "2008-06-16T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 504,
		"ratingFiveStars": 85.9,
		"ratingAllStars": 96.2,
		"nbOfVotes": 78,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=30148&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.9, "nbOfVotes": 67 },
			{ "star": 4, "rating": 10.3, "nbOfVotes": 8 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Frontline On The Move!!",
		"aired": "2008-06-23T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 505,
		"ratingFiveStars": 76.9,
		"ratingAllStars": 95,
		"nbOfVotes": 65,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=31131&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.9, "nbOfVotes": 50 },
			{ "star": 4, "rating": 21.5, "nbOfVotes": 14 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Kuma",
		"aired": "2008-06-30T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 506,
		"ratingFiveStars": 86.6,
		"ratingAllStars": 97,
		"nbOfVotes": 67,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=32004&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.6, "nbOfVotes": 58 },
			{ "star": 4, "rating": 11.9, "nbOfVotes": 8 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Roger and Rayleigh",
		"aired": "2008-07-07T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 507,
		"ratingFiveStars": 81.3,
		"ratingAllStars": 96,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=33988&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.3, "nbOfVotes": 52 },
			{ "star": 4, "rating": 17.2, "nbOfVotes": 11 },
			{ "star": 3, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Kizaru Arrives",
		"aired": "2008-07-19T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 508,
		"ratingFiveStars": 76.3,
		"ratingAllStars": 94.6,
		"nbOfVotes": 59,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=35096&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.3, "nbOfVotes": 45 },
			{ "star": 4, "rating": 20.3, "nbOfVotes": 12 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Island of Carnage",
		"aired": "2008-07-28T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 509,
		"ratingFiveStars": 78.6,
		"ratingAllStars": 95.4,
		"nbOfVotes": 56,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=36193&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.6, "nbOfVotes": 44 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 11 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Kizaru vs. the 4 Captains",
		"aired": "2008-08-04T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 510,
		"ratingFiveStars": 86.4,
		"ratingAllStars": 97.2,
		"nbOfVotes": 66,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=37291&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.4, "nbOfVotes": 57 },
			{ "star": 4, "rating": 13.6, "nbOfVotes": 9 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Straw Hat Crew vs. Combat Weapon",
		"aired": "2008-08-11T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 511,
		"ratingFiveStars": 90.4,
		"ratingAllStars": 98,
		"nbOfVotes": 73,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=39541&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.4, "nbOfVotes": 66 },
			{ "star": 4, "rating": 9.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Axe-Wielding Sentomaru",
		"aired": "2008-08-25T00:00:00+00:00",
		"score": 4.9
	},
	{
		"episodeNb": 512,
		"ratingFiveStars": 85.6,
		"ratingAllStars": 95.6,
		"nbOfVotes": 90,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=40665&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.6, "nbOfVotes": 77 },
			{ "star": 4, "rating": 11.1, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Zoro Lost",
		"aired": "2008-09-01T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 513,
		"ratingFiveStars": 95.5,
		"ratingAllStars": 98.8,
		"nbOfVotes": 179,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=41842&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 95.5, "nbOfVotes": 171 },
			{ "star": 4, "rating": 3.4, "nbOfVotes": 6 },
			{ "star": 3, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I Couldn't Save Them!!!",
		"aired": "2008-09-08T00:00:00+00:00",
		"score": 4.9399999999999995
	},
	{
		"episodeNb": 514,
		"ratingFiveStars": 75.3,
		"ratingAllStars": 94,
		"nbOfVotes": 77,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=42846&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.3, "nbOfVotes": 58 },
			{ "star": 4, "rating": 20.8, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Mushrooms Only Grow from the Body",
		"aired": "2008-09-13T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 515,
		"ratingFiveStars": 75,
		"ratingAllStars": 94.4,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=43902&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 48 },
			{ "star": 4, "rating": 21.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure on an Island of Women",
		"aired": "2008-09-22T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 516,
		"ratingFiveStars": 73.6,
		"ratingAllStars": 92,
		"nbOfVotes": 72,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=44997&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.6, "nbOfVotes": 53 },
			{ "star": 4, "rating": 18.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.8, "nbOfVotes": 2 }
		],
		"title": "The Pirate Empress Boa Hancock",
		"aired": "2008-09-29T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 517,
		"ratingFiveStars": 68.3,
		"ratingAllStars": 93,
		"nbOfVotes": 60,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=46140&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.3, "nbOfVotes": 41 },
			{ "star": 4, "rating": 28.3, "nbOfVotes": 17 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Bathing",
		"aired": "2008-10-06T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 518,
		"ratingFiveStars": 80,
		"ratingAllStars": 95.4,
		"nbOfVotes": 65,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=47205&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 52 },
			{ "star": 4, "rating": 16.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Arena",
		"aired": "2008-10-11T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 519,
		"ratingFiveStars": 71.9,
		"ratingAllStars": 92.8,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=49384&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.9, "nbOfVotes": 46 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 15 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 1 }
		],
		"title": "A King's Disposition",
		"aired": "2008-10-27T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 520,
		"ratingFiveStars": 81.8,
		"ratingAllStars": 96,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=50359&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.8, "nbOfVotes": 45 },
			{ "star": 4, "rating": 16.4, "nbOfVotes": 9 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gorgon's Eyes",
		"aired": "2008-11-01T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 521,
		"ratingFiveStars": 85.7,
		"ratingAllStars": 96.8,
		"nbOfVotes": 70,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=51534&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.7, "nbOfVotes": 60 },
			{ "star": 4, "rating": 12.9, "nbOfVotes": 9 },
			{ "star": 3, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Hoof of Celestial Dragons",
		"aired": "2008-11-10T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 522,
		"ratingFiveStars": 83.5,
		"ratingAllStars": 96.2,
		"nbOfVotes": 121,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=52333&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.5, "nbOfVotes": 101 },
			{ "star": 4, "rating": 14, "nbOfVotes": 17 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Fatal Disease",
		"aired": "2008-11-17T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 523,
		"ratingFiveStars": 85.4,
		"ratingAllStars": 97,
		"nbOfVotes": 82,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=53378&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.4, "nbOfVotes": 70 },
			{ "star": 4, "rating": 14.6, "nbOfVotes": 12 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Hell",
		"aired": "2008-11-22T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 524,
		"ratingFiveStars": 79.5,
		"ratingAllStars": 95,
		"nbOfVotes": 83,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=54528&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.5, "nbOfVotes": 66 },
			{ "star": 4, "rating": 18.1, "nbOfVotes": 15 },
			{ "star": 3, "rating": 1.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "No One Can Stop This Now",
		"aired": "2008-12-01T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 525,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 94.8,
		"nbOfVotes": 72,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=55704&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 56 },
			{ "star": 4, "rating": 18.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 4.2, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Underwater Prison Impel Down",
		"aired": "2008-12-08T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 526,
		"ratingFiveStars": 83.1,
		"ratingAllStars": 96.2,
		"nbOfVotes": 89,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=57898&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.1, "nbOfVotes": 74 },
			{ "star": 4, "rating": 14.6, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure in the Great Prison",
		"aired": "2008-12-22T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 527,
		"ratingFiveStars": 81.1,
		"ratingAllStars": 95.6,
		"nbOfVotes": 90,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=59983&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.1, "nbOfVotes": 73 },
			{ "star": 4, "rating": 15.6, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Level 1 Crimson Hell",
		"aired": "2009-01-05T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 528,
		"ratingFiveStars": 75,
		"ratingAllStars": 93.6,
		"nbOfVotes": 80,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=62809&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 60 },
			{ "star": 4, "rating": 18.8, "nbOfVotes": 15 },
			{ "star": 3, "rating": 5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Jinbe, Knight of the Sea",
		"aired": "2009-01-19T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 529,
		"ratingFiveStars": 81.6,
		"ratingAllStars": 95.2,
		"nbOfVotes": 76,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=63941&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.6, "nbOfVotes": 62 },
			{ "star": 4, "rating": 13.2, "nbOfVotes": 10 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Level 2 Wild Beast Hell",
		"aired": "2009-01-26T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 530,
		"ratingFiveStars": 80.3,
		"ratingAllStars": 95,
		"nbOfVotes": 71,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=65160&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.3, "nbOfVotes": 57 },
			{ "star": 4, "rating": 14.1, "nbOfVotes": 10 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "From Hell to Hell",
		"aired": "2009-02-02T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 531,
		"ratingFiveStars": 76.4,
		"ratingAllStars": 94.2,
		"nbOfVotes": 72,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=66406&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.4, "nbOfVotes": 55 },
			{ "star": 4, "rating": 20.8, "nbOfVotes": 15 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Level 3 Starvation Hell",
		"aired": "2009-02-09T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 532,
		"ratingFiveStars": 76.2,
		"ratingAllStars": 94.6,
		"nbOfVotes": 84,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=67586&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.2, "nbOfVotes": 64 },
			{ "star": 4, "rating": 20.2, "nbOfVotes": 17 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Jailer Beast Minotaurus",
		"aired": "2009-02-16T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 533,
		"ratingFiveStars": 75,
		"ratingAllStars": 92.6,
		"nbOfVotes": 32,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=232291&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 24 },
			{ "star": 4, "rating": 15.6, "nbOfVotes": 5 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Level 4 Inferno Hell",
		"aired": "2009-02-23T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 534,
		"ratingFiveStars": 82.1,
		"ratingAllStars": 96.4,
		"nbOfVotes": 28,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=232303&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.1, "nbOfVotes": 23 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Chief Warden Magellan vs. Pirate Luffy",
		"aired": "2009-03-09T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 535,
		"ratingFiveStars": 76.5,
		"ratingAllStars": 93.8,
		"nbOfVotes": 68,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=72804&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.5, "nbOfVotes": 52 },
			{ "star": 4, "rating": 19.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Friends",
		"aired": "2009-03-16T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 536,
		"ratingFiveStars": 82.2,
		"ratingAllStars": 94.2,
		"nbOfVotes": 73,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=73946&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.2, "nbOfVotes": 60 },
			{ "star": 4, "rating": 12.3, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 2 }
		],
		"title": "Level 5 Frozen Hell",
		"aired": "2009-03-23T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 537,
		"ratingFiveStars": 60.2,
		"ratingAllStars": 89,
		"nbOfVotes": 83,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=75565&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.2, "nbOfVotes": 50 },
			{ "star": 4, "rating": 28.9, "nbOfVotes": 24 },
			{ "star": 3, "rating": 7.2, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "Okama in Hell",
		"aired": "2009-03-30T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 538,
		"ratingFiveStars": 77.6,
		"ratingAllStars": 93.8,
		"nbOfVotes": 85,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=76796&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.6, "nbOfVotes": 66 },
			{ "star": 4, "rating": 16.5, "nbOfVotes": 14 },
			{ "star": 3, "rating": 4.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "Level 5.5 New Kama Land",
		"aired": "2009-04-06T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 539,
		"ratingFiveStars": 82.6,
		"ratingAllStars": 95.4,
		"nbOfVotes": 92,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=78053&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.6, "nbOfVotes": 76 },
			{ "star": 4, "rating": 14.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Emporio Tension Hormones",
		"aired": "2009-04-13T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 540,
		"ratingFiveStars": 88.6,
		"ratingAllStars": 97.2,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=81212&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.6, "nbOfVotes": 101 },
			{ "star": 4, "rating": 8.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Level 6 Eternal Hell",
		"aired": "2009-04-27T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 541,
		"ratingFiveStars": 86.1,
		"ratingAllStars": 96.8,
		"nbOfVotes": 122,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=83004&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.1, "nbOfVotes": 105 },
			{ "star": 4, "rating": 12.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Likes of Which It Has Never Seen",
		"aired": "2009-05-11T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 542,
		"ratingFiveStars": 78.7,
		"ratingAllStars": 95,
		"nbOfVotes": 75,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=85078&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.7, "nbOfVotes": 59 },
			{ "star": 4, "rating": 17.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 4, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Another Incident to Be Told",
		"aired": "2009-05-18T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 543,
		"ratingFiveStars": 83,
		"ratingAllStars": 96,
		"nbOfVotes": 94,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=86262&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83, "nbOfVotes": 78 },
			{ "star": 4, "rating": 14.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Straw Hat and Blackbeard",
		"aired": "2009-05-25T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 544,
		"ratingFiveStars": 81.2,
		"ratingAllStars": 95,
		"nbOfVotes": 85,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=87833&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.2, "nbOfVotes": 69 },
			{ "star": 4, "rating": 15.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "Even the Lid of Hell's Cauldron Will Open",
		"aired": "2009-06-01T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 545,
		"ratingFiveStars": 79.5,
		"ratingAllStars": 94.4,
		"nbOfVotes": 83,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=89617&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.5, "nbOfVotes": 66 },
			{ "star": 4, "rating": 15.7, "nbOfVotes": 13 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "To the Sunshine in Outside World",
		"aired": "2009-06-08T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 546,
		"ratingFiveStars": 76.9,
		"ratingAllStars": 94.8,
		"nbOfVotes": 91,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=90976&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.9, "nbOfVotes": 70 },
			{ "star": 4, "rating": 22, "nbOfVotes": 20 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Captain of Fishmen Pirates, \"Shichibukai\" Jinbe",
		"aired": "2009-06-15T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 547,
		"ratingFiveStars": 75.6,
		"ratingAllStars": 93.8,
		"nbOfVotes": 86,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=93169&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.6, "nbOfVotes": 65 },
			{ "star": 4, "rating": 20.9, "nbOfVotes": 18 },
			{ "star": 3, "rating": 1.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "Escaping the Island",
		"aired": "2009-06-22T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 548,
		"ratingFiveStars": 95,
		"ratingAllStars": 98.6,
		"nbOfVotes": 161,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=94610&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 95, "nbOfVotes": 153 },
			{ "star": 4, "rating": 4.3, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Thank You",
		"aired": "2009-06-29T00:00:00+00:00",
		"score": 4.93
	},
	{
		"episodeNb": 549,
		"ratingFiveStars": 85.6,
		"ratingAllStars": 96.6,
		"nbOfVotes": 118,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=94633&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.6, "nbOfVotes": 101 },
			{ "star": 4, "rating": 11.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ship Sailing Forth",
		"aired": "2009-07-06T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 550,
		"ratingFiveStars": 90.6,
		"ratingAllStars": 97,
		"nbOfVotes": 245,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=99559&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.6, "nbOfVotes": 222 },
			{ "star": 4, "rating": 6.1, "nbOfVotes": 15 },
			{ "star": 3, "rating": 2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 2 }
		],
		"title": "Marine Headquarters",
		"aired": "2009-07-18T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 551,
		"ratingFiveStars": 94.3,
		"ratingAllStars": 98.6,
		"nbOfVotes": 212,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=101254&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 94.3, "nbOfVotes": 200 },
			{ "star": 4, "rating": 4.7, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0.9, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Yonko \"Whitebeard\"",
		"aired": "2009-07-27T00:00:00+00:00",
		"score": 4.93
	},
	{
		"episodeNb": 552,
		"ratingFiveStars": 88.2,
		"ratingAllStars": 97,
		"nbOfVotes": 136,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=102474&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.2, "nbOfVotes": 120 },
			{ "star": 4, "rating": 9.6, "nbOfVotes": 13 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Ace and Whitebeard",
		"aired": "2009-08-03T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 553,
		"ratingFiveStars": 79.3,
		"ratingAllStars": 94.8,
		"nbOfVotes": 145,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=104186&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.3, "nbOfVotes": 115 },
			{ "star": 4, "rating": 16.6, "nbOfVotes": 24 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Conflict at the Summit",
		"aired": "2009-08-10T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 554,
		"ratingFiveStars": 77.1,
		"ratingAllStars": 94,
		"nbOfVotes": 118,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=106334&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.1, "nbOfVotes": 91 },
			{ "star": 4, "rating": 17.8, "nbOfVotes": 21 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Admiral Akainu",
		"aired": "2009-08-24T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 555,
		"ratingFiveStars": 80,
		"ratingAllStars": 95.4,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=109608&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 92 },
			{ "star": 4, "rating": 18.3, "nbOfVotes": 21 },
			{ "star": 3, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Oars and the kasa",
		"aired": "2009-08-31T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 556,
		"ratingFiveStars": 85.5,
		"ratingAllStars": 95.6,
		"nbOfVotes": 152,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=111722&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.5, "nbOfVotes": 130 },
			{ "star": 4, "rating": 7.9, "nbOfVotes": 12 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Justice will Prevail!!",
		"aired": "2009-09-07T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 557,
		"ratingFiveStars": 89.4,
		"ratingAllStars": 96.2,
		"nbOfVotes": 160,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=115621&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.4, "nbOfVotes": 143 },
			{ "star": 4, "rating": 6.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 3 }
		],
		"title": "Luffy and Whitebeard",
		"aired": "2009-09-19T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 558,
		"ratingFiveStars": 91.5,
		"ratingAllStars": 98.2,
		"nbOfVotes": 142,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=118250&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 91.5, "nbOfVotes": 130 },
			{ "star": 4, "rating": 7.7, "nbOfVotes": 11 },
			{ "star": 3, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Younger Brother",
		"aired": "2009-09-28T00:00:00+00:00",
		"score": 4.91
	},
	{
		"episodeNb": 559,
		"ratingFiveStars": 86.5,
		"ratingAllStars": 97.2,
		"nbOfVotes": 126,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=119960&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.5, "nbOfVotes": 109 },
			{ "star": 4, "rating": 12.7, "nbOfVotes": 16 },
			{ "star": 3, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Karma",
		"aired": "2009-10-05T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 560,
		"ratingFiveStars": 86,
		"ratingAllStars": 96.4,
		"nbOfVotes": 121,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=121781&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86, "nbOfVotes": 104 },
			{ "star": 4, "rating": 10.7, "nbOfVotes": 13 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Prisoners of Impel Down",
		"aired": "2009-10-10T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 561,
		"ratingFiveStars": 83.5,
		"ratingAllStars": 96.6,
		"nbOfVotes": 103,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=123757&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.5, "nbOfVotes": 86 },
			{ "star": 4, "rating": 15.5, "nbOfVotes": 16 },
			{ "star": 3, "rating": 1, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy vs. Mihawk",
		"aired": "2009-10-26T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 562,
		"ratingFiveStars": 84.5,
		"ratingAllStars": 96.4,
		"nbOfVotes": 129,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=127045&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.5, "nbOfVotes": 109 },
			{ "star": 4, "rating": 13.2, "nbOfVotes": 17 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Maelstrom Spider Squard",
		"aired": "2009-11-02T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 563,
		"ratingFiveStars": 88.1,
		"ratingAllStars": 96.4,
		"nbOfVotes": 135,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=128888&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.1, "nbOfVotes": 119 },
			{ "star": 4, "rating": 8.1, "nbOfVotes": 11 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "One Heart, One Man",
		"aired": "2009-11-09T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 564,
		"ratingFiveStars": 75.7,
		"ratingAllStars": 94.6,
		"nbOfVotes": 107,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=132417&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.7, "nbOfVotes": 81 },
			{ "star": 4, "rating": 21.5, "nbOfVotes": 23 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Man Who Shakes The World",
		"aired": "2009-11-21T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 565,
		"ratingFiveStars": 84.5,
		"ratingAllStars": 96.2,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=134400&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.5, "nbOfVotes": 98 },
			{ "star": 4, "rating": 12.1, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Path of Oars",
		"aired": "2009-11-30T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 566,
		"ratingFiveStars": 84.2,
		"ratingAllStars": 95.8,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=134432&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.2, "nbOfVotes": 96 },
			{ "star": 4, "rating": 11.4, "nbOfVotes": 13 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Assault",
		"aired": "2009-12-07T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 567,
		"ratingFiveStars": 82.8,
		"ratingAllStars": 95.6,
		"nbOfVotes": 93,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=141955&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.8, "nbOfVotes": 77 },
			{ "star": 4, "rating": 12.9, "nbOfVotes": 12 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Marineford Marine Headquarters, Oris Plaza",
		"aired": "2009-12-14T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 568,
		"ratingFiveStars": 79.2,
		"ratingAllStars": 95,
		"nbOfVotes": 106,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=143635&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.2, "nbOfVotes": 84 },
			{ "star": 4, "rating": 16, "nbOfVotes": 17 },
			{ "star": 3, "rating": 4.7, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Have It Your Own Damned Way",
		"aired": "2009-12-21T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 569,
		"ratingFiveStars": 86.5,
		"ratingAllStars": 96.6,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=145901&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.5, "nbOfVotes": 115 },
			{ "star": 4, "rating": 11.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "White Monster",
		"aired": "2010-01-04T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 570,
		"ratingFiveStars": 89.3,
		"ratingAllStars": 97.4,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=150943&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.3, "nbOfVotes": 100 },
			{ "star": 4, "rating": 8, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Bridge of Life",
		"aired": "2010-01-18T00:00:00+00:00",
		"score": 4.87
	},
	{
		"episodeNb": 571,
		"ratingFiveStars": 87.1,
		"ratingAllStars": 95.8,
		"nbOfVotes": 155,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=152512&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.1, "nbOfVotes": 135 },
			{ "star": 4, "rating": 7.7, "nbOfVotes": 12 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Execution Platform",
		"aired": "2010-01-25T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 572,
		"ratingFiveStars": 90.8,
		"ratingAllStars": 98.2,
		"nbOfVotes": 119,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=154330&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.8, "nbOfVotes": 108 },
			{ "star": 4, "rating": 9.2, "nbOfVotes": 11 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Times They Are A-Changin'",
		"aired": "2010-02-01T00:00:00+00:00",
		"score": 4.91
	},
	{
		"episodeNb": 573,
		"ratingFiveStars": 91.1,
		"ratingAllStars": 96.8,
		"nbOfVotes": 214,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=156737&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 91.1, "nbOfVotes": 195 },
			{ "star": 4, "rating": 6.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 4 }
		],
		"title": "I Call the Name of This Age \"Whitebeard\"",
		"aired": "2010-02-08T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 574,
		"ratingFiveStars": 87.7,
		"ratingAllStars": 93,
		"nbOfVotes": 391,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=157919&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.7, "nbOfVotes": 343 },
			{ "star": 4, "rating": 3.1, "nbOfVotes": 12 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1, "nbOfVotes": 4 },
			{ "star": 1, "rating": 6.4, "nbOfVotes": 25 }
		],
		"title": "Portgas D. Ace Dies",
		"aired": "2010-02-15T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 575,
		"ratingFiveStars": 86.9,
		"ratingAllStars": 96.8,
		"nbOfVotes": 168,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=160226&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.9, "nbOfVotes": 146 },
			{ "star": 4, "rating": 10.1, "nbOfVotes": 17 },
			{ "star": 3, "rating": 3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Anger Without Words",
		"aired": "2010-02-22T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 576,
		"ratingFiveStars": 95.8,
		"ratingAllStars": 99,
		"nbOfVotes": 261,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=160471&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 95.8, "nbOfVotes": 250 },
			{ "star": 4, "rating": 3.8, "nbOfVotes": 10 },
			{ "star": 3, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Great Pirate Edward Newgate",
		"aired": "2010-03-08T00:00:00+00:00",
		"score": 4.95
	},
	{
		"episodeNb": 577,
		"ratingFiveStars": 85.7,
		"ratingAllStars": 96,
		"nbOfVotes": 168,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=166443&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.7, "nbOfVotes": 144 },
			{ "star": 4, "rating": 10.7, "nbOfVotes": 18 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Major Events Piling Up One After Another",
		"aired": "2010-03-15T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 578,
		"ratingFiveStars": 81.6,
		"ratingAllStars": 95.6,
		"nbOfVotes": 158,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=167887&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.6, "nbOfVotes": 129 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 24 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "He Who Must Live to See a New Age",
		"aired": "2010-03-20T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 579,
		"ratingFiveStars": 94.2,
		"ratingAllStars": 98.2,
		"nbOfVotes": 207,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=170618&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 94.2, "nbOfVotes": 195 },
			{ "star": 4, "rating": 3.9, "nbOfVotes": 8 },
			{ "star": 3, "rating": 1.4, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Seconds of Courage",
		"aired": "2010-03-29T00:00:00+00:00",
		"score": 4.91
	},
	{
		"episodeNb": 580,
		"ratingFiveStars": 78.5,
		"ratingAllStars": 94.6,
		"nbOfVotes": 181,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=194104&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.5, "nbOfVotes": 142 },
			{ "star": 4, "rating": 16.6, "nbOfVotes": 30 },
			{ "star": 3, "rating": 5, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "End of the War",
		"aired": "2010-04-05T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 581,
		"ratingFiveStars": 78.9,
		"ratingAllStars": 94.4,
		"nbOfVotes": 147,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=200063&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.9, "nbOfVotes": 116 },
			{ "star": 4, "rating": 16.3, "nbOfVotes": 24 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Creeping Future",
		"aired": "2010-04-19T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 582,
		"ratingFiveStars": 75.5,
		"ratingAllStars": 93.6,
		"nbOfVotes": 139,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=202091&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.5, "nbOfVotes": 105 },
			{ "star": 4, "rating": 18, "nbOfVotes": 25 },
			{ "star": 3, "rating": 5.8, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy and Ace",
		"aired": "2010-04-26T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 583,
		"ratingFiveStars": 54.5,
		"ratingAllStars": 86.8,
		"nbOfVotes": 123,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=205316&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.5, "nbOfVotes": 67 },
			{ "star": 4, "rating": 30.1, "nbOfVotes": 37 },
			{ "star": 3, "rating": 11.4, "nbOfVotes": 14 },
			{ "star": 2, "rating": 3.3, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Gray Terminal - The Final Destination of the Uncertainty",
		"aired": "2010-05-10T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 584,
		"ratingFiveStars": 56.9,
		"ratingAllStars": 86.8,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=208108&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.9, "nbOfVotes": 66 },
			{ "star": 4, "rating": 27.6, "nbOfVotes": 32 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 12 },
			{ "star": 2, "rating": 3.4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "The Porchemy Incident",
		"aired": "2010-05-17T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 585,
		"ratingFiveStars": 65,
		"ratingAllStars": 90.2,
		"nbOfVotes": 120,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=209905&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65, "nbOfVotes": 78 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 28 },
			{ "star": 3, "rating": 9.2, "nbOfVotes": 11 },
			{ "star": 2, "rating": 2.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Brothers' Sake Cups",
		"aired": "2010-05-24T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 586,
		"ratingFiveStars": 72.2,
		"ratingAllStars": 93,
		"nbOfVotes": 126,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=211932&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.2, "nbOfVotes": 91 },
			{ "star": 4, "rating": 23, "nbOfVotes": 29 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "A Fetid Town",
		"aired": "2010-05-31T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 587,
		"ratingFiveStars": 65,
		"ratingAllStars": 90,
		"nbOfVotes": 103,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=213916&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65, "nbOfVotes": 67 },
			{ "star": 4, "rating": 21.4, "nbOfVotes": 22 },
			{ "star": 3, "rating": 11.7, "nbOfVotes": 12 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I Will Not Run!",
		"aired": "2010-06-07T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 588,
		"ratingFiveStars": 72.3,
		"ratingAllStars": 92.8,
		"nbOfVotes": 119,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=217618&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.3, "nbOfVotes": 86 },
			{ "star": 4, "rating": 21, "nbOfVotes": 25 },
			{ "star": 3, "rating": 5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Sabo's Ocean",
		"aired": "2010-06-14T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 589,
		"ratingFiveStars": 81.6,
		"ratingAllStars": 95.6,
		"nbOfVotes": 125,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=234542&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.6, "nbOfVotes": 102 },
			{ "star": 4, "rating": 14.4, "nbOfVotes": 18 },
			{ "star": 3, "rating": 4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Efforts Toward Glory",
		"aired": "2010-06-28T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 590,
		"ratingFiveStars": 89,
		"ratingAllStars": 97.4,
		"nbOfVotes": 164,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=242590&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89, "nbOfVotes": 146 },
			{ "star": 4, "rating": 9.1, "nbOfVotes": 15 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "My Little Brother",
		"aired": "2010-07-05T00:00:00+00:00",
		"score": 4.87
	},
	{
		"episodeNb": 591,
		"ratingFiveStars": 85.1,
		"ratingAllStars": 96.4,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=244801&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.1, "nbOfVotes": 97 },
			{ "star": 4, "rating": 12.3, "nbOfVotes": 14 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "You Sure That's Alright?",
		"aired": "2010-07-12T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 592,
		"ratingFiveStars": 82.4,
		"ratingAllStars": 93.6,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=246271&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.4, "nbOfVotes": 89 },
			{ "star": 4, "rating": 9.3, "nbOfVotes": 10 },
			{ "star": 3, "rating": 4.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.8, "nbOfVotes": 3 }
		],
		"title": "Yell",
		"aired": "2010-07-17T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 593,
		"ratingFiveStars": 79.5,
		"ratingAllStars": 94.2,
		"nbOfVotes": 117,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=248304&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.5, "nbOfVotes": 93 },
			{ "star": 4, "rating": 16.2, "nbOfVotes": 19 },
			{ "star": 3, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "News",
		"aired": "2010-07-26T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 594,
		"ratingFiveStars": 80.6,
		"ratingAllStars": 94.8,
		"nbOfVotes": 160,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=250207&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.6, "nbOfVotes": 129 },
			{ "star": 4, "rating": 14.4, "nbOfVotes": 23 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Message",
		"aired": "2010-08-02T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 595,
		"ratingFiveStars": 73.1,
		"ratingAllStars": 93.4,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=251792&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.1, "nbOfVotes": 79 },
			{ "star": 4, "rating": 21.3, "nbOfVotes": 23 },
			{ "star": 3, "rating": 4.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Oath",
		"aired": "2010-08-09T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 596,
		"ratingFiveStars": 60.4,
		"ratingAllStars": 89.4,
		"nbOfVotes": 96,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=255185&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.4, "nbOfVotes": 58 },
			{ "star": 4, "rating": 26, "nbOfVotes": 25 },
			{ "star": 3, "rating": 13.5, "nbOfVotes": 13 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Spectrum",
		"aired": "2010-08-23T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 597,
		"ratingFiveStars": 89.5,
		"ratingAllStars": 97.6,
		"nbOfVotes": 287,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=256601&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.5, "nbOfVotes": 257 },
			{ "star": 4, "rating": 9.1, "nbOfVotes": 26 },
			{ "star": 3, "rating": 1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "3D2Y",
		"aired": "2010-08-30T00:00:00+00:00",
		"score": 4.88
	},
	{
		"episodeNb": 598,
		"ratingFiveStars": 89.8,
		"ratingAllStars": 97.4,
		"nbOfVotes": 343,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=263316&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.8, "nbOfVotes": 308 },
			{ "star": 4, "rating": 8.2, "nbOfVotes": 28 },
			{ "star": 3, "rating": 1.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.3, "nbOfVotes": 1 }
		],
		"title": "2 Years Later",
		"aired": "2010-10-04T00:00:00+00:00",
		"score": 4.87
	},
	{
		"episodeNb": 599,
		"ratingFiveStars": 86.5,
		"ratingAllStars": 96.6,
		"nbOfVotes": 185,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=264481&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.5, "nbOfVotes": 160 },
			{ "star": 4, "rating": 10.3, "nbOfVotes": 19 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "9 Pirates",
		"aired": "2010-10-09T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 600,
		"ratingFiveStars": 75,
		"ratingAllStars": 93,
		"nbOfVotes": 164,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=265775&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 123 },
			{ "star": 4, "rating": 17.7, "nbOfVotes": 29 },
			{ "star": 3, "rating": 5.5, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "The Island of Restarting",
		"aired": "2010-10-18T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 601,
		"ratingFiveStars": 93.2,
		"ratingAllStars": 98.2,
		"nbOfVotes": 191,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=266955&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 93.2, "nbOfVotes": 178 },
			{ "star": 4, "rating": 5.2, "nbOfVotes": 10 },
			{ "star": 3, "rating": 1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Romance Dawn for the new world - The Dawn of an Adventure into the New World",
		"aired": "2010-10-25T00:00:00+00:00",
		"score": 4.91
	},
	{
		"episodeNb": 602,
		"ratingFiveStars": 94.9,
		"ratingAllStars": 98.8,
		"nbOfVotes": 177,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=268164&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 94.9, "nbOfVotes": 168 },
			{ "star": 4, "rating": 4, "nbOfVotes": 7 },
			{ "star": 3, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rudder Straight Down!!",
		"aired": "2010-11-01T00:00:00+00:00",
		"score": 4.9399999999999995
	},
	{
		"episodeNb": 603,
		"ratingFiveStars": 77.1,
		"ratingAllStars": 94.2,
		"nbOfVotes": 140,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=269222&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.1, "nbOfVotes": 108 },
			{ "star": 4, "rating": 19.3, "nbOfVotes": 27 },
			{ "star": 3, "rating": 2.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 2 }
		],
		"title": "Keep It in Your Heart",
		"aired": "2010-11-08T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 604,
		"ratingFiveStars": 64.9,
		"ratingAllStars": 90.2,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=270579&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.9, "nbOfVotes": 74 },
			{ "star": 4, "rating": 22.8, "nbOfVotes": 26 },
			{ "star": 3, "rating": 10.5, "nbOfVotes": 12 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Into the Depths",
		"aired": "2010-11-15T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 605,
		"ratingFiveStars": 74.1,
		"ratingAllStars": 92.2,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=272841&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.1, "nbOfVotes": 80 },
			{ "star": 4, "rating": 14.8, "nbOfVotes": 16 },
			{ "star": 3, "rating": 10.2, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "The Kraken and the Pirates",
		"aired": "2010-11-29T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 606,
		"ratingFiveStars": 71.3,
		"ratingAllStars": 91.4,
		"nbOfVotes": 94,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=274030&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.3, "nbOfVotes": 67 },
			{ "star": 4, "rating": 19.1, "nbOfVotes": 18 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 2 }
		],
		"title": "Adventure in the Ocean Depths",
		"aired": "2010-12-06T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 607,
		"ratingFiveStars": 63.3,
		"ratingAllStars": 90.6,
		"nbOfVotes": 79,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=275301&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.3, "nbOfVotes": 50 },
			{ "star": 4, "rating": 29.1, "nbOfVotes": 23 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 1 }
		],
		"title": "10,000 Meters Under the Sea",
		"aired": "2010-12-13T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 608,
		"ratingFiveStars": 70,
		"ratingAllStars": 91.8,
		"nbOfVotes": 100,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=276442&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70, "nbOfVotes": 70 },
			{ "star": 4, "rating": 23, "nbOfVotes": 23 },
			{ "star": 3, "rating": 4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Undersea Paradise",
		"aired": "2010-12-20T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 609,
		"ratingFiveStars": 64.6,
		"ratingAllStars": 89.2,
		"nbOfVotes": 99,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=278032&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.6, "nbOfVotes": 64 },
			{ "star": 4, "rating": 23.2, "nbOfVotes": 23 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3, "nbOfVotes": 3 }
		],
		"title": "Adventure on Fishman Island",
		"aired": "2011-01-04T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 610,
		"ratingFiveStars": 65.3,
		"ratingAllStars": 89.8,
		"nbOfVotes": 101,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=280481&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.3, "nbOfVotes": 66 },
			{ "star": 4, "rating": 19.8, "nbOfVotes": 20 },
			{ "star": 3, "rating": 13.9, "nbOfVotes": 14 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Fortune-Teller Madame Shyarly",
		"aired": "2011-01-17T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 611,
		"ratingFiveStars": 60.2,
		"ratingAllStars": 89,
		"nbOfVotes": 83,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=281480&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.2, "nbOfVotes": 50 },
			{ "star": 4, "rating": 27.7, "nbOfVotes": 23 },
			{ "star": 3, "rating": 9.6, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "Hody Jones",
		"aired": "2011-01-24T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 612,
		"ratingFiveStars": 57.1,
		"ratingAllStars": 90.2,
		"nbOfVotes": 77,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=282382&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.1, "nbOfVotes": 44 },
			{ "star": 4, "rating": 37.7, "nbOfVotes": 29 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Brought by the Shark They Saved",
		"aired": "2011-01-31T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 613,
		"ratingFiveStars": 72.2,
		"ratingAllStars": 93.4,
		"nbOfVotes": 79,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=283354&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.2, "nbOfVotes": 57 },
			{ "star": 4, "rating": 22.8, "nbOfVotes": 18 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Mermaid Princess in Hard-Shell Tower",
		"aired": "2011-02-07T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 614,
		"ratingFiveStars": 71.7,
		"ratingAllStars": 92.4,
		"nbOfVotes": 92,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=284536&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.7, "nbOfVotes": 66 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 18 },
			{ "star": 3, "rating": 7.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "What's Done is Done",
		"aired": "2011-02-14T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 615,
		"ratingFiveStars": 56.9,
		"ratingAllStars": 88.4,
		"nbOfVotes": 65,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=285386&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.9, "nbOfVotes": 37 },
			{ "star": 4, "rating": 29.2, "nbOfVotes": 19 },
			{ "star": 3, "rating": 12.3, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Curse of Mato Mato",
		"aired": "2011-02-21T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 616,
		"ratingFiveStars": 63.5,
		"ratingAllStars": 90.2,
		"nbOfVotes": 63,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=286170&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.5, "nbOfVotes": 40 },
			{ "star": 4, "rating": 25.4, "nbOfVotes": 16 },
			{ "star": 3, "rating": 9.5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Anniversary of Revenge",
		"aired": "2011-02-28T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 617,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 90.8,
		"nbOfVotes": 48,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=287918&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 32 },
			{ "star": 4, "rating": 22.9, "nbOfVotes": 11 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Major Incident on Coral Hill",
		"aired": "2011-03-14T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 618,
		"ratingFiveStars": 80.3,
		"ratingAllStars": 94.6,
		"nbOfVotes": 66,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=288705&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.3, "nbOfVotes": 53 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 10 },
			{ "star": 3, "rating": 3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 1 }
		],
		"title": "Proposal",
		"aired": "2011-03-19T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 619,
		"ratingFiveStars": 61.8,
		"ratingAllStars": 91.6,
		"nbOfVotes": 55,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=290438&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.8, "nbOfVotes": 34 },
			{ "star": 4, "rating": 34.5, "nbOfVotes": 19 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "At the Sea Forest",
		"aired": "2011-04-04T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 620,
		"ratingFiveStars": 68.6,
		"ratingAllStars": 91.2,
		"nbOfVotes": 70,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=291354&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.6, "nbOfVotes": 48 },
			{ "star": 4, "rating": 22.9, "nbOfVotes": 16 },
			{ "star": 3, "rating": 5.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "The Longed-For Amusement Park",
		"aired": "2011-04-11T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 621,
		"ratingFiveStars": 52.9,
		"ratingAllStars": 86,
		"nbOfVotes": 70,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=292271&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52.9, "nbOfVotes": 37 },
			{ "star": 4, "rating": 31.4, "nbOfVotes": 22 },
			{ "star": 3, "rating": 10, "nbOfVotes": 7 },
			{ "star": 2, "rating": 4.3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "Otohime and Tiger",
		"aired": "2011-04-18T00:00:00+00:00",
		"score": 4.3
	},
	{
		"episodeNb": 622,
		"ratingFiveStars": 75,
		"ratingAllStars": 92.8,
		"nbOfVotes": 88,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=293219&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 66 },
			{ "star": 4, "rating": 15.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 8, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "The Sun Pirates",
		"aired": "2011-04-25T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 623,
		"ratingFiveStars": 76.9,
		"ratingAllStars": 94.4,
		"nbOfVotes": 78,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=294821&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.9, "nbOfVotes": 60 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Fisher Tiger",
		"aired": "2011-05-09T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 624,
		"ratingFiveStars": 61.2,
		"ratingAllStars": 89,
		"nbOfVotes": 49,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=296225&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.2, "nbOfVotes": 30 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 4.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Queen Otohime",
		"aired": "2011-05-16T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 625,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 88.2,
		"nbOfVotes": 64,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=297286&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 40 },
			{ "star": 4, "rating": 20.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 14.1, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 1 }
		],
		"title": "Uninherited Will",
		"aired": "2011-05-23T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 626,
		"ratingFiveStars": 73.6,
		"ratingAllStars": 92.2,
		"nbOfVotes": 87,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=298218&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.6, "nbOfVotes": 64 },
			{ "star": 4, "rating": 17.2, "nbOfVotes": 15 },
			{ "star": 3, "rating": 6.9, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "The Three Neptune Brothers",
		"aired": "2011-05-30T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 627,
		"ratingFiveStars": 62.9,
		"ratingAllStars": 88.6,
		"nbOfVotes": 70,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=299178&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.9, "nbOfVotes": 44 },
			{ "star": 4, "rating": 21.4, "nbOfVotes": 15 },
			{ "star": 3, "rating": 12.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "You Have My Gratitude",
		"aired": "2011-06-06T00:00:00+00:00",
		"score": 4.43
	},
	{
		"episodeNb": 628,
		"ratingFiveStars": 70.4,
		"ratingAllStars": 91.6,
		"nbOfVotes": 71,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=301230&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.4, "nbOfVotes": 50 },
			{ "star": 4, "rating": 16.9, "nbOfVotes": 12 },
			{ "star": 3, "rating": 12.7, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Major Cleanup",
		"aired": "2011-06-20T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 629,
		"ratingFiveStars": 52.2,
		"ratingAllStars": 86.6,
		"nbOfVotes": 69,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=302255&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52.2, "nbOfVotes": 36 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 23 },
			{ "star": 3, "rating": 11.6, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 1 }
		],
		"title": "The Former Shichibukai Who Stands in the Way",
		"aired": "2011-06-27T00:00:00+00:00",
		"score": 4.33
	},
	{
		"episodeNb": 630,
		"ratingFiveStars": 39.8,
		"ratingAllStars": 76.2,
		"nbOfVotes": 88,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=303256&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 39.8, "nbOfVotes": 35 },
			{ "star": 4, "rating": 26.1, "nbOfVotes": 23 },
			{ "star": 3, "rating": 13.6, "nbOfVotes": 12 },
			{ "star": 2, "rating": 15.9, "nbOfVotes": 14 },
			{ "star": 1, "rating": 4.5, "nbOfVotes": 4 }
		],
		"title": "Lashing Out",
		"aired": "2011-07-04T00:00:00+00:00",
		"score": 3.81
	},
	{
		"episodeNb": 631,
		"ratingFiveStars": 50,
		"ratingAllStars": 83.8,
		"nbOfVotes": 68,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=304376&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50, "nbOfVotes": 34 },
			{ "star": 4, "rating": 27.9, "nbOfVotes": 19 },
			{ "star": 3, "rating": 16.2, "nbOfVotes": 11 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 2 }
		],
		"title": "Gyoncorde Plaza",
		"aired": "2011-07-11T00:00:00+00:00",
		"score": 4.1899999999999995
	},
	{
		"episodeNb": 632,
		"ratingFiveStars": 55.6,
		"ratingAllStars": 83.4,
		"nbOfVotes": 63,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=305484&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.6, "nbOfVotes": 35 },
			{ "star": 4, "rating": 17.5, "nbOfVotes": 11 },
			{ "star": 3, "rating": 19, "nbOfVotes": 12 },
			{ "star": 2, "rating": 4.8, "nbOfVotes": 3 },
			{ "star": 1, "rating": 3.2, "nbOfVotes": 2 }
		],
		"title": "I Knew it All Along",
		"aired": "2011-07-16T00:00:00+00:00",
		"score": 4.17
	},
	{
		"episodeNb": 633,
		"ratingFiveStars": 82.4,
		"ratingAllStars": 94.6,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=309875&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.4, "nbOfVotes": 89 },
			{ "star": 4, "rating": 11.1, "nbOfVotes": 12 },
			{ "star": 3, "rating": 4.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Friend or Foe",
		"aired": "2011-08-01T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 634,
		"ratingFiveStars": 87.3,
		"ratingAllStars": 97,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=312425&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.3, "nbOfVotes": 96 },
			{ "star": 4, "rating": 10.9, "nbOfVotes": 12 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "100,000 vs. 10",
		"aired": "2011-08-08T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 635,
		"ratingFiveStars": 81.3,
		"ratingAllStars": 94.8,
		"nbOfVotes": 107,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=317217&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.3, "nbOfVotes": 87 },
			{ "star": 4, "rating": 13.1, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "So Disgusting It Makes Me Fly",
		"aired": "2011-08-22T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 636,
		"ratingFiveStars": 76.8,
		"ratingAllStars": 92.4,
		"nbOfVotes": 99,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=319451&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.8, "nbOfVotes": 76 },
			{ "star": 4, "rating": 14.1, "nbOfVotes": 14 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3, "nbOfVotes": 3 }
		],
		"title": "The General From the Future Land",
		"aired": "2011-08-29T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 637,
		"ratingFiveStars": 67.1,
		"ratingAllStars": 90.4,
		"nbOfVotes": 73,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=321545&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.1, "nbOfVotes": 49 },
			{ "star": 4, "rating": 20.5, "nbOfVotes": 15 },
			{ "star": 3, "rating": 9.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 2.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Ancient Ark",
		"aired": "2011-09-05T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 638,
		"ratingFiveStars": 57.1,
		"ratingAllStars": 87.2,
		"nbOfVotes": 70,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=323969&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.1, "nbOfVotes": 40 },
			{ "star": 4, "rating": 27.1, "nbOfVotes": 19 },
			{ "star": 3, "rating": 12.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 2 }
		],
		"title": "Runawayhoshi",
		"aired": "2011-09-12T00:00:00+00:00",
		"score": 4.36
	},
	{
		"episodeNb": 639,
		"ratingFiveStars": 64,
		"ratingAllStars": 89.8,
		"nbOfVotes": 75,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=326123&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64, "nbOfVotes": 48 },
			{ "star": 4, "rating": 25.3, "nbOfVotes": 19 },
			{ "star": 3, "rating": 8, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 1 }
		],
		"title": "I'll Protect Everything",
		"aired": "2011-09-17T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 640,
		"ratingFiveStars": 50,
		"ratingAllStars": 83.8,
		"nbOfVotes": 68,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=329503&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50, "nbOfVotes": 34 },
			{ "star": 4, "rating": 25, "nbOfVotes": 17 },
			{ "star": 3, "rating": 20.6, "nbOfVotes": 14 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 1 }
		],
		"title": "Right Above Fishman Island",
		"aired": "2011-09-26T00:00:00+00:00",
		"score": 4.1899999999999995
	},
	{
		"episodeNb": 641,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 90.8,
		"nbOfVotes": 24,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1695471&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 16 },
			{ "star": 4, "rating": 20.8, "nbOfVotes": 5 },
			{ "star": 3, "rating": 12.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "What Are You?",
		"aired": "2011-10-08T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 642,
		"ratingFiveStars": 56.8,
		"ratingAllStars": 87,
		"nbOfVotes": 74,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=351895&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.8, "nbOfVotes": 42 },
			{ "star": 4, "rating": 25.7, "nbOfVotes": 19 },
			{ "star": 3, "rating": 13.5, "nbOfVotes": 10 },
			{ "star": 2, "rating": 4.1, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Complete Loss of Face",
		"aired": "2011-10-17T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 643,
		"ratingFiveStars": 62.8,
		"ratingAllStars": 88,
		"nbOfVotes": 78,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=355097&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.8, "nbOfVotes": 49 },
			{ "star": 4, "rating": 19.2, "nbOfVotes": 15 },
			{ "star": 3, "rating": 14.1, "nbOfVotes": 11 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 1 }
		],
		"title": "Phantom",
		"aired": "2011-10-24T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 644,
		"ratingFiveStars": 69.8,
		"ratingAllStars": 90.6,
		"nbOfVotes": 96,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=358865&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.8, "nbOfVotes": 67 },
			{ "star": 4, "rating": 17.7, "nbOfVotes": 17 },
			{ "star": 3, "rating": 9.4, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "To Zero",
		"aired": "2011-10-31T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 645,
		"ratingFiveStars": 69.9,
		"ratingAllStars": 91.6,
		"nbOfVotes": 93,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=361027&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.9, "nbOfVotes": 65 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 21 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Death is Also Revenge",
		"aired": "2011-11-07T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 646,
		"ratingFiveStars": 70.6,
		"ratingAllStars": 91,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=366009&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.6, "nbOfVotes": 72 },
			{ "star": 4, "rating": 18.6, "nbOfVotes": 19 },
			{ "star": 3, "rating": 7.8, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2, "nbOfVotes": 2 }
		],
		"title": "Frog",
		"aired": "2011-11-21T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 647,
		"ratingFiveStars": 54.8,
		"ratingAllStars": 85.8,
		"nbOfVotes": 84,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=368159&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.8, "nbOfVotes": 46 },
			{ "star": 4, "rating": 25, "nbOfVotes": 21 },
			{ "star": 3, "rating": 16.7, "nbOfVotes": 14 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 2 }
		],
		"title": "Stop, Noah!",
		"aired": "2011-11-28T00:00:00+00:00",
		"score": 4.29
	},
	{
		"episodeNb": 648,
		"ratingFiveStars": 83.8,
		"ratingAllStars": 95,
		"nbOfVotes": 136,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=370431&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.8, "nbOfVotes": 114 },
			{ "star": 4, "rating": 10.3, "nbOfVotes": 14 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 2 }
		],
		"title": "The Path Towards the Sun",
		"aired": "2011-12-05T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 649,
		"ratingFiveStars": 79.6,
		"ratingAllStars": 94.8,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=372619&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.6, "nbOfVotes": 86 },
			{ "star": 4, "rating": 15.7, "nbOfVotes": 17 },
			{ "star": 3, "rating": 3.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Dance of Sea Breams and Flounders",
		"aired": "2011-12-12T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 650,
		"ratingFiveStars": 84.2,
		"ratingAllStars": 95.4,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=375139&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.2, "nbOfVotes": 112 },
			{ "star": 4, "rating": 10.5, "nbOfVotes": 14 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Two Changes You Need to Know",
		"aired": "2011-12-19T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 651,
		"ratingFiveStars": 88.6,
		"ratingAllStars": 97.2,
		"nbOfVotes": 175,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=380779&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.6, "nbOfVotes": 155 },
			{ "star": 4, "rating": 9.7, "nbOfVotes": 17 },
			{ "star": 3, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "The Voice From the New World",
		"aired": "2012-01-04T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 652,
		"ratingFiveStars": 74.5,
		"ratingAllStars": 93.4,
		"nbOfVotes": 106,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=387733&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.5, "nbOfVotes": 79 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 19 },
			{ "star": 3, "rating": 7.5, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Grim Premonitions",
		"aired": "2012-01-16T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 653,
		"ratingFiveStars": 67.9,
		"ratingAllStars": 90,
		"nbOfVotes": 109,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=390911&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.9, "nbOfVotes": 74 },
			{ "star": 4, "rating": 17.4, "nbOfVotes": 19 },
			{ "star": 3, "rating": 12.8, "nbOfVotes": 14 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "The Hero's Hat",
		"aired": "2012-01-23T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 654,
		"ratingFiveStars": 74.1,
		"ratingAllStars": 93.4,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=393873&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.1, "nbOfVotes": 83 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 22 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gam",
		"aired": "2012-01-30T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 655,
		"ratingFiveStars": 81.5,
		"ratingAllStars": 94.8,
		"nbOfVotes": 130,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=397325&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.5, "nbOfVotes": 106 },
			{ "star": 4, "rating": 13.1, "nbOfVotes": 17 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Punk Hazard",
		"aired": "2012-02-06T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 656,
		"ratingFiveStars": 69.9,
		"ratingAllStars": 93.4,
		"nbOfVotes": 113,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=400067&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.9, "nbOfVotes": 79 },
			{ "star": 4, "rating": 27.4, "nbOfVotes": 31 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure on the Burning Island",
		"aired": "2012-02-13T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 657,
		"ratingFiveStars": 68.1,
		"ratingAllStars": 92,
		"nbOfVotes": 91,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=403259&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.1, "nbOfVotes": 62 },
			{ "star": 4, "rating": 25.3, "nbOfVotes": 23 },
			{ "star": 3, "rating": 5.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Severed Head",
		"aired": "2012-02-20T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 658,
		"ratingFiveStars": 74.5,
		"ratingAllStars": 93.2,
		"nbOfVotes": 98,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=408735&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.5, "nbOfVotes": 73 },
			{ "star": 4, "rating": 20.4, "nbOfVotes": 20 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Biscuits Room",
		"aired": "2012-03-05T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 659,
		"ratingFiveStars": 80.3,
		"ratingAllStars": 94.8,
		"nbOfVotes": 137,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=411341&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.3, "nbOfVotes": 110 },
			{ "star": 4, "rating": 15.3, "nbOfVotes": 21 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "About My Torso",
		"aired": "2012-03-12T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 660,
		"ratingFiveStars": 82,
		"ratingAllStars": 96,
		"nbOfVotes": 128,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=413629&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82, "nbOfVotes": 105 },
			{ "star": 4, "rating": 15.6, "nbOfVotes": 20 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Royal Shichibukai Trafalgar Law",
		"aired": "2012-03-19T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 661,
		"ratingFiveStars": 76.1,
		"ratingAllStars": 93.2,
		"nbOfVotes": 113,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=416199&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.1, "nbOfVotes": 86 },
			{ "star": 4, "rating": 18.6, "nbOfVotes": 21 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "The Lake of Bandits",
		"aired": "2012-03-26T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 662,
		"ratingFiveStars": 77.9,
		"ratingAllStars": 94,
		"nbOfVotes": 145,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=419179&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.9, "nbOfVotes": 113 },
			{ "star": 4, "rating": 16.6, "nbOfVotes": 24 },
			{ "star": 3, "rating": 4.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Shichibukai Law vs. Vice Admiral Smoker",
		"aired": "2012-04-02T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 663,
		"ratingFiveStars": 75.9,
		"ratingAllStars": 94,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=425367&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.9, "nbOfVotes": 85 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 22 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "CC",
		"aired": "2012-04-16T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 664,
		"ratingFiveStars": 77.6,
		"ratingAllStars": 94.4,
		"nbOfVotes": 98,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=428803&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.6, "nbOfVotes": 76 },
			{ "star": 4, "rating": 18.4, "nbOfVotes": 18 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Master Caesar Clown",
		"aired": "2012-04-23T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 665,
		"ratingFiveStars": 67,
		"ratingAllStars": 92.4,
		"nbOfVotes": 103,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=434441&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67, "nbOfVotes": 69 },
			{ "star": 4, "rating": 28.2, "nbOfVotes": 29 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Candy",
		"aired": "2012-05-07T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 666,
		"ratingFiveStars": 61.7,
		"ratingAllStars": 88,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=439489&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.7, "nbOfVotes": 71 },
			{ "star": 4, "rating": 21.7, "nbOfVotes": 25 },
			{ "star": 3, "rating": 13, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "Yeti Cool Brothers",
		"aired": "2012-05-14T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 667,
		"ratingFiveStars": 84,
		"ratingAllStars": 95.2,
		"nbOfVotes": 156,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=442271&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84, "nbOfVotes": 131 },
			{ "star": 4, "rating": 10.9, "nbOfVotes": 17 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 2 }
		],
		"title": "Cool Fight",
		"aired": "2012-05-21T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 668,
		"ratingFiveStars": 85.8,
		"ratingAllStars": 96,
		"nbOfVotes": 148,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=444581&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.8, "nbOfVotes": 127 },
			{ "star": 4, "rating": 10.8, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Pirate Alliance",
		"aired": "2012-05-28T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 669,
		"ratingFiveStars": 72.7,
		"ratingAllStars": 93,
		"nbOfVotes": 99,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=447055&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.7, "nbOfVotes": 72 },
			{ "star": 4, "rating": 20.2, "nbOfVotes": 20 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Operation Begins",
		"aired": "2012-06-04T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 670,
		"ratingFiveStars": 70.5,
		"ratingAllStars": 90.6,
		"nbOfVotes": 105,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=449487&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.5, "nbOfVotes": 74 },
			{ "star": 4, "rating": 16.2, "nbOfVotes": 17 },
			{ "star": 3, "rating": 10.5, "nbOfVotes": 11 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Blizzard With a Chance of Slime",
		"aired": "2012-06-11T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 671,
		"ratingFiveStars": 81.5,
		"ratingAllStars": 95.6,
		"nbOfVotes": 124,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=452025&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.5, "nbOfVotes": 101 },
			{ "star": 4, "rating": 15.3, "nbOfVotes": 19 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gasu Gasu no Mi",
		"aired": "2012-06-18T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 672,
		"ratingFiveStars": 74.1,
		"ratingAllStars": 92.6,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=456911&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.1, "nbOfVotes": 83 },
			{ "star": 4, "rating": 16.1, "nbOfVotes": 18 },
			{ "star": 3, "rating": 8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "My Name Is Kin'emon!!",
		"aired": "2012-07-02T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 673,
		"ratingFiveStars": 82,
		"ratingAllStars": 94.8,
		"nbOfVotes": 128,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=459519&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82, "nbOfVotes": 105 },
			{ "star": 4, "rating": 12.5, "nbOfVotes": 16 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Vergo and Joker",
		"aired": "2012-07-09T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 674,
		"ratingFiveStars": 62.1,
		"ratingAllStars": 88.2,
		"nbOfVotes": 103,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=461985&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.1, "nbOfVotes": 64 },
			{ "star": 4, "rating": 24.3, "nbOfVotes": 25 },
			{ "star": 3, "rating": 8.7, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 3 }
		],
		"title": "Spectators",
		"aired": "2012-07-14T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 675,
		"ratingFiveStars": 48.8,
		"ratingAllStars": 83.8,
		"nbOfVotes": 84,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=468109&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 48.8, "nbOfVotes": 41 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 28 },
			{ "star": 3, "rating": 10.7, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 4.8, "nbOfVotes": 4 }
		],
		"title": "Its Name is 'Shinokuni'",
		"aired": "2012-07-30T00:00:00+00:00",
		"score": 4.1899999999999995
	},
	{
		"episodeNb": 676,
		"ratingFiveStars": 63.5,
		"ratingAllStars": 89.2,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=471241&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.5, "nbOfVotes": 73 },
			{ "star": 4, "rating": 23.5, "nbOfVotes": 27 },
			{ "star": 3, "rating": 9.6, "nbOfVotes": 11 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "The Perfected Weapon of Mass Destruction",
		"aired": "2012-08-06T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 677,
		"ratingFiveStars": 81.2,
		"ratingAllStars": 94.4,
		"nbOfVotes": 117,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=476057&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.2, "nbOfVotes": 95 },
			{ "star": 4, "rating": 12.8, "nbOfVotes": 15 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Counter Hazard!!",
		"aired": "2012-08-20T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 678,
		"ratingFiveStars": 62.7,
		"ratingAllStars": 89.2,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=480729&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.7, "nbOfVotes": 64 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 27 },
			{ "star": 3, "rating": 7.8, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 3 }
		],
		"title": "The Lobby of Laboratory Building A",
		"aired": "2012-08-27T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 679,
		"ratingFiveStars": 58.3,
		"ratingAllStars": 89.6,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=484019&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.3, "nbOfVotes": 63 },
			{ "star": 4, "rating": 31.5, "nbOfVotes": 34 },
			{ "star": 3, "rating": 10.2, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Spirit of G-5",
		"aired": "2012-09-03T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 680,
		"ratingFiveStars": 76.6,
		"ratingAllStars": 92.6,
		"nbOfVotes": 128,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=487205&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.6, "nbOfVotes": 98 },
			{ "star": 4, "rating": 14.8, "nbOfVotes": 19 },
			{ "star": 3, "rating": 4.7, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Marine G-5 Base Leader: Demon Bamboo Vergo",
		"aired": "2012-09-10T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 681,
		"ratingFiveStars": 79.3,
		"ratingAllStars": 93.8,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=489769&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.3, "nbOfVotes": 92 },
			{ "star": 4, "rating": 12.9, "nbOfVotes": 15 },
			{ "star": 3, "rating": 6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Luffy vs. Master",
		"aired": "2012-09-15T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 682,
		"ratingFiveStars": 76.3,
		"ratingAllStars": 93.4,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=493583&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.3, "nbOfVotes": 87 },
			{ "star": 4, "rating": 16.7, "nbOfVotes": 19 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Mastermind",
		"aired": "2012-09-24T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 683,
		"ratingFiveStars": 66.3,
		"ratingAllStars": 91,
		"nbOfVotes": 92,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=499249&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.3, "nbOfVotes": 61 },
			{ "star": 4, "rating": 23.9, "nbOfVotes": 22 },
			{ "star": 3, "rating": 8.7, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "An Icy Woman",
		"aired": "2012-10-06T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 684,
		"ratingFiveStars": 59.6,
		"ratingAllStars": 88.4,
		"nbOfVotes": 99,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=502639&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.6, "nbOfVotes": 59 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 26 },
			{ "star": 3, "rating": 11.1, "nbOfVotes": 11 },
			{ "star": 2, "rating": 3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Stop It, Vegapunk",
		"aired": "2012-10-15T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 685,
		"ratingFiveStars": 67,
		"ratingAllStars": 89.6,
		"nbOfVotes": 100,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=505547&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67, "nbOfVotes": 67 },
			{ "star": 4, "rating": 21, "nbOfVotes": 21 },
			{ "star": 3, "rating": 7, "nbOfVotes": 7 },
			{ "star": 2, "rating": 3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 2, "nbOfVotes": 2 }
		],
		"title": "My Name is Momonosuke!!",
		"aired": "2012-10-22T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 686,
		"ratingFiveStars": 71.3,
		"ratingAllStars": 90.6,
		"nbOfVotes": 101,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=508459&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.3, "nbOfVotes": 72 },
			{ "star": 4, "rating": 19.8, "nbOfVotes": 20 },
			{ "star": 3, "rating": 4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 4, "nbOfVotes": 4 }
		],
		"title": "The Snow Woman in the Biscuits Room",
		"aired": "2012-10-29T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 687,
		"ratingFiveStars": 84.2,
		"ratingAllStars": 94.2,
		"nbOfVotes": 158,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=511107&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.2, "nbOfVotes": 133 },
			{ "star": 4, "rating": 8.9, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3.2, "nbOfVotes": 5 }
		],
		"title": "Wild Animal",
		"aired": "2012-11-05T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 688,
		"ratingFiveStars": 59,
		"ratingAllStars": 84.2,
		"nbOfVotes": 100,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=514971&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59, "nbOfVotes": 59 },
			{ "star": 4, "rating": 18, "nbOfVotes": 18 },
			{ "star": 3, "rating": 13, "nbOfVotes": 13 },
			{ "star": 2, "rating": 5, "nbOfVotes": 5 },
			{ "star": 1, "rating": 5, "nbOfVotes": 5 }
		],
		"title": "Mocha",
		"aired": "2012-11-12T00:00:00+00:00",
		"score": 4.21
	},
	{
		"episodeNb": 689,
		"ratingFiveStars": 81.2,
		"ratingAllStars": 94.2,
		"nbOfVotes": 117,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=521043&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.2, "nbOfVotes": 95 },
			{ "star": 4, "rating": 11.1, "nbOfVotes": 13 },
			{ "star": 3, "rating": 6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "A Seemingly Non-Existent Island",
		"aired": "2012-11-26T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 690,
		"ratingFiveStars": 89.2,
		"ratingAllStars": 96.6,
		"nbOfVotes": 167,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=524305&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.2, "nbOfVotes": 149 },
			{ "star": 4, "rating": 7.2, "nbOfVotes": 12 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 2 }
		],
		"title": "SAD",
		"aired": "2012-12-03T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 691,
		"ratingFiveStars": 66.3,
		"ratingAllStars": 89.2,
		"nbOfVotes": 95,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=527666&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.3, "nbOfVotes": 63 },
			{ "star": 4, "rating": 21.1, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 3.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 2 }
		],
		"title": "The King of the Land of Death",
		"aired": "2012-12-10T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 692,
		"ratingFiveStars": 77.4,
		"ratingAllStars": 93.4,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=530992&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.4, "nbOfVotes": 89 },
			{ "star": 4, "rating": 14.8, "nbOfVotes": 17 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "The Assassins from Dressrosa",
		"aired": "2012-12-17T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 693,
		"ratingFiveStars": 69.4,
		"ratingAllStars": 90.6,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=533654&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.4, "nbOfVotes": 75 },
			{ "star": 4, "rating": 20.4, "nbOfVotes": 22 },
			{ "star": 3, "rating": 6.5, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.8, "nbOfVotes": 3 }
		],
		"title": "Die for Me",
		"aired": "2012-12-22T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 694,
		"ratingFiveStars": 73.8,
		"ratingAllStars": 91.6,
		"nbOfVotes": 126,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=537362&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.8, "nbOfVotes": 93 },
			{ "star": 4, "rating": 17.5, "nbOfVotes": 22 },
			{ "star": 3, "rating": 4.8, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.2, "nbOfVotes": 4 }
		],
		"title": "The Most Dangerous Man",
		"aired": "2013-01-04T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 695,
		"ratingFiveStars": 73.7,
		"ratingAllStars": 92.2,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=546649&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.7, "nbOfVotes": 84 },
			{ "star": 4, "rating": 19.3, "nbOfVotes": 22 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 3 }
		],
		"title": "Leave It to Me!!!",
		"aired": "2013-01-21T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 696,
		"ratingFiveStars": 63.6,
		"ratingAllStars": 89.6,
		"nbOfVotes": 121,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=549569&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.6, "nbOfVotes": 77 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 31 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "Community of Interests",
		"aired": "2013-01-28T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 697,
		"ratingFiveStars": 81.7,
		"ratingAllStars": 93.8,
		"nbOfVotes": 131,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=552437&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.7, "nbOfVotes": 107 },
			{ "star": 4, "rating": 11.5, "nbOfVotes": 15 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 3 }
		],
		"title": "Deal",
		"aired": "2013-02-04T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 698,
		"ratingFiveStars": 88.2,
		"ratingAllStars": 95.6,
		"nbOfVotes": 170,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=555265&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.2, "nbOfVotes": 150 },
			{ "star": 4, "rating": 5.9, "nbOfVotes": 10 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 3 }
		],
		"title": "Doflamingo Appears",
		"aired": "2013-02-09T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 699,
		"ratingFiveStars": 82,
		"ratingAllStars": 94.2,
		"nbOfVotes": 161,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=561245&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82, "nbOfVotes": 132 },
			{ "star": 4, "rating": 9.9, "nbOfVotes": 16 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Morning Paper",
		"aired": "2013-02-25T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 700,
		"ratingFiveStars": 75.6,
		"ratingAllStars": 91.8,
		"nbOfVotes": 279,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=564069&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.6, "nbOfVotes": 211 },
			{ "star": 4, "rating": 15.8, "nbOfVotes": 44 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 11 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 3.2, "nbOfVotes": 9 }
		],
		"title": "His Own Pace",
		"aired": "2013-03-04T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 701,
		"ratingFiveStars": 68.6,
		"ratingAllStars": 89,
		"nbOfVotes": 156,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=567181&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.6, "nbOfVotes": 107 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 28 },
			{ "star": 3, "rating": 7.7, "nbOfVotes": 12 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 4.5, "nbOfVotes": 7 }
		],
		"title": "Adventure in the Country of Love, Passion, and Toys",
		"aired": "2013-03-11T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 702,
		"ratingFiveStars": 65.2,
		"ratingAllStars": 89.8,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=572703&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.2, "nbOfVotes": 75 },
			{ "star": 4, "rating": 23.5, "nbOfVotes": 27 },
			{ "star": 3, "rating": 7.8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "Corrida Colosseum",
		"aired": "2013-03-25T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 703,
		"ratingFiveStars": 78.9,
		"ratingAllStars": 93.4,
		"nbOfVotes": 147,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=576477&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.9, "nbOfVotes": 116 },
			{ "star": 4, "rating": 12.2, "nbOfVotes": 18 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 2 }
		],
		"title": "Waiting Room",
		"aired": "2013-04-01T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 704,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 93.2,
		"nbOfVotes": 158,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=580203&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 123 },
			{ "star": 4, "rating": 13.9, "nbOfVotes": 22 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 8 },
			{ "star": 2, "rating": 2.5, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Lucy and the Statue of Kyros",
		"aired": "2013-04-08T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 705,
		"ratingFiveStars": 72.6,
		"ratingAllStars": 92.8,
		"nbOfVotes": 135,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=583905&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.6, "nbOfVotes": 98 },
			{ "star": 4, "rating": 20.7, "nbOfVotes": 28 },
			{ "star": 3, "rating": 5.2, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Maynard the Pursuer",
		"aired": "2013-04-15T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 706,
		"ratingFiveStars": 61.2,
		"ratingAllStars": 89,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=587357&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.2, "nbOfVotes": 71 },
			{ "star": 4, "rating": 24.1, "nbOfVotes": 28 },
			{ "star": 3, "rating": 12.9, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I Won't Laugh at You",
		"aired": "2013-04-22T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 707,
		"ratingFiveStars": 67.5,
		"ratingAllStars": 91.6,
		"nbOfVotes": 120,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=590065&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.5, "nbOfVotes": 81 },
			{ "star": 4, "rating": 25, "nbOfVotes": 30 },
			{ "star": 3, "rating": 5.8, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "B Block",
		"aired": "2013-04-27T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 708,
		"ratingFiveStars": 69.7,
		"ratingAllStars": 92,
		"nbOfVotes": 122,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=597399&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.7, "nbOfVotes": 85 },
			{ "star": 4, "rating": 21.3, "nbOfVotes": 26 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Colosseum of Rascals",
		"aired": "2013-05-13T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 709,
		"ratingFiveStars": 75.6,
		"ratingAllStars": 93,
		"nbOfVotes": 119,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=600483&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.6, "nbOfVotes": 90 },
			{ "star": 4, "rating": 16.8, "nbOfVotes": 20 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "King Punch!!",
		"aired": "2013-05-20T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 710,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 90,
		"nbOfVotes": 104,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=610623&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 65 },
			{ "star": 4, "rating": 26.9, "nbOfVotes": 28 },
			{ "star": 3, "rating": 9.6, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "To Green Bit",
		"aired": "2013-06-10T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 711,
		"ratingFiveStars": 73,
		"ratingAllStars": 92.8,
		"nbOfVotes": 141,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=614103&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73, "nbOfVotes": 103 },
			{ "star": 4, "rating": 19.9, "nbOfVotes": 28 },
			{ "star": 3, "rating": 5.7, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Adventure in the Land of Dwarves",
		"aired": "2013-06-17T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 712,
		"ratingFiveStars": 83.8,
		"ratingAllStars": 94.8,
		"nbOfVotes": 148,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=621393&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.8, "nbOfVotes": 124 },
			{ "star": 4, "rating": 10.8, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2, "nbOfVotes": 3 }
		],
		"title": "Violet",
		"aired": "2013-07-01T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 713,
		"ratingFiveStars": 86.2,
		"ratingAllStars": 96.8,
		"nbOfVotes": 152,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=625225&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.2, "nbOfVotes": 131 },
			{ "star": 4, "rating": 11.8, "nbOfVotes": 18 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Usoland",
		"aired": "2013-07-08T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 714,
		"ratingFiveStars": 69,
		"ratingAllStars": 91.4,
		"nbOfVotes": 142,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=628503&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69, "nbOfVotes": 98 },
			{ "star": 4, "rating": 22.5, "nbOfVotes": 32 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 2 }
		],
		"title": "Lucy and Ucy",
		"aired": "2013-07-13T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 715,
		"ratingFiveStars": 55.5,
		"ratingAllStars": 85,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=628799&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.5, "nbOfVotes": 61 },
			{ "star": 4, "rating": 23.6, "nbOfVotes": 26 },
			{ "star": 3, "rating": 13.6, "nbOfVotes": 15 },
			{ "star": 2, "rating": 4.5, "nbOfVotes": 5 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 3 }
		],
		"title": "Closely Contested C Block",
		"aired": "2013-07-22T00:00:00+00:00",
		"score": 4.25
	},
	{
		"episodeNb": 716,
		"ratingFiveStars": 75.2,
		"ratingAllStars": 92.8,
		"nbOfVotes": 129,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=640281&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.2, "nbOfVotes": 97 },
			{ "star": 4, "rating": 17.1, "nbOfVotes": 22 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Don Chinjao",
		"aired": "2013-08-05T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 717,
		"ratingFiveStars": 73,
		"ratingAllStars": 93.4,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=644065&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73, "nbOfVotes": 84 },
			{ "star": 4, "rating": 20.9, "nbOfVotes": 24 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Forgotten of Dressrosa",
		"aired": "2013-08-12T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 718,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 90.8,
		"nbOfVotes": 98,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=650081&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 66 },
			{ "star": 4, "rating": 23.5, "nbOfVotes": 23 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 5 },
			{ "star": 2, "rating": 4.1, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Riku Royal Army in the Flower Fields",
		"aired": "2013-08-26T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 719,
		"ratingFiveStars": 79.7,
		"ratingAllStars": 93.4,
		"nbOfVotes": 138,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=655425&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.7, "nbOfVotes": 110 },
			{ "star": 4, "rating": 14.5, "nbOfVotes": 20 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3.6, "nbOfVotes": 5 }
		],
		"title": "Open Chinjao",
		"aired": "2013-09-02T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 720,
		"ratingFiveStars": 83,
		"ratingAllStars": 95.2,
		"nbOfVotes": 106,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=658657&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83, "nbOfVotes": 88 },
			{ "star": 4, "rating": 12.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Prisoner Gladiators",
		"aired": "2013-09-09T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 721,
		"ratingFiveStars": 54.4,
		"ratingAllStars": 84.8,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=660877&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 54.4, "nbOfVotes": 62 },
			{ "star": 4, "rating": 24.6, "nbOfVotes": 28 },
			{ "star": 3, "rating": 14.9, "nbOfVotes": 17 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 3.5, "nbOfVotes": 4 }
		],
		"title": "Rebecca and Soldier-san",
		"aired": "2013-09-14T00:00:00+00:00",
		"score": 4.24
	},
	{
		"episodeNb": 722,
		"ratingFiveStars": 68.2,
		"ratingAllStars": 90.8,
		"nbOfVotes": 129,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=667525&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.2, "nbOfVotes": 88 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 30 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 3 }
		],
		"title": "Royal Bloodlines",
		"aired": "2013-09-30T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 723,
		"ratingFiveStars": 90.7,
		"ratingAllStars": 97.2,
		"nbOfVotes": 140,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=670759&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.7, "nbOfVotes": 127 },
			{ "star": 4, "rating": 6.4, "nbOfVotes": 9 },
			{ "star": 3, "rating": 1.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Change of Plans",
		"aired": "2013-10-07T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 724,
		"ratingFiveStars": 85.8,
		"ratingAllStars": 96.2,
		"nbOfVotes": 148,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=673505&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.8, "nbOfVotes": 127 },
			{ "star": 4, "rating": 10.8, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Law's Strategy",
		"aired": "2013-10-12T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 725,
		"ratingFiveStars": 62.5,
		"ratingAllStars": 88.4,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=676913&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.5, "nbOfVotes": 70 },
			{ "star": 4, "rating": 23.2, "nbOfVotes": 26 },
			{ "star": 3, "rating": 10.7, "nbOfVotes": 12 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 3 }
		],
		"title": "The Undefeated Woman",
		"aired": "2013-10-21T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 726,
		"ratingFiveStars": 60,
		"ratingAllStars": 86.8,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=682797&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60, "nbOfVotes": 66 },
			{ "star": 4, "rating": 20.9, "nbOfVotes": 23 },
			{ "star": 3, "rating": 13.6, "nbOfVotes": 15 },
			{ "star": 2, "rating": 3.6, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "The Riku Family",
		"aired": "2013-11-02T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 727,
		"ratingFiveStars": 73.6,
		"ratingAllStars": 91.2,
		"nbOfVotes": 121,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=686393&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.6, "nbOfVotes": 89 },
			{ "star": 4, "rating": 15.7, "nbOfVotes": 19 },
			{ "star": 3, "rating": 6.6, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.5, "nbOfVotes": 3 }
		],
		"title": "The Lurking Hero",
		"aired": "2013-11-11T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 728,
		"ratingFiveStars": 67,
		"ratingAllStars": 90.4,
		"nbOfVotes": 100,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=689751&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67, "nbOfVotes": 67 },
			{ "star": 4, "rating": 24, "nbOfVotes": 24 },
			{ "star": 3, "rating": 4, "nbOfVotes": 4 },
			{ "star": 2, "rating": 4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "The Number of Tragedies",
		"aired": "2013-11-18T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 729,
		"ratingFiveStars": 85.8,
		"ratingAllStars": 95.4,
		"nbOfVotes": 197,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=692987&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.8, "nbOfVotes": 169 },
			{ "star": 4, "rating": 10.2, "nbOfVotes": 20 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.5, "nbOfVotes": 5 }
		],
		"title": "Shichibukai Doflamingo vs. Shichibukai Law",
		"aired": "2013-11-25T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 730,
		"ratingFiveStars": 91.8,
		"ratingAllStars": 97,
		"nbOfVotes": 269,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=699615&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 91.8, "nbOfVotes": 247 },
			{ "star": 4, "rating": 4.8, "nbOfVotes": 13 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 4 }
		],
		"title": "3 Cards",
		"aired": "2013-12-09T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 731,
		"ratingFiveStars": 94.2,
		"ratingAllStars": 97.2,
		"nbOfVotes": 538,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=703039&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 94.2, "nbOfVotes": 507 },
			{ "star": 4, "rating": 2.4, "nbOfVotes": 13 },
			{ "star": 3, "rating": 0.7, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 10 }
		],
		"title": "Operation Dressrosa SOP",
		"aired": "2013-12-16T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 732,
		"ratingFiveStars": 49.3,
		"ratingAllStars": 82.2,
		"nbOfVotes": 148,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=707447&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.3, "nbOfVotes": 73 },
			{ "star": 4, "rating": 23, "nbOfVotes": 34 },
			{ "star": 3, "rating": 20.9, "nbOfVotes": 31 },
			{ "star": 2, "rating": 3.4, "nbOfVotes": 5 },
			{ "star": 1, "rating": 3.4, "nbOfVotes": 5 }
		],
		"title": "The Underground World",
		"aired": "2013-12-21T00:00:00+00:00",
		"score": 4.11
	},
	{
		"episodeNb": 733,
		"ratingFiveStars": 61.4,
		"ratingAllStars": 88.2,
		"nbOfVotes": 140,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=712453&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.4, "nbOfVotes": 86 },
			{ "star": 4, "rating": 25.7, "nbOfVotes": 36 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 12 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 4 }
		],
		"title": "What Soldier-san Wants",
		"aired": "2014-01-04T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 734,
		"ratingFiveStars": 63.2,
		"ratingAllStars": 90.2,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=730241&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.2, "nbOfVotes": 84 },
			{ "star": 4, "rating": 27.1, "nbOfVotes": 36 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "The Kamaitachi of Rommel",
		"aired": "2014-01-20T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 735,
		"ratingFiveStars": 70.8,
		"ratingAllStars": 92.2,
		"nbOfVotes": 161,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=737797&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.8, "nbOfVotes": 114 },
			{ "star": 4, "rating": 22.4, "nbOfVotes": 36 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Fujitora's Intention",
		"aired": "2014-01-27T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 736,
		"ratingFiveStars": 66.9,
		"ratingAllStars": 90.8,
		"nbOfVotes": 130,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=757755&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.9, "nbOfVotes": 87 },
			{ "star": 4, "rating": 23.8, "nbOfVotes": 31 },
			{ "star": 3, "rating": 6.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 2 }
		],
		"title": "Executive Officer Diamante",
		"aired": "2014-02-03T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 737,
		"ratingFiveStars": 69.1,
		"ratingAllStars": 91.4,
		"nbOfVotes": 139,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=848029&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.1, "nbOfVotes": 96 },
			{ "star": 4, "rating": 20.9, "nbOfVotes": 29 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 12 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Officer Tower",
		"aired": "2014-02-10T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 738,
		"ratingFiveStars": 47,
		"ratingAllStars": 83,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1045133&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 47, "nbOfVotes": 54 },
			{ "star": 4, "rating": 28.7, "nbOfVotes": 33 },
			{ "star": 3, "rating": 17.4, "nbOfVotes": 20 },
			{ "star": 2, "rating": 6.1, "nbOfVotes": 7 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Trebol Army Special Officer Sugar",
		"aired": "2014-02-24T00:00:00+00:00",
		"score": 4.15
	},
	{
		"episodeNb": 739,
		"ratingFiveStars": 71.7,
		"ratingAllStars": 90,
		"nbOfVotes": 113,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1080919&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.7, "nbOfVotes": 81 },
			{ "star": 4, "rating": 13.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 10.6, "nbOfVotes": 12 },
			{ "star": 2, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "Commander",
		"aired": "2014-03-03T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 740,
		"ratingFiveStars": 60.3,
		"ratingAllStars": 87,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1091997&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.3, "nbOfVotes": 70 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 27 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 12 },
			{ "star": 2, "rating": 3.4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 3 }
		],
		"title": "It's Up to You!!!",
		"aired": "2014-03-10T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 741,
		"ratingFiveStars": 55.6,
		"ratingAllStars": 86.8,
		"nbOfVotes": 117,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1106337&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.6, "nbOfVotes": 65 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 30 },
			{ "star": 3, "rating": 17.1, "nbOfVotes": 20 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Liar Usoland",
		"aired": "2014-03-17T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 742,
		"ratingFiveStars": 80,
		"ratingAllStars": 92.6,
		"nbOfVotes": 205,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1121679&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 164 },
			{ "star": 4, "rating": 10.2, "nbOfVotes": 21 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 11 },
			{ "star": 2, "rating": 2, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 5 }
		],
		"title": "I'll Always Be By Your Side",
		"aired": "2014-03-31T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 743,
		"ratingFiveStars": 85.2,
		"ratingAllStars": 95.2,
		"nbOfVotes": 223,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1132929&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.2, "nbOfVotes": 190 },
			{ "star": 4, "rating": 9, "nbOfVotes": 20 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 2 }
		],
		"title": "Dressrosa in Turmoil",
		"aired": "2014-04-07T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 744,
		"ratingFiveStars": 92,
		"ratingAllStars": 97.2,
		"nbOfVotes": 263,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1140589&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 92, "nbOfVotes": 242 },
			{ "star": 4, "rating": 4.9, "nbOfVotes": 13 },
			{ "star": 3, "rating": 1.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 4 }
		],
		"title": "The Revolutionary Army Chief of Staff",
		"aired": "2014-04-14T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 745,
		"ratingFiveStars": 83.5,
		"ratingAllStars": 95,
		"nbOfVotes": 188,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1154621&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.5, "nbOfVotes": 157 },
			{ "star": 4, "rating": 11.7, "nbOfVotes": 22 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 3 }
		],
		"title": "Birdcage",
		"aired": "2014-04-28T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 746,
		"ratingFiveStars": 83.1,
		"ratingAllStars": 95.4,
		"nbOfVotes": 201,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1167543&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.1, "nbOfVotes": 167 },
			{ "star": 4, "rating": 12.9, "nbOfVotes": 26 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 2 }
		],
		"title": "Stars",
		"aired": "2014-05-12T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 747,
		"ratingFiveStars": 67.7,
		"ratingAllStars": 90.8,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1174801&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.7, "nbOfVotes": 90 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 31 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 3 }
		],
		"title": "Executive Officer Pica",
		"aired": "2014-05-19T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 748,
		"ratingFiveStars": 72.8,
		"ratingAllStars": 90.8,
		"nbOfVotes": 136,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1181853&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.8, "nbOfVotes": 99 },
			{ "star": 4, "rating": 17.6, "nbOfVotes": 24 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 4.4, "nbOfVotes": 6 }
		],
		"title": "My Repayment",
		"aired": "2014-05-26T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 749,
		"ratingFiveStars": 74.8,
		"ratingAllStars": 92.2,
		"nbOfVotes": 135,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1188415&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.8, "nbOfVotes": 101 },
			{ "star": 4, "rating": 17, "nbOfVotes": 23 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 2 }
		],
		"title": "March Forward!! Army of Rascals",
		"aired": "2014-06-02T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 750,
		"ratingFiveStars": 65.2,
		"ratingAllStars": 89,
		"nbOfVotes": 135,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1202959&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.2, "nbOfVotes": 88 },
			{ "star": 4, "rating": 20.7, "nbOfVotes": 28 },
			{ "star": 3, "rating": 10.4, "nbOfVotes": 14 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 3 }
		],
		"title": "The State of the War",
		"aired": "2014-06-23T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 751,
		"ratingFiveStars": 78.9,
		"ratingAllStars": 91,
		"nbOfVotes": 123,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1207535&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.9, "nbOfVotes": 97 },
			{ "star": 4, "rating": 6.5, "nbOfVotes": 8 },
			{ "star": 3, "rating": 8.9, "nbOfVotes": 11 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 3 },
			{ "star": 1, "rating": 3.3, "nbOfVotes": 4 }
		],
		"title": "Sabo vs. Admiral Fujitora",
		"aired": "2014-06-30T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 752,
		"ratingFiveStars": 63.7,
		"ratingAllStars": 87,
		"nbOfVotes": 124,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1216205&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.7, "nbOfVotes": 79 },
			{ "star": 4, "rating": 17.7, "nbOfVotes": 22 },
			{ "star": 3, "rating": 12.9, "nbOfVotes": 16 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 4, "nbOfVotes": 5 }
		],
		"title": "Palm",
		"aired": "2014-07-07T00:00:00+00:00",
		"score": 4.35
	},
	{
		"episodeNb": 753,
		"ratingFiveStars": 44.1,
		"ratingAllStars": 78,
		"nbOfVotes": 118,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1226733&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 44.1, "nbOfVotes": 52 },
			{ "star": 4, "rating": 21.2, "nbOfVotes": 25 },
			{ "star": 3, "rating": 20.3, "nbOfVotes": 24 },
			{ "star": 2, "rating": 9.3, "nbOfVotes": 11 },
			{ "star": 1, "rating": 5.1, "nbOfVotes": 6 }
		],
		"title": "War",
		"aired": "2014-07-19T00:00:00+00:00",
		"score": 3.9
	},
	{
		"episodeNb": 754,
		"ratingFiveStars": 66.4,
		"ratingAllStars": 88.2,
		"nbOfVotes": 143,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1231835&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.4, "nbOfVotes": 95 },
			{ "star": 4, "rating": 20.3, "nbOfVotes": 29 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 5.6, "nbOfVotes": 8 }
		],
		"title": "Pleased to Make Your Acquaintance",
		"aired": "2014-07-28T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 755,
		"ratingFiveStars": 49.6,
		"ratingAllStars": 80.4,
		"nbOfVotes": 123,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1236163&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 49.6, "nbOfVotes": 61 },
			{ "star": 4, "rating": 19.5, "nbOfVotes": 24 },
			{ "star": 3, "rating": 17.9, "nbOfVotes": 22 },
			{ "star": 2, "rating": 8.9, "nbOfVotes": 11 },
			{ "star": 1, "rating": 4.1, "nbOfVotes": 5 }
		],
		"title": "World of Men",
		"aired": "2014-08-04T00:00:00+00:00",
		"score": 4.0200000000000005
	},
	{
		"episodeNb": 756,
		"ratingFiveStars": 53.6,
		"ratingAllStars": 85.2,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1243741&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.6, "nbOfVotes": 59 },
			{ "star": 4, "rating": 28.2, "nbOfVotes": 31 },
			{ "star": 3, "rating": 11.8, "nbOfVotes": 13 },
			{ "star": 2, "rating": 3.6, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 3 }
		],
		"title": "The Fourth Level",
		"aired": "2014-08-11T00:00:00+00:00",
		"score": 4.26
	},
	{
		"episodeNb": 757,
		"ratingFiveStars": 71.5,
		"ratingAllStars": 91.2,
		"nbOfVotes": 130,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1254069&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.5, "nbOfVotes": 93 },
			{ "star": 4, "rating": 19.2, "nbOfVotes": 25 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 3 }
		],
		"title": "Trump Card",
		"aired": "2014-08-25T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 758,
		"ratingFiveStars": 88.1,
		"ratingAllStars": 96.6,
		"nbOfVotes": 218,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1259467&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.1, "nbOfVotes": 192 },
			{ "star": 4, "rating": 8.7, "nbOfVotes": 19 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 2 }
		],
		"title": "Leave It and Go Ahead",
		"aired": "2014-09-01T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 759,
		"ratingFiveStars": 85.9,
		"ratingAllStars": 96.4,
		"nbOfVotes": 156,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1264467&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.9, "nbOfVotes": 134 },
			{ "star": 4, "rating": 11.5, "nbOfVotes": 18 },
			{ "star": 3, "rating": 1.9, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Secret Plan",
		"aired": "2014-09-08T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 760,
		"ratingFiveStars": 68,
		"ratingAllStars": 89.6,
		"nbOfVotes": 122,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1268285&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68, "nbOfVotes": 83 },
			{ "star": 4, "rating": 18.9, "nbOfVotes": 23 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 9 },
			{ "star": 2, "rating": 4.1, "nbOfVotes": 5 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "The Same Bet",
		"aired": "2014-09-13T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 761,
		"ratingFiveStars": 69,
		"ratingAllStars": 90.6,
		"nbOfVotes": 100,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1273013&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69, "nbOfVotes": 69 },
			{ "star": 4, "rating": 19, "nbOfVotes": 19 },
			{ "star": 3, "rating": 10, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2, "nbOfVotes": 2 }
		],
		"title": "Ope Ope no Mi",
		"aired": "2014-09-22T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 762,
		"ratingFiveStars": 69.2,
		"ratingAllStars": 86.8,
		"nbOfVotes": 172,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1281677&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.2, "nbOfVotes": 119 },
			{ "star": 4, "rating": 10.5, "nbOfVotes": 18 },
			{ "star": 3, "rating": 11, "nbOfVotes": 19 },
			{ "star": 2, "rating": 3.5, "nbOfVotes": 6 },
			{ "star": 1, "rating": 5.8, "nbOfVotes": 10 }
		],
		"title": "The White City",
		"aired": "2014-10-06T00:00:00+00:00",
		"score": 4.34
	},
	{
		"episodeNb": 763,
		"ratingFiveStars": 89.2,
		"ratingAllStars": 96.4,
		"nbOfVotes": 194,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1285035&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.2, "nbOfVotes": 173 },
			{ "star": 4, "rating": 7.2, "nbOfVotes": 14 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 2 }
		],
		"title": "Humanity Declaration",
		"aired": "2014-10-11T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 764,
		"ratingFiveStars": 77.3,
		"ratingAllStars": 92.4,
		"nbOfVotes": 154,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1289829&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.3, "nbOfVotes": 119 },
			{ "star": 4, "rating": 13.6, "nbOfVotes": 21 },
			{ "star": 3, "rating": 5.8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 4 }
		],
		"title": "White Monster",
		"aired": "2014-10-20T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 765,
		"ratingFiveStars": 77.4,
		"ratingAllStars": 93.2,
		"nbOfVotes": 106,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1294049&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.4, "nbOfVotes": 82 },
			{ "star": 4, "rating": 16, "nbOfVotes": 17 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 2 }
		],
		"title": "The Island of Fate: Minion",
		"aired": "2014-10-27T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 766,
		"ratingFiveStars": 73.7,
		"ratingAllStars": 93.6,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1302975&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.7, "nbOfVotes": 98 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 31 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 2 }
		],
		"title": "Smile",
		"aired": "2014-11-10T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 767,
		"ratingFiveStars": 90.1,
		"ratingAllStars": 96.4,
		"nbOfVotes": 152,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1306919&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.1, "nbOfVotes": 137 },
			{ "star": 4, "rating": 5.9, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2, "nbOfVotes": 3 }
		],
		"title": "Cora-san",
		"aired": "2014-11-17T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 768,
		"ratingFiveStars": 61.9,
		"ratingAllStars": 86.4,
		"nbOfVotes": 97,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1310143&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.9, "nbOfVotes": 60 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 19 },
			{ "star": 3, "rating": 11.3, "nbOfVotes": 11 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 3 },
			{ "star": 1, "rating": 4.1, "nbOfVotes": 4 }
		],
		"title": "The Trigger on That Day",
		"aired": "2014-11-22T00:00:00+00:00",
		"score": 4.32
	},
	{
		"episodeNb": 769,
		"ratingFiveStars": 76.9,
		"ratingAllStars": 92.4,
		"nbOfVotes": 104,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1314115&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.9, "nbOfVotes": 80 },
			{ "star": 4, "rating": 12.5, "nbOfVotes": 13 },
			{ "star": 3, "rating": 7.7, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 2 }
		],
		"title": "Pirate Bellamy",
		"aired": "2014-12-01T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 770,
		"ratingFiveStars": 47.3,
		"ratingAllStars": 81,
		"nbOfVotes": 93,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1322585&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 47.3, "nbOfVotes": 44 },
			{ "star": 4, "rating": 23.7, "nbOfVotes": 22 },
			{ "star": 3, "rating": 20.4, "nbOfVotes": 19 },
			{ "star": 2, "rating": 4.3, "nbOfVotes": 4 },
			{ "star": 1, "rating": 4.3, "nbOfVotes": 4 }
		],
		"title": "The Spear of Elbaf",
		"aired": "2014-12-15T00:00:00+00:00",
		"score": 4.05
	},
	{
		"episodeNb": 771,
		"ratingFiveStars": 57.1,
		"ratingAllStars": 82.6,
		"nbOfVotes": 161,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1326353&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.1, "nbOfVotes": 92 },
			{ "star": 4, "rating": 18, "nbOfVotes": 29 },
			{ "star": 3, "rating": 12.4, "nbOfVotes": 20 },
			{ "star": 2, "rating": 5.6, "nbOfVotes": 9 },
			{ "star": 1, "rating": 6.8, "nbOfVotes": 11 }
		],
		"title": "Happo Navy Don Sai",
		"aired": "2014-12-22T00:00:00+00:00",
		"score": 4.13
	},
	{
		"episodeNb": 772,
		"ratingFiveStars": 65.5,
		"ratingAllStars": 89,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1331193&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.5, "nbOfVotes": 72 },
			{ "star": 4, "rating": 22.7, "nbOfVotes": 25 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.6, "nbOfVotes": 4 }
		],
		"title": "Cabbage & Lomeo",
		"aired": "2015-01-05T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 773,
		"ratingFiveStars": 77.9,
		"ratingAllStars": 93.2,
		"nbOfVotes": 113,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1343701&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.9, "nbOfVotes": 88 },
			{ "star": 4, "rating": 15.9, "nbOfVotes": 18 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 3 }
		],
		"title": "Half & Half",
		"aired": "2015-01-19T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 774,
		"ratingFiveStars": 50.5,
		"ratingAllStars": 81.8,
		"nbOfVotes": 97,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1346815&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50.5, "nbOfVotes": 49 },
			{ "star": 4, "rating": 24.7, "nbOfVotes": 24 },
			{ "star": 3, "rating": 13.4, "nbOfVotes": 13 },
			{ "star": 2, "rating": 6.2, "nbOfVotes": 6 },
			{ "star": 1, "rating": 5.2, "nbOfVotes": 5 }
		],
		"title": "Leo, the Tontatta Troop Leader",
		"aired": "2015-01-26T00:00:00+00:00",
		"score": 4.09
	},
	{
		"episodeNb": 775,
		"ratingFiveStars": 83,
		"ratingAllStars": 94,
		"nbOfVotes": 223,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1348866&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83, "nbOfVotes": 185 },
			{ "star": 4, "rating": 9, "nbOfVotes": 20 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 5 }
		],
		"title": "To Russian, With Love",
		"aired": "2015-02-02T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 776,
		"ratingFiveStars": 59.3,
		"ratingAllStars": 84,
		"nbOfVotes": 118,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1352880&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.3, "nbOfVotes": 70 },
			{ "star": 4, "rating": 19.5, "nbOfVotes": 23 },
			{ "star": 3, "rating": 9.3, "nbOfVotes": 11 },
			{ "star": 2, "rating": 5.9, "nbOfVotes": 7 },
			{ "star": 1, "rating": 5.9, "nbOfVotes": 7 }
		],
		"title": "The Hero of the Colosseum",
		"aired": "2015-02-16T00:00:00+00:00",
		"score": 4.2
	},
	{
		"episodeNb": 777,
		"ratingFiveStars": 59.2,
		"ratingAllStars": 85.2,
		"nbOfVotes": 120,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1354899&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.2, "nbOfVotes": 71 },
			{ "star": 4, "rating": 19.2, "nbOfVotes": 23 },
			{ "star": 3, "rating": 14.2, "nbOfVotes": 17 },
			{ "star": 2, "rating": 3.3, "nbOfVotes": 4 },
			{ "star": 1, "rating": 4.2, "nbOfVotes": 5 }
		],
		"title": "Zoro vs. Pica",
		"aired": "2015-02-23T00:00:00+00:00",
		"score": 4.26
	},
	{
		"episodeNb": 778,
		"ratingFiveStars": 82.6,
		"ratingAllStars": 93.2,
		"nbOfVotes": 167,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1357014&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.6, "nbOfVotes": 138 },
			{ "star": 4, "rating": 8.4, "nbOfVotes": 14 },
			{ "star": 3, "rating": 4.8, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.6, "nbOfVotes": 6 }
		],
		"title": "Tactics No. 5",
		"aired": "2015-03-02T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 779,
		"ratingFiveStars": 73.4,
		"ratingAllStars": 91,
		"nbOfVotes": 139,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1359232&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.4, "nbOfVotes": 102 },
			{ "star": 4, "rating": 13.7, "nbOfVotes": 19 },
			{ "star": 3, "rating": 9.4, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 3 }
		],
		"title": "The Last Fight",
		"aired": "2015-03-09T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 780,
		"ratingFiveStars": 69.6,
		"ratingAllStars": 90.6,
		"nbOfVotes": 148,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1363677&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.6, "nbOfVotes": 103 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 29 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 4 }
		],
		"title": "The Curse of Heart",
		"aired": "2015-03-23T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 781,
		"ratingFiveStars": 75.3,
		"ratingAllStars": 89.4,
		"nbOfVotes": 219,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1366098&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.3, "nbOfVotes": 165 },
			{ "star": 4, "rating": 9.1, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 16 },
			{ "star": 2, "rating": 3.2, "nbOfVotes": 7 },
			{ "star": 1, "rating": 5, "nbOfVotes": 11 }
		],
		"title": "Long-Cherished Desire",
		"aired": "2015-03-30T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 782,
		"ratingFiveStars": 67.7,
		"ratingAllStars": 90.6,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1368860&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.7, "nbOfVotes": 90 },
			{ "star": 4, "rating": 24.1, "nbOfVotes": 32 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3, "nbOfVotes": 4 }
		],
		"title": "The Charisma of Evil",
		"aired": "2015-04-06T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 783,
		"ratingFiveStars": 84.1,
		"ratingAllStars": 93.2,
		"nbOfVotes": 410,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1371484&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.1, "nbOfVotes": 345 },
			{ "star": 4, "rating": 7.6, "nbOfVotes": 31 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 9 },
			{ "star": 1, "rating": 3.9, "nbOfVotes": 16 }
		],
		"title": "In My Way",
		"aired": "2015-04-13T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 784,
		"ratingFiveStars": 88.9,
		"ratingAllStars": 97.8,
		"nbOfVotes": 45,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1729570&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.9, "nbOfVotes": 40 },
			{ "star": 4, "rating": 11.1, "nbOfVotes": 5 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gear Fourth",
		"aired": "2015-04-27T00:00:00+00:00",
		"score": 4.89
	},
	{
		"episodeNb": 785,
		"ratingFiveStars": 75,
		"ratingAllStars": 91.8,
		"nbOfVotes": 172,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1381014&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 129 },
			{ "star": 4, "rating": 15.7, "nbOfVotes": 27 },
			{ "star": 3, "rating": 5.8, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 5 }
		],
		"title": "Even If Your Legs Break",
		"aired": "2015-05-11T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 786,
		"ratingFiveStars": 73.7,
		"ratingAllStars": 91.6,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1383441&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.7, "nbOfVotes": 98 },
			{ "star": 4, "rating": 17.3, "nbOfVotes": 23 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3, "nbOfVotes": 4 }
		],
		"title": "Gatz",
		"aired": "2015-05-18T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 787,
		"ratingFiveStars": 71.9,
		"ratingAllStars": 89.4,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1385750&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.9, "nbOfVotes": 82 },
			{ "star": 4, "rating": 14, "nbOfVotes": 16 },
			{ "star": 3, "rating": 8.8, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 5.3, "nbOfVotes": 6 }
		],
		"title": "4 Minutes Before",
		"aired": "2015-05-25T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 788,
		"ratingFiveStars": 43.5,
		"ratingAllStars": 78.4,
		"nbOfVotes": 131,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1388145&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 43.5, "nbOfVotes": 57 },
			{ "star": 4, "rating": 25.2, "nbOfVotes": 33 },
			{ "star": 3, "rating": 17.6, "nbOfVotes": 23 },
			{ "star": 2, "rating": 7.6, "nbOfVotes": 10 },
			{ "star": 1, "rating": 6.1, "nbOfVotes": 8 }
		],
		"title": "My Fight",
		"aired": "2015-06-01T00:00:00+00:00",
		"score": 3.9200000000000004
	},
	{
		"episodeNb": 789,
		"ratingFiveStars": 55.1,
		"ratingAllStars": 79.8,
		"nbOfVotes": 147,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1390830&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.1, "nbOfVotes": 81 },
			{ "star": 4, "rating": 12.2, "nbOfVotes": 18 },
			{ "star": 3, "rating": 17.7, "nbOfVotes": 26 },
			{ "star": 2, "rating": 6.1, "nbOfVotes": 9 },
			{ "star": 1, "rating": 8.8, "nbOfVotes": 13 }
		],
		"title": "Lucy!!",
		"aired": "2015-06-08T00:00:00+00:00",
		"score": 3.9899999999999998
	},
	{
		"episodeNb": 790,
		"ratingFiveStars": 74.7,
		"ratingAllStars": 89.8,
		"nbOfVotes": 225,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1395952&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.7, "nbOfVotes": 168 },
			{ "star": 4, "rating": 12.4, "nbOfVotes": 28 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 11 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 7 },
			{ "star": 1, "rating": 4.9, "nbOfVotes": 11 }
		],
		"title": "Heaven and Earth",
		"aired": "2015-06-22T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 791,
		"ratingFiveStars": 47.4,
		"ratingAllStars": 74.8,
		"nbOfVotes": 175,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1398521&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 47.4, "nbOfVotes": 83 },
			{ "star": 4, "rating": 15.4, "nbOfVotes": 27 },
			{ "star": 3, "rating": 15.4, "nbOfVotes": 27 },
			{ "star": 2, "rating": 7.4, "nbOfVotes": 13 },
			{ "star": 1, "rating": 14.3, "nbOfVotes": 25 }
		],
		"title": "Rubble",
		"aired": "2015-06-29T00:00:00+00:00",
		"score": 3.7399999999999998
	},
	{
		"episodeNb": 792,
		"ratingFiveStars": 58.4,
		"ratingAllStars": 84.6,
		"nbOfVotes": 154,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1401032&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.4, "nbOfVotes": 90 },
			{ "star": 4, "rating": 22.7, "nbOfVotes": 35 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 14 },
			{ "star": 2, "rating": 3.2, "nbOfVotes": 5 },
			{ "star": 1, "rating": 6.5, "nbOfVotes": 10 }
		],
		"title": "Prostration",
		"aired": "2015-07-06T00:00:00+00:00",
		"score": 4.2299999999999995
	},
	{
		"episodeNb": 793,
		"ratingFiveStars": 87.6,
		"ratingAllStars": 95.2,
		"nbOfVotes": 225,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1403686&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.6, "nbOfVotes": 197 },
			{ "star": 4, "rating": 7.1, "nbOfVotes": 16 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 5 }
		],
		"title": "Tiger and Dog",
		"aired": "2015-07-13T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 794,
		"ratingFiveStars": 67.5,
		"ratingAllStars": 89.2,
		"nbOfVotes": 166,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1406032&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.5, "nbOfVotes": 112 },
			{ "star": 4, "rating": 20.5, "nbOfVotes": 34 },
			{ "star": 3, "rating": 6, "nbOfVotes": 10 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 3.6, "nbOfVotes": 6 }
		],
		"title": "Sabo's Adventure",
		"aired": "2015-07-18T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 795,
		"ratingFiveStars": 88,
		"ratingAllStars": 96,
		"nbOfVotes": 333,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1411354&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88, "nbOfVotes": 293 },
			{ "star": 4, "rating": 7.8, "nbOfVotes": 26 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 5 }
		],
		"title": "Suicide",
		"aired": "2015-08-03T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 796,
		"ratingFiveStars": 53.4,
		"ratingAllStars": 86.2,
		"nbOfVotes": 131,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1413941&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.4, "nbOfVotes": 70 },
			{ "star": 4, "rating": 29.8, "nbOfVotes": 39 },
			{ "star": 3, "rating": 13.7, "nbOfVotes": 18 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 3 }
		],
		"title": "Soldier-san's Determination",
		"aired": "2015-08-10T00:00:00+00:00",
		"score": 4.3100000000000005
	},
	{
		"episodeNb": 797,
		"ratingFiveStars": 48.9,
		"ratingAllStars": 78,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1419052&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 48.9, "nbOfVotes": 65 },
			{ "star": 4, "rating": 15.8, "nbOfVotes": 21 },
			{ "star": 3, "rating": 21.1, "nbOfVotes": 28 },
			{ "star": 2, "rating": 5.3, "nbOfVotes": 7 },
			{ "star": 1, "rating": 9, "nbOfVotes": 12 }
		],
		"title": "Rebecca",
		"aired": "2015-08-24T00:00:00+00:00",
		"score": 3.9
	},
	{
		"episodeNb": 798,
		"ratingFiveStars": 76.9,
		"ratingAllStars": 93.2,
		"nbOfVotes": 156,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1421733&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.9, "nbOfVotes": 120 },
			{ "star": 4, "rating": 16, "nbOfVotes": 25 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 3 }
		],
		"title": "Heart",
		"aired": "2015-08-31T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 799,
		"ratingFiveStars": 88.1,
		"ratingAllStars": 96.6,
		"nbOfVotes": 327,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1424201&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.1, "nbOfVotes": 288 },
			{ "star": 4, "rating": 9.5, "nbOfVotes": 31 },
			{ "star": 3, "rating": 1.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 3 }
		],
		"title": "Parent and Child",
		"aired": "2015-09-07T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 800,
		"ratingFiveStars": 82.4,
		"ratingAllStars": 94.4,
		"nbOfVotes": 278,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1428637&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.4, "nbOfVotes": 229 },
			{ "star": 4, "rating": 11.5, "nbOfVotes": 32 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 5 }
		],
		"title": "Followers' Sake Cups",
		"aired": "2015-09-19T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 801,
		"ratingFiveStars": 89.3,
		"ratingAllStars": 96.4,
		"nbOfVotes": 300,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1431491&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.3, "nbOfVotes": 268 },
			{ "star": 4, "rating": 7.3, "nbOfVotes": 22 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 5 }
		],
		"title": "Opening Declaration",
		"aired": "2015-09-28T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 802,
		"ratingFiveStars": 65.9,
		"ratingAllStars": 91,
		"nbOfVotes": 164,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1434055&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.9, "nbOfVotes": 108 },
			{ "star": 4, "rating": 26.2, "nbOfVotes": 43 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 2 }
		],
		"title": "Zou",
		"aired": "2015-10-05T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 803,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 92.8,
		"nbOfVotes": 176,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1436099&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 137 },
			{ "star": 4, "rating": 14.2, "nbOfVotes": 25 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.8, "nbOfVotes": 5 }
		],
		"title": "Elephant Climbing",
		"aired": "2015-10-10T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 804,
		"ratingFiveStars": 58.1,
		"ratingAllStars": 88,
		"nbOfVotes": 129,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1441374&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.1, "nbOfVotes": 75 },
			{ "star": 4, "rating": 28.7, "nbOfVotes": 37 },
			{ "star": 3, "rating": 10.1, "nbOfVotes": 13 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.3, "nbOfVotes": 3 }
		],
		"title": "Adventure in the Country on the Back of an Elephant",
		"aired": "2015-10-26T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 805,
		"ratingFiveStars": 60.7,
		"ratingAllStars": 87.8,
		"nbOfVotes": 117,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1443813&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.7, "nbOfVotes": 71 },
			{ "star": 4, "rating": 23.1, "nbOfVotes": 27 },
			{ "star": 3, "rating": 12.8, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "The Mink Tribe",
		"aired": "2015-11-02T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 806,
		"ratingFiveStars": 67.9,
		"ratingAllStars": 91,
		"nbOfVotes": 159,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1447227&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.9, "nbOfVotes": 108 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 37 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 2 }
		],
		"title": "At the Fortress of Right Belly",
		"aired": "2015-11-09T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 807,
		"ratingFiveStars": 50.5,
		"ratingAllStars": 83.8,
		"nbOfVotes": 107,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1452510&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50.5, "nbOfVotes": 54 },
			{ "star": 4, "rating": 29, "nbOfVotes": 31 },
			{ "star": 3, "rating": 14, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 4.7, "nbOfVotes": 5 }
		],
		"title": "10 Days Ago",
		"aired": "2015-11-21T00:00:00+00:00",
		"score": 4.1899999999999995
	},
	{
		"episodeNb": 808,
		"ratingFiveStars": 62.1,
		"ratingAllStars": 89,
		"nbOfVotes": 103,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1455611&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.1, "nbOfVotes": 64 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 24 },
			{ "star": 3, "rating": 12.6, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Duke Inuarashi",
		"aired": "2015-11-30T00:00:00+00:00",
		"score": 4.45
	},
	{
		"episodeNb": 809,
		"ratingFiveStars": 71.1,
		"ratingAllStars": 91,
		"nbOfVotes": 121,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1457962&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.1, "nbOfVotes": 86 },
			{ "star": 4, "rating": 18.2, "nbOfVotes": 22 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.5, "nbOfVotes": 3 }
		],
		"title": "Master Nekomamushi",
		"aired": "2015-12-07T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 810,
		"ratingFiveStars": 71.3,
		"ratingAllStars": 92.4,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1462515&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.3, "nbOfVotes": 82 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 26 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "The Curly Hat Pirates Arrive",
		"aired": "2015-12-21T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 811,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 91,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1465790&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 74 },
			{ "star": 4, "rating": 22.7, "nbOfVotes": 25 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Roko",
		"aired": "2016-01-04T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 812,
		"ratingFiveStars": 81.2,
		"ratingAllStars": 95.2,
		"nbOfVotes": 229,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1472512&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.2, "nbOfVotes": 186 },
			{ "star": 4, "rating": 14.8, "nbOfVotes": 34 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.4, "nbOfVotes": 1 }
		],
		"title": "Capone \"Gang\" Bege",
		"aired": "2016-01-18T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 813,
		"ratingFiveStars": 81.4,
		"ratingAllStars": 94.6,
		"nbOfVotes": 167,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1474895&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.4, "nbOfVotes": 136 },
			{ "star": 4, "rating": 13.8, "nbOfVotes": 23 },
			{ "star": 3, "rating": 3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 3 }
		],
		"title": "Tea Party Invitation",
		"aired": "2016-01-25T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 814,
		"ratingFiveStars": 73.3,
		"ratingAllStars": 92.8,
		"nbOfVotes": 135,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1477075&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.3, "nbOfVotes": 99 },
			{ "star": 4, "rating": 20, "nbOfVotes": 27 },
			{ "star": 3, "rating": 5.2, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 2 }
		],
		"title": "Let's Go See Master Nekomamushi",
		"aired": "2016-02-01T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 815,
		"ratingFiveStars": 63.2,
		"ratingAllStars": 89.4,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1479231&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.2, "nbOfVotes": 72 },
			{ "star": 4, "rating": 26.3, "nbOfVotes": 30 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 3 }
		],
		"title": "Take Me with You!!",
		"aired": "2016-02-08T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 816,
		"ratingFiveStars": 83.3,
		"ratingAllStars": 95.2,
		"nbOfVotes": 240,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1481034&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.3, "nbOfVotes": 200 },
			{ "star": 4, "rating": 12.5, "nbOfVotes": 30 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 3 }
		],
		"title": "Dog vs. Cat",
		"aired": "2016-02-15T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 817,
		"ratingFiveStars": 72.2,
		"ratingAllStars": 91.6,
		"nbOfVotes": 151,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1485511&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.2, "nbOfVotes": 109 },
			{ "star": 4, "rating": 18.5, "nbOfVotes": 28 },
			{ "star": 3, "rating": 6.6, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2, "nbOfVotes": 3 }
		],
		"title": "Raizo of the Mist",
		"aired": "2016-02-29T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 818,
		"ratingFiveStars": 93.6,
		"ratingAllStars": 97.8,
		"nbOfVotes": 267,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1487699&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 93.6, "nbOfVotes": 250 },
			{ "star": 4, "rating": 3.4, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 2 }
		],
		"title": "Inside the Whale",
		"aired": "2016-03-07T00:00:00+00:00",
		"score": 4.89
	},
	{
		"episodeNb": 819,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 94.2,
		"nbOfVotes": 144,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1489789&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 112 },
			{ "star": 4, "rating": 16.7, "nbOfVotes": 24 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Momonosuke, Heir of the Kozuki Family",
		"aired": "2016-03-14T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 820,
		"ratingFiveStars": 80.7,
		"ratingAllStars": 94.4,
		"nbOfVotes": 150,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1491573&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.7, "nbOfVotes": 121 },
			{ "star": 4, "rating": 12.7, "nbOfVotes": 19 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Dog and Cat Have a History",
		"aired": "2016-03-19T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 821,
		"ratingFiveStars": 79.3,
		"ratingAllStars": 94.6,
		"nbOfVotes": 150,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1496502&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.3, "nbOfVotes": 119 },
			{ "star": 4, "rating": 16, "nbOfVotes": 24 },
			{ "star": 3, "rating": 4, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Understood",
		"aired": "2016-04-04T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 822,
		"ratingFiveStars": 82.8,
		"ratingAllStars": 94.8,
		"nbOfVotes": 145,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1498802&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.8, "nbOfVotes": 120 },
			{ "star": 4, "rating": 10.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 6.2, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Descending the Elephant",
		"aired": "2016-04-11T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 823,
		"ratingFiveStars": 83.6,
		"ratingAllStars": 94.6,
		"nbOfVotes": 165,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1500926&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.6, "nbOfVotes": 138 },
			{ "star": 4, "rating": 9.1, "nbOfVotes": 15 },
			{ "star": 3, "rating": 5.5, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 2 }
		],
		"title": "A World Abuzz",
		"aired": "2016-04-18T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 824,
		"ratingFiveStars": 78.5,
		"ratingAllStars": 93.6,
		"nbOfVotes": 191,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1503331&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.5, "nbOfVotes": 150 },
			{ "star": 4, "rating": 15.7, "nbOfVotes": 30 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 4 }
		],
		"title": "Whim",
		"aired": "2016-04-25T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 825,
		"ratingFiveStars": 59,
		"ratingAllStars": 87.8,
		"nbOfVotes": 122,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1506600&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59, "nbOfVotes": 72 },
			{ "star": 4, "rating": 26.2, "nbOfVotes": 32 },
			{ "star": 3, "rating": 10.7, "nbOfVotes": 13 },
			{ "star": 2, "rating": 2.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "The WEJ's Comic Strip",
		"aired": "2016-05-09T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 826,
		"ratingFiveStars": 73.7,
		"ratingAllStars": 92.4,
		"nbOfVotes": 152,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1511934&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.7, "nbOfVotes": 112 },
			{ "star": 4, "rating": 17.8, "nbOfVotes": 27 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "0 and 4",
		"aired": "2016-05-23T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 827,
		"ratingFiveStars": 67.7,
		"ratingAllStars": 91.6,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1514921&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.7, "nbOfVotes": 90 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 31 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Totto Land",
		"aired": "2016-05-30T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 828,
		"ratingFiveStars": 63.9,
		"ratingAllStars": 90.6,
		"nbOfVotes": 122,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1517612&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.9, "nbOfVotes": 78 },
			{ "star": 4, "rating": 27, "nbOfVotes": 33 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "1 and 2",
		"aired": "2016-06-06T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 829,
		"ratingFiveStars": 63.3,
		"ratingAllStars": 90,
		"nbOfVotes": 109,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1523159&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.3, "nbOfVotes": 69 },
			{ "star": 4, "rating": 26.6, "nbOfVotes": 29 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "The Yonko, Charlotte Linlin the Pirate",
		"aired": "2016-06-20T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 830,
		"ratingFiveStars": 61.2,
		"ratingAllStars": 89.2,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1525511&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.2, "nbOfVotes": 71 },
			{ "star": 4, "rating": 25.9, "nbOfVotes": 30 },
			{ "star": 3, "rating": 11.2, "nbOfVotes": 13 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "A Man You Can Bet On",
		"aired": "2016-06-27T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 831,
		"ratingFiveStars": 43.1,
		"ratingAllStars": 80.4,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1528529&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 43.1, "nbOfVotes": 50 },
			{ "star": 4, "rating": 26.7, "nbOfVotes": 31 },
			{ "star": 3, "rating": 19.8, "nbOfVotes": 23 },
			{ "star": 2, "rating": 9.5, "nbOfVotes": 11 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Adventure in the Mysterious Forest",
		"aired": "2016-07-04T00:00:00+00:00",
		"score": 4.0200000000000005
	},
	{
		"episodeNb": 832,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 91.4,
		"nbOfVotes": 101,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1533077&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 68 },
			{ "star": 4, "rating": 23.8, "nbOfVotes": 24 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Germa Kingdom",
		"aired": "2016-07-16T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 833,
		"ratingFiveStars": 75.6,
		"ratingAllStars": 92.2,
		"nbOfVotes": 131,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1535569&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.6, "nbOfVotes": 99 },
			{ "star": 4, "rating": 13.7, "nbOfVotes": 18 },
			{ "star": 3, "rating": 8.4, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 2 }
		],
		"title": "Vinsmoke Judge",
		"aired": "2016-07-25T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 834,
		"ratingFiveStars": 59.5,
		"ratingAllStars": 89.6,
		"nbOfVotes": 84,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1537669&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.5, "nbOfVotes": 50 },
			{ "star": 4, "rating": 31, "nbOfVotes": 26 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 1 }
		],
		"title": "My Dream",
		"aired": "2016-08-01T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 835,
		"ratingFiveStars": 61.8,
		"ratingAllStars": 88.8,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1540235&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.8, "nbOfVotes": 68 },
			{ "star": 4, "rating": 22.7, "nbOfVotes": 25 },
			{ "star": 3, "rating": 13.6, "nbOfVotes": 15 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "The Nation of Souls",
		"aired": "2016-08-08T00:00:00+00:00",
		"score": 4.4399999999999995
	},
	{
		"episodeNb": 836,
		"ratingFiveStars": 50,
		"ratingAllStars": 85.8,
		"nbOfVotes": 92,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1544169&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50, "nbOfVotes": 46 },
			{ "star": 4, "rating": 31.5, "nbOfVotes": 29 },
			{ "star": 3, "rating": 17.4, "nbOfVotes": 16 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "The Vivre Card Lola Gave",
		"aired": "2016-08-22T00:00:00+00:00",
		"score": 4.29
	},
	{
		"episodeNb": 837,
		"ratingFiveStars": 79.4,
		"ratingAllStars": 94,
		"nbOfVotes": 126,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1546255&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.4, "nbOfVotes": 100 },
			{ "star": 4, "rating": 12.7, "nbOfVotes": 16 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Luffy vs. Commander Cracker",
		"aired": "2016-08-29T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 838,
		"ratingFiveStars": 65.2,
		"ratingAllStars": 90,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1548329&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.2, "nbOfVotes": 73 },
			{ "star": 4, "rating": 21.4, "nbOfVotes": 24 },
			{ "star": 3, "rating": 11.6, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Choniki",
		"aired": "2016-09-05T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 839,
		"ratingFiveStars": 75.8,
		"ratingAllStars": 93,
		"nbOfVotes": 128,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1553071&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.8, "nbOfVotes": 97 },
			{ "star": 4, "rating": 15.6, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "I Owe You My Life",
		"aired": "2016-09-17T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 840,
		"ratingFiveStars": 78,
		"ratingAllStars": 94.2,
		"nbOfVotes": 132,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1555205&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78, "nbOfVotes": 103 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 20 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Iron Mask",
		"aired": "2016-09-26T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 841,
		"ratingFiveStars": 85.4,
		"ratingAllStars": 96.6,
		"nbOfVotes": 130,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1557310&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.4, "nbOfVotes": 111 },
			{ "star": 4, "rating": 12.3, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "To the East Blue",
		"aired": "2016-10-03T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 842,
		"ratingFiveStars": 72.3,
		"ratingAllStars": 91.2,
		"nbOfVotes": 119,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1558802&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.3, "nbOfVotes": 86 },
			{ "star": 4, "rating": 16.8, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7.6, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "The Power of Fullness",
		"aired": "2016-10-08T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 843,
		"ratingFiveStars": 83.2,
		"ratingAllStars": 94,
		"nbOfVotes": 131,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1562557&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.2, "nbOfVotes": 109 },
			{ "star": 4, "rating": 7.6, "nbOfVotes": 10 },
			{ "star": 3, "rating": 6.9, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 2 }
		],
		"title": "Vinsmoke Sanji",
		"aired": "2016-10-24T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 844,
		"ratingFiveStars": 90.8,
		"ratingAllStars": 97.2,
		"nbOfVotes": 271,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1564375&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.8, "nbOfVotes": 246 },
			{ "star": 4, "rating": 5.2, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.4, "nbOfVotes": 1 }
		],
		"title": "Luffy vs. Sanji",
		"aired": "2016-10-31T00:00:00+00:00",
		"score": 4.86
	},
	{
		"episodeNb": 845,
		"ratingFiveStars": 75.8,
		"ratingAllStars": 93.6,
		"nbOfVotes": 149,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1565889&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.8, "nbOfVotes": 113 },
			{ "star": 4, "rating": 16.8, "nbOfVotes": 25 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Forces of Rage",
		"aired": "2016-11-07T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 846,
		"ratingFiveStars": 69.6,
		"ratingAllStars": 92.2,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1569757&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.6, "nbOfVotes": 80 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 26 },
			{ "star": 3, "rating": 7, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Tamago's Security",
		"aired": "2016-11-21T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 847,
		"ratingFiveStars": 80.4,
		"ratingAllStars": 95,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1571607&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.4, "nbOfVotes": 82 },
			{ "star": 4, "rating": 15.7, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy and Big Mom",
		"aired": "2016-11-28T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 848,
		"ratingFiveStars": 72.1,
		"ratingAllStars": 93.6,
		"nbOfVotes": 111,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1573367&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.1, "nbOfVotes": 80 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 26 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Goodbye",
		"aired": "2016-12-05T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 849,
		"ratingFiveStars": 69.2,
		"ratingAllStars": 92.4,
		"nbOfVotes": 117,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1575247&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.2, "nbOfVotes": 81 },
			{ "star": 4, "rating": 24.8, "nbOfVotes": 29 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Choniki in Mirrorland",
		"aired": "2016-12-12T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 850,
		"ratingFiveStars": 86,
		"ratingAllStars": 95,
		"nbOfVotes": 228,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1578618&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86, "nbOfVotes": 196 },
			{ "star": 4, "rating": 9.2, "nbOfVotes": 21 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 6 }
		],
		"title": "A Ray of Light",
		"aired": "2016-12-26T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 851,
		"ratingFiveStars": 82.5,
		"ratingAllStars": 94.4,
		"nbOfVotes": 177,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1580335&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.5, "nbOfVotes": 146 },
			{ "star": 4, "rating": 9.6, "nbOfVotes": 17 },
			{ "star": 3, "rating": 6.2, "nbOfVotes": 11 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Moist Cigarette",
		"aired": "2017-01-07T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 852,
		"ratingFiveStars": 72,
		"ratingAllStars": 91.8,
		"nbOfVotes": 125,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1584052&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72, "nbOfVotes": 90 },
			{ "star": 4, "rating": 17.6, "nbOfVotes": 22 },
			{ "star": 3, "rating": 8.8, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Germa's Failure",
		"aired": "2017-01-16T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 853,
		"ratingFiveStars": 63.3,
		"ratingAllStars": 90.2,
		"nbOfVotes": 90,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1587505&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.3, "nbOfVotes": 57 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 23 },
			{ "star": 3, "rating": 10, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Not Here",
		"aired": "2017-01-30T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 854,
		"ratingFiveStars": 61.8,
		"ratingAllStars": 90.2,
		"nbOfVotes": 89,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1589270&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.8, "nbOfVotes": 55 },
			{ "star": 4, "rating": 27, "nbOfVotes": 24 },
			{ "star": 3, "rating": 11.2, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "What Are You Doing?",
		"aired": "2017-02-06T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 855,
		"ratingFiveStars": 84,
		"ratingAllStars": 96,
		"nbOfVotes": 119,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1590946&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84, "nbOfVotes": 100 },
			{ "star": 4, "rating": 11.8, "nbOfVotes": 14 },
			{ "star": 3, "rating": 4.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gugyurururu!!!",
		"aired": "2017-02-13T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 856,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 90.2,
		"nbOfVotes": 113,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1592602&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 76 },
			{ "star": 4, "rating": 21.2, "nbOfVotes": 24 },
			{ "star": 3, "rating": 8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Liar",
		"aired": "2017-02-20T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 857,
		"ratingFiveStars": 76.8,
		"ratingAllStars": 94.2,
		"nbOfVotes": 125,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1596242&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.8, "nbOfVotes": 96 },
			{ "star": 4, "rating": 19.2, "nbOfVotes": 24 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Rook",
		"aired": "2017-03-06T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 858,
		"ratingFiveStars": 69.6,
		"ratingAllStars": 91,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1597892&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.6, "nbOfVotes": 80 },
			{ "star": 4, "rating": 18.3, "nbOfVotes": 21 },
			{ "star": 3, "rating": 9.6, "nbOfVotes": 11 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Meeting",
		"aired": "2017-03-13T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 859,
		"ratingFiveStars": 70.7,
		"ratingAllStars": 91.8,
		"nbOfVotes": 99,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1599497&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.7, "nbOfVotes": 70 },
			{ "star": 4, "rating": 21.2, "nbOfVotes": 21 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2, "nbOfVotes": 2 }
		],
		"title": "Yonko Assassination Plan",
		"aired": "2017-03-18T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 860,
		"ratingFiveStars": 73.7,
		"ratingAllStars": 93.6,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1601323&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.7, "nbOfVotes": 84 },
			{ "star": 4, "rating": 20.2, "nbOfVotes": 23 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "10:00 Opening of the Banquet",
		"aired": "2017-03-27T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 861,
		"ratingFiveStars": 73.5,
		"ratingAllStars": 92.8,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1602919&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.5, "nbOfVotes": 75 },
			{ "star": 4, "rating": 16.7, "nbOfVotes": 17 },
			{ "star": 3, "rating": 9.8, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Good Actor",
		"aired": "2017-04-03T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 862,
		"ratingFiveStars": 86.4,
		"ratingAllStars": 95.8,
		"nbOfVotes": 176,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1607000&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.4, "nbOfVotes": 152 },
			{ "star": 4, "rating": 8, "nbOfVotes": 14 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "The Intelligent Ones",
		"aired": "2017-04-17T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 863,
		"ratingFiveStars": 93,
		"ratingAllStars": 98.2,
		"nbOfVotes": 185,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1608664&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 93, "nbOfVotes": 172 },
			{ "star": 4, "rating": 4.9, "nbOfVotes": 9 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Honorable",
		"aired": "2017-04-24T00:00:00+00:00",
		"score": 4.91
	},
	{
		"episodeNb": 864,
		"ratingFiveStars": 73,
		"ratingAllStars": 93.2,
		"nbOfVotes": 122,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1611664&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73, "nbOfVotes": 89 },
			{ "star": 4, "rating": 22.1, "nbOfVotes": 27 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "The Vinsmoke Family Massacre Plan",
		"aired": "2017-05-08T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 865,
		"ratingFiveStars": 72.4,
		"ratingAllStars": 92.2,
		"nbOfVotes": 123,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1613726&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.4, "nbOfVotes": 89 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 22 },
			{ "star": 3, "rating": 8.9, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Hey, Mother",
		"aired": "2017-05-15T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 866,
		"ratingFiveStars": 67,
		"ratingAllStars": 90,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1618532&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67, "nbOfVotes": 75 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 22 },
			{ "star": 3, "rating": 10.7, "nbOfVotes": 12 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Natural Born Destroyer",
		"aired": "2017-05-29T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 867,
		"ratingFiveStars": 79.2,
		"ratingAllStars": 94.4,
		"nbOfVotes": 173,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1621018&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.2, "nbOfVotes": 137 },
			{ "star": 4, "rating": 14.5, "nbOfVotes": 25 },
			{ "star": 3, "rating": 5.8, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Happy Birthday",
		"aired": "2017-06-05T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 868,
		"ratingFiveStars": 79.7,
		"ratingAllStars": 94.6,
		"nbOfVotes": 128,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1624821&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.7, "nbOfVotes": 102 },
			{ "star": 4, "rating": 14.1, "nbOfVotes": 18 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "KX Launcher",
		"aired": "2017-06-12T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 869,
		"ratingFiveStars": 76.8,
		"ratingAllStars": 93.8,
		"nbOfVotes": 125,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1628180&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.8, "nbOfVotes": 96 },
			{ "star": 4, "rating": 16.8, "nbOfVotes": 21 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Under Siege",
		"aired": "2017-06-19T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 870,
		"ratingFiveStars": 75,
		"ratingAllStars": 92.6,
		"nbOfVotes": 120,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1632576&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 90 },
			{ "star": 4, "rating": 13.3, "nbOfVotes": 16 },
			{ "star": 3, "rating": 11.7, "nbOfVotes": 14 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Parting",
		"aired": "2017-07-03T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 871,
		"ratingFiveStars": 79.8,
		"ratingAllStars": 95.4,
		"nbOfVotes": 124,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1634496&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.8, "nbOfVotes": 99 },
			{ "star": 4, "rating": 16.9, "nbOfVotes": 21 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "You Can Do It, Caesar!!",
		"aired": "2017-07-10T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 872,
		"ratingFiveStars": 65.2,
		"ratingAllStars": 91.6,
		"nbOfVotes": 115,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1636141&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.2, "nbOfVotes": 75 },
			{ "star": 4, "rating": 27.8, "nbOfVotes": 32 },
			{ "star": 3, "rating": 7, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Thick and Fluffy",
		"aired": "2017-07-15T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 873,
		"ratingFiveStars": 64.1,
		"ratingAllStars": 89.6,
		"nbOfVotes": 103,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1639677&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.1, "nbOfVotes": 66 },
			{ "star": 4, "rating": 23.3, "nbOfVotes": 24 },
			{ "star": 3, "rating": 9.7, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Trapped Like Sweets in a Cage",
		"aired": "2017-07-24T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 874,
		"ratingFiveStars": 64.5,
		"ratingAllStars": 90.6,
		"nbOfVotes": 121,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1645160&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.5, "nbOfVotes": 78 },
			{ "star": 4, "rating": 24.8, "nbOfVotes": 30 },
			{ "star": 3, "rating": 9.9, "nbOfVotes": 12 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Become My Servant",
		"aired": "2017-08-07T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 875,
		"ratingFiveStars": 65.8,
		"ratingAllStars": 88.2,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1652708&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.8, "nbOfVotes": 75 },
			{ "star": 4, "rating": 19.3, "nbOfVotes": 22 },
			{ "star": 3, "rating": 8.8, "nbOfVotes": 10 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 3.5, "nbOfVotes": 4 }
		],
		"title": "A Woman's Honor",
		"aired": "2017-08-21T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 876,
		"ratingFiveStars": 55.7,
		"ratingAllStars": 86,
		"nbOfVotes": 97,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1655521&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.7, "nbOfVotes": 54 },
			{ "star": 4, "rating": 27.8, "nbOfVotes": 27 },
			{ "star": 3, "rating": 10.3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 3.1, "nbOfVotes": 3 },
			{ "star": 1, "rating": 3.1, "nbOfVotes": 3 }
		],
		"title": "Pudding Coincidentally Appears!!",
		"aired": "2017-08-28T00:00:00+00:00",
		"score": 4.3
	},
	{
		"episodeNb": 877,
		"ratingFiveStars": 83,
		"ratingAllStars": 94.8,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1658087&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83, "nbOfVotes": 93 },
			{ "star": 4, "rating": 9.8, "nbOfVotes": 11 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Not Sweet",
		"aired": "2017-09-04T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 878,
		"ratingFiveStars": 80.1,
		"ratingAllStars": 94.2,
		"nbOfVotes": 156,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1664995&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.1, "nbOfVotes": 125 },
			{ "star": 4, "rating": 13.5, "nbOfVotes": 21 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Mink Tribe, Guardians Captain Pedro",
		"aired": "2017-09-16T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 879,
		"ratingFiveStars": 75.4,
		"ratingAllStars": 93.8,
		"nbOfVotes": 138,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1667239&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.4, "nbOfVotes": 104 },
			{ "star": 4, "rating": 18.8, "nbOfVotes": 26 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "One of Big Mom's \"3 Sweet Commanders\", Katakuri",
		"aired": "2017-09-25T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 880,
		"ratingFiveStars": 75,
		"ratingAllStars": 92.6,
		"nbOfVotes": 128,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1669080&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 96 },
			{ "star": 4, "rating": 16.4, "nbOfVotes": 21 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Zero Escape",
		"aired": "2017-10-02T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 881,
		"ratingFiveStars": 71.2,
		"ratingAllStars": 91.8,
		"nbOfVotes": 125,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1670782&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.2, "nbOfVotes": 89 },
			{ "star": 4, "rating": 20, "nbOfVotes": 25 },
			{ "star": 3, "rating": 7.2, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Wave Room",
		"aired": "2017-10-07T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 882,
		"ratingFiveStars": 76.8,
		"ratingAllStars": 93.2,
		"nbOfVotes": 125,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1675260&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.8, "nbOfVotes": 96 },
			{ "star": 4, "rating": 16.8, "nbOfVotes": 21 },
			{ "star": 3, "rating": 4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Beyond the Yonko's Expectations",
		"aired": "2017-10-23T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 883,
		"ratingFiveStars": 79.9,
		"ratingAllStars": 94.4,
		"nbOfVotes": 139,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1677710&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.9, "nbOfVotes": 111 },
			{ "star": 4, "rating": 15.1, "nbOfVotes": 21 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 2 }
		],
		"title": "Merienda",
		"aired": "2017-10-30T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 884,
		"ratingFiveStars": 72.6,
		"ratingAllStars": 92.2,
		"nbOfVotes": 106,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1679832&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.6, "nbOfVotes": 77 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 19 },
			{ "star": 3, "rating": 8.5, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Who",
		"aired": "2017-11-06T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 885,
		"ratingFiveStars": 62.8,
		"ratingAllStars": 90,
		"nbOfVotes": 94,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1682343&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.8, "nbOfVotes": 59 },
			{ "star": 4, "rating": 27.7, "nbOfVotes": 26 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "It's Brûlée!!!",
		"aired": "2017-11-13T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 886,
		"ratingFiveStars": 70.1,
		"ratingAllStars": 92.4,
		"nbOfVotes": 107,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1686000&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.1, "nbOfVotes": 75 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 25 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Way of Life",
		"aired": "2017-11-27T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 887,
		"ratingFiveStars": 75.5,
		"ratingAllStars": 93,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1688240&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.5, "nbOfVotes": 83 },
			{ "star": 4, "rating": 16.4, "nbOfVotes": 18 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "Somewhere, Someone is Wishing for Your Happiness",
		"aired": "2017-12-04T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 888,
		"ratingFiveStars": 83.1,
		"ratingAllStars": 96,
		"nbOfVotes": 172,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1690765&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.1, "nbOfVotes": 143 },
			{ "star": 4, "rating": 14, "nbOfVotes": 24 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Lion",
		"aired": "2017-12-11T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 889,
		"ratingFiveStars": 75.9,
		"ratingAllStars": 93.6,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1693951&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.9, "nbOfVotes": 82 },
			{ "star": 4, "rating": 16.7, "nbOfVotes": 18 },
			{ "star": 3, "rating": 6.5, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "An Unknown Mama",
		"aired": "2017-12-25T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 890,
		"ratingFiveStars": 84.7,
		"ratingAllStars": 94.4,
		"nbOfVotes": 163,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1695372&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.7, "nbOfVotes": 138 },
			{ "star": 4, "rating": 8.6, "nbOfVotes": 14 },
			{ "star": 3, "rating": 3.7, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 2.5, "nbOfVotes": 4 }
		],
		"title": "Big Mom on the Ship",
		"aired": "2018-01-04T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 891,
		"ratingFiveStars": 62.4,
		"ratingAllStars": 90.2,
		"nbOfVotes": 109,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1698923&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.4, "nbOfVotes": 68 },
			{ "star": 4, "rating": 27.5, "nbOfVotes": 30 },
			{ "star": 3, "rating": 9.2, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Believing in Me",
		"aired": "2018-01-15T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 892,
		"ratingFiveStars": 65.9,
		"ratingAllStars": 91,
		"nbOfVotes": 82,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1702383&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.9, "nbOfVotes": 54 },
			{ "star": 4, "rating": 28, "nbOfVotes": 23 },
			{ "star": 3, "rating": 1.2, "nbOfVotes": 1 },
			{ "star": 2, "rating": 4.9, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Recognized as Strong Opponents",
		"aired": "2018-01-29T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 893,
		"ratingFiveStars": 90.2,
		"ratingAllStars": 96.4,
		"nbOfVotes": 194,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1704005&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.2, "nbOfVotes": 175 },
			{ "star": 4, "rating": 4.6, "nbOfVotes": 9 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "36th Daughter of the Charlotte Family - Flampe",
		"aired": "2018-02-05T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 894,
		"ratingFiveStars": 81,
		"ratingAllStars": 94.8,
		"nbOfVotes": 163,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1705428&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81, "nbOfVotes": 132 },
			{ "star": 4, "rating": 12.9, "nbOfVotes": 21 },
			{ "star": 3, "rating": 5.5, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "12:05",
		"aired": "2018-02-10T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 895,
		"ratingFiveStars": 87,
		"ratingAllStars": 96.2,
		"nbOfVotes": 192,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1707255&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87, "nbOfVotes": 167 },
			{ "star": 4, "rating": 8.3, "nbOfVotes": 16 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pirate Luffy vs. Commander Katakuri",
		"aired": "2018-02-19T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 896,
		"ratingFiveStars": 81.9,
		"ratingAllStars": 94.2,
		"nbOfVotes": 238,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1710543&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.9, "nbOfVotes": 195 },
			{ "star": 4, "rating": 11.3, "nbOfVotes": 27 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 8 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 5 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 3 }
		],
		"title": "The Last Request",
		"aired": "2018-03-05T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 897,
		"ratingFiveStars": 79,
		"ratingAllStars": 94.6,
		"nbOfVotes": 124,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1712322&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79, "nbOfVotes": 98 },
			{ "star": 4, "rating": 16.1, "nbOfVotes": 20 },
			{ "star": 3, "rating": 4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Pekoms's Cacao Island Esca",
		"aired": "2018-03-12T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 898,
		"ratingFiveStars": 81.9,
		"ratingAllStars": 94.8,
		"nbOfVotes": 166,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1713989&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.9, "nbOfVotes": 136 },
			{ "star": 4, "rating": 11.4, "nbOfVotes": 19 },
			{ "star": 3, "rating": 6, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "We'll Definitely Return",
		"aired": "2018-03-19T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 899,
		"ratingFiveStars": 81,
		"ratingAllStars": 94.8,
		"nbOfVotes": 137,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1715792&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81, "nbOfVotes": 111 },
			{ "star": 4, "rating": 13.1, "nbOfVotes": 18 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Last Stand",
		"aired": "2018-03-26T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 900,
		"ratingFiveStars": 77.9,
		"ratingAllStars": 94.2,
		"nbOfVotes": 276,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1717678&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.9, "nbOfVotes": 215 },
			{ "star": 4, "rating": 16.3, "nbOfVotes": 45 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 12 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Bad End Musical",
		"aired": "2018-04-02T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 901,
		"ratingFiveStars": 69.6,
		"ratingAllStars": 90.2,
		"nbOfVotes": 191,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1721485&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.6, "nbOfVotes": 133 },
			{ "star": 4, "rating": 18.3, "nbOfVotes": 35 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 15 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 4 }
		],
		"title": "Even If You Die, Don't Die!!!",
		"aired": "2018-04-16T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 902,
		"ratingFiveStars": 84.8,
		"ratingAllStars": 94.8,
		"nbOfVotes": 223,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1723319&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.8, "nbOfVotes": 189 },
			{ "star": 4, "rating": 8.1, "nbOfVotes": 18 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 11 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 2 }
		],
		"title": "End Roll",
		"aired": "2018-04-23T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 903,
		"ratingFiveStars": 92.8,
		"ratingAllStars": 97.6,
		"nbOfVotes": 460,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1725182&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 92.8, "nbOfVotes": 427 },
			{ "star": 4, "rating": 5.2, "nbOfVotes": 24 },
			{ "star": 3, "rating": 0.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 5 }
		],
		"title": "The Fifth Emperor",
		"aired": "2018-05-02T00:00:00+00:00",
		"score": 4.88
	},
	{
		"episodeNb": 904,
		"ratingFiveStars": 75.1,
		"ratingAllStars": 93,
		"nbOfVotes": 197,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1728349&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.1, "nbOfVotes": 148 },
			{ "star": 4, "rating": 16.2, "nbOfVotes": 32 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 14 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Entrance of the Revolutionary Army Commanders",
		"aired": "2018-05-14T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 905,
		"ratingFiveStars": 79.8,
		"ratingAllStars": 94.6,
		"nbOfVotes": 168,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1731504&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.8, "nbOfVotes": 134 },
			{ "star": 4, "rating": 14.9, "nbOfVotes": 25 },
			{ "star": 3, "rating": 4.2, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "A Beautiful World",
		"aired": "2018-05-28T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 906,
		"ratingFiveStars": 86,
		"ratingAllStars": 96.4,
		"nbOfVotes": 57,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1732708&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86, "nbOfVotes": 49 },
			{ "star": 4, "rating": 12.3, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Holy Land Mary Geoise",
		"aired": "2018-06-04T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 907,
		"ratingFiveStars": 91.4,
		"ratingAllStars": 97.6,
		"nbOfVotes": 58,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1732713&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 91.4, "nbOfVotes": 53 },
			{ "star": 4, "rating": 5.2, "nbOfVotes": 3 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Empty Throne",
		"aired": "2018-06-11T00:00:00+00:00",
		"score": 4.88
	},
	{
		"episodeNb": 908,
		"ratingFiveStars": 84.9,
		"ratingAllStars": 95.6,
		"nbOfVotes": 73,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1732726&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.9, "nbOfVotes": 62 },
			{ "star": 4, "rating": 9.6, "nbOfVotes": 7 },
			{ "star": 3, "rating": 4.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Reverie Begins",
		"aired": "2018-06-18T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 909,
		"ratingFiveStars": 86.8,
		"ratingAllStars": 97,
		"nbOfVotes": 53,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1732714&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.8, "nbOfVotes": 46 },
			{ "star": 4, "rating": 11.3, "nbOfVotes": 6 },
			{ "star": 3, "rating": 1.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Seppuku",
		"aired": "2018-07-02T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 910,
		"ratingFiveStars": 66.1,
		"ratingAllStars": 91,
		"nbOfVotes": 62,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1732843&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.1, "nbOfVotes": 41 },
			{ "star": 4, "rating": 27.4, "nbOfVotes": 17 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 2 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 1 }
		],
		"title": "Onward to Wano Country",
		"aired": "2018-07-09T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 911,
		"ratingFiveStars": 69.8,
		"ratingAllStars": 93,
		"nbOfVotes": 43,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1732857&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.8, "nbOfVotes": 30 },
			{ "star": 4, "rating": 27.9, "nbOfVotes": 12 },
			{ "star": 3, "rating": 0, "nbOfVotes": 0 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Adventure in the Land of Samurai",
		"aired": "2018-07-14T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 912,
		"ratingFiveStars": 76.5,
		"ratingAllStars": 93.6,
		"nbOfVotes": 34,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1732834&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.5, "nbOfVotes": 26 },
			{ "star": 4, "rating": 17.6, "nbOfVotes": 6 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Amigasa Village",
		"aired": "2018-07-23T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 913,
		"ratingFiveStars": 62.1,
		"ratingAllStars": 90.4,
		"nbOfVotes": 66,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1732443&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.1, "nbOfVotes": 41 },
			{ "star": 4, "rating": 30.3, "nbOfVotes": 20 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 1 }
		],
		"title": "Tsuru Returns the Favor",
		"aired": "2018-08-06T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 914,
		"ratingFiveStars": 64.8,
		"ratingAllStars": 90.2,
		"nbOfVotes": 88,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1734984&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.8, "nbOfVotes": 57 },
			{ "star": 4, "rating": 25, "nbOfVotes": 22 },
			{ "star": 3, "rating": 8, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Okobore Town",
		"aired": "2018-08-20T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 915,
		"ratingFiveStars": 57,
		"ratingAllStars": 87.4,
		"nbOfVotes": 86,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1736406&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57, "nbOfVotes": 49 },
			{ "star": 4, "rating": 26.7, "nbOfVotes": 23 },
			{ "star": 3, "rating": 12.8, "nbOfVotes": 11 },
			{ "star": 2, "rating": 3.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Bakura Town",
		"aired": "2018-08-27T00:00:00+00:00",
		"score": 4.37
	},
	{
		"episodeNb": 916,
		"ratingFiveStars": 65.2,
		"ratingAllStars": 91.2,
		"nbOfVotes": 89,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1737678&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.2, "nbOfVotes": 58 },
			{ "star": 4, "rating": 27, "nbOfVotes": 24 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Wano Country Grand Sumo Tournament",
		"aired": "2018-09-03T00:00:00+00:00",
		"score": 4.5600000000000005
	},
	{
		"episodeNb": 917,
		"ratingFiveStars": 68.8,
		"ratingAllStars": 92,
		"nbOfVotes": 93,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1740016&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.8, "nbOfVotes": 64 },
			{ "star": 4, "rating": 24.7, "nbOfVotes": 23 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "The Treasure Ship of Provisions",
		"aired": "2018-09-15T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 918,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 94.2,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1741148&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 84 },
			{ "star": 4, "rating": 16.7, "nbOfVotes": 18 },
			{ "star": 3, "rating": 4.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Luffy-tarou Repays the Favor",
		"aired": "2018-09-22T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 919,
		"ratingFiveStars": 76.2,
		"ratingAllStars": 93,
		"nbOfVotes": 126,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1742483&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.2, "nbOfVotes": 96 },
			{ "star": 4, "rating": 15.9, "nbOfVotes": 20 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "The Ruins of Oden Castle",
		"aired": "2018-10-01T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 920,
		"ratingFiveStars": 74.6,
		"ratingAllStars": 91.8,
		"nbOfVotes": 138,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1743474&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.6, "nbOfVotes": 103 },
			{ "star": 4, "rating": 14.5, "nbOfVotes": 20 },
			{ "star": 3, "rating": 7.2, "nbOfVotes": 10 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 2 }
		],
		"title": "For Love of Oden",
		"aired": "2018-10-06T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 921,
		"ratingFiveStars": 86.3,
		"ratingAllStars": 96,
		"nbOfVotes": 168,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1746597&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.3, "nbOfVotes": 145 },
			{ "star": 4, "rating": 9.5, "nbOfVotes": 16 },
			{ "star": 3, "rating": 3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Shutenmaru",
		"aired": "2018-10-22T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 922,
		"ratingFiveStars": 83.3,
		"ratingAllStars": 95.6,
		"nbOfVotes": 132,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1747852&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.3, "nbOfVotes": 110 },
			{ "star": 4, "rating": 12.1, "nbOfVotes": 16 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Beasts Pirates General: Kaido",
		"aired": "2018-10-29T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 923,
		"ratingFiveStars": 85.1,
		"ratingAllStars": 96.2,
		"nbOfVotes": 181,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1749191&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.1, "nbOfVotes": 154 },
			{ "star": 4, "rating": 11.6, "nbOfVotes": 21 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Yonko Kaido vs. Luffy",
		"aired": "2018-11-05T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 924,
		"ratingFiveStars": 81.2,
		"ratingAllStars": 94.6,
		"nbOfVotes": 154,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1750483&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.2, "nbOfVotes": 125 },
			{ "star": 4, "rating": 13.6, "nbOfVotes": 21 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 2 }
		],
		"title": "Ha",
		"aired": "2018-11-12T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 925,
		"ratingFiveStars": 85.2,
		"ratingAllStars": 96.4,
		"nbOfVotes": 169,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1752829&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.2, "nbOfVotes": 144 },
			{ "star": 4, "rating": 11.2, "nbOfVotes": 19 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Blank",
		"aired": "2018-11-26T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 926,
		"ratingFiveStars": 74.3,
		"ratingAllStars": 92,
		"nbOfVotes": 101,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1753929&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.3, "nbOfVotes": 75 },
			{ "star": 4, "rating": 16.8, "nbOfVotes": 17 },
			{ "star": 3, "rating": 5, "nbOfVotes": 5 },
			{ "star": 2, "rating": 3, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "The Prisoner Mine",
		"aired": "2018-12-03T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 927,
		"ratingFiveStars": 74.1,
		"ratingAllStars": 92.4,
		"nbOfVotes": 81,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1755071&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.1, "nbOfVotes": 60 },
			{ "star": 4, "rating": 17.3, "nbOfVotes": 14 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 4 },
			{ "star": 2, "rating": 3.7, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Courtesan's Kamuro",
		"aired": "2018-12-10T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 928,
		"ratingFiveStars": 60.4,
		"ratingAllStars": 87.6,
		"nbOfVotes": 96,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1757069&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.4, "nbOfVotes": 58 },
			{ "star": 4, "rating": 22.9, "nbOfVotes": 22 },
			{ "star": 3, "rating": 13.5, "nbOfVotes": 13 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3.1, "nbOfVotes": 3 }
		],
		"title": "The Oiran Komurasaki Takes the Stage",
		"aired": "2018-12-22T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 929,
		"ratingFiveStars": 53,
		"ratingAllStars": 86,
		"nbOfVotes": 100,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1758842&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53, "nbOfVotes": 53 },
			{ "star": 4, "rating": 30, "nbOfVotes": 30 },
			{ "star": 3, "rating": 13, "nbOfVotes": 13 },
			{ "star": 2, "rating": 2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2, "nbOfVotes": 2 }
		],
		"title": "Kurozumi Orochi, Shogun of the Wano Country",
		"aired": "2019-01-07T00:00:00+00:00",
		"score": 4.3
	},
	{
		"episodeNb": 930,
		"ratingFiveStars": 72.3,
		"ratingAllStars": 92.2,
		"nbOfVotes": 137,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1762288&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.3, "nbOfVotes": 99 },
			{ "star": 4, "rating": 20.4, "nbOfVotes": 28 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Ebisu Town",
		"aired": "2019-01-21T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 931,
		"ratingFiveStars": 75,
		"ratingAllStars": 92,
		"nbOfVotes": 164,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1764673&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75, "nbOfVotes": 123 },
			{ "star": 4, "rating": 17.7, "nbOfVotes": 29 },
			{ "star": 3, "rating": 3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.7, "nbOfVotes": 6 }
		],
		"title": "Soba Mask",
		"aired": "2019-02-04T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 932,
		"ratingFiveStars": 65.7,
		"ratingAllStars": 90.2,
		"nbOfVotes": 99,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1765721&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.7, "nbOfVotes": 65 },
			{ "star": 4, "rating": 21.2, "nbOfVotes": 21 },
			{ "star": 3, "rating": 11.1, "nbOfVotes": 11 },
			{ "star": 2, "rating": 2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Shogun and the Courtesan",
		"aired": "2019-02-09T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 933,
		"ratingFiveStars": 59.1,
		"ratingAllStars": 90.2,
		"nbOfVotes": 93,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1767016&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.1, "nbOfVotes": 55 },
			{ "star": 4, "rating": 35.5, "nbOfVotes": 33 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 2, "rating": 3.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "A Samurai's Mercy",
		"aired": "2019-02-18T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 934,
		"ratingFiveStars": 55.9,
		"ratingAllStars": 87.6,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1768159&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 55.9, "nbOfVotes": 57 },
			{ "star": 4, "rating": 34.3, "nbOfVotes": 35 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 4 },
			{ "star": 2, "rating": 3.9, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2, "nbOfVotes": 2 }
		],
		"title": "Hyogoro of the Flower",
		"aired": "2019-02-25T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 935,
		"ratingFiveStars": 52.7,
		"ratingAllStars": 86.4,
		"nbOfVotes": 93,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1770676&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52.7, "nbOfVotes": 49 },
			{ "star": 4, "rating": 33.3, "nbOfVotes": 31 },
			{ "star": 3, "rating": 9.7, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.2, "nbOfVotes": 2 }
		],
		"title": "Queen",
		"aired": "2019-03-11T00:00:00+00:00",
		"score": 4.32
	},
	{
		"episodeNb": 936,
		"ratingFiveStars": 69.1,
		"ratingAllStars": 90.4,
		"nbOfVotes": 97,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1771804&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.1, "nbOfVotes": 67 },
			{ "star": 4, "rating": 21.6, "nbOfVotes": 21 },
			{ "star": 3, "rating": 4.1, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 3.1, "nbOfVotes": 3 }
		],
		"title": "The Great Sumo Inferno",
		"aired": "2019-03-18T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 937,
		"ratingFiveStars": 82.7,
		"ratingAllStars": 95.2,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1772935&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.7, "nbOfVotes": 91 },
			{ "star": 4, "rating": 12.7, "nbOfVotes": 14 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Gyukimaru of Bandit Bridge",
		"aired": "2019-03-25T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 938,
		"ratingFiveStars": 58.9,
		"ratingAllStars": 89.6,
		"nbOfVotes": 107,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1774464&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.9, "nbOfVotes": 63 },
			{ "star": 4, "rating": 30.8, "nbOfVotes": 33 },
			{ "star": 3, "rating": 9.3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Her Secret",
		"aired": "2019-04-01T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 939,
		"ratingFiveStars": 69,
		"ratingAllStars": 91.8,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1776940&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69, "nbOfVotes": 80 },
			{ "star": 4, "rating": 24.1, "nbOfVotes": 28 },
			{ "star": 3, "rating": 5.2, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "An Old Leopard Knows The Way",
		"aired": "2019-04-15T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 940,
		"ratingFiveStars": 64.8,
		"ratingAllStars": 89.4,
		"nbOfVotes": 91,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1778158&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.8, "nbOfVotes": 59 },
			{ "star": 4, "rating": 20.9, "nbOfVotes": 19 },
			{ "star": 3, "rating": 12.1, "nbOfVotes": 11 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "The Spark of Rebellion",
		"aired": "2019-04-22T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 941,
		"ratingFiveStars": 67.6,
		"ratingAllStars": 90.4,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1779150&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.6, "nbOfVotes": 69 },
			{ "star": 4, "rating": 20.6, "nbOfVotes": 21 },
			{ "star": 3, "rating": 8.8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Ebisu Town's Most Beloved",
		"aired": "2019-04-27T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 942,
		"ratingFiveStars": 82.4,
		"ratingAllStars": 94.6,
		"nbOfVotes": 159,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1781551&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.4, "nbOfVotes": 131 },
			{ "star": 4, "rating": 11.9, "nbOfVotes": 19 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 2 }
		],
		"title": "The Daimyo of Hakumai, Shimotsuki Yasuie",
		"aired": "2019-05-13T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 943,
		"ratingFiveStars": 83.2,
		"ratingAllStars": 95.2,
		"nbOfVotes": 131,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1783682&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.2, "nbOfVotes": 109 },
			{ "star": 4, "rating": 12.2, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "SMILE",
		"aired": "2019-05-27T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 944,
		"ratingFiveStars": 86,
		"ratingAllStars": 95.6,
		"nbOfVotes": 143,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1784808&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86, "nbOfVotes": 123 },
			{ "star": 4, "rating": 10.5, "nbOfVotes": 15 },
			{ "star": 3, "rating": 1.4, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 3 }
		],
		"title": "Partner",
		"aired": "2019-06-03T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 945,
		"ratingFiveStars": 74.8,
		"ratingAllStars": 92,
		"nbOfVotes": 107,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1785950&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.8, "nbOfVotes": 80 },
			{ "star": 4, "rating": 18.7, "nbOfVotes": 20 },
			{ "star": 3, "rating": 1.9, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.7, "nbOfVotes": 4 }
		],
		"title": "O-Lin",
		"aired": "2019-06-10T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 946,
		"ratingFiveStars": 71.4,
		"ratingAllStars": 92,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1788014&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.4, "nbOfVotes": 80 },
			{ "star": 4, "rating": 22.3, "nbOfVotes": 25 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "Queen vs. O-Lin",
		"aired": "2019-06-24T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 947,
		"ratingFiveStars": 68.6,
		"ratingAllStars": 91,
		"nbOfVotes": 102,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1789158&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.6, "nbOfVotes": 70 },
			{ "star": 4, "rating": 21.6, "nbOfVotes": 22 },
			{ "star": 3, "rating": 6.9, "nbOfVotes": 7 },
			{ "star": 2, "rating": 2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Queen's Gamble",
		"aired": "2019-07-01T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 948,
		"ratingFiveStars": 74.1,
		"ratingAllStars": 92.6,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1790402&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.1, "nbOfVotes": 83 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 22 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "Kawamatsu the Kappa Takes the Stage",
		"aired": "2019-07-08T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 949,
		"ratingFiveStars": 84.3,
		"ratingAllStars": 95,
		"nbOfVotes": 134,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1793076&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.3, "nbOfVotes": 113 },
			{ "star": 4, "rating": 10.4, "nbOfVotes": 14 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "Mummy",
		"aired": "2019-07-22T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 950,
		"ratingFiveStars": 78.3,
		"ratingAllStars": 94.2,
		"nbOfVotes": 106,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1794211&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.3, "nbOfVotes": 83 },
			{ "star": 4, "rating": 16, "nbOfVotes": 17 },
			{ "star": 3, "rating": 4.7, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 1 }
		],
		"title": "The Warriors' Dreams",
		"aired": "2019-07-29T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 951,
		"ratingFiveStars": 81.1,
		"ratingAllStars": 94.2,
		"nbOfVotes": 122,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1795208&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.1, "nbOfVotes": 99 },
			{ "star": 4, "rating": 11.5, "nbOfVotes": 14 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Rampage",
		"aired": "2019-08-05T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 952,
		"ratingFiveStars": 45.3,
		"ratingAllStars": 85.4,
		"nbOfVotes": 75,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1797650&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 45.3, "nbOfVotes": 34 },
			{ "star": 4, "rating": 38.7, "nbOfVotes": 29 },
			{ "star": 3, "rating": 13.3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 2.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Hiyori and Kawamatsu",
		"aired": "2019-08-19T00:00:00+00:00",
		"score": 4.2700000000000005
	},
	{
		"episodeNb": 953,
		"ratingFiveStars": 69.8,
		"ratingAllStars": 92,
		"nbOfVotes": 126,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1798566&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.8, "nbOfVotes": 88 },
			{ "star": 4, "rating": 23, "nbOfVotes": 29 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Once Upon a Fox",
		"aired": "2019-08-26T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 954,
		"ratingFiveStars": 84.5,
		"ratingAllStars": 95.4,
		"nbOfVotes": 142,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1799529&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.5, "nbOfVotes": 120 },
			{ "star": 4, "rating": 11.3, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 2 }
		],
		"title": "Like Giving Wings to a Dragon",
		"aired": "2019-09-02T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 955,
		"ratingFiveStars": 87.1,
		"ratingAllStars": 96.6,
		"nbOfVotes": 139,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1801357&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.1, "nbOfVotes": 121 },
			{ "star": 4, "rating": 10.8, "nbOfVotes": 15 },
			{ "star": 3, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Enma",
		"aired": "2019-09-14T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 956,
		"ratingFiveStars": 90.8,
		"ratingAllStars": 97.8,
		"nbOfVotes": 229,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1802274&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.8, "nbOfVotes": 208 },
			{ "star": 4, "rating": 7, "nbOfVotes": 16 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Big News",
		"aired": "2019-09-21T00:00:00+00:00",
		"score": 4.89
	},
	{
		"episodeNb": 957,
		"ratingFiveStars": 95.3,
		"ratingAllStars": 98.6,
		"nbOfVotes": 358,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1803494&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 95.3, "nbOfVotes": 341 },
			{ "star": 4, "rating": 3.1, "nbOfVotes": 11 },
			{ "star": 3, "rating": 1.4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Ultimate",
		"aired": "2019-09-30T00:00:00+00:00",
		"score": 4.93
	},
	{
		"episodeNb": 958,
		"ratingFiveStars": 60.3,
		"ratingAllStars": 88.4,
		"nbOfVotes": 121,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1804697&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.3, "nbOfVotes": 73 },
			{ "star": 4, "rating": 25.6, "nbOfVotes": 31 },
			{ "star": 3, "rating": 11.6, "nbOfVotes": 14 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "The Promised Port",
		"aired": "2019-10-07T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 959,
		"ratingFiveStars": 62.1,
		"ratingAllStars": 88.6,
		"nbOfVotes": 95,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1806880&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.1, "nbOfVotes": 59 },
			{ "star": 4, "rating": 25.3, "nbOfVotes": 24 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 4.2, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "Samurai",
		"aired": "2019-10-21T00:00:00+00:00",
		"score": 4.43
	},
	{
		"episodeNb": 960,
		"ratingFiveStars": 67.3,
		"ratingAllStars": 90,
		"nbOfVotes": 107,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1807950&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.3, "nbOfVotes": 72 },
			{ "star": 4, "rating": 22.4, "nbOfVotes": 24 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 6 },
			{ "star": 2, "rating": 2.8, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 2 }
		],
		"title": "Kozuki Oden Takes the Stage",
		"aired": "2019-10-28T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 961,
		"ratingFiveStars": 63.3,
		"ratingAllStars": 89.8,
		"nbOfVotes": 98,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1808893&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.3, "nbOfVotes": 62 },
			{ "star": 4, "rating": 25.5, "nbOfVotes": 25 },
			{ "star": 3, "rating": 9.2, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "The Mountain God Incident",
		"aired": "2019-11-02T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 962,
		"ratingFiveStars": 70.8,
		"ratingAllStars": 91.6,
		"nbOfVotes": 89,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1811091&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.8, "nbOfVotes": 63 },
			{ "star": 4, "rating": 21.3, "nbOfVotes": 19 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 4 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 1 }
		],
		"title": "The Daimyo and His Retainers",
		"aired": "2019-11-18T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 963,
		"ratingFiveStars": 87.3,
		"ratingAllStars": 95.4,
		"nbOfVotes": 110,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1812119&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.3, "nbOfVotes": 96 },
			{ "star": 4, "rating": 7.3, "nbOfVotes": 8 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "Becoming Samurai",
		"aired": "2019-11-25T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 964,
		"ratingFiveStars": 91.3,
		"ratingAllStars": 98,
		"nbOfVotes": 127,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1813141&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 91.3, "nbOfVotes": 116 },
			{ "star": 4, "rating": 7.1, "nbOfVotes": 9 },
			{ "star": 3, "rating": 1.6, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Oden's Adventure",
		"aired": "2019-12-02T00:00:00+00:00",
		"score": 4.9
	},
	{
		"episodeNb": 965,
		"ratingFiveStars": 81.6,
		"ratingAllStars": 95,
		"nbOfVotes": 114,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1815460&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.6, "nbOfVotes": 93 },
			{ "star": 4, "rating": 13.2, "nbOfVotes": 15 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Kurozumi Family Conspiracy",
		"aired": "2019-12-16T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 966,
		"ratingFiveStars": 94.2,
		"ratingAllStars": 98.4,
		"nbOfVotes": 154,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1816487&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 94.2, "nbOfVotes": 145 },
			{ "star": 4, "rating": 4.5, "nbOfVotes": 7 },
			{ "star": 3, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Roger and Whitebeard",
		"aired": "2019-12-23T00:00:00+00:00",
		"score": 4.92
	},
	{
		"episodeNb": 967,
		"ratingFiveStars": 92.9,
		"ratingAllStars": 97.8,
		"nbOfVotes": 280,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1817618&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 92.9, "nbOfVotes": 260 },
			{ "star": 4, "rating": 5, "nbOfVotes": 14 },
			{ "star": 3, "rating": 1.1, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.4, "nbOfVotes": 1 }
		],
		"title": "Roger's Adventure",
		"aired": "2020-01-07T00:00:00+00:00",
		"score": 4.89
	},
	{
		"episodeNb": 968,
		"ratingFiveStars": 85,
		"ratingAllStars": 95.8,
		"nbOfVotes": 120,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1820754&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85, "nbOfVotes": 102 },
			{ "star": 4, "rating": 10.8, "nbOfVotes": 13 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Oden's Return",
		"aired": "2020-01-20T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 969,
		"ratingFiveStars": 68.5,
		"ratingAllStars": 89.6,
		"nbOfVotes": 111,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1821950&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.5, "nbOfVotes": 76 },
			{ "star": 4, "rating": 19.8, "nbOfVotes": 22 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 6 },
			{ "star": 2, "rating": 3.6, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 3 }
		],
		"title": "Fool of a Lord",
		"aired": "2020-01-27T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 970,
		"ratingFiveStars": 69.2,
		"ratingAllStars": 87.8,
		"nbOfVotes": 117,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1822837&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.2, "nbOfVotes": 81 },
			{ "star": 4, "rating": 15.4, "nbOfVotes": 18 },
			{ "star": 3, "rating": 6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 4.3, "nbOfVotes": 5 },
			{ "star": 1, "rating": 5.1, "nbOfVotes": 6 }
		],
		"title": "Oden vs. Kaido",
		"aired": "2020-02-03T00:00:00+00:00",
		"score": 4.39
	},
	{
		"episodeNb": 971,
		"ratingFiveStars": 84.9,
		"ratingAllStars": 94.8,
		"nbOfVotes": 179,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1825016&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.9, "nbOfVotes": 152 },
			{ "star": 4, "rating": 8.4, "nbOfVotes": 15 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 2 }
		],
		"title": "Boiled Alive",
		"aired": "2020-02-17T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 972,
		"ratingFiveStars": 89,
		"ratingAllStars": 96.6,
		"nbOfVotes": 182,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1825638&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89, "nbOfVotes": 162 },
			{ "star": 4, "rating": 6.6, "nbOfVotes": 12 },
			{ "star": 3, "rating": 2.7, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "I am Oden, And I Was Born to Boil",
		"aired": "2020-02-22T00:00:00+00:00",
		"score": 4.83
	},
	{
		"episodeNb": 973,
		"ratingFiveStars": 77.5,
		"ratingAllStars": 93.6,
		"nbOfVotes": 120,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1828072&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.5, "nbOfVotes": 93 },
			{ "star": 4, "rating": 15.8, "nbOfVotes": 19 },
			{ "star": 3, "rating": 4.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "The Kozuki Clan",
		"aired": "2020-03-09T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 974,
		"ratingFiveStars": 85.1,
		"ratingAllStars": 95.6,
		"nbOfVotes": 174,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1829006&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.1, "nbOfVotes": 148 },
			{ "star": 4, "rating": 10.9, "nbOfVotes": 19 },
			{ "star": 3, "rating": 1.7, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 2 }
		],
		"title": "Onward to Onigashima!!",
		"aired": "2020-03-16T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 975,
		"ratingFiveStars": 83.3,
		"ratingAllStars": 96.2,
		"nbOfVotes": 150,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1830029&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.3, "nbOfVotes": 125 },
			{ "star": 4, "rating": 14.7, "nbOfVotes": 22 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "Kin'emon's Clever Trick",
		"aired": "2020-03-23T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 976,
		"ratingFiveStars": 83.9,
		"ratingAllStars": 95.2,
		"nbOfVotes": 186,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1832524&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.9, "nbOfVotes": 156 },
			{ "star": 4, "rating": 11.8, "nbOfVotes": 22 },
			{ "star": 3, "rating": 1.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 2.2, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Allow Me to Introduce Myself!!!",
		"aired": "2020-04-06T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 977,
		"ratingFiveStars": 80,
		"ratingAllStars": 94.2,
		"nbOfVotes": 140,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1833778&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80, "nbOfVotes": 112 },
			{ "star": 4, "rating": 14.3, "nbOfVotes": 20 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 2 }
		],
		"title": "The Party's Off!!!",
		"aired": "2020-04-13T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 978,
		"ratingFiveStars": 66.7,
		"ratingAllStars": 90.8,
		"nbOfVotes": 108,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1836350&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.7, "nbOfVotes": 72 },
			{ "star": 4, "rating": 24.1, "nbOfVotes": 26 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 2 }
		],
		"title": "Tobiroppo Introduction",
		"aired": "2020-04-27T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 979,
		"ratingFiveStars": 56.9,
		"ratingAllStars": 88.4,
		"nbOfVotes": 109,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1839346&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 56.9, "nbOfVotes": 62 },
			{ "star": 4, "rating": 32.1, "nbOfVotes": 35 },
			{ "star": 3, "rating": 9.2, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "Family Problems",
		"aired": "2020-05-11T00:00:00+00:00",
		"score": 4.42
	},
	{
		"episodeNb": 980,
		"ratingFiveStars": 59.7,
		"ratingAllStars": 87.2,
		"nbOfVotes": 124,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1842005&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.7, "nbOfVotes": 74 },
			{ "star": 4, "rating": 22.6, "nbOfVotes": 28 },
			{ "star": 3, "rating": 13.7, "nbOfVotes": 17 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Takatau Music",
		"aired": "2020-05-25T00:00:00+00:00",
		"score": 4.36
	},
	{
		"episodeNb": 981,
		"ratingFiveStars": 76.2,
		"ratingAllStars": 92.8,
		"nbOfVotes": 143,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1843978&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.2, "nbOfVotes": 109 },
			{ "star": 4, "rating": 14.7, "nbOfVotes": 21 },
			{ "star": 3, "rating": 7, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 2 }
		],
		"title": "Joining the Fight",
		"aired": "2020-07-08T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 982,
		"ratingFiveStars": 66,
		"ratingAllStars": 89.8,
		"nbOfVotes": 100,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1845980&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66, "nbOfVotes": 66 },
			{ "star": 4, "rating": 19, "nbOfVotes": 19 },
			{ "star": 3, "rating": 14, "nbOfVotes": 14 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Ruffian Meets Ruffian",
		"aired": "2020-07-15T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 983,
		"ratingFiveStars": 74.2,
		"ratingAllStars": 93.2,
		"nbOfVotes": 155,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1847135&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.2, "nbOfVotes": 115 },
			{ "star": 4, "rating": 20.6, "nbOfVotes": 32 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 5 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Thunder",
		"aired": "2020-07-22T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 984,
		"ratingFiveStars": 80.2,
		"ratingAllStars": 95,
		"nbOfVotes": 202,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1849795&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.2, "nbOfVotes": 162 },
			{ "star": 4, "rating": 15.3, "nbOfVotes": 31 },
			{ "star": 3, "rating": 4, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "My Bible",
		"aired": "2020-08-06T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 985,
		"ratingFiveStars": 87,
		"ratingAllStars": 96.4,
		"nbOfVotes": 185,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1852498&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87, "nbOfVotes": 161 },
			{ "star": 4, "rating": 9.7, "nbOfVotes": 18 },
			{ "star": 3, "rating": 1.6, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "New Onigashima Project",
		"aired": "2020-08-20T00:00:00+00:00",
		"score": 4.82
	},
	{
		"episodeNb": 986,
		"ratingFiveStars": 80.4,
		"ratingAllStars": 94.2,
		"nbOfVotes": 143,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1855679&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.4, "nbOfVotes": 115 },
			{ "star": 4, "rating": 12.6, "nbOfVotes": 18 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "My Name",
		"aired": "2020-08-03T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 987,
		"ratingFiveStars": 81.8,
		"ratingAllStars": 95.2,
		"nbOfVotes": 154,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1857150&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.8, "nbOfVotes": 126 },
			{ "star": 4, "rating": 14.3, "nbOfVotes": 22 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "The Brocade of Loyal Retainers",
		"aired": "2020-08-11T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 988,
		"ratingFiveStars": 62.7,
		"ratingAllStars": 88.2,
		"nbOfVotes": 118,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1860168&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.7, "nbOfVotes": 74 },
			{ "star": 4, "rating": 24.6, "nbOfVotes": 29 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 6 },
			{ "star": 2, "rating": 5.9, "nbOfVotes": 7 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "Sorry For the Wait",
		"aired": "2020-08-24T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 989,
		"ratingFiveStars": 80.7,
		"ratingAllStars": 94.2,
		"nbOfVotes": 145,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1862660&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.7, "nbOfVotes": 117 },
			{ "star": 4, "rating": 12.4, "nbOfVotes": 18 },
			{ "star": 3, "rating": 4.8, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 1 }
		],
		"title": "I Can't Imagine Losing",
		"aired": "2020-09-07T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 990,
		"ratingFiveStars": 67.9,
		"ratingAllStars": 90.8,
		"nbOfVotes": 112,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1863900&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.9, "nbOfVotes": 76 },
			{ "star": 4, "rating": 22.3, "nbOfVotes": 25 },
			{ "star": 3, "rating": 8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "Army of One",
		"aired": "2020-09-14T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 991,
		"ratingFiveStars": 79,
		"ratingAllStars": 94,
		"nbOfVotes": 105,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1866534&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79, "nbOfVotes": 83 },
			{ "star": 4, "rating": 14.3, "nbOfVotes": 15 },
			{ "star": 3, "rating": 5.7, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1, "nbOfVotes": 1 }
		],
		"title": "Let Us Die!!!",
		"aired": "2020-09-28T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 992,
		"ratingFiveStars": 75.2,
		"ratingAllStars": 93,
		"nbOfVotes": 109,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1870162&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.2, "nbOfVotes": 82 },
			{ "star": 4, "rating": 18.3, "nbOfVotes": 20 },
			{ "star": 3, "rating": 4.6, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 2 }
		],
		"title": "Remnants",
		"aired": "2020-10-17T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 993,
		"ratingFiveStars": 76.7,
		"ratingAllStars": 93.2,
		"nbOfVotes": 116,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1871575&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.7, "nbOfVotes": 89 },
			{ "star": 4, "rating": 16.4, "nbOfVotes": 19 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 2 }
		],
		"title": "The Dream of Wano Country",
		"aired": "2020-10-26T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 994,
		"ratingFiveStars": 70.5,
		"ratingAllStars": 91.8,
		"nbOfVotes": 61,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1873962&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.5, "nbOfVotes": 43 },
			{ "star": 4, "rating": 21.3, "nbOfVotes": 13 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 3 },
			{ "star": 2, "rating": 3.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "My Other Name is Yamato",
		"aired": "2020-11-02T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 995,
		"ratingFiveStars": 78.2,
		"ratingAllStars": 94.2,
		"nbOfVotes": 133,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1875802&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.2, "nbOfVotes": 104 },
			{ "star": 4, "rating": 17.3, "nbOfVotes": 23 },
			{ "star": 3, "rating": 3, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.5, "nbOfVotes": 2 }
		],
		"title": "A Kunoichi's Oath",
		"aired": "2020-11-16T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 996,
		"ratingFiveStars": 76.6,
		"ratingAllStars": 92.6,
		"nbOfVotes": 124,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1876806&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.6, "nbOfVotes": 95 },
			{ "star": 4, "rating": 15.3, "nbOfVotes": 19 },
			{ "star": 3, "rating": 3.2, "nbOfVotes": 4 },
			{ "star": 2, "rating": 4, "nbOfVotes": 5 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 1 }
		],
		"title": "Island of the Strongest",
		"aired": "2020-11-21T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 997,
		"ratingFiveStars": 83.6,
		"ratingAllStars": 95.6,
		"nbOfVotes": 171,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1878255&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.6, "nbOfVotes": 143 },
			{ "star": 4, "rating": 12.3, "nbOfVotes": 21 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Flames",
		"aired": "2020-11-29T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 998,
		"ratingFiveStars": 72.7,
		"ratingAllStars": 91.6,
		"nbOfVotes": 128,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1881244&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.7, "nbOfVotes": 93 },
			{ "star": 4, "rating": 16.4, "nbOfVotes": 21 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 2 }
		],
		"title": "Ancient Types",
		"aired": "2020-12-14T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 999,
		"ratingFiveStars": 84.4,
		"ratingAllStars": 94.6,
		"nbOfVotes": 199,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1882699&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.4, "nbOfVotes": 168 },
			{ "star": 4, "rating": 10.6, "nbOfVotes": 21 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.5, "nbOfVotes": 5 }
		],
		"title": "The Sake I Brewed to Drink With You",
		"aired": "2020-12-21T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 1000,
		"ratingFiveStars": 72.6,
		"ratingAllStars": 84.4,
		"nbOfVotes": 793,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1884759&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.6, "nbOfVotes": 576 },
			{ "star": 4, "rating": 7.7, "nbOfVotes": 61 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 28 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 10 },
			{ "star": 1, "rating": 14.9, "nbOfVotes": 118 }
		],
		"title": "Straw Hat Luffy",
		"aired": "2021-01-04T00:00:00+00:00",
		"score": 4.220000000000001
	},
	{
		"episodeNb": 1001,
		"ratingFiveStars": 88.3,
		"ratingAllStars": 96.2,
		"nbOfVotes": 247,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1889099&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 88.3, "nbOfVotes": 218 },
			{ "star": 4, "rating": 8.1, "nbOfVotes": 20 },
			{ "star": 3, "rating": 1.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 3 }
		],
		"title": "Battle of Monsters on Onigashima",
		"aired": "2021-01-18T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 1002,
		"ratingFiveStars": 85.8,
		"ratingAllStars": 95.6,
		"nbOfVotes": 197,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1892839&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.8, "nbOfVotes": 169 },
			{ "star": 4, "rating": 8.6, "nbOfVotes": 17 },
			{ "star": 3, "rating": 4.1, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 2 }
		],
		"title": "Four Emperors vs. New Generation",
		"aired": "2021-02-01T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 1003,
		"ratingFiveStars": 89.6,
		"ratingAllStars": 96.8,
		"nbOfVotes": 211,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1894860&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 89.6, "nbOfVotes": 189 },
			{ "star": 4, "rating": 7.6, "nbOfVotes": 16 },
			{ "star": 3, "rating": 1.4, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 3 }
		],
		"title": "Night on the Board",
		"aired": "2021-02-08T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 1004,
		"ratingFiveStars": 65.7,
		"ratingAllStars": 89.4,
		"nbOfVotes": 198,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1896830&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.7, "nbOfVotes": 130 },
			{ "star": 4, "rating": 21.7, "nbOfVotes": 43 },
			{ "star": 3, "rating": 9.1, "nbOfVotes": 18 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 2, "nbOfVotes": 4 }
		],
		"title": "Kibi Dango",
		"aired": "2021-02-15T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 1005,
		"ratingFiveStars": 82.8,
		"ratingAllStars": 94,
		"nbOfVotes": 244,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1900884&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.8, "nbOfVotes": 202 },
			{ "star": 4, "rating": 9, "nbOfVotes": 22 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 13 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2, "nbOfVotes": 5 }
		],
		"title": "Devil Child",
		"aired": "2021-03-01T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 1006,
		"ratingFiveStars": 73.4,
		"ratingAllStars": 92.2,
		"nbOfVotes": 188,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1902908&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.4, "nbOfVotes": 138 },
			{ "star": 4, "rating": 18.6, "nbOfVotes": 35 },
			{ "star": 3, "rating": 4.8, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 3 }
		],
		"title": "The Honorable Hyogoro of the Flower",
		"aired": "2021-03-08T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 1007,
		"ratingFiveStars": 71.2,
		"ratingAllStars": 89.4,
		"nbOfVotes": 212,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1904828&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.2, "nbOfVotes": 151 },
			{ "star": 4, "rating": 14.6, "nbOfVotes": 31 },
			{ "star": 3, "rating": 6.6, "nbOfVotes": 14 },
			{ "star": 2, "rating": 4.7, "nbOfVotes": 10 },
			{ "star": 1, "rating": 2.8, "nbOfVotes": 6 }
		],
		"title": "Tanuki-San",
		"aired": "2021-03-15T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 1008,
		"ratingFiveStars": 67.9,
		"ratingAllStars": 90,
		"nbOfVotes": 165,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1908929&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.9, "nbOfVotes": 112 },
			{ "star": 4, "rating": 18.2, "nbOfVotes": 30 },
			{ "star": 3, "rating": 10.9, "nbOfVotes": 18 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Leader of the Mt. Atama Thieves, Ashura Doji",
		"aired": "2021-03-29T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 1009,
		"ratingFiveStars": 87.6,
		"ratingAllStars": 97,
		"nbOfVotes": 201,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1911169&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.6, "nbOfVotes": 176 },
			{ "star": 4, "rating": 10.4, "nbOfVotes": 21 },
			{ "star": 3, "rating": 1.5, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Hell",
		"aired": "2021-04-05T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 1010,
		"ratingFiveStars": 91.9,
		"ratingAllStars": 97,
		"nbOfVotes": 447,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1913410&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 91.9, "nbOfVotes": 411 },
			{ "star": 4, "rating": 4.5, "nbOfVotes": 20 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 6 }
		],
		"title": "Haoshoku",
		"aired": "2021-04-12T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 1011,
		"ratingFiveStars": 64.9,
		"ratingAllStars": 89.8,
		"nbOfVotes": 205,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1917580&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.9, "nbOfVotes": 133 },
			{ "star": 4, "rating": 25.9, "nbOfVotes": 53 },
			{ "star": 3, "rating": 4.9, "nbOfVotes": 10 },
			{ "star": 2, "rating": 2, "nbOfVotes": 4 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 5 }
		],
		"title": "Anko Standards",
		"aired": "2021-04-26T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 1012,
		"ratingFiveStars": 71.8,
		"ratingAllStars": 91.4,
		"nbOfVotes": 177,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1921092&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.8, "nbOfVotes": 127 },
			{ "star": 4, "rating": 18.1, "nbOfVotes": 32 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 3 }
		],
		"title": "Itch",
		"aired": "2021-05-10T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 1013,
		"ratingFiveStars": 76.3,
		"ratingAllStars": 93.2,
		"nbOfVotes": 190,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1922500&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.3, "nbOfVotes": 145 },
			{ "star": 4, "rating": 16.3, "nbOfVotes": 31 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Anarchy In The B.M.",
		"aired": "2021-05-17T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 1014,
		"ratingFiveStars": 84.8,
		"ratingAllStars": 95.8,
		"nbOfVotes": 231,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1926235&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.8, "nbOfVotes": 196 },
			{ "star": 4, "rating": 11.3, "nbOfVotes": 26 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.4, "nbOfVotes": 1 }
		],
		"title": "Life's Lousy Actor",
		"aired": "2021-05-31T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 1015,
		"ratingFiveStars": 80.1,
		"ratingAllStars": 94.4,
		"nbOfVotes": 236,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1927896&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.1, "nbOfVotes": 189 },
			{ "star": 4, "rating": 13.6, "nbOfVotes": 32 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 12 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 2 }
		],
		"title": "Chains",
		"aired": "2021-06-07T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 1016,
		"ratingFiveStars": 72.5,
		"ratingAllStars": 92.2,
		"nbOfVotes": 182,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1929608&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.5, "nbOfVotes": 132 },
			{ "star": 4, "rating": 20.9, "nbOfVotes": 38 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 6 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 3 }
		],
		"title": "This is O-Tama!!",
		"aired": "2021-06-14T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 1017,
		"ratingFiveStars": 77.3,
		"ratingAllStars": 93.8,
		"nbOfVotes": 198,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1933253&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.3, "nbOfVotes": 153 },
			{ "star": 4, "rating": 16.2, "nbOfVotes": 32 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 1 }
		],
		"title": "Orders",
		"aired": "2021-06-28T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 1018,
		"ratingFiveStars": 77,
		"ratingAllStars": 93.6,
		"nbOfVotes": 174,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1935510&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77, "nbOfVotes": 134 },
			{ "star": 4, "rating": 16.1, "nbOfVotes": 28 },
			{ "star": 3, "rating": 5.2, "nbOfVotes": 9 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Jinbe vs. Who's-Who",
		"aired": "2021-07-05T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 1019,
		"ratingFiveStars": 62.6,
		"ratingAllStars": 88.8,
		"nbOfVotes": 171,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1939647&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 62.6, "nbOfVotes": 107 },
			{ "star": 4, "rating": 25.1, "nbOfVotes": 43 },
			{ "star": 3, "rating": 8.2, "nbOfVotes": 14 },
			{ "star": 2, "rating": 2.3, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.8, "nbOfVotes": 3 }
		],
		"title": "Heliceratops",
		"aired": "2021-07-19T00:00:00+00:00",
		"score": 4.4399999999999995
	},
	{
		"episodeNb": 1020,
		"ratingFiveStars": 73.8,
		"ratingAllStars": 92.2,
		"nbOfVotes": 187,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1943844&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.8, "nbOfVotes": 138 },
			{ "star": 4, "rating": 17.1, "nbOfVotes": 32 },
			{ "star": 3, "rating": 7, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 2 }
		],
		"title": "Robin vs. Black Maria",
		"aired": "2021-08-02T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 1021,
		"ratingFiveStars": 78.5,
		"ratingAllStars": 93,
		"nbOfVotes": 209,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1945917&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.5, "nbOfVotes": 164 },
			{ "star": 4, "rating": 13.9, "nbOfVotes": 29 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 3 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 5 }
		],
		"title": "Demonio",
		"aired": "2021-08-10T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1022,
		"ratingFiveStars": 85.5,
		"ratingAllStars": 95.6,
		"nbOfVotes": 214,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1949804&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.5, "nbOfVotes": 183 },
			{ "star": 4, "rating": 9.3, "nbOfVotes": 20 },
			{ "star": 3, "rating": 3.7, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 3 }
		],
		"title": "The Stars Take the Stage",
		"aired": "2021-08-23T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 1023,
		"ratingFiveStars": 87.4,
		"ratingAllStars": 96.2,
		"nbOfVotes": 246,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1951686&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.4, "nbOfVotes": 215 },
			{ "star": 4, "rating": 8.5, "nbOfVotes": 21 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 2 }
		],
		"title": "Two Peas in a Pod",
		"aired": "2021-08-30T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 1024,
		"ratingFiveStars": 73,
		"ratingAllStars": 92.8,
		"nbOfVotes": 174,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1953380&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73, "nbOfVotes": 127 },
			{ "star": 4, "rating": 21.3, "nbOfVotes": 37 },
			{ "star": 3, "rating": 4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 2 }
		],
		"title": "Absol Absolved!",
		"aired": "2021-09-06T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 1025,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 94,
		"nbOfVotes": 207,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1955256&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 161 },
			{ "star": 4, "rating": 16.9, "nbOfVotes": 35 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 2 }
		],
		"title": "Twin Dragons Painting",
		"aired": "2021-09-13T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 1026,
		"ratingFiveStars": 84.6,
		"ratingAllStars": 95.6,
		"nbOfVotes": 208,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1958726&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.6, "nbOfVotes": 176 },
			{ "star": 4, "rating": 11.5, "nbOfVotes": 24 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 5 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 3 }
		],
		"title": "The Pivotal Clash",
		"aired": "2021-09-27T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 1027,
		"ratingFiveStars": 67.7,
		"ratingAllStars": 90.8,
		"nbOfVotes": 155,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1960646&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.7, "nbOfVotes": 105 },
			{ "star": 4, "rating": 20.6, "nbOfVotes": 32 },
			{ "star": 3, "rating": 9.7, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 1 }
		],
		"title": "Danger Beyond Imagining",
		"aired": "2021-10-04T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 1028,
		"ratingFiveStars": 76,
		"ratingAllStars": 93.2,
		"nbOfVotes": 200,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1962663&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76, "nbOfVotes": 152 },
			{ "star": 4, "rating": 17.5, "nbOfVotes": 35 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 7 },
			{ "star": 2, "rating": 2, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1, "nbOfVotes": 2 }
		],
		"title": "Brachiojaurus",
		"aired": "2021-10-11T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 1029,
		"ratingFiveStars": 74.6,
		"ratingAllStars": 93,
		"nbOfVotes": 173,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1966286&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.6, "nbOfVotes": 129 },
			{ "star": 4, "rating": 19.7, "nbOfVotes": 34 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 3 }
		],
		"title": "The Tower",
		"aired": "2021-10-25T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1030,
		"ratingFiveStars": 50,
		"ratingAllStars": 76.2,
		"nbOfVotes": 248,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1967913&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 50, "nbOfVotes": 124 },
			{ "star": 4, "rating": 16.5, "nbOfVotes": 41 },
			{ "star": 3, "rating": 12.1, "nbOfVotes": 30 },
			{ "star": 2, "rating": 7.3, "nbOfVotes": 18 },
			{ "star": 1, "rating": 14.1, "nbOfVotes": 35 }
		],
		"title": "Echoing the Impermanence of All Things",
		"aired": "2021-11-01T00:00:00+00:00",
		"score": 3.81
	},
	{
		"episodeNb": 1031,
		"ratingFiveStars": 77.8,
		"ratingAllStars": 89.6,
		"nbOfVotes": 275,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1969769&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.8, "nbOfVotes": 214 },
			{ "star": 4, "rating": 10.5, "nbOfVotes": 29 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 8.7, "nbOfVotes": 24 }
		],
		"title": "Warrior of Science",
		"aired": "2021-11-08T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 1032,
		"ratingFiveStars": 65.6,
		"ratingAllStars": 90.4,
		"nbOfVotes": 160,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1973018&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.6, "nbOfVotes": 105 },
			{ "star": 4, "rating": 25, "nbOfVotes": 40 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 2 }
		],
		"title": "Oden's Beloved Blade",
		"aired": "2021-11-22T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 1033,
		"ratingFiveStars": 90.6,
		"ratingAllStars": 97,
		"nbOfVotes": 254,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1974657&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.6, "nbOfVotes": 230 },
			{ "star": 4, "rating": 6.3, "nbOfVotes": 16 },
			{ "star": 3, "rating": 1.6, "nbOfVotes": 4 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 2 }
		],
		"title": "Shimotsuki Kozaburo",
		"aired": "2021-11-29T00:00:00+00:00",
		"score": 4.85
	},
	{
		"episodeNb": 1034,
		"ratingFiveStars": 72.6,
		"ratingAllStars": 90.8,
		"nbOfVotes": 168,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1976319&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.6, "nbOfVotes": 122 },
			{ "star": 4, "rating": 14.3, "nbOfVotes": 24 },
			{ "star": 3, "rating": 10.1, "nbOfVotes": 17 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 3, "nbOfVotes": 5 }
		],
		"title": "Sanji vs. Queen",
		"aired": "2021-12-06T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 1035,
		"ratingFiveStars": 83.8,
		"ratingAllStars": 94.2,
		"nbOfVotes": 229,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1979755&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.8, "nbOfVotes": 192 },
			{ "star": 4, "rating": 10.9, "nbOfVotes": 25 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 3.5, "nbOfVotes": 8 }
		],
		"title": "Zoro vs. King",
		"aired": "2021-12-20T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 1036,
		"ratingFiveStars": 76.1,
		"ratingAllStars": 92.2,
		"nbOfVotes": 197,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1981783&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.1, "nbOfVotes": 150 },
			{ "star": 4, "rating": 16.2, "nbOfVotes": 32 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 3, "nbOfVotes": 6 }
		],
		"title": "Bushido is the Way of Death",
		"aired": "2022-01-04T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 1037,
		"ratingFiveStars": 85.8,
		"ratingAllStars": 96.2,
		"nbOfVotes": 239,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1986613&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.8, "nbOfVotes": 205 },
			{ "star": 4, "rating": 11.7, "nbOfVotes": 28 },
			{ "star": 3, "rating": 1.3, "nbOfVotes": 3 },
			{ "star": 2, "rating": 0, "nbOfVotes": 0 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 3 }
		],
		"title": "Shuron Hakke",
		"aired": "2022-01-17T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 1038,
		"ratingFiveStars": 68.9,
		"ratingAllStars": 89.4,
		"nbOfVotes": 180,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1989910&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.9, "nbOfVotes": 124 },
			{ "star": 4, "rating": 17.8, "nbOfVotes": 32 },
			{ "star": 3, "rating": 8.3, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 3 },
			{ "star": 1, "rating": 3.3, "nbOfVotes": 6 }
		],
		"title": "Kid & Law vs. Big Mom",
		"aired": "2022-01-31T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 1039,
		"ratingFiveStars": 80.4,
		"ratingAllStars": 92,
		"nbOfVotes": 240,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1991601&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.4, "nbOfVotes": 193 },
			{ "star": 4, "rating": 9.6, "nbOfVotes": 23 },
			{ "star": 3, "rating": 4.2, "nbOfVotes": 10 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 2 },
			{ "star": 1, "rating": 5, "nbOfVotes": 12 }
		],
		"title": "Top Billing",
		"aired": "2022-02-07T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 1040,
		"ratingFiveStars": 81.7,
		"ratingAllStars": 93,
		"nbOfVotes": 273,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1993415&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.7, "nbOfVotes": 223 },
			{ "star": 4, "rating": 9.9, "nbOfVotes": 27 },
			{ "star": 3, "rating": 4, "nbOfVotes": 11 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 2 },
			{ "star": 1, "rating": 3.7, "nbOfVotes": 10 }
		],
		"title": "Wasted Words on Young Ears",
		"aired": "2022-02-14T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1041,
		"ratingFiveStars": 81.5,
		"ratingAllStars": 93.4,
		"nbOfVotes": 205,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1996906&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.5, "nbOfVotes": 167 },
			{ "star": 4, "rating": 11.2, "nbOfVotes": 23 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 7 },
			{ "star": 2, "rating": 1, "nbOfVotes": 2 },
			{ "star": 1, "rating": 2.9, "nbOfVotes": 6 }
		],
		"title": "Komurasaki",
		"aired": "2022-02-28T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 1042,
		"ratingFiveStars": 82.6,
		"ratingAllStars": 93,
		"nbOfVotes": 281,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=1998532&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.6, "nbOfVotes": 232 },
			{ "star": 4, "rating": 9.3, "nbOfVotes": 26 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 8 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 5 },
			{ "star": 1, "rating": 3.6, "nbOfVotes": 10 }
		],
		"title": "The Victor Needs No Epithet",
		"aired": "2022-03-07T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1043,
		"ratingFiveStars": 87.4,
		"ratingAllStars": 94.4,
		"nbOfVotes": 494,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2000132&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.4, "nbOfVotes": 432 },
			{ "star": 4, "rating": 4.9, "nbOfVotes": 24 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 12 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 12 },
			{ "star": 1, "rating": 2.8, "nbOfVotes": 14 }
		],
		"title": "Let's Face Death Together!!!",
		"aired": "2022-03-14T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 1044,
		"ratingFiveStars": 75.7,
		"ratingAllStars": 84.8,
		"nbOfVotes": 1134,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2003027&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.7, "nbOfVotes": 859 },
			{ "star": 4, "rating": 4.4, "nbOfVotes": 50 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 29 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 30 },
			{ "star": 1, "rating": 14.6, "nbOfVotes": 166 }
		],
		"title": "Warrior of Liberation",
		"aired": "2022-03-28T00:00:00+00:00",
		"score": 4.24
	},
	{
		"episodeNb": 1045,
		"ratingFiveStars": 79.9,
		"ratingAllStars": 89.6,
		"nbOfVotes": 527,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2004635&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.9, "nbOfVotes": 421 },
			{ "star": 4, "rating": 6.6, "nbOfVotes": 35 },
			{ "star": 3, "rating": 3, "nbOfVotes": 16 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 11 },
			{ "star": 1, "rating": 8.3, "nbOfVotes": 44 }
		],
		"title": "Next Level",
		"aired": "2022-04-04T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 1046,
		"ratingFiveStars": 68.4,
		"ratingAllStars": 89.2,
		"nbOfVotes": 266,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2006502&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68.4, "nbOfVotes": 182 },
			{ "star": 4, "rating": 21.1, "nbOfVotes": 56 },
			{ "star": 3, "rating": 4.5, "nbOfVotes": 12 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 5.6, "nbOfVotes": 15 }
		],
		"title": "Raizo",
		"aired": "2022-04-11T00:00:00+00:00",
		"score": 4.46
	},
	{
		"episodeNb": 1047,
		"ratingFiveStars": 73.5,
		"ratingAllStars": 90.2,
		"nbOfVotes": 215,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2010556&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.5, "nbOfVotes": 158 },
			{ "star": 4, "rating": 14.4, "nbOfVotes": 31 },
			{ "star": 3, "rating": 6, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 4 },
			{ "star": 1, "rating": 4.2, "nbOfVotes": 9 }
		],
		"title": "The Sky Over the Capital",
		"aired": "2022-04-25T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 1048,
		"ratingFiveStars": 52.9,
		"ratingAllStars": 82,
		"nbOfVotes": 225,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2014219&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 52.9, "nbOfVotes": 119 },
			{ "star": 4, "rating": 22.7, "nbOfVotes": 51 },
			{ "star": 3, "rating": 13.3, "nbOfVotes": 30 },
			{ "star": 2, "rating": 4, "nbOfVotes": 9 },
			{ "star": 1, "rating": 7.1, "nbOfVotes": 16 }
		],
		"title": "Twenty Years",
		"aired": "2022-05-09T00:00:00+00:00",
		"score": 4.1
	},
	{
		"episodeNb": 1049,
		"ratingFiveStars": 74.5,
		"ratingAllStars": 89.6,
		"nbOfVotes": 306,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2015695&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.5, "nbOfVotes": 228 },
			{ "star": 4, "rating": 13.1, "nbOfVotes": 40 },
			{ "star": 3, "rating": 3.9, "nbOfVotes": 12 },
			{ "star": 2, "rating": 2.6, "nbOfVotes": 8 },
			{ "star": 1, "rating": 5.9, "nbOfVotes": 18 }
		],
		"title": "The World That Should Be",
		"aired": "2022-05-16T00:00:00+00:00",
		"score": 4.4799999999999995
	},
	{
		"episodeNb": 1050,
		"ratingFiveStars": 59.8,
		"ratingAllStars": 85.2,
		"nbOfVotes": 368,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2018632&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 59.8, "nbOfVotes": 220 },
			{ "star": 4, "rating": 19.8, "nbOfVotes": 73 },
			{ "star": 3, "rating": 12, "nbOfVotes": 44 },
			{ "star": 2, "rating": 3.3, "nbOfVotes": 12 },
			{ "star": 1, "rating": 5.2, "nbOfVotes": 19 }
		],
		"title": "Honor",
		"aired": "2022-05-30T00:00:00+00:00",
		"score": 4.26
	},
	{
		"episodeNb": 1051,
		"ratingFiveStars": 82.5,
		"ratingAllStars": 93.8,
		"nbOfVotes": 338,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2020076&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.5, "nbOfVotes": 279 },
			{ "star": 4, "rating": 10.4, "nbOfVotes": 35 },
			{ "star": 3, "rating": 3, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 5 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 9 }
		],
		"title": "Shogun of Wano Country, Kozuki Momonosuke",
		"aired": "2022-06-06T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 1052,
		"ratingFiveStars": 73.4,
		"ratingAllStars": 89.4,
		"nbOfVotes": 323,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2021484&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.4, "nbOfVotes": 237 },
			{ "star": 4, "rating": 13, "nbOfVotes": 42 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 19 },
			{ "star": 2, "rating": 2.8, "nbOfVotes": 9 },
			{ "star": 1, "rating": 5, "nbOfVotes": 16 }
		],
		"title": "A New Morning",
		"aired": "2022-06-13T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 1053,
		"ratingFiveStars": 81.5,
		"ratingAllStars": 93.2,
		"nbOfVotes": 421,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2022904&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.5, "nbOfVotes": 343 },
			{ "star": 4, "rating": 10.9, "nbOfVotes": 46 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 6 },
			{ "star": 1, "rating": 3.1, "nbOfVotes": 13 }
		],
		"title": "New Emperors",
		"aired": "2022-06-20T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 1054,
		"ratingFiveStars": 83.1,
		"ratingAllStars": 93.4,
		"nbOfVotes": 409,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2031441&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.1, "nbOfVotes": 340 },
			{ "star": 4, "rating": 9.3, "nbOfVotes": 38 },
			{ "star": 3, "rating": 2.4, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 7 },
			{ "star": 1, "rating": 3.4, "nbOfVotes": 14 }
		],
		"title": "Flame Emperor",
		"aired": "2022-07-25T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 1055,
		"ratingFiveStars": 78.6,
		"ratingAllStars": 93,
		"nbOfVotes": 327,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2033218&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.6, "nbOfVotes": 257 },
			{ "star": 4, "rating": 14.1, "nbOfVotes": 46 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 10 },
			{ "star": 2, "rating": 1.8, "nbOfVotes": 6 },
			{ "star": 1, "rating": 2.4, "nbOfVotes": 8 }
		],
		"title": "The New Era",
		"aired": "2022-08-01T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1056,
		"ratingFiveStars": 72.5,
		"ratingAllStars": 91.6,
		"nbOfVotes": 527,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2035423&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.5, "nbOfVotes": 382 },
			{ "star": 4, "rating": 20.3, "nbOfVotes": 107 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 9 },
			{ "star": 1, "rating": 2.7, "nbOfVotes": 14 }
		],
		"title": "Cross Guild",
		"aired": "2022-08-08T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 1057,
		"ratingFiveStars": 53.2,
		"ratingAllStars": 80,
		"nbOfVotes": 924,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2038442&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 53.2, "nbOfVotes": 492 },
			{ "star": 4, "rating": 18.4, "nbOfVotes": 170 },
			{ "star": 3, "rating": 13.1, "nbOfVotes": 121 },
			{ "star": 2, "rating": 5.5, "nbOfVotes": 51 },
			{ "star": 1, "rating": 9.7, "nbOfVotes": 90 }
		],
		"title": "The End",
		"aired": "2022-08-22T00:00:00+00:00",
		"score": 4
	},
	{
		"episodeNb": 1058,
		"ratingFiveStars": 73.6,
		"ratingAllStars": 93,
		"nbOfVotes": 1867,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2040226&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.6, "nbOfVotes": 1375 },
			{ "star": 4, "rating": 20.5, "nbOfVotes": 383 },
			{ "star": 3, "rating": 4.1, "nbOfVotes": 76 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 15 },
			{ "star": 1, "rating": 1, "nbOfVotes": 18 }
		],
		"title": "New Emperor",
		"aired": "2022-08-29T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1059,
		"ratingFiveStars": 80.8,
		"ratingAllStars": 95,
		"nbOfVotes": 1234,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2043255&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.8, "nbOfVotes": 997 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 188 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 32 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 6 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 11 }
		],
		"title": "The Matter Involving Captain Koby",
		"aired": "2022-09-12T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 1060,
		"ratingFiveStars": 84.3,
		"ratingAllStars": 95.2,
		"nbOfVotes": 1462,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2044797&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.3, "nbOfVotes": 1232 },
			{ "star": 4, "rating": 11.1, "nbOfVotes": 162 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 33 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 12 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 23 }
		],
		"title": "Luffy's Dream",
		"aired": "2022-09-19T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 1061,
		"ratingFiveStars": 74.3,
		"ratingAllStars": 93,
		"nbOfVotes": 1239,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2046650&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.3, "nbOfVotes": 920 },
			{ "star": 4, "rating": 19, "nbOfVotes": 235 },
			{ "star": 3, "rating": 5, "nbOfVotes": 62 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 9 },
			{ "star": 1, "rating": 1, "nbOfVotes": 13 }
		],
		"title": "Future Island Egghead",
		"aired": "2022-09-26T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1062,
		"ratingFiveStars": 65.8,
		"ratingAllStars": 91,
		"nbOfVotes": 849,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2049490&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.8, "nbOfVotes": 559 },
			{ "star": 4, "rating": 26, "nbOfVotes": 221 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 52 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 8 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 9 }
		],
		"title": "Adventure in the Land of Science",
		"aired": "2022-10-11T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 1063,
		"ratingFiveStars": 71.3,
		"ratingAllStars": 92.6,
		"nbOfVotes": 830,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2051066&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.3, "nbOfVotes": 592 },
			{ "star": 4, "rating": 22.3, "nbOfVotes": 185 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 42 },
			{ "star": 2, "rating": 1, "nbOfVotes": 8 },
			{ "star": 1, "rating": 0.4, "nbOfVotes": 3 }
		],
		"title": "My Only Family",
		"aired": "2022-10-17T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 1064,
		"ratingFiveStars": 69.9,
		"ratingAllStars": 92,
		"nbOfVotes": 843,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2052615&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.9, "nbOfVotes": 589 },
			{ "star": 4, "rating": 23.1, "nbOfVotes": 195 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 45 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 5 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 9 }
		],
		"title": "Egghead Labophase",
		"aired": "2022-10-24T00:00:00+00:00",
		"score": 4.6
	},
	{
		"episodeNb": 1065,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 91,
		"nbOfVotes": 730,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2055460&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 492 },
			{ "star": 4, "rating": 23.2, "nbOfVotes": 169 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 52 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 12 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 5 }
		],
		"title": "Six Vegapunks",
		"aired": "2022-11-07T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 1066,
		"ratingFiveStars": 81.8,
		"ratingAllStars": 95.2,
		"nbOfVotes": 879,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2056716&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.8, "nbOfVotes": 719 },
			{ "star": 4, "rating": 13.9, "nbOfVotes": 122 },
			{ "star": 3, "rating": 3, "nbOfVotes": 26 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 7 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 5 }
		],
		"title": "The Will of Ohara",
		"aired": "2022-11-14T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 1067,
		"ratingFiveStars": 68,
		"ratingAllStars": 91.4,
		"nbOfVotes": 668,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2057983&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 68, "nbOfVotes": 454 },
			{ "star": 4, "rating": 24.3, "nbOfVotes": 162 },
			{ "star": 3, "rating": 5.4, "nbOfVotes": 36 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 9 },
			{ "star": 1, "rating": 1, "nbOfVotes": 7 }
		],
		"title": "Punk Records",
		"aired": "2022-11-21T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 1068,
		"ratingFiveStars": 66,
		"ratingAllStars": 91.4,
		"nbOfVotes": 573,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2060659&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66, "nbOfVotes": 378 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 152 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 35 },
			{ "star": 2, "rating": 1, "nbOfVotes": 6 },
			{ "star": 1, "rating": 0.3, "nbOfVotes": 2 }
		],
		"title": "A Genius's Dream",
		"aired": "2022-12-05T00:00:00+00:00",
		"score": 4.57
	},
	{
		"episodeNb": 1069,
		"ratingFiveStars": 77.1,
		"ratingAllStars": 93.6,
		"nbOfVotes": 783,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2062038&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77.1, "nbOfVotes": 604 },
			{ "star": 4, "rating": 17.6, "nbOfVotes": 138 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 22 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 10 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 9 }
		],
		"title": "All Things Are Brought Into This World With Hope",
		"aired": "2022-12-12T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 1070,
		"ratingFiveStars": 70.2,
		"ratingAllStars": 91.8,
		"nbOfVotes": 681,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2064678&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.2, "nbOfVotes": 478 },
			{ "star": 4, "rating": 22.8, "nbOfVotes": 155 },
			{ "star": 3, "rating": 4.6, "nbOfVotes": 31 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 6 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 11 }
		],
		"title": "The Strongest Form of Humanity",
		"aired": "2022-12-26T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 1071,
		"ratingFiveStars": 74.3,
		"ratingAllStars": 92.8,
		"nbOfVotes": 807,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2066379&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.3, "nbOfVotes": 600 },
			{ "star": 4, "rating": 18.6, "nbOfVotes": 150 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 41 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 9 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 7 }
		],
		"title": "The Hero Deploys",
		"aired": "2023-01-07T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 1072,
		"ratingFiveStars": 65.7,
		"ratingAllStars": 91,
		"nbOfVotes": 612,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2070601&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.7, "nbOfVotes": 402 },
			{ "star": 4, "rating": 26.1, "nbOfVotes": 160 },
			{ "star": 3, "rating": 6.7, "nbOfVotes": 41 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1, "nbOfVotes": 6 }
		],
		"title": "The Weight of Memory",
		"aired": "2023-01-23T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 1073,
		"ratingFiveStars": 71.5,
		"ratingAllStars": 92.4,
		"nbOfVotes": 655,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2072201&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.5, "nbOfVotes": 468 },
			{ "star": 4, "rating": 21.8, "nbOfVotes": 143 },
			{ "star": 3, "rating": 5.3, "nbOfVotes": 35 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 6 }
		],
		"title": "Miss Buckingham Stussy",
		"aired": "2023-01-30T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 1074,
		"ratingFiveStars": 65.7,
		"ratingAllStars": 90.8,
		"nbOfVotes": 505,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2075071&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.7, "nbOfVotes": 332 },
			{ "star": 4, "rating": 25.3, "nbOfVotes": 128 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 37 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1, "nbOfVotes": 5 }
		],
		"title": "Mark III",
		"aired": "2023-02-13T00:00:00+00:00",
		"score": 4.54
	},
	{
		"episodeNb": 1075,
		"ratingFiveStars": 60.1,
		"ratingAllStars": 88.2,
		"nbOfVotes": 514,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2076540&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.1, "nbOfVotes": 309 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 136 },
			{ "star": 3, "rating": 10.1, "nbOfVotes": 52 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 6 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 11 }
		],
		"title": "Labophase Death Game",
		"aired": "2023-02-20T00:00:00+00:00",
		"score": 4.41
	},
	{
		"episodeNb": 1076,
		"ratingFiveStars": 75.7,
		"ratingAllStars": 93.6,
		"nbOfVotes": 651,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2077882&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.7, "nbOfVotes": 493 },
			{ "star": 4, "rating": 18.3, "nbOfVotes": 119 },
			{ "star": 3, "rating": 4.8, "nbOfVotes": 31 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 5 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 3 }
		],
		"title": "Old Friends",
		"aired": "2023-02-27T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 1077,
		"ratingFiveStars": 63.9,
		"ratingAllStars": 89.8,
		"nbOfVotes": 518,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2080475&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 63.9, "nbOfVotes": 331 },
			{ "star": 4, "rating": 26.1, "nbOfVotes": 135 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 35 },
			{ "star": 2, "rating": 1.9, "nbOfVotes": 10 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 7 }
		],
		"title": "Should Have Noticed Sooner",
		"aired": "2023-03-13T00:00:00+00:00",
		"score": 4.49
	},
	{
		"episodeNb": 1078,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 90,
		"nbOfVotes": 565,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2081686&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 381 },
			{ "star": 4, "rating": 20.2, "nbOfVotes": 114 },
			{ "star": 3, "rating": 8.7, "nbOfVotes": 49 },
			{ "star": 2, "rating": 2.1, "nbOfVotes": 12 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 9 }
		],
		"title": "Escape Limit",
		"aired": "2023-03-20T00:00:00+00:00",
		"score": 4.5
	},
	{
		"episodeNb": 1079,
		"ratingFiveStars": 85.7,
		"ratingAllStars": 95.2,
		"nbOfVotes": 897,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2083000&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 85.7, "nbOfVotes": 769 },
			{ "star": 4, "rating": 8.7, "nbOfVotes": 78 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 22 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 15 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 13 }
		],
		"title": "The Emperor's Crew, The Red Hair Pirates",
		"aired": "2023-03-27T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 1080,
		"ratingFiveStars": 82.2,
		"ratingAllStars": 95.2,
		"nbOfVotes": 854,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2085927&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.2, "nbOfVotes": 702 },
			{ "star": 4, "rating": 13.8, "nbOfVotes": 118 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 20 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 9 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 5 }
		],
		"title": "The Hero of Legend",
		"aired": "2023-04-10T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 1081,
		"ratingFiveStars": 78.9,
		"ratingAllStars": 94.2,
		"nbOfVotes": 667,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2088721&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.9, "nbOfVotes": 526 },
			{ "star": 4, "rating": 15.9, "nbOfVotes": 106 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 23 },
			{ "star": 2, "rating": 1, "nbOfVotes": 7 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 5 }
		],
		"title": "Tenth Ship Captain of the Blackbeard Pirates, Kuzan",
		"aired": "2023-04-24T00:00:00+00:00",
		"score": 4.71
	},
	{
		"episodeNb": 1082,
		"ratingFiveStars": 74.8,
		"ratingAllStars": 93.4,
		"nbOfVotes": 630,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2090578&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.8, "nbOfVotes": 471 },
			{ "star": 4, "rating": 20.8, "nbOfVotes": 131 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 14 },
			{ "star": 2, "rating": 1, "nbOfVotes": 6 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 8 }
		],
		"title": "Let's Go and Take It!!",
		"aired": "2023-05-08T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 1083,
		"ratingFiveStars": 65.9,
		"ratingAllStars": 90.2,
		"nbOfVotes": 410,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2092673&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65.9, "nbOfVotes": 270 },
			{ "star": 4, "rating": 24.1, "nbOfVotes": 99 },
			{ "star": 3, "rating": 6.6, "nbOfVotes": 27 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 10 },
			{ "star": 1, "rating": 1, "nbOfVotes": 4 }
		],
		"title": "The Truth of That Day",
		"aired": "2023-05-15T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 1084,
		"ratingFiveStars": 81.8,
		"ratingAllStars": 95,
		"nbOfVotes": 721,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2093758&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.8, "nbOfVotes": 590 },
			{ "star": 4, "rating": 13.6, "nbOfVotes": 98 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 21 },
			{ "star": 2, "rating": 1, "nbOfVotes": 7 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 5 }
		],
		"title": "The Attempted Murder of a Celestial Dragon",
		"aired": "2023-05-22T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 1085,
		"ratingFiveStars": 86.8,
		"ratingAllStars": 96,
		"nbOfVotes": 725,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2096367&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 86.8, "nbOfVotes": 629 },
			{ "star": 4, "rating": 9.5, "nbOfVotes": 69 },
			{ "star": 3, "rating": 1.8, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 9 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 5 }
		],
		"title": "The Death of Nefertari Cobra",
		"aired": "2023-06-05T00:00:00+00:00",
		"score": 4.8
	},
	{
		"episodeNb": 1086,
		"ratingFiveStars": 84,
		"ratingAllStars": 95.4,
		"nbOfVotes": 894,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2098089&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84, "nbOfVotes": 751 },
			{ "star": 4, "rating": 11.4, "nbOfVotes": 102 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 21 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 14 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 6 }
		],
		"title": "The Five Elders",
		"aired": "2023-06-12T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 1087,
		"ratingFiveStars": 72.7,
		"ratingAllStars": 92.6,
		"nbOfVotes": 579,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2105351&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.7, "nbOfVotes": 421 },
			{ "star": 4, "rating": 20.7, "nbOfVotes": 120 },
			{ "star": 3, "rating": 4.7, "nbOfVotes": 27 },
			{ "star": 2, "rating": 1, "nbOfVotes": 6 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 5 }
		],
		"title": "Battleship Bags",
		"aired": "2023-07-17T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 1088,
		"ratingFiveStars": 81.3,
		"ratingAllStars": 94.4,
		"nbOfVotes": 752,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2106898&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.3, "nbOfVotes": 611 },
			{ "star": 4, "rating": 13.2, "nbOfVotes": 99 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 19 },
			{ "star": 2, "rating": 2.4, "nbOfVotes": 18 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 5 }
		],
		"title": "Final Lesson",
		"aired": "2023-07-24T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 1089,
		"ratingFiveStars": 77,
		"ratingAllStars": 93.6,
		"nbOfVotes": 625,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2109526&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77, "nbOfVotes": 481 },
			{ "star": 4, "rating": 16.5, "nbOfVotes": 103 },
			{ "star": 3, "rating": 4.8, "nbOfVotes": 30 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 7 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 4 }
		],
		"title": "Hostage Situation",
		"aired": "2023-08-07T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 1090,
		"ratingFiveStars": 73.6,
		"ratingAllStars": 92.8,
		"nbOfVotes": 678,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2111207&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.6, "nbOfVotes": 499 },
			{ "star": 4, "rating": 20.2, "nbOfVotes": 137 },
			{ "star": 3, "rating": 4.3, "nbOfVotes": 29 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 6 },
			{ "star": 1, "rating": 1, "nbOfVotes": 7 }
		],
		"title": "Kizaru",
		"aired": "2023-08-21T00:00:00+00:00",
		"score": 4.64
	},
	{
		"episodeNb": 1091,
		"ratingFiveStars": 73.9,
		"ratingAllStars": 93,
		"nbOfVotes": 605,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2113856&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.9, "nbOfVotes": 447 },
			{ "star": 4, "rating": 20.5, "nbOfVotes": 124 },
			{ "star": 3, "rating": 3.3, "nbOfVotes": 20 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 7 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 7 }
		],
		"title": "Sentomaru",
		"aired": "2023-09-04T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1092,
		"ratingFiveStars": 73.4,
		"ratingAllStars": 93.2,
		"nbOfVotes": 549,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2116649&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.4, "nbOfVotes": 403 },
			{ "star": 4, "rating": 21.3, "nbOfVotes": 117 },
			{ "star": 3, "rating": 3.8, "nbOfVotes": 21 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 5 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 3 }
		],
		"title": "Kuma the Tyrant's Holy Land Rampage",
		"aired": "2023-09-18T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 1093,
		"ratingFiveStars": 66.4,
		"ratingAllStars": 90.4,
		"nbOfVotes": 521,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2118006&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 66.4, "nbOfVotes": 346 },
			{ "star": 4, "rating": 23.4, "nbOfVotes": 122 },
			{ "star": 3, "rating": 7.9, "nbOfVotes": 41 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1.9, "nbOfVotes": 10 }
		],
		"title": "Luffy vs. Kizaru",
		"aired": "2023-09-25T00:00:00+00:00",
		"score": 4.5200000000000005
	},
	{
		"episodeNb": 1094,
		"ratingFiveStars": 78.1,
		"ratingAllStars": 94,
		"nbOfVotes": 576,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2120993&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.1, "nbOfVotes": 450 },
			{ "star": 4, "rating": 16.1, "nbOfVotes": 93 },
			{ "star": 3, "rating": 4, "nbOfVotes": 23 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 5 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 5 }
		],
		"title": "Five Elders, Warrior God of Science and Defense, Saint Jaygarcia Saturn",
		"aired": "2023-10-09T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 1095,
		"ratingFiveStars": 79.9,
		"ratingAllStars": 94.4,
		"nbOfVotes": 675,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2122385&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.9, "nbOfVotes": 539 },
			{ "star": 4, "rating": 15.4, "nbOfVotes": 104 },
			{ "star": 3, "rating": 2.5, "nbOfVotes": 17 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 9 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 6 }
		],
		"title": "Better Off Dead in This World",
		"aired": "2023-10-16T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 1096,
		"ratingFiveStars": 80.8,
		"ratingAllStars": 94.4,
		"nbOfVotes": 631,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2125153&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.8, "nbOfVotes": 510 },
			{ "star": 4, "rating": 13.8, "nbOfVotes": 87 },
			{ "star": 3, "rating": 3, "nbOfVotes": 19 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 9 },
			{ "star": 1, "rating": 1, "nbOfVotes": 6 }
		],
		"title": "Kumachi",
		"aired": "2023-10-30T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 1097,
		"ratingFiveStars": 72.3,
		"ratingAllStars": 92.4,
		"nbOfVotes": 491,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2126803&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.3, "nbOfVotes": 355 },
			{ "star": 4, "rating": 19.1, "nbOfVotes": 94 },
			{ "star": 3, "rating": 7.3, "nbOfVotes": 36 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.4, "nbOfVotes": 2 }
		],
		"title": "Ginny",
		"aired": "2023-11-06T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 1098,
		"ratingFiveStars": 76.6,
		"ratingAllStars": 92.6,
		"nbOfVotes": 653,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2128270&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 76.6, "nbOfVotes": 500 },
			{ "star": 4, "rating": 15.5, "nbOfVotes": 101 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 29 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 9 },
			{ "star": 1, "rating": 2.1, "nbOfVotes": 14 }
		],
		"title": "Bonney's Birth",
		"aired": "2023-11-13T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 1099,
		"ratingFiveStars": 73.9,
		"ratingAllStars": 92.2,
		"nbOfVotes": 472,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2130997&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 73.9, "nbOfVotes": 349 },
			{ "star": 4, "rating": 17.6, "nbOfVotes": 83 },
			{ "star": 3, "rating": 5.9, "nbOfVotes": 28 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 4 },
			{ "star": 1, "rating": 1.7, "nbOfVotes": 8 }
		],
		"title": "Pacifist",
		"aired": "2023-11-27T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 1100,
		"ratingFiveStars": 77,
		"ratingAllStars": 93.8,
		"nbOfVotes": 575,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2132328&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77, "nbOfVotes": 443 },
			{ "star": 4, "rating": 18.3, "nbOfVotes": 105 },
			{ "star": 3, "rating": 2.3, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 7 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 7 }
		],
		"title": "Thank You, Bonney",
		"aired": "2023-12-04T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 1101,
		"ratingFiveStars": 74,
		"ratingAllStars": 93,
		"nbOfVotes": 516,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2133743&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74, "nbOfVotes": 382 },
			{ "star": 4, "rating": 20, "nbOfVotes": 103 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 18 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 9 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 4 }
		],
		"title": "To Bonney",
		"aired": "2023-12-11T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1102,
		"ratingFiveStars": 90.1,
		"ratingAllStars": 96.8,
		"nbOfVotes": 714,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2135836&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.1, "nbOfVotes": 643 },
			{ "star": 4, "rating": 6.3, "nbOfVotes": 45 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 16 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 6 }
		],
		"title": "Kuma's Life",
		"aired": "2023-12-25T00:00:00+00:00",
		"score": 4.84
	},
	{
		"episodeNb": 1103,
		"ratingFiveStars": 83.2,
		"ratingAllStars": 95,
		"nbOfVotes": 737,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2137408&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.2, "nbOfVotes": 613 },
			{ "star": 4, "rating": 11.8, "nbOfVotes": 87 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 23 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 7 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 7 }
		],
		"title": "I'm Sorry, Daddy",
		"aired": "2024-01-06T00:00:00+00:00",
		"score": 4.75
	},
	{
		"episodeNb": 1104,
		"ratingFiveStars": 81.8,
		"ratingAllStars": 94.8,
		"nbOfVotes": 528,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2141144&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.8, "nbOfVotes": 432 },
			{ "star": 4, "rating": 13.4, "nbOfVotes": 71 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 15 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 6 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 4 }
		],
		"title": "Thank You, Daddy",
		"aired": "2024-01-22T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 1105,
		"ratingFiveStars": 67.7,
		"ratingAllStars": 91,
		"nbOfVotes": 433,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2142588&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.7, "nbOfVotes": 293 },
			{ "star": 4, "rating": 23.1, "nbOfVotes": 100 },
			{ "star": 3, "rating": 7.4, "nbOfVotes": 32 },
			{ "star": 2, "rating": 0.7, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 5 }
		],
		"title": "The Height Of Folly",
		"aired": "2024-01-29T00:00:00+00:00",
		"score": 4.55
	},
	{
		"episodeNb": 1106,
		"ratingFiveStars": 82.7,
		"ratingAllStars": 95.4,
		"nbOfVotes": 684,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2143514&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 82.7, "nbOfVotes": 566 },
			{ "star": 4, "rating": 13.6, "nbOfVotes": 93 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 15 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 6 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 4 }
		],
		"title": "On Your Side",
		"aired": "2024-02-05T00:00:00+00:00",
		"score": 4.7700000000000005
	},
	{
		"episodeNb": 1107,
		"ratingFiveStars": 79,
		"ratingAllStars": 94,
		"nbOfVotes": 496,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2145700&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79, "nbOfVotes": 392 },
			{ "star": 4, "rating": 15.7, "nbOfVotes": 78 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 13 },
			{ "star": 2, "rating": 1, "nbOfVotes": 5 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 8 }
		],
		"title": "I've Been Looking For You!!",
		"aired": "2024-02-19T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 1108,
		"ratingFiveStars": 84.2,
		"ratingAllStars": 95.8,
		"nbOfVotes": 545,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2146939&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.2, "nbOfVotes": 459 },
			{ "star": 4, "rating": 12.1, "nbOfVotes": 66 },
			{ "star": 3, "rating": 2.6, "nbOfVotes": 14 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 5 },
			{ "star": 1, "rating": 0.2, "nbOfVotes": 1 }
		],
		"title": "Come In, World",
		"aired": "2024-02-26T00:00:00+00:00",
		"score": 4.79
	},
	{
		"episodeNb": 1109,
		"ratingFiveStars": 79.3,
		"ratingAllStars": 94.4,
		"nbOfVotes": 527,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2147998&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.3, "nbOfVotes": 418 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 80 },
			{ "star": 3, "rating": 4, "nbOfVotes": 21 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 4 }
		],
		"title": "Interception",
		"aired": "2024-03-04T00:00:00+00:00",
		"score": 4.720000000000001
	},
	{
		"episodeNb": 1110,
		"ratingFiveStars": 83,
		"ratingAllStars": 95.2,
		"nbOfVotes": 548,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2150303&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83, "nbOfVotes": 455 },
			{ "star": 4, "rating": 12.4, "nbOfVotes": 68 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 16 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 6 }
		],
		"title": "Starfall",
		"aired": "2024-03-18T00:00:00+00:00",
		"score": 4.76
	},
	{
		"episodeNb": 1111,
		"ratingFiveStars": 78.1,
		"ratingAllStars": 93.4,
		"nbOfVotes": 686,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2151279&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.1, "nbOfVotes": 536 },
			{ "star": 4, "rating": 15.3, "nbOfVotes": 105 },
			{ "star": 3, "rating": 3.6, "nbOfVotes": 25 },
			{ "star": 2, "rating": 1.7, "nbOfVotes": 12 },
			{ "star": 1, "rating": 1.2, "nbOfVotes": 8 }
		],
		"title": "Sun-Shield",
		"aired": "2024-03-25T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 1112,
		"ratingFiveStars": 64,
		"ratingAllStars": 89.4,
		"nbOfVotes": 458,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2155917&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64, "nbOfVotes": 293 },
			{ "star": 4, "rating": 24, "nbOfVotes": 110 },
			{ "star": 3, "rating": 9, "nbOfVotes": 41 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 5 },
			{ "star": 1, "rating": 2, "nbOfVotes": 9 }
		],
		"title": "Hard Aspects",
		"aired": "2024-04-22T00:00:00+00:00",
		"score": 4.470000000000001
	},
	{
		"episodeNb": 1113,
		"ratingFiveStars": 79.3,
		"ratingAllStars": 94,
		"nbOfVotes": 547,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2156915&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 79.3, "nbOfVotes": 434 },
			{ "star": 4, "rating": 15.2, "nbOfVotes": 83 },
			{ "star": 3, "rating": 2.9, "nbOfVotes": 16 },
			{ "star": 2, "rating": 1.5, "nbOfVotes": 8 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 6 }
		],
		"title": "Stalemate",
		"aired": "2024-04-29T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 1114,
		"ratingFiveStars": 81.6,
		"ratingAllStars": 94.8,
		"nbOfVotes": 532,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2158199&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 81.6, "nbOfVotes": 434 },
			{ "star": 4, "rating": 13.7, "nbOfVotes": 73 },
			{ "star": 3, "rating": 3, "nbOfVotes": 16 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 5 }
		],
		"title": "The Wings of Icarus",
		"aired": "2024-05-13T00:00:00+00:00",
		"score": 4.74
	},
	{
		"episodeNb": 1115,
		"ratingFiveStars": 84.1,
		"ratingAllStars": 95.6,
		"nbOfVotes": 542,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2161022&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 84.1, "nbOfVotes": 456 },
			{ "star": 4, "rating": 11.8, "nbOfVotes": 64 },
			{ "star": 3, "rating": 2.8, "nbOfVotes": 15 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 3 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 4 }
		],
		"title": "Pieces of a Continent",
		"aired": "2024-05-27T00:00:00+00:00",
		"score": 4.779999999999999
	},
	{
		"episodeNb": 1116,
		"ratingFiveStars": 74.6,
		"ratingAllStars": 93,
		"nbOfVotes": 504,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2162061&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.6, "nbOfVotes": 376 },
			{ "star": 4, "rating": 18.5, "nbOfVotes": 93 },
			{ "star": 3, "rating": 5.6, "nbOfVotes": 28 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 5 }
		],
		"title": "Inner Conflict",
		"aired": "2024-06-03T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1117,
		"ratingFiveStars": 70.8,
		"ratingAllStars": 90.2,
		"nbOfVotes": 445,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2164263&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 70.8, "nbOfVotes": 315 },
			{ "star": 4, "rating": 18.2, "nbOfVotes": 81 },
			{ "star": 3, "rating": 6.1, "nbOfVotes": 27 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 6 },
			{ "star": 1, "rating": 3.6, "nbOfVotes": 16 }
		],
		"title": "A",
		"aired": "2024-06-17T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 1118,
		"ratingFiveStars": 60,
		"ratingAllStars": 84,
		"nbOfVotes": 493,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2165194&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60, "nbOfVotes": 296 },
			{ "star": 4, "rating": 17.4, "nbOfVotes": 86 },
			{ "star": 3, "rating": 11.6, "nbOfVotes": 57 },
			{ "star": 2, "rating": 4.7, "nbOfVotes": 23 },
			{ "star": 1, "rating": 6.3, "nbOfVotes": 31 }
		],
		"title": "The Most Free",
		"aired": "2024-06-24T00:00:00+00:00",
		"score": 4.2
	},
	{
		"episodeNb": 1119,
		"ratingFiveStars": 67.6,
		"ratingAllStars": 90.6,
		"nbOfVotes": 432,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2166206&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.6, "nbOfVotes": 292 },
			{ "star": 4, "rating": 21.5, "nbOfVotes": 93 },
			{ "star": 3, "rating": 8.6, "nbOfVotes": 37 },
			{ "star": 2, "rating": 1.4, "nbOfVotes": 6 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 4 }
		],
		"title": "Emet",
		"aired": "2024-07-01T00:00:00+00:00",
		"score": 4.529999999999999
	},
	{
		"episodeNb": 1120,
		"ratingFiveStars": 74.3,
		"ratingAllStars": 93,
		"nbOfVotes": 408,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2168576&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.3, "nbOfVotes": 303 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 73 },
			{ "star": 3, "rating": 6.9, "nbOfVotes": 28 },
			{ "star": 2, "rating": 0.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 3 }
		],
		"title": "Atlas",
		"aired": "2024-07-15T00:00:00+00:00",
		"score": 4.65
	},
	{
		"episodeNb": 1121,
		"ratingFiveStars": 78.6,
		"ratingAllStars": 93.8,
		"nbOfVotes": 495,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2169631&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 78.6, "nbOfVotes": 389 },
			{ "star": 4, "rating": 15.4, "nbOfVotes": 76 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 22 },
			{ "star": 2, "rating": 0.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 7 }
		],
		"title": "The Ebb and Flow of the Ages",
		"aired": "2024-07-22T00:00:00+00:00",
		"score": 4.6899999999999995
	},
	{
		"episodeNb": 1122,
		"ratingFiveStars": 80.1,
		"ratingAllStars": 94.6,
		"nbOfVotes": 518,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2171678&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 80.1, "nbOfVotes": 415 },
			{ "star": 4, "rating": 15.1, "nbOfVotes": 78 },
			{ "star": 3, "rating": 3.5, "nbOfVotes": 18 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 1, "nbOfVotes": 5 }
		],
		"title": "Time is Right",
		"aired": "2024-08-05T00:00:00+00:00",
		"score": 4.7299999999999995
	},
	{
		"episodeNb": 1123,
		"ratingFiveStars": 61.9,
		"ratingAllStars": 88,
		"nbOfVotes": 378,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2174013&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 61.9, "nbOfVotes": 234 },
			{ "star": 4, "rating": 23, "nbOfVotes": 87 },
			{ "star": 3, "rating": 11.1, "nbOfVotes": 42 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 5 },
			{ "star": 1, "rating": 2.6, "nbOfVotes": 10 }
		],
		"title": "The Void Fortnight",
		"aired": "2024-08-19T00:00:00+00:00",
		"score": 4.4
	},
	{
		"episodeNb": 1124,
		"ratingFiveStars": 65,
		"ratingAllStars": 90.2,
		"nbOfVotes": 449,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2175061&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 65, "nbOfVotes": 292 },
			{ "star": 4, "rating": 24.9, "nbOfVotes": 112 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 32 },
			{ "star": 2, "rating": 1.3, "nbOfVotes": 6 },
			{ "star": 1, "rating": 1.6, "nbOfVotes": 7 }
		],
		"title": "Close Friend",
		"aired": "2024-08-26T00:00:00+00:00",
		"score": 4.51
	},
	{
		"episodeNb": 1125,
		"ratingFiveStars": 77,
		"ratingAllStars": 94,
		"nbOfVotes": 408,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2177350&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 77, "nbOfVotes": 314 },
			{ "star": 4, "rating": 17.9, "nbOfVotes": 73 },
			{ "star": 3, "rating": 3.4, "nbOfVotes": 14 },
			{ "star": 2, "rating": 1.2, "nbOfVotes": 5 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 2 }
		],
		"title": "What Death Means",
		"aired": "2024-09-09T00:00:00+00:00",
		"score": 4.7
	},
	{
		"episodeNb": 1126,
		"ratingFiveStars": 74.5,
		"ratingAllStars": 93.2,
		"nbOfVotes": 388,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2178527&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.5, "nbOfVotes": 289 },
			{ "star": 4, "rating": 19.6, "nbOfVotes": 76 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 17 },
			{ "star": 2, "rating": 1, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 2 }
		],
		"title": "Settling the Score",
		"aired": "2024-09-16T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 1127,
		"ratingFiveStars": 57.1,
		"ratingAllStars": 87.6,
		"nbOfVotes": 378,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2179606&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 57.1, "nbOfVotes": 216 },
			{ "star": 4, "rating": 27.5, "nbOfVotes": 104 },
			{ "star": 3, "rating": 12.7, "nbOfVotes": 48 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 6 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 4 }
		],
		"title": "Adventure in the Land of Mystery",
		"aired": "2024-09-23T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 1128,
		"ratingFiveStars": 60.3,
		"ratingAllStars": 88.8,
		"nbOfVotes": 312,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2182030&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 60.3, "nbOfVotes": 188 },
			{ "star": 4, "rating": 26, "nbOfVotes": 81 },
			{ "star": 3, "rating": 11.5, "nbOfVotes": 36 },
			{ "star": 2, "rating": 1.6, "nbOfVotes": 5 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 2 }
		],
		"title": "RPG",
		"aired": "2024-10-07T00:00:00+00:00",
		"score": 4.4399999999999995
	},
	{
		"episodeNb": 1129,
		"ratingFiveStars": 58.1,
		"ratingAllStars": 87.6,
		"nbOfVotes": 279,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2183212&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 58.1, "nbOfVotes": 162 },
			{ "star": 4, "rating": 26.5, "nbOfVotes": 74 },
			{ "star": 3, "rating": 11.5, "nbOfVotes": 32 },
			{ "star": 2, "rating": 2.9, "nbOfVotes": 8 },
			{ "star": 1, "rating": 1.1, "nbOfVotes": 3 }
		],
		"title": "Livedolls",
		"aired": "2024-10-14T00:00:00+00:00",
		"score": 4.38
	},
	{
		"episodeNb": 1130,
		"ratingFiveStars": 83.5,
		"ratingAllStars": 96.2,
		"nbOfVotes": 272,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2184341&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 83.5, "nbOfVotes": 227 },
			{ "star": 4, "rating": 14, "nbOfVotes": 38 },
			{ "star": 3, "rating": 2.2, "nbOfVotes": 6 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 1 },
			{ "star": 1, "rating": 0, "nbOfVotes": 0 }
		],
		"title": "The Accursed Prince",
		"aired": "2024-10-21T00:00:00+00:00",
		"score": 4.8100000000000005
	},
	{
		"episodeNb": 1131,
		"ratingFiveStars": 69,
		"ratingAllStars": 91.8,
		"nbOfVotes": 426,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2187815&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69, "nbOfVotes": 294 },
			{ "star": 4, "rating": 23.2, "nbOfVotes": 99 },
			{ "star": 3, "rating": 6.3, "nbOfVotes": 27 },
			{ "star": 2, "rating": 0.9, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.5, "nbOfVotes": 2 }
		],
		"title": "Loki in the Underworld",
		"aired": "2024-11-11T00:00:00+00:00",
		"score": 4.59
	},
	{
		"episodeNb": 1132,
		"ratingFiveStars": 75.4,
		"ratingAllStars": 93.4,
		"nbOfVotes": 350,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2190932&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.4, "nbOfVotes": 264 },
			{ "star": 4, "rating": 18, "nbOfVotes": 63 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 18 },
			{ "star": 2, "rating": 1.1, "nbOfVotes": 4 },
			{ "star": 1, "rating": 0.3, "nbOfVotes": 1 }
		],
		"title": "Adventure in Elbaph",
		"aired": "2024-12-02T00:00:00+00:00",
		"score": 4.67
	},
	{
		"episodeNb": 1133,
		"ratingFiveStars": 87.8,
		"ratingAllStars": 96.2,
		"nbOfVotes": 523,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2191795&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 87.8, "nbOfVotes": 459 },
			{ "star": 4, "rating": 8, "nbOfVotes": 42 },
			{ "star": 3, "rating": 3.1, "nbOfVotes": 16 },
			{ "star": 2, "rating": 0.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 5 }
		],
		"title": "I Want You to Praise Me",
		"aired": "2024-12-09T00:00:00+00:00",
		"score": 4.81
	},
	{
		"episodeNb": 1134,
		"ratingFiveStars": 71.5,
		"ratingAllStars": 92.6,
		"nbOfVotes": 410,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2193853&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71.5, "nbOfVotes": 293 },
			{ "star": 4, "rating": 22.2, "nbOfVotes": 91 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 21 },
			{ "star": 2, "rating": 0.5, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.7, "nbOfVotes": 3 }
		],
		"title": "The Owl Library",
		"aired": "2024-12-23T00:00:00+00:00",
		"score": 4.63
	},
	{
		"episodeNb": 1135,
		"ratingFiveStars": 67.4,
		"ratingAllStars": 91.2,
		"nbOfVotes": 393,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2195388&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 67.4, "nbOfVotes": 265 },
			{ "star": 4, "rating": 23.7, "nbOfVotes": 93 },
			{ "star": 3, "rating": 7.1, "nbOfVotes": 28 },
			{ "star": 2, "rating": 0.8, "nbOfVotes": 3 },
			{ "star": 1, "rating": 1, "nbOfVotes": 4 }
		],
		"title": "Friends' Cups",
		"aired": "2025-01-04T00:00:00+00:00",
		"score": 4.56
	},
	{
		"episodeNb": 1136,
		"ratingFiveStars": 71,
		"ratingAllStars": 92.4,
		"nbOfVotes": 355,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2197988&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 71, "nbOfVotes": 252 },
			{ "star": 4, "rating": 22.5, "nbOfVotes": 80 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 18 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.8, "nbOfVotes": 3 }
		],
		"title": "The Land That Awaits the Sun",
		"aired": "2025-01-20T00:00:00+00:00",
		"score": 4.62
	},
	{
		"episodeNb": 1137,
		"ratingFiveStars": 74.3,
		"ratingAllStars": 93.2,
		"nbOfVotes": 397,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2198928&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 74.3, "nbOfVotes": 295 },
			{ "star": 4, "rating": 20.2, "nbOfVotes": 80 },
			{ "star": 3, "rating": 4, "nbOfVotes": 16 },
			{ "star": 2, "rating": 0.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.3, "nbOfVotes": 5 }
		],
		"title": "Introducing Shamrock",
		"aired": "2025-01-27T00:00:00+00:00",
		"score": 4.66
	},
	{
		"episodeNb": 1138,
		"ratingFiveStars": 90.1,
		"ratingAllStars": 97.4,
		"nbOfVotes": 563,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2199903&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 90.1, "nbOfVotes": 507 },
			{ "star": 4, "rating": 7.8, "nbOfVotes": 44 },
			{ "star": 3, "rating": 1.4, "nbOfVotes": 8 },
			{ "star": 2, "rating": 0.4, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.4, "nbOfVotes": 2 }
		],
		"title": "The Harley",
		"aired": "2025-02-03T00:00:00+00:00",
		"score": 4.87
	},
	{
		"episodeNb": 1139,
		"ratingFiveStars": 75.8,
		"ratingAllStars": 93.6,
		"nbOfVotes": 405,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2200843&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 75.8, "nbOfVotes": 307 },
			{ "star": 4, "rating": 18.5, "nbOfVotes": 75 },
			{ "star": 3, "rating": 4.4, "nbOfVotes": 18 },
			{ "star": 2, "rating": 0.2, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1, "nbOfVotes": 4 }
		],
		"title": "Mountain-Eater",
		"aired": "2025-02-10T00:00:00+00:00",
		"score": 4.68
	},
	{
		"episodeNb": 1140,
		"ratingFiveStars": 69.6,
		"ratingAllStars": 91.6,
		"nbOfVotes": 335,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2202672&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.6, "nbOfVotes": 233 },
			{ "star": 4, "rating": 20.9, "nbOfVotes": 70 },
			{ "star": 3, "rating": 8.4, "nbOfVotes": 28 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 2 }
		],
		"title": "Scopper Gaban",
		"aired": "2025-02-24T00:00:00+00:00",
		"score": 4.58
	},
	{
		"episodeNb": 1141,
		"ratingFiveStars": 69.8,
		"ratingAllStars": 92.2,
		"nbOfVotes": 334,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2203575&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 69.8, "nbOfVotes": 233 },
			{ "star": 4, "rating": 23.7, "nbOfVotes": 79 },
			{ "star": 3, "rating": 5.1, "nbOfVotes": 17 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.9, "nbOfVotes": 3 }
		],
		"title": "An Older Woman",
		"aired": "2025-03-03T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 1142,
		"ratingFiveStars": 72.9,
		"ratingAllStars": 92.2,
		"nbOfVotes": 351,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2204546&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 72.9, "nbOfVotes": 256 },
			{ "star": 4, "rating": 18.5, "nbOfVotes": 65 },
			{ "star": 3, "rating": 6.8, "nbOfVotes": 24 },
			{ "star": 2, "rating": 0.3, "nbOfVotes": 1 },
			{ "star": 1, "rating": 1.4, "nbOfVotes": 5 }
		],
		"title": "What I'm Afraid Of",
		"aired": "2025-03-10T00:00:00+00:00",
		"score": 4.61
	},
	{
		"episodeNb": 1143,
		"ratingFiveStars": 64.6,
		"ratingAllStars": 90.2,
		"nbOfVotes": 311,
		"forumTopicUrl": "https://myanimelist.net/forum/?topicid=2206406&pollresults=1",
		"allRatings": [
			{ "star": 5, "rating": 64.6, "nbOfVotes": 201 },
			{ "star": 4, "rating": 24.1, "nbOfVotes": 75 },
			{ "star": 3, "rating": 10, "nbOfVotes": 31 },
			{ "star": 2, "rating": 0.6, "nbOfVotes": 2 },
			{ "star": 1, "rating": 0.6, "nbOfVotes": 2 }
		],
		"title": "God's Knights",
		"aired": "2025-03-24T00:00:00+00:00",
		"score": 4.51
	}
]

const LAST_STATIC_CHAPTER = 1143;

export const fetchLatestOnePieceChapters = async (): Promise<EpisodeInfos[]> => {
	const staticChapters = onePieceChapters as EpisodeInfos[];

	try {
		const response = await fetch(
			`/api/fetch-ratings-cheerio?animeId=13&type=manga&startAfter=${LAST_STATIC_CHAPTER}`,
		);

		if (!response.ok) {
			console.warn("Failed to fetch latest One Piece chapters");
			return staticChapters;
		}

		const reader = response.body?.getReader();
		if (!reader) return staticChapters;

		let newChapters: ParserEpisodeInfos[] = [];

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = new TextDecoder().decode(value);
			try {
				const data = JSON.parse(chunk);
				if (data.episodesStats) {
					newChapters = data.episodesStats.filter(
						(ch: ParserEpisodeInfos) => ch.episodeNb > LAST_STATIC_CHAPTER,
					);
				}
			} catch {
				// Chunk might be partial JSON (estimatedTotalTime), skip
			}
		}

		if (newChapters.length > 0) {
			return [...staticChapters, ...(newChapters as EpisodeInfos[])];
		}
		return staticChapters;
	} catch (err) {
		console.warn("Failed to fetch latest One Piece chapters:", err);
		return staticChapters;
	}
};