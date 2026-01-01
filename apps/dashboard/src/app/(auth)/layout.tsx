/**
 * Auth Layout
 * 
 * Layout for authentication pages (sign-in, sign-up, forgot password).
 * Displays a centered glassmorphism card with branding.
 */

import Link from 'next/link'
import { Layers } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">DMRV</span>
        </Link>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="p-6 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} DMRV. All rights reserved.
      </footer>
    </div>
  )
}

