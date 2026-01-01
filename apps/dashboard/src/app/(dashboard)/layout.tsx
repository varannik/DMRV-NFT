'use client'

/**
 * Dashboard Layout
 * 
 * Responsive three-column layout with expandable sidebar and steps tracker.
 * - Mobile: No sidebars, hamburger menu
 * - Tablet: Left sidebar only
 * - Desktop: Both sidebars
 */

import { ReactNode, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { Sidebar, StepsTracker } from '@/components/layout'
import { useSidebarStore, useProcessStore } from '@/lib/stores'
import { GlassCard } from '@/components/shared'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isExpanded } = useSidebarStore()
  const { currentProcess } = useProcessStore()
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  
  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1280)
      
      // Auto-hide right sidebar on smaller screens
      if (width < 1280) {
        setShowRightSidebar(false)
      } else {
        setShowRightSidebar(true)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Calculate main content margins based on screen size and sidebar states
  const getMainMargins = () => {
    if (isMobile) {
      return { marginLeft: 0, marginRight: 0, paddingTop: 80 }
    }
    
    const leftMargin = isExpanded ? 280 : 80
    const rightMargin = showRightSidebar ? 336 : 0
    
    return { marginLeft: leftMargin, marginRight: rightMargin, paddingTop: 0 }
  }
  
  const margins = getMainMargins()
  
  return (
    <div className="min-h-screen">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <motion.main
        initial={false}
        animate={margins}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen p-4 md:p-6"
      >
        {children}
      </motion.main>
      
      {/* Right Sidebar Toggle Button - visible on tablet and desktop */}
      {!isMobile && (
        <button
          onClick={() => setShowRightSidebar(!showRightSidebar)}
          className={`fixed top-4 z-30 w-10 h-10 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 ${
            showRightSidebar ? 'right-[340px]' : 'right-4'
          }`}
          aria-label={showRightSidebar ? 'Hide steps tracker' : 'Show steps tracker'}
        >
          {showRightSidebar ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5" />
          )}
        </button>
      )}
      
      {/* Right Sidebar - Steps Tracker */}
      <motion.div 
        initial={false}
        animate={{ 
          x: showRightSidebar ? 0 : 350,
          opacity: showRightSidebar ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed right-0 top-0 bottom-0 p-4 hidden md:block"
      >
        <StepsTracker
          steps={currentProcess?.steps || []}
          currentPhase={currentProcess?.current_phase || 3}
          onStepClick={(stepId, phase) => {
            console.log('Step clicked:', stepId, 'Phase:', phase)
          }}
        />
      </motion.div>
      
      {/* Mobile Steps Tracker - Collapsible at bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <GlassCard className="!rounded-none !rounded-t-2xl !p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Phase 3: Verification</p>
                <p className="text-xs text-white/50">5/9 categories completed</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[37.5%] rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                </div>
                <span className="text-sm text-white/70">37.5%</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
