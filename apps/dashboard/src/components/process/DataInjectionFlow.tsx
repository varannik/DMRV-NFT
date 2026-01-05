'use client'

/**
 * DataInjectionFlow Component
 * 
 * Displays the MRV data injection workflow as a visual flow diagram
 * showing the relationships between input data, calculations, and Net CORC.
 * 
 * Integrated directly into the dashboard ProcessFlow view.
 */

import { memo, useState, useMemo, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  BackgroundVariant,
  Position,
  Handle,
  type NodeProps,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Calculator,
  TrendingUp,
  Leaf,
  AlertCircle,
  CheckCircle,
  Upload,
  FileSpreadsheet,
  Database,
  FlaskConical,
  Factory,
  Shield,
  BarChart3,
} from 'lucide-react'
import { GlassCard } from '@/components/shared'
import type { RegistryType } from '@/types'

// ============================================
// Types
// ============================================

interface MetricValue {
  label: string
  value: string | number
  unit?: string
  change?: number
  changeLabel?: string
}

interface DataNodeData {
  nodeType: 'project' | 'input' | 'calculation' | 'output'
  title: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  status: 'complete' | 'partial' | 'empty' | 'calculating'
  progress?: number
  values?: MetricValue[]
  formula?: string
  expanded?: boolean
  correlation?: number
}

// ============================================
// Custom Nodes
// ============================================

const ProjectNode = memo(function ProjectNode({ data }: NodeProps<DataNodeData>) {
  const [isExpanded, setIsExpanded] = useState(data.expanded ?? false)
  const Icon = data.icon
  
  return (
    <div className={clsx(
      'min-w-[220px] max-w-[260px] rounded-xl backdrop-blur-lg transition-all',
      'bg-gradient-to-br from-white/10 to-white/5 border border-white/20',
      'hover:border-white/30 hover:shadow-lg'
    )}>
      <Handle type="source" position={Position.Right} className="!bg-emerald-400 !border-emerald-300 !w-3 !h-3" />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm truncate">{data.title}</h4>
            {data.subtitle && (
              <p className="text-xs text-white/50 truncate">{data.subtitle}</p>
            )}
          </div>
        </div>
        
        {/* Progress */}
        {data.progress !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-white/50">{data.progress}% complete</span>
              <span className={clsx(
                'px-1.5 py-0.5 rounded text-xs font-medium',
                data.status === 'complete' && 'bg-emerald-500/20 text-emerald-400',
                data.status === 'partial' && 'bg-amber-500/20 text-amber-400',
                data.status === 'empty' && 'bg-white/10 text-white/50'
              )}>
                {data.status === 'complete' ? 'Done' : data.status === 'partial' ? 'In Progress' : 'To Do'}
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={clsx(
                  'h-full rounded-full transition-all',
                  data.status === 'complete' ? 'bg-emerald-400' : 'bg-amber-400'
                )}
                style={{ width: `${data.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

const InputMetricNode = memo(function InputMetricNode({ data }: NodeProps<DataNodeData>) {
  const [isExpanded, setIsExpanded] = useState(data.expanded ?? false)
  const Icon = data.icon
  
  return (
    <div className={clsx(
      'min-w-[240px] max-w-[280px] rounded-xl backdrop-blur-lg transition-all',
      'bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30',
      'hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10'
    )}>
      <Handle type="target" position={Position.Left} className="!bg-blue-400 !border-blue-300 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-blue-400 !border-blue-300 !w-3 !h-3" />
      
      <div className="p-4">
        {/* Header */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-white/50" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/50" />
          )}
          <Icon className="w-4 h-4 text-blue-400" />
          <h4 className="font-medium text-white text-sm flex-1">{data.title}</h4>
          
          {/* Status indicator */}
          {data.status === 'complete' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {data.status === 'partial' && <AlertCircle className="w-4 h-4 text-amber-400" />}
        </div>
        
        <p className="text-xs text-white/50 mt-1 ml-6">{data.subtitle}</p>
        
        {/* Values Grid */}
        {data.values && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {data.values.map((v, i) => (
              <div key={i} className="p-2 bg-white/5 rounded-lg">
                <p className="text-[10px] text-white/40 uppercase">{v.label}</p>
                <p className="text-sm font-bold text-white mt-0.5">{v.value}</p>
                {v.change !== undefined && (
                  <p className={clsx(
                    'text-[10px] font-medium',
                    v.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {v.change >= 0 ? '+' : ''}{v.change}%
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Expanded Content - Formula & Inputs */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {data.formula && (
                <div className="mt-3 p-2 bg-white/5 rounded-lg">
                  <p className="text-[10px] text-white/40 uppercase mb-1">Formula</p>
                  <code className="text-xs text-blue-300 font-mono">{data.formula}</code>
                </div>
              )}
              
              <div className="mt-2 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded text-xs text-blue-300 transition">
                  <Upload className="w-3 h-3" />
                  API
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded text-xs text-emerald-300 transition">
                  <FileSpreadsheet className="w-3 h-3" />
                  Excel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
})

const OutputMetricNode = memo(function OutputMetricNode({ data }: NodeProps<DataNodeData>) {
  const [isExpanded, setIsExpanded] = useState(data.expanded ?? true)
  const Icon = data.icon
  
  return (
    <div className={clsx(
      'min-w-[260px] max-w-[300px] rounded-xl backdrop-blur-lg transition-all',
      'bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-2 border-emerald-500/40',
      'hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/20'
    )}>
      <Handle type="target" position={Position.Left} className="!bg-emerald-400 !border-emerald-300 !w-3 !h-3" />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
              <Icon className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{data.title}</h4>
              <p className="text-xs text-white/50">{data.subtitle}</p>
            </div>
          </div>
          
          {data.correlation !== undefined && (
            <div className={clsx(
              'px-2 py-1 rounded-full text-xs font-bold',
              data.correlation >= 0.9 ? 'bg-emerald-500/30 text-emerald-300' :
              data.correlation >= 0.5 ? 'bg-amber-500/30 text-amber-300' :
              'bg-red-500/30 text-red-300'
            )}>
              {data.correlation.toFixed(3)}
            </div>
          )}
        </div>
        
        {/* Values */}
        {data.values && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {data.values.map((v, i) => (
              <div key={i} className="text-center p-2 bg-white/5 rounded-lg">
                <p className="text-[10px] text-white/40">{v.label}</p>
                <p className="text-lg font-bold text-white">{v.value}</p>
                {v.change !== undefined && (
                  <p className={clsx(
                    'text-xs font-medium',
                    v.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {v.change >= 0 ? '↑' : '↓'} {Math.abs(v.change)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Formula breakdown */}
        {isExpanded && data.formula && (
          <div className="mt-3 p-3 bg-black/20 rounded-lg">
            <code className="text-xs text-emerald-300 font-mono block">{data.formula}</code>
          </div>
        )}
      </div>
    </div>
  )
})

const CorrelationEdgeLabel = ({ correlation }: { correlation: number }) => (
  <div className={clsx(
    'px-2 py-0.5 rounded-full text-xs font-bold shadow-lg',
    correlation >= 0.9 ? 'bg-emerald-500 text-white' :
    correlation >= 0.5 ? 'bg-amber-500 text-white' :
    correlation >= 0 ? 'bg-blue-500 text-white' :
    'bg-red-500 text-white'
  )}>
    {correlation.toFixed(3)}
  </div>
)

// Node types for ReactFlow
const nodeTypes: NodeTypes = {
  project: ProjectNode,
  input: InputMetricNode,
  output: OutputMetricNode,
}

// ============================================
// Main Component
// ============================================

interface DataInjectionFlowProps {
  registry: RegistryType
  blockId?: string
  netCorc?: number
  grossRemoval?: number
  projectEmissions?: number
  leakage?: number
  buffer?: number
  className?: string
}

export function DataInjectionFlow({
  registry,
  blockId,
  netCorc = 969,
  grossRemoval = 1200,
  projectEmissions = 50,
  leakage = 60,
  buffer = 121,
  className,
}: DataInjectionFlowProps) {
  // Generate nodes based on the data injection structure
  const nodes: Node<DataNodeData>[] = useMemo(() => [
    // Project Activities (Left Column)
    {
      id: 'project-lca',
      type: 'project',
      position: { x: 0, y: 0 },
      data: {
        nodeType: 'project',
        title: 'Life Cycle Assessment',
        subtitle: 'LCA Data Collection',
        icon: FlaskConical,
        status: 'complete',
        progress: 100,
      },
    },
    {
      id: 'project-emissions',
      type: 'project',
      position: { x: 0, y: 130 },
      data: {
        nodeType: 'project',
        title: 'Project Emissions',
        subtitle: 'Scope 1, 2, 3',
        icon: Factory,
        status: 'complete',
        progress: 100,
      },
    },
    {
      id: 'project-removal',
      type: 'project',
      position: { x: 0, y: 260 },
      data: {
        nodeType: 'project',
        title: 'Removal Data',
        subtitle: 'Sensor & Lab Data',
        icon: Database,
        status: 'partial',
        progress: 78,
      },
    },
    {
      id: 'project-ghg',
      type: 'project',
      position: { x: 0, y: 390 },
      data: {
        nodeType: 'project',
        title: 'GHG Statements',
        subtitle: 'Declarations',
        icon: FileText,
        status: 'complete',
        progress: 100,
      },
    },
    
    // Input Metrics (Middle Column)
    {
      id: 'metric-gross',
      type: 'input',
      position: { x: 350, y: 0 },
      data: {
        nodeType: 'input',
        title: 'Gross Removal',
        subtitle: 'Metric (Input) • Sum',
        icon: TrendingUp,
        status: 'complete',
        values: [
          { label: '7 days', value: grossRemoval.toLocaleString(), change: 0.87 },
          { label: '6 weeks', value: (grossRemoval * 6.2).toLocaleString(), change: 2.71 },
          { label: '12 months', value: (grossRemoval * 175).toLocaleString(), change: 38.26 },
        ],
        formula: 'sensor_readings.sum() + lab_analysis',
        expanded: false,
      },
    },
    {
      id: 'metric-emissions',
      type: 'input',
      position: { x: 350, y: 170 },
      data: {
        nodeType: 'input',
        title: 'Total Emissions',
        subtitle: 'Metric (Input) • Sum',
        icon: Factory,
        status: 'complete',
        values: [
          { label: '7 days', value: projectEmissions.toLocaleString(), change: 1.04 },
          { label: '6 weeks', value: (projectEmissions * 6.2).toLocaleString(), change: 1.44 },
          { label: '12 months', value: (projectEmissions * 175).toLocaleString(), change: 39.7 },
        ],
        formula: 'scope_1 + scope_2 + scope_3',
        expanded: false,
      },
    },
    {
      id: 'metric-leakage',
      type: 'input',
      position: { x: 350, y: 340 },
      data: {
        nodeType: 'input',
        title: 'Leakage Deduction',
        subtitle: 'Metric (Calculated) • 5%',
        icon: AlertCircle,
        status: 'complete',
        values: [
          { label: 'Factor', value: '5%' },
          { label: 'Amount', value: leakage.toLocaleString() },
          { label: 'YTD', value: (leakage * 175).toLocaleString(), change: -56.99 },
        ],
        formula: 'gross_removal × leakage_factor',
        expanded: false,
      },
    },
    {
      id: 'metric-buffer',
      type: 'input',
      position: { x: 350, y: 510 },
      data: {
        nodeType: 'input',
        title: 'Buffer Pool',
        subtitle: 'Metric (Calculated) • 15%',
        icon: Shield,
        status: 'complete',
        values: [
          { label: 'Rate', value: '15%' },
          { label: 'Amount', value: buffer.toLocaleString() },
          { label: 'YTD', value: (buffer * 175).toLocaleString(), change: 33.18 },
        ],
        formula: '(gross_removal - leakage) × buffer_rate',
        expanded: false,
      },
    },
    
    // Output Metrics (Right Column)
    {
      id: 'output-netcorc',
      type: 'output',
      position: { x: 720, y: 100 },
      data: {
        nodeType: 'output',
        title: 'Net CORC',
        subtitle: 'Metric (KPI) • Final',
        icon: Leaf,
        status: 'complete',
        correlation: 0.999,
        values: [
          { label: '7 days', value: netCorc.toLocaleString(), unit: 'tCO₂e', change: 0.59 },
          { label: '6 weeks', value: (netCorc * 6.2).toLocaleString(), change: 3.14 },
          { label: '12 months', value: (netCorc * 175).toLocaleString(), change: 35.85 },
        ],
        formula: `${grossRemoval} - ${projectEmissions} - ${leakage} - ${buffer} = ${netCorc}`,
        expanded: true,
      },
    },
    {
      id: 'output-verification',
      type: 'output',
      position: { x: 720, y: 350 },
      data: {
        nodeType: 'output',
        title: 'Verification Score',
        subtitle: 'Metric (KPI) • Average',
        icon: CheckCircle,
        status: 'complete',
        correlation: 0.998,
        values: [
          { label: 'Score', value: '92%' },
          { label: 'Categories', value: '7/7' },
          { label: 'Issues', value: '0', change: 0 },
        ],
        expanded: false,
      },
    },
  ], [grossRemoval, projectEmissions, leakage, buffer, netCorc])
  
  // Generate edges with correlations
  const edges: Edge[] = useMemo(() => [
    // Project to Metrics
    { id: 'e-lca-gross', source: 'project-lca', target: 'metric-gross', type: 'default', animated: true, style: { stroke: 'rgba(52, 211, 153, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e-emissions-total', source: 'project-emissions', target: 'metric-emissions', type: 'default', animated: true, style: { stroke: 'rgba(52, 211, 153, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e-removal-gross', source: 'project-removal', target: 'metric-gross', type: 'default', animated: true, style: { stroke: 'rgba(251, 191, 36, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e-ghg-leakage', source: 'project-ghg', target: 'metric-leakage', type: 'default', animated: true, style: { stroke: 'rgba(52, 211, 153, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e-ghg-buffer', source: 'project-ghg', target: 'metric-buffer', type: 'default', animated: true, style: { stroke: 'rgba(52, 211, 153, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' } },
    
    // Metrics to Output
    { id: 'e-gross-net', source: 'metric-gross', target: 'output-netcorc', type: 'default', animated: false, label: '0.998', labelBgStyle: { fill: 'rgba(16, 185, 129, 0.9)' }, labelStyle: { fill: 'white', fontWeight: 700, fontSize: 10 }, style: { stroke: 'rgba(16, 185, 129, 0.6)', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e-emissions-net', source: 'metric-emissions', target: 'output-netcorc', type: 'default', animated: false, label: '-0.644', labelBgStyle: { fill: 'rgba(239, 68, 68, 0.9)' }, labelStyle: { fill: 'white', fontWeight: 700, fontSize: 10 }, style: { stroke: 'rgba(239, 68, 68, 0.6)', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e-leakage-net', source: 'metric-leakage', target: 'output-netcorc', type: 'default', animated: false, label: '0.999', labelBgStyle: { fill: 'rgba(16, 185, 129, 0.9)' }, labelStyle: { fill: 'white', fontWeight: 700, fontSize: 10 }, style: { stroke: 'rgba(16, 185, 129, 0.6)', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e-buffer-net', source: 'metric-buffer', target: 'output-netcorc', type: 'default', animated: false, label: '0.998', labelBgStyle: { fill: 'rgba(16, 185, 129, 0.9)' }, labelStyle: { fill: 'white', fontWeight: 700, fontSize: 10 }, style: { stroke: 'rgba(16, 185, 129, 0.6)', strokeWidth: 2, strokeDasharray: '5,5' } },
    { id: 'e-gross-verif', source: 'metric-gross', target: 'output-verification', type: 'default', animated: false, label: '0.388', labelBgStyle: { fill: 'rgba(251, 191, 36, 0.9)' }, labelStyle: { fill: 'white', fontWeight: 700, fontSize: 10 }, style: { stroke: 'rgba(251, 191, 36, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' } },
  ], [])
  
  const [flowNodes, , onNodesChange] = useNodesState(nodes)
  const [flowEdges, , onEdgesChange] = useEdgesState(edges)
  
  return (
    <GlassCard className={clsx('overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-green-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Data Injection Flow</h3>
            <p className="text-xs text-white/50">
              {registry.charAt(0).toUpperCase() + registry.slice(1)} Protocol • Block {blockId || 'Current'}
            </p>
          </div>
        </div>
        
        {/* Net CORC Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-white/50">Net CORC</p>
            <p className="text-xl font-bold text-emerald-400">{netCorc.toLocaleString()} <span className="text-sm text-white/50">tCO₂e</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>
      
      {/* Flow Diagram */}
      <div className="h-[600px]">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.4}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(255, 255, 255, 0.05)"
          />
          <Controls className="!bg-white/10 !border-white/20 !rounded-lg [&>button]:!bg-transparent [&>button]:!border-white/10 [&>button]:!text-white/70 [&>button:hover]:!bg-white/10" />
        </ReactFlow>
      </div>
    </GlassCard>
  )
}

export default DataInjectionFlow

