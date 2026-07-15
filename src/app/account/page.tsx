import { Download, Settings } from "lucide-react"

import { requirePro } from "@/lib/auth"
import { editionDay, loadEdition } from "@/lib/news"
import { customBriefing, loadProProfile, storyCategories } from "@/lib/pro"
import { stories } from "@/lib/stories"

import { savePreferences } from "./actions"
import { StoryList } from "./story-list"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const [{ userId }, edition] = await Promise.all([requirePro(), loadEdition(stories)])
  const profile = await loadProProfile(userId)
  const customStories = customBriefing(edition.stories, profile)
  const publishers = [...new Set(edition.stories.map((story) => story.source))].toSorted()

  return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Member dashboard</p>
    <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-6xl">Your aviation briefing</h1>

    <div className="mt-12 grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className="h-fit border-t-2 border-foreground pt-6 lg:sticky lg:top-6">
        <h2 className="flex items-center gap-2 font-serif text-2xl font-bold"><Settings className="size-5 text-primary" /> Preferences</h2>
        <form action={savePreferences} className="mt-6">
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Topics</legend>
            <div className="mt-3 space-y-2">{storyCategories.map((category) => <Check key={category} name="category" value={category} checked={profile.categories.includes(category)} />)}</div>
          </fieldset>
          <fieldset className="mt-7">
            <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Publishers</legend>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Leave all clear to include every publisher.</p>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-2">{publishers.map((publisher) => <Check key={publisher} name="publisher" value={publisher} checked={profile.publishers.includes(publisher)} />)}</div>
          </fieldset>
          <button className="mt-6 min-h-11 w-full bg-foreground px-4 py-2 text-xs font-black uppercase tracking-widest text-background hover:bg-primary" type="submit">Save briefing</button>
        </form>
      </aside>

      <section aria-labelledby="custom-briefing" className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Today</p><h2 id="custom-briefing" className="mt-2 font-serif text-3xl font-bold">Custom daily briefing</h2></div>
          <div className="flex gap-2"><ExportLink href="/api/pro/export/csv" label="CSV" /><ExportLink href="/api/pro/export/pdf" label="PDF" /></div>
        </div>
        <StoryList stories={customStories.map((story) => ({ date: editionDay(edition.generatedAt), story }))} bookmarked={profile.bookmarks} />
      </section>
    </div>
  </main>
}

function Check({ name, value, checked }: { name: string; value: string; checked: boolean }) {
  return <label className="flex min-h-9 items-center gap-3 text-sm"><input type="checkbox" name={name} value={value} defaultChecked={checked} className="size-4 accent-orange-500" /><span>{value}</span></label>
}

function ExportLink({ href, label }: { href: string; label: string }) {
  return <a href={href} className="inline-flex min-h-11 items-center gap-2 border border-foreground/25 px-3 text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background"><Download className="size-4" />{label}</a>
}
