import { revalidatePath } from "next/cache"

import { loadRefreshDiagnostics, NewsRefreshError, refreshNews } from "@/lib/news"

export const maxDuration = 300

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return Response.json({ error: "CRON_SECRET is not configured" }, { status: 503 })
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = new URL(request.url).searchParams
  if (searchParams.get("diagnostics") === "1") {
    const diagnostics = await loadRefreshDiagnostics()
    return diagnostics
      ? Response.json({ ok: true, diagnostics })
      : Response.json({ error: "No refresh diagnostics are available" }, { status: 404 })
  }

  const dryRun = searchParams.get("dryRun") === "1"

  try {
    const { edition, diagnostics } = await refreshNews({ dryRun })
    if (!dryRun) {
      revalidatePath("/")
      revalidatePath("/stories")
      revalidatePath("/archive")
      revalidatePath("/stories/[date]/[id]", "page")
      revalidatePath("/archive/[date]", "page")
      revalidatePath("/sitemap.xml")
      revalidatePath("/news-sitemap.xml")
      revalidatePath("/feed.xml")
    }
    return Response.json({
      ok: true,
      dryRun,
      generatedAt: edition.generatedAt,
      stories: edition.stories.length,
      diagnostics,
      ...(dryRun ? { edition } : {}),
    })
  } catch (error) {
    console.error(error)
    return Response.json({
      error: "Daily refresh failed; the previous edition is unchanged",
      ...(error instanceof NewsRefreshError ? { diagnostics: error.diagnostics } : {}),
    }, { status: 500 })
  }
}
