import assert from "node:assert/strict"
import test from "node:test"

const { extractStoryLinks } = await import("../src/lib/news.ts")

test("extractStoryLinks keeps publisher articles and rejects unrelated links", () => {
  const markdown = `
    [Article](/articles/new-aircraft-order-announced)
    [Duplicate](https://example.com/articles/new-aircraft-order-announced?utm_source=test)
    [About](/about-us)
    [External](https://other.example/story-with-a-long-name)
    [Image](/images/aircraft-photo.jpg)
  `

  assert.deepEqual(extractStoryLinks(markdown, "https://example.com/"), [
    "https://example.com/articles/new-aircraft-order-announced",
  ])
})
