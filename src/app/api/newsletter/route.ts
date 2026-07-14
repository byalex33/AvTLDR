import { validateEmail } from "../../../lib/contact.ts"

export async function POST(request: Request) {
  const redirectTo = (query: string) => Response.redirect(new URL(`/newsletter?${query}`, request.url), 303)
  const origin = request.headers.get("origin")
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))?.split(",")[0].trim()

  if (origin && (!URL.canParse(origin) || (host && new URL(origin).host !== host))) return new Response("Forbidden", { status: 403 })

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return redirectTo("error=invalid")
  }

  if (formData.get("website")) return redirectTo("subscribed=1")

  const email = validateEmail(formData.get("email"))
  if (!email) return redirectTo("error=invalid")
  if (!process.env.RESEND_API_KEY) return redirectTo("error=config")

  try {
    const response = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "AvTLDR.news/1.0",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
      signal: AbortSignal.timeout(10_000),
    })

    if (response.ok) return redirectTo("subscribed=1")
    console.error("Resend rejected a newsletter signup:", response.status)
  } catch (error) {
    console.error("Newsletter signup failed:", error)
  }

  return redirectTo("error=send")
}
