import { Bookmark } from "lucide-react"

import { requirePro } from "@/lib/auth"
import { loadProProfile } from "@/lib/pro"

import { StoryList } from "../story-list"

export const dynamic = "force-dynamic"

export default async function BookmarksPage() {
  const { userId } = await requirePro()
  const profile = await loadProProfile(userId)

  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your library</p>
    <h1 className="mt-3 flex items-center gap-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-6xl"><Bookmark className="size-9 text-primary" /> Bookmarks</h1>
    <p className="mt-4 text-muted-foreground">Stories you save from your briefing or archive search appear here.</p>
    <StoryList stories={profile.bookmarks.map((story) => ({ date: story.date, story }))} bookmarked={profile.bookmarks} />
  </main>
}
