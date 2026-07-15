import { get, put } from "@vercel/blob"

import type { Edition } from "./news.ts"
import type { Story, StoryCategory } from "./stories.ts"

export const storyCategories: StoryCategory[] = ["Airlines", "Aircraft", "Safety", "Military", "Technology"]

export function proPriceEnvironmentVariable(billing: unknown) {
  if (billing === "monthly") return "STRIPE_PRO_PRICE_ID"
  if (billing === "yearly") return "STRIPE_PRO_YEARLY_PRICE_ID"
}

export type Bookmark = Pick<Story, "id" | "category" | "headline" | "summary" | "source" | "url"> & { date: string }

export type ProProfile = {
  categories: StoryCategory[]
  publishers: string[]
  bookmarks: Bookmark[]
  savedSearches: string[]
}

const emptyProfile: ProProfile = {
  categories: storyCategories,
  publishers: [],
  bookmarks: [],
  savedSearches: [],
}

const blobOptions = {
  access: "private",
  allowOverwrite: true,
  addRandomSuffix: false,
  cacheControlMaxAge: 60,
  contentType: "application/json",
} as const

export async function loadProProfile(userId: string): Promise<ProProfile> {
  if (!hasBlobStore()) return structuredClone(emptyProfile)
  const result = await get(profilePath(userId), { access: "private" })
  if (!result || result.statusCode !== 200) return structuredClone(emptyProfile)

  try {
    return normalizeProfile(JSON.parse(await new Response(result.stream).text()))
  } catch {
    return structuredClone(emptyProfile)
  }
}

export async function updateProProfile(userId: string, update: (profile: ProProfile) => ProProfile) {
  // ponytail: last write wins; move profiles to a transactional store if concurrent writes become common.
  const profile = normalizeProfile(update(await loadProProfile(userId)))
  await put(profilePath(userId), JSON.stringify(profile), blobOptions)
  return profile
}

export function customBriefing(stories: Story[], profile: Pick<ProProfile, "categories" | "publishers">) {
  return stories.filter((story) =>
    profile.categories.includes(story.category) &&
    (!profile.publishers.length || profile.publishers.includes(story.source))
  )
}

export function searchEditions(editions: Edition[], query: string) {
  // ponytail: linear scan is enough for the current archive; add a search index when latency or read cost says otherwise.
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []

  return editions.flatMap((edition) => edition.stories.flatMap((story) => {
    const haystack = `${story.headline} ${story.summary} ${story.whatHappened} ${story.whyItMatters} ${story.source} ${story.category}`.toLowerCase()
    return words.every((word) => haystack.includes(word)) ? [{ date: edition.generatedAt.slice(0, 10), story }] : []
  })).slice(0, 100)
}

export function csvForStories(stories: Story[]) {
  const fields: Array<keyof Pick<Story, "category" | "headline" | "summary" | "whatHappened" | "whyItMatters" | "source" | "publishedAt" | "url">> = [
    "category", "headline", "summary", "whatHappened", "whyItMatters", "source", "publishedAt", "url",
  ]
  return [fields.join(","), ...stories.map((story) => fields.map((field) => csvCell(String(story[field]))).join(","))].join("\r\n")
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

function profilePath(userId: string) {
  return `avtldr/users/${userId}.json`
}

function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

function normalizeProfile(value: unknown): ProProfile {
  const profile = value && typeof value === "object" ? value as Partial<ProProfile> : {}
  const categories = Array.isArray(profile.categories)
    ? [...new Set(profile.categories.filter((category): category is StoryCategory => storyCategories.includes(category as StoryCategory)))]
    : storyCategories
  return {
    categories: categories.length ? categories : storyCategories,
    publishers: cleanStrings(profile.publishers, 50, 100),
    bookmarks: Array.isArray(profile.bookmarks) ? profile.bookmarks.filter(isBookmark).slice(0, 100) : [],
    savedSearches: cleanStrings(profile.savedSearches, 20, 120),
  }
}

function cleanStrings(value: unknown, limit: number, maxLength: number) {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter((item) => item && item.length <= maxLength))].slice(0, limit)
    : []
}

function isBookmark(value: unknown): value is Bookmark {
  if (!value || typeof value !== "object") return false
  const bookmark = value as Partial<Bookmark>
  return /^\d{4}-\d{2}-\d{2}$/.test(bookmark.date ?? "") &&
    [bookmark.id, bookmark.headline, bookmark.summary, bookmark.source, bookmark.url].every((item) => typeof item === "string") &&
    storyCategories.includes(bookmark.category as StoryCategory)
}
