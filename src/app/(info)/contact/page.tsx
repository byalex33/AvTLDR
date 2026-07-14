import type { Metadata } from "next"
import { Check, Mail, Plane, Send } from "lucide-react"
import { redirect } from "next/navigation"

import { validateContactMessage } from "@/lib/contact"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Contact AvTLDR with corrections, website feedback, questions, or general enquiries.",
  "/contact",
)

async function sendMessage(formData: FormData) {
  "use server"

  if (formData.get("website")) redirect("/contact?sent=1")

  const message = validateContactMessage({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  })

  if (!message) redirect("/contact?error=invalid")
  if (!process.env.RESEND_API_KEY) redirect("/contact?error=config")

  let sent = false

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AvTLDR website <contact@avtldr.news>",
        to: "contact@avtldr.news",
        reply_to: message.email,
        subject: `Website contact: ${message.subject.replace(/[\r\n]+/g, " ")}`,
        text: `Name: ${message.name}\nEmail: ${message.email}\nSubject: ${message.subject}\n\n${message.message}`,
      }),
    })

    sent = response.ok
    if (!sent) console.error("Resend rejected a contact form submission:", response.status, await response.text())
  } catch (error) {
    console.error("Contact form email failed:", error)
  }

  redirect(sent ? "/contact?sent=1" : "/contact?error=send")
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { sent, error } = await searchParams

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="grid overflow-hidden border border-foreground/15 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative flex flex-col justify-between overflow-hidden bg-slate-950 p-7 text-white sm:p-10 lg:min-h-[44rem]">
          <Plane className="absolute -right-20 -top-12 size-72 -rotate-12 text-white/[0.04]" strokeWidth={1} aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Open channel</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.95] tracking-[-0.045em] sm:text-6xl">Let&apos;s talk aviation.</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
              Spotted something we missed, found a site issue, or want to make the briefing better? We&apos;re listening.
            </p>

            <ul className="mt-10 space-y-5 text-sm font-semibold text-white/80" aria-label="Reasons to contact us">
              {[
                ["01", "Corrections and clarifications"],
                ["02", "Website feedback and technical issues"],
                ["03", "Questions and general enquiries"],
              ].map(([number, label]) => (
                <li key={number} className="flex items-center gap-3 border-t border-white/15 pt-5">
                  <span className="font-mono text-xs text-primary">{number}</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-12 border-t border-white/15 pt-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Mail className="size-4" aria-hidden="true" /> Prefer email?
            </div>
            <a className="mt-3 inline-block font-semibold text-white underline decoration-white/35 underline-offset-4 hover:decoration-primary" href="mailto:contact@avtldr.news">
              contact@avtldr.news
            </a>
          </div>
        </aside>

        <section className="bg-card p-7 sm:p-10" aria-labelledby="contact-form-title">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Send a transmission</p>
          <h2 id="contact-form-title" className="mt-3 font-serif text-3xl font-bold tracking-[-0.03em] sm:text-4xl">What&apos;s on your radar?</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">All fields are required. We read every message.</p>

          {sent === "1" ? (
            <div role="status" className="mt-10 border-l-2 border-primary bg-accent p-6">
              <Check className="size-7 text-primary" aria-hidden="true" />
              <p className="mt-4 font-serif text-2xl font-bold">Message received.</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Thanks for getting in touch. We&apos;ll take a look and reply if needed.</p>
            </div>
          ) : (
            <>
              {error && (
                <p role="alert" className="mt-8 border-l-2 border-destructive bg-destructive/10 px-4 py-3 text-sm">
                  {error === "invalid" ? "Check each field and try again." : "We couldn't send that right now. Please email us instead."}
                </p>
              )}

              <form action={sendMessage} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em]" htmlFor="name">
                    Name
                    <input id="name" name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className="h-12 border bg-background px-4 text-base font-normal normal-case tracking-normal outline-none placeholder:text-muted-foreground/55 focus:border-ring focus:ring-2 focus:ring-ring/20" />
                  </label>
                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em]" htmlFor="email">
                    Email
                    <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" placeholder="you@example.com" className="h-12 border bg-background px-4 text-base font-normal normal-case tracking-normal outline-none placeholder:text-muted-foreground/55 focus:border-ring focus:ring-2 focus:ring-ring/20" />
                  </label>
                </div>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em]" htmlFor="subject">
                  Subject
                  <input id="subject" name="subject" required maxLength={150} placeholder="What is this about?" className="h-12 border bg-background px-4 text-base font-normal normal-case tracking-normal outline-none placeholder:text-muted-foreground/55 focus:border-ring focus:ring-2 focus:ring-ring/20" />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em]" htmlFor="message">
                  Message
                  <textarea id="message" name="message" required maxLength={5000} rows={8} placeholder="Tell us what happened…" className="resize-y border bg-background px-4 py-3 text-base font-normal normal-case tracking-normal outline-none placeholder:text-muted-foreground/55 focus:border-ring focus:ring-2 focus:ring-ring/20" />
                </label>
                <label className="absolute -left-[9999px]" htmlFor="website" aria-hidden="true">
                  Website
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                </label>
                <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Send className="size-4" aria-hidden="true" />
                  Send message
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
