import type { MetadataRoute } from "next"

import { editionDay, listArchiveDates, loadArchiveEdition, loadEdition } from "@/lib/news"
import { SITE_URL } from "@/lib/seo"
import { stories, storyPath } from "@/lib/stories"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [edition, archiveDates] = await Promise.all([loadEdition(stories), listArchiveDates()])
  const date = editionDay(edition.generatedAt)
  const archivedEditions = await Promise.all(archiveDates.slice(0, 365).map(loadArchiveEdition))

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: edition.generatedAt, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/stories`, lastModified: edition.generatedAt, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/archive`, lastModified: edition.generatedAt, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/pro`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
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
    ...archivedEditions.flatMap((archivedEdition) => {
      if (!archivedEdition) return []
      const archiveDate = editionDay(archivedEdition.generatedAt)
      return archivedEdition.stories.map((story) => ({
        url: `${SITE_URL}${storyPath(archiveDate, story.id)}`,
        lastModified: archivedEdition.generatedAt,
        changeFrequency: "never" as const,
        priority: 0.7,
        ...(story.imageUrl ? { images: [story.imageUrl] } : {}),
      }))
    }),
  ]

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()]
}
