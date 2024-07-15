import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "@/app/globals.css"
import { cn } from "@/lib/utils"

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "500", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "RSU St. Elisabeth Purwokerto",
  description: "Pelayanan yang bermutu dalam semangat persaudaraan",
}

export default function RootLayout({
  children,
  title,
}: Readonly<{
  children: React.ReactNode
  title?: string
}>) {
  const pageTitle = title
    ? `${title} | RSU St. Elisabeth Purwokerto`
    : "RSU St. Elisabeth Purwokerto"
  return (
    <html lang="en">
      <head>
        <title>{pageTitle}</title>
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased overflow-hidden",
          fontSans.variable
        )}
        style={{
          backgroundImage: "url('/bg.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}