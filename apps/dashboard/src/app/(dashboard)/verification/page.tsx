'use client'

/**
 * Verification Page
 * 
 * Shows verification status across all submissions.
 */

import { motion } from 'framer-motion'
import { ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { GlassCard, StatusBadge } from '@/components/shared'
import { VERIFICATION_CATEGORIES } from '@/types'

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Verification</h1>
        <p className="text-white/60">9-category verification process overview</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-sm text-white/60">Verified</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-sm text-white/60">In Progress</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-sm text-white/60">Requires Attention</p>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Verification Categories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {VERIFICATION_CATEGORIES.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard hover>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-violet-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{category}</p>
                    <p className="text-xs text-white/50">Category {index + 1}</p>
                  </div>
                  <StatusBadge status={index < 5 ? 'completed' : index === 5 ? 'in_progress' : 'pending'} size="sm" showIcon={false} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

