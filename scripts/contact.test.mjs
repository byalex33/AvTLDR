import assert from "node:assert/strict"
import test from "node:test"

const { validateContactMessage, validateEmail } = await import("../src/lib/contact.ts")

test("email addresses are trimmed and validated", () => {
  assert.equal(validateEmail(" alex@example.com "), "alex@example.com")
  assert.equal(validateEmail("not-an-email"), null)
  assert.equal(validateEmail(null), null)
})

test("contact messages are trimmed and validated", () => {
  assert.deepEqual(validateContactMessage({
    name: " Alex ",
    email: "alex@example.com ",
    subject: " Tip ",
    message: " Something happened. ",
  }), {
    name: "Alex",
    email: "alex@example.com",
    subject: "Tip",
    message: "Something happened.",
  })

  assert.equal(validateContactMessage({ name: "", email: "nope", subject: "", message: "" }), null)
})
