import type Stripe from "stripe"

const proStatuses = new Set<Stripe.Subscription.Status>(["active", "trialing", "past_due"])
const paidStatuses = new Set<Stripe.Subscription.Status>(["active", "trialing"])
const endedStatuses = new Set<Stripe.Subscription.Status>(["canceled", "incomplete_expired"])

export function subscriptionReference(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const checkout = event.data.object
    const subscription = checkout.subscription
    const subscriptionId = typeof subscription === "string" ? subscription : subscription?.id
    if (subscriptionId) return {
      subscriptionId,
      expectedUserId: checkout.client_reference_id ?? checkout.metadata?.clerkUserId ?? undefined,
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    return { subscriptionId: event.data.object.id }
  }

  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const subscription = event.data.object.parent?.subscription_details?.subscription
    const subscriptionId = typeof subscription === "string" ? subscription : subscription?.id
    if (subscriptionId) return { subscriptionId }
  }
}

export function subscriptionState(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0]
  const interval = item?.price.recurring?.interval
  const hasPro = proStatuses.has(subscription.status)

  return {
    plan: hasPro ? "pro" : "free",
    billingInterval: interval === "month" || interval === "year" ? interval : null,
    paidThrough: paidStatuses.has(subscription.status) && item?.current_period_end
      ? new Date(item.current_period_end * 1000).toISOString()
      : undefined,
    keepSubscription: !endedStatuses.has(subscription.status),
  } as const
}
