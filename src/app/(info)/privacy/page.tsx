import type { Metadata } from "next"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata(
  "Privacy notice",
  "How AvTLDR collects, uses, and protects website and newsletter information.",
  "/privacy",
)

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">No turbulence, no tracking maze</p>
      <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Privacy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated 15 July 2026</p>

      <div className="mt-12 space-y-9 text-base leading-8 text-foreground/80">
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">What we collect</h2>
          <p className="mt-3">Free reading does not require an account. Pro members use Clerk for account authentication. Clerk processes the identity and session information needed to create and secure those accounts. Our hosting provider may also process basic technical information such as your IP address, browser, requested page, and time of visit.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Your preferences</h2>
          <p className="mt-3">The military-news switch stores your choice in your browser&apos;s local storage. It stays on your device and you can remove it by clearing site data.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Pro billing</h2>
          <p className="mt-3">Stripe processes Pro subscription payments and billing details. AvTLDR stores the Stripe customer and subscription references needed to keep access in sync, but does not receive or store full card details.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Email</h2>
          <p className="mt-3">If you contact us, we receive the details you submit so we can reply. If you join the newsletter, our email provider Resend stores your email address so we can send it. Pro preferences, bookmarks, and saved searches are stored in our private Vercel Blob store. We do not sell this information.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Your choices</h2>
          <p className="mt-3">You can ask us to access, correct, or delete information you have sent us, or unsubscribe from updates, by emailing <a className="font-semibold text-primary underline underline-offset-4" href="mailto:contact@avtldr.news">contact@avtldr.news</a>.</p>
        </section>
      </div>
    </main>
  )
}
