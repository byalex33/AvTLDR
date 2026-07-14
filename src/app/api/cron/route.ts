import { revalidatePath } from "next/cache"

import { refreshNews } from "@/lib/news"

export const maxDuration = 300

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return Response.json({ error: "CRON_SECRET is not configured" }, { status: 503 })
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const edition = await refreshNews()
    revalidatePath("/")
    revalidatePath("/stories")
    revalidatePath("/archive")
    revalidatePath("/sitemap.xml")
    return Response.json({ ok: true, generatedAt: edition.generatedAt, stories: edition.stories.length })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Daily refresh failed; the previous edition is unchanged" }, { status: 500 })
  }
}
