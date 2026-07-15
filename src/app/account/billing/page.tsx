import { CreditCard } from "lucide-react"

import { hasProMetadata, requireUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function BillingPage() {
  const { session, user } = await requireUser("/account/billing")
  const customer = typeof user.privateMetadata.stripeCustomerId === "string"
  const subscribed = typeof user.privateMetadata.stripeSubscriptionId === "string"
  const pro = session.has({ feature: "pro" }) || hasProMetadata(user.publicMetadata)
  const status = typeof user.publicMetadata.subscriptionStatus === "string" ? user.publicMetadata.subscriptionStatus.replaceAll("_", " ") : subscribed ? "active" : pro ? "complimentary" : "free"
  const interval = typeof user.publicMetadata.billingInterval === "string" ? user.publicMetadata.billingInterval : undefined
  const paidThrough = typeof user.publicMetadata.paidThrough === "number" ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(user.publicMetadata.paidThrough * 1000) : undefined

  return <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your account</p>
    <h1 className="mt-3 flex items-center gap-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-6xl"><CreditCard className="size-9 text-primary" /> Billing</h1>
    <section className="mt-10 border border-foreground/15 bg-card p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">AvTLDR Pro</p>
      <h2 className="mt-2 font-serif text-3xl font-bold capitalize">{status}</h2>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div><dt className="font-bold">Access</dt><dd className="mt-1 text-muted-foreground">{pro ? "Pro" : "Free"}</dd></div>
        <div><dt className="font-bold">Billing</dt><dd className="mt-1 capitalize text-muted-foreground">{interval ? `${interval} subscription` : subscribed ? "Stripe subscription" : "Complimentary"}</dd></div>
        {paidThrough && <div><dt className="font-bold">Paid through</dt><dd className="mt-1 text-muted-foreground">{paidThrough}</dd></div>}
        {user.publicMetadata.cancelAtPeriodEnd === true && <div><dt className="font-bold">Renewal</dt><dd className="mt-1 text-red-700">Cancels at period end</dd></div>}
      </dl>
      {customer ? <><form action="/api/stripe/portal" method="post" className="mt-8"><button className="min-h-12 bg-primary px-5 text-xs font-black uppercase tracking-widest text-primary-foreground">Manage subscription in Stripe</button></form><p className="mt-3 text-xs leading-5 text-muted-foreground">Update payment details, download invoices, change or cancel your subscription in Stripe’s secure billing portal.</p></> : <p className="mt-8 border border-foreground/15 p-4 text-sm text-muted-foreground">{pro ? "This account has complimentary Pro access, so there is no Stripe subscription to manage." : "No Stripe subscription is linked to this account."}</p>}
    </section>
  </main>
}
