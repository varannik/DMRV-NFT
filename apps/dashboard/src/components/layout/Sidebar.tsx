'use client'

/**
 * Sidebar Component
 * 
 * The main navigation sidebar for the dashboard.
 * Supports switching between DMRV and Marketplace modes.
 * Collapsible/expandable with glassmorphism styling.
 * Responsive: hidden on mobile with hamburger toggle.
 */

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
  Bell,
  LogOut,
  Layers,
  Menu,
  X,
  Upload,
  Store,
  LineChart,
  ArrowLeftRight,
  Globe,
  Briefcase,
  Building2,
  Leaf,
} from 'lucide-react'
import { useSidebarStore, useAuthStore, useAppModeStore, type AppMode } from '@/lib/stores'
import { GlassCard } from '@/components/shared'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

// DMRV Mode Navigation
const dmrvNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', href: '/projects', icon: FolderKanban },
  { id: 'data-injection', label: 'Data Injection', href: '/data-injection', icon: Upload },
  { id: 'mrv', label: 'MRV Submissions', href: '/mrv', icon: FileSpreadsheet, badge: 3 },
  { id: 'verification', label: 'Verification', href: '/verification', icon: CheckCircle2 },
  { id: 'credits', label: 'Credits', href: '/credits', icon: Coins },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
]

// Marketplace Mode Navigation
const marketplaceNavItems: NavItem[] = [
  { id: 'marketplace', label: 'Marketplace', href: '/marketplace', icon: Store },
  { id: 'portfolio', label: 'My Portfolio', href: '/marketplace/portfolio', icon: Briefcase },
  { id: 'registries', label: 'My Registries', href: '/marketplace/registries', icon: Building2 },
  { id: 'trading', label: 'Trading Desk', href: '/marketplace/trading', icon: ArrowLeftRight },
  { id: 'explorer', label: 'NEAR Explorer', href: '/marketplace/explorer', icon: Globe },
  { id: 'analytics', label: 'Analytics', href: '/marketplace/analytics', icon: LineChart },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isExpanded, toggle, collapse } = useSidebarStore()
  const { user, logout } = useAuthStore()
  const { mode, setMode } = useAppModeStore()
  const [isMobile, setIsMobile] = useState(false)
  
  // Get navigation items based on current mode
  const navItems = mode === 'dmrv' ? dmrvNavItems : marketplaceNavItems
  
  // Track mobile state and collapse sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
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

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode)
    // Navigate to the appropriate home page
    if (newMode === 'dmrv') {
      router.push('/dashboard')
    } else {
      router.push('/marketplace')
    }
  }
  
  return (
    <>
      {/* Mobile Menu Button - Fixed top left, hidden when sidebar is open */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={toggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl glass flex items-center justify-center text-white shadow-lg shadow-black/30 border border-white/10"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Mobile Overlay - closes sidebar when clicked */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={collapse}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? 280 : (isExpanded ? 280 : 80),
          x: isMobile ? (isExpanded ? 0 : -300) : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={clsx(
          'fixed z-40 flex flex-col',
          // Desktop: floating with margins
          'md:left-4 md:top-4 md:bottom-4',
          // Mobile: full height, slides in from left
          'max-md:left-0 max-md:top-0 max-md:bottom-0'
        )}
      >
        <GlassCard 
          className={clsx(
            'flex-1 flex flex-col overflow-hidden !p-0 shadow-2xl shadow-black/40',
            // Desktop: rounded corners
            'md:!rounded-2xl',
            // Mobile: no rounded corners (full height)
            'max-md:!rounded-none'
          )}
          variant="strong"
        >
          {/* Logo */}
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <motion.button 
              onClick={isMobile ? undefined : toggle}
              whileHover={isMobile ? undefined : { scale: 1.02 }}
              whileTap={isMobile ? undefined : { scale: 0.98 }}
              className={clsx(
                'flex items-center gap-3 group',
                !isMobile && 'cursor-pointer'
              )}
            >
              <motion.div 
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden',
                  mode === 'dmrv' 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                )}
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {mode === 'dmrv' ? (
                  <Layers className="w-5 h-5 text-white" />
                ) : (
                  <Store className="w-5 h-5 text-white" />
                )}
                {/* Shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-bold text-xl text-white whitespace-nowrap overflow-hidden"
                  >
                    {mode === 'dmrv' ? 'DMRV' : 'Marketplace'}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Expand indicator when collapsed (desktop only) */}
              {!isExpanded && !isMobile && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4 text-white/50 rotate-180" />
                </motion.div>
              )}
            </motion.button>
            
            {/* Desktop: collapse button */}
            <AnimatePresence>
              {isExpanded && !isMobile && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={toggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 items-center justify-center text-white/60 hover:text-white hover:border-white/20 hover:from-white/15 hover:to-white/10 transition-all duration-300 shadow-lg shadow-black/20"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
            
            {/* Mobile: close button */}
            {isMobile && isExpanded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={collapse}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </div>
          
          {/* Mode Switcher */}
          <div className="p-3 border-b border-white/10">
            <div className={clsx(
              'flex rounded-xl bg-white/5 p-1',
              !isExpanded && 'flex-col gap-1'
            )}>
              <button
                onClick={() => handleModeChange('dmrv')}
                className={clsx(
                  'flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200',
                  isExpanded ? 'flex-1 px-3' : 'w-full px-2',
                  mode === 'dmrv'
                    ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/20 text-green-400 border border-green-500/30'
                    : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                )}
                title="DMRV Mode"
              >
                <Leaf className="w-4 h-4 flex-shrink-0" />
                {isExpanded && <span className="text-sm font-medium">DMRV</span>}
              </button>
              <button
                onClick={() => handleModeChange('marketplace')}
                className={clsx(
                  'flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200',
                  isExpanded ? 'flex-1 px-3' : 'w-full px-2',
                  mode === 'marketplace'
                    ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                )}
                title="Marketplace Mode"
              >
                <Store className="w-4 h-4 flex-shrink-0" />
                {isExpanded && <span className="text-sm font-medium">Market</span>}
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => {
                // Check if this is the exact route or a child route
                // But exclude parent routes when a more specific child route matches
                const isExactMatch = pathname === item.href
                const isChildMatch = pathname.startsWith(`${item.href}/`)
                
                // For routes like '/marketplace', only match exactly - not when on '/marketplace/portfolio'
                // This prevents parent nav items from staying highlighted when on child pages
                const hasMoreSpecificMatch = navItems.some(
                  other => other.href !== item.href && 
                           other.href.startsWith(`${item.href}/`) && 
                           (pathname === other.href || pathname.startsWith(`${other.href}/`))
                )
                
                const isActive = isExactMatch || (isChildMatch && !hasMoreSpecificMatch)
                const Icon = item.icon
                
                return (
                  <li key={item.id} className="relative">
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={clsx(
                        'w-full flex items-center py-3 rounded-xl transition-all duration-200',
                        // When collapsed: center icon, when expanded: left-align with gap
                        isExpanded ? 'gap-3 px-3 text-left' : 'justify-center px-2',
                        isActive
                          ? mode === 'dmrv'
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-white border border-green-500/30'
                            : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-white border border-blue-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                      )}
                    >
                      <Icon className={clsx(
                        'w-5 h-5 flex-shrink-0', 
                        isActive && (mode === 'dmrv' ? 'text-green-400' : 'text-blue-400')
                      )} />
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
              'w-full flex items-center py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition mb-2 relative',
              isExpanded ? 'gap-3 px-3' : 'justify-center px-2'
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
              'flex items-center py-3 rounded-xl bg-white/5',
              isExpanded ? 'gap-3 px-3 justify-between' : 'justify-center px-2'
            )}>
              <div className={clsx(
                'flex items-center',
                isExpanded ? 'gap-3' : ''
              )}>
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
