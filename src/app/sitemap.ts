import type { MetadataRoute } from "next"

import { editionDay, listArchiveDates, loadEdition } from "@/lib/news"
import { SITE_URL } from "@/lib/seo"
import { stories, storyPath } from "@/lib/stories"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [edition, archiveDates] = await Promise.all([loadEdition(stories), listArchiveDates()])
  const date = editionDay(edition.generatedAt)

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/stories`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/archive`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/methodology`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    ...edition.stories.map((story) => ({
      url: `${SITE_URL}${storyPath(date, story.id)}`,
      lastModified: edition.generatedAt,
      changeFrequency: "never" as const,
      priority: 0.8,
      ...(story.imageUrl ? { images: [story.imageUrl] } : {}),
    })),
    ...archiveDates.map((archiveDate) => ({
      url: `${SITE_URL}/archive/${archiveDate}`,
      lastModified: archiveDate,
      changeFrequency: "never" as const,
      priority: 0.5,
    })),
  ]
}
