import type { Metadata, Viewport } from "next"

import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo"

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
  category: "news",
  alternates: { canonical: "/" },
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
