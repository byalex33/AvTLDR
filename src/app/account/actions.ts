"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requirePro } from "@/lib/auth"
import { loadEditionByDate, loadEdition } from "@/lib/news"
import { storyCategories, updateProProfile, type Bookmark } from "@/lib/pro"
import { stories, type StoryCategory } from "@/lib/stories"

export async function savePreferences(formData: FormData) {
  const { userId } = await requirePro()
  const edition = await loadEdition(stories)
  const allowedPublishers = new Set(edition.stories.map((story) => story.source))
  const categories = formData.getAll("category").filter((value): value is StoryCategory =>
    typeof value === "string" && storyCategories.includes(value as StoryCategory)
  )
  const publishers = formData.getAll("publisher").filter((value): value is string =>
    typeof value === "string" && allowedPublishers.has(value)
  )

  await updateProProfile(userId, (profile) => ({ ...profile, categories, publishers }))
  revalidatePath("/account")
}

export async function toggleBookmark(date: string, id: string, previousState: string, formData: FormData) {
  const { userId } = await requirePro()
  if (typeof previousState !== "string" || !(formData instanceof FormData) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !id || id.length > 180) throw new Error("Invalid story")
  const edition = await loadEditionByDate(date, stories)
  const story = edition?.stories.find((item) => item.id === id)
  if (!story) throw new Error("Story not found")

  const profile = await updateProProfile(userId, (profile) => {
    const exists = profile.bookmarks.some((bookmark) => bookmark.date === date && bookmark.id === id)
    const bookmark: Bookmark = {
      date,
      id: story.id,
      category: story.category,
      headline: story.headline,
      summary: story.summary,
      source: story.source,
      url: story.url,
    }
    return { ...profile, bookmarks: exists ? profile.bookmarks.filter((item) => item.date !== date || item.id !== id) : [bookmark, ...profile.bookmarks] }
  })
  revalidateAccount()
  return profile.bookmarks.some((bookmark) => bookmark.date === date && bookmark.id === id) ? "Saved to bookmarks." : "Bookmark removed."
}

export async function saveSearch(formData: FormData) {
  const { userId } = await requirePro()
  const query = String(formData.get("query") ?? "").trim()
  if (!query || query.length > 120) throw new Error("Search must be 1–120 characters")

  await updateProProfile(userId, (profile) => ({ ...profile, savedSearches: [query, ...profile.savedSearches.filter((item) => item !== query)] }))
  revalidateAccount()
  redirect(`/account/search?q=${encodeURIComponent(query)}&saved=1`)
}

export async function removeSearch(query: string) {
  const { userId } = await requirePro()
  if (!query || query.length > 120) throw new Error("Invalid search")
  await updateProProfile(userId, (profile) => ({ ...profile, savedSearches: profile.savedSearches.filter((item) => item !== query) }))
  revalidateAccount()
}

function revalidateAccount() {
  revalidatePath("/account")
  revalidatePath("/account/search")
  revalidatePath("/account/bookmarks")
}
