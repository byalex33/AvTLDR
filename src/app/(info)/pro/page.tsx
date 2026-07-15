import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { ArrowRight, Check, Minus, Plane } from "lucide-react"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata(
  "AvTLDR Pro — aviation briefing tools",
  "Compare AvTLDR Free and Pro, with archive search, saved research, custom briefings, and exports for £6 per month or £60 per year.",
  "/pro",
)

const comparisonRows = [
  { feature: "Daily global briefing", free: true, pro: true },
  { feature: "What happened and why it matters", free: true, pro: true },
  { feature: "Topic and publisher filters", free: true, pro: true },
  { feature: "Daily edition archive", free: true, pro: true },
  { feature: "Custom daily briefing", free: false, pro: true },
  { feature: "Search across every edition", free: false, pro: true },
  { feature: "Bookmarks and saved searches", free: false, pro: true },
  { feature: "PDF and CSV exports", free: false, pro: true },
] as const

export default async function ProPage() {
  const { userId } = await auth()
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="grid overflow-hidden bg-slate-950 text-white lg:grid-cols-[minmax(0,1.1fr)_minmax(21rem,0.9fr)]">
          <div className="relative overflow-hidden px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
            <Plane className="absolute -right-16 -top-10 size-72 -rotate-12 text-white/[0.035]" strokeWidth={1} aria-hidden="true" />
            <div className="relative max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="pro-status px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em]">
                  <span className="pro-status__shine" aria-hidden="true" />
                  <Plane className="pro-status__plane size-3.5 -rotate-12" aria-hidden="true" />
                  <span className="relative z-10">
                    AvTLDR <span className="text-primary">Pro</span>
                  </span>
                </span>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/50">Now boarding</span>
              </div>
              <h1 className="mt-7 font-serif text-5xl font-bold leading-[0.98] tracking-[-0.05em] text-balance sm:text-7xl">
                Your corner of aviation, cleared for take-off.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">
                Turn the daily global briefing into a faster research tool—with archive-wide search, saved stories, custom topic choices, and clean exports.
              </p>
              <a
                href="#compare-plans"
                className="mt-9 inline-flex min-h-12 items-center gap-2 bg-primary px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Compare plans
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="border-t border-white/15 bg-white/[0.055] p-6 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <div className="border border-white/15 bg-slate-950/55 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">Your Pro toolkit</p>
                  <p className="mt-2 font-serif text-2xl font-bold">Research dashboard</p>
                </div>
                <span className="font-mono text-xs text-white/40">Every edition</span>
              </div>

              <div className="divide-y divide-white/10">
                <PreferenceItem name="Topics" value="Custom" />
                <PreferenceItem name="Publishers" value="Custom" />
                <PreferenceItem name="Exports" value="PDF + CSV" />
              </div>

              <div className="mt-7 border-l-2 border-primary bg-white/[0.055] px-4 py-3">
                <p className="text-sm font-semibold leading-6 text-white/75">Your custom briefing and research tools are ready.</p>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between gap-5">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/45">One simple plan</p>
                <p className="mt-2 font-serif text-5xl font-bold">£6 <span className="font-sans text-sm font-medium text-white/45">/ month</span></p>
                <p className="mt-2 text-sm font-bold text-primary">£60 / year · 2 months free</p>
              </div>
              <p className="max-w-32 text-right text-xs leading-5 text-white/45">Cancel whenever you like.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="compare-plans" className="scroll-mt-8 border-y border-foreground/15 bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Choose your flight plan</p>
              <h2 className="mt-3 font-serif text-4xl font-bold tracking-[-0.045em] sm:text-6xl">Free or full control.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-right">
              Start with the essentials. Upgrade when you want faster research and more control.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto border border-foreground/15 bg-background shadow-xl">
            <div className="min-w-[42rem]">
              <div className="grid grid-cols-[minmax(16rem,1.4fr)_minmax(11rem,0.8fr)_minmax(11rem,0.8fr)] border-b-2 border-foreground">
                <div className="flex flex-col justify-end bg-card p-6 sm:p-8">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Plan comparison</p>
                  <p className="mt-2 font-serif text-2xl font-bold">What&apos;s included</p>
                </div>
                <PlanHeading name="Free" price="£0" description="The global essentials" />
                <PlanHeading name="Pro" price="£6" description="Or £60/year · 2 months free" featured />
              </div>

              <div>
                {comparisonRows.map((row, index) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-[minmax(16rem,1.4fr)_minmax(11rem,0.8fr)_minmax(11rem,0.8fr)] border-b border-foreground/10 last:border-b-0 ${index % 2 === 0 ? "bg-card" : "bg-secondary/50"}`}
                  >
                    <div className="flex min-h-16 items-center px-6 py-4 text-sm font-semibold sm:px-8">{row.feature}</div>
                    <ComparisonValue included={row.free} />
                    <ComparisonValue included={row.pro} featured />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[minmax(16rem,1.4fr)_minmax(11rem,0.8fr)_minmax(11rem,0.8fr)] border-t-2 border-foreground">
                <div className="bg-card p-6 sm:p-8">
                  <p className="font-serif text-2xl font-bold">Pick the briefing that fits.</p>
                </div>
                <div className="flex items-center justify-center border-l border-foreground/15 bg-card p-5">
                  <Link
                    href="/"
                    className="inline-flex min-h-11 items-center justify-center border border-foreground/25 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Read for free
                  </Link>
                </div>
                <div className="flex items-center justify-center border-l border-slate-700 bg-slate-950 p-5 text-white">
                  {userId ? (
                    <div className="grid w-full gap-3">
                      <form action="/api/stripe/checkout" method="post" className="grid gap-2">
                      <button name="billing" value="monthly" className="inline-flex min-h-11 w-full items-center justify-center bg-primary px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-primary-foreground">£6 monthly</button>
                      <button name="billing" value="yearly" className="inline-flex min-h-11 w-full items-center justify-center border border-primary px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-primary">£60 yearly</button>
                      <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white/55">2 months free yearly</p>
                      </form>
                      <Link href="/account/billing" className="text-center text-xs font-bold text-white/70 underline hover:text-white">Manage existing subscription</Link>
                    </div>
                  ) : (
                    <Link href="/sign-up" className="inline-flex min-h-11 items-center justify-center bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-primary-foreground">Create Pro account</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground sm:text-right">Prices shown in GBP. Choose £6 monthly or £60 yearly.</p>
        </div>
      </section>
    </main>
  )
}

function PlanHeading({
  name,
  price,
  description,
  featured = false,
}: {
  name: string
  price: string
  description: string
  featured?: boolean
}) {
  return (
    <div className={`relative border-l p-6 sm:p-8 ${featured ? "border-slate-700 bg-slate-950 text-white" : "border-foreground/15 bg-card"}`}>
      {featured && (
        <span className="absolute right-4 top-4 bg-primary px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.14em] text-primary-foreground">
          Recommended
        </span>
      )}
      <p className={`text-xs font-black uppercase tracking-[0.18em] ${featured ? "text-primary" : "text-muted-foreground"}`}>{name}</p>
      <p className="mt-5 font-serif text-4xl font-bold">{price} <span className={`font-sans text-xs font-medium ${featured ? "text-white/45" : "text-muted-foreground"}`}>/ month</span></p>
      <p className={`mt-3 text-xs ${featured ? "text-white/55" : "text-muted-foreground"}`}>{description}</p>
    </div>
  )
}

function ComparisonValue({ included, featured = false }: { included: boolean; featured?: boolean }) {
  return (
    <div className={`grid min-h-16 place-items-center border-l px-5 py-4 ${featured ? "border-slate-700 bg-slate-950 text-white" : "border-foreground/15"}`}>
      {included ? (
        <span className={`grid size-8 place-items-center rounded-full ${featured ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
          <span className="sr-only">Included</span>
        </span>
      ) : (
        <span className="text-muted-foreground/45">
          <Minus className="size-5" aria-hidden="true" />
          <span className="sr-only">Not included</span>
        </span>
      )}
    </div>
  )
}

function PreferenceItem({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <span className="font-semibold">{name}</span>
      <span className="bg-white/10 px-2.5 py-1 text-xs font-bold text-white/60">{value}</span>
    </div>
  )
}
