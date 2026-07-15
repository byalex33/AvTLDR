import { clerkClient } from "@clerk/nextjs/server"
import Link from "next/link"

import { hasProMetadata, requireAdmin } from "@/lib/auth"

import { setBanned, setPlan } from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin()
  const params = await searchParams
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : ""
  const result = await (await clerkClient()).users.getUserList({ limit: 100, ...(query && { query }) })

  return <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-6">
      <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Administration</p><h1 className="mt-2 font-serif text-5xl font-bold">Users and subscriptions</h1></div>
      <Link href="/account" className="text-sm font-bold hover:text-primary">Pro dashboard →</Link>
    </div>
    <form action="/admin" className="mt-8 flex max-w-xl gap-2"><input name="q" type="search" defaultValue={query} placeholder="Search users" className="min-h-11 flex-1 border border-foreground/25 px-3" /><button className="bg-foreground px-5 text-xs font-bold uppercase tracking-widest text-background">Search</button></form>
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
          return <tr key={user.id} className="bg-card align-top">
            <td className="p-4"><p className="font-bold">{[user.firstName, user.lastName].filter(Boolean).join(" ") || email}</p><p className="mt-1 text-xs text-muted-foreground">{email}</p><p className="mt-1 font-mono text-[0.65rem] text-muted-foreground">{user.id}</p></td>
            <td className="p-4">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(user.createdAt)}</td>
            <td className="p-4"><span className={user.banned ? "text-red-700" : "text-green-700"}>{user.banned ? "Suspended" : "Active"}</span></td>
            <td className="p-4"><p className="font-bold">{pro ? "Pro" : "Free"}</p><p className="mt-1 text-xs text-muted-foreground">{subscriptionStatus}{cancelling ? " · cancels at period end" : ""}</p></td>
            <td className="p-4"><div className="flex flex-wrap gap-2">{!cancelling && <form action={setPlan.bind(null, user.id, pro ? "free" : "pro")}><button className="min-h-9 border border-foreground/25 px-3 text-xs font-bold">{pro ? subscribed ? "Cancel renewal" : "Make Free" : "Grant Pro"}</button></form>}<form action={setBanned.bind(null, user.id, !user.banned)}><button className="min-h-9 border border-foreground/25 px-3 text-xs font-bold">{user.banned ? "Restore" : "Suspend"}</button></form></div></td>
          </tr>
        })}</tbody>
      </table>
    </div>
  </main>
}
