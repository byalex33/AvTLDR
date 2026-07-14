import type { Metadata } from "next"

export const SITE_URL = "https://avtldr.news"
export const SITE_DESCRIPTION = "Daily global aviation news, distilled into the stories that matter and why they matter."

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "AvTLDR.news",
      locale: "en_GB",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AvTLDR.news — Global aviation news, shortened" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/twitter-image"] },
  }
}
