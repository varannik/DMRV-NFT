'use client'

/**
 * FormulaTree Component
 * 
 * Renders the dynamic Net CORC calculation tree based on registry configuration.
 * This is the main component for the data injection UI.
 */

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight, 
  Calculator, 
  Minus,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { GlassCard } from '@/components/shared'
import { TreeNode } from './TreeNode'
import { NetCORCDisplay } from './NetCORCDisplay'
import type { FormulaNode, NodeState, FieldState, NetCORCResult, InputMethod } from '@/types/registry'
import { useRegistryStore } from '@/lib/stores'
import clsx from 'clsx'

export interface FormulaTreeProps {
  tree: FormulaNode
  nodeStates: { [node_id: string]: NodeState }
  fieldValues: { [field_id: string]: FieldState }
  netCorcResult?: NetCORCResult | null
  onFieldChange: (fieldId: string, value: unknown, source: InputMethod) => void
  onFileUpload: (fieldId: string, file: File) => void
  onCalculate: () => void
  isCalculating?: boolean
  className?: string
}

export function FormulaTree({
  tree,
  nodeStates,
  fieldValues,
  netCorcResult,
  onFieldChange,
  onFileUpload,
  onCalculate,
  isCalculating = false,
  className,
}: FormulaTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['net_corc']))
  
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])
  
  const expandAll = useCallback(() => {
    const allNodeIds = new Set<string>()
    
    function collectIds(node: FormulaNode) {
      allNodeIds.add(node.node_id)
      if (node.children) {
        node.children.forEach(collectIds)
      }
    }
    
    collectIds(tree)
    setExpandedNodes(allNodeIds)
  }, [tree])
  
  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set(['net_corc']))
  }, [])
  
  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const states = Object.values(nodeStates)
    if (states.length === 0) return 0
    return Math.round(
      states.reduce((sum, s) => sum + s.progress_percent, 0) / states.length
    )
  }, [nodeStates])
  
  return (
    <div className={clsx('space-y-6', className)}>
      {/* Net CORC Display - Always at top */}
      <NetCORCDisplay
        result={netCorcResult}
        formula={tree.formula}
        onCalculate={onCalculate}
        isCalculating={isCalculating}
      />
      
      {/* Tree Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Progress:</span>
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-white/80 text-sm font-medium">{overallProgress}%</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 text-xs text-white/60 hover:text-white/80 
                     bg-white/5 hover:bg-white/10 rounded transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 text-xs text-white/60 hover:text-white/80 
                     bg-white/5 hover:bg-white/10 rounded transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>
      
      {/* Tree Visualization */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          {/* Root Node */}
          <TreeNodeWrapper
            node={tree}
            nodeStates={nodeStates}
            fieldValues={fieldValues}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
            onFieldChange={onFieldChange}
            onFileUpload={onFileUpload}
            isRoot
          />
          
          {/* Children */}
          <AnimatePresence>
            {expandedNodes.has(tree.node_id) && tree.children && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pl-8 border-l-2 border-white/10 space-y-4"
              >
                {tree.children.map((child, index) => (
                  <TreeNodeWrapper
                    key={child.node_id}
                    node={child}
                    nodeStates={nodeStates}
                    fieldValues={fieldValues}
                    expandedNodes={expandedNodes}
                    onToggle={toggleNode}
                    onFieldChange={onFieldChange}
                    onFileUpload={onFileUpload}
                    isLast={index === tree.children!.length - 1}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  )
}

interface TreeNodeWrapperProps {
  node: FormulaNode
  nodeStates: { [node_id: string]: NodeState }
  fieldValues: { [field_id: string]: FieldState }
  expandedNodes: Set<string>
  onToggle: (nodeId: string) => void
  onFieldChange: (fieldId: string, value: unknown, source: InputMethod) => void
  onFileUpload: (fieldId: string, file: File) => void
  isRoot?: boolean
  isLast?: boolean
}

function TreeNodeWrapper({
  node,
  nodeStates,
  fieldValues,
  expandedNodes,
  onToggle,
  onFieldChange,
  onFileUpload,
  isRoot = false,
  isLast = false,
}: TreeNodeWrapperProps) {
  const isExpanded = expandedNodes.has(node.node_id)
  const hasChildren = node.children && node.children.length > 0
  const nodeState = nodeStates[node.node_id]
  
  // Operator nodes render differently
  if (node.node_type === 'operator') {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                       text-white/60 font-bold text-xl">
          {node.operator}
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative">
      {/* Connection line for non-root nodes */}
      {!isRoot && (
        <div className="absolute -left-8 top-6 w-8 h-0.5 bg-white/10" />
      )}
      
      {/* Node Header */}
      <div
        className={clsx(
          'group flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer',
          'bg-white/5 hover:bg-white/10',
          isExpanded && 'bg-white/10',
          isRoot && 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/10'
        )}
        onClick={() => onToggle(node.node_id)}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren || node.required_inputs ? (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-white/60" />
          </motion.div>
        ) : (
          <div className="w-5" />
        )}
        
        {/* Status Icon */}
        {nodeState?.status === 'complete' ? (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        ) : nodeState?.status === 'error' ? (
          <AlertCircle className="w-5 h-5 text-red-400" />
        ) : nodeState?.status === 'calculating' ? (
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        ) : (
          <div className={clsx(
            'w-5 h-5 rounded-full border-2',
            nodeState?.status === 'partial' 
              ? 'border-amber-400 bg-amber-400/20' 
              : 'border-white/30'
          )} />
        )}
        
        {/* Node Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">
              {node.node_name}
            </span>
            {node.node_type === 'calculated' && (
              <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded">
                Calculated
              </span>
            )}
            {node.node_type === 'input' && (
              <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 rounded">
                Input
              </span>
            )}
          </div>
          {node.description && (
            <p className="text-sm text-white/50 mt-0.5">{node.description}</p>
          )}
        </div>
        
        {/* Value Display */}
        {nodeState?.calculated_value !== undefined && (
          <div className="text-right">
            <span className="text-lg font-bold text-white">
              {nodeState.calculated_value.toLocaleString()}
            </span>
            <span className="text-white/50 text-sm ml-1">tCO₂e</span>
          </div>
        )}
        
        {/* Progress */}
        {nodeState && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={clsx(
                  'h-full rounded-full transition-all',
                  nodeState.progress_percent === 100 
                    ? 'bg-emerald-400' 
                    : 'bg-amber-400'
                )}
                style={{ width: `${nodeState.progress_percent}%` }}
              />
            </div>
            <span className="text-xs text-white/50 w-8">
              {nodeState.progress_percent}%
            </span>
          </div>
        )}
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Formula Display */}
            {node.formula && (
              <div className="mt-4 ml-12 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calculator className="w-4 h-4" />
                  <span>Formula:</span>
                </div>
                <code className="block mt-1 text-sm text-emerald-300 font-mono">
                  {node.formula}
                </code>
              </div>
            )}
            
            {/* Input Fields */}
            {node.required_inputs && node.required_inputs.length > 0 && (
              <div className="mt-4 ml-12">
                <TreeNode
                  node={node}
                  fieldValues={fieldValues}
                  onFieldChange={onFieldChange}
                  onFileUpload={onFileUpload}
                />
              </div>
            )}
            
            {/* Child Nodes */}
            {hasChildren && (
              <div className="mt-4 ml-8 pl-4 border-l-2 border-white/10 space-y-4">
                {node.children!.map((child, index) => (
                  <TreeNodeWrapper
                    key={child.node_id}
                    node={child}
                    nodeStates={nodeStates}
                    fieldValues={fieldValues}
                    expandedNodes={expandedNodes}
                    onToggle={onToggle}
                    onFieldChange={onFieldChange}
                    onFileUpload={onFileUpload}
                    isLast={index === node.children!.length - 1}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FormulaTree

