import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: "AvTLDR.news — Global aviation news, shortened",
  description:
    "A once-daily briefing covering the most important global aviation stories.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
