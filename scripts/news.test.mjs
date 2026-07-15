import assert from "node:assert/strict"
import test from "node:test"

const {
  articleRecency,
  extractDirectStoryLinks,
  extractPublicationDate,
  extractStoryLinks,
  findPreviousStory,
  hasSourceDiversity,
  isEditionSizeValid,
  normalizeImageUrl,
  qualifyStoryRecency,
  rankStories,
} = await import("../src/lib/news.ts")
const { browseStories, formatStoryPublishedAt, stories, storyPath } = await import("../src/lib/stories.ts")
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

test("direct source discovery keeps query-based article links", () => {
  assert.deepEqual(extractDirectStoryLinks(
    "[Home](/)\n[Incident](/h?article=52abc123&utm_source=feed)\n[Image](/photo.jpg)",
    "https://avherald.com/",
  ), ["https://avherald.com/h?article=52abc123"])
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

test("publication dates prefer structured metadata over Open Graph", () => {
  const rawHtml = `
    <meta content="2026-07-14T05:00:00Z" property="article:published_time">
    <script type="application/ld+json">
      {"@type":"NewsArticle","datePublished":"2026-07-14T04:30:00+00:00"}
    </script>
  `

  assert.deepEqual(extractPublicationDate({ rawHtml, url: "https://example.com/story" }), {
    publishedAt: "2026-07-14T04:30:00.000Z",
    publicationDateSource: "structured",
  })
})

test("publication dates use Open Graph, time elements, and dated URLs as fallbacks", () => {
  assert.deepEqual(extractPublicationDate({
    rawHtml: '<meta name="article:published_time" content="2026-07-14T03:00:00Z">',
    url: "https://example.com/story",
  }), {
    publishedAt: "2026-07-14T03:00:00.000Z",
    publicationDateSource: "open-graph",
  })

  assert.deepEqual(extractPublicationDate({
    metadata: { publishedTime: "2026-07-14T02:00:00Z" },
    url: "https://example.com/story",
  }), {
    publishedAt: "2026-07-14T02:00:00.000Z",
    publicationDateSource: "metadata",
  })

  assert.deepEqual(extractPublicationDate({
    rawHtml: '<time class="published" datetime="2026-07-14">14 July 2026</time>',
    url: "https://example.com/story",
  }), {
    publishedAt: "2026-07-14T00:00:00.000Z",
    publicationDateSource: "time",
  })

  assert.deepEqual(extractPublicationDate({
    url: "https://example.com/news/2026/07/14/aircraft-order-announced/",
  }), {
    publishedAt: "2026-07-14T00:00:00.000Z",
    publicationDateSource: "url",
  })
})

test("publication dates reject relative, modified-only, and timezone-ambiguous evidence", () => {
  assert.equal(extractPublicationDate({
    metadata: { modifiedTime: "2026-07-14T05:00:00Z", publishedTime: "Yesterday" },
    rawHtml: '<time class="updated" datetime="2026-07-14T05:00:00Z">Updated</time>',
    url: "https://example.com/story",
  }), undefined)
  assert.equal(extractPublicationDate({
    metadata: { publishedTime: "2026-07-14 05:00:00" },
    url: "https://example.com/story",
  }), undefined)
})

test("publication dates reject materially conflicting trustworthy signals", () => {
  assert.equal(extractPublicationDate({
    rawHtml: `
      <script type="application/ld+json">
        {"@type":"NewsArticle","datePublished":"2026-07-14T04:00:00Z"}
      </script>
      <meta property="article:published_time" content="2026-06-10T04:00:00Z">
    `,
    url: "https://example.com/story",
  }), undefined)
})

test("lower-confidence related time elements do not override article metadata", () => {
  assert.deepEqual(extractPublicationDate({
    rawHtml: `
      <meta property="article:published_time" content="2026-07-14T04:00:00Z">
      <time class="published" datetime="2026-06-10T04:00:00Z">Related story</time>
    `,
    url: "https://example.com/story",
  }), {
    publishedAt: "2026-07-14T04:00:00.000Z",
    publicationDateSource: "open-graph",
  })
})

test("recency windows enforce 24 hours normally and reject anything beyond 72 hours", () => {
  const now = "2026-07-15T06:00:00Z"
  assert.equal(articleRecency("2026-07-14T06:00:00Z", now), "recent")
  assert.equal(articleRecency("2026-07-14T05:59:59Z", now), "older")
  assert.equal(articleRecency("2026-07-12T06:00:00Z", now), "older")
  assert.equal(articleRecency("2026-07-12T05:59:59Z", now), "ineligible")
  assert.equal(articleRecency("2026-07-15T06:16:00Z", now), "ineligible")
})

test("older stories require a valid Developing or high-significance Worth Knowing label", () => {
  const now = "2026-07-15T06:00:00Z"
  const older = "2026-07-13T18:00:00Z"

  assert.deepEqual(qualifyStoryRecency(older, "None", 10, now), { eligible: false })
  assert.deepEqual(qualifyStoryRecency(older, "Developing", 6, now), {
    eligible: true,
    label: "Developing",
  })
  assert.deepEqual(qualifyStoryRecency(older, "Worth Knowing", 7, now), { eligible: false })
  assert.deepEqual(qualifyStoryRecency(older, "Worth Knowing", 8, now), {
    eligible: true,
    label: "Worth Knowing",
  })
  assert.deepEqual(qualifyStoryRecency("2026-07-15T05:00:00Z", "Developing", 9, now), {
    eligible: true,
  })
})

test("previous stories are detected by canonical URL or strong headline overlap", () => {
  const history = [{
    key: "2026-07-14/aircraft-order",
    headline: "Airbus wins major aircraft order from Example Air",
    url: "https://example.com/airbus-order?utm_source=newsletter",
  }]

  assert.equal(findPreviousStory({
    headline: "Completely different headline",
    url: "https://www.example.com/airbus-order#latest",
  }, history)?.key, history[0].key)
  assert.equal(findPreviousStory({
    headline: "Example Air confirms major Airbus aircraft order",
    url: "https://other.example/new-report",
  }, history)?.key, history[0].key)
})

test("verified timestamps render consistently for readers", () => {
  assert.match(formatStoryPublishedAt("2026-07-14T05:00:00Z"), /14 Jul.*BST/)
})

test("fallback stories obey the same recency and labelling rules", () => {
  assert.equal(isEditionSizeValid(stories), true)
  assert.equal(hasSourceDiversity(stories), true)
  for (const story of stories) {
    assert.equal(
      qualifyStoryRecency(
        story.publishedAt,
        story.recencyLabel ?? "None",
        story.importance,
        "2026-07-14T06:00:00Z",
      ).eligible,
      true,
    )
  }
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
