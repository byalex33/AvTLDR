import assert from "node:assert/strict"
import test from "node:test"

import { csvForStories, customBriefing, proPriceEnvironmentVariable, searchEditions } from "../src/lib/pro.ts"

const story = {
  id: "test",
  importance: 8,
  category: "Aircraft",
  headline: "Airbus tests a new wing",
  summary: "The demonstrator flew today.",
  whatHappened: "A test flight completed.",
  whyItMatters: "It may reduce fuel burn.",
  source: "Test News",
  publishedAt: "2026-07-15T06:00:00Z",
  url: "https://example.com/wing",
}

test("Pro briefing filters and archive search use the selected content", () => {
  assert.deepEqual(customBriefing([story], { categories: ["Aircraft"], publishers: [] }), [story])
  assert.deepEqual(customBriefing([story], { categories: ["Safety"], publishers: [] }), [])
  assert.equal(searchEditions([{ generatedAt: "2026-07-15T06:00:00Z", stories: [story] }], "airbus wing")[0].story.id, "test")
  assert.deepEqual(searchEditions([{ generatedAt: "2026-07-15T06:00:00Z", stories: [story] }], "boeing"), [])
})

test("CSV export quotes commas and quotes", () => {
  const csv = csvForStories([{ ...story, summary: 'One, "quoted" summary' }])
  assert.match(csv, /"One, ""quoted"" summary"/)
  assert.equal(csv.split("\r\n").length, 2)
})

test("Pro billing accepts only the configured checkout periods", () => {
  assert.equal(proPriceEnvironmentVariable("monthly"), "STRIPE_PRO_PRICE_ID")
  assert.equal(proPriceEnvironmentVariable("yearly"), "STRIPE_PRO_YEARLY_PRICE_ID")
  assert.equal(proPriceEnvironmentVariable("lifetime"), undefined)
})
