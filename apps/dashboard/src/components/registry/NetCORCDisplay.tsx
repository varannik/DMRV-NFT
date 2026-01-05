'use client'

/**
 * NetCORCDisplay Component
 * 
 * Displays the calculated Net CORC value at the top of the data injection UI.
 * Shows the formula breakdown and calculation status.
 */

import { motion } from 'framer-motion'
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  Leaf,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { GlassCard, Button } from '@/components/shared'
import type { NetCORCResult } from '@/types/registry'
import { useState } from 'react'
import clsx from 'clsx'

export interface NetCORCDisplayProps {
  result: NetCORCResult | null | undefined
  formula?: string
  onCalculate: () => void
  isCalculating?: boolean
  className?: string
}

export function NetCORCDisplay({
  result,
  formula,
  onCalculate,
  isCalculating = false,
  className,
}: NetCORCDisplayProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  
  const hasResult = result && result.net_corc !== undefined
  const isValid = result?.is_valid ?? false
  
  return (
    <GlassCard 
      variant="strong"
      className={clsx(
        'overflow-hidden',
        isValid 
          ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 border-emerald-500/30' 
          : 'bg-gradient-to-r from-amber-500/10 to-amber-400/5 border-amber-500/30',
        className
      )}
    >
      {/* Main Display */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Left: Label and Value */}
          <div className="flex items-center gap-4">
            <div className={clsx(
              'w-14 h-14 rounded-xl flex items-center justify-center',
              isValid ? 'bg-emerald-500/20' : 'bg-amber-500/20'
            )}>
              <Leaf className={clsx(
                'w-7 h-7',
                isValid ? 'text-emerald-400' : 'text-amber-400'
              )} />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-white/80">Net CORC</h2>
                {hasResult && (
                  <span className={clsx(
                    'px-2 py-0.5 text-xs rounded',
                    isValid 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-amber-500/20 text-amber-300'
                  )}>
                    {isValid ? 'Valid' : 'Incomplete'}
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mt-1">
                {hasResult ? (
                  <>
                    <motion.span
                      key={result.net_corc}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold text-white"
                    >
                      {result.net_corc.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </motion.span>
                    <span className="text-xl text-white/50">tCO₂e</span>
                  </>
                ) : (
                  <span className="text-2xl text-white/30">—</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Toggle Breakdown */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className={clsx(
                'flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors',
                'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80'
              )}
            >
              {showBreakdown ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show Details
                </>
              )}
            </button>
            
            {/* Calculate Button */}
            <Button
              onClick={onCalculate}
              disabled={isCalculating}
              variant="primary"
              className="gap-2"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  Calculate
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Breakdown Section */}
      {showBreakdown && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10"
        >
          <div className="p-6 space-y-4">
            {/* Formula Display */}
            {formula && (
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                  <Calculator className="w-4 h-4" />
                  <span>Formula</span>
                </div>
                <code className="text-emerald-300 font-mono text-sm">
                  {formula}
                </code>
              </div>
            )}
            
            {/* Value Breakdown */}
            {hasResult && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <BreakdownCard
                  label="Gross Removal"
                  value={result.gross_removal}
                  icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
                  color="emerald"
                />
                <BreakdownCard
                  label="Project Emissions"
                  value={result.total_emissions}
                  icon={<TrendingDown className="w-4 h-4 text-amber-400" />}
                  color="amber"
                  isNegative
                />
                <BreakdownCard
                  label="Leakage"
                  value={result.leakage}
                  icon={<AlertCircle className="w-4 h-4 text-red-400" />}
                  color="red"
                  isNegative
                />
                <BreakdownCard
                  label="Buffer Pool"
                  value={result.buffer}
                  icon={<CheckCircle className="w-4 h-4 text-blue-400" />}
                  color="blue"
                  isNegative
                />
              </div>
            )}
            
            {/* Calculation Equation */}
            {hasResult && (
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-center gap-3 text-sm font-mono">
                  <span className="text-emerald-400">{result.gross_removal.toLocaleString()}</span>
                  <span className="text-white/40">-</span>
                  <span className="text-amber-400">{result.total_emissions.toLocaleString()}</span>
                  <span className="text-white/40">-</span>
                  <span className="text-red-400">{result.leakage.toLocaleString()}</span>
                  <span className="text-white/40">-</span>
                  <span className="text-blue-400">{result.buffer.toLocaleString()}</span>
                  <span className="text-white/40">=</span>
                  <span className="text-white font-bold">{result.net_corc.toLocaleString()}</span>
                  <span className="text-white/50">tCO₂e</span>
                </div>
              </div>
            )}
            
            {/* Validation Errors */}
            {result?.validation_errors && result.validation_errors.length > 0 && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Validation Issues</span>
                </div>
                <ul className="list-disc list-inside text-sm text-red-300/80">
                  {result.validation_errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Timestamp */}
            {result?.calculated_at && (
              <p className="text-xs text-white/40 text-right">
                Last calculated: {new Date(result.calculated_at).toLocaleString()}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </GlassCard>
  )
}

interface BreakdownCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: 'emerald' | 'amber' | 'red' | 'blue'
  isNegative?: boolean
}

function BreakdownCard({ label, value, icon, color, isNegative = false }: BreakdownCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30',
    amber: 'bg-amber-500/10 border-amber-500/30',
    red: 'bg-red-500/10 border-red-500/30',
    blue: 'bg-blue-500/10 border-blue-500/30',
  }
  
  return (
    <div className={clsx(
      'p-4 rounded-lg border',
      colorClasses[color]
    )}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-white/60">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        {isNegative && <span className="text-white/40">-</span>}
        <span className="text-xl font-bold text-white">
          {value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
        <span className="text-xs text-white/50">tCO₂e</span>
      </div>
    </div>
  )
}

export default NetCORCDisplay

