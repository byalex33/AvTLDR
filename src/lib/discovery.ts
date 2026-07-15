import type { Edition } from "./news.ts"
import { editionDay } from "./news.ts"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./seo.ts"
import { storyPath } from "./stories.ts"

const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000
const FUTURE_TOLERANCE_MS = 15 * 60 * 1000

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export function newsSitemapXml(edition: Edition, now = new Date()) {
  const publishedAt = Date.parse(edition.generatedAt)
  const age = now.getTime() - publishedAt
  const isEligible = Number.isFinite(publishedAt) && age >= -FUTURE_TOLERANCE_MS && age <= NEWS_WINDOW_MS
  const date = editionDay(edition.generatedAt)
  const entries = isEligible ? edition.stories.map((story) => `
  <url>
    <loc>${escapeXml(`${SITE_URL}${storyPath(date, story.id)}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_NAME}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(edition.generatedAt)}</news:publication_date>
      <news:title>${escapeXml(story.headline)}</news:title>
    </news:news>
  </url>`).join("") : ""

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${entries}
</urlset>`
}

export function rssXml(edition: Edition) {
  const date = editionDay(edition.generatedAt)
  const items = edition.stories.map((story) => {
    const url = `${SITE_URL}${storyPath(date, story.id)}`
    const description = `${story.summary} ${story.whyItMatters}`
    return `
    <item>
      <title>${escapeXml(story.headline)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${new Date(edition.generatedAt).toUTCString()}</pubDate>
      <category>${escapeXml(story.category)}</category>
    </item>`
  }).join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Daily Aviation Briefing</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date(edition.generatedAt).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <ttl>60</ttl>${items}
  </channel>
</rss>`
}
