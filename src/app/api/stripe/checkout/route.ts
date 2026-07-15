import { hasProMetadata, requireUser } from "@/lib/auth"
import { proPriceEnvironmentVariable } from "@/lib/pro"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const { session, user } = await requireUser("/pro")
  if (session.has({ feature: "pro" }) || hasProMetadata(user.publicMetadata)) return Response.redirect(new URL("/account/billing", request.url), 303)

  const form = await request.formData().catch(() => undefined)
  const priceVariable = proPriceEnvironmentVariable(form?.get("billing"))
  if (!priceVariable) return new Response("Invalid billing period", { status: 400 })
  const price = process.env[priceVariable]
  if (!price) return new Response(`${priceVariable} is not configured`, { status: 503 })
  const customer = typeof user.privateMetadata.stripeCustomerId === "string" ? user.privateMetadata.stripeCustomerId : undefined
  if (customer && typeof user.privateMetadata.stripeSubscriptionId === "string") {
    const portal = await stripe().billingPortal.sessions.create({ customer, return_url: `${new URL(request.url).origin}/pro` })
    return Response.redirect(portal.url, 303)
  }
  const checkout = await stripe().checkout.sessions.create({
    mode: "subscription",
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    line_items: [{ price, quantity: 1 }],
    client_reference_id: user.id,
    ...(customer
      ? { customer, customer_update: { address: "auto" as const, name: "auto" as const } }
      : { customer_email: user.primaryEmailAddress?.emailAddress }),
    metadata: { clerkUserId: user.id },
    subscription_data: { metadata: { clerkUserId: user.id } },
    success_url: `${new URL(request.url).origin}/account?checkout=success`,
    cancel_url: `${new URL(request.url).origin}/pro?checkout=cancelled`,
  })
  if (!checkout.url) return new Response("Checkout could not be started", { status: 502 })
  return Response.redirect(checkout.url, 303)
}
