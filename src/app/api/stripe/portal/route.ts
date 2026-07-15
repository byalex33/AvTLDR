import { requireUser } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const { user } = await requireUser("/account")
  const customer = user.privateMetadata.stripeCustomerId
  if (typeof customer !== "string") return Response.redirect(new URL("/account", request.url), 303)
  const portal = await stripe().billingPortal.sessions.create({ customer, return_url: `${new URL(request.url).origin}/account` })
  return Response.redirect(portal.url, 303)
}
