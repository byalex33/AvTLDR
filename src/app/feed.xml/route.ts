import { rssXml } from "@/lib/discovery"
import { loadEdition } from "@/lib/news"
import { stories } from "@/lib/stories"

export const revalidate = 3600

export async function GET() {
  const edition = await loadEdition(stories)
  return new Response(rssXml(edition), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
