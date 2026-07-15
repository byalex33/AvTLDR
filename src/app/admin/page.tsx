import { clerkClient } from "@clerk/nextjs/server"
import Link from "next/link"

import { hasAdminMetadata, hasProMetadata, requireAdmin } from "@/lib/auth"
import { editionDay, loadEdition } from "@/lib/news"
import { storyCategories } from "@/lib/pro"
import { stories } from "@/lib/stories"

import { regeneratePosts, setBanned, setPlan, updatePost } from "./actions"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin()
  const params = await searchParams
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : ""
  const [result, edition] = await Promise.all([
    (await clerkClient()).users.getUserList({ limit: 100, ...(query && { query }) }),
    loadEdition(stories),
  ])
  const date = editionDay(edition.generatedAt)

  return <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-6">
      <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Administration</p><h1 className="mt-2 font-serif text-5xl font-bold">Admin panel</h1></div>
      <Link href="/account" className="text-sm font-bold hover:text-primary">Pro dashboard →</Link>
    </div>
    <nav aria-label="Admin sections" className="mt-6 flex gap-5 text-sm font-bold"><a href="#posts" className="hover:text-primary">Posts</a><a href="#users" className="hover:text-primary">Users & subscriptions</a></nav>

    <section id="posts" className="mt-12 scroll-mt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Published {date}</p><h2 className="mt-2 font-serif text-3xl font-bold">Posts</h2><p className="mt-2 text-sm text-muted-foreground">Corrections update the live post and its archive copy.</p></div>
        <form action={regeneratePosts}><button className="min-h-11 bg-foreground px-4 text-xs font-bold uppercase tracking-widest text-background">Regenerate all posts</button></form>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Regeneration reruns the full news pipeline and replaces the edition only if a complete result passes validation.</p>
      <div className="mt-6 space-y-4">{edition.stories.map((story) => <article key={story.id} className="border border-foreground/15 bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-primary">{story.category} · Importance {story.importance}</p><h3 className="mt-2 font-serif text-2xl font-bold">{story.headline}</h3><p className="mt-2 text-sm text-muted-foreground">{story.source}</p></div>
          <Link href={`/stories/${date}/${encodeURIComponent(story.id)}`} className="text-sm font-bold hover:text-primary">View post →</Link>
        </div>
        <details className="mt-5 border-t border-foreground/15 pt-4">
          <summary className="cursor-pointer text-sm font-bold">Edit post</summary>
          <form action={updatePost.bind(null, story.id)} className="mt-5 grid gap-4 lg:grid-cols-2">
            <label className="text-sm font-bold">Headline<input required name="headline" maxLength={220} defaultValue={story.headline} className="mt-1 min-h-11 w-full border border-foreground/25 px-3 font-normal" /></label>
            <label className="text-sm font-bold">Category<select required name="category" defaultValue={story.category} className="mt-1 min-h-11 w-full border border-foreground/25 bg-background px-3 font-normal">{storyCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="text-sm font-bold lg:col-span-2">Summary<textarea required name="summary" maxLength={500} defaultValue={story.summary} rows={3} className="mt-1 w-full border border-foreground/25 p-3 font-normal" /></label>
            <label className="text-sm font-bold lg:col-span-2">What happened<textarea required name="whatHappened" maxLength={700} defaultValue={story.whatHappened} rows={4} className="mt-1 w-full border border-foreground/25 p-3 font-normal" /></label>
            <label className="text-sm font-bold lg:col-span-2">Why it matters<textarea required name="whyItMatters" maxLength={700} defaultValue={story.whyItMatters} rows={4} className="mt-1 w-full border border-foreground/25 p-3 font-normal" /></label>
            <label className="text-sm font-bold">Source<input required name="source" maxLength={80} defaultValue={story.source} className="mt-1 min-h-11 w-full border border-foreground/25 px-3 font-normal" /></label>
            <label className="text-sm font-bold">Importance (0–10)<input required name="importance" type="number" min={0} max={10} step={1} defaultValue={story.importance} className="mt-1 min-h-11 w-full border border-foreground/25 px-3 font-normal" /></label>
            <label className="text-sm font-bold">Published at (UTC)<input required name="publishedAt" type="datetime-local" defaultValue={story.publishedAt.slice(0, 16)} className="mt-1 min-h-11 w-full border border-foreground/25 px-3 font-normal" /></label>
            <label className="text-sm font-bold">Source URL<input required name="url" type="url" maxLength={2000} defaultValue={story.url} className="mt-1 min-h-11 w-full border border-foreground/25 px-3 font-normal" /></label>
            <label className="text-sm font-bold lg:col-span-2">Image URL<input name="imageUrl" type="url" maxLength={2000} defaultValue={story.imageUrl} className="mt-1 min-h-11 w-full border border-foreground/25 px-3 font-normal" /></label>
            <div className="lg:col-span-2"><button className="min-h-11 bg-primary px-5 text-xs font-bold uppercase tracking-widest text-primary-foreground">Save correction</button></div>
          </form>
        </details>
      </article>)}</div>
    </section>

    <section id="users" className="mt-16 scroll-mt-4 border-t-2 border-foreground pt-10">
      <h2 className="font-serif text-3xl font-bold">Users and subscriptions</h2>
      <form action="/admin#users" className="mt-6 flex max-w-xl gap-2"><input name="q" type="search" defaultValue={query} placeholder="Search users" className="min-h-11 flex-1 border border-foreground/25 px-3" /><button className="bg-foreground px-5 text-xs font-bold uppercase tracking-widest text-background">Search</button></form>
      <p className="mt-5 text-sm text-muted-foreground">Showing {result.data.length} of {result.totalCount} users.</p>
      <div className="mt-6 overflow-x-auto border border-foreground/15">
        <table className="w-full min-w-[50rem] text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase tracking-widest text-white"><tr><th className="p-4">User</th><th className="p-4">Joined</th><th className="p-4">Status</th><th className="p-4">Subscription</th><th className="p-4">Actions</th></tr></thead>
          <tbody className="divide-y divide-foreground/15">{result.data.map((user) => {
            const pro = hasProMetadata(user.publicMetadata)
            const subscribed = typeof user.privateMetadata.stripeSubscriptionId === "string"
            const cancelling = user.publicMetadata.cancelAtPeriodEnd === true
            const subscriptionStatus = typeof user.publicMetadata.subscriptionStatus === "string" ? user.publicMetadata.subscriptionStatus : pro ? "complimentary" : "free"
            const email = user.primaryEmailAddress?.emailAddress ?? "No email"
            const nextPlan = subscribed ? cancelling ? "pro" : "free" : pro ? "free" : "pro"
            const planAction = subscribed ? cancelling ? "Resume renewal" : "Cancel renewal" : pro ? "Make Free" : "Grant Pro"
            return <tr key={user.id} className="bg-card align-top">
              <td className="p-4"><p className="font-bold">{[user.firstName, user.lastName].filter(Boolean).join(" ") || email}</p><p className="mt-1 text-xs text-muted-foreground">{email}</p><p className="mt-1 font-mono text-[0.65rem] text-muted-foreground">{user.id}</p></td>
              <td className="p-4">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(user.createdAt)}</td>
              <td className="p-4"><span className={user.banned ? "text-red-700" : "text-green-700"}>{user.banned ? "Suspended" : "Active"}</span>{hasAdminMetadata(user.publicMetadata) && <p className="mt-1 text-xs font-bold text-primary">Admin</p>}</td>
              <td className="p-4"><p className="font-bold">{pro ? "Pro" : "Free"}</p><p className="mt-1 text-xs text-muted-foreground">{subscriptionStatus}{cancelling ? " · cancels at period end" : ""}</p></td>
              <td className="p-4"><div className="flex flex-wrap gap-2"><form action={setPlan.bind(null, user.id, nextPlan)}><button className="min-h-9 border border-foreground/25 px-3 text-xs font-bold">{planAction}</button></form><form action={setBanned.bind(null, user.id, !user.banned)}><button className="min-h-9 border border-foreground/25 px-3 text-xs font-bold">{user.banned ? "Restore" : "Suspend"}</button></form></div></td>
            </tr>
          })}</tbody>
        </table>
      </div>
    </section>
  </main>
}
