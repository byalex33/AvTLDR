import assert from "node:assert/strict"
import test from "node:test"

import { subscriptionReference, subscriptionState } from "../src/lib/stripe-billing.ts"

const subscription = {
  id: "sub_latest",
  status: "active",
  items: { data: [{ current_period_end: 1_800_000_000, price: { recurring: { interval: "month" } } }] },
}

test("all subscription lifecycle events resolve a subscription to retrieve", () => {
  assert.deepEqual(subscriptionReference({ type: "checkout.session.completed", data: { object: { subscription: "sub_checkout", client_reference_id: "user_1" } } }), {
    subscriptionId: "sub_checkout",
    expectedUserId: "user_1",
  })
  for (const type of ["customer.subscription.updated", "customer.subscription.deleted"]) {
    assert.deepEqual(subscriptionReference({ type, data: { object: { id: "sub_event" } } }), { subscriptionId: "sub_event" })
  }
  for (const type of ["invoice.paid", "invoice.payment_failed"]) {
    assert.deepEqual(subscriptionReference({ type, data: { object: { parent: { subscription_details: { subscription: "sub_invoice" } } } } }), { subscriptionId: "sub_invoice" })
  }
})

test("past-due subscriptions keep Pro access during recovery without advancing paid-through", () => {
  assert.deepEqual(subscriptionState(subscription), {
    plan: "pro",
    billingInterval: "month",
    paidThrough: new Date(1_800_000_000_000).toISOString(),
    keepSubscription: true,
  })
  assert.deepEqual(subscriptionState({ ...subscription, status: "past_due" }), {
    plan: "pro",
    billingInterval: "month",
    paidThrough: undefined,
    keepSubscription: true,
  })
  assert.equal(subscriptionState({ ...subscription, items: { data: [{ ...subscription.items.data[0], price: { recurring: { interval: "year" } } }] } }).billingInterval, "year")
  assert.deepEqual(subscriptionState({ ...subscription, status: "unpaid" }), {
    plan: "free",
    billingInterval: "month",
    paidThrough: undefined,
    keepSubscription: true,
  })
  assert.equal(subscriptionState({ ...subscription, status: "canceled" }).keepSubscription, false)
})
