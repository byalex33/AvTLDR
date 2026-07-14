import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms — AvTLDR.news",
  description: "Terms of use for AvTLDR.news.",
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The small print</p>
      <h1 className="mt-3 font-serif text-5xl font-bold tracking-[-0.04em] sm:text-6xl">Terms of use</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated 14 July 2026</p>

      <div className="mt-12 space-y-9 text-base leading-8 text-foreground/80">
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">The short version</h2>
          <p className="mt-3">AvTLDR provides short summaries and links for general information. It is not professional, financial, legal, safety, or operational advice. Check the original source before making decisions.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Our content</h2>
          <p className="mt-3">We may change, correct, suspend, or remove content at any time. Summaries can omit context or contain errors. Linked reporting belongs to its respective publisher, and third-party sites have their own terms and privacy practices.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Acceptable use</h2>
          <p className="mt-3">You may use the site for lawful, personal purposes. Do not interfere with the service, attempt unauthorised access, scrape it in a way that harms availability, or present our summaries as your own reporting.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Availability and liability</h2>
          <p className="mt-3">The site is provided “as is” without guarantees of accuracy, completeness, availability, or fitness for a particular purpose. To the fullest extent permitted by law, AvTLDR is not liable for losses arising from use of, or reliance on, the site.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">Questions</h2>
          <p className="mt-3">Contact <a className="font-semibold text-primary underline underline-offset-4" href="mailto:contact@avtldr.news">contact@avtldr.news</a>.</p>
        </section>
      </div>
    </main>
  )
}
