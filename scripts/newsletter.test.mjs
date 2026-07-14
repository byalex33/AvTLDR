import assert from "node:assert/strict"
import test from "node:test"

import { POST } from "../src/app/api/newsletter/route.ts"

test("newsletter signup redirects invalid email without invoking Resend", async () => {
  const formData = new FormData()
  formData.set("email", "not-an-email")

  const response = await POST(new Request("https://avtldr.news/api/newsletter", {
    method: "POST",
    headers: { host: "avtldr.news", origin: "https://avtldr.news" },
    body: formData,
  }))

  assert.equal(response.status, 303)
  assert.equal(response.headers.get("location"), "https://avtldr.news/newsletter?error=invalid")
})

test("newsletter signup redirects after Resend accepts the contact", async () => {
  const originalFetch = globalThis.fetch
  const originalApiKey = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = "re_test"
  globalThis.fetch = async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), { email: "reader@example.com", unsubscribed: false })
    return new Response(null, { status: 200 })
  }

  try {
    const formData = new FormData()
    formData.set("email", "reader@example.com")
    const response = await POST(new Request("https://avtldr.news/api/newsletter", {
      method: "POST",
      headers: { host: "avtldr.news", origin: "https://avtldr.news" },
      body: formData,
    }))

    assert.equal(response.status, 303)
    assert.equal(response.headers.get("location"), "https://avtldr.news/newsletter?subscribed=1")
  } finally {
    globalThis.fetch = originalFetch
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalApiKey
  }
})
