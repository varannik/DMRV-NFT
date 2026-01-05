import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/components/providers"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DMRV Dashboard | Digital MRV for Carbon Credit Issuance",
  description: "Registry-first digital MRV platform for carbon credit issuance. Blockchain-verified, multi-tenant, real-time tracking.",
  keywords: ["DMRV", "carbon credits", "MRV", "blockchain", "NFT", "carbon registry", "Verra", "Puro"],
  openGraph: {
    title: "DMRV Dashboard",
    description: "Digital MRV for Carbon Credit Issuance",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <QueryProvider>
        {children}
        </QueryProvider>
      </body>
    </html>
  )
}
