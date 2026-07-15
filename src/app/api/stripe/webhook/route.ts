import { BlobPreconditionFailedError, get, put } from "@vercel/blob"
import { clerkClient } from "@clerk/nextjs/server"
import type Stripe from "stripe"

import { stripe } from "@/lib/stripe"
import { subscriptionReference, subscriptionState } from "@/lib/stripe-billing"

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get("stripe-signature")
  if (!secret || !signature) return new Response("Webhook is not configured", { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret)
  } catch {
    return new Response("Invalid signature", { status: 400 })
  }

  if (await eventProcessed(event.id)) return Response.json({ received: true, duplicate: true })

  const reference = subscriptionReference(event)
  if (reference) {
    const subscription = await stripe().subscriptions.retrieve(reference.subscriptionId)
    const metadataUserId = subscription.metadata.clerkUserId
    if (reference.expectedUserId && metadataUserId && reference.expectedUserId !== metadataUserId) {
      throw new Error(`Stripe subscription ${subscription.id} has conflicting Clerk user metadata`)
    }
    const userId = metadataUserId || reference.expectedUserId
    if (userId) await syncSubscription(subscription, userId)
  }

  await markEventProcessed(event)
  console.info("Stripe webhook processed", { eventId: event.id, eventType: event.type })
  return Response.json({ received: true })
}

async function syncSubscription(subscription: Stripe.Subscription, userId: string) {
  if (!userId.startsWith("user_")) return
  const state = subscriptionState(subscription)
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id
  await (await clerkClient()).users.updateUserMetadata(userId, {
    publicMetadata: {
      plan: state.plan,
      subscriptionStatus: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      billingInterval: state.billingInterval,
      ...(state.paidThrough ? { paidThrough: state.paidThrough } : {}),
    },
    privateMetadata: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: state.keepSubscription ? subscription.id : null,
    },
  })
}

function eventPath(eventId: string) {
  return `avtldr/stripe-events/${eventId}.json`
}

function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

async function eventProcessed(eventId: string) {
  if (!hasBlobStore()) {
    if (process.env.NODE_ENV === "production") throw new Error("A Vercel Blob store is required for durable Stripe webhook deduplication")
    return false
  }
  const result = await get(eventPath(eventId), { access: "private", useCache: false })
  await result?.stream?.cancel()
  return result?.statusCode === 200
}

async function markEventProcessed(event: Stripe.Event) {
  if (!hasBlobStore()) return
  try {
    await put(eventPath(event.id), JSON.stringify({ type: event.type, created: event.created }), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
    })
  } catch (error) {
    if (!(error instanceof BlobPreconditionFailedError)) throw error
  }
}
