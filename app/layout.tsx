import type { Metadata } from "next"
import "./globals.css"
import { FogBackground } from "@/components/ui/fog-background"

export const metadata: Metadata = {
  title: "Desolates - Production OS",
  description: "Game development studio internal CRM",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="antialiased">
        <FogBackground />
        <div className="content-wrapper">
          {children}
        </div>
      </body>
    </html>
  )
}
