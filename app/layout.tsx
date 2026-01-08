import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeEvolve - Master Industry Assessments',
  description: 'Practice 4-level progressive coding challenges used by top tech companies. Runs in-browser with Pyodide.',
  openGraph: {
    title: 'CodeEvolve - Master Industry Assessments',
    description: 'Practice 4-level progressive coding challenges used by top tech companies.',
    url: 'https://code-evolve.vercel.app/',
    siteName: 'CodeEvolve',
    images: [
      {
        url: 'https://code-evolve.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}