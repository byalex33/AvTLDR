import type { Metadata, Viewport } from "next"

import { SiteFooter } from "@/components/site-footer"
import { EDITORIAL_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AvTLDR.news — Daily Global Aviation News, Distilled",
    template: "%s | AvTLDR.news",
  },
  description: SITE_DESCRIPTION,
  applicationName: "AvTLDR.news",
  creator: "AvTLDR.news",
  publisher: "AvTLDR.news",
  authors: [{ name: EDITORIAL_NAME, url: "/about" }],
  category: "news",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    title: "AvTLDR.news — Daily Global Aviation News, Distilled",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "AvTLDR.news",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AvTLDR.news — Daily Global Aviation News, Distilled",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-96x96.png?v=2", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
  manifest: "/site.webmanifest?v=3",
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f5f2eb",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className="h-full antialiased">
      <body className="min-h-full">
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
