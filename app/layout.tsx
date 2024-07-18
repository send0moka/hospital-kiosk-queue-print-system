import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "@/app/globals.css"
import { cn } from "@/lib/utils"
import { NextAuthProvider } from "@/components/molecules/provider"

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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "text-white min-h-screen font-sans antialiased overflow-hidden flex flex-col",
          fontSans.variable
        )}
        style={{
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  )
}
