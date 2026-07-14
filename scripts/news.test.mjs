import assert from "node:assert/strict"
import test from "node:test"

const { extractStoryLinks, hasSourceDiversity, normalizeImageUrl, rankStories } = await import("../src/lib/news.ts")
const { browseStories, stories, storyPath } = await import("../src/lib/stories.ts")
const { formatUpdateCountdown } = await import("../src/lib/update-countdown.ts")

test("countdown targets the next 06:00 UTC refresh", () => {
  assert.equal(formatUpdateCountdown(Date.parse("2026-07-14T05:00:00Z")), "01H 00M")
  assert.equal(formatUpdateCountdown(Date.parse("2026-07-14T06:00:00Z")), "24H 00M")
  assert.equal(formatUpdateCountdown(Date.parse("2026-07-14T07:30:00Z")), "22H 30M")
  assert.equal(formatUpdateCountdown(Date.parse("2026-07-14T05:59:30Z")), "00H 01M")
})

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

test("extractStoryLinks skips a source page that also links to itself", () => {
  const homepage = "https://www.flightradar24.com/blog/press-and-media-center/"
  const markdown = `[Press center](${homepage})\n[Release](/blog/inside-flightradar24/new-flight-data-partnership/)`

  assert.deepEqual(extractStoryLinks(markdown, homepage), [
    "https://www.flightradar24.com/blog/inside-flightradar24/new-flight-data-partnership/",
  ])
})

test("rankStories puts the highest importance first without changing the input", () => {
  const stories = [{ importance: 3 }, { importance: 10 }, { importance: 7 }]

  assert.deepEqual(rankStories(stories).map(({ importance }) => importance), [10, 7, 3])
  assert.deepEqual(stories.map(({ importance }) => importance), [3, 10, 7])
})

test("normalizeImageUrl accepts only web images", () => {
  assert.equal(normalizeImageUrl("/hero.jpg", "https://example.com/story"), "https://example.com/hero.jpg")
  assert.equal(normalizeImageUrl("javascript:alert(1)"), undefined)
})

test("the fallback is a full edition", () => {
  assert.ok(stories.length >= 8)
  assert.ok(hasSourceDiversity(stories))
})

test("source diversity rejects cosmetically different names from one dominant publisher", () => {
  const edition = [
    ...Array.from({ length: 3 }, () => ({ source: "AeroTime" })),
    ...Array.from({ length: 3 }, () => ({ source: "Aero Time " })),
    ...Array.from({ length: 2 }, () => ({ source: "AVweb" })),
    ...Array.from({ length: 2 }, () => ({ source: "AirlineGeeks" })),
  ]

  assert.equal(hasSourceDiversity(edition), false)
})

test("story browser filters publisher and search before sorting", () => {
  const result = browseStories(stories, {
    publisher: "AVweb",
    category: "All",
    query: "Gulfstream",
    sort: "importance",
  })

  assert.deepEqual(result.map((story) => story.id), ["gulfstream-saf"])
})

test("story permalinks include the edition and encode the story id", () => {
  assert.equal(storyPath("2026-07-14", "airline/order"), "/stories/2026-07-14/airline%2Forder")
})
