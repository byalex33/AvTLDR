"use client"

import { Bookmark } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react"

import { storyPath, type Story } from "@/lib/stories"

import { toggleBookmark } from "./actions"

type ListedStory = Pick<Story, "id" | "category" | "headline" | "summary">

export function StoryList({ stories, bookmarked }: { stories: Array<{ date: string; story: ListedStory }>; bookmarked: Array<{ date: string; id: string }> }) {
  if (!stories.length) return <p className="mt-6 border border-dashed border-foreground/25 p-8 text-center text-sm text-muted-foreground">Nothing here yet.</p>
  return <ol className="mt-5 divide-y divide-foreground/15 border-y border-foreground/15">{stories.map(({ date, story }) => <li key={`${date}-${story.id}`} className="py-6">
    <p className="text-[0.68rem] font-bold uppercase tracking-widest text-primary">{story.category} · {date}</p>
    <Link href={storyPath(date, story.id)} className="mt-2 block font-serif text-2xl font-bold hover:text-primary">{story.headline}</Link>
    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{story.summary}</p>
    <BookmarkButton date={date} id={story.id} saved={bookmarked.some((item) => item.date === date && item.id === story.id)} />
  </li>)}</ol>
}

function BookmarkButton({ date, id, saved }: { date: string; id: string; saved: boolean }) {
  const [message, action, pending] = useActionState(toggleBookmark.bind(null, date, id), "")
  return <form action={action} className="mt-3">
    <button disabled={pending} className="inline-flex min-h-9 items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary disabled:opacity-60"><Bookmark className={`size-4 ${saved ? "fill-current text-primary" : ""}`} />{pending ? "Saving…" : saved ? "Remove bookmark" : "Bookmark"}</button>
    <span role="status" aria-live="polite" className="ml-3 text-xs font-semibold text-primary">{message}</span>
  </form>
}
