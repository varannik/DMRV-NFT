'use client'

/**
 * Sidebar Component
 * 
 * The main navigation sidebar for the dashboard.
 * Collapsible/expandable with glassmorphism styling.
 * Responsive: hidden on mobile with hamburger toggle.
 */

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  FileSpreadsheet,
  CheckCircle2,
  Coins,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Layers,
  Menu,
  X,
} from 'lucide-react'
import { useSidebarStore, useAuthStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', href: '/projects', icon: FolderKanban },
  { id: 'mrv', label: 'MRV Submissions', href: '/mrv', icon: FileSpreadsheet, badge: 3 },
  { id: 'verification', label: 'Verification', href: '/verification', icon: CheckCircle2 },
  { id: 'credits', label: 'Credits', href: '/credits', icon: Coins },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isExpanded, toggle, collapse } = useSidebarStore()
  const { user, logout } = useAuthStore()
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        collapse()
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [collapse])
  
  // Handle navigation - close sidebar on mobile after navigation
  const handleNavClick = (href: string) => {
    if (window.innerWidth < 768) {
      collapse()
    }
    router.push(href)
  }
  
  const handleLogout = () => {
    logout()
    router.push('/sign-in')
  }
  
  return (
    <>
      {/* Mobile Menu Button - Fixed top left */}
      <button
        onClick={toggle}
        className="md:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl glass flex items-center justify-center text-white"
        aria-label="Toggle menu"
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={collapse}
            className="md:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isExpanded ? 280 : 80,
          x: 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={clsx(
          'fixed left-0 top-0 bottom-0 z-40 flex flex-col',
          // Mobile: hidden when collapsed, show when expanded
          'max-md:translate-x-[-100%]',
          isExpanded && 'max-md:translate-x-0'
        )}
        style={{
          transform: undefined, // Let framer-motion handle this
        }}
      >
        <GlassCard 
          className="flex-1 flex flex-col !rounded-none !rounded-r-2xl overflow-hidden !p-0"
          variant="strong"
        >
          {/* Logo */}
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <button 
              onClick={() => handleNavClick('/dashboard')}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-bold text-xl text-white whitespace-nowrap overflow-hidden"
                  >
                    DMRV
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={toggle}
              className="hidden md:flex w-8 h-8 rounded-lg bg-white/10 items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition"
              aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon
                
                return (
                  <li key={item.id} className="relative">
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left',
                        isActive
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-white border border-green-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                      )}
                    >
                      <Icon className={clsx('w-5 h-5 flex-shrink-0', isActive && 'text-green-400')} />
                      <AnimatePresence mode="wait">
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1 whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isExpanded && item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                          {item.badge}
                        </span>
                      )}
                    </button>
                    {/* Badge dot for collapsed state */}
                    {!isExpanded && item.badge && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
          
          {/* User Section */}
          <div className="p-3 border-t border-white/10">
            {/* Notifications */}
            <button className={clsx(
              'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition mb-2 relative',
            )}>
              <Bell className="w-5 h-5 flex-shrink-0" />
              {isExpanded && <span className="flex-1 text-left">Notifications</span>}
              {isExpanded && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                  2
                </span>
              )}
              {!isExpanded && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
            
            {/* User Profile */}
            <div className={clsx(
              'flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5',
              isExpanded ? 'justify-between' : 'justify-center'
            )}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                {isExpanded && (
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                )}
              </div>
              {isExpanded && (
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-red-500/20 transition"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.aside>
    </>
  )
}
