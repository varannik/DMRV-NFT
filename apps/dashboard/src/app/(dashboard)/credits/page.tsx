'use client'

/**
 * Credits Page
 * 
 * Shows minted NFT credits with their status.
 */

import { motion } from 'framer-motion'
import { Coins, ExternalLink, Copy } from 'lucide-react'
import { GlassCard, Button, StatusBadge } from '@/components/shared'

const demoCredits = [
  { id: 'credit-1', tokenId: '#4201', tonnage: 15000, vintage: 2024, status: 'active' as const, txHash: '0x1a2b3c...' },
  { id: 'credit-2', tokenId: '#4200', tonnage: 12500, vintage: 2024, status: 'active' as const, txHash: '0x4d5e6f...' },
  { id: 'credit-3', tokenId: '#4199', tonnage: 18000, vintage: 2023, status: 'retired' as const, txHash: '0x7g8h9i...' },
  { id: 'credit-4', tokenId: '#4198', tonnage: 9500, vintage: 2023, status: 'active' as const, txHash: '0xj0k1l2...' },
]

export default function CreditsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Carbon Credits</h1>
          <p className="text-white/60">Your minted NFT carbon credits on NEAR</p>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">55,000</p>
            <p className="text-sm text-white/60">Total tCO₂e</p>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">4</p>
            <p className="text-sm text-white/60">NFTs Minted</p>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">$1.2M</p>
            <p className="text-sm text-white/60">Portfolio Value</p>
          </div>
        </GlassCard>
      </div>
      
      {/* Credits List */}
      <div className="space-y-4">
        {demoCredits.map((credit, index) => (
          <motion.div
            key={credit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/10 flex items-center justify-center">
                  <Coins className="w-8 h-8 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">Token {credit.tokenId}</h3>
                    <StatusBadge status={credit.status} size="sm" />
                  </div>
                  <p className="text-sm text-white/60">Vintage {credit.vintage}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{credit.tonnage.toLocaleString()} tCO₂e</p>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <span className="font-mono">{credit.txHash}</span>
                    <button className="hover:text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="hover:text-white">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

