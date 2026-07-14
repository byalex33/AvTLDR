import type { Metadata } from "next"
import Link from "next/link"
import { Check, Mail, Plane } from "lucide-react"
import { redirect } from "next/navigation"

import { validateEmail } from "@/lib/contact"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata(
  "Daily aviation newsletter",
  "Get the essential global aviation stories and why they matter in one concise daily email.",
  "/newsletter",
)

async function subscribe(formData: FormData) {
  "use server"

  if (formData.get("website")) redirect("/newsletter?subscribed=1")

  const email = validateEmail(formData.get("email"))
  if (!email) redirect("/newsletter?error=invalid")
  if (!process.env.RESEND_API_KEY) redirect("/newsletter?error=config")

  let subscribed = false

  try {
    const response = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "AvTLDR.news/1.0",
      },
      body: JSON.stringify({ email }),
    })

    subscribed = response.ok
    if (!subscribed) console.error("Resend rejected a newsletter signup:", response.status, await response.text())
  } catch (error) {
    console.error("Newsletter signup failed:", error)
  }

  redirect(subscribed ? "/newsletter?subscribed=1" : "/newsletter?error=send")
}

export default async function NewsletterPage({ searchParams }: PageProps<"/newsletter">) {
  const { subscribed, error } = await searchParams

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative overflow-hidden bg-slate-950 px-6 py-14 text-white sm:px-12 sm:py-20">
        <Plane className="absolute -right-16 -top-10 size-72 -rotate-12 text-white/[0.04]" strokeWidth={1} aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your inbox has clearance</p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-7xl sm:leading-[0.98]">Aviation news. No holding pattern.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">One sharp daily briefing with the stories that matter, why they matter, and none of the press-release altitude.</p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/80" aria-label="Newsletter benefits">
            <li className="flex items-center gap-2"><Check className="size-4 text-primary" aria-hidden="true" />Daily and concise</li>
            <li className="flex items-center gap-2"><Check className="size-4 text-primary" aria-hidden="true" />Free to read</li>
            <li className="flex items-center gap-2"><Check className="size-4 text-primary" aria-hidden="true" />Leave anytime</li>
          </ul>

          {subscribed === "1" ? (
            <p role="status" className="mt-10 flex max-w-xl items-center gap-3 border-l-2 border-primary bg-white/10 px-4 py-4 font-semibold">
              <Check className="size-5 shrink-0 text-primary" aria-hidden="true" />
              You&apos;re on the manifest. The next briefing will land in your inbox.
            </p>
          ) : (
            <>
              {error && (
                <p role="alert" className="mt-10 border-l-2 border-primary bg-white/10 px-4 py-3 text-sm">
                  {error === "invalid" ? "Enter a valid email address." : "We couldn't add you right now. Please try again."}
                </p>
              )}
              <form action={subscribe} className={`${error ? "mt-4" : "mt-10"} flex max-w-xl flex-col gap-3 sm:flex-row`}>
                <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  className="h-12 min-w-0 flex-1 border border-white/25 bg-white px-4 text-slate-950 outline-none placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                <label className="absolute -left-[9999px]" htmlFor="newsletter-website" aria-hidden="true">
                  Website
                  <input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
                </label>
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  <Mail className="size-4" aria-hidden="true" />
                  Put me on the manifest
                </button>
              </form>
              <p className="mt-4 max-w-xl text-xs leading-5 text-white/45">
                No spam or data sales. Unsubscribe anytime. See our <Link href="/privacy" className="underline underline-offset-2 hover:text-white">privacy notice</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
