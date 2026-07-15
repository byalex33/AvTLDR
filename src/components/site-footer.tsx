import Link from "next/link"
import { Show } from "@clerk/nextjs"

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.3fr_0.7fr_1fr]">
          <div>
            <p className="text-2xl font-black uppercase tracking-[-0.04em]">
              Av<span className="text-primary">TLDR</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
              A clearer view of the global aviation industry, delivered once a day.
            </p>
            <Link
              href="/pro"
              className="pro-glow mt-5 inline-flex min-h-11 items-center px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Become Pro →
            </Link>
          </div>

          <nav aria-label="Footer" className="text-sm">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">The small print</p>
            <div className="mt-4 flex flex-col items-start gap-3 text-white/70">
              <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/about">About AvTLDR</Link>
              <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/terms">Terms</Link>
              <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/privacy">Privacy</Link>
              <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/contact">Contact us</Link>
              <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/methodology">Methodology &amp; corrections</Link>
              <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/archive">Daily archive</Link>
              <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/pro">AvTLDR Pro</Link>
              <Show when="signed-in" fallback={<><Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/sign-in">Log in</Link><Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/sign-up">Sign up</Link></>}>
                <Link className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/account">Your account</Link>
              </Show>
              <a className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href="/feed.xml">RSS feed</a>
            </div>
          </nav>

          <div className="border-l-2 border-primary pl-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">Clear your inbox for take-off</p>
            <p className="mt-3 font-serif text-2xl font-bold leading-tight">The briefing, without the baggage.</p>
            <Link
              href="/newsletter"
              className="mt-5 inline-flex min-h-11 items-center border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Join the newsletter →
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AvTLDR</p>
          <p>Headlines summarised. Reporting belongs to the linked publishers.</p>
          <p>
            Created with{" "}
            <span className="text-primary" aria-hidden="true">♥</span>
            <span className="sr-only"> love</span>{" "}
            from the UK.
          </p>
        </div>
      </div>
    </footer>
  )
}
