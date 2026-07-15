import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

import { requirePro } from "@/lib/auth"
import { loadEdition } from "@/lib/news"
import { csvForStories, customBriefing, loadProProfile } from "@/lib/pro"
import { stories } from "@/lib/stories"

export async function GET(_request: Request, { params }: RouteContext<"/api/pro/export/[format]">) {
  const { format } = await params
  if (!["csv", "pdf"].includes(format)) return new Response("Not found", { status: 404 })

  const { userId } = await requirePro()
  const [edition, profile] = await Promise.all([loadEdition(stories), loadProProfile(userId)])
  const briefing = customBriefing(edition.stories, profile)
  const date = edition.generatedAt.slice(0, 10)

  if (format === "csv") {
    return new Response(csvForStories(briefing), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="avtldr-${date}.csv"`,
      },
    })
  }

  const pdf = await briefingPdf(date, briefing)
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="avtldr-${date}.pdf"`,
    },
  })
}

async function briefingPdf(date: string, briefing: typeof stories) {
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  let page = pdf.addPage([595, 842])
  let y = 790

  const line = (text: string, size = 10, isBold = false) => {
    if (y < 55) {
      page = pdf.addPage([595, 842])
      y = 790
    }
    page.drawText(ascii(text), { x: 48, y, size, font: isBold ? bold : regular, color: rgb(0.08, 0.1, 0.15) })
    y -= size + 5
  }

  line("AvTLDR Pro", 22, true)
  line(`Custom daily briefing - ${date}`, 12)
  y -= 14

  for (const story of briefing) {
    for (const part of wrap(`${story.category.toUpperCase()} | ${story.headline}`, 76)) line(part, 12, true)
    for (const part of wrap(story.summary, 92)) line(part)
    for (const part of wrap(story.url, 92)) line(part, 8)
    y -= 12
  }

  return pdf.save()
}

function wrap(value: string, width: number) {
  const words = ascii(value).split(/\s+/).flatMap((word) => word.match(new RegExp(`.{1,${width}}`, "g")) ?? [])
  const lines: string[] = []
  for (const word of words) {
    const last = lines.at(-1)
    if (!last || last.length + word.length + 1 > width) lines.push(word)
    else lines[lines.length - 1] = `${last} ${word}`
  }
  return lines
}

function ascii(value: string) {
  // ponytail: standard PDF fonts are ASCII-only; embed a Unicode font when multilingual editions ship.
  return value.normalize("NFKD").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[^\x20-\x7E]/g, "")
}
