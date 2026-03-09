'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined' && location.hostname !== "localhost") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Use latest PostHog defaults so SPA pageviews are captured via history changes,
    // including URLs like /episodes?animeId=235
    defaults: '2026-01-30',
    capture_pageview: 'history_change',
    person_profiles: 'always',
  })
}
export function CSPostHogProvider({ children }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}