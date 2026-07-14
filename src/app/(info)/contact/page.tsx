import type { Metadata } from "next"
import { Mail, Send } from "lucide-react"
import { redirect } from "next/navigation"

import { validateContactMessage } from "@/lib/contact"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Contact AvTLDR with aviation news tips, corrections, questions, or feedback.",
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
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Open channel</p>
      <h1 className="mt-3 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Contact us</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Spotted something we missed, have a tip, or just want to say hello? Send it over.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_2fr]">
        <aside className="border-l-2 border-primary pl-5">
          <Mail className="size-5 text-primary" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-2xl font-bold">Prefer email?</h2>
          <a className="mt-2 inline-block text-sm font-semibold text-primary underline underline-offset-4" href="mailto:contact@avtldr.news">
            contact@avtldr.news
          </a>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">We&apos;ll get back to you as soon as we can.</p>
        </aside>

        <div>
          {sent === "1" && (
            <p role="status" className="mb-6 border-l-2 border-primary bg-accent px-4 py-3 text-sm font-semibold">
              Message sent. Thanks for getting in touch.
            </p>
          )}
          {error && (
            <p role="alert" className="mb-6 border-l-2 border-destructive bg-destructive/10 px-4 py-3 text-sm">
              {error === "invalid" ? "Check each field and try again." : "We couldn't send that right now. Please email us instead."}
            </p>
          )}

          <form action={sendMessage} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold" htmlFor="name">
                Name
                <input id="name" name="name" required maxLength={100} autoComplete="name" className="h-11 border bg-card px-3 text-base font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" />
              </label>
              <label className="grid gap-2 text-sm font-semibold" htmlFor="email">
                Email
                <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" className="h-11 border bg-card px-3 text-base font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold" htmlFor="subject">
              Subject
              <input id="subject" name="subject" required maxLength={150} className="h-11 border bg-card px-3 text-base font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" />
            </label>
            <label className="grid gap-2 text-sm font-semibold" htmlFor="message">
              Message
              <textarea id="message" name="message" required maxLength={5000} rows={7} className="resize-y border bg-card px-3 py-3 text-base font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" />
            </label>
            <label className="absolute -left-[9999px]" htmlFor="website" aria-hidden="true">
              Website
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <button type="submit" className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Send className="size-4" aria-hidden="true" />
              Send message
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
